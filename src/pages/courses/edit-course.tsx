import {useRouter} from "next/router";
import CreateCourses from "./create-courses";

const EditCourse = () => {
  const router = useRouter();
  const {id} = router.query;
  return <CreateCourses id={id} />;
};

export default EditCourse;
