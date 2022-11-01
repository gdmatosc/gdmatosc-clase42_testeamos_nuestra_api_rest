const express=require('express')
const router=express.Router()
const logd = require('../logging.js')
const modname='[routerAdmin.js]'
const logr=logd.child({modulo:`${modname}`})

const ControllerAdmin=require('../controller/controllerAdmin.js')

class RouterAdmin{
    constructor(){
        this.controllerAdmin=new ControllerAdmin()
    }

    start(){
        //logr.debug('inicio de start()',{recurso:'[na]'})
        router.post('/notificacion',this.controllerAdmin.ejecutarNotificacion)
        router.get('/numerosRandom/:id',this.controllerAdmin.obtenerNumerosRandom)
        return router
    }


}

module.exports=RouterAdmin