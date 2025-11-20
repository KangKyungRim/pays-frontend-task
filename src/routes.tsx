import {
  HomeIcon,
  TableCellsIcon,
  InformationCircleIcon,
  UserCircleIcon,
  BanknotesIcon,
  BuildingStorefrontIcon
} from "@heroicons/react/24/solid";
import { Home, Payments, Merchants, MerchantDetail, Profile, Tables, Notifications } from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "홈",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "거래 내역",
        path: "/payments",
        element: <Payments />,
      },
      {
        icon: <BuildingStorefrontIcon {...icon} />,
        name: "가맹점 관리",
        path: "/merchants",
        element: <Merchants />,
      },
      {
        name: "가맹점 상세",
        path: "/merchants/:mchtCode", 
        element: <MerchantDetail />,
        sideNavHidden: true
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
];

export default routes;
