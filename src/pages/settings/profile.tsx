import CustomInput from "@/src/components/CustomInput";
import CustomSelect from "@/src/components/CustomSelect";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { useNotification } from "@/src/components/Notification";
import ProfileUpload from "@/src/components/ProfileUploader";
import uploadFile from "@/src/helper/UploadFIle";
import {
  companyProfileAPIKeyValidationSchema,
  companyProfileValidationSchema,
} from "@/src/helper/ValidationSchema";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { Button, Card, Col, Divider, Input, Row } from "antd";
import { ErrorMessage, Form, Formik } from "formik";
import { Head } from "next/document";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const initialValues = {
  companyName: "",
  companyEmail: "",
  address: "",
  city: "",
  stateId: "",
  countryId: "",
};
const initialValuesApiKey = {
  apiKey: "5s464sd6f54g6sdf46gsdf32",
  postmanCollection: "https://www.w3.org/Provider/Style/dummy.html",
};
const CompanyProfile: FC<any> = ({ country }) => {
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [companyLogo, setCompanyLogo] = useState<any>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<any>(null);
  const [companyLogoToggle, setCompanyLogoToggle] = useState(false);
  const [logoName, setLogoName] = useState(null);
  const defaultImg = "/DefaultImage.png";
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  useEffect(() => {
    fetchCountry();
    fetchCompanyDetails();
  }, []);
  const fetchCompanyDetails = async () => {
    try {
      let companyDetails: any = await axiosInstance.get(
        `${API_ENDPOINTS.COMPANY_Details_API}/${currentUser?.companyId}`
      );
      if (companyDetails?.settings?.success) {
        setCompanyDetails(companyDetails?.data);
        setCountryId(companyDetails?.data?.countryId);
        setStateId(companyDetails?.data?.stateId);
        setCompanyLogo(companyDetails?.data?.imageUrl);
      }
    } catch (error) { }
  };
  const fetchCountry = async () => {
    try {
      const countryList = await axiosInstance.get(
        API_ENDPOINTS.COUNTRY_LIST_API
      );
      setCountryList(countryList.data);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  useEffect(() => {
    if (countryId) {
      getStates();
    }
  }, [countryId]);

  const getStates = async () => {
    try {
      const states = await axiosInstance.get(
        `${API_ENDPOINTS.STATE_API}?countryId=${countryId}`
      );
      setStateList(states.data || []);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const handleSubmit = async (values: any) => {
    try {
      delete values.companyName;
      delete values.state;
      delete values.country;
      delete values.logoUrl;
      delete values.imageUrl;
      delete values.subscription;
      delete values.recentExpiredSubscription
      if (companyLogoToggle && logoName) {
        values.logo = logoName;
      }
      let submitCompany: any = await axiosInstance.put(`${API_ENDPOINTS.COMPANY_PROFILE_API}/${currentUser?.companyId}`, JSON.stringify({ ...values, stateId: values.stateId, countryId: countryId }));
      if (submitCompany?.settings?.success) {
        handleNotifications('success', 'Successfully company profile updated', '', 3);
        fetchCompanyDetails()
        setCompanyLogoToggle(false);
      }
    } catch (error) {
      handleNotifications('error', 'something went wrong', '', 3);
    }
  };
  const handleApiSubmit = async (values: any) => { };
  const fileUploading = async () => {
    try {
      let uploadRes = await uploadFile(companyLogoFile);
      if (uploadRes?.settings?.success) {

        setLogoName(uploadRes?.data?.name);
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    if (companyLogoToggle && companyLogo) {
      fileUploading()
    }
  }, [companyLogo])
  return (
    <>
      <SidebarLayout>
        <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
          Company Profile Management
        </div>
        <Card className="rounded-[14px] border border-[#E8E8E8] bg-white bordered-[14px]">
          <div className="mt-[5px] mx-[5px] font-[700] text-[18px] text-[#333]">
            Company Profile
          </div>
          <Divider className="custom-divider" />
          <div className=" flex items-center justify-center lg:mb-[43px] mb-[20px]">
            <ProfileUpload
              defaultImage={companyLogo || defaultImg}
              onImageChange={(value) => {
                setCompanyLogo(value.base64);
                setCompanyLogoFile(value?.file);
                setCompanyLogoToggle(true)
              }}
            />
          </div>
          <Formik
            initialValues={companyDetails || initialValues}
            validationSchema={companyProfileValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, values, setFieldValue }) => {
              return (
                <Form className="w-full">
                  <div className="flex items-center justify-between w-full space-x-2 mb-[20px]">
                    <CustomInput
                      label="Company Name"
                      required
                      type="text"
                      name="companyName"
                      as={Input}
                      className={errors.companyName && " !border !border-red"}
                      size="large"
                      placeholder="Enter your company name"
                      status={errors.companyName && "error"}
                      error={<ErrorMessage name="companyName" />}
                      defaultValue={values?.companyName}
                      disabled

                    />

                    <CustomInput
                      label="Email Address"
                      required
                      type="text"
                      name="companyEmail"
                      as={Input}
                      className={
                        errors.companyEmail && " !border !border-red"
                      }
                      size="large"
                      placeholder="Enter your email"
                      status={errors.companyEmail && "error"}
                      error={<ErrorMessage name="companyEmail" />}
                      defaultValue={values.companyEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between w-full space-x-2 mb-[20px]">
                    <CustomInput
                      label="Address"
                      required
                      type="text"
                      name="address"
                      as={Input}
                      className={errors.address && " !border !border-red"}
                      size="large"
                      placeholder="Enter your address"
                      status={errors.address && "error"}
                      error={<ErrorMessage name="address" />}
                      defaultValue={values.address}
                      maxInput={255}

                    />

                    <CustomInput
                      label="City"
                      required
                      name="city"
                      type="text"
                      className={errors.state && " !border !border-red"}
                      placeholder="Enter your city"
                      defaultValue={values.city}
                      error={<ErrorMessage name="city" />}
                      as={Input}
                      size="large"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full space-x-2 mb-[20px]">
                    <CustomSelect
                      label="State"
                      required
                      name="stateId"
                      className={errors.state && " !border !border-red"}
                      placeholder="Enter your state"
                      options={stateList.map((item: any) => {
                        return {
                          label: item.state,
                          value: item.stateId,
                        };
                      })}
                      defaultValue={values.stateId}
                      error={<ErrorMessage name="stateId" />}
                      onSelect={(value: any) => {
                        setFieldValue("stateId", value);
                        setStateId(value);
                      }}
                    />

                    <CustomSelect
                      label="Country"
                      required
                      name="countryId"
                      className={errors.country && " !border !border-red "}
                      placeholder="Enter your country"
                      onSelect={(value: any) => {
                        setCountryId(value);
                        setFieldValue("countryId", value);
                      }}
                      defaultValue={countryId}
                      options={countryList.map((item: any) => {
                        return {
                          label: item.country,
                          value: item.countryId,
                        };
                      })}
                      error={<ErrorMessage name="countryId" />}
                    />
                  </div>
                  <div>
                    <Button className="custom-btn"
                      type="primary"
                      htmlType="submit" loading={isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>
        <Card className="mt-[20px] bordered-[14px]">
          <div className="mt-[5px] mx-[5px] font-[700] text-[18px] text-[#333]">
            My API Key & Postman Collection
          </div>
          <Divider className="custom-divider" />
          <Formik
            initialValues={initialValuesApiKey}
            validationSchema={companyProfileAPIKeyValidationSchema}
            onSubmit={handleApiSubmit}
          >
            {({ isSubmitting, errors, values }) => {
              return (
                <Form className="w-full">
                  <Form className="w-full">
                    <div className="flex items-center justify-between w-full space-x-2 mb-[20px]">
                      <CustomInput
                        label="API Key"
                        disabled
                        type="text"
                        name="apiKey"
                        as={Input}
                        className={errors.apiKey && " !border !border-red"}
                        size="large"
                        placeholder="Enter your company name"
                        status={errors.apiKey && "error"}
                        error={<ErrorMessage name="apiKey" />}
                        defaultValue={values.apiKey}

                      />

                      <CustomInput
                        label="Postman Collection"
                        required
                        type="text"
                        disabled
                        name="postmanCollection"
                        as={Input}
                        className={
                          errors.postmanCollection && " !border !border-red"
                        }
                        size="large"
                        placeholder="Enter postman collection link"
                        status={errors.postmanCollection && "error"}
                        error={<ErrorMessage name="postmanCollection" />}
                        defaultValue={values.postmanCollection}
                      />
                    </div>
                    {/* <div>
                      <Button type="primary" className="custom-btn">
                        Save
                      </Button>
                    </div> */}
                  </Form>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </SidebarLayout>
    </>
  );
};
export default CompanyProfile;
