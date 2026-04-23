# ai/summarize/summarize.py

from textrankr import TextRank
import re

class MyTokenizer:
    def __call__(self, text: str) -> list[str]:
        # 🌟 konlpy 없이 띄어쓰기 단위로 단어를 쪼개도록 수정!
        return text.split() 

def analyze_summarize_logic(allText):
    # 🌟 1. 마침표(.)는 남겨둬야 TextRank가 문장을 구분합니다!
    cleaned_text = re.sub(r'[^가-힣0-9\s.]', '', allText)
    
    my_tokenizer = MyTokenizer()
    tr = TextRank(my_tokenizer)
    
    # 🌟 2. num_sentences를 1에서 2로 늘려보세요. 훨씬 풍성해집니다.
    summary_list = tr.summarize(cleaned_text, num_sentences=2)
    
    # 🌟 3. 결과가 리스트니까, 문장들을 합쳐서 하나의 문자열로 만듭니다.
    summary = " ".join(summary_list) if summary_list else "리뷰 내용을 분석 중입니다."
    
    # 키워드 추출 (기존 코드 유지)
    words = cleaned_text.split()
    keywords = [w for w in set(words) if len(w) > 1][:5]

    return {"summary": summary, "keywords": keywords}