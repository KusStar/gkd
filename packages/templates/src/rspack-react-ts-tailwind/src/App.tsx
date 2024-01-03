import { FC, useState } from 'react';

interface Props { }

const App: FC<Props> = () => {
	const [count, setCount] = useState(0)
	return (
		<div className="flex flex-col h-screen items-center justify-center">
			<p className='text-4xl font-bold mb-8'>Rspack + React + TS + TailwindCSS</p>
			<div className="text-2xl mb-8">{count}</div>
			<button
				className="px-6 py-2 rounded bg-black hover:bg-blue-500 text-white"
				onClick={() => setCount((count) => count + 1)}
			>
				count++
			</button>
		</div>
	)
}

export default App;
