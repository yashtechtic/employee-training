import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import PreviewAns from "@/src/components/Survey/PreviewAns";
import { useRouter } from "next/router";
import { FC } from "react";

const AnswerPreview: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log('id :>> ', id);
  return (
    <SidebarLayout>
      {id && <PreviewAns id={id} />}
    </SidebarLayout>
  );
};
export default AnswerPreview;
