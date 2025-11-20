import { create } from "zustand";
import { PaymentItem, PaymentResponse } from "@/types/payments";
import { fetchPayments } from "@/apis/fetchPayments";
import { fetchMerchantDetail } from "@/apis/fetchMerchantDetail";

interface PaymentsStore {
  payments: PaymentItem[];
  merchants: Record<string, any>;
  loading: boolean;
  error: string | null;

  fetchPaymentsData: () => Promise<void>;
  fetchMerchantDetailLazy: (code: string) => Promise<void>;

  getPagedPayments: (page: number, size: number) => PaymentItem[];
  getTotalPages: (size: number) => number;

  payTypeLabels: Record<PaymentItem["payType"], string>;
  statusLabels: Record<PaymentItem["status"], string>;
}

export const usePaymentsStore = create<PaymentsStore>((set, get) => ({
  payments: [],
  merchants: {},
  loading: false,
  error: null,

  // 거래 내역 전체 조회
  fetchPaymentsData: async () => {
    try {
      set({ loading: true, error: null });
      const res: PaymentResponse = await fetchPayments();
      set({ payments: res.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "거래내역 조회 실패" });
    }
  },

  // 가맹점 상세 
  fetchMerchantDetailLazy: async (code: string) => {
    const { merchants } = get();
    if (merchants[code]) return; 

    try {
      const detail = await fetchMerchantDetail(code);
      set((state) => ({
        merchants: { ...state.merchants, [code]: detail.data },
      }));
    } catch (e) {
      console.error("merchant fetch failed:", code);
    }
  },

  // 페이지네이션
  getPagedPayments: (page: number, size: number) => {
    const reversed = [...get().payments].reverse();
    const start = (page - 1) * size;
    return reversed.slice(start, start + size);
  },

  getTotalPages: (size: number) => {
    return Math.ceil(get().payments.length / size);
  },

  // 결제 수단 라벨
  payTypeLabels: {
    ONLINE: "온라인",
    DEVICE: "단말기",
    MOBILE: "모바일",
    BILLING: "정기 결제",
    VACT: "가상계좌",
  },

  // 결제 상태 라벨
  statusLabels: {
    CANCELLED: "환불 완료",
    SUCCESS: "결제 완료",
    FAILED: "결제 실패",
    PENDING: "결제 대기",
  },
}));