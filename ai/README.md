# AI Service

FastAPI 기반 리뷰 감정분석 서버입니다.

현재 기능:
- 리뷰 텍스트 전처리
- `positive / neutral / negative` 3분류 감정분석
- Spring 서버에서 내부 API로 호출

## 개발 환경

- Python `3.11`
- Windows 기준 실행 확인

`torch` 호환성 때문에 Python `3.14`가 아니라 `3.11` 사용을 권장합니다.

## 필수 준비

1. Python 3.11 설치
2. Microsoft Visual C++ Redistributable 설치

VC++가 없으면 Windows에서 `torch` import 시 DLL 오류가 날 수 있습니다.

다운로드:
- Python 3.11: [https://www.python.org/downloads/release/python-3119/](https://www.python.org/downloads/release/python-3119/)
- VC++ Redistributable x64: [https://aka.ms/vs/17/release/vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe)

## 최초 실행 방법

`ai` 폴더에서 아래 순서대로 실행합니다.

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 서버 확인

브라우저에서 아래 주소 확인:

- [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

정상 응답:

```json
{"message":"Connect Success!"}
```

## Spring 연동

Spring 서버가 아래 주소로 AI 서버를 호출합니다.

```text
POST http://127.0.0.1:8000/internal/reviews/analyze
```

리뷰 분석 요청 예시:

```json
[
  {
    "eventId": 10,
    "reviewId": 101,
    "content": "행사가 정말 좋았어요"
  }
]
```

응답 예시:

```json
{
  "data": [
    {
      "eventId": 10,
      "reviewId": 101,
      "content": "행사가 정말 좋았어요",
      "sentiment": "positive",
      "score": 0.9231,
      "scores": {
        "negative": 0.0211,
        "neutral": 0.0558,
        "positive": 0.9231
      }
    }
  ]
}
```

## 파일 구조

- `main.py`: FastAPI 엔드포인트
- `preprocessing_service.py`: 리뷰 전처리
- `ml_service.py`: 모델 로드 및 감정분석

## 자주 발생하는 문제

### 1. `Connection refused`

Python AI 서버가 아직 안 떠 있는 경우입니다.

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. `WinError 1114` 또는 `c10.dll` 오류

대부분 Python 버전 또는 VC++ 런타임 문제입니다.

- Python `3.11` 사용
- VC++ Redistributable x64 설치

### 3. `sentencepiece` / `protobuf` 관련 오류

`requirements.txt`로 다시 설치하면 해결됩니다.

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 4. Hugging Face 경고

아래 경고는 현재 개발 단계에서는 치명적이지 않습니다.

- `HF_TOKEN` 경고
- symlink 경고

모델 다운로드 및 추론이 정상 동작하면 우선 무시해도 됩니다.
