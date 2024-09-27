import CommonTable from "@/src/components/CommonTable";
import {useLoader} from "@/src/components/Loader/LoaderProvider";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import {FC, useEffect, useState} from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import {useNotification} from "../Notification";
import {Tag} from "antd";
import moment from "moment";
import {AiOutlineCaretDown, AiOutlineCaretUp} from "react-icons/ai";
import ActionsModal from "../Modals/ActionsModal";
import ViewIcon from "../Icons/ViewIcon";
import ArchiveIcon from "../Icons/ArchiveIcon";
import {NextRouter, useRouter} from "next/router";
import EditIcon from "../Icons/EditIcon";

interface PolicieTableProps {
  selectedSystem: boolean;
}

const PolicieTable: FC<PolicieTableProps> = ({selectedSystem}) => {
  const [policyData, setPolicyDetails] = useState<any>([]);

  const [searchInput, setSearchInput] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);

  const [sortedColumn, setSortedColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(
    "DESC"
  );
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEditId, SetSelectedEditId] = useState(null);
  const router: NextRouter = useRouter();

  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };

  useEffect(() => {
    fetchPoliciesDetails();
  }, [
    currentPage,
    searchInput,
    selectedSystem,
    contentTypeFilter,
    sortedColumn,
    sortOrder,
  ]);

  const fetchPoliciesDetails = async () => {
    try {
      showLoader();

      let body: any = {
        filters: [],
        keyword: searchInput,
        page: currentPage,
        limit: pageLimit,
        sort: [{prop: sortedColumn, dir: sortOrder}],
      };

      if (selectedSystem) {
        body.isSystem = selectedSystem;
      }

      let policyAction: any = await axiosInstance.post(
        `${API_ENDPOINTS.GET_POLICY}`,
        body
      );

      if (policyAction?.settings?.success) {
        setPolicyDetails(policyAction?.data);
        setTotalItems(policyAction?.settings?.count);
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
        `${API_ENDPOINTS.VIEW_EDIT_DELETE_POLICY}/${selectRecord?.policyId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchPoliciesDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  const handleViewPolicie = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/template/view-policies`,
      query: {id: record.policyId},
    });
  };

  const handleEdit = (record: any) => {
    SetSelectedEditId(record);
    router.push({
      pathname: `/template/edit-policies`,
      query: {id: record.policyId},
    });
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
      title: "Title",
      dataIndex: "title",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "title" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("title"),
      }),
      render: (text: any, record: any) => (
        <div className="flex">
          <div className="text-[14px] font-[600] text-[#4379EE]">{text}</div>
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
      title: "Page Count",
      dataIndex: "pageCount",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "pageCount" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("pageCount"),
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px] w-[12px] hover:text-#00000091 ${
              sortedColumn === "pageCount" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "pageCount" && sortOrder === "DESC"
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
      title: "Type",
      dataIndex: "documentType",
      sorter: true,
      // @ts-ignore
      sortOrder: sortedColumn === "documentType" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleColumnSort("documentType"),
      }),
      render: (text: any, record: any) => (
        <div className="flex">
          <div className="text-[14px] font-[600] text-[#4379EE]">{text}</div>
        </div>
      ),
      sortIcon: () => (
        <span className="flex-col ">
          <AiOutlineCaretUp
            className={`h-[12px]   w-[12px] hover:text-#00000091 ${
              sortedColumn === "documentType" && sortOrder === "ASC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
          <AiOutlineCaretDown
            className={`h-[12px] w-[12px] hover:text-#00000091l ${
              sortedColumn === "documentType" && sortOrder === "DESC"
                ? "text-[#BCC2CE]"
                : "text-gray-500"
            }`}
          />
        </span>
      ),
    },
    {
      title: "Last Updated",
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
      title: "Action",
      dataIndex: "contentId",
      render: (id: number, record: any) => (
        <div className="flex gap-2 cursor-pointer justify-center text-center">
          {!selectedSystem && (
            <>
              <div onClick={() => handleViewPolicie(record)}>
                <ViewIcon />
              </div>

              <div
                onClick={() => {
                  handleDeleteClick(record);
                }}
              >
                <DeleteIcon />
              </div>
              <div onClick={() => handleEdit(record)}>
                <EditIcon />
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
      <div>
        <CommonTable
          columns={column}
          apiData={policyData}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          showSearchInput={true}
          child2={
            <div className="text-[16px] font-[600] text-[#56CCF2] flex space-x-[10px] text-nowrap items-center mx-[20px]">
              <ArchiveIcon />
              Archive
            </div>
          }
        />
      </div>

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

export default PolicieTable;
