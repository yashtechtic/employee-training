import CustomInput from "@/components/CustomInput";
import LineComponent from "@/components/Icons/Line";
import PasswordIcon from "@/components/Icons/PasswordIcon";
import AuthLayoutWrapper from "@/components/Layout/AuthLayoutWrapper";
import { loginSchema } from "@/src/helper/ValidationSchema";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Row, Typography } from "antd";
import { ErrorMessage, Form, Formik } from "formik";
import { NextRouter, useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "../interceptors/apiName";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useNotification } from "../components/Notification";
import { config } from "../helper/config";
import { useDispatch } from "react-redux";
import { setUserAction } from "../store/user";
import withAdminAuth from "../lib/WithAdminLogin";
import { useSelector } from "react-redux";
import LoginAvatar from "../components/Icons/LoginAvatar";

const { Text } = Typography;

const initialValues = {
  username: "",
  password: "",
};
type initialValuesProps = {
  username: string | undefined;
  password: string | undefined;
};

const Login: FC = () => {
  const router: NextRouter = useRouter();
  const { asPath, query } = router;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  // const url = `${protocol}//${hostname}${port}${asPath}`;
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.userReducer.user);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    console.log('accessToken :>> ', accessToken,currentUser);
    if (accessToken && Object.keys(currentUser).length !== 0) {
      router.push("/dashboard");
    }
  }, []);
  const handleSubmit = async (values: initialValuesProps) => {
    try {
      const { username, password } = values;
      if (username && password) {
        let host = config.getSubdomain();
        console.log("host :>> ", host);
        if (host) localStorage.setItem("tenantId", host);
        axiosInstance.defaults.headers["tenantId"] = host;
        const loginManually: any = await axiosInstance.post(
          API_ENDPOINTS.Employee_LOGIN,
          {
            email: username.trim(),
            password: password.trim(),
          }
        );
        if (loginManually?.settings?.success) {
          handleNotifications("success", "Successfully Logged In", "", 3);
          dispatch(setUserAction(loginManually.data));
          console.log("object :>> ", loginManually.data.access_token);
          localStorage.setItem("token", loginManually.data.access_token);

          router.push("/dashboard");
        } else {
          handleNotifications("error", loginManually?.settings?.message, "", 3);
        }
      }
    } catch (error: any) {
      console.log(error);
      handleNotifications("success", error?.message, "", 3);
    }
  };
  return (
    <AuthLayoutWrapper title="Welcome Back!!" subtitle="Login here">
      <div>
        <div className="text-[35px] text-[#313D4F]  font-bold leading-[40px]">
          Login
        </div>

        <div className="text-[16px]  font-normal leading-[24px] text-[#4F4F4F] py-[5px]">
          Enter your email address and password to log in.
        </div>
        <div className="flex justify-center items-center mb-[30px]">
          <LineComponent />
        </div>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => {
              return (
                <Form className="w-full">
                  <Row className="sm:mb-5">
                    <Col span={24} className="text-left flex mb-5 sm:mb-0">
                      <CustomInput
                        labelClass="!text-[16px] !text-[#333] font-[400]"
                        label="User Name"
                        required
                        type="text"
                        name="username"
                        prefix={<LoginAvatar  color={errors.username ? "#ff4d4f" : "#828282"} />}
                        as={Input}
                        className={errors.username && " !border !border-red"}
                        size="large"
                        placeholder="Enter your username"
                        status={errors.username && "error"}
                        error={<ErrorMessage name="username" />}
                      />
                    </Col>
                  </Row>

                  <Row className="sm:mb-5">
                    <Col span={24} className="text-left  mb-5 sm:mb-0">
                      <CustomInput
                        label="Password"
                        labelClass="!text-[16px] !text-[#333] font-[400]"
                        required
                        type={"password"}
                        name="password"
                        as={Input.Password}
                        className="login-password"
                        size="large"
                        placeholder="Enter your password"
                        error={<ErrorMessage name="password" />}
                        status={errors.password && "error"}
                        prefix={
                          <span className="" p-1>
                            <PasswordIcon
                              color={errors.password ? "#ff4d4f" : "#828282"}
                            />
                          </span>
                        }
                        iconRender={(visible) => {
                          return visible ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          );
                        }}
                      />
                    </Col>
                  </Row>
                  <div className="mb-[30px] mt-[20px] sm:flex sm:justify-end sm:my-3">
                    <Row gutter={16} className=" sm:mt-0">
                      <Col span={24}>
                        <div
                          className="cursor-pointer text-[#4379EE] text-[16px] leading-[22px] font-[600] text-right"
                          onClick={() => router.push("/forgot-password")}
                        >
                          Forgot Password?
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col span={24}>
                      <Button
                        loading={isSubmitting}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full h-[50px] common-button common-button-light-blue text-[16px] font-[700]"
                      >
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
          <div className="text-[#828282] text-[14px] font-[300] mt-[80px] flex justify-center">
           <div> By logging in, you agree to Skillo.Ai </div>&nbsp;{" "}
            <div className="cursor-pointer text-[#828282] hover:text-blue-600" onClick={()=>router.push('/privacy-policy')}>
              {" "}
              Terms of Use and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </AuthLayoutWrapper>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const host =await config.getSubdomain(context?.req);
  try {
    const response:any = await axiosInstance.get(`/company/check-tenant/${host}`);
    if (response?.settings?.success) {
      return {
        props: {}, // Tenant exists, proceed to render the login page
      };
    }else{
      return {
        redirect: {
          destination: `/404?tenant=${host}`,
          permanent: false,
          
        },
      };
    }
  } catch (error) {
    console.log('error :>> ', error);
    return {
      redirect: {
        destination: `/404?tenant=${host}`,
        permanent: false,
      },
    };
  }
};
export default Login;
