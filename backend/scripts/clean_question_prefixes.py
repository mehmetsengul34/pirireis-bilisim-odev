# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine
from sqlalchemy import text

def clean_prefixes_fast():
    print("Starting fast SQL regex cleanup...")
    with engine.begin() as conn:
        # Check current count in question_bank
        cnt_qb = conn.execute(text("SELECT count(*) FROM question_bank WHERE question_text LIKE '%Soru ID%'")).scalar()
        print(f"question_bank items with 'Soru ID': {cnt_qb}")

        cnt_eq = conn.execute(text("SELECT count(*) FROM exam_questions WHERE question_text LIKE '%Soru ID%'")).scalar()
        print(f"exam_questions items with 'Soru ID': {cnt_eq}")

        if cnt_qb > 0:
            # PostgreSQL regex replace:
            # Remove '**[MEB/OSYM Soru ID #...]** ' or '[MEB/OSYM Soru ID #...] ' or similar patterns at the start
            sql_qb = """
            UPDATE question_bank
            SET question_text = TRIM(REGEXP_REPLACE(question_text, '^\\s*(\\*{1,2})?\\[(MEB/OSYM\\s*)?Soru\\s*ID\\s*#?\\d*\\](\\*{1,2})?\\s*', '', 'i'))
            WHERE question_text LIKE '%Soru ID%';
            """
            res_qb = conn.execute(text(sql_qb))
            print(f"Updated question_bank rows.")

        if cnt_eq > 0:
            sql_eq = """
            UPDATE exam_questions
            SET question_text = TRIM(REGEXP_REPLACE(question_text, '^\\s*(\\*{1,2})?\\[(MEB/OSYM\\s*)?Soru\\s*ID\\s*#?\\d*\\](\\*{1,2})?\\s*', '', 'i'))
            WHERE question_text LIKE '%Soru ID%';
            """
            res_eq = conn.execute(text(sql_eq))
            print(f"Updated exam_questions rows.")

        # Check remaining
        cnt_qb_rem = conn.execute(text("SELECT count(*) FROM question_bank WHERE question_text LIKE '%Soru ID%'")).scalar()
        cnt_eq_rem = conn.execute(text("SELECT count(*) FROM exam_questions WHERE question_text LIKE '%Soru ID%'")).scalar()
        print(f"Remaining in question_bank: {cnt_qb_rem}")
        print(f"Remaining in exam_questions: {cnt_eq_rem}")

if __name__ == "__main__":
    clean_prefixes_fast()
