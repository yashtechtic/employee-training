import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AddEditSurvey from "@/src/components/Survey/AddEditSurvey";
import { useRouter } from "next/router";
import { FC } from "react";

const EditSurvey: FC = () => {
    const router =useRouter();
    const {query} = router
  return (
    <SidebarLayout>
      <AddEditSurvey id={query?.id} />
    </SidebarLayout>
  );
};
export default EditSurvey;
