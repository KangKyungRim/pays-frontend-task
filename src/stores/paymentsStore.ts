import { create } from "zustand";
import { PaymentItem, PaymentResponse } from "@/types/payments";
import { fetchPayments } from "@/apis/fetchPayments";

// 거래 내역 전체 조회 스토어
interface PaymentsStore {
  payments: PaymentItem[];
  loading: boolean;
  error: string | null;
  fetchPaymentsData: () => Promise<void>;
}

export const usePaymentsStore = create<PaymentsStore>((set) => ({
  payments: [],
  loading: false,
  error: null,

  fetchPaymentsData: async () => {
    try {
      set({ loading: true, error: null });
      const res: PaymentResponse = await fetchPayments();
      set({ payments: res.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "거래내역 조회 실패" });
    }
  },
}));