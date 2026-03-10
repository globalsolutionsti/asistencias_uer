const API_URL = "https://script.google.com/macros/s/AKfycbycu6AMNLPQbGeWojs-mF1eTaNGWrBgTYHKUoo5yjkRYSnXsh_o_FYlEmvfAzghkQ6vBQ/exec";

let deviceId = localStorage.getItem("deviceId");
let selfieBase64 = null;
let currentLat = null;
let currentLng = null;


// =====================================
// DETECTOR MODO INCOGNITO
// =====================================

async function detectarIncognito() {

  return new Promise(resolve => {

    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;

    if (!fs) {
      resolve(false);
    } else {
      fs(window.TEMPORARY,100,
        () => resolve(false),
        () => resolve(true)
      );
    }

  });

}


// =====================================
// GENERAR FINGERPRINT DISPOSITIVO
// =====================================

function generarFingerprint() {

  const datos = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset()
  ].join("|");

  return btoa(datos).replace(/=/g,"");

}


// =====================================
// GENERAR TOKEN ROBUSTO
// =====================================

function generarToken() {

  const uuid = crypto.randomUUID();
  const fingerprint = generarFingerprint();

  return uuid + "_" + fingerprint;

}


// =====================================
// VALIDAR TOKEN LOCAL
// =====================================

function validarTokenLocal() {

  if (!deviceId) {

    deviceId = generarToken();
    localStorage.setItem("deviceId",deviceId);

  }

}


// =====================================
// DETECTOR DE GPS FALSO
// =====================================

function gpsSospechoso(position){

  const accuracy = position.coords.accuracy;

  if (accuracy > 1000) return true;

  if (position.coords.speed && position.coords.speed > 300) return true;

  return false;

}


// =====================================
// INICIALIZACION SEGURA
// =====================================

async function inicializarSeguridad(){

  const incognito = await detectarIncognito();

  if (incognito){

    mostrarModal(
      "error",
      "Modo de navegación restringido",
      "Por seguridad institucional, el registro de asistencia no puede realizarse en modo de navegación privada o incógnito. Favor de utilizar el navegador en modo normal."
    );

    throw new Error("Incognito detectado");

  }

  validarTokenLocal();

}

window.onload = inicializarSeguridad;



// =====================================
// VALIDAR UBICACION
// =====================================

function validarUbicacion() {

  const numero = document.getElementById("numero").value.trim();

if (!numero) {

  mostrarModal(
    "error",
    "Información requerida",
    "Debe ingresar su número de empleado para iniciar el proceso de validación."
  );

  return;
}

  navigator.geolocation.getCurrentPosition(position => {

    if (gpsSospechoso(position)) {

      mostrarModal(
        "error",
        "Ubicación no confiable",
        "El sistema detectó una inconsistencia en los datos de geolocalización del dispositivo. Por seguridad institucional no es posible registrar la asistencia."
      );

      return;
    }

    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        accion: "validar",
        numero: numero,
        lat: currentLat,
        lng: currentLng
      })
    })
    .then(res => res.json())
    .then(data => {

      if (data.success) {

        document.getElementById("step1").classList.add("hidden");
        document.getElementById("step2").classList.remove("hidden");

        activarCamara();

      } else {

        mostrarModal(
          data.success ? "success" : "error",
          data.success ? "Operación Exitosa" : "Atención",
          data.message
        );

      }

    });

  }, () => {

    mostrarModal(
      "error",
      "Permiso de ubicación requerido",
      "Para realizar el registro de asistencia es necesario habilitar el acceso a la ubicación del dispositivo."
    );

  });

}



// =====================================
// ACTIVAR CAMARA
// =====================================

function activarCamara() {

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }
  })
  .then(stream => {

    const video = document.getElementById("video");
    video.srcObject = stream;

    iniciarContador(stream);

  })
  .catch(() => {

    mostrarModal(
      "error",
      "Acceso a cámara requerido",
      "El sistema necesita acceso a la cámara para capturar la evidencia fotográfica del registro."
    );

  });

}



// =====================================
// CONTADOR SELFIE
// =====================================

function iniciarContador(stream) {

  let tiempo = 3;
  const contador = document.getElementById("contador");
  contador.innerText = "Tomando selfie en " + tiempo;

  const interval = setInterval(() => {

    tiempo--;
    contador.innerText = "Tomando selfie en " + tiempo;

    if (tiempo === 0) {

      clearInterval(interval);
      tomarSelfie(stream);

    }

  }, 1000);
}



// =====================================
// TOMAR SELFIE
// =====================================

function tomarSelfie(stream) {

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video,0,0);

  selfieBase64 = canvas.toDataURL("image/jpeg",0.8);

  stream.getTracks().forEach(track => track.stop());

  registrar();

}



// =====================================
// REGISTRAR ASISTENCIA
// =====================================

function registrar() {

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      accion: "registrar",
      numero: document.getElementById("numero").value.trim(),
      lat: currentLat,
      lng: currentLng,
      deviceId: deviceId,
      selfie: selfieBase64
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {

      document.getElementById("step2").classList.add("hidden");
      document.getElementById("step3").classList.remove("hidden");

    } else {

      mostrarModal(
        data.success ? "success" : "error",
        data.success ? "Operación Exitosa" : "Atención",
        data.message
      );

      location.reload();

    }

  });

}



// =====================================
// MODAL CORPORATIVO
// =====================================

function mostrarModal(tipo,titulo,mensaje){

  const modal = document.getElementById("modal");
  const icon = document.getElementById("modalIcon");
  const title = document.getElementById("modalTitle");
  const message = document.getElementById("modalMessage");

  modal.classList.remove("hidden");
  modal.classList.remove("modal-success","modal-error");

  if (tipo === "success"){

    modal.classList.add("modal-success");
    icon.innerHTML = "✔";

  }else{

    modal.classList.add("modal-error");
    icon.innerHTML = "✖";

  }

  title.innerText = titulo;
  message.innerText = mensaje;

}



function cerrarModal(){
  document.getElementById("modal").classList.add("hidden");
}
