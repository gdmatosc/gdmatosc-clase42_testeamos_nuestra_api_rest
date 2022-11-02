const assert=require('assert').strict
const logd = require('../logging.js')
const modname='[2.localFnAdv.js]'
const logr=logd.child({modulo:`${modname}`})
const ApiClientes=require('../api/apiClientes.js')
const gnrprod=require('./generador/productos.random')
const expect=require('chai').expect
//plantilla
// it('debería', async function(){

// })

describe("test de integracion de productos",function(){
    let productosPre=[]
    let i=0
    before(()=>console.log('\n***********Inicio TOTAL de Tests******'))
    after(()=>console.log('\n***********Fin TOTAL de Tests******'))
    beforeEach(()=>{
        i=i+1
        console.log(`\n***********Inicio de test #${i}******`)
        })
    beforeEach(async()=>{
        const apiClientes=new ApiClientes()
        productosPre=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosPre.length,{recurso:'[beforeEach][productosPre.length]'})
    })
    afterEach(()=>{
        console.log(`\n***********Fin de test #${i}*******`)
    })
    

    it('1.debería haber al menos 1 producto al obtener todos los objetos',async function(){
        //logr.verbose(productosPre,{recurso:'[it-1][productosPre]'})
        logr.debug(productosPre.length,{recurso:'[it-1][productosPre.length]'})
        //assert.notStrictEqual(productosPre.length,0)
        expect(productosPre).to.have.lengthOf.above(0)
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

    it('3.debería aumentar en 1 la cantidad de objetos', async function(){
        const apiClientes=new ApiClientes()
        // let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
        //     precio: 80,descripcion: 'generico',promocion: 'generico'}
        //let precioNew=gnrprod.getPrecio()
        //logr.debug(precioNew,{recurso:'[it-3][gnrprod.getPrecio()]'})
        let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
            precio: gnrprod.getPrecio(),descripcion: gnrprod.getDescripcion(),promocion: 'generico'}
        await apiClientes.guardarObjetos(dataBody)
        let productosNew=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosNew,{recurso:'[it-3][productos]'})
        logr.debug(productosNew.length,{recurso:'[it-3][productos.length]'})
        expect(productosNew.length).to.eql(productosPre.length+1)
    })

    it.skip('4.debería disminuir en 1 la cantidad de objetos',async function(){
        const apiClientes=new ApiClientes()
        let id='63627a52a0ae94037c25f374'
        await apiClientes.borrarObjeto(id)
        let productosNew=await apiClientes.obtenerObjetosTodos()
        logr.debug(productosNew,{recurso:'[it-4][productos]'})
        logr.debug(productosNew.length,{recurso:'[it-4][productos.length]'})
        //assert.strictEqual(productosNew.length,productosPre.length-1)
        expect(productosNew.length).to.eql(productosPre.length-1)
    })

})