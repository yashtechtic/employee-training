import {useState} from "react";
import DateRangePicker from "@/src/components/DateRangePicker";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {Button} from "antd";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import CategoriesList from "@/src/components/PhishingSimulation/CategoriesList";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import TemplatesNotificationTable from "@/src/components/Templates/TemplatesNotificationTable";
import SwitchToggle from "@/src/components/SwitchToggle";
import dayjs from "dayjs";
import CommonPagination from "@/src/components/CommonTable/paginnation";

const TemplatesNotification: FC = () => {
  const router: NextRouter = useRouter();
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);

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
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Notification Templates
          </div>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="common-button common-button-light-blue"
            onClick={() =>
              router.push("/template/create-notification-template")
            }
          >
            Create Notification Email
          </Button>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex justify-between">
            <div className="flex gap-5">
              <SystemCompanySwitch
                firstTab="User Defined Templates"
                secondTab="Predefined Templates"
                onChange={(selected) =>
                  selected === "Predefined Templates"
                    ? setIsSystem(true)
                    : setIsSystem(false)
                }
              />
              <div className="flex space-x-[10px] text-nowrap items-center mx-[20px]">
                <SwitchToggle
                  checked={false}
                  onChange={function (checked: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                />
                <div className="text-[14px] text-[#4F4F4F] leading-[20px] font-normal">
                  {" "}
                  Show Hidden Items
                </div>
              </div>
            </div>
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
              <TemplatesNotificationTable
                selectedSystem={isSystem}
                dateRange={dateRange}
                setCurrentPage={setCurrentPage}
                setPageLimit={setPageLimit}
                setTotalItems={setTotalItems}
                currentPage={currentPage}
                pageLimit={pageLimit}
                totalItems={totalItems}
                handlePageChange={handlePageChange}
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

export default TemplatesNotification;
