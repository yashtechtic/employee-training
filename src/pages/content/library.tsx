import {useState} from "react";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {FC} from "react";
import {NextRouter, useRouter} from "next/router";
import SystemCompanySwitch from "@/src/components/SystemCompanySwitch";
import LibraryTable from "@/src/components/ContentLibrary/LibraryTable";
import CommonPagination from "@/src/components/CommonTable/paginnation";

const Library: FC = () => {
  const router: NextRouter = useRouter();
  const [isSystem, setIsSystem] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(26);
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  return (
    <SidebarLayout>
      <div>
        <div className="flex justify-between">
          <div className="text-[24px] font-[700] text-[#313D4F] mb-[30px]">
            Library
          </div>
          <div>
            <SystemCompanySwitch
              firstTab="User defined content"
              secondTab="Predefined content"
              onChange={(selected) =>
                selected === "Predefined content"
                  ? setIsSystem(true)
                  : setIsSystem(false)
              }
            />
          </div>
        </div>

        <div className="!w-full !h-full ">
          <LibraryTable
            selectedSystem={isSystem}
            setCurrentPage={setCurrentPage}
            setPageLimit={setPageLimit}
            setTotalItems={setTotalItems}
            currentPage={currentPage}
            pageLimit={pageLimit}
            totalItems={totalItems}
            handlePageChange={handlePageChange}
          />
        </div>
        <CommonPagination
          className="pagination"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageLimit}
          onPageChange={handlePageChange}
          onShowSizeChange={undefined}
        />
      </div>
    </SidebarLayout>
  );
};

export default Library;
