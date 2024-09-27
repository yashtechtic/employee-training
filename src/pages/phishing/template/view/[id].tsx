import AddEditPhishingTemplate from "@/src/components/AddEditPhishingTemplate";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { useRouter } from "next/router";
import { FC } from "react";

const UpdateEmailTemplate: FC = () => {
    const router = useRouter();
    const { id } = router.query;
  return (
    <SidebarLayout>
      <AddEditPhishingTemplate id={id} viewOnly={true}/>
    </SidebarLayout>
  );
};
export default UpdateEmailTemplate;
