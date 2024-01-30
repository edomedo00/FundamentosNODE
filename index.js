const http = require('http');
const port = 5000;

const server = http.createServer((req, res) => {
  res.sendDate('Server created')
})

server.listen(port, () => {
  console.log('Server working')
})