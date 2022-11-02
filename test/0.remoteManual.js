const axios=require('axios')

const baseURL= 'http://localhost:8081'

let axiosExec=async()=>{
    console.log("axiosExec](inicio)")
    const resAxiosGet=await axios.get(`${baseURL}/apiClientes/objetos`)
    console.log("[resAxiosGet] (msg) response: ", resAxiosGet.data)

    // let dataBody={nombre: 'CAMARA',img: '/img/periferico_camara_externa_1.jpg',
    //         precio: 80,descripcion: 'generico',promocion: 'generico'}
    // const resAxiosPost=await axios.post(`${baseURL}/apiClientes/objetos`,dataBody)
    // console.log("[resAxiosPost] (msg) response: ", resAxiosPost.data)
}

axiosExec()