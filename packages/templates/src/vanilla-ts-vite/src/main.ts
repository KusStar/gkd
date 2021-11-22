const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello <%- name %>!</h1>
`
