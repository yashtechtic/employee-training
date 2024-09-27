import {useRouter} from "next/router";
import {FC} from "react";
import AddEditPolicy from "./create-policy";

const ViewPolicies: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <AddEditPolicy id={id} viewOnly={true} />
    </div>
  );
};
export default ViewPolicies;
