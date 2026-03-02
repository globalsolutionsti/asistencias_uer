const API_URL = "https://script.google.com/macros/s/AKfycbzIgP4yiYVpc-MT8cNCcnBk3ajXH2KJrK5y5EAFlyCp2fTXY6lfYl8PVx0PwKE47vocTA/exec";
let deviceId = localStorage.getItem("deviceId");
let selfieBase64 = null;

if (!deviceId) {
  deviceId = crypto.randomUUID();
  localStorage.setItem("deviceId", deviceId);
}

function validarUbicacion() {

  navigator.geolocation.getCurrentPosition(position => {

    fetch(API_URL + "?validar=true", {
      method: "POST",
      body: JSON.stringify({
        numero: document.getElementById("numero").value,
        lat: position.coords.latitude,
        lng: position.coords.longitude
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

  });
}

function activarCamara() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById("video").srcObject = stream;
    });
}

function tomarSelfie() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  selfieBase64 = canvas.toDataURL("image/jpeg");

  document.getElementById("step3").classList.remove("hidden");
}

function registrar() {

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      numero: document.getElementById("numero").value,
      deviceId: deviceId,
      selfie: selfieBase64
    })
  })
  .then(res => res.json())
  .then(data => alert(data.message));

}
