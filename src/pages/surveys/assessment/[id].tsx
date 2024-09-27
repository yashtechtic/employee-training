import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AddEditAssessment from "@/src/components/Survey/AddEditAssessment";
import { useRouter } from "next/router";
import { FC } from "react";

const AssessmentUpdate: FC = () => {
    const router =useRouter();
    const {query} = router
  return (
    <SidebarLayout>
      <AddEditAssessment id={query?.id} />
    </SidebarLayout>
  );
};
export default AssessmentUpdate;
