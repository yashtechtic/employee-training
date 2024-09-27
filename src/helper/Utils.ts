import dayjs from "dayjs";

export const camelCase = (text: string | undefined): string => {
  try {
    if (!text) {
      return ""; // or throw an error, depending on your use case
    }

    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
      if (words[i]) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      } else {
        words[i] = "";
      }
    }

    return words.join(" ");
  } catch (error) {
    // Handle the error appropriately
    return ""; // or throw an error
  }
};

export const handleCategoryType = (urlPath?: string) => {
  if (typeof window !== "undefined") {
    urlPath = urlPath || window.location.pathname;
    let CategoryTypeName = "LANDING_PAGE";

    switch (urlPath) {
      case "/phishing/phishing-destination":
        CategoryTypeName = "LANDING_PAGE";
        break;
      case "/phishing/domain":
        CategoryTypeName = "DOMAIN";
        break;
      case "/phishing/template":
        CategoryTypeName = "PHISHING_TEMPLATES";
        break;
      case "/template/notification":
        CategoryTypeName = "NOTIFICATION_TEMPLATES";
        break;
      case "/surveys":
        CategoryTypeName = "SURVEY";
        break;
      case "/courses/create-course":
        CategoryTypeName = "COURSE";
        break;
      case "/courses/edit-course":
        CategoryTypeName = "COURSE";
        break;
      default:
        CategoryTypeName = "LANDING_PAGE";
        break;
    }

    return CategoryTypeName;
  }

  return "LANDING_PAGE";
};

export const DateRangeToMillisecond = (dateRange: string[]) => {
  let startDate = dayjs(dateRange[0], "YYYY/MM/DD").startOf("day");
  let endDate = dayjs(dateRange[1], "YYYY/MM/DD");
  // Check if the end date is today
  let isEndDateToday = endDate.isSame(dayjs(), "day");
  // Set the end time to either the current time if today, or end of day otherwise
  let endDateWithTime = isEndDateToday ? endDate : endDate.endOf("day");
  let startDateMs = startDate.valueOf();
  let endDateMs = endDateWithTime.valueOf();

  return { startDateMs, endDateMs };
};
