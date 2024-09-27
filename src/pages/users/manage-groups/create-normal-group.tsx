import { ChangeEvent, useEffect, useState } from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { FC } from "react";
import { NextRouter, useRouter } from "next/router";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import DownArrow from "@/src/components/Icons/DownArrow";
import { Col, Input, Row, Select } from "antd";
import CommonButton from "@/src/components/Button";
import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import { useNotification } from "@/src/components/Notification";

const ManageGroups: FC = () => {
  const router: NextRouter = useRouter();
  const notificationContext = useNotification();
  const handleNotifications: any = notificationContext?.handleNotifications;
  const [loading, setLoading] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string | number>("");
  const [roleList, setRoleList] = useState<any>([]);
  const [roleIds, setRoleIds] = useState<number[]>([]);

  type payloadType = {
    groupName: string | number;
    roleIds?: number[];
  };

  const handleChangeGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };
  const handleSelectRole = (value: number[]) => {
    setRoleIds(value);
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const payload: payloadType = {
        groupName,
      };
      if (roleIds.length) {
        payload.roleIds = roleIds;
      }
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.CREATE_GROUP}`,
        payload
      );
      if (Object.keys(result).length && result?.settings?.success) {
        handleNotifications(`success`, `${result?.settings?.message}`, ``, 3);
      }
    } catch (e) {
    } finally {
      setLoading(false);
      setGroupName("");
      router.push("/users/manage-groups");
    }
  };
  const getRoleList = async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.post(
        `${API_ENDPOINTS.ROLE_LIST}`
      );

      if (Object.keys(result).length && result?.settings?.success) {
        setRoleList(result.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  return (
    <SidebarLayout>
      <div>
        <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
          <span
            className="cursor-pointer"
            onClick={() => router.push("/users/manage-groups")}
          >
            <LeftArrowIcon />
          </span>
          <span className="pl-[15px]">Create Normal Group</span>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          <Row>
            <Col xs={24} lg={12}>
              <div className="mb-[5px] text-[16px] font-[400] text-[#000000]">
                Group Name
              </div>
              <Input
                value={groupName}
                onChange={handleChangeGroupName}
                style={{ height: "40px" }}
                className="custom-input"
                placeholder="Please Type..."
              />
            </Col>
          </Row>
          <Row className="mt-[20px]">
            <Col xs={24} lg={12}>
              <div className="mb-[5px] text-[16px] font-[400] text-[#000000]">
                Roles and Rights
              </div>

              <Select
                mode="tags"
                size={"large"}
                showSearch={false}
                style={{ height: "40px", width: "100%" }}
                className="custom-select"
                placeholder="Please Select Roles and Rights"
                suffixIcon={<DownArrow />}
                onChange={handleSelectRole}
              >
                {roleList?.length &&
                  roleList.map((role: any) => (
                    <Select.Option value={role.roleId}>
                      {role.roleName}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>

          <Row className="mt-[30px]">
            <Col xs={24} sm={24} md={8} lg={5}>
              <CommonButton
                disabled={!groupName}
                loading={loading}
                type="primary"
                className="commonButton"
                style={{ width: "100%", height: "50px" }}
                onClick={handleCreateGroup}
              >
                <div className="text-[16px] font-[700] text-[#FFFFFF]">
                  Create Group
                </div>
              </CommonButton>
            </Col>
          </Row>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ManageGroups;
