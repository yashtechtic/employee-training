import React, { ReactNode } from "react";
import DashboardIcon from "../Icons/DashboardIcon";
import PhishingIcon from "../Icons/PhishingIcon";
import ManageUsersIcons from "../Icons/ManageUsersIcons";
import ManageCoursesIcon from "../Icons/ManageCoursesIcon";
import LearningProgramsIcon from "../Icons/LearningProgramsIcon";
import SurveysIcon from "../Icons/SurveysIcon";
import ContentLibraryIcon from "../Icons/ContentLibraryIcon";
import ReportsIcon from "../Icons/ReportsIcon";
import BlogArticlesIcon from "../Icons/BlogArticlesIcon";
import GroupsIcon from "../Icons/GroupsIcon";
import ImportUsersIcon from "../Icons/ImportUsersIcon";
import OnboardingIcon from "../Icons/OnboardingIcon";
import MergeUsersIcon from "../Icons/MergeUsersIcon";
import MessagesIcon from "../Icons/MessagesIcon";
import ManageRolesRightsIcon from "../Icons/ManageRolesRightsIcon";
import RiskBoosterIcon from "../Icons/RiskBoosterIcon";
import ProgressTrackingIcon from "../Icons/ProgressTrackingIcon";
import { SettingOutlined } from "@ant-design/icons";
import SupportHelpIcon from "../Icons/SupportHelpIcon";
import PlanAccountIcon from "../Icons/PlanAccountIcon";
import SettingMenuIcon from "../Icons/SettingMenuIcon";
import PhishingOverview from "../Icons/PhishingOverview";
import PhishingProgram from "../Icons/PhishingProgram";
import PhishingDestinationPageIcon from "../Icons/PhishingDestinationPageIcon";
import PhishingDomainIcon from "../Icons/PhishingDomainIcon";
import PhishingViewResult from "../Icons/PhishingViewResult";
import LibraryIcon from "../Icons/LibraryIcon";
import UploadContentIcon from "../Icons/UploadContentIcon";
import SurveyAssessment from "../Icons/SurveyAssessment";
import NotificationTemplateIcon from "../Icons/NotificationTemplateIcon";
import PolicieIcon from "../Icons/PolicieIcon";
import LoginAvatar from "../Icons/LoginAvatar";

export interface NavBarItem {
  id: number;
  label: string;
  routePath?: string;
  icon?: ReactNode;
  children?: NavBarItem[] | [];
}

export const companyAdminNavBarItems: NavBarItem[] = [
  {
    id: 1,
    label: "Dashboard",
    routePath: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    id: 2,
    label: "Phishing",
    icon: <PhishingIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Overview",
        routePath: "/phishing/program",
        icon: <PhishingOverview />,
      },
      {
        id: 2,
        label: "Program",
        routePath: "/program",
        icon: <PhishingProgram />,
      },
      {
        id: 3,
        label: "Phishing Destination Page",
        routePath: "/phishing/phishing-destination",
        icon: <PhishingDestinationPageIcon />,
      },
      {
        id: 4,
        label: "Domain",
        routePath: "/phishing/domain",
        icon: <PhishingDomainIcon />,
      },
      {
        id: 5,
        label: "View Results",
        routePath: "/view-results",
        icon: <PhishingViewResult />,
      },
      {
        id: 6,
        label: "Phishing Template",
        routePath: "/phishing/template",
        icon: <PhishingViewResult />,
      },
    ],
  },
  {
    id: 3,
    label: "Manage Users",
    icon: <ManageUsersIcons />,
    routePath: "/users",
    children: [
      {
        id: 1,
        label: "Users",
        routePath: "/users1",
        icon: <DashboardIcon />,
      },
      {
        id: 2,
        label: "Groups",
        routePath: "/users/manage-groups",
        icon: <GroupsIcon />,
      },
      {
        id: 3,
        label: "Import Users",
        routePath: "/users3",
        icon: <ImportUsersIcon />,
      },
      {
        id: 4,
        label: "Onboarding",
        routePath: "/users4",
        icon: <OnboardingIcon />,
      },
      {
        id: 5,
        label: "Merge Users",
        routePath: "/users5",
        icon: <MergeUsersIcon />,
      },
      {
        id: 6,
        label: "Messages",
        routePath: "/users6",
        icon: <MessagesIcon />,
      },
      {
        id: 7,
        label: "Manage Roles & Rights",
        routePath: "/users7",
        icon: <ManageRolesRightsIcon />,
      },
      {
        id: 8,
        label: "Risk Booster",
        routePath: "/users8",
        icon: <RiskBoosterIcon />,
      },
      {
        id: 9,
        label: "Progress Tracking",
        routePath: "/users9",
        icon: <ProgressTrackingIcon />,
      },
    ],
  },
  {
    id: 4,
    label: "Manage Courses",
    icon: <ManageCoursesIcon />,
    routePath: "/courses/manage-courses",
  },
  {
    id: 5,
    label: "Learning Programs",
    icon: <LearningProgramsIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Notification Templates",
        routePath: "/template/notification",
        icon: <LoginAvatar />,
      },
      {
        id: 2,
        label: "Policies",
        routePath: "/template/policies",
        icon: <PolicieIcon />,
      },
    ],
  },
  {
    id: 6,
    label: "Surveys",
    icon: <SurveysIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Survey & Templates",
        routePath: "/surveys",
        icon: <SurveysIcon />,
      },
      {
        id: 2,
        label: "Assessment",
        routePath: "/surveys/assessment",
        icon: <SurveyAssessment />,
      },
    ],
  },
  {
    id: 7,
    label: "Content Library",
    icon: <ContentLibraryIcon />,
    routePath: "",
    children: [
      {
        id: 1,
        label: "Library",
        routePath: "/content/library",
        icon: <LibraryIcon />,
      },
      {
        id: 2,
        label: "Upload Content",
        routePath: "/content/uploaded",
        icon: <UploadContentIcon />,
      },
    ],
  },
  {
    id: 8,
    label: "Reports",
    icon: <ReportsIcon />,
    routePath: "/reports",
  },
  {
    id: 9,
    label: "Blog & Articles",
    icon: <BlogArticlesIcon />,
    routePath: "/blog-articles",
  },
  {
    id: 11,
    label: "divider",
    icon: null,
  },
  {
    id: 10,
    label: "Settings",
    icon: <SettingMenuIcon />,
    // routePath: "/settings",
    children: [
      {
        id: 1,
        label: "Profile & Account",
        routePath: "/settings/profile",
        icon: <PlanAccountIcon />,
      },
      {
        id: 2,
        label: "Subscription Plan",
        routePath: "/settings/subscription",
        icon: <GroupsIcon />,
      },
      {
        id: 3,
        label: "Help/Support/Contact",
        routePath: "/settings/help-support",
        icon: <SupportHelpIcon />,
      },
    ],
  },
];
