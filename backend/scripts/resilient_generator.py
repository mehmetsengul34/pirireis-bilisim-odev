import sys
import asyncio
import time
sys.path.insert(0, r"C:\Users\Mehmet\Desktop\Projeler\pirireis-bilisim-odev\backend")

from app.database import SessionLocal
from app.services.ai_agent_service import HighVolumeDailySynthesizerAgent

async def run_loop():
    print("[Resilient Generator] Otonom Soru Uretimi Baslatildi.")
    while True:
        db = SessionLocal()
        try:
            res = await HighVolumeDailySynthesizerAgent.run_daily_batch(
                db=db,
                exam_type=None,
                target_count=100
            )
            print("[Resilient Generator] Batch sonucu:", res.get("status"), res.get("questions_created"))
            break
        except Exception as err:
            print("[Resilient Generator] Gecici hata, 5 saniye sonra tekrar denenecek:", err)
            try:
                db.rollback()
            except Exception:
                pass
            await asyncio.sleep(5)
        finally:
            db.close()

if __name__ == "__main__":
    asyncio.run(run_loop())
