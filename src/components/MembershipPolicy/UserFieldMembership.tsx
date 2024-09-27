import { FC, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import type { FormProps } from "antd";
import { Button, Col, Form, Input, Row, Select } from "antd";

import DownArrow from "../Icons/DownArrow";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import { useNotification } from "../Notification";
import TagInputField from "../TagInputField";

type FieldType = {
  groupName: string;
  user_profile_attribute: string;
  condition: string;
  comparison: string;
  value: string;
};

type GetFormFieldType = {
  label: string;
  name: "user_profile_attribute" | "condition" | "comparison" | "value";
  type: string;
  errorMsg: string;
};

const getFormLabel = (name: string | number) => (
  <div
    className="text-[16px] font-[400] text-[#000000]"
    style={{ marginBottom: -10 }}
  >
    {name}
  </div>
);

const UserFieldMembership: FC<any> = ({ membershipFormDetails, setUsers }) => {
  const [form] = Form.useForm();
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [loading, setLoading] = useState<boolean>(false);
  const [inputTags, setInputTags] = useState<string[]>([]);

  const getSelectElementOptions = (fieldName: string) => {
    return (
      membershipFormDetails?.formFields?.length &&
      membershipFormDetails?.formFields?.map((field: any) => {
        if (field.fieldName === fieldName) {
          return (
            field?.fieldValues?.length &&
            field?.fieldValues?.map((fieldValue: any) => (
              <Select.Option
                key={fieldValue.valueId}
                value={fieldValue.valueId}
              >
                {fieldValue.value}
              </Select.Option>
            ))
          );
        }
      })
    );
  };

  const getElement = (fieldName: string) => {
    if (fieldName === "user_profile_attribute") {
      return getSelectElementOptions("User Field");
    }
    if (fieldName === "condition") {
      return getSelectElementOptions("Condition");
    }
    if (fieldName === "comparison") {
      return getSelectElementOptions("Comparison");
    }
  };

  const getDynamicField = (type: string, name: string) => {
    if (type === "select") {
      return (
        <Select
          size={"large"}
          showSearch={false}
          style={{ height: "40px", width: "100%" }}
          className="custom-select"
          placeholder="Please Select"
          suffixIcon={<DownArrow />}
        >
          {getElement(name)}
        </Select>
      );
    }
    if (type === "input") {
      return <TagInputField setTags={setInputTags} tags={inputTags} />;
      return (
        <Input
          style={{ height: "40px" }}
          className="custom-input"
          placeholder="Please Enter Value"
        />
      );
    }
  };

  const getFormField = ({ label, name, errorMsg, type }: GetFormFieldType) => (
    <Form.Item<FieldType>
      label={getFormLabel(label)}
      name={name}
      rules={[{ required: true, message: errorMsg }]}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ marginBottom: 0 }}
    >
      {getDynamicField(type, name)}
    </Form.Item>
  );

  const getFieldId = (fieldName: string) => {
    return membershipFormDetails?.formFields?.length
      ? membershipFormDetails.formFields.find(
          (field: any) => field.fieldName === fieldName
        )?.fieldId
      : null;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (Object.keys(values).length) {
      const payload = {
        isNormalGroup: false,
        formId: membershipFormDetails?.formId,
        groupName: values.groupName,
        formContent: {
          user_profile_attribute: {
            fieldId: getFieldId("User Field"),
            valueId: values.user_profile_attribute,
          },
          condition: {
            fieldId: getFieldId("Condition"),
            valueId: values.condition,
          },
          comparison: {
            fieldId: getFieldId("Comparison"),
            valueId: values.comparison,
          },
          value: values.value,
        },
      };
      setLoading(true);
      try {
        const result: any = await axiosInstance.post(
          `${API_ENDPOINTS.CREATE_GROUP}`,
          payload
        );
        if (Object.keys(result).length && result?.settings?.success) {
          resetData();
          setUsers(result?.data?.users);
          handleNotifications(`success`, `${result?.settings?.message}`, ``, 3);
        } else {
          handleNotifications(`error`, `${result?.settings?.message}`, ``, 3);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const resetData = (alsoUsers = false) => {
    form.resetFields();
    setInputTags([]);
    alsoUsers && setUsers([]);
  };

  useEffect(() => {
    form.setFieldsValue({
      value: inputTags,
    });
  }, [inputTags]);

  useEffect(() => {
    return () => {
      resetData(true);
    };
  }, []);

  return (
    <div>
      <Form
        form={form}
        name="UserFieldMembershipForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark="optional"
      >
        <Form.Item<FieldType>
          label={getFormLabel("Group Name")}
          name="groupName"
          rules={[{ required: true, message: "Please input your group name" }]}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input
            // value={groupName}
            // onChange={handleChangeGroupName}
            style={{ height: "40px" }}
            className="custom-input"
            placeholder="Please Type..."
          />
        </Form.Item>

        <div className="mt-[30px] text-[18px] font-[700] text-[#333333]">
          User Field
        </div>

        <Row gutter={[30, 10]}>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "User Profile Attribute",
              name: "user_profile_attribute",
              errorMsg: "Please input your group name",
              type: "select",
            })}
          </Col>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Condition",
              name: "condition",
              errorMsg: "Please select condition",
              type: "select",
            })}
          </Col>
        </Row>

        <Row gutter={[30, 10]}>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Comparison",
              name: "comparison",
              errorMsg: "Please select comparison",
              type: "select",
            })}
          </Col>
          <Col xs={24} lg={12}>
            {getFormField({
              label: "Value",
              name: "value",
              errorMsg: "Please enter value",
              type: "input",
            })}
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <div className="flex mt-5 text-[16px] font-[700]">
            <Button
              className="text-[16px] font-[700] py-3 px-6 flex items-center"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Save
            </Button>
            <Button
              disabled={loading}
              className="text-[16px] font-[700] text-[#4379EE] py-3 px-6 flex items-center"
              type="link"
              size="large"
              onClick={() => router.push("/users/manage-groups")}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserFieldMembership;
