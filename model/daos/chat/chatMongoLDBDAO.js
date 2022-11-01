const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdReal')
const ChatLDBModel=require('../../../model/models/chat.LDB.model')

class ChatMongoLDBDAO extends ContenedorMongo{
    constructor(){
        super(ChatLDBModel)
    }
}

module.exports=ChatMongoLDBDAO