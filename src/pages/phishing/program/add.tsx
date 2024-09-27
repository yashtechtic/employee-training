import AddPhishingProgram from "@/src/components/AddPhishingProgram"
import SidebarLayout from "@/src/components/Layout/SidebarLayout"
import { FC } from "react"

const AddProgram:FC =()=>{
    return(<SidebarLayout>
        <AddPhishingProgram />
    </SidebarLayout>)
}

export default AddProgram