import { useEffect, useState, FC } from "react";
import { Spin, Table } from "antd";
import { NextRouter, useRouter } from "next/router";

import moment from "moment";

import axiosInstance from "@/src/interceptors/Axios";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import ButtonDropDown from "@/src/components/ButtonDropdown";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import LeftArrowIcon from "@/src/components/Icons/LeftArrowIcon";
import UserFieldMembership from "@/src/components/MembershipPolicy/UserFieldMembership";
import UserDateMembership from "@/src/components/MembershipPolicy/UserDateMembership";

const column = [
  {
    title: "User Name",
    dataIndex: "userName",
    sorter: true,
    render: (text: any, record: any) => (
      <div className="gap-[5px]">
        <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
      </div>
    ),
  },
  {
    title: "Groups",
    dataIndex: "groupName",
    sorter: true,
    render: (text: any, record: any) => (
      <div className="gap-[5px]">
        <span className="text-[14px] font-[600] text-[#4F4F4F] ">{text}</span>
      </div>
    ),
  },
  {
    title: "Joined on",
    dataIndex: "joinedOn",
    sorter: true,
    render: (text: any, record: any) => (
      <span className="text-[14px] font-[600] text-[#4F4F4F]">
        {moment.unix(record?.joinedOn / 1000).format("MM/DD/YYYY")}
      </span>
    ),
  },
];

const ManageSmartGroups: FC = () => {
  const router: NextRouter = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formDetailsLoading, setFormDetailsLoading] = useState<boolean>(false);
  const [membershipPolicyList, setMembershipPolicyList] = useState<any[]>([]);
  const [currentMembership, setCurrentMembership] = useState<any>({});
  const [membershipItems, setMembershipItems] = useState<any[]>([]);
  const [membershipFormDetails, setMembershipFormDetails] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);

  const getMembershipPolicyList = async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERSHIP_POLICY_LIST}`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setMembershipPolicyList(result.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipItems = () => {
    const btnItems = [];
    for (let item of membershipPolicyList) {
      btnItems.push({
        label: (
          <div className="flex items-center gap-[5px] font-[600] text-[14px] text-[#828282]">
            {item.formName}
          </div>
        ),
        key: item.formName,
        onClick: () => setCurrentMembership(item),
      });
    }
    setMembershipItems(btnItems);
  };

  const getMembershipFormDetails = async () => {
    setFormDetailsLoading(true);
    try {
      const result: any = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERSHIP_FORM}/${currentMembership.formId}`
      );
      if (Object.keys(result).length && result?.settings?.success) {
        setMembershipFormDetails(result.data);
      }
    } catch (e) {
    } finally {
      setFormDetailsLoading(false);
    }
  };

  const showLoader = () => (
    <div className="text-center">
      <Spin />
    </div>
  );

  const selectMembershipPolicyUI = () => (
    <div className="text-center text-[16px]">Select a membership policy</div>
  );

  const membershipPolicyFormUI = () => {
    if (currentMembership.formId === 1) {
      return (
        <UserFieldMembership
          membershipFormDetails={membershipFormDetails}
          setUsers={setUsers}
        />
      );
    }
    if (currentMembership.formId === 2) {
      return (
        <UserDateMembership
          membershipFormDetails={membershipFormDetails}
          setUsers={setUsers}
        />
      );
    }
    if (currentMembership.formId === 3) {
      // return <UserFieldMembership />;
      return <div className="text-center">Pending to develop</div>;
    }
    if (currentMembership.formId === 4) {
      // return <UserFieldMembership />;
      return <div className="text-center">Pending to develop</div>;
    }
  };

  const showUserList = () => (
    <div className="mt-[20px] rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
      <Table columns={column} dataSource={users} pagination={false} />
    </div>
  );

  useEffect(() => {
    if (currentMembership.formId > 0) {
      getMembershipFormDetails();
      setUsers([]);
    }
  }, [currentMembership]);

  useEffect(() => {
    if (membershipPolicyList.length) handleMembershipItems();
  }, [membershipPolicyList]);

  useEffect(() => {
    getMembershipPolicyList();
  }, []);

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            <span
              className="cursor-pointer"
              onClick={() => router.push("/users/manage-groups")}
            >
              <LeftArrowIcon />
            </span>
            <span className="pl-[15px]">Create Automated Group</span>
          </div>
          <div className="flex items-center text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            <ButtonDropDown
              loading={loading}
              className="custom-heading-btn flex items-center px-[20px] py-[8px] !h-[40px] plus-icon"
              label={
                <div className="flex items-center gap-[5px] text-[16px] font-[700]">
                  {Object.keys(membershipFormDetails).length > 0
                    ? currentMembership.formName
                    : "Membership policy"}
                </div>
              }
              btnItem={membershipItems}
            />
          </div>
        </div>

        <div className="rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] py-[21px] px-[31px]">
          {formDetailsLoading
            ? showLoader()
            : Object.keys(membershipFormDetails).length > 0
            ? membershipPolicyFormUI()
            : selectMembershipPolicyUI()}
        </div>
      </div>

      {users && users?.length ? showUserList() : null}
    </SidebarLayout>
  );
};

export default ManageSmartGroups;
