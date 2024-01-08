import { createSignal } from 'solid-js';

const App = () => {
  const [count, setCount] = createSignal(0)
  return (
    <div class="flex flex-col h-screen items-center justify-center">
      <div class="text-6xl mb-8">{count()}</div>
      <button
        class="px-6 py-2 rounded bg-black hover:bg-green-600 text-white"
        onClick={() => setCount((count) => count + 1)}
      >
        count++
      </button>
    </div>
  )
}

export default App;
