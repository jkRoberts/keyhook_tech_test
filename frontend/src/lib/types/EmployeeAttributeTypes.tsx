export type EmployeeAttributeType = {
  first_name: string
  last_name: string
  age: number
  position: string
  department_name: string
}

export type DepartmentAttributeType = {
  name: string
}

export type EmployeeDataType = {
  id: string
  type: string
  attributes: EmployeeAttributeType
}

export type DepartmentDataType = {
  id: string
  type: string
  attributes: DepartmentAttributeType
}

export type EmployeesDataType = {
  data: EmployeeDataType[],
  meta?: {
    stats: {
      total: {
        count: number
      }
    }
  }
}

export type DepartmentsDataType = {
  data: DepartmentDataType[],
  meta?: {
    stats: {
      total: {
        count: number
      }
    }
  }
}
