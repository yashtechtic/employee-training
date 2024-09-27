import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import ViewIcon from "../Icons/ViewIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import {Checkbox} from "antd";
import moment from "moment";
import ActionsModal from "../Modals/ActionsModal";
import MoveCategories from "../PhishingSimulation/MoveCategories";
import SwitchToggle from "../SwitchToggle";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import {DateRangeToMillisecond} from "@/src/helper/Utils";

interface TemplatesNotificationProps {
  selectedSystem: boolean;
  dateRange: any;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  handlePageChange: (props: any) => void;
}

const TemplatesNotificationTable: FC<TemplatesNotificationProps> = ({
  selectedSystem,
  dateRange,
  setCurrentPage,
  setPageLimit,
  setTotalItems,
  currentPage,
  pageLimit,
  totalItems,
  handlePageChange,
}) => {
  const [notficationTemplatesDetails, setNotficationTemplatesDetails] =
    useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<number[]>([]);

  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchTemplatesNotificationDetails();
  }, [currentPage, searchInput, selectedSystem, dateRange]);

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/template/edit-notification`,
      query: {id: record.notificationTemplateId},
    });
  };

  const fetchTemplatesNotificationDetails = async () => {
    try {
      showLoader();
      let filters: any[] = [];
      const {startDateMs, endDateMs} = DateRangeToMillisecond(dateRange);
      if (startDateMs) {
        filters.push({key: "startDate", value: startDateMs});
      }
      if (endDateMs) {
        filters.push({key: "endDate", value: endDateMs});
      }

      let body: any = {
        filters: filters,
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: "status", dir: "ASC"}],
      };
      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }
      let phishingDetails: any = await axiosInstance.post(
        `${API_ENDPOINTS.GET_NOTFICATION_TEMPLATES}`,
        body
      );
      if (phishingDetails?.settings?.success) {
        setNotficationTemplatesDetails(phishingDetails?.data);
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
        `${API_ENDPOINTS.VIEW_DELETE_EDIT_Notification_Template}/${selectRecord?.notificationTemplateId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchTemplatesNotificationDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewTempNotfication = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/template/view`,
      query: {id: record.notificationTemplateId},
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
      title: "Template Name",
      dataIndex: "templateName",
      render: (text: any) => (
        <span className="text-[14px] font-[600] text-[#4379EE]">{text}</span>
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
      title: "Category",
      dataIndex: "categoryName",
      render: (text: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "landingPageId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer">
          <div onClick={() => handleViewTempNotfication(record)}>
            <ViewIcon />
          </div>
          <div>
            <SwitchToggle
              checked={false}
              onChange={function (checked: boolean): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          {/* {!selectedSystem && (
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
          )} */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <CommonTable
        rowSelection={rowSelection}
        columns={column}
        apiData={notficationTemplatesDetails}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        rowClassName={(record: {notificationTemplateId: any}) =>
          selectedCheckboxIds.includes(record?.notificationTemplateId)
            ? "selected-item-table"
            : ""
        }
        rowKey={(record) => record.notificationTemplateId}
        child={
          <div className="flex w-full">
            <span className="text-[16px] font-bold text-[#333333] mt-2 w-full">
              All Templates
            </span>
            {selectedCheckboxIds.length > 0 && (
              <div className=" w-full">
                <MoveCategories
                  selectedCheckboxIds={selectedCheckboxIds}
                  fetchPhishingDestinationDetails={
                    fetchTemplatesNotificationDetails
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

export default TemplatesNotificationTable;
