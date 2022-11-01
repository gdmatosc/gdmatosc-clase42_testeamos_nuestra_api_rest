const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdReal')
const productosCDBModel=require('../../../model/models/productos.CDB.model')

class productosGeneralMongoCDBDAO extends ContenedorMongo{
    constructor(){
        super(productosCDBModel)
    }
}

module.exports=productosGeneralMongoCDBDAO