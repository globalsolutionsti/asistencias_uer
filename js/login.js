const API_URL =
"https://script.google.com/macros/s/AKfycbzmUnuUmmARPDyPXtSeKKVx8qGSBh9d-HbsX2y4syp6EM9JOsIEQHUs_NcdLF5J6DP1Fg/exec";

function login(){

const usuario =
document.getElementById("usuario").value;

const password =
document.getElementById("password").value;

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:"loginRH",
usuario:usuario,
password:password

})

})

.then(r=>r.json())

.then(data=>{

if(data.success){

localStorage.setItem(
"usuarioRH",
data.nombre
);

localStorage.setItem(
"rolRH",
data.rol
);

window.location=
"dashboard.html";

}else{

alert(data.message);

}

});

}
