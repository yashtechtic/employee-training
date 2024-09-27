import {UserOutlined} from "@ant-design/icons";
import {FC, useEffect, useState} from "react";
import TagComponent from "../TagComponent";
import {Divider, Empty, Image} from "antd";
import {useLoader} from "../Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import CalendarAltIcon from "../Icons/CalendarAltIcon";
import moment from "moment";
import ClockIcon from "../Icons/ClockIcon";
import CoursesOptions from "./CoursesOptions";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import DisplayedLibraryIcon from "../Icons/DisplayedLibraryIcon";
import CommonPagination from "../CommonTable/paginnation";

interface CourseListingProps {
  selectedSystem: boolean;
  searchInput: any;
  statusFilter: any;
}

const CourseListing: FC<CourseListingProps> = ({
  selectedSystem,
  searchInput,
  statusFilter,
}) => {
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [courseListData, setCourseListData] = useState<any>([]);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [noData, setNoData] = useState(false);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const router: NextRouter = useRouter();

  useEffect(() => {
    fetchCourseListing();
  }, [currentPage, itemsPerPage, searchInput, selectedSystem, statusFilter]);

  const fetchCourseListing = async () => {
    try {
      showLoader();
      const body = {
        filters: [{key: "status", value: statusFilter}],
        keyword: searchInput,
        page: currentPage,
        limit: itemsPerPage,
      };
      if (selectedSystem) {
        // @ts-ignore
        body.isSystem = selectedSystem;
      }
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.Course_Listing_API}`,
        body
      );
      // @ts-ignore
      if (response?.settings?.success) {
        if (response?.data.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
        setCourseListData(response?.data);
        // @ts-ignore
        setTotalItems(response?.settings?.count || 0);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching course listing:", error);
      setNoData(true);
    } finally {
      hideLoader();
    }
  };

  const handleViewCourses = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/courses/view-courses`,
      query: {id: record.courseId},
    });
  };

  const handleDeleteCourse = async (id: number) => {
    setLoadingId(id);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.Update_Course_API}/${id}`
      );
      // @ts-ignore
      if (response?.settings?.success) {
        handleNotifications("success", "Course deleted successfully", "", 3);
        fetchCourseListing();
      } else {
        // @ts-ignore
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error deleting Course destination:", error);
      hideLoader();
    } finally {
      setLoadingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

   const MAX_LENGTH = 165;

   const truncateText = (text: any) => {
     if (text.length > MAX_LENGTH) {
       return text.slice(0, MAX_LENGTH) + "...";
     }
     return text;
   };

   return (
     <div>
       {courseListData && courseListData?.length > 0 ? (
         courseListData &&
         courseListData?.map((course: any) => (
           <div
             key={course?.id}
             className="flex gap-5 mb-5 rounded-[10px] p-[30px] custom-card"
           >
             <Image
               className="rounded-[10px] object-cover"
               src={course?.imageUrl}
               alt="dummy-img"
               preview={false}
               width={234}
               height={234}
             />

             <div className="flex flex-col w-full">
               <div className="flex justify-between w-full">
                 <div className="w-full">
                   <div className="text-[#333333] text-[20px] font-normal">
                     {course?.courseTitle}
                   </div>
                   <div className="text-[#4F4F4F] text-[16px] font-normal mt-1 ">
                     {truncateText(course?.description || "")}
                   </div>
                   <div className="flex mt-1">
                     <TagComponent
                       title={
                         <div className="!text-[16px] text-[#4F4F4F] font-normal">
                           {course?.courseType}
                         </div>
                       }
                       icon={<UserOutlined />}
                     />

                     {course?.isDisplayLibrary === 1 && (
                       <TagComponent
                         title={
                           <div className="!text-[16px] text-[#4F4F4F] font-normal pl-2">
                             {"Displayed in Library"}
                           </div>
                         }
                         icon={<DisplayedLibraryIcon />}
                       />
                     )}
                   </div>
                 </div>
                 <div className="">
                   <CoursesOptions
                     course={course}
                     onViewCourse={handleViewCourses}
                     handleDeleteCourse={handleDeleteCourse}
                   />
                 </div>
               </div>

               <div className="flex mt-5">
                 <div className="flex-grow gap-0">
                   <div className="divider-level-table w-fit flex items-center">
                     <div className="p-[20px] list-data-wrapped flex flex-col items-center justify-center gap-[5px]">
                       <div className="text-[14px] text-[#828282] font-normal mr-2">
                         Expected Duration
                       </div>
                       <div className="text-[14px] text-[ #4F4F4F] font-normal mr-2">
                         {course?.duration + " " + "Mins"}
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
                             .unix(course?.modifiedDate / 1000)
                             .format("MMM DD, YYYY")}
                         </div>
                       </div>

                       <div className="flex items-center gap-1 mr-1">
                         <ClockIcon />
                         <div className="text-[14px] text-[#4F4F4F]">
                           {(() => {
                             const timeString = moment
                               .unix(course?.modifiedDate / 1000)
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
         ))
       ) : (
         <div className="custom-card py-40">
           <Empty
             description={
               <div className="text-[15px] text-gray-400 font-bold">
                 No data available for the Courses.
               </div>
             }
           />
         </div>
       )}

       {!noData && (
         <CommonPagination
           className="pagination"
           currentPage={currentPage}
           totalItems={totalItems}
           itemsPerPage={itemsPerPage}
           onPageChange={handlePageChange}
           onShowSizeChange={handlePageSizeChange}
           pageSizeOptions={[10, 20, 50]}
         />
       )}
     </div>
   );
};

export default CourseListing;
