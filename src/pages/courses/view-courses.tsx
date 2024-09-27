import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useEffect, useState} from "react";
import {Button, Divider, Image} from "antd";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import moment from "moment";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import TagComponent from "@/src/components/TagComponent";
import {UserOutlined} from "@ant-design/icons";
import CalendarAltIcon from "@/src/components/Icons/CalendarAltIcon";
import ClockIcon from "@/src/components/Icons/ClockIcon";
import EditIcon from "@/src/components/Icons/EditIcon";
import DisplayedLibraryIcon from "@/src/components/Icons/DisplayedLibraryIcon";

const ViewCourses = () => {
  const [viewCourseDetails, setViewCourseDetails] = useState<any>([]);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;

  const getCourseListById = async (id: any) => {
    try {
      showLoader();
      let CourseAction: any = await axiosInstance.get(
        `${API_ENDPOINTS.Update_Course_API}/${id}`
      );
      if (CourseAction?.settings?.success) {
        setViewCourseDetails(CourseAction?.data);
        hideLoader();
      } else {
        console.log("something went wrong");
        hideLoader();
      }
    } catch (error) {
      console.error("Error deleting Course:", error);
      hideLoader();
    }
  };
  useEffect(() => {
    getCourseListById(id);
  }, [id]);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/courses/edit-course`,
      query: {id: record.courseId},
    });
  };
  return (
    <div>
      <SidebarLayout>
        <div className="flex">
          <div
            onClick={() => router.push("/courses/manage-courses")}
            className="pt-2 cursor-pointer"
          >
            <LeftArrowIcon />
          </div>
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
            Course Detail
          </div>
        </div>
        <div>
          <div className="flex gap-5 mb-5  rounded-[10px] p-[30px] custom-card">
            <div>
              <Image
                className="rounded-[10px] object-cover"
                src={viewCourseDetails?.imageUrl}
                alt="dummy-image"
                preview={false}
                width={234}
                height={234}
              />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between w-full">
                <div className="w-full">
                  <div className="text-[#333333] text-[20px] font-normal">
                    {viewCourseDetails?.courseTitle}
                  </div>
                  <div className="text-[#4F4F4F] text-[16px] font-normal mt-1">
                    {viewCourseDetails?.description}
                  </div>

                  <div className="flex mt-1 h-[34px] text-center">
                    <TagComponent
                      title={
                        <div className="!text-[16px] text-[#4F4F4F] text-list">
                          {viewCourseDetails?.courseType}
                        </div>
                      }
                      icon={<UserOutlined />}
                    />

                    {viewCourseDetails?.isDisplayLibrary === 1 && (
                      <TagComponent
                        title={
                          <div className="!text-[16px] text-[#4F4F4F] text-list pl-2">
                            {"Displayed in Library"}
                          </div>
                        }
                        icon={<DisplayedLibraryIcon />}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <div
                    className="rounded-[4px] border border-[#4379EE]  text-[#4379EE] text-[16px] flex justify-center items-center px-8  h-[40px] cursor-pointer"
                    onClick={() => handleEdit(viewCourseDetails)}
                  >
                    <EditIcon />
                    Edit
                  </div>
                </div>
              </div>

              <div className="flex mt-5">
                <div className="flex-grow gap-0">
                  <div className="divider-level-table w-fit flex items-center">
                    <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal mr-2">
                        Expected Duration
                      </div>
                      <div className="text-[14px] text-[#4F4F4F] font-normal mr-2">
                        {viewCourseDetails?.duration + " " + "Mins"}
                      </div>
                    </div>
                    <Divider
                      type="vertical"
                      className="bg-[#E8E8E8] w-[1px] h-[76px]"
                    />

                    <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[14px] text-[#828282] font-normal ml-2">
                        Last Update
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarAltIcon />
                        <div className="text-[14px] text-[#4F4F4F]">
                          {" "}
                          {moment
                            .unix(viewCourseDetails?.modifiedDate / 1000)
                            .format("MMM DD, YYYY")}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mr-1">
                        <ClockIcon />
                        <div className="text-[14px] text-[#4F4F4F]">
                          {(() => {
                            const timeString = moment
                              .unix(viewCourseDetails?.modifiedDate / 1000)
                              .format("hh:mm:ss A");
                            const [time, period] = timeString.split(" ");
                            return (
                              <>
                                {time}
                                <span className="ml-2">{period}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};
export default ViewCourses;
