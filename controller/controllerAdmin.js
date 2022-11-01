const ApiAdmin=require('../api/apiAdmin.js')
const modname='[controllerAdmin.js]'

//const {fork}=require('child_process')
const fnCom=require('../api/funciones_adicionales/comunicaciones')
const logd = require('../logging.js')
const logr=logd.child({modulo:`${modname}`})
const loger=logd.child({modulo:`${modname}[submod]`})
//const procAdminEmail=process.env.ADMIN_EMAIL


class ControllerAdmin{
constructor(){
    this.apiAdmin=new ApiAdmin()
}


ejecutarNotificacion=(req, res) => {
    const dataBody=req.body;
    //console.log("username-text.comentariosFile.routerPost",dataBody)//debug
    let notificacionEjecutada= this.apiAdmin.ejecutarNotificacion(dataBody)
    //console.log("Guardado.comentariosFile.routerPost")//debug
    res.send(notificacionEjecutada)
   
}

obtenerNumerosRandom=(req, res) => {
    let cant = req.query.cant
    let notificacionEjecutada= this.apiAdmin.obtenerNumerosRandom(cant)
    loger.verbose(notificacionEjecutada,{recurso:"[notificacionEjecutada]"})
    return res.json(notificacionEjecutada)
}

}

module.exports=ControllerAdmin