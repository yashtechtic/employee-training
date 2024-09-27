import LineComponent from "@/components/Icons/Line";
import AuthLayoutWrapper from "@/components/Layout/AuthLayoutWrapper";
import { FC } from "react";
import { ErrorMessage, Form, Formik } from "formik";
import { forgotPasswordValidationSchema } from "@/src/helper/ValidationSchema";
import { Button, Col, Input, Row } from "antd";
import CustomInput from "@/components/CustomInput";
import EmailIcon from "@/components/Icons/EmailIcon";
import BackIcon from "@/components/Icons/BackIcon";
import axiosInstance from "../interceptors/Axios";
import { API_ENDPOINTS } from "../interceptors/apiName";
import { useNotification } from "../components/Notification";
import { useRouter } from "next/router";
const initialValues = { email: "" };

const ForgotPassword: FC = () => {
  const router = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const handleSubmit = async (values: any) => {
    console.log("values :>> ", values);
    try {
      
      let emailSend:any = await axiosInstance.post(API_ENDPOINTS.COMPANY_FORGOT_PASSWORD, JSON.stringify(values));
      if(emailSend?.settings?.success){
        handleNotifications('success', emailSend?.settings?.message, '', 3);
      } else{
        handleNotifications('error', emailSend?.settings?.message, '', 3);
      }
    } catch (error:any) {
      handleNotifications('error', error?.response?.data?.settings?.message, '', 3);
    }
  };
  return (
    <>
      <AuthLayoutWrapper>
        <div>
          <div className="text-[35px] text-[#313D4F]  font-bold leading-[40px]">
            Forgot Your Password?
          </div>

          <div className="text-[16px]  font-normal leading-[24px] text-[#4F4F4F] py-[5px]">
            Enter your email address below and we&apos;ll get back to you.
          </div>
          <div className="flex justify-center items-center mb-[30px]">
            <LineComponent />
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors }) => {
                return (
                  <Form className="w-full">
                    <Row className="sm:mb-5">
                      <Col span={24} className="text-left flex mb-5 sm:mb-0">
                        <CustomInput
                          label="User Name"
                          required
                          type="text"
                          name="username"
                          prefix={
                            <span className="p-1">
                              <EmailIcon />{" "}
                            </span>
                          }
                          as={Input}
                          className={errors.email && " !border !border-red"}
                          size="large"
                          placeholder="Enter your email"
                          status={errors.email && "error"}
                          error={<ErrorMessage name="email" />}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Button
                          loading={isSubmitting}
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="w-full common-button common-button-light-blue"
                        >
                          Submit
                        </Button>
                      </Col>

                      <Col span={24} className="pt-[30px]">
                        <Button
                          type="link"
                          onClick ={()=>router.push('/login')}
                          size="large"
                          className="flex items-center justify-center w-full common-button common-button-light-blue"
                        >
                          <span>
                            <BackIcon />
                          </span>
                          <span>Back to sign in</span>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </AuthLayoutWrapper>
    </>
  );
};
export default ForgotPassword;
