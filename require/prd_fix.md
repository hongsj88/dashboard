# **자살률 통계 대시보드 PRD (Product Requirements Document)**

## 1. 프로젝트 개요
- 자살률/자살자수 통계 데이터를 시각화하는 인터랙티브 대시보드
- 데이터 기반의 동적 차트 시스템
- 사용자 친화적인 UI/UX 디자인
- 반응형 웹 디자인 지원

## 2. 기술 스택
- Backend: Python FastAPI
- Frontend: 
  - Highcharts (데이터 시각화)
  - TailwindCSS (스타일링)
  - Vanilla JavaScript (인터랙션)
- 폰트: Noto Sans KR
- 데이터: JSON 형식

## 3. 디자인 시스템
### 3.1 시각적 요소
- 색상 팔레트:
  - 주요 색상: 파란색 계열 (#2563eb, #1d4ed8)
  - 보조 색상: 분홍색 (#FF69B4)
  - 배경: 그라데이션 (#f5f7fa → #e4e8ec)
  - 텍스트: 슬레이트 컬러 (#1e293b, #64748b)

### 3.2 타이포그래피
- 제목: 24px (2xl), 700 weight
- 부제목: 20px (xl), 600 weight
- 본문: 16px, 400 weight
- 버튼/선택상자: 15px, 500 weight

### 3.3 컴포넌트
- 글래스모피즘 카드 디자인
- 커스텀 셀렉트 박스
- 그라데이션 버튼
- 인터랙티브 차트

## 4. 주요 기능

### 4.1 전역 설정
- 데이터 유형 선택 (자살자수/자살률)
  - 모든 섹션에 동시 적용
  - 상단 중앙 배치
  - 글래스모피즘 스타일의 선택상자

### 4.2 섹션 1: 지역별 추이 (2019-2023)
- 기능:
  - 2023년 기준 상위 5개 지역 자동 활성화
  - 나머지 지역은 범례 클릭으로 토글 가능
  - 자살자수/자살률 전환 버튼
- 차트 특성:
  - 라인 차트
  - 인터랙티브 범례
  - 동적 데이터 업데이트
  - 호버 시 상세 정보 표시

### 4.3 섹션 2: 연령별 추이
- 기능:
  - 지역 선택 기능
  - 3개의 서브 차트 (전체/남성/여성)
  - 연령대별 구분 (15세 미만, 15-64세, 65세 이상, 80세 이상)
- 차트 특성:
  - 라인 차트
  - 반응형 그리드 레이아웃
  - 토글 가능한 범례
  - 연도별 추이 표시

### 4.4 섹션 3: 성별 연령구간별 분포
- 기능:
  - 지역 및 연도 선택
  - 성별 구분 (남성/여성)
  - 5세 단위 연령 구간
- 차트 특성:
  - 피라미드형 바 차트
  - 남성: 파란색 (#4169E1)
  - 여성: 분홍색 (#FF69B4)
  - 연령대 역순 정렬 (어린 연령대가 하단에 위치)

## 5. 인터랙션 디테일
- 호버 효과:
  - 카드 엘리먼트 부드러운 상승
  - 그림자 깊이 증가
  - 버튼 색상 변화
- 선택 상자:
  - 커스텀 드롭다운 화살표
  - 포커스 시 테두리 강조
- 차트:
  - 호버 시 툴팁 표시
  - 클릭 가능한 범례
  - 부드러운 데이터 전환 애니메이션

## 6. 파일 구조
```
dashboard/
├── main.py              # FastAPI 백엔드
├── requirements.txt     # 프로젝트 의존성
├── README.md           # 프로젝트 문서
├── final_data.json     # 데이터 파일
├── static/
│   ├── css/
│   │   └── style.css   # 추가 스타일
│   └── js/
│       └── charts.js   # 차트 로직
├── templates/
│   └── index.html      # 메인 템플릿
└── require/
    ├── prd.md          # 원본 요구사항
    └── prd_fix.md      # 구현 완료된 요구사항
```

## 7. 성능 최적화
- 데이터 캐싱
- 최적화된 차트 렌더링
- 지연 로딩 구현
- 반응형 디자인 최적화

## 8. 접근성
- WCAG 2.1 가이드라인 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 충분한 색상 대비

## 9. 브라우저 지원
- 모던 브라우저 지원 (Chrome, Firefox, Safari, Edge)
- 반응형 디자인으로 모바일 지원

## 10. 향후 개선사항
- 데이터 다운로드 기능
- 차트 이미지 저장 기능
- 다크 모드 지원
- 다국어 지원 준비 