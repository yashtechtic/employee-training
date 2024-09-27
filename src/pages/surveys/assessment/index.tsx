import PlusIconWhite from "@/src/components/Icons/PlusIconWhite";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AssessmentListing from "@/src/components/Survey/AssessmentListing";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import { Button } from "antd";
import { useRouter } from "next/router";
import { FC, useState } from "react";

const AssessmentList: FC = () => {
  const router = useRouter();
  const [isSystem, setIsSystem] = useState(false);

  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Assessment</div>
          <div className="flex items-center gap-[20px]">
            <SystemCompanySwitch
              firstTab="User Defined Assessment"
              secondTab="Predefined Assessment"
              onChange={(selected) =>
                selected === "Predefined Assessment"
                  ? setIsSystem(true)
                  : setIsSystem(false)
              }
            />
            <Button
              type="primary"
              className="custom-heading-btn flex items-center gap-[5px] !h-[40px]"
              onClick={() => router.push("/surveys/assessment/add")}
            >
              <PlusIconWhite /> Create New Assessment
            </Button>
          </div>
        </div>

        <div className="Phishing-Destination-Table  !h-full">
          <AssessmentListing isSystem={isSystem}/>
        </div>
      </div>
    </SidebarLayout>
  );
};
export default AssessmentList;
