const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdAlias')
const carritoLDBModel=require('../../../model/models/carrito.LDB.model')

class carritoProductosMongoLDBDAO extends ContenedorMongo{
    constructor(){
        super(carritoLDBModel)
    }
}

module.exports=carritoProductosMongoLDBDAO