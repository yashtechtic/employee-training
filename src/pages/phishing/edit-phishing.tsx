import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import CreatePhishing from "./create-phishing";

const EditPhishing = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
      <CreatePhishing id={id} />
  );
};

export default EditPhishing;
