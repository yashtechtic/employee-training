import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { FC, useEffect, useState } from "react";
import { useLoader } from "../Loader/LoaderProvider";
import { Checkbox } from "antd";
import { camelCase, DateRangeToMillisecond } from "@/src/helper/Utils";
import moment from "moment";
import EditIcon from "../Icons/EditIcon";
import { useRouter } from "next/router";
import DeleteIcon from "../Icons/DeleteIcon";
import CommonTable from "../CommonTable";
import MoveCategories from "../PhishingSimulation/MoveCategories";
import ActionsModal from "../Modals/ActionsModal";
import { useNotification } from "../Notification";
import ViewIcon from "../Icons/ViewIcon";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import CommonPagination from "../CommonTable/paginnation";

type AssessmentListingProp = {
  isSystem: boolean;
};
const AssessmentListing: FC<AssessmentListingProp> = ({ isSystem }) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [sortedColumn, setSortedColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [surveyData, setSurveyData] = useState([]);
  const loaderContext = useLoader();
  const { showLoader, hideLoader } = loaderContext;
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchSurveys();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    searchInput,
    isSystem,
  ]);
  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };
  const fetchSurveys = async () => {
    try {
      showLoader();
      let config: any = {
        page: currentPage,
        limit: pageLimit,
        keyword: searchInput,
        isSystem: isSystem ? 1 : 0,
        sort: [{ prop: sortedColumn, dir: sortOrder }],
        filters: [],
      };

      let surveyList: any = await axiosInstance.post(
        API_ENDPOINTS.ASSESSMENT_LIST,
        JSON.stringify(config)
      );
      if (surveyList?.settings?.success) {
        setSurveyData(surveyList?.data);
        setTotalItems(surveyList?.settings?.count);
      }
      hideLoader();
    } catch (error) { }
  };
  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };
  const deleteClick = async () => {
    try {
      const Url = `${API_ENDPOINTS.ASSESSMENT_DELETE}/${selectRecord?.assessmentId}`;
      const surveyDelete: any = await axiosInstance.delete(Url);
      if (surveyDelete?.settings?.success) {
        handleNotifications(
          `success`,
          `${surveyDelete?.settings?.message}`,
          ``,
          3
        );

        fetchSurveys();
        setIsDeleteModalVisible(false);
      }
    } catch (error) { }
  };
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedCheckboxIDs((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const columnAssessment = [
    {
      title: "Assessment Name",
      sorter: surveyData.length === 0 ? false : true,
      sortOrder: sortedColumn === "assessmentTitle" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: surveyData.length > 0 ? () => handleColumnSort("assessmentTitle") : undefined, 
      }),
      dataIndex: "assessmentTitle",
      render: (text: any, record: any) => {
        return (
          <div className="gap-[5px]">
            <span className="text-[14px] font-[600] ">{camelCase(text)}</span>
          </div>
        );
      },
    },
    {
      title: "Created On",
      dataIndex: "addedDate",
      sorter: surveyData.length === 0 ? false : true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => surveyData.length > 0 ? handleColumnSort("addedDate") : undefined,
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },

    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          {/* {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => router.push(`/surveys/${record?.assessmentId}`)}
            >
              <EditIcon />
            </span>
          )} */}
          <span
            className="cursor-pointer"
            onClick={() =>
              router.push(`/surveys/assessment/view/${record?.assessmentId}`)
            }
          >
            <ViewIcon />
          </span>
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => {
                setSelectRecord(record);
                setIsDeleteModalVisible(true);
              }}
            >
              <DeleteIcon />
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        columns={columnAssessment}
        apiData={surveyData}
        searchInput={searchInput}
        rowClassName={(record: { surveyId: any }) =>
          selectedCheckboxIds.includes(record?.surveyId)
            ? "selected-item-table"
            : ""
        }
        setSearchInput={setSearchInput}
        child={
          <>
            <div className="flex gap-[30px]">
              {selectedCheckboxIds.length > 0 && (
                <div>
                  <MoveCategories
                    selectedCheckboxIds={selectedCheckboxIds}
                    fetchPhishingDestinationDetails={fetchSurveys}
                    setSelectedCheckboxIDs={setSelectedCheckboxIDs}
                  />
                </div>
              )}
            </div>
          </>
        }
      />
      <CommonPagination
        className="pagination"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={pageLimit}
        onPageChange={handlePageChange}
        onShowSizeChange={undefined}
      />
      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={deleteClick}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={true}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setIsDeleteModalVisible(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={deleteClick}
        saveButtonProps="Delete"
        mainTitle="Are you sure?"
      />
    </>
  );
};
export default AssessmentListing;
