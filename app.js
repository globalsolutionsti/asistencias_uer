const API_URL = "https://script.google.com/macros/s/AKfycbw-_gKYcbj-79wdw-jOOLwdkxw5BJNcdJ7_Lechajm73f4daSis0lPRVIYfFuZ5Y3y9RQ/exec";

let deviceId = localStorage.getItem("deviceId");
let selfieBase64 = null;
let currentLat = null;
let currentLng = null;

if (!deviceId) {
  deviceId = crypto.randomUUID();
  localStorage.setItem("deviceId", deviceId);
}

function validarUbicacion() {

  const numero = document.getElementById("numero").value.trim();

  if (!numero) {
    alert("Ingrese su número de empleado.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {

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
        alert(data.message);
      }

    });

  }, () => {
    alert("Debe permitir acceso a la ubicación.");
  });
}

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
    alert("Debe permitir acceso a la cámara.");
  });
}

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

function tomarSelfie(stream) {

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  selfieBase64 = canvas.toDataURL("image/jpeg", 0.8);

  stream.getTracks().forEach(track => track.stop());

  registrar();
}

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
      alert(data.message);
      location.reload();
    }

  });
}
function mostrarModal(tipo, titulo, mensaje) {

  const modal = document.getElementById("modal");
  const icon = document.getElementById("modalIcon");
  const title = document.getElementById("modalTitle");
  const message = document.getElementById("modalMessage");

  modal.classList.remove("hidden");
  modal.classList.remove("modal-success", "modal-error");

  if (tipo === "success") {
    modal.classList.add("modal-success");
    icon.innerHTML = "✔";
  } else {
    modal.classList.add("modal-error");
    icon.innerHTML = "✖";
  }

  title.innerText = titulo;
  message.innerText = mensaje;
}

function cerrarModal() {
  document.getElementById("modal").classList.add("hidden");
}
