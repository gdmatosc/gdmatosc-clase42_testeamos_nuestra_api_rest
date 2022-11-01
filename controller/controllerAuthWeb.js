const ApiAuth=require('../api/apiAuthWeb.js')
const PassportAuth=require('../model/passportAuth.js')
const logd = require('../logging.js')
const modname='[controllerAuth.js]'
const logr=logd.child({modulo:`${modname}`})
const fs=require('fs')
const formidable = require("formidable")
const path = require('path')

class ControllerAuth{
constructor(){
    this.apiAuth=new ApiAuth()
    this.apiAuthGetPublic=this.apiAuth.getPublic.bind(this)
    this.apiAuthPostUploadFile=this.apiAuth.postUploadFile.bind(this)
    this.form = new formidable.IncomingForm()
}

/* #region. 2.Authentication general */

getRoot=(req,res)=>{
    let web= this.apiAuth.getPublic()
    
    logd.verbose(web,{recurso:"(pruebas en try)[web]"})
    
    res.sendFile(web)
}

getLogin=(req,res)=>{
    //const loge=factoryLog(`${modname}[getlogin]`)
    const loger=logd.child({modulo:`${modname}[getLogin]`})
    let web1=this.apiAuthGetPublic()
    logd.verbose(web1,{recurso:"(pruebas en try)[web1]"})
    loger.debug(req.isAuthenticated(),{recurso:'(antes del if req.isAuthenticated())[req.isAuthenticated()]'})
    if(req.isAuthenticated()){
        loger.debug('(inicio if req.isAuthenticated())',{recurso:'[na]'})
        const user=req.user
        let username=req.user.username
        let name=req.user.name
        let email=req.user.email
        let address=req.user.address
        let age=req.user.age
        let telephone=req.user.telephone
        let webAuth= this.apiAuth.getLogin(username,name,email,address,age,telephone)
        logd.verbose(webAuth,{recurso:"(pruebas en try)[webAuth]"})
        //res.send('login-ok')
        res.render('userProfile',webAuth)
    }else{
        loger.debug('(inicio else req.isAuthenticated())',{recurso:'[na]'})
        let webNoAuth= this.apiAuth.getPublic('Login')
        res.sendFile(webNoAuth)
    }
}

postLogin=(req,res)=>{
     const loger=logd.child({modulo:`${modname}[postLogin]`})
    // loger.debug('(antes de this.passportAuth.authLogin)',{recurso:'[na]'})
    //PassportAuth.authLoginNew(req, res)
    loger.debug(req.isAuthenticated(),{recurso:'(despues de this.passportAuth.authLogin)[req.isAuthenticated()]'})

    if(req.isAuthenticated()){
        
        loger.info(JSON.stringify(req.user),{recurso:'[req.user]'})
        loger.debug(JSON.stringify(req.session),{recurso:'[req.session]'})
        loger.info(JSON.stringify(req.user.username),{recurso:'[req.user.username]'});
        let username=req.user.username
        let name=req.user.name
        let email=req.user.email
        let address=req.user.address
        let age=req.user.age
        let telephone=req.user.telephone
        let web= this.apiAuth.postLogin(username,name,email,address,age,telephone)
        loger.debug(web,{recurso:'(en if justo antes del res.render(web))[web]'})
        res.render('userProfile',web)
    }
}

getLogout=(req,res)=>{
    let username=req.user.username
    req.session.destroy()
    let web= this.apiAuth.getLogout(username)
    return res.render('logout',web)
}

 /* #endregion */

/* #region. 3.Authorization clientes */

getHomeGeneral=(req,res)=>{
    const loger=logd.child({modulo:`${modname}[get-homeGeneral]`})
    let username=req.user.username
    loger.verbose(username,{recurso:"[username]"})
    if(!username) return res.redirect('/login')
    let web= this.apiAuth.getHomeGeneral(username)
    return res.render('homeGeneral',web)
}

getUserProfile=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-userProfile]`})
    loger.verbose(req,{recurso:"[req]"})
    loger.verbose(req.session,{recurso:"[req.session]"})
    let username=req.user.username
    let name=req.user.name
    let email=req.user.email
    let address=req.user.address
    let age=req.user.age
    let telephone=req.user.telephone
    loger.verbose(username,{recurso:"[username]"})
    if(!username) return res.redirect('/login')
    let web= this.apiAuth.getUserProfile(username,name,email,address,age,telephone)
    return res.render('userProfile',web)
}

getChatGeneral=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-chatGeneral]`})
    let username=req.user.username
    loger.verbose(username,{recurso:"[username]"})
    let web= this.apiAuth.getChatGeneral()
    return res.render('chatGeneral.ejs',web)
}

getProductosClientes=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-productosClientes]`})
    let username=req.session.username
    loger.verbose(username,{recurso:"[reqSessionUsername]"})
    let web= this.apiAuth.getProductosClientes()
    return res.render('productosClientes.ejs',web)
    //return res.sendFile(path.resolve(__dirname, '../Clase28.desafio/f1.views')+'/productosClientes.html')
}

getCarritoClientes=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-carritoClientes]`})
    let username=req.session.username
    //loger.verbose(res,{recurso:"[res]"})
    loger.verbose(username,{recurso:"[reqSessionUsername]"})
    let web= this.apiAuth.getCarritoClientes()
    return res.render('carritoClientes.ejs',web)
}

getCompraExitosa=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-compraExitosa]`})
    //twilio_sms(cliente)
    //twilio_whs(admin)
    //nodemailer(admin,detalles)
    let username=req.user.username
    loger.verbose(username,{recurso:"username"})
    let web= this.apiAuth.getCompraExitosa()
    return res.render('compraExitosa',web)
}

postUploadFile=(req, res) => {
    //basic setup
    
    const loger=logd.child({modulo:`${modname}[post-api/uploadFile`})
    //const uploadFolder = path.join(__dirname, "public", "imgUser")
    const uploadFolder = path.resolve(__dirname, '../public')+'/imgUser'
    
    loger.verbose(uploadFolder,{recurso:"[uploadFolder]"})
    //basic configuration
    this.form.uploadDir = uploadFolder
    //console.log(form);
    loger.verbose(JSON.stringify(this.form),{recurso:"[this.form]"})
    //parsing
    
    let apiAuthForm=this.apiAuth

    this.form.parse(req, function (err, fields, files) {
        //console.log(fields)
        //console.log(files)
        loger.verbose(fields,{recurso:"[fields]"})
        loger.verbose(JSON.stringify(files),{recurso:"[files]"})
        const file = files.myFile;
        
        let fileUpload= apiAuthForm.postUploadFile(uploadFolder,file)

        if (err) {
            loger.warn(`Error en sección parsing: ${err}`,{recurso:'[error]'})
            return res.status(400).json({status: "Fail",message: "There was an error parsing the files",error: err,})
          }

        else {
            //console.log(file)
            loger.verbose(JSON.stringify(file),{recurso:"[file]"})
            // actualizar nombre del archivo
            loger.verbose(file.originalFilename,{recurso:"[file.originalFilename]"})
            try {
                res.write(fileUpload);
                res.end();
            } catch (error) {
                loger.warn(`Error en sección update name: ${error}`,{recurso:'[error]'});
                //console.log(error);
            }
   
        }
        
      });
    
    
  };

 /* #endregion */

/* #region. 4.Authorization Admin */

getHomeAdmin=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-homeAdmin]`})
    let username=req.user.username
    loger.verbose(username,{recurso:"username"})
    let web= this.apiAuth.getHomeAdmin()
    return res.render('homeAdmin',web)
}

getProductosMantenimiento=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-productosMantenimiento]`})
    let username=req.session.username
    loger.verbose(username,{recurso:"[reqSession.Username]"})
    let web= this.apiAuth.getProductosMantenimiento(username)
    return res.render('productosMantenimiento.ejs',web)
}

getOperacionesRandoms=(req,res)=>{
    //logr.verbose(req.session);
    const loger=logd.child({modulo:`${modname}[get-operaciones1Admin`})
    let username=req.session.username
    loger.verbose(username,{recurso:"[reqSession.Username]"})
    let web= this.apiAuth.getOperacionesRandoms(username)
    return res.render('operaciones1Admin.ejs',web)
}

getOperacionesInfo=(req,res)=>{
    //logr.verbose(req.session);
    let username=req.session.username
    let dato1='pruebas'
    let id_proceso=process.pid
    let nombre_plataforma=process.platform
    let version_node=process.version
    let carpeta_proyecto=process.cwd()
    let path_ejecucion=process.execPath
    let memoria_reservada=process.memoryUsage.rss()
    let argumentos_entrada=process.execArgv
    logr.verbose(username,{recurso:"reqSessionUsername.appGet"})
    let web= this.apiAuth.getOperacionesInfo(username,id_proceso,nombre_plataforma,version_node,carpeta_proyecto,path_ejecucion,memoria_reservada,argumentos_entrada)
    return res.render('operaciones2Admin.ejs',web)
}

getDefault= (req, res)=> {
    const loger=logd.child({modulo:`${modname}[get-Ruta-Default]`})
    let ruta=req.path
    loger.warn(ruta,{recurso:"[path]"})
    let web= this.apiAuth.getDefault()
    res.send(web);
}

 /* #endregion */


}

module.exports=ControllerAuth


//app.post('/login',passport.authLogin,apiRouterAuth.postLogin)

// app.get('/logout',checkAuthentication,(req,res)=>{
//     let username=req.user.username
//     req.session.destroy()
//     return res.render('logout',{username})

// })

// function getRoot(req,res){
//     res.sendFile(path.resolve(__dirname, '../public')+'/index.html')
// }

// function getLogin(req,res){
//     //const loge=factoryLog(`${modname}[getlogin]`)
//     if(req.isAuthenticated()){
//         const user=req.user
//         let username=req.user.username
//         logr.info(username,{recurso:'[username]'})
//         //res.send('login-ok')
//         res.render('userProfile',{username})
//     }else{
        
//         res.sendFile(path.resolve(__dirname, '../public')+'/login.html')
//     }
// }

// function postLogin(req,res){
//     //const loge=factoryLog(`${modname}[postlogin]`)
//     const loger=logd.child({modulo:`${modname}[postLogin]`})
//     loger.info(JSON.stringify(req.user),{recurso:'[req.user]'})
//     loger.debug(JSON.stringify(req.session),{recurso:'[req.session]'})
//     loger.info(JSON.stringify(req.user.username),{recurso:'[req.user.username]'});
//     let username=req.user.username
//     let name=req.user.name
//     let email=req.user.email
//     let address=req.user.address
//     let age=req.user.age
//     let telephone=req.user.telephone
//     fnCom.currentUser(username)
//     fnCom.currentUserTelephone(telephone)
//     res.render('userProfile',{username,name,email,address,age,telephone})
// }