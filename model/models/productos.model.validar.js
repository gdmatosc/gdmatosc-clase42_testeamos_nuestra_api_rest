const Joi = require('joi')
const logd = require('../../logging.js')
const modname='[productos.model.validar.js]'
const logr=logd.child({modulo:`${modname}`})

class Productos{
    constructor(nombre,img,precio,descripcion,promocion){
        this.nombre=nombre
        this.img=img
        this.precio=precio
        this.descripcion=descripcion
        this.promocion=promocion
    }

    equals(otroProductos){
        if(!(otroProductos instanceof Productos)){
            return false
        }
        if(this.nombre!=otroNoticias.nombre){
            return false
        }
        if(this.img!=otroNoticias.img){
            return false
        }
        if(this.precio!=otroNoticias.precio){
            return false
        }
        if(this.descripcion!=otroNoticias.descripcion){
            return false
        }
        if(this.promocion!=otroNoticias.promocion){
            return false
        }
        return true
    }

    static validar(producto,requerido){
        logr.debug('(inicio)',{recurso:'[static validar()][na'})
        const ProductoSchema=Joi.object({
            nombre: requerido? Joi.string().required(): Joi.string(),
            img: requerido? Joi.string().required(): Joi.string(),
            precio: requerido? Joi.number().required(): Joi.number(),
            descripcion: requerido? Joi.string().required(): Joi.string(),
            promocion: requerido? Joi.string().required(): Joi.string(),
        })
        const {error}=ProductoSchema.validate(producto)
        logr.warn(error,{recurso:'[error]'})
        if(error){
            throw error
        }
    }
}

module.exports=Productos

// nombre:{type:String, require:true,max:100},
// img:{type:String, require:true,max:100},
// precio:{type:Number, require:true,max:100},
// descripcion:{type:String, require:true,max:100},
// promocion:{type:String, require:true,max:100},