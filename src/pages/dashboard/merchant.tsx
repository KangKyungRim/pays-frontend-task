import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMerchantStore } from "@/stores/merchantStore";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import {
  Card, 
  CardBody,
  Typography
} from "@material-tailwind/react";
import { ProfileInfoCard } from "@/widgets/cards";

export function MerchantDetail() {
  const { mchtCode } = useParams<{ mchtCode: string }>();
  const { merchants, fetchMerchantDetail, loading, statusLabels } = useMerchantStore();

  if (!mchtCode) return (() => alert("조회 가능한 가맹점이 존재하지 않습니다."));
  const merchant = merchants[mchtCode];

  useEffect(() => {
    if (mchtCode && !merchant) {
      fetchMerchantDetail(mchtCode);
    }
  }, [mchtCode, merchant, fetchMerchantDetail]);

  const statusText = statusLabels[merchant?.status];

  if (loading) return <Loader />;

  return (
    <>
      <div className="relative mt-8 h-44 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-8">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1 flex items-center text-black">
                  <BackButton />
                  {merchant?.mchtName}
                </Typography>
              </div>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 ">

            <ProfileInfoCard
              title="상세 정보"
              description="! 현재 상세 정보 수정이 어렵습니다. 양해 부탁드립니다."
              details={{
                "가맹점 코드": `${merchant?.mchtCode}`,
                "상태": `${statusText}`,
                "업종": `${merchant?.bizType}`,
                "사업자 등록번호": `${merchant?.bizNo}`,
                "주소": `${merchant?.address}`,
                "전화번호": `${merchant?.phone}`,
                "이메일": `${merchant?.email}`,
                "등록일": `${merchant?.registeredAt.replace("T", " ")}`,
                "수정일": `${merchant?.updatedAt.replace("T", " ")}`,
              }}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default MerchantDetail;