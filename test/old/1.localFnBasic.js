const FactoryDAO=require('../../model/daos/indexDAO.js')
const DAO=FactoryDAO()
const assert=require('assert').strict
const logd = require('../../logging.js')
const modname='[1.localFnBasic.js]'
const logr=logd.child({modulo:`${modname}`})
const ApiClientes=require('../../api/apiClientes.js')
//const productosGeneralMongoLDBDAO=require('../model/daos/productos/productosLDBDAO')

//plantilla
// it('debería', async function(){

// })

describe("test de integracion de productos",function(){
    let productosPre=[]
    before(()=>console.log('\n***********Comienzo TOTAL de Tests******'))
    after(()=>console.log('\n***********FinTOTAL de Tests******'))
    beforeEach(()=>console.log('\n***********Comiezo de test******'))
    beforeEach(async()=>{
        const apiClientes=new ApiClientes()
        productosPre=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosPre.length,{recurso:'[beforeEach][productosPre.length]'})
    })
    afterEach(()=>console.log('\n***********Fin de test******'))
    

    it('1.debería haber al menos 1 producto al obtener todos los objetos',async function(){
        ////const apiClientes=new ApiClientes()
        //const productos=await DAO.productosGeneral.getAll()
        ////const productos=await apiClientes.obtenerObjetosTodos()
        //logr.debug(productos,{recurso:'[productos]'})
        //let productos=productosPre
        logr.verbose(productosPre,{recurso:'[it-1][productosPre]'})
        logr.debug(productosPre.length,{recurso:'[it-1][productosPre.length]'})
        assert.notStrictEqual(productosPre.length,0)
    })

    it.skip('2.deberia dar error si faltan datos o son incorrectos',async function(){
        //logr.debug(productos,{recurso:'[productos]'})
        const apiClientes=new ApiClientes()
        let dataBody={nombre: 50,img: '/img/periferico_camara_externa_1.jpg',
            precio: 80,descripcion: 'generico',promocion: 'generico'}
        //await DAO.productosGeneral.save(dataBody)
        //let validaTest=await apiClientes.guardarObjetos(dataBody)
        //logr.debug(validaTest,{recurso:'[apiClientes.asegurarObjetoValida(dataBody,true)]'})
        //await assert.rejects(apiClientes.guardarObjetos(dataBody),/must be a string/)
        await assert.rejects(apiClientes.guardarObjetos(dataBody),/Error/)
    })

    it.skip('3.debería aumentar en 1 la cantidad de objetos', async function(){
        const apiClientes=new ApiClientes()
        let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
            precio: 80,descripcion: 'generico',promocion: 'generico'}
        await apiClientes.guardarObjetos(dataBody)
        let productosNew=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosNew.length,{recurso:'[it-3][productos.length]'})
        assert.strictEqual(productosNew.length,productosPre.length+1)

    })

    it('4.debería disminuir en 1 la cantidad de objetos',async function(){
        const apiClientes=new ApiClientes()
        let id='636255f4133ca1ff7af5d433'
        await apiClientes.borrarObjeto(id)
        let productosNew=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosNew.length,{recurso:'[it-4][productos.length]'})
        assert.strictEqual(productosNew.length,productosPre.length-1)
    })

})

// test1()
// async function test1() {
   
//     const productos=await DAO.productosGeneral.getAll()
//     logr.debug(productos,{recurso:'[productos]'})
// }


 // logr.debug(process.env.MONGO_USERNAME,{recurso:'[process.env.MONGO_USERNAME]'})
    // process.env.MONGO_USERNAME
    // let productosGeneral= new productosGeneralMongoLDBDAO()
    // let productos=await productosGeneral.getAll()



// async obtenerObjetosTodos(){
//     logr.debug('obtenerObjetosTodos()',{recurso:'[na]'})
//     return await DAO.productosGeneral.getAll();
// }

// async guardarObjetos(dataBody){
//     logr.debug('guardarObjetos',{recurso:'[na]'})
//     dataBody.precio=Number(dataBody.precio);
//     if(!dataBody.nombre || !dataBody.img || !dataBody.precio){
//         return res.status(400).send({error: `Los datos están incompletos ahora: ${req.body}`});
//     }
//     return await DAO.productosGeneral.save(dataBody)
// }

// async borrarObjeto(id){
//     logr.debug('borrarObjeto',{recurso:'[na]'})
//     await DAO.productosGeneral.deleteById(id)
//     return {message:`El producto con id ${id} de un file se borró exitosamente`}
// }

// async borrarObjetosTodos(){
//     logr.debug('borrarObjetosTodos',{recurso:'[na]'})
//     return await DAO.productosGeneral.deleteAll()
// }