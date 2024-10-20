import { useReactTable } from '@tanstack/react-table'
import { useState } from 'react';

const App = () => {
  const [sort, setSort] = useState(
    {
      column: '',
      sortDirection: 'ASC'
    }
  )

  const data = {

  }

  return (
    <>
      <h1 className="text-2xl font-bold underline">Keyhook Test Project</h1>
    </>
  )
}

export default App
