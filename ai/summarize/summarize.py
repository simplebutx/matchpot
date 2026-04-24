# ai/summarize/summarize.py

import re

try:
    from textrankr import TextRank
except ModuleNotFoundError:
    TextRank = None


class MyTokenizer:
    def __call__(self, text: str) -> list[str]:
        return text.split()


def _fallback_summary(cleaned_text: str) -> list[str]:
    sentences = [sentence.strip() for sentence in cleaned_text.split(".") if sentence.strip()]
    return sentences[:2]


def analyze_summarize_logic(allText):
    cleaned_text = re.sub(r"[^가-힣a-zA-Z0-9\s.]", "", allText or "")

    summary_list = []
    if TextRank is not None:
        try:
            my_tokenizer = MyTokenizer()
            tr = TextRank(my_tokenizer)
            summary_list = tr.summarize(cleaned_text, num_sentences=2)
        except Exception:
            summary_list = _fallback_summary(cleaned_text)
    else:
        summary_list = _fallback_summary(cleaned_text)

    summary = " ".join(summary_list) if summary_list else "리뷰 내용을 분석 중입니다."

    words = cleaned_text.split()
    keywords = [word for word in dict.fromkeys(words) if len(word) > 1][:5]

    return {"summary": summary, "keywords": keywords}
