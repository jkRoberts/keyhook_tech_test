import { ColumnDef, useReactTable, getCoreRowModel, ColumnSort, SortingState, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { EmployeeDataType } from "../../lib/types/EmployeeAttributeTypes";

interface EmployeeTableProps {
  setSorting: (value: SortingState | ((prevVar: SortingState) => SortingState)) => void,
  sorting: ColumnSort[],
  columnData: EmployeeDataType[]
}

const EmployeeTable = ({setSorting, sorting, columnData}: EmployeeTableProps) => {
  const columns = useMemo<ColumnDef<EmployeeDataType>[]>(
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
    data: columnData,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return(
    <>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th className="text-left border-b-2 border-stone-950" key={header.id} colSpan={header.colSpan}>
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
                <tr className="even:bg-gray-50 odd:bg-white" key={row.id}>
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
    </>
  )
}

export default EmployeeTable;
