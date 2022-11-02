
const assert=require('assert').strict
const logd = require('../logging.js')
const request=require('supertest')('http://localhost:8081')
const modname='[2.localFnAdv.js]'
const logr=logd.child({modulo:`${modname}`})
const ApiClientes=require('../api/apiClientes.js')
const gnrprod=require('./generador/productos.random')
//const expect=require('chai').expect
const chai = require('chai')
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
            let dataBody={nombre: '',img: '/img/periferico_camara_externa_1.jpg',
                precio: gnrprod.getPrecio(),descripcion: gnrprod.getDescripcion(),promocion: 'generico'}
            //await request.post('/apiClientes/objetos').send(dataBody)
            //expect(request.post('/apiClientes/objetos').send(dataBody)).to.be.rejectedWith(Error)

            // return request.post('/apiClientes/objetos').send(dataBody).should.be.rejected.and.eventually.deep.equal({
            //     'x': 1,
            //     'y': 1,
            //     'z': 2
            //  })
            //return (request.post('/apiClientes/objetos').send(dataBody)).should.eventually.equal("foo");
            //expect(request.post('/apiClientes/objetos').send(dataBody)).to.be.rejectedWith(/^abcde$/)
            expect(request.post('/apiClientes/objetos').send(dataBody)).to.eventually.be.rejected.and.has.property('messa‌​ge', 'Error')
            //request.post('/apiClientes/objetos').send(dataBody).should.be.rejectedWith(Error)

            let productosNew=await request.get('/apiClientes/objetos')
            
            logr.debug(productosNew['_body'],{recurso:'[it-3][productosNew[_body]]'})
            logr.debug(productosNew['_body'].length,{recurso:'[it-3][productosNew[_body].length]'})
            //expect(productosNew['_body'].length).to.eql(productosPre['_body'].length+1)
        })
    })

    

})

//let resPost=await request.post('/apiClientes/objetos').send(dataBody)
            //logr.debug(resPost,{recurso:'[it-4][resPost[_body]]'})
            //await assert.rejects(resPost,/Error/)
            //expect(resPost).to.have.lengthOf.above(0)
        
            //let resPost=await request.post('/apiClientes/objetos').send({dataBody})
            //logr.debug(resPost,{recurso:'[it-4][resPost[_body]]'})
            //let bodyPost = resPost.body
            //expect(bodyPost).to.contain.porperty("name");

// .then(res => {
                //     console.log(res);
                //     res.should.have.status(200);
                //     done()
                // })
                // .catch(err => {
                //     console.error(err);
                //     done()
                //     throw err; 
                    
                // });

                // .end((err, res) => {
                //         if (err) {
                //             logr.warn(err,{recurso:'[res]'})
                //             return done(err)
                //             }
                //         //expect(res.text).to.be.equal('hey');
                //         logr.warn(res,{recurso:'[res]'});
                //         done()})

            //logr.debug(resPost,{recurso:'[it-4][resPost[_body]]'})
            //expect(resPost.status).to.eql(200)
            //expect(JSON.parse(resPost.text).message).toBe("success")


            //const resAxiosPost=await axios.post('http://localhost:8081/apiClientes/objetos',dataBody)
            //console.log("[resAxiosPost] (msg) response: ", resAxiosPost)
            //const resAxiosPostRow=axios.post('http://localhost:8081/apiClientes/objetos',dataBody)
            //await assert.rejects(axios.post('http://localhost:8081/apiClientes/objetos',dataBody),/Error/)
            //assert.throws(resAxiosPost,'Error')
            //assert.throws(await axios.post('http://localhost:8081/apiClientes/objetos',dataBody),'Error')