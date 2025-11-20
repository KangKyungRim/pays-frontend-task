import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Chip } from "@material-tailwind/react";
import GenericTable from "@/components/GenericTable";
import { Column } from "@/types/ui";
import { useAllMerchantStore } from "@/stores/merchantStore";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

export function Merchants() {
  const navigate = useNavigate();
  const {
    allMerchants,
    loading,
    fetchMerchantAllDetail,
    getPagedMerchants,
    getTotalPages,
    statusLabels,
  } = useAllMerchantStore();

  const pageSize = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMerchantAllDetail();
  }, []);

  const pagedData = getPagedMerchants(page, pageSize);

  useEffect(() => {
    pagedData.forEach((p) => fetchMerchantAllDetail());
  }, []);

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
      key: "mchtName",
      label: "가맹점 이름",
      render: (row) => (
        <Typography 
          className="text-xs font-bold text-blue-gray-600 cursor-pointer underline"
          onClick={() => navigate(`/dashboard/merchants/${row.mchtCode}`)}>
          {row.mchtName}
          <span className="text-blue-gray-300"> ({row.mchtCode})</span>
        </Typography>
      ),
    },
    {
      key: "bizType",
      label: "업종",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.bizType}
        </Typography>
      ),
    },
    {
      key: "address",
      label: "주소",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.address}
        </Typography>
      ),
    },
    {
      key: "phone",
      label: "전화번호",
      render: (row) => (
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {row.phone}
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
      key: "registeredAt",
      label: "등록일",
      render: (row) => (
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {row.registeredAt.replace("T", " ")}
          </Typography>
        ),
    },
    {
      key: "updatedAt",
      label: "수정일",
      render: (row) => (
          <Typography className="text-xs font-semibold text-blue-gray-600">
            {row.updatedAt.replace("T", " ")}
          </Typography>
        ),
    },
  ];

  const tableData = pagedData.map((p, index) => {
    const globalIndex = (page - 1) * pageSize + index;
    const number = allMerchants.length - globalIndex; 
    const statusColors: Record<string, string> = {
      ACTIVE: "green",
      INACTIVE: "red",
      READY: "blue",
      CLOSED: "blue-gray",
    };

    return {
      ...p,
      number,
      statusLabel: statusLabels[p.status],
      statusColor: statusColors[p.status] || "gray"
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

export default Merchants;