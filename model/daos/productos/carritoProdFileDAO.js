const ContenedorMongo=require('../../../model/contenedores/contenedorFile')

class carritoProductosFileDAO extends ContenedorMongo{
    constructor(){
        super('carritoProductos.json')
    }
}

module.exports=carritoProductosFileDAO