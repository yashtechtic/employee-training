import * as Yup from "yup";
import validator from "validator";

let commonMessage =
  "Password must be 8 characters long with at least one uppercase letter, one special character and one number.";

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Enter your username")
    .email("Enter your valid username")
    .test(
      "no-spaces",
      "user name should not contain only spaces",
      (value) => !/^\s+$/.test(value)
    ),
  password: Yup.string().required("Enter your password"),
});
export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
});

export const companyProfileValidationSchema = Yup.object().shape({
  companyName: Yup.string(),
  companyEmail: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  address: Yup.string().required("Enter your address "),
  city: Yup.string().required("Enter your city"),
  state: Yup.string().required("Enter your state"),
  country: Yup.string().required("Enter your country"),
});

export const companySupportSchema = Yup.object().shape({
  companyName: Yup.string().required("Enter your company name"),
  companyEmail: Yup.string()
    .required("Enter your email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  contactNumber: Yup.string().required("Enter your contact number"),
  message: Yup.string().required("Enter your message"),
});

export const companyProfileAPIKeyValidationSchema = Yup.object().shape({
  apiKey: Yup.string().required("Enter your API key"),
  postmanCollection: Yup.string()
    .required("Enter postman collection link address")
    .test("is-valid-url", "Enter a valid URL", (value) =>
      validator.isURL(value)
    ),
});
export const addUpdateDomainValidationSchema = Yup.object().shape({
  domain: Yup.string().required("Enter your domain"),
  subDomain: Yup.string().required("Enter your sub domain"),
});
export const addUpdatePhishingTemplateValidationSchema = Yup.object().shape({
  templateName: Yup.string().required("Enter your template name"),
  senderEmail: Yup.string()
    .required("Enter your sender email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  senderName: Yup.string().required("Enter your sender name"),
  replyToName: Yup.string().required("Enter your reply to name"),
  replyToEmail: Yup.string()
    .required("Enter your reply to email")
    .email("Enter your valid email")
    .test("is-valid-email", "Invalid email format", (value) =>
      validator.isEmail(value)
    ),
  subject: Yup.string().required("Enter your subject"),
  landingPageId: Yup.string().required("Select your destination page "),
  domainId: Yup.string().required("Select your destination domain"),
  categoryId: Yup.string().required("Select your category"),
  difficultyRating: Yup.string().required("Select your difficulty rating"),
  fileContent: Yup.string().required("Enter your file content"),
});

export const CategoriesValidationSchema = Yup.object().shape({
  categoryName: Yup.string().required("Enter category name"),
  categoryType: Yup.string().required("Enter your category type"),
});

export const companyPhishingDestinationValidationSchema = Yup.object().shape({
  title: Yup.string().required("Enter title name"),
  url: Yup.string().required("Enter your url"),
  content: Yup.string().required("Enter your content"),
});

export const CourseValidationSchema = Yup.object().shape({
  courseTitle: Yup.string().required("Enter Content Title"),
  courseType: Yup.string().required("Select  Content Type"),
  description: Yup.string().required("Enter your description"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Enter your duration")
    .min(1, "Duration must be a positive number")
    .max(99, "Duration cannot exceed 99"),
  // image: Yup.mixed()
  //   .required("Cover image is required")
  //   .test(
  //     "fileSize",
  //     "The file size should be less than or equal to 10MB",
  //     (value: any) => {
  //       return value && value.size <= 10 * 1024 * 1024;
  //     }
  //   ),
  categoryId: Yup.string().required("Select your category"),
});

export const ContentValidationSchema = Yup.object().shape({
  contentTitle: Yup.string().required("Enter Content Title"),
  contentType: Yup.string().required("Select  Content Type"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Enter your duration")
    .min(1, "Duration must be a positive number")
    .max(9, "Duration must be a single digit"),
  image: Yup.mixed().required("Cover image is required"),
});

export const addPhishingProgramValidationSchema1 = Yup.object().shape({
  programName: Yup.string().required("Program Name is required"),
  sendTo: Yup.string().required("Send To is required"),
  selectType: Yup.string().required("Select Type is required"),
  groupDeptIds: Yup.string().required("Group/Department ID is required"),
  frequency: Yup.string().required("Frequency is required"),
});

export const addPhishingProgramValidationSchema2 = Yup.object().shape({
  startDate: Yup.date().required("Start Date is required"),
  startTime: Yup.string().required("Start Time is required"),
  timeZoneId: Yup.string().required("Time Zone is required"),
  isSendEmail: Yup.boolean().required("This field is required"),
  emailOverType: Yup.string().required("Email Over Type is required"),
  emailOver: Yup.string().optional(),
  businessDays: Yup.string().optional(),
  trackPhishingReply: Yup.boolean().required("This field is required"),
  trackUserCount: Yup.string().required("Track User Count is required"),
  trackerSendPeriod: Yup.string().required("Tracker Send Period is required"),
});

export const addPhishingProgramValidationSchema3 = Yup.object().shape({
  categoryId: Yup.string().required("Category is required"),
  difficultyRating: Yup.string().required("Difficulty Rating is required"),
  phishingTemplateId: Yup.string().required("Phishing Template ID is required"),
  landingPageId: Yup.string().required("Landing Page ID is required"),
  domainId: Yup.string().required("Domain ID is required"),
  isHideEmailReport: Yup.boolean().required("This field is required"),
});

export const addUpdateSurveyValidationSchema = Yup.object().shape({
  surveyTitle: Yup.string()
    .required("Survey title is required")
    .max(250, "Survey title cannot be longer than 250 characters"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string()
          .required("Question is required")
          .max(250, "Question cannot be longer than 250 characters"),
        questionType: Yup.string()
          .required("Question type is required")
          .oneOf(
            ["Yes or No", "Feedback Question (text)", "Multiple Choice"],
            "Invalid question type"
          ),
        options: Yup.array()
          .of(
            Yup.object().shape({
              optionData: Yup.string()
                .required("Option text is required")
                .max(250, "Option text cannot be longer than 250 characters"),
            })
          )
          .nullable() // Allow null or undefined for non-Multiple Choice types
          .when("questionType", {
            is: "Multiple Choice",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one question is required")
    .required("Questions are required"),
});

export const addUpdateAssessmentValidationSchema = Yup.object().shape({
  assessmentTitle: Yup.string()
    .required("Assessment title is required")
    .max(255, "Assessment title cannot be longer than 255 characters"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string()
          .required("Question is required")
          .max(500, "Question cannot be longer than 500 characters"),
        questionType: Yup.string()
          .required("Question type is required")
          .oneOf(
            ["Yes or No", "Checkbox", "Multiple Choice"],
            "Invalid question type"
          ),
        correctAnswer: Yup.string().required("Correct answer is required"),
        correctAnsToggle: Yup.boolean().required("Correct answer is required"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              optionData: Yup.string()
                .required("Option text is required")
                .max(255, "Option text cannot be longer than 255 characters"),
            })
          )
          .nullable() // Allow null or undefined for non-Multiple Choice types
          .when("questionType", {
            is: "Multiple Choice",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions"),
            otherwise: (schema) => schema.notRequired(),
          })
          .when("questionType", {
            is: "Checkbox",
            then: (schema) =>
              schema
                .min(2, "At least two options are required for multiple choice")
                .required("Options are required for multiple choice questions"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one question is required")
    .required("Questions are required"),
});

export const NotficationTemplateSchema = Yup.object().shape({
  subject: Yup.string().required("Enter Your subject"),
  senderName: Yup.string().required("Enter Your sender Name"),
  content: Yup.string().required("Enter Your content"),

  senderEmail: Yup.string()
    .required("Enter your username")
    .email("Enter your valid username")
    .test(
      "no-spaces",
      "user name should not contain only spaces",
      (value) => !/^\s+$/.test(value)
    ),
});

export const PolicySchema = Yup.object().shape({
  title: Yup.string().required("Enter Your title"),
  document: Yup.string().required("Upload a PDF file"),
  startDate: Yup.string().required("Select  start date"),
  endDate: Yup.string().required("Select end date"),
  description: Yup.string().required("Enter your description"),
});
