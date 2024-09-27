import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AddEditAssessment from "@/src/components/Survey/AddEditAssessment";
import AddEditSurvey from "@/src/components/Survey/AddEditSurvey";
import { FC } from "react";

const AssessmentCreate: FC = () => {
  return (
    <SidebarLayout>
      <AddEditAssessment />
    </SidebarLayout>
  );
};
export default AssessmentCreate;
