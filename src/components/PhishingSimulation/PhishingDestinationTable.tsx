import CommonTable from "@/src/components/CommonTable";
import { useLoader } from "@/src/components/Loader/LoaderProvider";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { FC, useEffect, useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import EditIcon from "../Icons/EditIcon";
import ViewIcon from "../Icons/ViewIcon";
import { NextRouter, useRouter } from "next/router";
import { useNotification } from "../Notification";
import { Checkbox, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import MoveCategories from "./MoveCategories";
import ActionsModal from "../Modals/ActionsModal";
import { DateRangeToMillisecond } from "@/src/helper/Utils";
import CommonPagination from "../CommonTable/paginnation";

interface PhishingDestinationTableProps {
  selectedSystem: boolean;
  dateRange: any;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
}

const PhishingDestinationTable: FC<PhishingDestinationTableProps> = ({
  selectedSystem,
  dateRange,
  setCurrentPage,
  setPageLimit,
  setTotalItems,
  currentPage,
  totalItems,
  pageLimit,
}) => {
  const [phishingDestinationDetails, setPhishingDestinationDetails] =
    useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageLimit, setPageLimit] = useState(10);
  // const [totalItems, setTotalItems] = useState(26);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);

  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const { showLoader, hideLoader } = loaderContext;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  useEffect(() => {
    fetchPhishingDestinationDetails();
  }, [currentPage, searchInput, selectedSystem, dateRange]);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/phishing/edit-phishing`,
      query: { id: record.landingPageId },
    });
  };

  const fetchPhishingDestinationDetails = async () => {
    try {
      showLoader();
      let filters: any[] = [];
      const { startDateMs, endDateMs } = DateRangeToMillisecond(dateRange);
      if (startDateMs) {
        filters.push({ key: "startDate", value: startDateMs });
      }
      if (endDateMs) {
        filters.push({ key: "endDate", value: endDateMs });
      }

      let body: any = {
        filters: filters,
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{ prop: "status", dir: "ASC" }],
      };

      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }

      let phishingDetails: any = await axiosInstance.post(
        `${API_ENDPOINTS.Phishing_Destination_API}`,
        body
      );

      if (phishingDetails?.settings?.success) {
        setPhishingDestinationDetails(phishingDetails?.data);
        setTotalItems(phishingDetails?.settings?.count);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.Delete_View_Phishing}/${selectRecord?.landingPageId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchPhishingDestinationDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewPhishing = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/phishing/view-phishing`,
      query: { id: record.landingPageId },
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys as any[]);
    },
  };

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Updated",
      dataIndex: "modifiedDate",
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.modifiedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      render: (text: any) => (
        <div className="border border-[#E8E8E8] rounded-[4px] bg-[#FFFFFF] p-2 text-[#828282] text-[16px] leading-[24px] font-[400]">
          {text}
        </div>
      ),
    },

    {
      title: "Action",
      dataIndex: "landingPageId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          <div onClick={() => handleViewPhishing(record)}>
            <ViewIcon />
          </div>
          {!selectedSystem && (
            <>
              <div onClick={() => handleEdit(record)}>
                <EditIcon />
              </div>
              <div
                onClick={() => {
                  handleDeleteClick(record);
                }}
              >
                <DeleteIcon />
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <CommonTable
        rowSelection={rowSelection}
        columns={column}
        apiData={phishingDestinationDetails}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        rowClassName={(record: {landingPageId: any}) =>
          selectedCheckboxIds.includes(record?.landingPageId)
            ? "selected-item-table"
            : ""
        }
        rowKey={(record) => record.landingPageId}
        child={
          <div className="flex w-full">
            <span className="text-[16px] font-bold text-[#333333] mt-2 w-full">
              All Phishing Destination Page
            </span>
            {selectedCheckboxIds.length > 0 && (
              <div className="w-full mr-2">
                <MoveCategories
                  selectedCheckboxIds={selectedCheckboxIds}
                  fetchPhishingDestinationDetails={
                    fetchPhishingDestinationDetails
                  }
                  selectedSystem={selectedSystem}
                  setSelectedCheckboxIDs={setSelectedCheckboxIDs}
                />
              </div>
            )}
          </div>
        }
      />
      <ActionsModal
        title=""
        type="delete"
        isOpen={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        footer={false}
        centered={true}
        closable={false}
        maskClosable={false}
        className="delete-modal"
        cancelBtnClass="cancleBtnAction"
        cancelBtnClick={() => setIsDeleteModalVisible(false)}
        cancelButtonProps="Cancel"
        saveBtnClass="saveBtnAction"
        saveBtnClick={handleDelete}
        saveButtonProps="Delete"
        mainTitle="Are you sure?"
      />
    </div>
  );
};

export default PhishingDestinationTable;
