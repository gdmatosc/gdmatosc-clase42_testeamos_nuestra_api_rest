const {createTransport}=require('nodemailer')
const twilio=require('twilio')
const accountSid = process.env.TWILIO_ACCOUNTSSID; 
const authToken = process.env.TWILIO_AUTHTOKEN; 
const client = twilio(accountSid, authToken); 
const procAdminPhone=process.env.ADMIN_PHONE

//let userNow=currentUser()
let userNow=''
let telephoneNow=''
function currentUser(user){
    userNow=user
    console.log("[comunicaciones.js][in fn currentUser] userNow:",userNow)
    return user
}

function currentUserTelephone(telephone){
    telephoneNow=telephone
    console.log("[comunicaciones.js][in fn currentUser] userNow:",telephoneNow)
    return telephone
}

//7.1.twilio
function twilio_sms_client(){
    const options_sms={   
        body: 'Su pedido ha sido recibio y se encuentra en proceso!',
        from: '+13143508983',
        to: `${procAdminPhone}`
      }
      
      client.messages 
            .create(options_sms) 
            .then(message => console.log(message)) 
            .catch(e=>console.log(e))
}

function twilio_whs_admin(){
      
      const options_whs={   
        body: `Nuevo pedido del usuario ${userNow}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${procAdminPhone}`
      }
      
      client.messages 
            .create(options_whs) 
            .then(message => console.log(message)) 
            .catch(e=>console.log(e))
}

//7.2.nodemailer
function nodemailer(tipo,destino,detalles){
    const email=`${destino}`
    let mailOptions={}
    console.log("[comunicaciones.js][fn nodemailer] userNow:",userNow)
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: email,
            pass: process.env.NODEMAILER_PASS
        }
    });
    if (tipo=='compraNew'){
        mailOptions={
            from: 'Server Node JS',
            to: email,
            subject: `Notificación de nueva compra del usuario ${userNow}`,
            html: `<h1 style="color:blue;">
                el usuario ${userNow} ha realizado la sguiente compra:${JSON.stringify(detalles)}
                <span style="color: blue;"> Saludos,</span>
            </h1>`
        }
    }
    else if(tipo=='registroNew'){
        mailOptions={
            from: 'Server Node JS',
            to: email,
            subject: 'Notificación de nuevo registro',
            html: `<h1 style="color:blue;">
                Se ha registrado un usuario con los datos:${JSON.stringify(detalles)}
                <span style="color: blue;"> Saludos,</span>
            </h1>`
        }
    }
    else {
        mailOptions={
            from: 'Server Node JS',
            to: email,
            subject: 'Notificación general',
            html: `<h1 style="color:blue;">
                Se han registrado los datos:${JSON.stringify(detalles)}
                <span style="color: blue;"> Saludos,</span>
            </h1>`
        }
    }
    
    transporter.sendMail(mailOptions)
        .then(r=>console.log(r))
        .catch(e=>console.log(e))
}

module.exports={
    twilio_sms_client,
    twilio_whs_admin,
    nodemailer,
    currentUser,
    currentUserTelephone,
}