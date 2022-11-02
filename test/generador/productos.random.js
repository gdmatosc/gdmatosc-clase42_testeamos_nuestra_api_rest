const {faker} = require('@faker-js/faker')

//let numeroi=faker.datatype.number({ min:70, max: 100 })
//console.log("[productos.random.js] (msg) numeroi: ",numeroi)
faker.commerce.productDescription() 
faker.commerce.price(70, 100, 0)


const getPersona=()=>({
    nombre:faker.name.firstName(),
    email:faker.internet.email()
})

const getPrecio=()=>{
    // let numeroi=faker.datatype.number({ max: 100 })
    // console.log("[productos.random.js] (msg) numeroi: ",numeroi)
    return faker.commerce.price(70, 100, 0)
}

const getDescripcion=()=>{
    return faker.commerce.productDescription() 
}
module.exports={
    getPersona,
    getPrecio,
    getDescripcion
}