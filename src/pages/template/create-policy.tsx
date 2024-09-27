import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import {FC, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ErrorMessage, Field, Formik, Form} from "formik";
import {PolicySchema} from "@/src/helper/ValidationSchema";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import CustomInput from "@/src/components/CustomInput";
import Editor from "@/src/components/Editor";
import {useNotification} from "@/src/components/Notification";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {CalendarOutlined, CaretDownOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import uploadFile from "@/src/helper/UploadFIle";

type AddEditPolicyProp = {
  id?: string | string[] | undefined;
  viewOnly?: boolean;
};
const initialValues = {
  title: "",
  document: "",
  startDate: "",
  endDate: "",
  description: "",
  pageCount: "",
};
const AddEditPolicy: FC<AddEditPolicyProp> = ({id, viewOnly}) => {
  const [document, setDocument] = useState<any>(null);
  const [pageCount, setPageCount] = useState<Number>();
  const router = useRouter();
  const Text = Typography;
  const [policyDetails, setPolicyDetails] = useState<any>();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;

  useEffect(() => {
    if (id) fetchPolicyById();
  }, [id]);

  const fetchPolicyById = async () => {
    try {
      let fetchPolicy: any = await axiosInstance.get(
        `${API_ENDPOINTS.VIEW_EDIT_DELETE_POLICY}/${id}`
      );
      if (fetchPolicy?.settings?.success) {
        setPolicyDetails(fetchPolicy?.data);
      }
    } catch (error) {}
  };

  const handleSubmit = async (values: any) => {
    try {
      const httpMethod = id ? "put" : "post";
      let policyAdded: any = await axiosInstance.request({
        method: httpMethod,
        url: id
          ? `${API_ENDPOINTS.VIEW_EDIT_DELETE_POLICY}/${id}`
          : API_ENDPOINTS.ADD_POLICY,
        data: JSON.stringify({
          title: values.title,
          document: document,
          startDate: values.startDate,
          endDate: values.endDate,
          description: values.description,
          pageCount: pageCount || 0,
        }),
      });
      if (policyAdded?.settings?.success) {
        handleNotifications("success", policyAdded?.settings?.message, "", 3);
        router.push("/template/policies");
      } else {
        handleNotifications("error", policyAdded?.settings?.message, "", 3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileUploading = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      let uploadRes = await uploadFile(selectedFile);
      if (uploadRes?.settings?.success) {
        setDocument(uploadRes?.data?.name);
        setPageCount(uploadRes?.data?.pageCount);
        handleNotifications("success", "File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      handleNotifications("error", "File upload failed.");
    }
  };

  useEffect(() => {
    if (policyDetails) {
      setDocument(policyDetails.document);
    }
  }, [policyDetails]);

  return (
    <SidebarLayout>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/template/policies")}
          >
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 text-[22px] font-semibold leading-6">
            {id && !viewOnly
              ? "Update Policies"
              : viewOnly
              ? "View Policies"
              : "Add Policies"}
          </Text>
        </Space>
        <Card className="custom-card">
          <div className="flex items-center">
            <Formik
              initialValues={policyDetails || initialValues}
              validationSchema={PolicySchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({isSubmitting, errors, resetForm, values, setFieldValue}) => {
                return (
                  <Form className="w-full">
                    <Row
                      className="mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={24}>
                        <CustomInput
                          label="Title"
                          type="text"
                          required
                          name="title"
                          as={Input}
                          className={errors.title && " !border !border-red"}
                          size="large"
                          placeholder="Please Type..."
                          status={errors.title && "error"}
                          error={<ErrorMessage name="title" />}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={24}>
                        <div className="text-[#333333] text-[16px] font-[400] leading-[24px]">
                          Upload a PDF file
                        </div>
                        <div className="flex border rounded-[5px]">
                          <div
                            className="w-full pl-[12px] flex justify-start items-center"
                            // @ts-ignore
                            disabled={viewOnly}
                          >
                            {document}
                          </div>
                          <div className="flex justify-center items-center px-[16px] py-[8px] bg-[#f2f2f2]">
                            <label
                              htmlFor="document"
                              className="cursor-pointer"
                            >
                              Browse
                            </label>
                            <input
                              disabled={viewOnly}
                              id="document"
                              name="document"
                              type="file"
                              accept=".pdf"
                              onChange={(event) => {
                                fileUploading(event);
                                setFieldValue(
                                  "document",
                                  event.currentTarget.files?.[0] || ""
                                );
                              }}
                              style={{display: "none"}}
                            />
                          </div>
                        </div>
                        <ErrorMessage
                          name="document"
                          component="div"
                          className="field-error"
                        />
                      </Col>
                    </Row>
                    <Row
                      className="mt-[20px]"
                      gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                    >
                      <Col className="gutter-row" span={24}>
                        <Field name="description">
                          {({field}: any) => (
                            <Editor
                              editorData={values.description || ""}
                              handleEditorChange={(content: string) =>
                                setFieldValue("description", content)
                              }
                              readonly={viewOnly}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="field-error"
                        />
                      </Col>
                    </Row>

                    <div>
                      <div className="text-[#333333] text-[18px] font-[700] leading-[20px] mt-5">
                        Set Policy Duration
                      </div>
                      <Row
                        className="mt-[20px]"
                        gutter={{xs: 8, sm: 16, md: 24, lg: 32}}
                      >
                        <Col className="gutter-row" span={12}>
                          <div className="flex flex-col items-start gap-[5px]">
                            <div className="flex border w-full rounded-[5px] h-[40px]">
                              <div className="flex item-center bg-[#f2f2f2] p-[8px] h-full">
                                <CalendarOutlined />
                              </div>
                              <DatePicker
                                className="border-none rounded-none w-full h-full"
                                format="YYYY/MM/DD"
                                suffixIcon={<CaretDownOutlined />}
                                value={
                                  values.startDate
                                    ? dayjs(values.startDate)
                                    : null
                                }
                                onChange={(date, dateString) =>
                                  setFieldValue(
                                    "startDate",
                                    date ? date.valueOf() : null
                                  )
                                }
                                disabled={viewOnly}
                              />
                            </div>
                            <div className="text-[#828282] text-[12px] font-[400] leading-[16px]">
                              Start of the policy period
                            </div>
                            <ErrorMessage
                              name="startDate"
                              component="div"
                              className="field-error"
                            />
                          </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <div className="flex flex-col items-start gap-[5px]">
                            <div className="flex border w-full rounded-[5px] h-[40px]">
                              <div className="flex item-center bg-[#f2f2f2] p-[8px] h-full">
                                <CalendarOutlined />
                              </div>
                              <DatePicker
                                className="border-none rounded-none w-full h-full"
                                format="YYYY/MM/DD"
                                suffixIcon={<CaretDownOutlined />}
                                value={
                                  values.endDate ? dayjs(values.endDate) : null
                                }
                                onChange={(date, dateString) =>
                                  setFieldValue(
                                    "endDate",
                                    date ? date.valueOf() : null
                                  )
                                }
                                disabled={viewOnly}
                              />
                            </div>
                            <div className="text-[#828282] text-[12px] font-[400] leading-[16px]">
                              End of the policy period
                            </div>
                            <ErrorMessage
                              name="endDate"
                              component="div"
                              className="field-error"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {!viewOnly && (
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
                          onClick={() => router.push("/template/policies")}
                          className="text-[#4379EE] text-[16px] font-bold leading-[24px] pt-2 cursor-pointer"
                        >
                          Cancel
                        </div>
                      </div>
                    )}
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
export default AddEditPolicy;
