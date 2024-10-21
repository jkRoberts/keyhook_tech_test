import axios from "axios"
import { EmployeesDataType } from "../types/EmployeeAttributeTypes"

interface fetchDataProps {
  sortQuery: string
  pageIndex: number
  pageSize: number
  searchValue: string
  setData: (value: EmployeesDataType | ((prevVar: EmployeesDataType) => EmployeesDataType)) => void
  setTotalCount: (value: number | ((prevVar: number) => number)) => void
  setTotalPages: (value: number | ((prevVar: number) => number)) => void
}

const base_api = 'http://localhost:4567/api/v1/employees?stats[total]=count'

const fetchEmployeeData = async ({
  sortQuery,
  pageIndex,
  pageSize,
  searchValue,
  setData,
  setTotalCount,
  setTotalPages
}: fetchDataProps) => {
  let apiPath = base_api

  if(sortQuery) {
    apiPath += "&sort=" + sortQuery
  }

  if(pageIndex > 0) {
    apiPath += `&page[size]=${pageSize}}&page[number]=${pageIndex + 1}`
  }

  if(searchValue) {
    apiPath += `&filter[name][fuzzy_match]=${searchValue}`
  }

  axios.get(apiPath)
    .then(function (response) {
      setData(response?.data)
      const meta = response?.data.meta
      setTotalCount(meta.stats.total.count)
      setTotalPages(Math.floor(meta.stats.total.count / pageSize))
    })
    .catch(function (error) {
      console.log(error);
    })
}

export default fetchEmployeeData;
