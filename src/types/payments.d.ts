export interface PaymentItem {
  [x: string]: colors | undefined;
  number: ReactNode;
  merchantName: string;
  payTypeLabel: ReactNode;
  statusLabel: ReactNode;
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: "ONLINE" | "DEVICE" | "MOBILE" | "BILLING" | "VACT"; 
  status: "CANCELLED" | "SUCCESS" | "FAILED" | "PENDING"; 
  paymentAt: string; 
}

export interface PaymentResponse {
  status: number;
  message: string;
  data: PaymentItem[];
}