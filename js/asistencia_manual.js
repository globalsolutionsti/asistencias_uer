const API_URL =
"https://script.google.com/macros/s/TU_DEPLOY/exec";

let evidenciaBase64 = "";

window.onload = () => {

    cargarEmpleados();

    document
    .getElementById("evidencia")
    .addEventListener(
        "change",
        previewImagen
    );

};

function cargarEmpleados(){

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:"obtenerEmpleados"

})

})

.then(r=>r.json())

.then(data=>{

const combo =
document.getElementById(
"empleado"
);

data.forEach(emp=>{

const option =
document.createElement(
"option"
);

option.value =
emp.numero;

option.text =
emp.numero +
" - " +
emp.nombre;

combo.appendChild(
option
);

});

});

}
