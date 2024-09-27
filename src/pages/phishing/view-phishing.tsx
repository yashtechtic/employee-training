import {useRouter} from "next/router";
import {FC} from "react";
import CreatePhishing from "./create-phishing";

const ViewPhishing: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <CreatePhishing id={id} viewOnly={true} />
    </div>
  );
};
export default ViewPhishing;
