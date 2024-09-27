import React from "react";
import type {MenuProps} from "antd";
import {Dropdown, Space} from "antd";
import DotsVerticalcon from "../Icons/DotsVerticalcon";
import ViewIcon from "../Icons/ViewIcon";
import DeleteIcon from "../Icons/DeleteIcon";

interface CoursDropProps {
  course: any;
  onViewCourse: (course: any) => void;
  handleDeleteCourse: (course: any) => void;
}

const CoursesOptions: React.FC<CoursDropProps> = ({
  course,
  onViewCourse,
  handleDeleteCourse,
}) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <div
          className="flex gap-2 text-[15px] text-[#333333]"
          onClick={() => onViewCourse(course)}
        >
          <ViewIcon />
          View Course
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          className="flex gap-2 text-[15px] text-[#333333]"
          onClick={() => handleDeleteCourse(course.courseId)}
        >
          <DeleteIcon />
          Delete Course
        </div>
      ),
      key: "1",
    },
  ];

  return (
    <Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <DotsVerticalcon />
        </Space>
      </a>
    </Dropdown>
  );
};

export default CoursesOptions;
