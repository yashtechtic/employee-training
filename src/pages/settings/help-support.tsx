import CustomInput from "@/src/components/CustomInput";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { companySupportSchema } from "@/src/helper/ValidationSchema";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import { Button, Card, Col, Divider, Input, Row } from "antd";
import { ErrorMessage, Form, Formik } from "formik";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
const initialValues = {
  companyName: "",
  companyEmail: "",
  contactNumber: "",
  message: "",
};
const HelpSupport: FC = () => {
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const currentUser = useSelector((state: any) => state.userReducer.user);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);
  const fetchCompanyDetails = async () => {
    try {
      let companyDetails: any = await axiosInstance.get(
        `${API_ENDPOINTS.COMPANY_Details_API}/${currentUser?.companyId}`
      );
      if (companyDetails?.settings?.success) {
        setCompanyDetails(companyDetails?.data);
      }
    } catch (error) { }
  };
  const handleSubmit = async(values:any) => {
    try {
      
    } catch (error) {
      
    }
  };

  return (
    <SidebarLayout>
      <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
        Help/Support/Contact
      </div>
      <Card className="custom-card">
        <Formik
          initialValues={companyDetails ||initialValues}
          validationSchema={companySupportSchema}
          onSubmit={handleSubmit} enableReinitialize
        >
          {({ isSubmitting, errors }) => {
            return (
              <Form>
                <Row gutter={16}>
                  {/* First Row */}
                  <Col span={12}>
                    <div className="">
                      <CustomInput
                        type={"text"}
                        label="Company Name"
                        name={"companyName"}
                        as={Input}
                        size="large"
                        placeholder={"Enter company name"}
                        status={errors.companyName && "error"}
                        error={<ErrorMessage name="companyName" />} disabled readOnly
                      />
                    </div>
                    <div className="mt-[20px]">
                      <CustomInput
                        type={"email"}
                        label="Email"
                        name={"companyEmail"}
                        as={Input}
                        size="large"
                        placeholder={"Enter company email"}
                        status={errors.companyEmail && "error"}
                        error={<ErrorMessage name="companyEmail" />} disabled readOnly
                      />
                    </div>
                    <div className="mt-[20px]">
                      <CustomInput
                        type={"text"}
                        label="Contact Number"
                        name={"contactNumber"}
                        as={Input}
                        size="large"
                        placeholder={"Enter contact number"}
                        status={errors.contactNumber && "error"}
                        error={<ErrorMessage name="contactNumber" />}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="flex flex-col h-full">
                      <CustomInput
                        type={"message"}
                        label="Message"
                        name={"message"}
                        as={Input.TextArea}
                        size="large"
                        placeholder={"Enter company Email"}
                        status={errors.message && "error"}
                        error={<ErrorMessage name="message" />}
                        autoSize={{ minRows: 8, maxRows: 6 }}
                        maxInput={500}
                      />
                    </div>
                  </Col>
                </Row>
                <Button
                  loading={isSubmitting}
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-[118px] mt-[30px] common-button common-button-light-blue"
                >
                  Submit
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </SidebarLayout>
  );
};

export default HelpSupport;
