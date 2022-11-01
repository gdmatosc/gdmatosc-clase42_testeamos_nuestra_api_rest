const comunicacionesFn=require('./funciones_adicionales/comunicaciones.js')
const logd = require('../logging.js')
const modname='[apiClientes.js]'
const logr=logd.child({modulo:`${modname}`})
const path = require('path')
const FactoryDAO=require('../model/daos/indexDAO.js')
const DAO=FactoryDAO()

class ApiClientes{
    constructor(){
        this.coms=comunicacionesFn
    }
    
    /* #region. 2.Chat*/

    async obtenerComentariosTodos(){
        logr.debug('obtenerComentariosTodos()',{recurso:'[na]'})
        return await DAO.chatGeneral.getAll();
    }

    async guardarComentarios(dataBody){
        logr.debug('guardarComentarios',{recurso:'[na]'})
        return await DAO.chatGeneral.save(dataBody);
    }

    async borrarComentariosTodos(){
        logr.debug('borrarComentariosTodos',{recurso:'[na]'})
        return await DAO.chatGeneral.deleteAll()
    }

    /* #endregion */

    /* #region. 3.Productos*/

    async obtenerObjetosTodos(){
        logr.debug('obtenerObjetosTodos()',{recurso:'[na]'})
        return await DAO.productosGeneral.getAll();
    }

    async guardarObjetos(dataBody){
        logr.debug('guardarObjetos',{recurso:'[na]'})
        dataBody.precio=Number(dataBody.precio);
        if(!dataBody.nombre || !dataBody.img || !dataBody.precio){
            return res.status(400).send({error: `Los datos están incompletos ahora: ${req.body}`});
        }
        return await DAO.productosGeneral.save(dataBody)
    }

    async borrarObjeto(id){
        logr.debug('borrarObjeto',{recurso:'[na]'})
        await DAO.productosGeneral.deleteById(id)
        return {message:`El producto con id ${id} de un file se borró exitosamente`}
    }

    async borrarObjetosTodos(){
        logr.debug('borrarObjetosTodos',{recurso:'[na]'})
        return await DAO.productosGeneral.deleteAll()
    }
    /* #endregion */

    /* #region. 4.Carrito*/

    async obtenerObjetosCarritosTodos(){
        logr.debug('obtenerObjetosCarritosTodos',{recurso:'[na]'})
        return await DAO.carritoProductos.getAll()
    }

    async obtenerObjetosCarrito(id){
        logr.debug('obtenerObjetosCarrito',{recurso:'[na]'})
        return await DAO.carritoProductos.getById(Number(id))
    }

    async guardarObjetosCarrito(cartID,product){
        logr.debug('guardarObjetosCarrito() -inicio',{recurso:'[na]'})
        const cart=await DAO.carritoProductos.getById(Number(cartID))
        //console.log("cart_delID: ",cart) //debug
        let newObj={}
        if(cart.length!==0){  
            product=await DAO.carritoProductos.addID(product,cart.products)
            //console.log("cartProducts_delID: ",cart.products) //debug
            cart.products.push(product)
            //console.log("cart_preContainer.post: ",cart) //debug
            newObj=await DAO.carritoProductos.editByBody(cart)
            //console.log("newObj: ",newObj) //debug
        }
        else {
            cart.id=cartID
            cart.products=[]
            //console.log("cart_inicial.post: ",cart) //debug
            cart.products.push(product)
            //console.log("cart_preContainer.post: ",cart) //debug
            newObj=await DAO.carritoProductos.save(cart)
            //console.log("newObj: ",newObj) //debug
        }
            return newObj
    }

    async borrarObjetosCarrito(product){
        logr.debug('borrarObjetosCarrito',{recurso:'[na]'})
        return await DAO.carritoProductos.deleteByBody(product)
    }


    /* #endregion */

}

module.exports=ApiClientes