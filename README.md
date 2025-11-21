# PG Dashboard

본 프로젝트는 Material Tailwind React Dashboard 템플릿을 기반으로 구축한 PG(결제) 가맹점/거래 관리 대시보드입니다.  
실제 API 데이터를 활용한 위젯, 테이블, 페이지네이션, 차트 등을 커스터마이징하여 사용합니다.

---

## 프로젝트 구조

```
pg-dashboard/
├─ src/
│  ├─ apis/                 # API 호출 함수
│  │  ├─ fetchMerchantAllDetail.ts # 가맹점 전체 상세 api
│  │  ├─ fetchMerchantDetail.ts # 가맹점 단일 상세 api
│  │  └─ fetchPayments.ts   # 거래 내역 전체 조회 api
│  ├─ components/           # 공용 컴포넌트
│  │  ├─ BackButton.tsx     # 뒤로가기 컴포넌트
│  │  ├─ GenericTable.tsx   # 공용 테이블 컴포넌트
│  │  ├─ Loader.tsx         # 로딩 표시 컴포넌트
│  │  └─ Pagination.tsx     # 페이지네이션 컴포넌트
│  ├─ context/              
│  │  └─ index.tsx          # Material Tailwind 컨트롤러
│  ├─ pages/                
│  │  ├─ dashboard/         
│  │  │  ├─ home.tsx        # 대시보드 페이지
│  │  │  ├─ Merchants.tsx   # 가맹점 목록 페이지
│  │  │  ├─ Merchant.tsx    # 가맹점 상세 페이지
│  │  │  └─ payments.tsx    # 거래 내역 페이지
│  ├─ stores/               # Zustand 상태 관리
│  │  ├─ paymentsStore.tsx   
│  │  └─ merchantStore.ts
│  ├─ types/                # 타입 정의
│  │  ├─ env.d.ts
│  │  ├─ merchant.d.ts
│  │  ├─ payments.d.ts
│  │  └─ ui.ts
│  ├─ utils/                
│  │  └─ getPageName.ts
│  └─ widgets/              # 카드/차트 컴포넌트
│     ├─ layout/
│     ├─ cards/
│     └─ charts/
├─ public/
│  └─ favicon.ico
├─ package.json
└─ vite.config.ts
```

---

## 사용된 템플릿

- **템플릿 이름:** Material Tailwind React Dashboard  
- **출처:** [Creative Tim](https://www.creative-tim.com/product/material-tailwind-dashboard-react)  
- **사용 부분:**  
  - 사이드바 및 레이아웃 구조  
  - 카드 기본 스타일  
- **커스터마이징:**  
  - 파비콘 설정
  - **브레드크럼(Breadcrumb)**  
    URL 경로에 따라 사이드바 메뉴명을 한글로 표시하도록 수정
  - **페이지네이션 컴포넌트**  
    공용 페이지네이션 컴포넌트 생성 및 전체 데이터 기준 정렬 지원
  - **로더(Loader) 컴포넌트**  
    API 호출 시 로딩 표시
  - **API 데이터 기반 위젯/카드/테이블 구조**  
    실제 API 구조에 맞게 위젯 및 카드 컴포넌트 재구성
  - **뒤로가기 버튼 컴포넌트**  
    이전 페이지 이동 기능 제공
  - **공용 테이블(GenericTable) 컴포넌트**  
    정렬, 렌더링 커스터마이징, 페이지네이션 지원

---

## 실행 방법

1. 프로젝트 클론

```bash
git clone <repo-url>
cd pg-dashboard
```

2. 패키지 설치

```bash
npm install
```

3. .env 파일 생성 및 환경 변수 설정

```bash
VITE_API_BASE_URL=https://recruit.paysbypays.com/api/v1
```

4. 개발 서버 실행

```bash
npm run dev
```


