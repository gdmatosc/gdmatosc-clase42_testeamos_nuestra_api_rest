const ContenedorMongo=require('../../../model/contenedores/contenedorMongoIdAlias')
const carritoCDBModel=require('../../../model/models/carrito.CDB.model')

class carritoProductosMongoCDBDAO extends ContenedorMongo{
    constructor(){
        super(carritoCDBModel)
    }
}

module.exports=carritoProductosMongoCDBDAO