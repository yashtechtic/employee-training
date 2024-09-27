import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { Button } from "antd";
import { useRouter } from "next/router";

const PhishingOverview = () => {
  const router = useRouter();

  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Phishing Security Test Program</div>
          <div>
            <Button
              type="primary"
              className="custom-heading-btn"
              onClick={() => router.push("/phishing/program/add")}
            >
              Create Phishing Program
            </Button>
          </div>
        </div>
        
      </div>
    </SidebarLayout>
  );
};
export default PhishingOverview;
