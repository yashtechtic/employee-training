import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import {NextRouter, useRouter} from "next/router";
import {useNotification} from "../Notification";
import {Spin, Tag} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import moment from "moment";
import SwitchToggle from "../SwitchToggle";
import PenSquareIcon from "../Icons/PenSquareIcon";
import LibraryFilterSection from "./LibraryFilterSection";
import EditContentTitle from "./EditContentTitle";
import {AiOutlineCaretDown, AiOutlineCaretUp} from "react-icons/ai";
import UploadedContentFilter from "./UploadedContentFilter";
import BoxArchiveIcon from "../Icons/BoxArchiveIcon";
import ActionsModal from "../Modals/ActionsModal";

interface LibraryTableProps {
  selectedSystem: boolean;
  setCurrentPage: any;
  setPageLimit: any;
  setTotalItems: any;
  currentPage: any;
  pageLimit: any;
  totalItems: any;
  handlePageChange: (props: any) => void;
}

const UploadedContentTable: FC<LibraryTableProps> = ({
  selectedSystem,
  setCurrentPage,
  setPageLimit,
  setTotalItems,
  currentPage,
  pageLimit,
  totalItems,
  handlePageChange,
}) => {
  const [libraryData, setLibraryDetails] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");

  const handleContentTypeChange = (value: any) => {
    setContentTypeFilter(value);
  };

  const [selectedEditId, SetSelectedEditId] = useState(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [openEditMode, setOpenEditMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{
    title: string;
    id: number;
  } | null>(null);
  const [sortedColumn, setSortedColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const router: NextRouter = useRouter();
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleEditMode = (content: {title: string; id: number}) => {
    setSelectedContent(content);
    setOpenEditMode(true);
  };
  useEffect(() => {
    fetchContentLibrayDetails();
  }, [
    currentPage,
    searchInput,
    selectedSystem,
    contentTypeFilter,
    sortedColumn,
    sortOrder,
  ]);

  const fetchContentLibrayDetails = async () => {
    try {
      showLoader();

      let body: any = {
        filters: contentTypeFilter
          ? [{key: "contentType", value: contentTypeFilter}]
          : [],
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };

      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }

      let libraryAction: any = await axiosInstance.post(
        `${API_ENDPOINTS.GET_CONTENT_LIBRARY}`,
        body
      );

      if (libraryAction?.settings?.success) {
        setLibraryDetails(libraryAction?.data);
        setTotalItems(libraryAction?.settings?.count);
      }

      hideLoader();
    } catch (error) {
      hideLoader();
      console.error("Failed to fetch content library details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.Delete_View__EDIT_CONTENT}/${selectRecord?.contentId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchContentLibrayDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleColumnSort = (column: string) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortedColumn(column);
      setSortOrder("ASC");
    }
  };
  const column = [
    {
      title: "Content Title",
      dataIndex: "title",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "title" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("title"),
      }),
      render: (text: any, record: any) => (
        <div className="flex justify-between">
          <div className="text-[14px] font-[600]">{text}</div>
          <div
            onClick={() => handleEditMode({title: text, id: record.contentId})}
            className="cursor-pointer"
          >
            <PenSquareIcon />
          </div>
        </div>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px]   w-[12px] hover:text-#00000091 ${
              sortedColumn === "title" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "title" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Content Type",
      dataIndex: "contentType",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "contentType" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("contentType"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px] w-[12px] hover:text-#00000091 ${
              sortedColumn === "contentType" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "contentType" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "status" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("status"),
      }),
      render: (text: any, record: any) => (
        <div>
          <Tag className="text-[12px] !text-[#00B69B] px-2 py-1 text-bold ">
            {text}
          </Tag>
        </div>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px] w-[12px] hover:text-#00000091 ${
              sortedColumn === "status" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "status" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "addedDate",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "addedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("addedDate"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
        </span>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px] w-[12px] hover:text-#00000091 ${
              sortedColumn === "addedDate" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "addedDate" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "duration" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("duration"),
      }),
      render: (text: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px] w-[12px] hover:text-#00000091 ${
              sortedColumn === "duration" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "duration" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "contentId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer justify-center text-center">
          {!selectedSystem && (
            <>
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

  return (
    <div>
      <div>
        <CommonTable
          columns={column}
          apiData={libraryData}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          showSearchInput={true}
          child={<div>
            <UploadedContentFilter
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              contentTypeFilter={contentTypeFilter}
              handleContentTypeChange={handleContentTypeChange} />
          </div>}
          child2={<>
            <div className="text-[16px] font-[600] text-[#56CCF2] flex space-x-[10px] text-nowrap items-center mx-[20px]">
              <BoxArchiveIcon />
              Bulk Archive
            </div>
          </>}      />
      </div>
      {selectedContent && (
        <EditContentTitle
          openEditMode={openEditMode}
          handleEditMode={() => setOpenEditMode(false)}
          contentData={{
            contentTitle: selectedContent.title,
            contentType: "Video",
            description: "description",
            duration: 3,
            isDisplayLibrary: 1,
            image: "893db9cfb70b4031226fb064b30bc16ba500b016.jpeg",
          }}
          contentId={selectedContent.id}
          fetchContentLibrayDetails={fetchContentLibrayDetails}
        />
      )}
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

export default UploadedContentTable;
