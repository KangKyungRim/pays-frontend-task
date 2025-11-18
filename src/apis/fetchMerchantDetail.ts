import axios from "axios";
import { MerchantDetailResponse } from "@/types/merchant.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMerchantDetail = async (mchtCode: string): Promise<MerchantDetailResponse> => {
  try {
    const response = await axios.get<MerchantDetailResponse>(
      `${API_BASE_URL}/merchants/details/${mchtCode}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("가맹점 상세 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};