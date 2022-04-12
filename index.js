const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000


mongoose.connect('mongodb+srv://lee:abcd1234@boilerplate.lezfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => console.log('MONGODB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


