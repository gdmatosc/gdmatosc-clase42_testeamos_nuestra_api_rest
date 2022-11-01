const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdReal')
const ChatCDBModel=require('../../../model/models/chat.CDB.model')

class ChatMongoCDBDAO extends ContenedorMongo{
    constructor(){
        super(ChatCDBModel)
    }
}

module.exports=ChatMongoCDBDAO