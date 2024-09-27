import { FC } from "react"
import SidebarLayout from "../components/Layout/SidebarLayout"
import withCompanyAuth from "../lib/WithCompany"

const Dashboard:FC = () => {
    return (<>
    <SidebarLayout>
        Dashboard
    </SidebarLayout>
    </>)
}

export default withCompanyAuth(Dashboard)