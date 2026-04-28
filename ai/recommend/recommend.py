from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

def run_recommendation_logic(user_history, all_events):
    if not user_history or not all_events:
        return {"recommended_ids": []}

    # 1. 🌟 [강력 필터] 이미 예약한 행사 제외
    filtered_events = [e for e in all_events if e['title'] not in user_history]
    
    if not filtered_events:
        return {"recommended_ids": []}

    # 2. 🌟 [불용어 제거] '미리보기', '활용', '비법' 같은 뻥튀기 단어 무시하기
    # TfidfVectorizer에 stop_words를 직접 넣는 게 제일 빠릅니다.
    my_stop_words = ['미리보기', '활용', '비법', '2026', '트렌드', '전망', '가이드']
    
    event_titles = [e['title'] for e in filtered_events]
    corpus = [user_history] + event_titles

    # 3. TF-IDF 계산 (단어 최소 길이를 2글자로 제한해서 '과', '의' 같은 조사 방어)
    vectorizer = TfidfVectorizer(stop_words=my_stop_words, token_pattern=r"(?u)\b\w\w+\b")
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # 4. 🌟 [정렬 및 추출] 
    # 패션 트렌드가 2위로 올라오는 걸 막으려면 유사도 점수가 0인 건 아예 빼버려야 합니다.
    related_indices = similarities.argsort()[::-1]
    
    recommended_ids = []
    for i in related_indices:
        if similarities[i] > 0:  # 0점(관련 없음)은 과감히 버림!
            recommended_ids.append(int(filtered_events[i]['id']))
        if len(recommended_ids) >= 3: # 딱 3개만!
            break

    return {"recommended_ids": recommended_ids}