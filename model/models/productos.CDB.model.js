const mongoose=require('mongoose');
const mongodb = require('../mongodb.js')

let connProductosCDB=mongoose.createConnection(mongodb.connection.urlC,mongodb.options)

const productosCollection='productosGeneral'

const productosSchema=new mongoose.Schema({
    nombre:{type:String, require:true,max:100},
    img:{type:String, require:true,max:100},
    precio:{type:Number, require:true,max:100},
    descripcion:{type:String, require:true,max:100},
    promocion:{type:String, require:true,max:100},
})

const productosCDBModel=connProductosCDB.model(productosCollection,productosSchema)
module.exports=productosCDBModel;
