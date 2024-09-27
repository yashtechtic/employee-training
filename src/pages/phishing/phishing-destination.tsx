import {useState} from "react";
import DateRangePicker from "@/src/components/DateRangePicker";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import PhishingDestinationTable from "@/src/components/PhishingSimulation/PhishingDestinationTable";
import {Button} from "antd";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import CategoriesList from "@/src/components/PhishingSimulation/CategoriesList";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import dayjs from "dayjs";
import CommonPagination from "@/src/components/CommonTable/paginnation";

const PhishingDestination: FC = () => {
  const router: NextRouter = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );

  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    console.log("dates", dates);
    !dates ? setDateRange([]) : setDateRange(dates);
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between items-center">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Phishing Destination Page
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="common-button common-button-light-blue"
            onClick={() => router.push("/phishing/create-phishing")}
          >
            Create Phishing Destination
          </Button>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex justify-between">
            <SystemCompanySwitch
              firstTab="User Defined Phishing Destination"
              secondTab="Predefined Phishing Destination"
              onChange={(selected) =>
                selected === "Predefined Phishing Destination"
                  ? setIsSystem(true)
                  : setIsSystem(false)
              }
            />
            <DateRangePicker
              defaultValue={dateRange}
              value={dateRange}
              onChange={handleDateChange}
            />
          </div>

          <div className="flex flex-row gap-[31px] mt-[32px] !w-full !h-full">
            <div className="!w-1/4 !h-full">
              <CategoriesList selectedSystem={isSystem} />
            </div>
            <div className="Phishing-Destination-Table !w-3/4 !h-full">
              <PhishingDestinationTable
                selectedSystem={isSystem}
                dateRange={dateRange}
                setCurrentPage={setCurrentPage}
                setPageLimit={setPageLimit}
                setTotalItems={setTotalItems}
                currentPage={currentPage}
                pageLimit={pageLimit}
                totalItems={totalItems}
              />
            </div>
          </div>
        </div>
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      </div>
    </SidebarLayout>
  );
};

export default PhishingDestination;
