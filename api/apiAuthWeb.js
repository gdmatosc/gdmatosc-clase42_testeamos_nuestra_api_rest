const comunicacionesFn=require('./funciones_adicionales/comunicaciones.js')
const logd = require('../logging.js')
const modname='[apiAuthWeb.js]'
const logr=logd.child({modulo:`${modname}`})
const path = require('path')
const fs=require('fs')
const formidable = require("formidable")
const fnCom=require('./funciones_adicionales/comunicaciones')

class ApiAuth{
    constructor(){
        this.coms=comunicacionesFn
    }

    /* #region. 2.Authentication general */

    getPublic(target){
        switch(target){
            case 'Login': return path.resolve(__dirname, '../public')+'/login.html'
            case 'Signup': return path.resolve(__dirname, '../public')+'/signup.html'
            default: return path.resolve(__dirname, '../public')+'/index.html'
        }
    }
    getLogin(username,name,email,address,age,telephone){
        logr.debug({username,name,email,address,age,telephone},{recurso:'[getlogin][username,name,email,address,age,telephone]'})
        return {username,name,email,address,age,telephone}
    }

    postLogin(username,name,email,address,age,telephone){
        logr.debug('[postLogin]',{recurso:'[na]'})
        fnCom.currentUser(username)
        fnCom.currentUserTelephone(telephone)
        return {username,name,email,address,age,telephone}
    }

    getLogout(username){
        logr.debug('[getLogout]',{recurso:'[na]'})
        return {username}
    }

    /* #endregion */

    /* #region. 3.Authorization clientes */

    getHomeGeneral(username){
        logr.debug('[getHomeGeneral]',{recurso:'[na]'})
        return {username}
    }

    getUserProfile(username,name,email,address,age,telephone){
        logr.debug('[getUserProfile]',{recurso:'[na]'})
        return {username,name,email,address,age,telephone}
    }

    getChatGeneral(username){
        logr.debug('[getChatGeneral]',{recurso:'[na]'})
        return {username}
    }

    getProductosClientes(username){
        logr.debug('[getProductosClientes]',{recurso:'[na]'})
        return {username}
    }

    getCarritoClientes(username){
        logr.debug('[getCarritoClientes]',{recurso:'[na]'})
        return {username}
    }

    getCompraExitosa(username){
        logr.debug('[getCompraExitosa]',{recurso:'[na]'})
        return {username}
    }

    postUploadFile(uploadFolder,file){
        const loger=logd.child({modulo:`${modname}[uploadFile`})
        logr.debug('[postUploadFile]',{recurso:'[na]'})
        loger.verbose(file.filepath,{recurso:"[file.filepath]"})
        //const fileType = '.'+file.mimetype.split("/").pop();
        const fileName = 'avatar1'+'.'+file.mimetype.split("/").pop();
        loger.verbose(fileName,{recurso:"[fileName]"})
        fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
        return 'File uploaded'
    }


    /* #endregion */

    /* #region. 4.Authorization Admin */

    getHomeAdmin(username){
        logr.debug('[getHomeAdmin]',{recurso:'[na]'})
        return {username}
    }

    getProductosMantenimiento(username){
        logr.debug('[getProductosMantenimiento]',{recurso:'[na]'})
        return {username}
    }

    getOperacionesRandoms(username){
        logr.debug('[getOperacionesRandoms]',{recurso:'[na]'})
        return {username}
    }

    getOperacionesInfo(username,id_proceso,nombre_plataforma,version_node,carpeta_proyecto,path_ejecucion,memoria_reservada,argumentos_entrada){
        logr.debug('[getOperacionesInfo]',{recurso:'[na]'})
        return {username,id_proceso,nombre_plataforma,version_node,carpeta_proyecto,path_ejecucion,memoria_reservada,argumentos_entrada}
    }

    getDefault(){
        logr.debug('[getDefault]',{recurso:'[na]'})
        return '<h1>la ruta no existe</h1>'
    }

    
    /* #endregion */
    

    

    


}

module.exports=ApiAuth