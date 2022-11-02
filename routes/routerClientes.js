const express=require('express')
const router=express.Router()
const logd = require('../logging.js')
const modname='[routerClientes.js]'
const logr=logd.child({modulo:`${modname}`})

const ControllerClientes=require('../controller/controllerClientes.js')

class RouterClientes{
    constructor(){
        this.controllerClientes=new ControllerClientes()
    }

    start(){
        //logr.debug('inicio de start()',{recurso:'[na]'})
        router.get('/comentarios',this.controllerClientes.obtenerComentariosTodos)
        router.post('/comentarios',this.controllerClientes.guardarComentarios)
        router.delete('/comentarios',this.controllerClientes.borrarComentariosTodos)

        router.get('/objetos',this.controllerClientes.obtenerObjetosTodos)
        router.post('/objetos',this.controllerClientes.guardarObjetos)
        router.delete('/objetos',this.controllerClientes.borrarObjetosTodos)
        router.delete('/objetos/:id',this.controllerClientes.borrarObjeto)

        router.get('/objetosCarrito',this.controllerClientes.obtenerObjetosCarritosTodos)
        router.get('/objetosCarrito/:id',this.controllerClientes.obtenerObjetosCarrito)
        router.post('/objetosCarrito/:id/objetos',this.controllerClientes.guardarObjetosCarrito)
        router.delete('/objetosCarrito/:id/objetos',this.controllerClientes.borrarObjetosCarrito)

        return router
    }


}

module.exports=RouterClientes