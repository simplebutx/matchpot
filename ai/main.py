from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from review_service import preprocess_reviews

app = FastAPI()

# DTO
class ReviewRequest(BaseModel):
    id: int
    content: str

@app.get("/")
def home():
    return {"message": "Connect Success!"}

@app.post("/internal/reviews/analyze")
async def analyze_reviews(reviews: List[ReviewRequest]):
    processed_reviews = preprocess_reviews([review.model_dump() for review in reviews])  
    # model.dump(): Pydantic객체를 dict로 변환하는 함수

    return {
        "data": processed_reviews
    }
