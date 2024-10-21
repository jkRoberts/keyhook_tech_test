import {PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EmployeeTable from "../tables/EmployeeTable";
import EmployeeNameFilterField from "../form/EmployeeNameFilterField";
import ExmployeeTablePagination from "../pagination/ExmployeeTablePagination";
import { EmployeesDataType } from "../../lib/types/EmployeeAttributeTypes";
import fetchEmployeeData from "../../lib/request/fetchEmployeeData";
import EmployeeDepartmentFilterField from "../form/EmployeeDepartmentFilterField";

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
  const [departmentFilter, setDepartmentFilter] = useState('')
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
      departmentFilter,
      setData,
      setTotalCount,
      setTotalPages,
    });
  }, [pagination.pageIndex, pagination.pageSize, searchValue, sorting, departmentFilter]);

  return (
    <div>
      <div>
        <EmployeeNameFilterField setSearchValue={setSearchValue} />
        <EmployeeDepartmentFilterField
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          setPagination={setPagination}
        />
      </div>
      <div className="">
        <EmployeeTable
          setSorting={setSorting}
          sorting={sorting}
          columnData={data?.data}
        />
      </div>
      <div>
        <ExmployeeTablePagination
          setPagination={setPagination}
          pagination={pagination}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
};

export default EmployeeSection;
