import React from "react";
import {Button, Divider, Modal, Input} from "antd";
import {Form, Formik} from "formik";
import CustomInput from "../CustomInput";
import {useNotification} from "../Notification";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";

interface EditContentTitleProps {
  openEditMode: boolean;
  handleEditMode: () => void;
  contentData: {
    contentTitle: string;
    contentType: string;
    description: string;
    duration: number;
    isDisplayLibrary: number;
    image: string;
  };
  contentId: number;
  fetchContentLibrayDetails: () => void;
}

const EditContentTitle: React.FC<EditContentTitleProps> = ({
  openEditMode,
  handleEditMode,
  contentData,
  contentId,
  fetchContentLibrayDetails,
}) => {
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  const handleSubmit = async (values: {
    contentTitle: string;
    contentType: string;
    description: string;
    duration: number;
    isDisplayLibrary: number;
    image: string;
  }) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.Delete_View__EDIT_CONTENT}/${contentId}`,
        {
          contentTitle: values.contentTitle,
          contentType: values.contentType,
          description: values.description,
          duration: values.duration,
          isDisplayLibrary: values.isDisplayLibrary,
          image: values.image,
        }
      );
      // @ts-ignore

      if (response?.settings?.success) {
        handleNotifications("success", "Content updated successfully", "", 3);
        fetchContentLibrayDetails();
        handleEditMode();
      } else {
        // @ts-ignore
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error) {
      handleNotifications(
        "error",
        "An error occurred while updating content.",
        "",
        3
      );
    }
  };

  return (
    <Modal
      width={387}
      footer={null}
      className="model-custom-ui"
      title={
        <p className="text-[#000000] text-[20px] font-bold">
          Update Content Title
        </p>
      }
      open={openEditMode}
      onCancel={handleEditMode}
    >
      <Divider />
      <Formik
        initialValues={{
          contentTitle: contentData.contentTitle || "",
          contentType: contentData.contentType || "",
          description: contentData.description || "",
          duration: contentData.duration || 0,
          isDisplayLibrary: contentData.isDisplayLibrary || 0,
          image: contentData.image || "",
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({isSubmitting, errors}) => (
          <Form className="w-full">
            <div className="flex items-center w-full space-x-2 mb-[20px]">
              <CustomInput
                label="Content Title"
                required
                type="text"
                name="contentTitle"
                as={Input}
                className={errors.contentTitle ? " !border !border-red" : ""}
                size="large"
                placeholder="Type here..."
                maxInput={255}
              />
            </div>

            <div>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-[#4379EE] rounded-[8px]"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditContentTitle;
