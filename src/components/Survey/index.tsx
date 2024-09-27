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
import ButtonDropDown from "../ButtonDropdown";
import PlusIconWhite from "../Icons/PlusIconWhite";
import SinglePageSurvey from "../Icons/SinglePageSurvey";
import SystemCompanySwitch from "../SystemCompanySwitch";
import DateRangePicker from "../DateRangePicker";
import CategoriesList from "../PhishingSimulation/CategoriesList";
import CommonPagination from "../CommonTable/paginnation";
import { DataSourceItemType } from "antd/es/auto-complete";
import { TableRowSelection } from "antd/es/table/interface";


const SurveyTable: FC = () => {
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | any>(
    []
  );
  console.log("dateRange", dateRange);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [sortedColumn, setSortedColumn] = useState<string>("addedDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const [surveyData, setSurveyData] = useState([]);
  const loaderContext = useLoader();
  const { showLoader, hideLoader } = loaderContext;
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<any[]>([]);
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
    dateRange,
  ]);

  const handleDateChange = (
    dates: [dayjs.Dayjs, dayjs.Dayjs] | null,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
  };
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
      console.log("dateRange :>> ", dateRange);
      if (dateRange && dateRange.length === 2) {
        // Parse start and end dates
        const { startDateMs, endDateMs } = DateRangeToMillisecond(dateRange);
        config["filters"] = [
          { key: "startDate", value: startDateMs },
          { key: "endDate", value: endDateMs },
        ];
      }
      let surveyList: any = await axiosInstance.post(
        `${ API_ENDPOINTS.LIST_SURVEY_DETAILS
        }`,
        JSON.stringify(config)
      );
      if (surveyList?.settings?.success) {
        setSurveyData(surveyList?.data);
        setTotalItems(surveyList?.settings?.count);
      }
      hideLoader();
    } catch (error) {}
  };
  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };
  const deleteClick = async () => {
    try {
      const Url = `${API_ENDPOINTS.DELETE_SURVEY}/${selectRecord?.surveyId}`
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
    } catch (error) {}
  };
  const handleCheckboxChange = (id: number, checked: boolean) => {
    // setSelectedCheckboxIDs((prev) =>
    //   checked ? [...prev, id] : prev.filter((item) => item !== id)
    // );
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedCheckboxIDs(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys);
    },
  };
  const column = [
    {
      title: "Survey Name",
      dataIndex: "surveyTitle",
      sorter: true,
      sortOrder: sortedColumn === "surveyTitle" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("surveyTitle"),
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          {/* <Checkbox
            className="custom-checkbox"
            checked={selectedCheckboxIds.includes(record?.surveyId)}
            style={{ width: "24px", height: "24px" }}
            onChange={(e) =>
              handleCheckboxChange(record?.surveyId, e.target.checked)
            }
          ></Checkbox> */}
          <span className="text-[14px] font-[600] text-[#4379EE] ">
            {camelCase(text)}
          </span>
        </div>
      ),
    },
    {
      title: "Created On",
      dataIndex: "addedDate",
      sorter: true,
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] text-[#4F4F4F]">
          {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },

    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() => router.push(`/surveys/${record?.surveyId}`)}
            >
              <EditIcon />
            </span>
          )}
          <span
            className="cursor-pointer"
            onClick={() => router.push(`/surveys/view/${record?.surveyId}`)}
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
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };


  return (
    <>
      {" "}
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Surveys</div>
          <div>
            {/* <Button
          type="primary"
          className="custom-heading-btn flex items-center gap-[5px] !h-[40px]"
          onClick={() => router.push("/surveys/add")}
        >
          <PlusIconWhite /> Add Surveys
        </Button> */}
            <ButtonDropDown
              className="custom-heading-btn flex items-center gap-[5px] !h-[40px]  plus-icon"
              label={
                <div className="flex items-center gap-[5px]">
                  <PlusIconWhite /> Create New Survey
                </div>
              }
              btnItem={[
                {
                  label: (
                    <div className="flex items-center gap-[5px] font-[600] text-[14px] text-[#828282] ">
                      <SinglePageSurvey /> Single Page Survey
                    </div>
                  ),
                  key: 1,
                  onClick: () => router.push("/surveys/add"), // Handling navigation on click
                },
              ]}
            />
          </div>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <div className="flex justify-between">
            <SystemCompanySwitch
              firstTab="User Defined Surveys"
              secondTab="Predefined Surveys"
              onChange={(selected) =>
                selected === "Predefined Surveys"
                  ? setIsSystem(true)
                  : setIsSystem(false)
              }
            />
            <DateRangePicker
              defaultValue={dateRange}
              value={dateRange}
              onChange={handleDateChange}
            />
          </div>

          <div className="flex flex-row gap-[31px] mt-[32px] !w-full !h-full">
            <div className="!w-[233px] !h-full">
              <CategoriesList selectedSystem={isSystem} />
            </div>
            <div className="Phishing-Destination-Table !w-3/4 !h-full">
              <CommonTable
              rowSelection={rowSelection}
                columns={column}
                apiData={surveyData}
                searchInput={searchInput}
                rowClassName={(record: { surveyId: any }) =>
                  selectedCheckboxIds.includes(record?.surveyId)
                    ? "selected-item-table"
                    : ""
                }
                rowKey={(record) => record.surveyId}            
                    setSearchInput={setSearchInput}
                child={
                  <>
                    <div className="flex gap-[30px] justify-between">
                      <div className="text-[16px] font-bold text-[#333333] mt-2">
                         All Surveys
                      </div>
                      {selectedCheckboxIds.length > 0 && (
                        <div className="mr-[10px]">
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
                description={`Do you really want to delete this survey?`}
              />
            </div>
          </div>
        </div>
        <CommonPagination
        className="pagination"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={pageLimit}
        onPageChange={handlePageChange}
        onShowSizeChange={undefined}
      />
      </div>
    </>
  );
};
export default SurveyTable;
