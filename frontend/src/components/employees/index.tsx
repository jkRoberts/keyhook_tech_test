import {PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EmployeeTable from "../tables/EmployeeTable";
import EmployeeNameFilterField from "../form/EmployeeNameFilterField";
import ExmployeeTablePagination from "../pagination/ExmployeeTablePagination";
import { EmployeesDataType } from "../../lib/types/EmployeeAttributeTypes";
import fetchEmployeeData from "../../lib/request/fetchEmployeeData";

const employeeDefault:EmployeesDataType = {
  data: [{
    id:"",
    type:"",
    attributes: {
      first_name:"",
      last_name:"",
      age: 0,
      position: "",
      department_name:"="
    }
  }],
  meta: {
    stats: {
      total: {
        count: 0
      }
    }
  }
}

const EmployeeSection = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [searchValue, setSearchValue] = useState('')

  const [data, setData] = useState<EmployeesDataType>(employeeDefault)

  useEffect(() => {
    const activeSort = sorting[0] ?? null
    let sortQuery = activeSort?.id.replace(/attributes_/g,'');
    if(activeSort?.desc) {
      sortQuery = '-' + sortQuery
    }

    fetchEmployeeData({
      sortQuery,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      searchValue,
      setData,
      setTotalCount,
      setTotalPages}
    );
  }, [pagination.pageIndex, pagination.pageSize, searchValue, sorting]);

  return (
    <>
      <EmployeeNameFilterField setSearchValue={setSearchValue} />
      <EmployeeTable
        setSorting={setSorting}
        sorting={sorting}
        columnData={data?.data}
      />
      <ExmployeeTablePagination
        setPagination={setPagination}
        pagination={pagination}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </>
  )
};

export default EmployeeSection;
