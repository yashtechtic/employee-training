import CustomInput from "@/components/CustomInput";
import {companyPhishingDestinationValidationSchema} from "@/src/helper/ValidationSchema";
import {Button, Card, Input} from "antd";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from "formik";
import {NextRouter, useRouter} from "next/router";
import {FC, useEffect, useState} from "react";
import Editor from "@/src/components/Editor";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import axiosInstance from "@/src/interceptors/Axios";
import {API_ENDPOINTS} from "@/src/interceptors/apiName";
import {useNotification} from "@/src/components/Notification";

const initialValues = {
  title: "",
  content: "",
  url: "",
};

type InitialValuesProps = {
  title: string;
  content: string;
  url: string;
};

interface CreatePhishingProps {
  id?: any;
  viewOnly?: boolean;
}

const CreatePhishing: FC<CreatePhishingProps> = ({id, viewOnly}) => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const isEditing = !!id;
  const [fetchedData, setFetchedData] = useState<InitialValuesProps | null>();

  const getPhishingListById = async (id: number) => {
    try {
      let getPhishingById: any = await axiosInstance.get(
        `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
      );
      if (getPhishingById?.settings?.success) {
        console.log(getPhishingById?.data?.content, "temp");
        const editPhishingData = {
          title: getPhishingById?.data?.title ?? "",
          content: getPhishingById?.data?.content ?? "",
          url: getPhishingById?.data?.url ?? "",
        };
        setFetchedData(editPhishingData);
      } else {
        console.log("Get the data");
      }
    } catch (error) {
      console.error("Error deleting phishing destination:", error);
    }
  };

  useEffect(() => {
    if (isEditing) {
      getPhishingListById(id);
    }
  }, [isEditing, id]);

  // const handleSubmit = async (
  //   values: InitialValuesProps,
  //   {resetForm}: FormikHelpers<InitialValuesProps>
  // ) => {
  //   try {
  //     values.title, values.url, values.content;
  //     let submitPhishing: any = await axiosInstance.post(
  //       `${API_ENDPOINTS.Create_Phishing_Destination}`,
  //       JSON.stringify({
  //         ...values,
  //       })
  //     );
  //     if (submitPhishing?.settings?.success) {
  //       handleNotifications(
  //         "success",
  //         "Landing Page added successfully",
  //         "",
  //         3
  //       );
  //       resetForm({values: initialValues});
  //       router.push("/phishing/phishing-destination");
  //     } else {
  //       handleNotifications("error", submitPhishing?.settings?.message, "", 3);
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     handleNotifications("success", error?.message, "", 3);
  //   }
  // };

  const handleSubmit = async (
    values: InitialValuesProps,
    {resetForm}: FormikHelpers<InitialValuesProps>
  ) => {
    try {
      const endpoint = isEditing
        ? `${API_ENDPOINTS.Delete_View_Phishing}/${id}`
        : API_ENDPOINTS.Create_Phishing_Destination;

      const method = isEditing ? "put" : "post";
      const response: any = await axiosInstance[method](
        endpoint,
        JSON.stringify(values)
      );

      if (response?.settings?.success) {
        const successMessage = isEditing
          ? "Landing Page updated successfully"
          : "Landing Page added successfully";
        handleNotifications("success", successMessage, "", 3);
        resetForm({values: initialValues});
        router.push("/phishing/phishing-destination");
      } else {
        handleNotifications("error", response?.settings?.message, "", 3);
      }
    } catch (error: any) {
      console.error(error);
      handleNotifications("error", error?.message, "", 3);
    }
  };
  return (
    <SidebarLayout>
      <div className="flex">
        <div
          onClick={() => router.push("/phishing/phishing-destination")}
          className="pt-2 cursor-pointer"
        >
          <LeftArrowIcon />
        </div>
        <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px] ml-2">
          {id && !viewOnly ? "Edit" : viewOnly ? "View" : "Create"} Phishing
          Destination Page
        </div>
      </div>
      <Card>
        <Formik
          initialValues={fetchedData || initialValues}
          validationSchema={companyPhishingDestinationValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({isSubmitting, errors, values, setFieldValue}) => {
            return (
              <Form className="w-full">
                <div className="flex items-center  w-full space-x-2 mb-[20px]">
                  <CustomInput
                    label="Title"
                    required
                    type="text"
                    name="title"
                    as={Input}
                    className={errors.title && " !border !border-red"}
                    size="large"
                    placeholder="Enter your title"
                    status={errors.title && "error"}
                    error={<ErrorMessage name="title" />}
                    defaultValue={values.title}
                    maxInput={255}
                    disabled={viewOnly}
                    readOnly={viewOnly}
                  />
                </div>
                <div className="flex items-center  w-full space-x-2 mb-[20px]">
                  <CustomInput
                    label="URL"
                    required
                    type="url"
                    name="url"
                    as={Input}
                    className={errors.url && " !border !border-red"}
                    size="large"
                    placeholder="Enter your url"
                    status={errors.url && "error"}
                    error={<ErrorMessage name="url" />}
                    defaultValue={values.url}
                    maxInput={255}
                    disabled={viewOnly}
                    readOnly={viewOnly}
                  />
                </div>
                <div className="w-full mb-[20px]">
                  {/* <Editor
                    editorData={values.content}
                    handleEditorChange={(data) => {
                      setFieldValue("content", data);
                    }}

                  /> */}
                  <Field name="content">
                    {({field}: any) => (
                      <Editor
                        editorData={values.content || ""}
                        handleEditorChange={(content: string) =>
                          setFieldValue("content", content)
                        }
                        readonly={viewOnly}
                      />
                    )}
                  </Field>
                <ErrorMessage
                  name="content"
                  component="div"
                  className="field-error"
                />
                </div>
                <div>
                  {viewOnly ? (
                    ""
                  ) : (
                    <Button
                      className="custom-btn"
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}
                    >
                      {id ? "Update" : "Create"}
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </SidebarLayout>
  );
};

export default CreatePhishing;
