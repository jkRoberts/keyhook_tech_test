import { useState, useEffect } from "react";
import fetchDepartmentData from "../../lib/request/fetchDepartmentData";
import { DepartmentsDataType } from "../../lib/types/EmployeeAttributeTypes";
import Dropdown from "react-dropdown"
import { PaginationState } from "@tanstack/react-table";

interface EmployeeDepartmentFilterFieldProps {
  setDepartmentFilter: (value: string | ((prevVar: string) => string)) => void
  setPagination: (value: PaginationState | ((prevVar: PaginationState) => PaginationState)) => void
  departmentFilter: string
}

// Functional Component to set department filter. This allows us to filter the employee list by Departments
// This will do a simple look up to get Department Name, and then pass that to the API Query
const departmentsDefault:DepartmentsDataType = {
  data: [{
    id:"",
    type:"",
    attributes: {
      name: ""
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

const EmployeeDepartmentFilterField = ({setDepartmentFilter, departmentFilter, setPagination}:EmployeeDepartmentFilterFieldProps) => {
  const [departments, setDepartments] = useState(departmentsDefault)

  useEffect(() => {
    fetchDepartmentData({
      setDepartments
    });
  }, []);

  const handleChange = ( e: { value: string } ) => {
    if(departmentFilter !== e.value) {
      setPagination({pageIndex: 0, pageSize: 20})
    }
    setDepartmentFilter(e.value)
  }

  const items = departments.data
  const dropdownOption = [
    { value: '', label: 'Select a Department' },
    ...items.map(i => ({value: i.attributes.name, label: i.attributes.name}))
  ]

  return(
    <div>
      <label className="block" htmlFor="filterByName">Select Department</label>
      <Dropdown
        options={dropdownOption}
        onChange={handleChange}
        placeholder={"Select a Department"}
        className="inline-block appearance-none border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        {...(departmentFilter && {value: departmentFilter} )}
      />
    </div>
  )
}

export default EmployeeDepartmentFilterField;
