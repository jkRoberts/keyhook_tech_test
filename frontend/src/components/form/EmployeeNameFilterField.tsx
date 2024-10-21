interface EmployeeNameFilterFieldProps {
  setSearchValue: (value: string | ((prevVar: string) => string)) => void
}

const EmployeeNameFilterField = ({setSearchValue}:EmployeeNameFilterFieldProps) => {

  return(
    <input
      name="filterByName"
      onChange={(e) => {
        if(e.target.value.length > 2) {
          setSearchValue(e.target.value)
        } else {
          setSearchValue('')
        }
      }}
    />
  )
}

export default EmployeeNameFilterField;
