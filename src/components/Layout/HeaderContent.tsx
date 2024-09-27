import { FC, useState } from "react";
import NotificationIcon from "../Icons/NotificationIcon";
import { Avatar, Popover, Typography } from "antd";
import { KeyOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import ManageUsersIcons from "../Icons/ManageUsersIcons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/src/store/user";
import MenuDownIcon from "../Icons/MenuDownIcon";
import { useSelector } from "react-redux";

const Text = Typography;

const HeaderContent: FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.pathname;
  const currentUser = useSelector((state: any) => state.userReducer.user);
  console.log('currentUser :>> ', currentUser);
  const dispatch = useDispatch();
  const handleOpenChange = () => {
    setOpen(!open);
  };
  const logout = () => {
    dispatch(userLoggedOut());
    router.push("/login");
  };
  const menuItems = [
    {
      href: "/profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: null,
    },
    {
      href: "/change-password",
      label: "Change Password",
      icon: <KeyOutlined />,
      onClick: null,
    },
    {
      href: "/login",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];
  const content = (
    <div className="flex flex-col items-start p-1 px-2">
      {menuItems.map(({ href, label, icon, onClick }) => (
        <Link key={href} href={href} className="w-full">
          <div
            className={`flex gap-2 w-full cursor-pointer text-[#333333] p-2 hover:bg-[#e2eefe]  items-center pr-2 rounded-[5px] ${
              currentPath === href ? "bg-[#e2eefe]" : ""
            }`}
            onClick={() => onClick && onClick()}
          >
            {icon}
            {label}
          </div>
        </Link>
      ))}
    </div>
  );
  return (
    <div className="flex float-end mr-8 gap-5 items-center">
      <div className="">
        <NotificationIcon />
      </div>
      {/* <div> */}
      <Popover
        className="custom-popover flex gap-3 cursor-pointer items-center "
        placement="bottomRight"
        content={content}
        trigger="click"
        open={open}
        style={{ top: "52px" }}
        onOpenChange={handleOpenChange}
      >
        <div className="flex items-center">

        <Avatar size={30} icon={<UserOutlined />} />

        <div className="!text-#828282 !text-[14px] !font-bold">
          {currentUser?.userName}
        </div>
        <MenuDownIcon />
        </div>
      </Popover>
      {/* </div> */}
    </div>
  );
};
export default HeaderContent;
