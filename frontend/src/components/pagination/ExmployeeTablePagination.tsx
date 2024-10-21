import { PaginationState } from "@tanstack/react-table";

interface ExmployeeTablePaginationProps {
  setPagination: (value: PaginationState | ((prevVar: PaginationState) => PaginationState)) => void
  pagination: PaginationState
  totalPages: number
  totalCount: number
}

const ExmployeeTablePagination = ({setPagination, pagination, totalCount, totalPages}: ExmployeeTablePaginationProps) => {
  return(
    <>
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
    </>
  )
}

export default ExmployeeTablePagination
