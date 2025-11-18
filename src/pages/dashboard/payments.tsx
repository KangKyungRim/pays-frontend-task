import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { fetchPayments } from "@/apis/fetchPayments";
import { fetchMerchantDetail } from "@/apis/fetchMerchantDetail";
import { PaymentItem } from "@/types/payments";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

export function Payments() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [merchantNames, setMerchantNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // 거래 내역 조회
  useEffect(() => {
    const getPaymentsAndMerchants = async () => {
      try {
        // 내역 조회
        const res = await fetchPayments();
        setPayments(res.data);
        
        // 가맹점 코드
        const codes = res.data.map(p => p.mchtCode);
  
        // 가맹점 조회
        const merchantMap: Record<string, string> = {};
        await Promise.all(
          codes.map(async (code) => {
            if (!merchantMap[code]) {
              const merchantRes = await fetchMerchantDetail(code);
              merchantMap[code] = merchantRes.data.mchtName;
            }
          })
        );

        setMerchantNames(merchantMap);
  
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    getPaymentsAndMerchants();
  }, []);

  // 결제 수단
  const payTypeLabels: Record<PaymentItem["payType"], string> = {
    ONLINE: "온라인",
    DEVICE: "단말기",
    MOBILE: "모바일",
    BILLING: "정기 결제",
    VACT: "가상계좌",
  };

   // 결제 상태
  const statusLabels: Record<PaymentItem["status"], string> = {
    CANCELLED: "환불 완료",
    SUCCESS: "결제 완료",
    FAILED: "결제 실패",
    PENDING: "결제 대기"
  };

  // 페이지네이션
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const reversedPayments = [...payments].reverse();

  const pagedData = reversedPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(payments.length / pageSize);

  // 로딩
  if (loading) return <Loader />;

  return (
    <div className="mt-10 mb-8 flex flex-col gap-10">
      <Card>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["번호", "가맹점", "결제 금액", "결제 수단", "상태", "결제 시각"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-center"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedData.map(
                ({ mchtCode, amount, currency, payType, status, paymentAt }, index) => {
                  const className = `py-3 px-5 text-center border-b border-blue-gray-50`;

                  const globalIndex = (page - 1) * pageSize + index;
                  const number = payments.length - globalIndex;

                  return (
                    <tr key={number}>
                      <td className={className}>
                        <div className="gap-4 text-center">
                          <div>
                            <Typography
                              variant="small"
                              className="font-semibold text-center text-blue-gray-600 text-xs"
                            >
                              {number}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {merchantNames[mchtCode] || "로딩 중..."} 
                          <span className="font-medium text-blue-gray-300"> ({mchtCode})</span>
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Number(amount).toLocaleString("ko-KR")} 
                          <span className="font-medium text-blue-gray-300"> ({currency})</span>
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {payTypeLabels[payType] || "알 수 없음"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <Chip
                            variant="gradient"
                            color={
                              status === "SUCCESS"
                                ? "green"
                                : status === "FAILED"
                                ? "red"
                                : "blue-gray" 
                            }
                            value={statusLabels[status]}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit m-auto"
                          />
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {paymentAt.replace("T", " ")}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="flex justify-center mt-5">
        <Pagination 
          page={page} 
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

export default Payments;
