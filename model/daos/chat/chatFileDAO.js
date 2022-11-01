const ContenedorMongo=require('../../../model/contenedores/contenedorFile')

class ChatFileDAO extends ContenedorMongo{
    constructor(){
        super('chatMensajes.json')
    }
}

module.exports=ChatFileDAO