import {useRouter} from "next/router";
import {FC} from "react";
import CreateNotification from "./create-notification-template";

const ViewTemplateNotfication: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <CreateNotification id={id} viewOnly={true} />
    </div>
  );
};
export default ViewTemplateNotfication;
