import { create } from "zustand";
import {
  MerchantDetail,
  MerchantDetailResponse,
  MerchantListResponse,
} from "@/types/merchant";
import { fetchMerchantDetail } from "@/apis/fetchMerchantDetail";
import { fetchMerchantAllDetail } from "@/apis/fetchMerchantAllDetail";

// 가맹점 상세 조회 스토어
interface MerchantStore {
  merchants: Record<string, MerchantDetail>;
  loading: boolean;
  fetchMerchantDetail: (mchtCode: string) => Promise<void>;
}

export const useMerchantStore = create<MerchantStore>((set, get) => ({
  merchants: {},
  loading: false,

  fetchMerchantDetail: async (mchtCode: string) => {
    const { merchants } = get();

    if (merchants[mchtCode]) return;

    set({ loading: true });

    try {
      const res: MerchantDetailResponse = await fetchMerchantDetail(mchtCode);

      set({
        merchants: { ...merchants, [mchtCode]: res.data },
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));

// 가맹점 전체 상세 조회 스토어
interface MerchantAllStore {
  allMerchants: MerchantDetail[];
  loading: boolean;
  fetchMerchantAllDetail: () => Promise<void>;
}

export const useAllMerchantStore = create<MerchantAllStore>((set) => ({
  allMerchants: [],
  loading: false,

  fetchMerchantAllDetail: async () => {
    set({ loading: true });

    try {
      const res: MerchantListResponse = await fetchMerchantAllDetail();

      set({
        allMerchants: res.data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));