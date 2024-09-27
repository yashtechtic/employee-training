import {
    Col,
    Row,
    Space,
    Typography,
    Input,
    Steps,
    Button,
    Card,
    Radio,
    theme,
    DatePicker,
    TimePicker,
    Checkbox,
} from "antd";
import { FC, useState } from "react";
import BackArrowIcon from "../Icons/BackArrowIcon";
import { useRouter } from "next/router";
import { ErrorMessage, Form, Formik } from "formik";
import {
    addPhishingProgramValidationSchema1,
    addPhishingProgramValidationSchema2,
} from "@/src/helper/ValidationSchema";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import DateIcon from "../Icons/DateIcon";
import TimeIcon from "../Icons/TimeIcon";
import moment from "moment-timezone";
import QuestionMarkSuggestion from "../QuestionMarkSuggestion";
type AddPhishingProgramProp = {
    id?: string | string[] | undefined;
};
const initialValues = {
    programName: "",
    sendTo: "",
    selectType: "",
    groupDeptIds: "",
    frequency: "active",
    startDate: "",
    startTime: "",
    timeZoneId: "",
    isSendEmail: "",
    emailOver: "",
    emailOverType: "",
    trackPhishingReply: "",
    trackUserCount: "",
    trackerSendPeriod: "",
    categoryId: "",
    difficultyRating: "",
    phishingTemplateId: "",
    landingPageId: "",
    domainId: "",
    isHideEmailReport: "",
};
const AddPhishingProgram: FC<AddPhishingProgramProp> = ({ id }) => {
    const { Text } = Typography;
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const timezones = moment.tz.names();
    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);
    const Steps1 = () => {
        return (
            <>
                <Formik
                    initialValues={initialValues}
                    onSubmit={next}
                    enableReinitialize
                    validationSchema={addPhishingProgramValidationSchema1}
                >
                    {({ isSubmitting, errors, values, setFieldValue }) => {
                        return (
                            <Form className="px-[30px]">
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                    <Col className="gutter-row" span={24}>
                                        <CustomInput
                                            label="Program Name"
                                            required
                                            type={"text"}
                                            name="programName"
                                            as={Input}
                                            size="large"
                                            placeholder="Please Type..."
                                            error={<ErrorMessage name="programName" />}
                                            status={errors.programName && "error"}
                                        />
                                    </Col>
                                </Row>
                                <Row
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                    className="mt-[20px]"
                                >
                                    <Col className="gutter-row" span={12}>
                                        <CustomSelect
                                            label="Send To"
                                            required
                                            name="sendTo"
                                            placeholder="Send To"
                                            defaultValue={values.sendTo}
                                            size="large"
                                            options={[
                                                { value: "1", label: "All" },
                                                { value: "2", label: "Selected" },
                                            ]}
                                            onSelect={(value) => {
                                                setFieldValue("sendTo", value);
                                            }}
                                            error={<ErrorMessage name="sendTo" />}
                                        />
                                    </Col>
                                    <Col className="gutter-row" span={12}>
                                        <CustomSelect
                                            label="Select Type"
                                            required
                                            name="selectType"
                                            placeholder="Select Type"
                                            defaultValue={values.selectType}
                                            size="large"
                                            options={[
                                                { value: "1", label: "Group" },
                                                { value: "2", label: "Department" },
                                            ]}
                                            onSelect={(value) => {
                                                setFieldValue("selectType", value);
                                            }}
                                            error={<ErrorMessage name="selectType" />}
                                        />
                                    </Col>
                                </Row>
                                <Row
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                    className="mt-[20px]"
                                >
                                    <Col className="gutter-row" span={12}>
                                        <CustomSelect
                                            label="Department"
                                            required
                                            name="groupDeptIds"
                                            placeholder="Department"
                                            defaultValue={values.groupDeptIds}
                                            size="large"
                                            options={[
                                                { value: "1", label: "All" },
                                                { value: "2", label: "Selected" },
                                            ]}
                                            onSelect={(value) => {
                                                setFieldValue("groupDeptIds", value);
                                            }}
                                            error={<ErrorMessage name="groupDeptIds" />}
                                        />
                                    </Col>
                                    <Col className="gutter-row" span={12}></Col>
                                </Row>
                                <Row
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                    className="mt-[20px]"
                                >
                                    <Col className="gutter-row" span={24}>
                                        <Text
                                            className={` text-[#828282] text-[14px] leading-[22px] `}
                                        >
                                            Frequency
                                        </Text>

                                        <Radio.Group
                                            defaultValue={values.frequency || "active"}
                                            size="large"
                                            name="frequency"
                                            id="frequency"
                                            className="w-full mt-[5px]"
                                            onChange={(e) =>
                                                setFieldValue("frequency", e.target.value)
                                            }
                                        >
                                            <Radio.Button
                                                className="w-[25%] text-center custom-tab-frequency"
                                                value="active"
                                            >
                                                Active
                                            </Radio.Button>
                                            <Radio.Button
                                                className="w-[25%] text-center custom-tab-frequency"
                                                value="all"
                                            >
                                                All
                                            </Radio.Button>
                                            <Radio.Button
                                                className="w-[25%] text-center custom-tab-frequency"
                                                value="inactive"
                                            >
                                                Inactive
                                            </Radio.Button>
                                            <Radio.Button
                                                className="w-[25%] text-center custom-tab-frequency"
                                                value="hidden"
                                            >
                                                Hidden
                                            </Radio.Button>
                                        </Radio.Group>
                                        <ErrorMessage name="frequency" component={"div"}>
                                            {(msg) => <div className="text-red-500">{msg}</div>}
                                        </ErrorMessage>
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit" className="mt-[20px]">
                                    Next
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </>
        );
    };
    const Steps2 = () => {
        return (
            <>
                <Formik
                    initialValues={initialValues}
                    onSubmit={next}
                    enableReinitialize
                    validationSchema={addPhishingProgramValidationSchema2}
                >
                    {({ isSubmitting, errors, values, setFieldValue }) => {
                        return (
                            <Form className="px-[30px]">
                                <Row
                                    className="flex-col"
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                >
                                    <Text>Start Date</Text>
                                    <div className="flex mt-[5px]">

                                        <Col className="gutter-row" span={6}>
                                            <DatePicker
                                                className="w-full h-[38px]"
                                                suffixIcon={
                                                    <div className="rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                                                        {" "}
                                                        <DateIcon />
                                                    </div>
                                                }
                                            />
                                            <ErrorMessage name="startDate" component={"div"}>
                                                {(msg) => <div className="text-red-500">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col className="gutter-row " span={6}>
                                            <TimePicker
                                                className="w-full h-[38px]"
                                                suffixIcon={
                                                    <div className="rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                                                        {" "}
                                                        <TimeIcon />
                                                    </div>
                                                }
                                            />
                                            <ErrorMessage name="startTime" component={"div"}>
                                                {(msg) => <div className="text-red-500">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col className="gutter-row " span={12}>
                                            <CustomSelect
                                                name="timeZoneId"
                                                placeholder="Select Time Zone"
                                                options={timezones.map((option: any) => {
                                                    console.log("object", option);
                                                    const offset = moment.tz(option).format("Z");
                                                    const label = `(GMT${offset}) ${option.replace(
                                                        "_",
                                                        " "
                                                    )}`;
                                                    return {
                                                        value: option,
                                                        label: label,
                                                    };
                                                })}
                                                error={<ErrorMessage name="timeZoneId" />}
                                            />
                                        </Col>
                                    </div>
                                </Row>
                                <Row
                                    className="mt-[20px] flex align-center"
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                >
                                    <Text>Email sending period</Text>
                                    <Radio.Group className="flex items-center w-full text-nowrap justify-between mt-[5px]" onChange={(e) => { setFieldValue('emailOverType', e.target.value) }}>
                                        <Col className="gutter-row " span={12}>
                                            <Radio value={1}>
                                                <div className="items-center">
                                                    {" "}
                                                    Send all emails when the program starts
                                                </div>
                                            </Radio>
                                        </Col>

                                        <Col className="gutter-row items-center" span={12}>
                                            <Radio value={2}>
                                                <div className="flex gap-2 items-center">
                                                    <div>Send emails over </div>
                                                    <Input value="0" type="number" name="emailOver" className="h-[40px] w-[100px]" />
                                                    <CustomSelect
                                                        name="emailOverType"
                                                        placeholder="Select Type"
                                                        options={[
                                                            { value: "1", label: "Hour" },
                                                            { value: "2", label: "Day" },
                                                        ]}
                                                        // error={<ErrorMessage name="emailOverType" />}
                                                    />
                                                </div>
                                            </Radio>
                                        </Col>
                                    </Radio.Group>
                                    <ErrorMessage name="emailOverType" component={"div"}>
                                        {(msg) => <div className="text-red-500">{msg}</div>}
                                    </ErrorMessage>
                                </Row>
                                <Row
                                    className="mt-[20px] flex-col align-center"
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                >

                                    <Text>Track User Behavior</Text>
                                    <div className="flex mt-[5px]">

                                        <Col className="flex  gutter-row" span={6}>
                                            <Input type="number" value={0} name="trackUserCount" className="h-[40px]" />
                                        </Col>
                                        <Col className="flex  gutter-row" span={6}>
                                            <CustomSelect
                                                name="trackerSendPeriod"
                                                placeholder="Select Type"
                                                options={[
                                                    { value: "1", label: "Hour" },
                                                    { value: "2", label: "Day" },
                                                ]}
                                            //   error={<ErrorMessage name="trackerSendPeriod" />}
                                            />
                                        </Col>
                                    </div>
                                </Row>
                                <Row
                                    className="mt-[20px]"
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                >
                                    <Col className="gutter-row flex  items-center" span={12}>
                                        <Checkbox name="isSendEmail">
                                            Track Replies to Phishing Emails{" "}
                                        </Checkbox>
                                        <QuestionMarkSuggestion title="Track Replies to Phishing Emails" />
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit" className="mt-[20px]">
                                    Next
                                </Button>
                            </Form>
                        );
                    }}
                </Formik>
            </>
        );
    };
    const { token } = theme.useToken();

    const steps: any = [
        {
            content: <Steps1 />,
        },
        {
            content: <Steps2 />,
        },
    ];

    return (
        <div>
            <Space className="pt-[10px] pb-[30px]">
                <div
                    className="cursor-pointer"
                    onClick={() => router.push("/phishing/program")}
                >
                    <BackArrowIcon />
                </div>
                <Text className="text-gray-700 text-[22px] font-semibold leading-6">
                    {id ? "Update" : "New"} Phishing Program
                </Text>
            </Space>
            <Steps current={current} items={steps} className="custom-steps" />
            <div className="">
                <Card>
                    <div>{steps[current].content}</div>
                </Card>
            </div>
        </div>
    );
};
export default AddPhishingProgram;
