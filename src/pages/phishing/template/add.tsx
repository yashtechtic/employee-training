import AddEditPhishingTemplate from "@/src/components/AddEditPhishingTemplate";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { FC } from "react";

const AddPhishingTemplate:FC = () => {
    return(
        <SidebarLayout>
            <AddEditPhishingTemplate   />
        </SidebarLayout>
    )
}

export default AddPhishingTemplate;