import { FC, useState } from 'react';

interface Props { }

const App: FC<Props> = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-6xl mb-8">{count}</div>
      <button
        className="px-6 py-2 rounded bg-black hover:bg-green-600 text-white"
        onClick={() => setCount((count) => count + 1)}
      >
        count++
      </button>
    </div>
  )
}

export default App;
