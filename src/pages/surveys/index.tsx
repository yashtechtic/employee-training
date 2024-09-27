import { Button } from "antd";
import SidebarLayout from "../../components/Layout/SidebarLayout";
import { useRouter } from "next/router";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import DateRangePicker from "@/src/components/DateRangePicker";
import CategoriesList from "@/src/components/PhishingSimulation/CategoriesList";
import { useState } from "react";
import SurveyTable from "@/src/components/Survey";
import PlusIconWhite from "@/src/components/Icons/PlusIconWhite";
import ButtonDropDown from "@/src/components/ButtonDropdown";
import SinglePageSurvey from "@/src/components/Icons/SinglePageSurvey";
import dayjs from "dayjs";

const Surveys = () => {
  const router = useRouter();
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
  };
  return (
    <SidebarLayout>
       <SurveyTable  />
      
    </SidebarLayout>
  );
};
export default Surveys;
