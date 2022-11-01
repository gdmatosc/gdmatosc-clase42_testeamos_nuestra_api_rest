const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdReal')
const productosLDBModel=require('../../../model/models/productos.LDB.model')

class productosGeneralMongoLDBDAO extends ContenedorMongo{
    constructor(){
        super(productosLDBModel)
    }
}

module.exports=productosGeneralMongoLDBDAO