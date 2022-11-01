const comunicacionesFn=require('./funciones_adicionales/comunicaciones.js')
const logd = require('../logging.js')
const modname='[apiAdmin.js]'
const logr=logd.child({modulo:`${modname}`})
const path = require('path')
const { calculo } = require('./funciones_adicionales/operacion1.js')


const fnCom=require('./funciones_adicionales/comunicaciones')
const procAdminEmail=process.env.ADMIN_EMAIL

class ApiAdmin{
    constructor(){
        this.coms=comunicacionesFn
    }
    
    /* #region. 2.Chat*/

    ejecutarNotificacion(dataBody){
        logr.debug('ejecutarNotificacion',{recurso:'[na]'})
        fnCom.nodemailer('compraNew',procAdminEmail,dataBody)
        fnCom.twilio_sms_client()
        fnCom.twilio_whs_admin()
        return "Enviado"
    }

    obtenerNumerosRandom(cant){
        logr.debug(cant,{recurso:'[obtenerNumerosRandom][cant]'})
        return calculo(cant)
    }


}

module.exports=ApiAdmin