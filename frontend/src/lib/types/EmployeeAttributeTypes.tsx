export type EmployeeAttributeType = {
  first_name: string
  last_name: string
  age: number
  position: string
  department_name: string
}

export type DataType = {
  id: string
  type: string
  attributes: EmployeeAttributeType
}

export type EmployeesDataType = {
  data: DataType[],
  meta?: {
    stats: {
      total: {
        count: number
      }
    }
  }
}
