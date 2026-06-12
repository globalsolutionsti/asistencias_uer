const API_URL =
"https://script.google.com/macros/s/AKfycbx9CqGaEcgVlAeIizYw5ioFYFqLZ4qS-um43Jl21pUNlxbk8aSZE5XGrSoC4OJ1K4T4LA/exec";

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

window.listaEmpleados = data;

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

combo.addEventListener(
"change",
mostrarEmpleado
);

mostrarEmpleado();

});

}

function mostrarEmpleado(){

const numero =
document.getElementById(
"empleado"
).value;

const empleado =
window.listaEmpleados.find(
e => e.numero == numero
);

if(!empleado) return;

document.getElementById(
"nombreEmpleado"
).innerText =
empleado.nombre;

document.getElementById(
"uerEmpleado"
).innerText =
"UER: " + empleado.uer;

}


function previewImagen(e){

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(evt){

evidenciaBase64 =
evt.target.result;

const img =
document.getElementById(
"preview"
);

img.src =
evidenciaBase64;

img.classList.remove(
"hidden"
);

};

reader.readAsDataURL(file);

}

function guardarAsistencia(){

const empleado =
document.getElementById(
"empleado"
);

const texto =
empleado.options[
empleado.selectedIndex
].text;

const numero =
empleado.value;

const nombre =
texto.split(" - ")[1];

const uer =
document
.getElementById(
"uerEmpleado"
)
.innerText
.replace("UER: ","");

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:
"guardarAsistenciaManual",

numero:
numero,

nombre:
nombre,

uer:
uer,

fecha:
document.getElementById(
"fecha"
).value,

hora:
document.getElementById(
"hora"
).value,

tipo:
document.getElementById(
"tipo"
).value,

motivo:
document.getElementById(
"motivo"
).value,

evidencia:
evidenciaBase64,

usuarioRH:
localStorage.getItem(
"usuarioRH"
)

})

})

.then(r=>r.json())

.then(data=>{

alert(
data.message
);

if(data.success){

location.reload();

}

})

.catch(error=>{

console.error(error);

alert(
"Error al guardar la asistencia."
);

});

}
