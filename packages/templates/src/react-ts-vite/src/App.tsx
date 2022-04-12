import { FC } from 'react';
import './App.css'

interface Props {}

const App: FC<Props> = () => {
  return (
    <h1>Hello, <%- name %></h1>
  )
}

export default App;
