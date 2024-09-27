import BackArrowIcon from "@/src/components/Icons/BackArrowIcon";
import {
  addUpdateAssessmentValidationSchema,
  addUpdateSurveyValidationSchema,
} from "@/src/helper/ValidationSchema";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import CustomInput from "../../CustomInput";
import SurveyFeedback from "../../Icons/SurveyFeedbackIcon";
import CheckMarkIcon from "../../Icons/CheckMarkIcon";
import MultiChoiceIcon from "../../Icons/MultiChoiceIcon";
import QuestionCirclePlusIcon from "../../Icons/QuestionCirclePlusIcon";
import QuestionMinusIcon from "../../Icons/QuestionMinusIcon";
import QuestionPlusIcon from "../../Icons/QuestionPlusIcon";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import { useNotification } from "../../Notification";
import CheckboxIcon from "../../Icons/CheckboxIcon";
import CheckboxUncheckIcon from "../../Icons/CheckboxUncheckIcon";
import CustomSelect from "../../CustomSelect";
import CustomDropdownIcon from "../../Icons/CustomDropdownIcon";
type AddEditAssessmentProps = {
  id?: string | string[] | undefined;
};
type QuestionOption = {
  option: string;
};

type Question = {
  question: string;
  correctAnswer: string;
  questionType: "" | "Yes or No" | "Checkbox" | "Multiple Choice";
  options?: [];
  correctAnsToggle: boolean | undefined | null;
};

type Survey = {
  assessmentTitle: string;
  questions: Question[];
};

const initialValues: Survey = {
  assessmentTitle: "",
  questions: [
    {
      question: "",
      questionType: "",
      correctAnswer: "",
      correctAnsToggle: false,
    },
  ],
};
const AddEditAssessment: FC<AddEditAssessmentProps> = ({ id }) => {
  const router = useRouter();
  const { Text } = Typography;
  const { Option } = Select;
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pastedQuestions, setPastedQuestions] = useState("");
  const [surveyDetails, setSurveyDetails] = useState();
  const getSurveyDetails = async () => {
    let url = `${API_ENDPOINTS.ASSESSMENT_GET}/${id}`;
    const getSurvey: any = await axiosInstance.get(url);
    if (getSurvey?.settings?.success) {
      let qx = {
        ...getSurvey?.data,
        questions: getSurvey?.data.questions.map((question: any) => ({
          ...question,
          correctAnsToggle: true, // Set to true by default if not defined
        })),
      };
      setSurveyDetails(qx);
    }
  };
  useEffect(() => {
    if (id) getSurveyDetails();
  }, [id]);
  const handleCopyQuestions = (questions: Question[]) => {
    if (navigator.clipboard) {
      const questionsJSON = JSON.stringify(questions, null, 2);
      navigator.clipboard
        .writeText(questionsJSON)
        .then(() => {
          handleNotifications(
            "success",
            "Questions copied to clipboard",
            "",
            3
          );
        })
        .catch((err) => {
          handleNotifications(
            "error",
            "Failed to copy questions to clipboard",
            "",
            3
          );
          console.error("Failed to copy: ", err);
        });
    } else {
      handleNotifications(
        "error",
        "Clipboard API not supported in this environment",
        "",
        3
      );
    }
  };

  const handlePasteQuestions = (setFieldValue: any) => {
    try {
      const parsedQuestions = JSON.parse(pastedQuestions);
      if (Array.isArray(parsedQuestions)) {
        setFieldValue("questions", parsedQuestions);
        setIsModalVisible(false);
        handleNotifications("success", "Questions pasted successfully", "", 3);
      } else {
        handleNotifications(
          "error",
          "Invalid format. Please check your input.",
          "",
          3
        );
      }
    } catch (error) {
      handleNotifications(
        "error",
        "Failed to parse questions. Please check your input.",
        "",
        3
      );
    }
  };

  const handleSubmit = async (
    values: Survey,
    {
      setErrors,
      resetForm,
    }: { setErrors: (errors: any) => void; resetForm: () => void }
  ) => {
    try {
      let Url = id
        ? `${API_ENDPOINTS.ASSESSMENT_UPDATE}/${id}`
        : API_ENDPOINTS.ASSESSMENT_ADD;

      const httpMethod = id ? "put" : "post";
      const surveyAdd: any = await axiosInstance.request({
        method: httpMethod,
        url: Url,

        data: JSON.stringify(id ? values : { ...values, status: "Active" }),
      });
      if (surveyAdd.settings?.success) {
        handleNotifications("success", surveyAdd?.settings?.message, "", 3);
        router.push("/surveys/assessment");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  console.log("surveyDetails", surveyDetails);
  return (
    <>
      <div>
        <Space className="pt-[10px] pb-[30px]">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/surveys/assessment")}
          >
            <BackArrowIcon />
          </div>
          <Text className="text-gray-700 text-[22px] font-semibold leading-6">
            {/* {isEditing ? 'Edit Domain' : 'Add Domain'} */}
            {!id ? "Create Assessment" : "Update Assessment"}
          </Text>
        </Space>
        <div className="flex items-center">
          <Formik
            initialValues={surveyDetails || initialValues}
            validationSchema={addUpdateAssessmentValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, resetForm, values, setFieldValue }) => {
              console.log("object :>> ", values, errors);
              if (errors && Object.keys(errors).length > 0) {
                const questionsWithErrors = values.questions.map((question:Question, index) => {
                  // Check if errors.questions[index] is an object and has 'options' property
                  const hasOptionsError = 
                    typeof errors?.questions?.[index] === 'object'  &&
                    (question.questionType === "Multiple Choice" || question.questionType === "Checkbox");
                    
                  return { hasOptionsError, questionIndex: index + 1 };
                });
              
                // Filter out the questions that actually have errors
                const errorQuestions = questionsWithErrors.filter(q => q.hasOptionsError);
                
                if (errorQuestions.length > 0 && isSubmitting) {
                  const questionNumbers = errorQuestions.map(q => q.questionIndex).join(", ");
                  handleNotifications("error", `Please fill all the options for question(s): ${questionNumbers}`, "", 3);
                }
              }
              
              return (
                <Form className="w-full">
                  <Card className="custom-card !py-[18px] !pb-[0px] !pt-[0px] !px-[0px] ">
                    <div className="flex items-center px-[2px]   w-full space-x-[34px]">
                      <div className="text-[16px] font-[400] text-[#333] text-nowrap">
                        Assessment Title
                      </div>

                      <div className="w-full ">
                        <CustomInput
                          name="assessmentTitle"
                          // label="Survey Title"
                          // required
                          type="text"
                          as={Input}
                          size="large"
                          placeholder="Enter your assessment title"
                          error={<ErrorMessage name="assessmentTitle" />}
                          maxInput={255}
                        />
                      </div>
                    </div>
                  </Card>
                  <Card className="custom-card !py-[18px] !pb-[0px] !pt-[0px] mt-[20px] !px-[0px] ">
                    <FieldArray name="questions">
                      {({ push, remove }) => (
                        <>
                          {values.questions.map(
                            (question: any, index: number) => (
                              <>
                                <Card
                                  key={index}
                                  className="!bg-[#F9F9FB] custom-card !py-[18px] !pb-[0px] !pt-[0px] !px-[0px] mt-[20px]"
                                >
                                  <div className="flex h-[60px]">
                                    <div className="px-[20px] text-[16px] font-[700] text-[#333] max-w-[146px] w-full items-center flex justify-center rounded-l-md border border-[#E8E8E8] bg-[#F2F2F2]">
                                      Question {index + 1}&nbsp;:
                                    </div>
                                    <CustomInput
                                      className="w-full survey-input !h-[60px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                      name={`questions[${index}].question`}
                                      type="text"
                                      as={Input}
                                      error={
                                        <ErrorMessage
                                          name={`questions[${index}].question`}
                                        />
                                      }
                                      size="large"
                                      placeholder="Enter your question..."
                                      maxInput={100}
                                    />
                                    <div className="w-[100%] max-w-[249px]">
                                      <Field
                                        name={`questions[${index}].questionType`}
                                      >
                                        {({ field }: any) => (
                                          <Select
                                            {...field}
                                            className="w-full !h-[60px] !rounded-none border-remove items-center"
                                            suffixIcon={<CustomDropdownIcon />}
                                            placeholder="Select Question Type"
                                            onChange={(value) => {
                                              setFieldValue(
                                                `questions[${index}].questionType`,
                                                value
                                              );
                                              setFieldValue(
                                                `questions[${index}].correctAnsToggle`,
                                                true
                                              );
                                              if (
                                                value === "Multiple Choice" ||
                                                value === "Checkbox"
                                              ) {
                                                setFieldValue(
                                                  `questions[${index}].options`,
                                                  [{ optionData: "" }]
                                                );
                                              } else {
                                                setFieldValue(
                                                  `questions[${index}].options`,
                                                  []
                                                );
                                              }
                                            }}
                                            // id={`questions[${index}].questionType`}
                                          >
                                            <Option value={""}>
                                              Select Question Type
                                            </Option>
                                            <Option value="Yes or No">
                                              <div className="flex items-center gap-[8px]">
                                                <CheckMarkIcon /> Yes or No
                                              </div>
                                            </Option>
                                            <Option value="Multiple Choice">
                                              <div className="flex items-center gap-[8px]">
                                                <MultiChoiceIcon />
                                                Multiple Choice
                                              </div>
                                            </Option>
                                            <Option value="Checkbox">
                                              <div className="flex items-center gap-[8px]">
                                                <CheckboxIcon />
                                                Checkbox
                                              </div>
                                            </Option>
                                          </Select>
                                        )}
                                      </Field>
                                      <ErrorMessage
                                        name={`questions[${index}].questionType`}
                                      >
                                        {(msg) => (
                                          <div className="text-red-500">
                                            {msg}
                                          </div>
                                        )}
                                      </ErrorMessage>
                                    </div>
                                  </div>

                                  {question.questionType ===
                                    "Multiple Choice" && (
                                    <FieldArray
                                      name={`questions[${index}].options`}
                                    >
                                      {({
                                        push: pushOption,
                                        remove: removeOption,
                                      }) => (
                                        <div className="mt-[20px]">
                                          {question?.options?.map(
                                            (
                                              option: any,
                                              optionIndex: number
                                            ) => (
                                              <div
                                                key={optionIndex}
                                                className="flex items-center mt-[10px]"
                                              >
                                                <CustomInput
                                                  className="w-full !h-[50px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                                  name={`questions[${index}].options[${optionIndex}].optionData`}
                                                  type="text"
                                                  as={Input}
                                                  defaultValue={
                                                    question.options[optionIndex]
                                                      .optionData || ""
                                                  }
                                                  error={
                                                    <ErrorMessage
                                                      name={`questions[${index}].options[${optionIndex}].optionData`}
                                                    />
                                                  }
                                                  size="large"
                                                  placeholder="Enter an answer choice"
                                                />
                                                <div className="flex items-center">
                                                  {question.options?.length ==
                                                  optionIndex + 1 ? (
                                                    <span
                                                      onClick={() =>
                                                        pushOption({
                                                          optionData: "",
                                                        })
                                                      }
                                                      className="ml-[10px] cursor-pointer"
                                                    >
                                                      <QuestionPlusIcon />
                                                    </span>
                                                  ) : (
                                                    <span
                                                      onClick={() =>
                                                        removeOption(
                                                          optionIndex
                                                        )
                                                      }
                                                      className="ml-[10px] cursor-pointer"
                                                    >
                                                      <QuestionMinusIcon />
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </FieldArray>
                                  )}
                                  {question.questionType === "Checkbox" && (
                                    <FieldArray
                                      name={`questions[${index}].options`}
                                    >
                                      {({
                                        push: pushOption,
                                        remove: removeOption,
                                      }) => (
                                        <div className="mt-[20px]">
                                          {question.options?.map(
                                            (option: any, optionIndex: any) => (
                                              <div
                                                key={optionIndex}
                                                className="flex items-center mt-[10px]"
                                              >
                                                <CustomInput
                                                  className="w-full !h-[50px] flex justify-start items-center px-[20px] mt-0 !border rounded-none !border-[#E8E8E8]"
                                                  name={`questions[${index}].options[${optionIndex}].optionData`}
                                                  type="text"
                                                  defaultValue={
                                                    option.optionData || ""
                                                  }
                                                  prefix={
                                                    <CheckboxUncheckIcon />
                                                  }
                                                  as={Input}
                                                  error={
                                                    <ErrorMessage
                                                      name={`questions[${index}].options[${optionIndex}].optionData`}
                                                    />
                                                  }
                                                  size="large"
                                                  placeholder="Enter an answer choice"
                                                />
                                                <div className="flex items-center">
                                                  <span
                                                   onClick={() => removeOption(optionIndex)}
                                                    // onClick={() => {
                                                    //   const updatedOptions =
                                                    //     question.options.filter(
                                                    //       (_, i) =>
                                                    //         i !== optionIndex
                                                    //     );
                                                    //   setFieldValue(
                                                    //     `questions[${index}].options`,
                                                    //     updatedOptions
                                                    //   );
                                                    // }}
                                                    className="ml-[10px] cursor-pointer"
                                                  >
                                                    <QuestionMinusIcon />
                                                  </span>{" "}
                                                  {question.options?.length ==
                                                    optionIndex + 1 && (
                                                    <span
                                                      // onClick={() => {
                                                      //   console.log(
                                                      //     "question.options :>> ",
                                                      //     [
                                                      //       ...question?.options,
                                                      //       { optionData: "" },
                                                      //     ]
                                                      //   );
                                                      //   // const updatedOptions = [
                                                      //   //   ...question.options,
                                                      //   //   { optionData: "" },
                                                      //   // ];
                                                      //   setFieldValue(
                                                      //     `questions[${index}].options`,
                                                      //     [
                                                      //       ...question.options,
                                                      //       { optionData: "" },
                                                      //     ]
                                                      //   );
                                                      // }}
                                                      onClick={() =>
                                                        setFieldValue(
                                                          `questions[${index}].options`,
                                                          [...question.options, { optionData: "" }]
                                                        )
                                                      }
                                                      className="ml-[10px] cursor-pointer"
                                                    >
                                                      <QuestionPlusIcon />
                                                    </span>
                                                  )}
                                                </div>
                                                {/* <ErrorMessage
                                                  name={`questions[${index}].options[${optionIndex}].optionData`}
                                                >
                                                  {(msg) => (
                                                    <div className="text-red-500">
                                                      {msg}
                                                    </div>
                                                  )}
                                                </ErrorMessage> */}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </FieldArray>
                                  )}
                                  {/* <ErrorMessage
                                    name={`questions[${index}].options`}
                                  >
                                    {(msg) => (
                                      <div className="text-red-500">{msg}</div>
                                    )}
                                  </ErrorMessage> */}
                                  <Divider className="custom-divider !mt-[25px] mb-[7.5px]" />
                                  <div className="flex justify-between items-center">
                                    <div>
                                      {values.questions.length > 1 && (
                                        <Button
                                          type="link"
                                          onClick={() => remove(index)}
                                          className="mt-[10px]"
                                        >
                                          Remove Question
                                        </Button>
                                      )}
                                    </div>

                                    {/* <Field
                                    name={`questions[${index}].correctAnsToggle`}
                                  >
                                    {({ }) => (
                                      <div
                                        className={`flex flex-col !justify-end text-[#27AE60] text-[16px] items-center gap-[12px] ml-auto cursor-pointer `}
                                        onClick={() => {
                                          const newValue = !values.questions[index].correctAnsToggle;
                                          setFieldValue(`questions[${index}].correctAnsToggle`, newValue);
                                        }
                                        }
                                      >
                                        <div className="flex w-[115px] h-[37px] justify-center items-center gap-[12px] rounded-[5px] bg-white">
                                          <QuestionPlusIcon fill="#27AE60" />{" "}
                                          <div>Answer</div>
                                        </div>
                                       
                                      </div>
                                    )}
                                  </Field> */}
                                    <div className="flex-row !justify-end">
                                      <Field
                                        name={`questions[${index}].correctAnsToggle`}
                                      >
                                        {({ field, form }: any) => (
                                          <div
                                            className={`flex flex-col !justify-end text-[#27AE60] text-[16px] items-center gap-[12px] ml-auto cursor-pointer`}
                                            onClick={() => {
                                              // const newValue = !field.value;
                                              setFieldValue(
                                                `questions[${index}].correctAnsToggle`,
                                                true
                                              );
                                            }}
                                          >
                                            <div className="flex w-[115px] h-[37px] justify-center items-center gap-[12px] rounded-[5px] bg-white">
                                              <QuestionPlusIcon fill="#27AE60" />{" "}
                                              <div>Answer</div>
                                            </div>
                                          </div>
                                        )}
                                      </Field>
                                      <ErrorMessage
                                        name={`questions[${index}].correctAnsToggle`}
                                        component={"div"}
                                        className="field-error"
                                      />
                                    </div>
                                    {/* <ErrorMessage
                                    name={`questions[${index}].correctAnsToggle`}
                                  >
                                    {(msg) => (
                                      <div className="text-red-500">{msg}</div>
                                    )}
                                  </ErrorMessage> */}
                                  </div>
                                  {values?.questions[index]
                                    .correctAnsToggle && (
                                    <div className="!mt-[10px] ">
                                      {/* <CustomInput
                                      label="Correct Answer"
                                      className="w-full  !h-[50px] flex justify-start items-center px-[20px] !border rounded-none !border-[#E8E8E8]"
                                      name={`questions[${index}].correctAnswer`}
                                      type="text"
                                      as={Input}
                                      error={
                                        <ErrorMessage
                                          name={`questions[${index}].correctAnswer`}
                                        />
                                      }
                                      size="large"
                                      placeholder="Enter correct an answer text"
                                    /> */}
                                      <CustomSelect
                                        label="Correct Answer"
                                        className="w-full  !h-[50px] flex justify-start items-center !border rounded-none !border-[#E8E8E8]"
                                        name={`questions[${index}].correctAnswer`}
                                        error={
                                          <ErrorMessage
                                            name={`questions[${index}].correctAnswer`}
                                          />
                                        }
                                        defaultValue={
                                          values?.questions[index].correctAnswer
                                        }
                                        disabled={
                                          values?.questions[index]
                                            .questionType === "Checkbox" ||
                                          values?.questions[index]
                                            .questionType === "Multiple Choice"
                                            ? values?.questions[
                                                index
                                              ].options?.every(
                                                (i: any) => i.optionData === ""
                                              )
                                            : false
                                        }
                                        options={
                                          values?.questions[index]
                                            .questionType === "Yes or No"
                                            ? [
                                                {
                                                  value: "Yes",
                                                  label: "Yes",
                                                },
                                                {
                                                  value: "No",
                                                  label: "No",
                                                },
                                              ]
                                            : values?.questions[index]
                                                .questionType === "Checkbox" ||
                                              values?.questions[index]
                                                .questionType ===
                                                "Multiple Choice"
                                            ? values?.questions[index].options
                                                ?.filter(
                                                  (i: any) =>
                                                    i.optionData !== ""
                                                )
                                                ?.map((ans: any, index) => {
                                                  console.log("ans :>> ", ans);
                                                  return {
                                                    value: ans?.optionData,
                                                    label: ans?.optionData,
                                                  };
                                                })
                                            : []
                                        }
                                        size="large"
                                        placeholder="Enter correct an answer text"
                                      />
                                    </div>
                                  )}
                                  {/* <ErrorMessage
                                  name={`questions[${index}].options`}
                                >
                                  {(msg) => (
                                    <div className="text-red-500">{msg}</div>
                                  )}
                                </ErrorMessage> */}
                                </Card>
                              </>
                            )
                          )}

                          <div className="max-w-[1086px] h-[137px] flex justify-center items-center w-full rounded-md border border-[#E8E8E8] bg-[#F5F6FA] mt-[30px]">
                            <div className="flex flex-col items-center justify-center">
                              <span
                                className="flex h-[50px] px-[32px] py-[16px] items-center gap-2 cursor-pointer rounded-lg border border-[#263A67]"
                                onClick={() =>
                                  push({
                                    question: "",
                                    questionType: "",
                                    options: [],
                                    correctAnswer: "",
                                    correctAnsToggle: "",
                                  })
                                }
                              >
                                <QuestionCirclePlusIcon /> New Question
                              </span>
                              <span className="mt-[17px] text-[16px] text-[#263A67]">
                                <span className="font-[600]">or</span> Copy and
                                paste questions
                              </span>
                              {/* <Button
                            type="link"
                            onClick={() => handleCopyQuestions(values.questions)}
                            className="mt-[10px]"
                          >
                            Copy Questions
                          </Button>
                          <Button
                            type="link"
                            onClick={() => setIsModalVisible(true)}
                            className="mt-[10px]"
                          >
                            Paste Questions
                          </Button> */}
                            </div>
                          </div>
                        </>
                      )}
                    </FieldArray>
                    <div className="mt-[30px] flex justify-center">
                      <Button
                        loading={isSubmitting}
                        type="link"
                        size="large"
                        className="ml-[30px]"
                        onClick={() => router.push("/surveys/assessment")}
                      >
                        Cancel
                      </Button>
                      <Button
                        loading={isSubmitting}
                        // disabled={isSubmitting || Object.keys(errors).length > 0}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="custom-heading-btn !w-[150px] form"
                      >
                        Create Survey
                      </Button>
                    </div>
                  </Card>
                  <Modal
                    title="Paste Questions"
                    open={isModalVisible}
                    onOk={() => handlePasteQuestions(setFieldValue)}
                    onCancel={() => setIsModalVisible(false)}
                  >
                    <Input.TextArea
                      rows={4}
                      value={pastedQuestions}
                      onChange={(e) => setPastedQuestions(e.target.value)}
                      placeholder="Paste your JSON formatted questions here..."
                    />
                  </Modal>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default AddEditAssessment;
