const mongoose=require('mongoose');
const mongodb = require('../mongodb.js')

let connChatCDB=mongoose.createConnection(mongodb.connection.urlC,mongodb.options)

const chatCollection='chatBasic'

const chatSchema=new mongoose.Schema({
    nombre:{type:String, require:true,max:100},
    correo:{type:String, require:true,max:100},
    edad:{type:Number, require:true,max:100},
    fecha:{type:String, require:true,max:100},
    thumbnail:{type:String, require:true,max:100},
    textIngresado:{type:String, require:true,max:100}
})

const chatCDBModel=connChatCDB.model(chatCollection,chatSchema)
module.exports=chatCDBModel;