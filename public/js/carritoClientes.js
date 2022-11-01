let carritoTest1=200

obtenerLocal()
console.log("[carritoClientes.js]carritoElegido",carritoElegido)
fetch(`/apiClientes/objetosCarrito/${carritoElegido}`,{headers:{admin:'true'}})
.then(response=>response.json())
.then(productDatos=>{
    
    console.log("productosGetCart: ",productDatos.products)
    let textProductDatos=JSON.stringify(productDatos.products)
    //console.log("productosGetCart: ",textProductDatos)
    console.log("productosGetSizeCart: ",productDatos.products.length)
    console.log("carritoElegidoExterno2",carritoElegido)
    
    console.log("carritoTest1",carritoTest1)
    
    let html=`<table class='table' id='lista-compra'>
    <thead>
        <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Descripcion</th>
            <th scope="col">imagen</th>
            <th scope="col">Eliminar</th>
        </tr>
        
    </thead>
    <tbody >`
    for (const product of productDatos.products){
        
        if (product["_id"]){
            let product_id=product["_id"]
            html+=`
            <tr id='itemFila${product_id}'>
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td><img src=${product.img} style='width:40px; height:30px;'></td>
                <td>
                    <a href="#" id='itemRegistro' ><i class='fa fa-times-circle' style='color: rgb(221, 215, 215)' onclick='eliminarPorID("${product_id}","${carritoElegido}")'></i></a>
                </td>
            </tr>      
            `
        }
        else{
            html+=`
            <tr id='itemFila${product.id}'>
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td><img src=${product.img} style='width:40px; height:30px;'></td>
                <td>
                    <a href="#" id='itemRegistro' ><i class='fa fa-times-circle' style='color: rgb(221, 215, 215)' onclick='eliminarPorID("${product.id}","${carritoElegido}")'></i></a>
                </td>
            </tr>      
            `

           
        }
    }
    html+=`
    </tbody>
    </table>
    `
    html+=`<div class="row justify-content-between">
             <div class="col-md-4 mb-2">
                 <a href="/productosClientes" class="btn btn-info btn-block">Seguir comprando</a>
             </div>
             <div class="col-xs-12 col-md-4">
                 <a href="#" id="procesar-compra" class="btn btn-success btn-block" onclick='notificarAdmin(${textProductDatos})'>Procesar Compra</a>
             </div>
           </div>`
    document.getElementById('carrito1').innerHTML=html
    
    
    
})
.catch(error=>{
    console.log(error)
});
//<a href="#" class=" fas fa-times-circle"  onclick='eliminarPorID("${product.id}","${carritoElegido}")></a>
function eliminarPorID(idProducto,carritoElegidoxDelete){
    //console.log("círculo de delete 0.idProducto",idProducto)
    //${idProducto}
    let productoxEliminar={}
    productoxEliminar.id=idProducto
    console.log("carritoElegidoxDelete.frontJSCarritoClientes: ",carritoElegidoxDelete)
    console.log("IdproductoxEliminar.frontJSCarritoClientes: ",productoxEliminar)
    fetch(`/apiClientes/objetosCarrito/${carritoElegidoxDelete}/objetos`,{method: 'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify(productoxEliminar)})
    .then(response=>response)
    .then(productDatos=>{
        //console.log("productosDBGetElimando: ",productDatos)
        console.log("productosDBGetSizeEliminado: ",productDatos.length)
        console.log("carritoElegidoxDeleteInFetchEliminado",idProducto)
    })
    .catch(error=>{
        console.log(error)
    });
    document.getElementById(`itemFila${idProducto}`).remove();
    //setTimeout( function() { obtenerDatos(carritoElegidoxDelete); }, 1000);
    //console.log("círculo de delete 1.idProducto",idProducto)
}

function notificarAdmin(productosComprados){
    //console.log("[carritoClientes.js][notificarAdmin] (msg) productosComprados",productosComprados)
    newPayload=JSON.stringify(productosComprados)
    fetch('/apiOperaciones/notificacion', {method: 'POST',headers:{'content-type':'application/json'},body: newPayload})
     .then(res => {
        res
            
        })
        
     .then(data => {
        console.log("[carritoClientes.js][fecth-POST](dataPostEnviarDatos) data:",data)
        console.log("[carritoClientes.js][fecth-POST](newPayloadFetchEnviarDatos) newPayload: ",newPayload)
        
    })
    
     .catch(error=>{
        console.log(error)
     });
}

function obtenerLocal(){
    let obtenerDatoEnStorage = localStorage.getItem('CartIdentificador')
    let DatoStorageDisponible = JSON.parse(obtenerDatoEnStorage);
    carritoElegido=DatoStorageDisponible
    console.log("DatoStorageDisponible",DatoStorageDisponible)
}


//data-id="${product.id}"


