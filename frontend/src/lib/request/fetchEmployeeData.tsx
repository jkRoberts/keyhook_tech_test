import axios from "axios"
import { EmployeesDataType } from "../types/EmployeeAttributeTypes"

interface fetchDataProps {
  sortQuery: string
  pageIndex: number
  pageSize: number
  searchValue: string
  departmentFilter: string
  setData: (value: EmployeesDataType | ((prevVar: EmployeesDataType) => EmployeesDataType)) => void
  setTotalCount: (value: number | ((prevVar: number) => number)) => void
  setTotalPages: (value: number | ((prevVar: number) => number)) => void,
}

const baseApi = 'http://localhost:4567/api/v1/employees?stats[total]=count'

const fetchEmployeeData = async ({
  sortQuery,
  pageIndex,
  pageSize,
  searchValue,
  departmentFilter,
  setData,
  setTotalCount,
  setTotalPages,
}: fetchDataProps) => {
  let apiPath = baseApi

  if(sortQuery) {
    apiPath += "&sort=" + sortQuery
  }

  if(pageIndex > 0) {
    apiPath += `&page[size]=${pageSize}}&page[number]=${pageIndex + 1}`
  }

  if(searchValue.length > 2) {
    apiPath += `&filter[name][fuzzy_match]=${searchValue}`
  }

  if(departmentFilter.length > 0) {
    apiPath += `&filter[department_name][eq]=${departmentFilter}`
  }

  axios.get(apiPath)
    .then(function (response) {
      setData(response?.data)
      const meta = response?.data.meta
      setTotalCount(meta.stats.total.count)
      setTotalPages(Math.ceil(meta.stats.total.count / pageSize))
    })
    .catch(function (error) {
      console.log(error);
    })
}

export default fetchEmployeeData;
