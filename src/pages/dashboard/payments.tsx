import { useState, useEffect } from "react";
import { Typography, Chip } from "@material-tailwind/react";
import GenericTable from "@/components/GenericTable";
import { Column } from "@/types/ui";

import { usePaymentsStore } from "@/stores/paymentsStore";
import { useMerchantStore } from "@/stores/merchantStore";
import { PaymentItem } from "@/types/payments";

import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

export function Payments() {
  const {
    payments,
    loading,
    fetchPaymentsData,
    getPagedPayments,
    getTotalPages,
    payTypeLabels,
    statusLabels,
  } = usePaymentsStore();

  const { merchants, fetchMerchantDetail } = useMerchantStore();

  const pageSize = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const pagedData = getPagedPayments(page, pageSize);

  useEffect(() => {
    pagedData.forEach((p) => fetchMerchantDetail(p.mchtCode));
  }, [page, payments]);

  if (loading) return <Loader />;

  const columns: Column<any>[] = [
    {
      key: "number",
      label: "번호",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.number}
        </Typography>
      ),
    },
    {
      key: "merchant",
      label: "가맹점",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.merchantName || "불러오는 중..."}
          <span className="text-blue-gray-300"> ({row.mchtCode})</span>
        </Typography>
      ),
    },
    {
      key: "amount",
      label: "결제 금액",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {Number(row.amount).toLocaleString("ko-KR")}
          <span className="text-blue-gray-300"> ({row.currency})</span>
        </Typography>
      ),
    },
    {
      key: "payType",
      label: "결제 수단",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.payTypeLabel}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (row) => (
        <Chip
          variant="gradient"
          color={row.statusColor}
          value={row.statusLabel}
          className="py-0.5 px-2 text-xs font-medium w-fit m-auto"
        />
      ),
    },
    {
      key: "paymentAt",
      label: "결제 시각",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.paymentAt.replace("T", " ")}
        </Typography>
      ),
    },
  ];

  const tableData = pagedData.map((p, index) => {
    const globalIndex = (page - 1) * pageSize + index;
    const number = payments.length - globalIndex; 

    return {
      ...p,
      number,
      merchantName: merchants[p.mchtCode]?.mchtName,
      payTypeLabel: payTypeLabels[p.payType],
      statusLabel: statusLabels[p.status],
      statusColor:
        p.status === "SUCCESS"
          ? "green"
          : p.status === "FAILED"
          ? "red"
          : "blue-gray",
    };
  });

  return (
    <div className="mt-10 mb-8 flex flex-col gap-10">
      <GenericTable
        data={tableData}
        columns={columns}
        getRowKey={(row) => row.number}
      />

      <div className="flex justify-center mt-5">
        <Pagination
          page={page}
          totalPages={getTotalPages(pageSize)}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

export default Payments;