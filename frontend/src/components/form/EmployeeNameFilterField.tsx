interface EmployeeNameFilterFieldProps {
  setSearchValue: (value: string | ((prevVar: string) => string)) => void
}

// Functional Component to do a look up on Name. This will only become effective after two characters are entered
const EmployeeNameFilterField = ({setSearchValue}:EmployeeNameFilterFieldProps) => {

  return(
    <div>
      <label className="block" htmlFor="filterByName">Name</label>
      <input
        className="inline-block appearance-none border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        name="filterByName"
        placeholder="Begin typing a name"
        onChange={(e) => {
          if(e.target.value.length > 1) {
            setSearchValue(e.target.value)
          } else {
            setSearchValue('')
          }
        }}
      />
    </div>
  )
}

export default EmployeeNameFilterField;
