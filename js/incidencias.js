const API_URL =
"https://script.google.com/macros/s/AKfycbyyV3nsPCDrWY7J1L04w1Hb2qZihH3pZavFyCPJy5aC7cQ4vZffdaJh4jwV6t08vbnhdw/exec";

function consultarIncidencias(){

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({
  accion:"consultarIncidencias",
  fechaInicio:document.getElementById("fechaInicio").value,
  fechaFin:document.getElementById("fechaFin").value
})

})

.then(r=>r.json())

.then(data=>{

mostrarTabla(data);

})

.catch(error=>{

console.error(error);

alert(
"Error al consultar incidencias"
);

});

}

function mostrarTabla(datos){

let html = `

<table>

<tr>

<th>Fecha</th>
<th>Empleado</th>
<th>Nombre</th>
<th>UER</th>
<th>Incidencia</th>
<th>Detalle</th>

</tr>

`;

datos.forEach(row=>{

html += `

<tr>

<td>${row.fecha}</td>
<td>${row.empleado}</td>
<td>${row.nombre}</td>
<td>${row.uer}</td>
<td>${row.incidencia}</td>
<td>${row.detalle}</td>

</tr>

`;

});

html += "</table>";

document
.getElementById(
"resultado"
)
.innerHTML = html;

}
