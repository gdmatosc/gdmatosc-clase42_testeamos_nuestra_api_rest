const ContenedorMongo=require('../../../model/contenedores/contenedorFile')

class productosGeneralFileDAO extends ContenedorMongo{
    constructor(){
        super('productosGeneralObjetos.json')
    }
}

module.exports=productosGeneralFileDAO