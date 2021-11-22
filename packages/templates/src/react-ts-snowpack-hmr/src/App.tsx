import React, { FC } from 'react';

interface Props {}

const App: FC<Props> = () => {
  return (
    <h1>Hello, <%- name %></h1>
  )
}

export default App;
