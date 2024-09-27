import {useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import LibraryTable from "@/src/components/ContentLibrary/LibraryTable";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import PolicieTable from "@/src/components/PolicieSection/PolicieTable";

const PoliciesPage: FC = () => {
  const router: NextRouter = useRouter();
  const [isSystem, setIsSystem] = useState<boolean>(false);

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Policies
          </div>

          <Button
            type="primary"
            className="custom-heading-btn"
            onClick={() => router.push("/template/create-policy")}
          >
            <PlusOutlined className="mt-1" />
            Add Policy
          </Button>
        </div>

        <div className="!w-full !h-full ">
          <PolicieTable selectedSystem={isSystem} />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PoliciesPage;
