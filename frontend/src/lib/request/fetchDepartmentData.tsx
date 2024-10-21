import axios from "axios"
import { DepartmentsDataType } from "../types/EmployeeAttributeTypes"

interface fetchDataProps {
  setDepartments: (value: DepartmentsDataType | ((prevVar: DepartmentsDataType) => DepartmentsDataType)) => void
}

const baseApi = 'http://localhost:4567/api/v1/departments?stats[total]=count'

const fetchDepartmentData = async ({
  setDepartments
}: fetchDataProps) => {

  axios.get(baseApi)
    .then(function (response) {
      setDepartments(response?.data)
    })
    .catch(function (error) {
      console.log(error);
    })
}

export default fetchDepartmentData;
