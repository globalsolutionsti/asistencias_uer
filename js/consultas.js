const API_URL =
CONFIG.API_URL;

let datosConsulta = [];

function consultar(){

const numero =
document.getElementById("numero").value.trim();

const fechaInicio =
document.getElementById("fechaInicio").value;

const fechaFin =
document.getElementById("fechaFin").value;

if(!fechaInicio || !fechaFin){

mostrarModal(
"Información requerida",
"Seleccione fecha inicial y fecha final."
);

return;

}

if(fechaFin < fechaInicio){

mostrarModal(
"Rango inválido",
"La fecha final no puede ser menor que la fecha inicial."
);

return;

}

mostrarSpinner(
"Consultando Asistencias del Periodo " +
fechaInicio +
" - " +
fechaFin
);

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:"consultarAsistencias",

numero:numero,

fechaInicio:fechaInicio,

fechaFin:fechaFin

})

})

.then(r=>r.json())

.then(data=>{

ocultarSpinner();

datosConsulta =
data;

mostrarTabla(data);

if(data.length === 0){

mostrarModal(
"Sin asistencias",
"Periodo del " +
fechaInicio +
" al " +
fechaFin +
" sin asistencias registradas."
);

}else{

let textoEmpleado =
numero
? " para el expediente " + numero
: "";

mostrarModal(
"Consulta Realizada",
"Consulta realizada del periodo " +
fechaInicio +
" al " +
fechaFin +
textoEmpleado +
". Registros encontrados: " +
data.length +
"."
);

}

})

.catch(error=>{

ocultarSpinner();

console.error("ERROR CONSULTA ASISTENCIAS:", error);

mostrarModal(
"Error",
"No fue posible consultar las asistencias."
);

});

}

function mostrarTabla(datos){

const tbody =
document.querySelector(
"#tablaResultados tbody"
);

tbody.innerHTML = "";

datos.forEach(reg=>{

const puntualidad =
obtenerPuntualidadConsulta(
reg.fecha,
reg.tipo
);

const fila =
document.createElement("tr");

fila.innerHTML = `

<td>${reg.fecha}</td>
<td>${reg.numero}</td>
<td>${reg.nombre}</td>
<td>${reg.uer}</td>
<td>${reg.tipo}</td>
<td>${reg.origen}</td>

<td>

<a href="${reg.evidencia}"
target="_blank">

Ver

</a>

</td>

<td>
  <span class="badge-puntualidad ${puntualidad.clase}">
    <span class="punto"></span>
    ${puntualidad.texto}
  </span>
</td>

`;

tbody.appendChild(fila);

});

}

function exportarExcel(){

if(!datosConsulta || datosConsulta.length === 0){

mostrarModal(
"Sin información",
"No hay registros para exportar."
);

return;

}

let csv =
"Fecha,Empleado,Nombre,UER,Tipo,Origen,Evidencia\n";

datosConsulta.forEach(r=>{

csv +=
`"${r.fecha}","${r.numero}","${r.nombre}","${r.uer}","${r.tipo}","${r.origen}","${r.evidencia}"\n`;

});

const blob =
new Blob(
["\uFEFF" + csv],
{
type:"text/csv;charset=utf-8;"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"Asistencias_IEDEP.csv";

link.click();

mostrarModal(
"Exportación realizada",
"El archivo de asistencias fue generado correctamente."
);

}

function mostrarSpinner(texto){

document
.getElementById(
"spinnerTexto"
).innerText = texto;

document
.getElementById(
"spinnerOverlay"
)
.classList
.remove("hidden");

}

function ocultarSpinner(){

document
.getElementById(
"spinnerOverlay"
)
.classList
.add("hidden");

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
.classList
.remove("hidden");

}

function cerrarModal(){

document
.getElementById(
"modalOverlay"
)
.classList
.add("hidden");

}


function obtenerPuntualidadConsulta(fecha,tipo){

if(
tipo &&
tipo.toString().trim().toUpperCase() === "SALIDA"
){

return {
texto:"No aplica",
clase:"gris"
};

}

const partes =
fecha.split(" ");

if(partes.length < 2){

return {
texto:"No aplica",
clase:"gris"
};

}

const hora =
partes[1];

if(hora <= "09:14"){

return {
texto:"OK",
clase:"verde"
};

}

if(
hora >= "09:15" &&
hora <= "09:29"
){

return {
texto:"Retardo Menor",
clase:"amarillo"
};

}

if(hora >= "09:30"){

return {
texto:"Retardo Mayor",
clase:"rojo"
};

}

return {
texto:"No aplica",
clase:"gris"
};

}
