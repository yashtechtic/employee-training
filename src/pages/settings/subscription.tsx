import CommonTable from "@/src/components/CommonTable";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { useLoader } from "@/src/components/Loader/LoaderProvider";
import { API_ENDPOINTS } from "@/src/interceptors/apiName";
import axiosInstance from "@/src/interceptors/Axios";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Subscription: FC = () => {
    const currentUser = useSelector((state: any) => state.userReducer.user);
    const [subscriptionDetails, setSubscriptionDetails] = useState<any>([]);
    const loaderContext = useLoader();
    const { showLoader, hideLoader } = loaderContext;
    useEffect(() => {
        showLoader();
        fetchCompanyDetails();
    }, []);
    const fetchCompanyDetails = async () => {
        try {
            let companyDetails: any = await axiosInstance.get(
                `${API_ENDPOINTS.COMPANY_Details_API}/${currentUser?.companyId}`
            );
            if (companyDetails?.settings?.success) {
                setSubscriptionDetails(companyDetails?.data?.subscription);
                console.log('companyDetails?.data?.subscription :>> ', companyDetails?.data?.subscription);
            }
            hideLoader();
        } catch (error) {
            hideLoader()
        }
    };
    const column = [
        {
            title: "Current Subscription",
            dataIndex: "currentSubscription",
            render: (text: any, record: any) => (
                <span
                    className='text-[14px] font-[600] '
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Licenses Available",
            dataIndex: "licensesAvailable",
            render: (text: any, record: any) => (
                <span
                    className='text-[14px] font-[600] '
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Licenses In Use",
            dataIndex: "licensesInUse",
            render: (text: any, record: any) => (
                <span
                    className='text-[14px] font-[600] '
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Subscription Expiry",
            dataIndex: "subscriptionExpiryDate",
            render: (text: any, record: any) => (
                <span
                    className='text-[14px] font-[600] '
                >
                    {moment(record?.subscriptionExpiryDate).format('MM-DD-YYYY')}
                </span>
            ),
        },
    ];
    return (
        <>
            <SidebarLayout>
                <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
                    Subscription Plan Details
                </div>
                <CommonTable
                    columns={column}
                    apiData={subscriptionDetails}
                    searchToggle={false}
                    pagination={false}
                    
                />
            </SidebarLayout>
        </>
    );
};
export default Subscription;
