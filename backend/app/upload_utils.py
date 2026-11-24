"""Dosya yükleme yardımcıları: boyut sınırı ve güvenli dosya uzantısı."""
import os
import re

from fastapi import HTTPException, UploadFile, status

# Varsayılan üst sınır: 50 MB (MAX_UPLOAD_MB ortam değişkeni ile değiştirilebilir)
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "50"))
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
_CHUNK = 1024 * 1024


async def read_upload_limited(file: UploadFile, max_bytes: int = MAX_UPLOAD_BYTES) -> bytes:
    """Yüklenen dosyayı parça parça okur; sınırı aşarsa 413 döndürür.

    Böylece çok büyük bir dosya sunucunun belleğini doldurup çökertemez.
    """
    chunks = []
    total = 0
    while True:
        chunk = await file.read(_CHUNK)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Dosya çok büyük. En fazla {max_bytes // (1024 * 1024)} MB yükleyebilirsiniz.",
            )
        chunks.append(chunk)
    return b"".join(chunks)


def safe_extension(filename: str) -> str:
    """Dosya adından yalnızca güvenli (harf/rakam) bir uzantı çıkarır."""
    ext = os.path.splitext(filename or "")[1].lower()
    ext = re.sub(r"[^a-z0-9.]", "", ext)
    if len(ext) > 12 or ext.count(".") > 1:
        return ""
    return ext
