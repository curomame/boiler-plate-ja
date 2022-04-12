const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

const config = require('./config/key');

const {User} = require("./models/User")

//aplication / x-ww/form/urlencoded
app.use(express.json()) //For JSON requests

//aplication json - > 분석해서 가져옴
app.use(express.urlencoded({extended: true}));

mongoose.connect(config.mongoURI)
  .then(() => console.log('MONGODB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!ssaaaaaa')
})

app.post('/register',(req,res)=>{

  //회원가입시 필요한 정보들을 client 에서 가져오면
  //그것들을 db에 넣어준다.

  const user = new User(req.body)
  user.save((err,userInfo) => {
    if(err) return res.json({success:false, ree})
    return res.status(200).json({
      success:true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


