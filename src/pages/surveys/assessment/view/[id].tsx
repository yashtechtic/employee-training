import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import AssessmentViewDetails from "@/src/components/Survey/ViewAssessment";
import SurveyViewDetails from "@/src/components/Survey/ViewSurvey";
import { useRouter } from "next/router";
import { FC } from "react";

const ViewAssessmentDetails: FC = () => {
    const router = useRouter();
    const { query } = router;
    return (<>
        <SidebarLayout>
            <AssessmentViewDetails id={query?.id} />
        </SidebarLayout>
    </>)
}
export default ViewAssessmentDetails