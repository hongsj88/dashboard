from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import json
import os
import logging
import sys

# 로깅 설정을 더 자세하게 구성
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# 현재 환경 정보 로깅
logger.debug(f"Current working directory: {os.getcwd()}")
logger.debug(f"Directory contents: {os.listdir('.')}")
logger.debug(f"Environment variables: {dict(os.environ)}")

app = FastAPI(debug=True)

# 기본 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
logger.debug(f"Base directory: {BASE_DIR}")

# 정적 파일 및 템플릿 설정
static_dir = os.path.join(BASE_DIR, "static")
templates_dir = os.path.join(BASE_DIR, "templates")
logger.debug(f"Static directory: {static_dir}")
logger.debug(f"Templates directory: {templates_dir}")

# 디렉토리 존재 확인 및 생성
os.makedirs(static_dir, exist_ok=True)
os.makedirs(templates_dir, exist_ok=True)

# 정적 파일 설정
app.mount("/static", StaticFiles(directory=static_dir), name="static")
templates = Jinja2Templates(directory=templates_dir)

# 디버그용 경로
@app.get("/debug")
async def debug_info():
    return {
        "cwd": os.getcwd(),
        "base_dir": BASE_DIR,
        "static_dir": static_dir,
        "templates_dir": templates_dir,
        "static_exists": os.path.exists(static_dir),
        "templates_exists": os.path.exists(templates_dir),
        "static_contents": os.listdir(static_dir) if os.path.exists(static_dir) else [],
        "templates_contents": os.listdir(templates_dir) if os.path.exists(templates_dir) else []
    }

@app.get("/")
async def home(request: Request):
    logger.debug("Handling home request")
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        logger.error(f"Error rendering template: {e}", exc_info=True)
        return JSONResponse(
            content={"error": str(e), "type": str(type(e))},
            status_code=500
        )

@app.get("/api/data")
async def get_data():
    try:
        json_path = os.path.join(static_dir, 'final_data.json')
        logger.debug(f"Attempting to read JSON from: {json_path}")
        
        if not os.path.exists(json_path):
            logger.error(f"JSON file not found at: {json_path}")
            return JSONResponse(content={"error": "Data file not found"}, status_code=404)
            
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return JSONResponse(content=data)
    except Exception as e:
        logger.error(f"Error reading JSON data: {e}", exc_info=True)
        return JSONResponse(
            content={"error": str(e), "type": str(type(e))},
            status_code=500
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 