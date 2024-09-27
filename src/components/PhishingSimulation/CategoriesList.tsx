import {Button, Divider} from "antd";
import {FC, useEffect, useState} from "react";
import CategoriesDeleteIcon from "../Icons/CategoriesDeleteIcon";
import CategoriesEditIcon from "../Icons/CategoriesEditIcon";
import AddCategories from "./AddCategories";
import {useLoader} from "../Loader/LoaderProvider";
import {NextRouter, useRouter} from "next/router";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "../Notification";
import {PlusOutlined} from "@ant-design/icons";
import {handleCategoryType} from "@/src/helper/Utils";
import ActionsModal from "../Modals/ActionsModal";

interface CategoriesListProps {
  selectedSystem?: boolean;
}

const CategoriesList: FC<CategoriesListProps> = ({selectedSystem}) => {
  const loaderContext = useLoader();
  const {showLoader, hideLoader} = loaderContext;
  const router: NextRouter = useRouter();
  const [categoriesDetails, setCategoriesDetails] = useState<any>([]);
  const [openCategorie, setOpenCategorie] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectRecord, setSelectRecord] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const updateCategoryCount = sessionStorage.getItem("isMoveCategories");
  const handleDeleteClick = (record: any) => {
    setSelectRecord(record);
    setIsDeleteModalVisible(true);
  };
  const handleCategorie = () => {
    setOpenCategorie(!openCategorie);
    if (categoryToEdit) {
      setCategoryToEdit(null);
    }
  };

  useEffect(() => {
    showLoader();
    fetchCategorieDetails();
  }, [selectedSystem, currentPage, updateCategoryCount]);

  const fetchCategorieDetails = async () => {
    try {
      showLoader();
      const categoryType = await handleCategoryType();

      let data = JSON.stringify({
        filters: [
          {
            key: "categoryType",
            value: categoryType,
          },
        ],
        keyword: "",
        limit: pageLimit,
        page: currentPage,
        isSystem: selectedSystem,
        sort: [
          {
            prop: "status",
            dir: "ASC",
          },
        ],
      });
      let categoriesList: any = await axiosInstance.post(
        `${API_ENDPOINTS.Get_Categorie}`,
        data
      );
      sessionStorage.removeItem("isMoveCategories");
      if (categoriesList?.settings?.success) {
        setCategoriesDetails(categoriesList?.data);
        setTotalPages(Math.ceil(categoriesList?.settings?.count / pageLimit));
      }
      hideLoader();
    } catch (error) {
      sessionStorage.removeItem("isMoveCategories");
      console.log(error, "Something Went Wrong.");
      hideLoader();
    }
  };

  const editCategoriesList = (category: any) => {
    setCategoryToEdit(category);
    setOpenCategorie(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      let updateCategory: any = await axiosInstance.put(
        `${API_ENDPOINTS.Update_Categorie}/${categoryToEdit.id}`,
        JSON.stringify({...values})
      );

      if (updateCategory?.settings?.success) {
        handleNotifications("success", "Category updated successfully", "", 3);
        fetchCategorieDetails();
      } else {
        handleNotifications("error", updateCategory?.settings?.message, "", 3);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectRecord) return;
      const delTemp: any = await axiosInstance.delete(
        `${API_ENDPOINTS.Delete_Categorie}/${selectRecord?.myCategoryId}`
      );

      if (delTemp?.settings?.success) {
        handleNotifications(`success`, `${delTemp?.settings?.message}`, ``, 3);

        fetchCategorieDetails();
        setIsDeleteModalVisible(false);
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] !w-full !h-full">
        <div className="p-5">
          <div className="flex justify-between !h-full items-center">
            <div className="!text-[16px] font-bold text-[#333333] ">
              My Categories
            </div>
            {!selectedSystem && (
              <div
                className="rounded-[4px] border border-[#4379EE]  text-[#4379EE] text-[16px] flex justify-center items-center p-[8px] cursor-pointer h-[40px]"
                onClick={handleCategorie}
              >
                <PlusOutlined />
                Add
              </div>
            )}
          </div>
        </div>
        <div className="w-full !h-[300px] sidebar overflow-auto">
          {categoriesDetails &&
            categoriesDetails?.map((category: any, index: any) => (
              <div key={index}>
                <div className="flex justify-between items-center p-5 hover:bg-[#4880FF21] cursor-pointer transition-colors duration-300 group">
                  <div className="flex items-center gap-[5px] text-[#828282] text-[14px] font-[600] group-hover:text-[#4379EE]">
                    {category?.categoryName}
                  </div>
                  <div className="text-[#828282] text-[14px] font-[700] group-hover:text-[#4379EE]">
                    {category?.categoryCount}{" "}
                  </div>
                </div>

                {index < categoriesDetails.length - 1 && (
                  <Divider className="m-0 h-[1px] bg-#d9d9d9" />
                )}
              </div>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-2">
            <Button.Group>
              <Button
                disabled={currentPage <= 1}
                onClick={handleBack}
                className="text-[14px] font-bold"
                value="small"
              >
                Back
              </Button>
              <Button
                disabled={currentPage >= totalPages}
                onClick={handleNext}
                className="text-[14px] font-bold"
                value="small"
              >
                Next
              </Button>
            </Button.Group>
          </div>
        )}
      </div>
      {openCategorie && (
        <div>
          <AddCategories
            handleCategorie={handleCategorie}
            openCategorie={openCategorie}
            fetchCategorieDetails={fetchCategorieDetails}
            categoryToEdit={categoryToEdit}
            mode={categoryToEdit ? "edit" : "add"}
            onEditSubmit={handleEditSubmit}
          />
        </div>
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

export default CategoriesList;
