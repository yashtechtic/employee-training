import {useRouter} from "next/router";
import {FC} from "react";
import AddEditPolicy from "./create-policy";

const EditPolicies: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <AddEditPolicy id={id} viewOnly={false} />
    </div>
  );
};
export default EditPolicies;
