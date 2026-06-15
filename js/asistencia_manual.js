const API_URL =
"https://script.google.com/macros/s/AKfycbyyV3nsPCDrWY7J1L04w1Hb2qZihH3pZavFyCPJy5aC7cQ4vZffdaJh4jwV6t08vbnhdw/exec";

let evidenciaBase64 = "";

window.onload = () => {

    cargarEmpleados();

    const evidencia =
    document.getElementById(
        "evidencia"
    );

    if(evidencia){

        evidencia.addEventListener(
            "change",
            previewImagen
        );

    }

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
console.log(data);
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
    
 mostrarSpinner();
    
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

ocultarSpinner();

if(data.success){

recargarPagina = true;

}

mostrarModal(
data.success
? "Registro exitoso"
: "Error",
data.message
);

})

.catch(error=>{

ocultarSpinner();

console.error(error);

mostrarModal(
"Error",
"No fue posible registrar la asistencia."
);

});

}

function mostrarModal(titulo,mensaje){

document
.getElementById(
"modalTitulo"
).innerText = titulo;

document
.getElementById(
"modalMensaje"
).innerText = mensaje;

document
.getElementById(
"modalOverlay"
)
.classList.remove(
"hidden"
);

}

function cerrarModal(){

document
.getElementById(
"modalOverlay"
)
.classList.add(
"hidden"
);

if(recargarPagina){

location.reload();

}

}

function mostrarSpinner(){

document
.getElementById(
"spinnerOverlay"
)
.classList.remove(
"hidden"
);

}

function ocultarSpinner(){

document
.getElementById(
"spinnerOverlay"
)
.classList.add(
"hidden"
);

}
