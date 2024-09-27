import {Button, Card, Checkbox, Input, Space, Typography, Upload} from "antd";
import {FC, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ErrorMessage, Formik, Form, FormikHelpers} from "formik";
import {ContentValidationSchema} from "@/src/helper/ValidationSchema";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import CustomSelect from "@/src/components/CustomSelect";
import CustomInput from "@/src/components/CustomInput";
import {useNotification} from "@/src/components/Notification";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import CircleQuestionIcon from "@/src/components/Icons/CircleQuestionIcon";
import uploadFile from "@/src/helper/UploadFIle";

type CreateCourseProps = {
  id?: string | string[] | undefined;
};
const initialValues = {
  contentTitle: "",
  contentType: "",
  duration: "",
  description: "Test",
  isDisplayLibrary: 1,
  image: "",
  isSystemCategory: 0,
};

type InitialValuesProps = {
  contentTitle: string;
  contentType: string;
  duration: number;
  description: string;
  isDisplayLibrary: any;
  image?: any;
  isSystemCategory: any;
};
const CreateContent: FC<CreateCourseProps> = ({id}) => {
  const router = useRouter();
  const Text = Typography;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [fetchedData, setFetchedData] = useState<InitialValuesProps | null>();
  const isEditing = !!id;
  const [image, setImage] = useState<any>(null);

  const ContentTypesData = [
    {label: "Training/Course Content", value: "Training/Course Content"},
    {label: "Blog/Article", value: "Blog/Article"},
    {label: "Video Module", value: "Video Module"},
  ];

  const fileUploading = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      let uploadRes = await uploadFile(selectedFile);
      if (uploadRes?.settings?.success) {
        setImage(uploadRes?.data?.name);
        handleNotifications("success", "File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      const updatedValues = {
        ...values,
        image: image,
      };
      const endpoint = API_ENDPOINTS.Create_Content_List;
      const response: any = await axiosInstance.post(
        endpoint,
        JSON.stringify(updatedValues)
      );

      if (response?.settings?.success) {
        handleNotifications("success", "Content added successfully", "", 3);
        // @ts-ignore
        resetForm({values: initialValues});
        router.push("/content/uploaded");
      } else {
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.error(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };

  useEffect(() => {
    if (fetchedData) {
      setImage(fetchedData.image);
    }
  }, [fetchedData]);

  return (
    <SidebarLayout>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/content/uploaded")}
          >
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 text-[22px] font-semibold leading-6">
            {id ? "Update Upload content " : "Upload content "}
          </Text>
        </Space>
        <Card className="custom-card">
          <div className="flex items-center">
            <Formik
              // @ts-ignore
              initialValues={fetchedData || initialValues}
              validationSchema={ContentValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, values, setFieldValue}) => {
                return (
                  <Form className="w-full">
                    <div className="flex flex-col gap-[20px]">
                      <div className="flex flex-row  !w-full items-center ">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Content Title
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%]">
                            {" "}
                            <CustomInput
                              label=""
                              type="text"
                              name="contentTitle"
                              as={Input}
                              className={
                                errors.contentTitle && " !border !border-red"
                              }
                              size="large"
                              placeholder=""
                              status={errors.contentTitle && "error"}
                              error={<ErrorMessage name="contentTitle" />}
                              defaultValue={values.contentTitle}
                              maxInput={255}
                            />
                          </div>
                          <div>
                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Content Type
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%]">
                            {" "}
                            <CustomSelect
                              label=""
                              name="contentType"
                              className={
                                errors.contentType && " !border !border-red "
                              }
                              placeholder="Content Type"
                              onSelect={(value: any) => {
                                setFieldValue("contentType", value);
                              }}
                              defaultValue={values.contentType}
                              options={ContentTypesData}
                              error={<ErrorMessage name="contentType" />}
                            />
                          </div>
                          <div>
                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center mt-20">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Expected Duration (Minutes)
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%]">
                            {" "}
                            <CustomInput
                              label=""
                              type="number"
                              name="duration"
                              as={Input}
                              className={
                                errors.duration && " !border !border-red"
                              }
                              size="large"
                              placeholder=""
                              status={errors.duration && "error"}
                              error={<ErrorMessage name="duration" />}
                              defaultValue={values.duration}
                              maxInput={255}
                            />
                          </div>
                          <div>
                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Display in Library
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%] flex justify-end items-end">
                            {" "}
                            <Checkbox
                              style={{width: "20px", height: "20px"}}
                              checked={values.isDisplayLibrary === 1}
                              onChange={(e) =>
                                setFieldValue(
                                  "isDisplayLibrary",
                                  e.target.checked ? 1 : 0
                                )
                              }
                            ></Checkbox>
                          </div>
                          <div>
                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Cover Image
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full ">
                          <div className="w-[60%] flex">
                            <div>
                              <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={(event) => {
                                  fileUploading(event);
                                  setFieldValue(
                                    "image",
                                    event.currentTarget.files?.[0] || ""
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="image"
                                component="div"
                                className="error-message mt-1 text-[#ff4d4f] text-[14px] "
                              />
                            </div>

                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row  !w-full items-center">
                        <div className="w-[35%]  text-[16px] font-normal leading-[24px] text-[#333333]">
                          Upload Video
                        </div>
                        <div className="flex flex-col flex-end gap-4 items-end w-full ">
                          <div className="w-[60%] flex">
                            <div>
                              <Upload>
                                <Button>Browse</Button>
                              </Upload>
                              <ErrorMessage
                                name="image"
                                component="div"
                                className="error-message mt-1 text-[#ff4d4f] text-[14px] "
                              />
                            </div>

                            <CircleQuestionIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[20px] flex gap-5">
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn"
                      >
                        {id ? "Update" : "Save"}
                      </Button>

                      <div
                        onClick={() => router.push("/content/uploaded")}
                        className="text-[#4379EE] text-[16px] font-bold leading-[24px] pt-2 cursor-pointer"
                      >
                        Cancel
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
};
export default CreateContent;
