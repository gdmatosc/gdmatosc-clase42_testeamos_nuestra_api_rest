
const assert=require('assert').strict
const logd = require('../logging.js')
const request=require('supertest')('http://localhost:8081')
const modname='[2.localFnAdv.js]'
const logr=logd.child({modulo:`${modname}`})
const ApiClientes=require('../api/apiClientes.js')
const gnrprod=require('./generador/productos.random')
const expect=require('chai').expect

describe("test api rest full",()=>{
    let productosPre=[]
    let i=0
    before(()=>console.log('\n***********Inicio TOTAL de Tests******'))
    after(()=>console.log('\n***********Fin TOTAL de Tests******'))
    beforeEach(()=>{
        i=i+1
        console.log(`\n***********Inicio de test #${i}******`)
        })
    beforeEach(async()=>{
        //const apiClientes=new ApiClientes()
        //productosPre=await apiClientes.obtenerObjetosTodos()
        productosPre=await request.get('/apiClientes/objetos')
        logr.debug(productosPre['_body'].length,{recurso:'[beforeEach][productosPre[_body].length]'})
    })
    afterEach(()=>{
        console.log(`\n***********Fin de test #${i}*******`)
    })
    
    describe('GET',()=>{
        
        it('1.debería retornar un status 200',async()=>{
            //let productosPre=await request.get('/apiClientes/objetos')
            expect(productosPre.status).to.eql(200)
        })
    
        it('2.debería haber al menos 1 producto al obtener todos los objetos',async function(){
            //logr.verbose(productosPre['_body'],{recurso:'[it-1][productosPre[_body]]'})
            logr.debug(productosPre['_body'].length,{recurso:'[it-2][productosPre[_body].length]'})
            assert.notStrictEqual(productosPre.length,0)
        })
    })

    describe('POST',()=>{
        it('3.debería aumentar en 1 la cantidad de objetos', async function(){
            //const apiClientes=new ApiClientes()
            let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
                precio: gnrprod.getPrecio(),descripcion: gnrprod.getDescripcion(),promocion: 'generico'}
            await request.post('/apiClientes/objetos').send(dataBody)
            let productosNew=await request.get('/apiClientes/objetos')
            
            logr.debug(productosNew['_body'],{recurso:'[it-3][productosNew[_body]]'})
            logr.debug(productosNew['_body'].length,{recurso:'[it-3][productosNew[_body].length]'})
            expect(productosNew['_body'].length).to.eql(productosPre['_body'].length+1)
        })
    })

    

})