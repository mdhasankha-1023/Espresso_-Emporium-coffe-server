const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// meddle-were
app.use(cors())
app.use(express())

// get the server in root point [for tasting]
app.get('/', (req, res)=> {
    res.send('This is Espresso-Emporium-coffe server')
})

// app listen
app.listen(port, (req, res)=> {
    console.log(`The server is running on: ${port}`)
})