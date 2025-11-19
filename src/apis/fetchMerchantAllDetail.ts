import axios from "axios";
import { MerchantListResponse } from "@/types/merchant.d";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMerchantAllDetail = async (): Promise<MerchantListResponse> => {
  try {
    const response = await axios.get<MerchantListResponse>(
      `${API_BASE_URL}/merchants/details`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("가맹점 전체 상세 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};