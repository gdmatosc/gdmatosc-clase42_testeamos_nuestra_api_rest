/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */ 

const express=require('express');
const session=require('express-session')
const app=express();
const fs=require('fs')
const formidable = require("formidable")
const cluster=require('cluster')
const {cpus}=require('os')


//require('dotenv').config({ path: './b7.configuraciones/config.env' })
require('dotenv').config()
//console.log(process.env)
const hostname = process.env.HOSTNAME;
//const port = process.env.PORT;
//const { log } = require('./b7.configuraciones/logging.js')
const logd = require('./logging.js')
const modname='[server.js]'
const logr=logd.child({modulo:`${modname}`})
//const logd=factoryLog('[b0.server.js]')
//const loge=factoryLog('[b0.server.js][Server]')
const MongoStore=require('connect-mongo')
const mongoose=require('mongoose')

//const apiRouterClientes=require('./b11.routes/apiRouterClientes');
const apiRouterOper=require('./routes/apiRouterOperaciones');
const apiRouterAuth=require('./routes/apiRouterAuth')
const RouterAdmin=require('./routes/routerAdmin')
const routerAdmin=new RouterAdmin()
const RouterAuth=require('./routes/routerAuthWeb')
const routerAuth=new RouterAuth()
const RouterClientes=require('./routes/routerClientes')
const routerClientes=new RouterClientes()
const fnCom=require('./api/funciones_adicionales/comunicaciones')
const { Server }=require("socket.io")


const http=require('http');
const server=http.createServer(app)
const io=new Server(server);

//const session=require('express-session')
//const passport=require('passport')
//const LocalStrategy=require('passport-local').Strategy
const passport=require('./model/passportAuth')

const path = require('path')

const UsersModel=require('./model/models/user.model')

//const process_PORT=parseInt(process.argv[2]) || 8081;
//const process_PORT=8081;

// const process_PORT=process.env.PORT || 8081;
const process_PORT=process.env.PORT || parseInt(process.argv[2]) || 8081
const procAdminEmail=process.env.ADMIN_EMAIL
const modoCluster=process.argv[3]=='CLUSTER'

const yargs=require('yargs')(process.argv.slice(2))
const argv=yargs
    .default({
        PORT: 8081,
        ruta: 'local'
    })
    .alias({
        p: 'PORT'
    })
    .boolean('admin')
    .argv
//logr.verbose(argv)
//logr.verbose(argv.ruta)
logr.info(argv.PORT,{recurso:'[Puerto]'})

/* #endregion */

//1.1.Control de Cluster
if (modoCluster && cluster.isPrimary){
    const numCPUs=cpus().length
    logr.warn(`Número de procesadores: ${numCPUs}`,{recurso:'numCPUs'})
    logr.warn(`PID MASTER: ${process.pid}`,{recurso:'process.pid'})
    //console.log(`[b0.server.js]Número de procesadores: ${numCPUs}`)
    //console.log(`[b0.server.js]PID MASTER: ${process.pid}`)

    for(let i=0; i<numCPUs;i++){
        cluster.fork()
    }

    cluster.on('exit',worker=>{
        logr.warn(`Worker ${worker.process.pid} died ${new Date().toLocaleString()}`,{recurso:'[process.pid]'})
        //console.log('[b0.server.js]Worker',worker.process.pid,'died',new Date().toLocaleString())
        cluster.fork()
    })

}
//1.2.Implementación de servicios
else{

/* #region. 2.Recursos de web socket*/
const mensajesDBTest=[
    {id:1,nombre:"User 1",correo:"u1@company.com",edad:20,textoIngresado:"Iniciamos!"},
    {id:2,nombre:"User 2",correo:"u2@company.com",edad:21,textoIngresado:"Primero!"},
    {id:3,nombre:"User 3",correo:"u3@company.com",edad:22,textoIngresado:"Que empiece!"}
]

let messages=[]

let GetComentarios=()=>{
    const options = {
        host : 'localhost',
        port : argv.PORT,
        path: '/apiClientes/comentarios',
        method: 'GET'
    };
    // Sending the request
    const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
        data += chunk;
    });
    // Ending the response 
    res.on('end', () => {
        messages = JSON.parse(data);
        //logr.verbose("mensajes",data)
        //logr.verbose('mensajesJson:', JSON.parse(data))
    });
       
    }).on("error", (err) => {
    logr.error("Error: ", err)
    }).end()
            
} 

io.on('connection',(socket)=>{
    const loger=logd.child({modulo:`${modname}[io.on-connection]`})
    GetComentarios()
    socket.emit('messages',messages)
    loger.verbose(`User conectado con id: ${socket.id}`,{recurso:'socket.id'});
    let mensajesDBTemporal=messages
    loger.verbose('Usuario conectado socket inicial',{recurso:'na'})
    socket.on('new-message',data=>{
        const loger=logd.child({modulo:`${modname}[io.on-connection-socketOn_new-message]`})
        GetComentarios()
        loger.verbose("Recibido new-message",{recurso:'na'})
        dataJson=JSON.parse(data)
        loger.verbose(`DataSinId: ${dataJson}`,{recurso:'dataJson'})
        dataJson["id"]="1";
        loger.verbose(`DataConId: ${dataJson}`,{recurso:'dataJson'})
        mensajesDBTemporal.push(dataJson)
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        loger.verbose(`mensajesDBTemporal.new-message-fin: ${mensajesDBTemporal}`,{recurso:'mensajesDBTemporal'})
    });
    socket.on('new-message-delete',data=>{
        const loger=logd.child({modulo:`${modname}[io.on-connection-socketOn_new-message-delete]`})
        GetComentarios()
        mensajesDBTemporal=[]
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        loger.verbose(`mensajesDBTemporal.new-message-delete-fin: ${mensajesDBTemporal}`,{recurso:'mensajesDBTemporal'})
        
    });
    
})
/* #endregion */ 

/* #region. 3.Configuraciones de lib express, uso de EJS y APIs*/

//3.1.config. general de Lib express
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname+'/public'))
//3.2.config. APIs
app.use('/apiClientes',routerClientes.start());
app.use('/apiOperaciones',routerAdmin.start());
//3.3.config. EJS
app.set('views','./views')
app.set('view engine','ejs')

/* #endregion */ 

/* #region. 4.Passport con enrutamiento*/
//4.1.Configuración de passport


// passport.use('login',new LocalStrategy(
//     (username,password,done)=>{
//         const loger=logd.child({modulo:`${modname}[passpord.use-login]`})
//         loger.verbose('',{recurso:"[na](inicio-antes de usersmodel.findone)"})
//         UsersModel.findOne({ username })
//         .then(user => {
//               //loger.verbose(user,{recurso:"[user](dentro de usersmodel-antes del if)"})
//               if (!user || !user.validPassword(password)) {
//                 loger.verbose(user,{recurso:"[user](Invalid username/password)(dentro de usersmodel-en if)"})
//                 //loger.verbose(user.validPassword(password)??'nulo',{recurso:"[user.validPassword(password)](dentro de usersmodel-en if)"})
//                 //return done(null, false, { message: "Invalid username/password" })
//                 return done(null,false,{ error: 'Invalid username/password' })
//                 //return done(null, user)
//                 console.log('[b0.server.js](after return in if of usersmode.findone)')
//             } else {
//                 loger.verbose(user.validPassword(password),{recurso:"[user.validPassword(password)](dentro de usersmodel-en else)"})
//                 //let userDetails=[user]
//                 //fnCom.nodemailer(procAdmin,userDetails)
//                 loger.verbose(user,{recurso:"[user](dentro de usersmodel-en else)"})
//                 return done(null, user)
//             }
//             })
//         .catch(e => {
//             console.log("[b0.server.js][catch](login-error)",e)
//             done(e)});
//         // UsersModel.findOne({username},(err,user)=>{
//         //     if(err) return done(err)
//         //     if(!user){logr.verbose('User not found')}
//         //     // if (!user.verifyPassword(password)) { return done(null, false, {   
//         //     //     message: 'Invalid password.' }); }
//         //     return done(null,user)
//         // })
//     }
// ))

// passport.use('signup',new LocalStrategy(
//     {passReqToCallback: true},
//     (req,username,password,done)=>{
//         logr.verbose('signup...')
        
//         UsersModel.findOne({username},(err,user)=>{
//             if(err) return done(err)
//             if(user){
//                 logr.verbose('User already exists',{recurso:"[isgnup]"})
//                 done(null,false,{ message: "Invalid username/password" })
//                 console.log('[b0.server.js](after return in if of usersmode.findone of passport.use)')
//             }

//             const newUser={username,password,name:req.body.name,email:req.body.email,
//                 address:req.body.address,age:req.body.age,telephone:req.body.telephone}
//             const detalles=[{username:username,nombre:req.body.name,email:req.body.email,direccion:req.body.address,edad:req.body.age,telefono:req.body.telephone}]
//             UsersModel.create(newUser,(err,userWithID)=>{
//                 console.log('[b0.server.js](inicio)(usersmodel.create)')
//                 if(err) return done(err)
                
//                 logr.verbose(userWithID,{recurso:"[isgnup][userWithID]"})
//                 fnCom.nodemailer('registroNew',procAdminEmail,detalles)
//                 return done(null,userWithID)
//             })
            
//         })
        
//     }
// ))

// passport.serializeUser((user,done)=>{
//     done(null,user._id)
// })

// passport.deserializeUser((userId,done)=>{
//     //UsersModel.findById(id,done)
//     UsersModel.findById(userId, (err, user) => {return done(err, user)});

// })

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    rolling:true,
    cookie:{
        maxAge:60000,
        secure:false,
        httpOnly:true
    }
}))

app.use(passport.inicioAuth)
app.use(passport.sesionAuth)

/* #endregion */ 

/* #region. 5.Enrutamiento de autenticación y autorización*/

//5.1.Rutas de autenticación
app.use('/',routerAuth.start())
app.use('/login',routerAuth.start())

app.get('/signup',apiRouterAuth.getSignup)
app.post('/signup',passport.authSignup,apiRouterAuth.postSignup)
app.get('/user_data', apiRouterAuth.getUserData);
app.get('/failsignup',apiRouterAuth.getFailSignup)
app.get('/faillogin',apiRouterAuth.getFailLogin)

//5.2.Rutas de autorización

app.use('/logout',routerAuth.start())
//app.use('/private',routerAuth.start())
app.use('/homeGeneral',routerAuth.start())
app.use('/userProfile',routerAuth.start())
app.use('chatGeneral',routerAuth.start())
app.use('productosClientes',routerAuth.start())
app.use('/carritoClientes',routerAuth.start())
app.use('/homeAdmin',routerAuth.start())
app.use('/compraExitosa',routerAuth.start())
app.use('/productosMantenimiento',routerAuth.start())
app.use('/operaciones/randoms',routerAuth.start())
app.use('/operaciones/info',routerAuth.start())
app.use('/api/uploadFile',routerAuth.start())
app.use('*',routerAuth.start())

/* #endregion */ 

/* #region. 6.Validación de logging*/
//let datoL='Ok'
//const childLogger=logger.child({modulo:'b0.server.js'})
const loger=logd.child({modulo:`${modname}[Pruebas]`})
loger.info('Test Info message',{recurso:'[na]'});
loger.debug(`Test Debug: ${JSON.stringify({
    cookie: {path: '/',_expires: '2022-09-30T17:35:03.710Z',originalMaxAge: 60000,httpOnly: true,secure: false},
    passport: { user: 'yo' } })}`,{recurso:'[na]'});
loger.verbose('Test Verbose message',{recurso:'[na]'});
loger.warn(JSON.stringify('Test Warn message'),{recurso:'[na]'});
loger.error(JSON.stringify('Test Error message'),{recurso:'[na]'});
//loger.verbose(JSON.stringify('Test Crit message'),{recurso:'[na]'});
//loger.silly(JSON.stringify('Test Alert message'),{recurso:'[na]'});
//loger.emerg(JSON.stringify('Test Emerg message'),{recurso:'[na]'});

/* #endregion */ 

/* #region. 7.Iniciando servidor general*/
server.listen(process_PORT,()=>{
    logr.info(`Server desplegado en http://127.0.0.1:${process_PORT}`,{recurso:'[listen]'})
    logr.warn(`PID WORKER ${process.pid}`,{recurso:'[process.pid]'})
})
/* #endregion */ 

}

/* #region. Bloc*/

//app.get('/',apiRouterAuth.getRoot)
//app.get('/login',apiRouterAuth.getLogin)

// app.post(
//     '/login',
//     passport.authLogin,
//     apiRouterAuth.postLogin
    
// )

// function checkAuthentication(req,res,next){
//     if(req.isAuthenticated()) next()
//     else res.redirect('/login')
// }

// function noCheckAuthentication(req,res,next){
//     next()
// }
// app.get('/logout',checkAuthentication,(req,res)=>{
//     let username=req.user.username
//     req.session.destroy()
//     return res.render('logout',{username})

// })

// app.get('/private',checkAuthentication,(req,res)=>{
//     const {user}=req
//     res.send('<h1>Solo pudiste entrar porque está logueado</h1>')
// })

// app.get('/homeGeneral',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-homeGeneral]`})
//     let username=req.user.username
//     loger.verbose(username,{recurso:"[username]"})
//     if(!username) return res.redirect('/login')
//     return res.render('homeGeneral',{username})
// })

// app.get('/userProfile',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-userProfile]`})
//     let username=req.user.username
//     let name=req.user.name
//     let email=req.user.email
//     let address=req.user.address
//     let age=req.user.age
//     let telephone=req.user.telephone
//     loger.verbose(username,{recurso:"[username]"})
//     if(!username) return res.redirect('/login')
//     return res.render('userProfile',{username,name,email,address,age,telephone})
// })

// app.get('/chatGeneral',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-chatGeneral]`})
//     let username=req.user.username
//     loger.verbose(username,{recurso:"[username]"})
//     return res.render('chatGeneral.ejs',{username})
// })

// app.get('/productosClientes',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-productosClientes]`})
//     let username=req.session.username
//     loger.verbose(username,{recurso:"[reqSessionUsername]"})
//     return res.render('productosClientes.ejs',{username})
//     //return res.sendFile(path.resolve(__dirname, '../Clase28.desafio/f1.views')+'/productosClientes.html')
// })

// app.get('/carritoClientes',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-carritoClientes]`})
//     let username=req.session.username
//     //loger.verbose(res,{recurso:"[res]"})
//     loger.verbose(username,{recurso:"[reqSessionUsername]"})
//     return res.render('carritoClientes.ejs',{username})
// })

// app.get('/homeAdmin',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-homeAdmin]`})
//     let username=req.user.username
//     loger.verbose(username,{recurso:"username"})
//     return res.render('homeAdmin',{username})
// })

// app.get('/compraExitosa',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-compraExitosa]`})
//     //twilio_sms(cliente)
//     //twilio_whs(admin)
//     //nodemailer(admin,detalles)
//     let username=req.user.username
//     loger.verbose(username,{recurso:"username"})
//     return res.render('compraExitosa',{username})
// })

// app.get('/productosMantenimiento',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-productosMantenimiento]`})
//     let username=req.session.username
//     loger.verbose(username,{recurso:"[reqSession.Username]"})
//     return res.render('productosMantenimiento.ejs',{username})
// })

// app.get('/operaciones/randoms',checkAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     const loger=logd.child({modulo:`${modname}[get-operaciones1Admin`})
//     let username=req.session.username
//     loger.verbose(username,{recurso:"[reqSession.Username]"})
//     return res.render('operaciones1Admin.ejs',{username})
// })

// app.get('/operaciones/info',noCheckAuthentication,(req,res)=>{
//     //logr.verbose(req.session);
//     let username=req.session.username
//     let dato1='hola'
//     let id_proceso=process.pid
//     nombre_plataforma=process.platform
//     version_node=process.version
//     carpeta_proyecto=process.cwd()
//     path_ejecucion=process.execPath
//     memoria_reservada=process.memoryUsage.rss()
//     argumentos_entrada=process.execArgv
//     logr.verbose(username,{recurso:"reqSessionUsername.appGet"})
//     return res.render('operaciones2Admin.ejs',{username,id_proceso,nombre_plataforma,version_node,carpeta_proyecto,path_ejecucion,memoria_reservada,argumentos_entrada})
// })

// app.post("/api/uploadFile", (req, res) => {
//     //basic setup
//     const loger=logd.child({modulo:`${modname}[post-api/uploadFile`})
//     const form = new formidable.IncomingForm();
//     const uploadFolder = path.join(__dirname, "public", "imgUser");
//     loger.verbose(uploadFolder,{recurso:"[uploadFolder]"})
//     //console.log("[b0.server]",uploadFolder)
//     //basic configuration
//     form.uploadDir = uploadFolder
//     //console.log(form);
//     loger.verbose(JSON.stringify(form),{recurso:"[form]"})
//     //parsing
//     form.parse(req, function (err, fields, files) {
//         //console.log(fields)
//         //console.log(files)
//         loger.verbose(fields,{recurso:"[fields]"})
//         loger.verbose(JSON.stringify(files),{recurso:"[files]"})
//         if (err) {
//             loger.warn(`Error en sección parsing: ${err}`,{recurso:'[error]'});
//             return res.status(400).json({
//               status: "Fail",
//               message: "There was an error parsing the files",
//               error: err,
//             });
//           }
//         else {
            
//             //update name
//                 const file = files.myFile;
//                 //console.log(file)
//                 loger.verbose(JSON.stringify(file),{recurso:"[file]"})
//                 // creates a valid name by removing spaces
//                // const fileName = encodeURIComponent(file.name);
               
//                 //console.log(fileName)
//                 loger.verbose(file.originalFilename,{recurso:"[file.originalFilename]"})
//                 try {
//                  // renames the file in the directory
//                 loger.verbose(file.filepath,{recurso:"[file.filepath]"})
//                 //const fileType = '.'+file.mimetype.split("/").pop();
//                 const fileName = 'avatar1'+'.'+file.mimetype.split("/").pop();
//                 loger.verbose(fileName,{recurso:"[fileName]"})
//                 fs.renameSync(file.filepath, path.join(uploadFolder, fileName));
//                 // return res.status(200).json({
//                 //     status: "success",
//                 //     message: "File created successfully!!",
//                 //   });
//                 res.write('File uploaded');
//                 res.end();
//                 } catch (error) {
//                     loger.warn(`Error en sección update name: ${error}`,{recurso:'[error]'});
//                 console.log(error);
//                 }

//                 //save file
//                      // stores the fileName in the database

//                 // try {
//                 // const newFile = await File.create({
//                 //   name: `files/${fileName}`,
//                 // });
//                 // return res.status(200).json({
//                 //   status: "success",
//                 //   message: "File created successfully!!",
//                 // });
//                 // } catch (error) {
//                 // res.json({
//                 //   error,
//                 // });
//                 // }
//         }


        
//       });
    
    
//   });

// app.get('*', function (req, res) {
//     const loger=logd.child({modulo:`${modname}[get-Ruta-Default]`})
//     let ruta=req.path
//     loger.warn(ruta,{recurso:"[path]"})
//     res.send('<h1>la ruta no existe</h1>');
// })


//console.log(`[b0.server.js] (antes del if de control de cluster) modoCluster: ${modoCluster}`)
//console.log(`[b0.server.js] (antes del if de control de cluster) cluster.isPrimary: ${cluster.isPrimary}`)
/*
const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});*/

/*
app.post('/login',passport.authenticate('login'),(req,res)=>{
    logr.verbose("req.user.postLogin.b0ServerJS",req.user)
    let username=req.session.username
    res.render('home',{username})
})

*/

/*
app.use(session({
    store:new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/sessions'
    }),
    secret:'conrat',
    resave:false,
    saveUninitialized:false
}))
*/

//3.3.Envío de datos a URLs
/*
app.get('/login',(req,res)=>{
    if(req.session.username) return res.redirect('/home')
    res.sendFile('login.html',{root: __dirname+'/public'})
})

app.post('/login',(req,res)=>{
    req.session.username=req.body.username
    return res.redirect('/home')
})

app.get('/home',(req,res)=>{
    logr.verbose(req.session);
    let username=req.session.username
    logr.verbose("reqSessionUsername.appGet",username)
    if(!username) return res.redirect('/login')
    return res.render('home',{username})
})

app.get('/logout',(req,res)=>{
    let username=req.session.username
    req.session.destroy()
    return res.render('logout',{username})

})

app.get('/chat',(req,res)=>{
    logr.verbose(req.session);
    let username=req.session.username
    logr.verbose("reqSessionUsername.appGet",username)
    return res.render('chat.ejs',{username})
})

app.get('/productos',(req,res)=>{
    logr.verbose(req.session);
    let username=req.session.username
    logr.verbose("reqSessionUsername.appGet",username)
    return res.render('productos.ejs',{username})
})
*/

//mongoose.connect
/*
function connectDB(url,cb){
    mongoose.connect(
        url,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true

        },
        err=>{
            if(!err) logr.verbose('Connected DB para passport')
            if(cb!=null) cb(err)
        }
    )
}

connectDB('mongodb://localhost:27017/dbCoderTest',err=>{
    if(err) return logr.verbose('Error connecting DB',err)   
})
*/

/* #endregion */ 



