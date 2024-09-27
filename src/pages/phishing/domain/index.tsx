import CommonTable from "@/src/components/CommonTable";
import DeleteIcon from "@/src/components/Icons/DeleteIcon";
import EditIcon from "@/src/components/Icons/EditIcon";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import ActionsModal from "@/src/components/Modals/ActionsModal";
import { useNotification } from "@/src/components/Notification";
import SwitchToggle from "@/src/components/SwitchToggle";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import { config } from "@/src/helper/config";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { Button } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const Domains: FC = () => {
  const router = useRouter();
  const [domainList, setDomainList] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const [sortedColumn, setSortedColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | null>();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [isSystem, setIsSystem] = useState(false);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  useEffect(() => {
    fetchDomainList();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    searchInput,
    isSystem,
    isArchive,
  ]);
  const fetchDomainList = async () => {
    try {
      let data = JSON.stringify({
        page: currentPage,
        limit: pageLimit,
      });
      let domainListings: any = await axiosInstance.post(
        API_ENDPOINTS.LIST_DOMAIN,
        JSON.stringify({
          page: currentPage,
          limit: pageLimit,
          keyword: searchInput,
          isSystem: isSystem,
          filters: [
            {
              key: "isArchive",
              value: isArchive ? 1 : 0,
            },
          ],
        })
      );
      if (domainListings?.settings?.success) {
        if(domainListings.data && domainListings.data.length > 0){
        setDomainList(domainListings.data || []);
        }else
        setDomainList([]);
        // setPageLimit(domainListings?.settings?.per_page);
        setTotalItems(domainListings?.settings?.count);
      }else{
        setDomainList([]);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const updateStatus = async (id: number,  record: any) => {
    try {
      delete record.status;
      let domainListings: any = await axiosInstance.post(
        `${API_ENDPOINTS.CHANGE_STATUS_DOMAIN}`,
        JSON.stringify({
          isArchive: record?.isArchive === 0 ? 1 : 0,
          ids: [id],
        })
      );
      if (domainListings?.settings?.success) {
        handleNotifications("success", "Status changed successfully", "", 3);
        fetchDomainList();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const column = [
    {
      title: "Domain Name",
      dataIndex: "domainUrl",
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Root Domain",
      dataIndex: "rootDomainUrl",
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Added",
      dataIndex: "addedDate",
      render: (text: any, record: any) => {
        console.log(
          'moment(text).format("MM/DD/YYYY") :>> ',
          moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")
        );
        return (
          <span className="text-[14px] font-[600] ">
            {moment.unix(record?.addedDate / 1000).format("MM/DD/YYYY")}
          </span>
        );
      },
    },
    {
      title: "Domain Type",
      dataIndex: "domainType",
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">{text}</span>
      ),
    },
    {
      title: "Hide Domain",
      dataIndex: "",
      render: (text: any, record: any) => {
        console.log('record :>> ', record);
        return (
          <span className="text-[14px] font-[600] ">
            <SwitchToggle
              onChange={(checked) =>
                updateStatus(
                  record?.domainId,
                  record
                )
              }
              checked={record?.isArchive===1 ? true : false}
              disabled={isSystem}
            />
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          {!isSystem && (
            <span
              className="cursor-pointer"
              onClick={() =>
                router.push(`/phishing/domain/${record?.domainId}`)
              }
            >
              <EditIcon />
            </span>
          )}
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
  const deleteClick = async () => {
    try {
      const Url = `${API_ENDPOINTS.UPDATE_DOMAIN}/${selectRecord?.domainId}`;
      const surveyDelete: any = await axiosInstance.delete(Url);
      if (surveyDelete?.settings?.success) {
        handleNotifications(
          `success`,
          `${surveyDelete?.settings?.message}`,
          ``,
          3
        );

        fetchDomainList();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const exportCSV = async () => {
    try {
      let domainListings: any = await axiosInstance.post(
        API_ENDPOINTS.LIST_DOMAIN,
        JSON.stringify({ isExport: true })
      );
      if (domainListings?.settings?.success) {
        config.downloadFile(domainListings?.data?.fileUrl, "DomainList.csv");
      }
    } catch (error) {}
  };
  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Domains</div>
          <div className="flex gap-[20px]">
            <div>
              <SystemCompanySwitch
                firstTab="User Defined Domain"
                secondTab="System Defined Domain"
                onChange={(selected) =>
                  selected === "System Defined Domain"
                    ? setIsSystem(true)
                    : setIsSystem(false)
                }
              />
            </div>
            <Button
              type="primary"
              className="custom-heading-btn "
              onClick={() => router.push("/phishing/domain/add")}
            >
              Create Domain
            </Button>
          </div>
        </div>

        <CommonTable
          columns={column}
          apiData={domainList}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          showCSV={true}
          onExportCSV={exportCSV}
          child={
            <>
              <div className="flex items-center gap-[45px]">
                <div className="text-[18px] font-[700] text-[#333]">
                  {" "}
                  Phish Link Domains
                </div>
                <div className="flex gap-[10px] items-center">
                  <SwitchToggle
                    onChange={(checked) => {
                      setIsArchive(checked);
                    }}
                    checked={isArchive}
                    // disabled={isSystem}
                  />{" "}
                  <div className="text-[#4F4F4F] font-[400] text-[14px]">
                    Show Hidden Domains
                  </div>
                </div>
              </div>
            </>
          }
        />
      </div>
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
    </SidebarLayout>
  );
};

export default Domains;
