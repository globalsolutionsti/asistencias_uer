const API_URL =
"https://script.google.com/macros/s/AKfycbzr8VMXRjZQWGYgUsWP9qTT8BrxIh610Wv-GjXp6NyKk8Sy4lN4kyWR864EDXjzHwkBKw/exec";

let datosConsulta = [];

function consultar(){

fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"text/plain"
},

body:JSON.stringify({

accion:"consultarAsistencias"

})

})

.then(r=>r.json())

.then(data=>{

datosConsulta = data;

mostrarTabla(data);

})

.catch(error=>{

console.error(error);

alert("Error al consultar.");

});

}

function mostrarTabla(datos){

const tbody =
document.querySelector(
"#tablaResultados tbody"
);

tbody.innerHTML = "";

datos.forEach(reg=>{

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

`;

tbody.appendChild(fila);

});

}

function exportarExcel(){

let csv =

"Fecha,Empleado,Nombre,UER,Tipo,Origen\n";

datosConsulta.forEach(r=>{

csv +=

`${r.fecha},${r.numero},${r.nombre},${r.uer},${r.tipo},${r.origen}\n`;

});

const blob =
new Blob([csv],{
type:"text/csv"
});

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"Asistencias_IEDEP.csv";

link.click();

}
