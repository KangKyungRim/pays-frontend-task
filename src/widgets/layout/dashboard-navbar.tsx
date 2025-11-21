import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
} from "@/context";
import { getPageName } from "@/utils/getPageName";
import { useEffect, useState } from "react";
import { matchPath } from "react-router-dom";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname } = useLocation();
  const [ pageNameState, setPageNameState ] = useState<string>("");

  // 현재 페이지 메뉴명 넣기
  useEffect(() => {
    setPageNameState(getPageName(`/${pathname.split("/").filter(Boolean).pop()}`));
  }, [pathname]);

  const location = useLocation();

  // 숨기고 싶은 경로 목록
  const hiddenBreadcrumbPaths = ["/dashboard/merchants/:mchtCode"];

  const showBreadcrumb = !hiddenBreadcrumbPaths.some(path =>
    matchPath(path, location.pathname)
  );

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""} ${!showBreadcrumb ? "hidden" : ""}`}
          >
            <Link to={`/`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                PG Dashboard
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {pageNameState}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {pageNameState}
          </Typography>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.tsx";

export default DashboardNavbar;
