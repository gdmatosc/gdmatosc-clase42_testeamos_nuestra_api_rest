const assert=require('assert').strict
const logd = require('../logging.js')
const request=require('supertest')('http://localhost:8081')
const modname='[2.localFnAdv.js]'
const logr=logd.child({modulo:`${modname}`})
const gnrprod=require('./generador/productos.random')
const axios=require('axios')
//const expect=require('chai').expect
chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

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
       
        productosPre=await request.get('/apiClientes/objetos')
        logr.debug(productosPre['_body'].length,{recurso:'[beforeEach][productosPre[_body].length]'})
    })
    afterEach(()=>{
        console.log(`\n***********Fin de test #${i}*******`)
    })
    
    describe('GET',()=>{
        it('1.debería retornar un status 200',async()=>{
            expect(productosPre.status).to.eql(200)
        })
    
        it('2.debería haber al menos 1 producto al obtener todos los objetos',async function(){
            //logr.verbose(productosPre['_body'],{recurso:'[it-1][productosPre[_body]]'})
            logr.debug(productosPre['_body'].length,{recurso:'[it-2][productosPre[_body].length]'})
            expect(productosPre['_body']).to.have.lengthOf.above(0)
        })
    })

    describe('POST',()=>{
        

        it('3.deberia dar error si faltan datos o son incorrectos',async()=>{
            let dataBody={nombre: 50,img: '/img/periferico_camara_externa_1.jpg',
                precio: 80,descripcion: 'generico',promocion: 'generico'}
            expect(request.post('/apiClientes/objetos').send(dataBody)).to.be.rejectedWith(/Error/)

        })
        
        
        it.skip('4.debería aumentar en 1 la cantidad de objetos', async function(){
            let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
                precio: gnrprod.getPrecio(),descripcion: gnrprod.getDescripcion(),promocion: 'generico'}
            await request.post('/apiClientes/objetos').send(dataBody)
            let productosNew=await request.get('/apiClientes/objetos')
            
            logr.debug(productosNew['_body'],{recurso:'[it-4][productosNew[_body]]'})
            logr.debug(productosNew['_body'].length,{recurso:'[it-4][productosNew[_body].length]'})
            expect(productosNew['_body'].length).to.eql(productosPre['_body'].length+1)
        })
    })

    describe('DELETE',()=>{
        it('5.debería disminuir en 1 la cantidad de objetos',async function(){
            let id='6362c8ae1e0f791bb04b6991'
            await request.delete(`/apiClientes/objetos/${id}`)
            let productosNew=await request.get('/apiClientes/objetos')
            logr.debug(productosNew['_body'],{recurso:'[it-5][productosNew[_body]]'})
            logr.debug(productosNew['_body'].length,{recurso:'[it-5][productosNew[_body].length]'})
            expect(productosNew['_body'].length).to.eql(productosPre['_body'].length-1)
        })
    })

})