from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ReviewRequest(BaseModel):
    id: int
    content: str

@app.get("/")
def home():
    return {"message": "Connect Success!"}

@app.post("/ai/analyze")
async def analyze_reviews(reviews: List[ReviewRequest]):

    return {
        "status": "success",
        "processed_count": len(reviews),
        "data": reviews
    }