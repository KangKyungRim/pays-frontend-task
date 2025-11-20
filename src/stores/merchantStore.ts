import { create } from "zustand";
import {
  MerchantDetail,
  MerchantDetailResponse,
  MerchantAllResponse,
} from "@/types/merchant";
import { fetchMerchantDetail } from "@/apis/fetchMerchantDetail";
import { fetchMerchantAllDetail } from "@/apis/fetchMerchantAllDetail";

// 가맹점 상세 조회 스토어
interface MerchantStore {
  merchants: Record<string, MerchantDetail>;
  loading: boolean;
  fetchMerchantDetail: (mchtCode: string) => Promise<void>;

  statusLabels: Record<MerchantDetail["status"], string>;
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
console.log(res)
      set({
        merchants: { ...merchants, [mchtCode]: res.data },
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

    // 결제 상태 라벨
    statusLabels: {
      READY: "대기",
      ACTIVE: "활성",
      INACTIVE: "중지",
      CLOSED: "폐기",
    },
}));

// 가맹점 전체 상세 조회 스토어
interface MerchantAllStore {
  allMerchants: MerchantDetail[];
  loading: boolean;
  fetchMerchantAllDetail: () => Promise<void>;

  getPagedMerchants: (page: number, size: number) => MerchantDetail[];
  getTotalPages: (size: number) => number;

  statusLabels: Record<MerchantDetail["status"], string>;
}

export const useAllMerchantStore = create<MerchantAllStore>((set, get) => ({
  allMerchants: [],
  loading: false,

  fetchMerchantAllDetail: async () => {
    set({ loading: true });

    try {
      const res: MerchantAllResponse = await fetchMerchantAllDetail();
      
      set({
        allMerchants: res.data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  // 페이지네이션
  getPagedMerchants: (page: number, size: number) => {
    const reversed = [...get().allMerchants].reverse();
    const start = (page - 1) * size;
    return reversed.slice(start, start + size);
  },

  getTotalPages: (size: number) => {
    return Math.ceil(get().allMerchants.length / size);
  },

  // 결제 상태 라벨
  statusLabels: {
    READY: "대기",
    ACTIVE: "활성",
    INACTIVE: "중지",
    CLOSED: "폐기",
  },
}));