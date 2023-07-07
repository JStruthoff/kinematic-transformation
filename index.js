const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/node_modules'));
// app.use(express.static(__dirname + '/node_modules/three/examples'));
// app.use(express.static(__dirname + '/node_modules/three/examples/jsm'));

app.get('/', (req, res) => {
    const filename = path.join(__dirname, 'app', 'index.html');
    res.sendFile(filename)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})