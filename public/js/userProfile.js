const input1 = document.getElementById('input1')
const input2 = document.getElementById('input2')
const uploadImg = document.getElementById('upload')
const uploadText = document.getElementById('myBtn')
const textShow = document.getElementById('textShow')
const imgShow = document.getElementById('imgShow')
const status = document.getElementById('status')
//let FileReader = require('filereader')
//const selectFile = file.files[0]; 
console.log('[3.front.js](msg)(inicio)')

cargarImagenPerfil()
function cargarImagenPerfil(){
  try {
    //imgShow.style.backgroundImage = `url(/imgUser/avatarDefault.jpg)`;
    let html=`<img src='/imgUser/avatar1.png' onerror="if (this.src != '/imgUser/avatarDefault.jpg') this.src = '/imgUser/avatarDefault.jpg';" style='width:40px; height:30px;'>`
    html+=`<br><small>
          <pre>
            Luego de subir la imagen 
            actualice a página
          </pre></small>`
    document.getElementById('imgPreview').innerHTML=html
    //clearTimeout(myVar)
    //location.reload()
  //   if ('referrer' in document) {
  //     window.location = document.referrer;
  //     /* OR */
  //     //location.replace(document.referrer);
  // } else {
  //     window.history.back();
  // }
  }catch(e){
    console.log("[JSindex.js](msg) error: ",e)
  }
}

function GoBackWithRefresh(event) {
  if ('referrer' in document) {
      window.location = document.referrer;
      /* OR */
      //location.replace(document.referrer);
  } else {
      window.history.back();
  }
}


// uploadImg.addEventListener('click', () => {
//         console.log('[3.frontjs]clicked the upload button!')
//         const imgReader = new FileReader(); // initialize the object  
//         //alert("You clicked me")
//         imgReader.addEventListener('load', () => {
//             const uploaded_image = imgReader.result;
//             imgShow.style.backgroundImage = `url(${uploaded_image})`;
//             console.log("[3.frontjs][uploadImg.addEventListener][imgReader.addEventListener] (msg) this.result: ",uploaded_image)
//           });
//         imgReader.readAsDataURL(input1.files[0]); // read file as array buffer
//         //console.log('[3.frontjs]fileReader',fileReader)
// })

// uploadText.addEventListener("click", () => {

//     const textReader = new FileReader();
//     textReader.addEventListener('load', () => {
//       textShow.innerText = this.result;
//     });
//     textReader.readAsText(input2.files[0]);
  
//   });

