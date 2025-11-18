import axios from "axios";
import { PaymentResponse } from "@/types/payments.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 거래 내역 조회
export const fetchPayments = async (): Promise<PaymentResponse> => {
  try {
    const response = await axios.get<PaymentResponse>(`${API_BASE_URL}/payments/list`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("결제 내역 조회 실패:", error);
    throw error;
  }
};