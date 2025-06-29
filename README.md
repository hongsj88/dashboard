# 자살률 통계 대시보드

## 프로젝트 개요
이 프로젝트는 2019년부터 2023년까지의 자살률 통계 데이터를 시각화하는 대시보드입니다. FastAPI와 Highcharts를 사용하여 구현되었으며, 다음과 같은 주요 기능을 제공합니다:

1. 지역별 자살률/자살자 수 추이 비교
2. 연령대별 자살률/자살자 수 추이 분석
3. 성별 및 연령구간별 자살률/자살자 수 피라미드 차트

## 기술 스택
- Backend: Python FastAPI
- Frontend: Highcharts, TailwindCSS
- Template Engine: Jinja2

## 설치 방법

1. Python 가상환경 생성 및 활성화
```bash
conda create -n dashboard python=3.11
conda activate dashboard
```

2. 필요한 패키지 설치
```bash
pip install -r requirements.txt
```

## 실행 방법

1. 가상환경 활성화
```bash
conda activate dashboard
```

2. 서버 실행
```bash
uvicorn main:app --reload
```

3. 브라우저에서 접속
- http://localhost:8000 으로 접속

## 주요 기능

### 1. 지역별 2019~2023년 자살률 추이
- 2023년 기준 상위 5개 지역 자동 활성화
- 범례 클릭으로 지역 데이터 토글 가능
- 전국 데이터 제외

### 2. 연령별 자살률 추이
- 전체/남성/여성 구분하여 3개의 차트로 표시
- 연령대별 추이 비교 가능
- 범례 클릭으로 연령대 데이터 토글 가능

### 3. 성별 연령구간별 자살률
- 인구피라미드 형태로 시각화
- 남성(파란색)과 여성(분홍색) 구분
- 5세 단위 연령구간으로 표시

## 데이터 구조
- `final_data.json`: 2019-2023년 자살률/자살자 수 통계 데이터
- 지역, 성별, 연령대별 세부 데이터 포함

## 주의사항
- 자살률은 인구 10만명당 수치이므로 별도의 단위 표시 없음
- 데이터는 연도별, 지역별, 성별, 연령대별로 구분되어 있음 