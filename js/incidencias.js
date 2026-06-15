const API_URL =
"https://script.google.com/macros/s/AKfycbykJX05FrT2RNICQ10Ja6q0baU2LroCrePuvSklMirz2y4dohKMuQ7IDbmM9OFnmYmpsQ/exec";

function consultarIncidencias(){

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:
"consultarIncidencias"

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
