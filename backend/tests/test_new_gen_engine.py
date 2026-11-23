# -*- coding: utf-8 -*-
"""
Yeni nesil soru motoru testleri. Gerçek Gemini'ye bağlanmaz; sahte bir HTTP katmanı kullanır.
Çalıştırma (backend klasöründe):  python -m pytest tests -q
"""
import asyncio
import json
import os
import sys

import httpx
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services import new_gen_engine as eng  # noqa: E402
from app.services import ai_exam_service as svc  # noqa: E402


def _harf(n):
    """Sayıyı harf dizisine çevirir (benzerlik filtresi rakamları yok saydığı için)."""
    out = ""
    n += 1
    while n:
        n, r = divmod(n - 1, 26)
        out = "abcdefghijklmnopqrstuvwxyz"[r] + out
    return out


def good_item(i, answer="B"):
    return {
        # Her soruya özgü sözcükler: benzerlik filtresine takılmasınlar
        "baglam": " ".join(f"durum{_harf(i)}ozellik{_harf(k)}" for k in range(40)),
        "veri_tablosu": f"| Mağaza | Birim fiyat | Kargo |\n|---|---|---|\n| P | {10 + i} | 30 |\n| R | {12 + i} | 0 |",
        "onculler": None,
        "soru_koku": f"Buna göre kulüp kaç adet malzeme alırsa iki mağazada ödeyeceği tutar eşit olur? ({i})",
        "secenekler": {"A": "10", "B": "15", "C": "20", "D": "25", "E": "30"},
        "dogru_cevap": answer,
        "cozum": "Adım 1 ... Adım 2 ...",
        "celdirici_analizi": {"A": "x", "B": "doğru", "C": "y", "D": "z", "E": "w"},
        "kazanim": "TYT Matematik - Problemler",
        "bilissel_duzey": "Analiz / Muhakeme",
        "alt_konu": "Maliyet",
        "adim_sayisi": 3,
        "visual_svg": None,
    }


def gemini_response(obj):
    return httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": json.dumps(obj, ensure_ascii=False)}]}}]})


class FakeGemini:
    """Üretim ve doğrulama isteklerini ayırt edip senaryoya göre yanıt verir."""

    def __init__(self, wrong_every=0, timeout=False):
        self.counter = 0
        self.wrong_every = wrong_every
        self.timeout = timeout
        self.gen_calls = 0
        self.verify_calls = 0
        self.max_batch_seen = 0

    def __call__(self, request: httpx.Request):
        if self.timeout:
            raise httpx.ReadTimeout("timeout", request=request)
        body = json.loads(request.content)
        system = body["systemInstruction"]["parts"][0]["text"]
        user = body["contents"][0]["parts"][0]["text"]
        assert request.headers.get("x-goog-api-key") == "test-key"
        assert "key=" not in str(request.url), "API anahtarı URL'de olmamalı"
        if system.startswith("Sen deneyimli bir ölçme"):
            self.verify_calls += 1
            items = json.loads(user)
            out = []
            for it in items:
                # Soru kökündeki "(i)" numarasına göre: wrong_every'nin katları hatalı anahtarlı üretildi
                out.append({"id": it["id"], "cevap": "B", "yeni_nesil": True, "sorun": None})
            return gemini_response(out)
        self.gen_calls += 1
        import re
        n = int(re.search(r"(\d+) adet yeni nesil soru", user).group(1))
        self.max_batch_seen = max(self.max_batch_seen, n)
        items = []
        for _ in range(n):
            self.counter += 1
            ans = "C" if (self.wrong_every and self.counter % self.wrong_every == 0) else "B"
            items.append(good_item(self.counter, ans))
        return gemini_response(items)


@pytest.fixture
def patch_client(monkeypatch):
    def _apply(fake):
        real = httpx.AsyncClient

        def factory(*args, **kwargs):
            kwargs["transport"] = httpx.MockTransport(fake)
            return real(*args, **kwargs)

        monkeypatch.setattr(eng.httpx, "AsyncClient", factory)
        monkeypatch.setenv("GEMINI_MODELS", "model-a")
        return fake
    return _apply


def run(coro):
    return asyncio.run(coro)


def test_happy_path_batches_and_verifies(patch_client):
    fake = patch_client(FakeGemini())
    qs, rep = run(svc.generate_questions_smart_with_report(
        exam_type="TYT", subject="Temel Matematik", topic="Problemler",
        difficulty="ÖSYM / Yeni Nesil", question_count=10, api_key="test-key"))
    assert len(qs) == 10
    assert rep["gemini_count"] == 10 and rep["template_count"] == 0
    assert rep["verified_count"] == 10
    assert rep["warning"] is None
    assert fake.max_batch_seen <= 4, "sorular küçük partiler halinde istenmeli"
    assert fake.gen_calls == 3  # 4 + 4 + 2
    assert "| Mağaza |" in qs[0]["question_text"], "veri tablosu soru metnine eklenmeli"
    assert all(q["source"] == "gemini" for q in qs)


def test_wrong_answer_key_is_rejected_and_refilled(patch_client):
    fake = patch_client(FakeGemini(wrong_every=3))
    qs, rep = run(svc.generate_questions_smart_with_report(
        exam_type="TYT", subject="Temel Matematik", topic="Problemler",
        difficulty="ÖSYM / Yeni Nesil", question_count=6, api_key="test-key"))
    assert rep["rejected_verification"] >= 2
    assert all(q["correct_option"] == "B" for q in qs if q["source"] == "gemini")
    assert rep["gemini_count"] == 6, "ikinci tur eksikleri tamamlamalı"


def test_timeout_falls_back_to_labeled_templates(patch_client):
    patch_client(FakeGemini(timeout=True))
    qs, rep = run(svc.generate_questions_smart_with_report(
        exam_type="TYT", subject="Temel Matematik", topic="Karma",
        difficulty="ÖSYM / Yeni Nesil", question_count=3, api_key="test-key"))
    assert rep["gemini_count"] == 0
    assert rep["template_count"] == len(qs) > 0
    assert all(q["source"] == "sablon" for q in qs)
    assert rep["warning"] and "şablon" in rep["warning"]


def test_no_template_fill_when_disabled(patch_client):
    patch_client(FakeGemini(timeout=True))
    qs, rep = run(svc.generate_questions_smart_with_report(
        exam_type="TYT", subject="Temel Matematik", topic="Karma",
        difficulty="ÖSYM / Yeni Nesil", question_count=3, api_key="test-key",
        allow_template_fill=False))
    assert qs == []


def test_no_key_reports_reason(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    qs, rep = run(svc.generate_questions_smart_with_report(
        exam_type="LGS", subject="Matematik", topic="Karma",
        difficulty="ÖSYM / Yeni Nesil", question_count=2))
    assert rep["template_count"] == len(qs)
    assert "anahtar" in rep["warning"].lower()
    assert all(q["option_e"] is None for q in qs)


def test_local_quality_rejects_shallow_question():
    shallow = good_item(1)
    shallow["baglam"] = "Kısa bağlam."
    shallow["veri_tablosu"] = None
    shallow["adim_sayisi"] = 1
    issues = eng.local_quality_issues(shallow, is_lgs=False)
    assert any("bağlam" in i for i in issues)
    assert any("tek adım" in i for i in issues)
    assert eng.local_quality_issues(good_item(1), is_lgs=False) == []


def test_lgs_requires_four_options_only():
    item = good_item(1)
    item["secenekler"].pop("E")
    assert eng.local_quality_issues(item, is_lgs=True) == []
    q = eng.to_legacy_schema(item, is_lgs=True, topic="X")
    assert q["option_e"] is None


def test_extract_question_blocks_from_pdf_text():
    text = (
        "TÜRKÇE TESTİ\n"
        "1. Kısa soru? A) a B) b\n"
        "2. Bir okulda yapılan ankette öğrencilere en sevdikleri etkinlik sorulmuş ve sonuçlar tabloda "
        "gösterilmiştir. Tabloya göre öğrencilerin yarısından fazlası spor etkinliklerini seçmiştir. "
        "Ankete katılan öğrencilerin sayısı 120'dir ve her öğrenci yalnızca bir etkinlik seçmiştir. "
        "I. Spor II. Müzik III. Resim\nBuna göre aşağıdakilerden hangisi kesinlikle doğrudur?\n"
        "A) birinci B) ikinci C) üçüncü D) dördüncü\n"
        "3. Başka bir kısa soru? A) x B) y\n"
    )
    blocks = eng.extract_question_blocks(text)
    assert len(blocks) == 1
    assert blocks[0].startswith("2.")


def test_examples_match_branch():
    from app.services.new_gen_examples import pick_examples, NEW_GEN_EXAMPLES
    for e in NEW_GEN_EXAMPLES:
        assert eng.local_quality_issues(e["ornek"], is_lgs=(e["seviye"] == "LGS")) == [], e["ornek"]["alt_konu"]
    lgs_verbal = pick_examples("LGS", verbal=True)
    assert lgs_verbal and lgs_verbal[0]["alt_konu"] == "Tablo ve Grafik Okuma"
    assert len(pick_examples("TYT", verbal=False)) == 2
