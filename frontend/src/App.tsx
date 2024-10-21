import { ColumnDef, flexRender, getCoreRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios'

type EmployeAttributeType = {
  first_name: string
  last_name: string
  age: number
  position: string
  department_name: string
}

type DataType = {
  id: string
  type: string
  attributes: EmployeAttributeType
}

type EmployeesDataType = {
  data: DataType[],
  meta?: {
    stats: {
      total: {
        count: number
      }
    }
  }
}

const base_api = 'http://localhost:4567/api/v1/employees?stats[total]=count'

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

const App = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const [data, setData] = useState<EmployeesDataType>(employeeDefault)

  const columns = useMemo<ColumnDef<DataType>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'attributes.first_name',
      },
      {
        header: 'Last Name',
        accessorKey: 'attributes.last_name',
      },
      {
        header: 'Age',
        accessorKey: 'attributes.age'
      },
      {
        header: 'Position',
        accessorKey: 'attributes.position'
      },
      {
        header: 'Department',
        accessorKey: 'attributes.department_name',
        enableSorting: false
      },
    ],
    []
  )
  const table = useReactTable({
    columns,
    data: data?.data,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  useEffect(() => {
    const activeSort = sorting[0] ?? null
    let sortQuery = activeSort?.id.replace(/attributes_/g,'');
    if(activeSort?.desc) {
      sortQuery = '-' + sortQuery
    }

    const fetchData = async () => {
      let apiPath = base_api

      if(sortQuery) {
        apiPath += "&sort=" + sortQuery
      }

      if(pagination.pageIndex > 0) {
        apiPath += `&page[size]=${pagination.pageSize}}&page[number]=${pagination.pageIndex + 1}`
      }

      if(searchValue) {
        apiPath += `&filter[name][fuzzy_match]=${searchValue}`
      }

      axios.get(apiPath)
        .then(function (response) {
          setData(response?.data)
          const meta = response?.data.meta
          setTotalCount(meta.stats.total.count)
          setTotalPages(Math.floor(meta.stats.total.count / pagination.pageSize))
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, searchValue, sorting]);

  return (
    <>
      <h1 className="text-2xl font-bold underline">Keyhook Test Project</h1>
      <>
        <div className="p-2">
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
          <table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                            onClick={
                              header.column.getToggleSortingHandler()
                            }
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() === 'desc'
                                    ? 'Sort descending'
                                    : 'Clear sort'
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows
                .map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => {
                setPagination({...pagination, pageIndex: 0})
              }}
              disabled={pagination.pageIndex === 0}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                setPagination({...pagination, pageIndex: pagination.pageIndex - 1})
              }}
              disabled={pagination.pageIndex === 0}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                setPagination({...pagination, pageIndex: pagination.pageIndex + 1})
              }}
              disabled={(pagination.pageIndex + 1) === totalPages}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                setPagination({...pagination, pageIndex: totalPages - 1})
              }}
              disabled={(pagination.pageIndex + 1) === totalPages - 1}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                { pagination.pageIndex + 1 } of{' '}
                { totalPages }
              </strong>
            </span>
          </div>
          <div>
            Showing {(pagination.pageIndex + 1) * pagination.pageSize} of{' '}
            {totalCount} Rows
          </div>
        </div>
      </>
    </>
  )
}

export default App
