from typing import List

from fastapi import FastAPI
from pydantic import BaseModel

from sentiment.ml_service import analyze_sentiment_reviews

app = FastAPI()


class ReviewRequest(BaseModel):
    eventId: int
    reviewId: int
    content: str


@app.get("/")
def home():
    return {"message": "Connect Success!"}


@app.post("/internal/reviews/analyze")
async def analyze_reviews(reviews: List[ReviewRequest]):
    analyzed_event = analyze_sentiment_reviews([review.model_dump() for review in reviews])
    return {"data": analyzed_event}
