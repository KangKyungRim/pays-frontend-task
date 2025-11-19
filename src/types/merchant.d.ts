export interface MerchantDetail {
  mchtCode: string;       // 가맹점 코드
  mchtName: string;       // 가맹점 이름
  status: "READY" | "ACTIVE" | "INACTIVE" | "CLOSED"; // 대기, 활성, 증지, 폐기
  bizType: string;        // 업종 유형 (예: EDU)
  bizNo: string;          // 사업자 등록번호
  address: string;        // 주소
  phone: string;          // 전화번호
  email: string;          // 이메일
  registeredAt: string;   // 등록일 (ISO 문자열)
  updatedAt: string;      // 수정일 (ISO 문자열)
}

// 가맹점 상세
export interface MerchantDetailResponse {
  status: number;     
  message: string;     
  data: MerchantDetail;   
}

// 가맹점 전체 상세
export interface MerchantListResponse {
  status: number;
  message: string;
  data: MerchantDetail[];
}