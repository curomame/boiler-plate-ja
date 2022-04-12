const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

//salt 이용해서 암호화 해야함
//그러려면 salt를 먼저 생성해야함
//salt rounds라는 것은 salt가 몇글자인지 10자리인 salt를 만들어서 암호화 진행

const userSchema = mongoose.Schema({

  name : {
    type:String,
    maxlength: 50
  },
  email:{
    type:String,
    trim:true,
    unique:1
  },
  password:{
    type:String,
    minlength:5,
  },
  lastname:{
    type:String,
    maxlength:50
  },
  role:{
    type:Number,
    default:0
  },
  image:String,
  token:{
    type:String,
  },
  tokenExp:{
    type:Number
  }

})

userSchema.pre('save', function( next ){

  var user = this;

  //비밀번호를 암호화 시킨다.

  if(user.isModified('password')){

    bcrypt.genSalt(saltRounds, function(err,salt){
      if(err) return next(err);
  
      bcrypt.hash(user.password,salt, function(err,hash){
        if(err) return next(err);
        user.password = hash
        next()
      })
    })

  } else {
    next()
  }

  //비크립트 사용

})

userSchema.methods.comparePassword = function(plainPassword, cb) {

  //플레인 / 암호화된 비밀번호 같은지 체크해야함
  //암호화해서 db의 비밀번호와 같은지 확인하는것임

  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err)
    cb(null, isMatch)
  }) 

}

userSchema.methods.generateToken = function(cb){

  var user = this;

  //json web token을 이용해서 token 생성하기

  var token = jwt.sign(user._id.toHexString(),'scretToken');

  user.token = token;
  user.save(function(err,user){
    if(err) return cb(err)
    cb(null, user)
  })


}


userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode한다.

  jwt.verify(token,'scretToken', function(err,decoded){
    
    // 유저 아이디를 이용해서 유저를 찾은 후 

    //클라이언트에서 가져온 토큰과 디비에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id":decoded, "token":token}, function(err, user){
      if(err) return cb(err);
      cb(null,user);
    })

  } )

}

const User = mongoose.model('User',userSchema)

module.exports = { User }