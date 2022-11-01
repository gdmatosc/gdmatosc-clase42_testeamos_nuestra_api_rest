const express=require('express')
const router=express.Router()
const PassportAuth=require('../model/passportAuth.js')
const logd = require('../logging.js')
const modname='[routerAuth.js]'
const logr=logd.child({modulo:`${modname}`})

const ControllerAuth=require('../controller/controllerAuthWeb.js')

class RouterAuth{
    constructor(){
        this.controllerAuth=new ControllerAuth()
    }

    start(){
        //logr.debug('inicio de start()',{recurso:'[na]'})
        router.get('/',this.controllerAuth.getRoot)
        router.get('/login',this.controllerAuth.getLogin)
        router.post('/login',PassportAuth.authLogin,this.controllerAuth.postLogin)
        router.get('/logout',PassportAuth.checkAuthentication,this.controllerAuth.getLogout)
        router.get('/homeGeneral',PassportAuth.checkAuthentication,this.controllerAuth.getHomeGeneral)
        router.get('/userProfile',PassportAuth.checkAuthentication,this.controllerAuth.getUserProfile)
        router.get('/chatGeneral',PassportAuth.checkAuthentication,this.controllerAuth.getChatGeneral)
        router.get('/productosClientes',PassportAuth.checkAuthentication,this.controllerAuth.getProductosClientes)
        router.get('/carritoClientes',PassportAuth.checkAuthentication,this.controllerAuth.getCarritoClientes)
        router.get('/homeAdmin',PassportAuth.checkAuthentication,this.controllerAuth.getHomeAdmin)
        router.get('/compraExitosa',PassportAuth.checkAuthentication,this.controllerAuth.getCompraExitosa)
        router.get('/productosMantenimiento',PassportAuth.checkAuthentication,this.controllerAuth.getProductosMantenimiento)
        router.get('/operaciones/randoms',PassportAuth.checkAuthentication,this.controllerAuth.getOperacionesRandoms)
        router.get('/operaciones/info',PassportAuth.checkAuthentication,this.controllerAuth.getOperacionesInfo)
        router.post('/api/uploadFile',PassportAuth.checkAuthentication,this.controllerAuth.postUploadFile)
        router.get('*',PassportAuth.checkAuthentication,this.controllerAuth.getDefault)
        return router
    }


}

module.exports=RouterAuth

