import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = 5000

import dotenv from 'dotenv';
dotenv.config();
// let config = 'mongodb+srv://lee:abcd1234@boilerplate.lezfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

import cookieParser from 'cookie-parser'
import auth from './middleware/auth.js'

import User from './models/User.js'

//aplication / x-ww/form/urlencoded
app.use(express.json()) //For JSON requests

//aplication json - > 분석해서 가져옴
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MONGODB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!ssaaaaaa')
})

app.post('/api/users/register',(req,res)=>{

  //회원가입시 필요한 정보들을 client 에서 가져오면
  //그것들을 db에 넣어준다.
  console.log(req.body);
  const user = new User(req.body)
  user.save((err,userInfo) => {
    if(err) return res.json({success:false, err});
    return res.status(200).json({
      success:true
    })
  })

})


app.post('/api/users/login',(req,res) => {

  //요청된 이메일을 db에서 있는지 찾는다.

  User.findOne({ email:req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀 번호가 맞는 비밀번호인지 확인.

    user.comparePassword(req.body.password, (err,isMatch) => {

      if(!isMatch)
      return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})

      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        // token을 저장한다. 어디에? 쿠키, 로컬 스토리지?
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess:true, userId:user._id})


      })

    })

  })


  //비밀번호까지 맞다면, 토큰을 생성하기.


})

app.get('/api/users/auth',auth,(req,res) => {

  //인증처리를 하는 곳

  //여기까지 미들웨어를 통과했다는 것은 auth 가 true 라는 말
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role === 0 ? false : true,
    isAuth:true,
    email:req.user.email,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image

  })

})

app.get('/api/users/logout',auth, (req,res) => {
  User.findOneAndUpdate({_id:req.user._id},
    {token:""}
    ,(err, user)=>{
      if(err)return res.json({success:false,err})
      return res.status(200).send({
        success:true
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


