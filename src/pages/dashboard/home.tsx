import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chartsConfig } from "@/configs";
import {
  Typography,
  Chip,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsChartsData,
} from "@/data";
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  BuildingStorefrontIcon, 
  WalletIcon 
} from "@heroicons/react/24/solid";
import GenericTable, { Column } from "@/components/GenericTable";
import { usePaymentsStore } from "@/stores/paymentsStore";
import { useAllMerchantStore } from "@/stores/merchantStore";
import { useMerchantStore } from "@/stores/merchantStore";
import { PaymentItem } from "@/types/payments";
import Loader from "@/components/Loader";

export function Home() {
  const navigate = useNavigate();
  const { allMerchants, fetchMerchantAllDetail } = useAllMerchantStore();
  const [totalAmountKRW, setTotalAmountKRW] = useState(0);
  const [totalAmountUSD, setTotalAmountUSD] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activeMerchants, setActiveMerchants] = useState(0);
  const {
    payments,
    loading,
    fetchPaymentsData,
    getPagedPayments,
    payTypeLabels,
    statusLabels,
  } = usePaymentsStore();

  const { merchants, fetchMerchantDetail } = useMerchantStore();

  const pageSize = 5;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPaymentsData();
    fetchMerchantAllDetail();
  }, []);

  useEffect(() => {
    // 총 거래 수 (상태 상관 없이)
    setTotalCount(payments.filter(p => p.status === "SUCCESS").length);

    // 총 거래 금액 (성공 결제만, 통화별)
    const successPayments = payments.filter(p => p.status === "SUCCESS");
    setTotalAmountKRW(
      successPayments
        .filter(p => p.currency === "KRW")
        .reduce((sum, p) => sum + Number(p.amount), 0)
    );
    setTotalAmountUSD(
      successPayments
        .filter(p => p.currency === "USD")
        .reduce((sum, p) => sum + Number(p.amount), 0)
    );

    // 총 활성화된 가맹점 수
    const activeCount = Object.values(allMerchants).filter(m => m.status === "ACTIVE").length;
    setActiveMerchants(activeCount);

  }, [payments, allMerchants]);

  const stats = [
    {
      color: "gray",
      title: "총 거래 금액 (KRW)",
      icon: WalletIcon,
      value: totalAmountKRW.toLocaleString() + `원`,
    },
    {
      color: "gray",
      title: "총 거래 금액 (USD)",
      icon: CurrencyDollarIcon,
      value: totalAmountUSD.toLocaleString() + ` 달러`,
    },
    {
      color: "gray",
      title: "총 성공 거래 수",
      icon: BanknotesIcon,
      value: totalCount + ` 건`,
    },
    {
      color: "gray",
      title: "총 활성 가맹점",
      icon: BuildingStorefrontIcon,
      value: activeMerchants + ` 곳`,
    },
  ];

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const pagedData = getPagedPayments(page, pageSize);

  useEffect(() => {
    pagedData.forEach((p) => fetchMerchantDetail(p.mchtCode));
  }, [page, payments]);

  // 로딩
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
      render: (row) => row.payTypeLabel,
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
      render: (row) => row.paymentAt.replace("T", " "),
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

  // 이번 달 최근 7일 거래 추이
  const N = 7;

  const paymentDates = payments
    .map(p => Number(p.paymentAt.split("T")[0].split("-")[2])) 
    .sort((a, b) => a - b); 

  const uniqueDates = Array.from(new Set(paymentDates));
  const recentDates = uniqueDates.slice(-N).map(day => `${day}일`); 

  // 최근 일별 거래 건수 계산
  const dailyCounts = uniqueDates.slice(-N).map(day =>
    payments.filter(p => Number(p.paymentAt.split("T")[0].split("-")[2]) === day).length
  );

  const recentPaymentsChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "거래 건수",
        data: dailyCounts,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: recentDates,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}건`,
        },
      },
    },
  };

  // 결제 수단 비율
  const payTypes = ["ONLINE", "DEVICE", "MOBILE", "BILLING", "VACT"];
  const payTypeCounts = payTypes.map(type =>
    payments.filter(p => p.payType === type).length
  );

  // 전체 거래 수
  const totalPayments = payTypeCounts.reduce((sum, c) => sum + c, 0);

  // 비율 
  const payTypePercentages = payTypeCounts.map(count =>
    totalPayments > 0 ? +(count / totalPayments * 100).toFixed(1) : 0
  );

  const chartPayType = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "비율",
        data: payTypePercentages,
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      colors: ["#4F46E5"],
      xaxis: {
        categories: payTypes.map(type => {
          switch (type) {
            case "ONLINE": return "온라인";
            case "DEVICE": return "단말기";
            case "MOBILE": return "모바일";
            case "BILLING": return "정기결제";
            case "VACT": return "가상계좌";
            default: return type;
          }
        }),
      },
      yaxis: {
        max: 100,
        tickAmount: 2,
        labels: {
          formatter: (val: number) => val + "%",
        },
      },
      dataLabels: {
        enabled: false
      },
    },
  };

  // 결제 상태 비율 바 차트
  const statuses = ["SUCCESS", "FAILED", "CANCELLED", "PENDING"];
  const statusCounts = statuses.map(s =>
    payments.filter(p => p.status === s).length
  );

  const chartStatus = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "비율",
        data: statusCounts,
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      xaxis: { 
        categories: statuses.map(type => {
          switch (type) {
            case "SUCCESS": return "완료";
            case "CANCELLED": return "환불";
            case "FAILED": return "실패";
            case "PENDING": return "대기";
            default: return type;
          }
        })
      },
      colors: ["#3B82F6"],
      yaxis: {
        max: 100,
        tickAmount: 2,
        labels: {
          formatter: (val: number) => val + "%",
        },
      },
      dataLabels: {
        enabled: false
      },
    },
    
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon, title, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      <div className="mb-12">
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                최근 거래 내역
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => navigate("/dashboard/payments")}>더 보기</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <GenericTable
              data={tableData}
              columns={columns}
              getRowKey={(row) => row.number}
            />
        </Card>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsChart
            color="white"
            title="결제 수단 비율"
            description="수단별 분포"
            chart={chartPayType}
          />
        <StatisticsChart
            color="white"
            title="이번 달 최근 7일 거래 추이"
            description="일자별 거래 건수 (오늘 날짜 기준)"
            chart={recentPaymentsChart}
          />
        <StatisticsChart
          color="white"
          title="결제 상태 비율"
          description="완료/실패/환불/대기 현황"
          chart={chartStatus}
        />
      </div>
    </div>
  );
}

export default Home;