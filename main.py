from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import json
import os
import logging

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)

# 현재 파일의 디렉토리 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
logger.debug(f"Base directory: {BASE_DIR}")

# 정적 파일 및 템플릿 설정
static_dir = os.path.join(BASE_DIR, "static")
templates_dir = os.path.join(BASE_DIR, "templates")
logger.debug(f"Static directory: {static_dir}")
logger.debug(f"Templates directory: {templates_dir}")

# 정적 파일 마운트 전에 디렉토리 존재 여부 확인
if not os.path.exists(static_dir):
    logger.warning(f"Static directory does not exist: {static_dir}")
    os.makedirs(static_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory=templates_dir)

# JSON 데이터 로드
json_path = os.path.join(static_dir, 'final_data.json')  # static 디렉토리 내의 JSON 파일
logger.debug(f"JSON file path: {json_path}")

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    logger.debug("JSON data loaded successfully")
except Exception as e:
    logger.error(f"Error loading JSON data: {e}")
    data = {}

@app.get("/")
async def home(request: Request):
    logger.debug("Rendering home page")
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/data")
async def get_data():
    logger.debug("Sending JSON data")
    return JSONResponse(content=data)

if __name__ == "__main__":
    import uvicorn
    # Azure Web App은 PORT 환경 변수를 통해 포트를 지정합니다
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 