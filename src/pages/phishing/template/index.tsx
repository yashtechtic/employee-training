import CommonTable from "@/src/components/CommonTable";
import DeleteIcon from "@/src/components/Icons/DeleteIcon";
import EditIcon from "@/src/components/Icons/EditIcon";
import FilterIcon from "@/src/components/Icons/FilterIcon";
import HeadingPlusIcon from "@/src/components/Icons/HeadingPlusIcon";
import ResetFilterIcon from "@/src/components/Icons/ResetFilterIcon";
import SettingIconTable from "@/src/components/Icons/SettingIconTable";
import ViewIcon from "@/src/components/Icons/ViewIcon";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { useLoader } from "@/src/components/Loader/LoaderProvider";
import ActionsModal from "@/src/components/Modals/ActionsModal";
import { useNotification } from "@/src/components/Notification";
import AddCategories from "@/src/components/PhishingSimulation/AddCategories";
import RateComponent from "@/src/components/RateComponent";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import { camelCase, handleCategoryType } from "@/src/helper/Utils";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { Button, Card, Checkbox, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { FC, use, useEffect, useState } from "react";

const TemplateListing: FC = () => {
  const router = useRouter();
  const [isSystem, setIsSystem] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [emailTemplateList, setEmailTemplateList] = useState<any>([]);
  const [sortedColumn, setSortedColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | null>("DESC");
  const [category, setCategory] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectDifficultyRating, setSelectDifficultyRating] =
    useState<any>(null);
  const difficultyRatingOptions = [1, 2, 3, 4, 5];
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [categoriesDetails, setCategoriesDetails] = useState<any>([]);
  const [openCategorie, setOpenCategorie] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [selectedCheckboxIds, setSelectedCheckboxIDs] = useState<any[]>([]);
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const handleCategorie = () => {
    setOpenCategorie(!openCategorie);
    if (categoryToEdit) {
      setCategoryToEdit(null);
    }
  };
  useEffect(() => {
    fetchTemplateList();
  }, [
    currentPage,
    searchInput,
    sortedColumn,
    sortOrder,
    searchInput,
    isSystem,
    category,selectDifficultyRating
  ]);
  useEffect(() => {
    fetchListing();
  }, []);
  const fetchListing = async () => {
    try {
      let categoryList: any = await axiosInstance.get(
        `${API_ENDPOINTS.DROPDOWN_LIST_CATEGORIES}?categoryType=PHISHING_TEMPLATES`
      );
      if (categoryList?.settings?.success) {
        setCategoryList(categoryList.data);
      }
    } catch (error) {
      console.log("error :>> ", error);
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
        `${API_ENDPOINTS.DELETE_PHISHING_TEMPLATE}/${selectRecord?.phishingTemplateId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchTemplateList();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };
  const fetchTemplateList = async () => {
    try {
      let config: any = {
        page: currentPage,
        limit: pageLimit,
        keyword: searchInput,
        isSystem: isSystem,
        filters:[],
        sort: [{ prop: sortedColumn, dir: sortOrder }],
      };
      if (category) {
        config["filters"] = [
          {
            key: "domainId",
            value: category,
          },
        ];
      }
      if (selectDifficultyRating) {
        config["filters"] = [
          {
            key: "difficultyRating",
            value: selectDifficultyRating,
          },]}
      let templateListings: any = await axiosInstance.post(
        API_ENDPOINTS.LIST__PHISHING_TEMPLATE,
        JSON.stringify(config)
      );
      if (templateListings?.settings?.success) {
        setEmailTemplateList(templateListings.data);
        // setPageLimit(templateListings?.settings?.per_page);
        setTotalItems(templateListings?.settings?.count);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const rowSelection = {
    selectedRowKeys: selectedCheckboxIds,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedCheckboxIDs(newSelectedRowKeys);
    },
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
      title: "Template Name",
      dataIndex: "templateName",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "templateName" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: emailTemplateList.length > 0 ? () => handleColumnSort("templateName") : undefined, 
      }),
      render: (text: any, record: any) => (
        <div className="gap-[5px]">
          {/* <Checkbox
            style={{ width: "24px", height: "24px" }}
            onChange={() => {}}
          ></Checkbox> */}
          <span className="text-[14px] font-[600] ">{text}</span>
        </div>
      ),
    },
    {
      title: "Updated On",
      dataIndex: "modifiedDate",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "modifiedDate" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: emailTemplateList.length > 0 ? () => handleColumnSort("modifiedDate") : undefined, 
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {moment.unix(record?.modifiedDate/1000).format("MM/DD/YYYY")}
        </span>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficultyRating",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "difficultyRating" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: emailTemplateList.length > 0 ? () => handleColumnSort("difficultyRating") : undefined, 
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          <RateComponent disabled={true} value={record?.difficultyRating} />
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: emailTemplateList.length === 0 ? false : true,
      sortOrder: sortedColumn === "category" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: emailTemplateList.length > 0 ? () => handleColumnSort("category") : undefined, 
      }),
      render: (text: any, record: any) => (
        <span className="text-[14px] font-[600] ">
          {camelCase(record?.category)}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "templateName",
      render: (text: any, record: any) => (
        <div className="space-x-[10px] flex ">
          {!isSystem && <span
            className="cursor-pointer"
            onClick={() =>
              router.push(`/phishing/template/${record?.phishingTemplateId}`)
            }
          >
            <EditIcon />
          </span>}
          <span className="cursor-pointer" 
          onClick={() =>
            router.push(`/phishing/template/view/${record?.phishingTemplateId}`)
          }
          >
            <ViewIcon />
          </span>
          {!isSystem&& <span
            className="cursor-pointer"
            onClick={() => {
              handleDeleteClick(record);
            }}
          >
            <DeleteIcon />
          </span>}
        </div>
      ),
    },
  ];
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  // useEffect(() => {
  //   showLoader();
  //   fetchCategorieDetails();
  // }, []);


  const handleEditSubmit = async (values: any) => {
    try {
      let updateCategory: any = await axiosInstance.put(
        `${API_ENDPOINTS.Update_Categorie}/${categoryToEdit.id}`,
        JSON.stringify({...values})
      );

      if (updateCategory?.settings?.success) {
        handleNotifications("success", "Category updated successfully", "", 3);
      } else {
        handleNotifications("error", updateCategory?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  return (
    <SidebarLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="heading-title">Phishing Templates</div>
          <div className="flex gap-[10px]">
            <Button
              type="primary"
              className="custom-heading-btn secondary gap-[10px]"
              onClick={handleCategorie}
            >
              <HeadingPlusIcon /> Add Category
            </Button>
            <Button
              type="primary"
              className="custom-heading-btn "
              onClick={() => router.push("/phishing/template/add")}
            >
              Create Phishing Templates
            </Button>
          </div>
        </div>
        {/* <Card className="custom-card mt-[20px]"> */}

        <CommonTable
          columns={column}
          rowSelection={rowSelection}
          rowKey={(record) => record.phishingTemplateId} 
          apiData={emailTemplateList}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filter={true}
          child={
            <>
              <div className="flex justify-between">
                <div>
                  <SystemCompanySwitch
                    secondTab="User Defined Templates"
                    firstTab="Pre-defined Templates"
                    onChange={(selected) =>
                      selected === "Pre-defined Templates"
                        ? setIsSystem(true)
                        : setIsSystem(false)
                    }
                  />
                </div>
                
              </div>
            </>
          }
          child2={
            <>
              <div className="text-[16px] font-[600] text-[#F2994A] flex space-x-[10px] text-nowrap items-center mx-[20px] gap-[5px]">
                <SettingIconTable /> 
                <span>Template Editor(0)</span>
              </div>
            </>
          }
          additionalFilters={[
            {
              defaultValue: "Category",
              value: category,
              placeholder: "Select Category",
              onChange: (value) => setCategory(value),
              options: categoryList.map((option: any) => ({
                value: option.myCategoryId,
                label: camelCase(option.categoryName),
              })),
            },
            {
              defaultValue: "Difficulty",
              value: selectDifficultyRating,
              placeholder: "Select Difficulty",
              onChange: (value) => setSelectDifficultyRating(value),
              options: difficultyRatingOptions.map((option: any) => ({
                value: option,
                label: option,
              })),
            },
          ]}
          resetFilter={() => {setCategory(null); setSelectDifficultyRating(null)}}
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
       {openCategorie && (
        <div>
          <AddCategories
            handleCategorie={handleCategorie}
            openCategorie={openCategorie}
            categoryToEdit={categoryToEdit}
            mode={categoryToEdit ? "edit" : "add"}
            onEditSubmit={handleEditSubmit}
          />
        </div>
      )}
    </SidebarLayout>
  );
};
export default TemplateListing;
