const ApiClientes=require('../api/apiClientes.js')
const logd = require('../logging.js')
const modname='[controllerClientes.js]'
const logr=logd.child({modulo:`${modname}`})
const fnCom=require('../api/funciones_adicionales/comunicaciones')

const FactoryDAO=require('../model/daos/indexDAO.js')
const DAO=FactoryDAO()


class ControllerClientes{
constructor(){
    this.apiClientes=new ApiClientes()
}

/* #region. 2.Chat*/

obtenerComentariosTodos= async (req, res) => {
    let comentariosTodos=await this.apiClientes.obtenerComentariosTodos() 
    //console.log("contenedorVar.comentariosMongoDB.routerGet",contenedorVar)//debug
    res.json(comentariosTodos)
};

guardarComentarios=async (req,res)=>{
    const dataBody=req.body;
    let comentariosGuardados=await this.apiClientes.guardarComentarios(dataBody)
    //console.log("username-text.comentariosFile.routerPost",dataBody)//debug
    res.send("Guardado")
}

borrarComentariosTodos=async(req,res)=>{
    let comentariosTodosBorrados=await this.apiClientes.borrarComentariosTodos()
    res.json(comentariosTodosBorrados)
    //console.log("borradoTotal.comentariosFile.routerDelete")//debug
}

/* #endregion */

/* #region. 3.Productos*/

obtenerObjetosTodos=async (req, res) => {
    let objetosTodos=await this.apiClientes.obtenerObjetosTodos() 
    //console.log("contenedorVar.objetosFile.RouterGet",contenedorVar)//debug
    res.json(objetosTodos)
}

guardarObjetos=async (req,res)=>{
    let dataBody=req.body;
    let objetosGuardados=await this.apiClientes.guardarObjetos(dataBody)
    //console.log("req.bodyPost.objetosFile.RouterPost",req.body) //debug
    res.send("Guardado.routerObjetosPostFile")
}

borrarObjeto=async(req,res)=>{
    try{
        const {id}=req.params;
        let objetoBorrado=await this.apiClientes.borrarObjeto(id)
        //console.log("req.paramas.apiClientes.delete",req.params)//debug        
        res.send(objetoBorrado)
    }catch(error){
        throw error
    }
}

borrarObjetosTodos=async(req,res)=>{
    let objetosTodosBorrados=await this.apiClientes.borrarObjetosTodos()
    res.json(objetosTodosBorrados)
    //console.log("borradoTotal.objetosFile.routerDelete")//debug
}

/* #endregion */

/* #region. 4.Carrito*/

obtenerObjetosCarritosTodos=async(req,res)=>{
    let objetosCarritosTodos=await this.apiClientes.obtenerObjetosCarritosTodos()
    logr.debug('[get-objetosCarrito](inicio)',{recurso:'[na]'})
    res.json(objetosCarritosTodos)
}

obtenerObjetosCarrito=async(req,res)=>{
    const {id}=req.params;
    let objetosCarrito=await this.apiClientes.obtenerObjetosCarrito(id)
    logr.debug('[get-objetosCarrito/:id](inicio)',{recurso:'[na]'})
    res.json(objetosCarrito)
}

guardarObjetosCarrito=async(req,res)=>{
    let product=req.body
    //console.log("producto ingresado: ",product) //debug
    const cartID=req.params.id
    //console.log("cartID: ",cartID) //debug
    let objetosCarritoGuardados=await this.apiClientes.guardarObjetosCarrito(cartID,product) 
    res.json(objetosCarritoGuardados)
}

borrarObjetosCarrito=async(req,res)=>{
    try{
        let product=req.body
        let cartID=req.params.id
        product.cartID=cartID
        let objetosCarritoBorrados=await this.apiClientes.borrarObjetosCarrito(product)
        //console.log("product.cartID,id: ",product) //debug
        res.json(objetosCarritoBorrados)
        
    }catch(error){
        throw error
    }
}

/* #endregion */


}

module.exports=ControllerClientes