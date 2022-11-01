//Conexión con nube
const mongoose=require('mongoose')
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const mongodb = require('../mongodb.js')

let connUsers=mongoose.createConnection(mongodb.connection.urlC,mongodb.options)

const usersCollection='Users'

const usersSchema=new mongoose.Schema({
    username:{type:String, require:true, unique: true,max:100},
    passwordHash: { type: String, required: true },
    //password:{type:String, require:true,max:100},
    name:{type:String, require:true,max:100},
    email:{type:String, require:true,max:100},
    address:{type:String, require:true,max:100},
    age:{type:Number, require:true,max:100},
    telephone:{type:String, require:true,max:100},
})




usersSchema.plugin(uniqueValidator);

usersSchema.methods.validPassword = function(password) {
  console.log("[user.model.js](msg) password: ",password)
  return bcrypt.compareSync(password, this.passwordHash);
};

usersSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});


const usersModel=connUsers.model(usersCollection,usersSchema)
module.exports=usersModel;

//Conexión local
/*
let connUser=mongoose.createConnection('mongodb://localhost:27017/dbCoderTest',{
    useUnifiedTopology:true,
    useNewUrlParser:true
})

module.exports=connUser.model('Users',{
    username: String,
    password: String,
    name: String
})
*/

//const MONGO_OPTIONS={
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true,
    //     socketTimeoutMS: 30000,
    //     keepAlive: true,
    //     maxPoolSize: 50,
    //     autoIndex: false,
    //     retryWrites: false
    // }
    
    // const MONGO_USERNAME=process.env.MONGO_USERNAME;
    // const MONGO_PASSWORD=process.env.MONGO_PASSWORD;
    // const MONGO_HOST=process.env.MONGO_URL;
    
    // const MONGO={
    //     host: MONGO_HOST,
    //     username: MONGO_USERNAME,
    //     password: MONGO_PASSWORD,
    //     options: MONGO_OPTIONS,
    //     urlC: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
    // }