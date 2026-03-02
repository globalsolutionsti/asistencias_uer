const API_URL = "PEGA_AQUI_URL_APPS_SCRIPT";

let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
  deviceId = crypto.randomUUID();
  localStorage.setItem("deviceId", deviceId);
}

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    document.getElementById("video").srcObject = stream;
  });

function registrar() {

  navigator.geolocation.getCurrentPosition(position => {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const selfie = canvas.toDataURL("image/jpeg");

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        nombre: document.getElementById("nombre").value,
        numero: document.getElementById("numero").value,
        uer: document.getElementById("uer").value,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        deviceId: deviceId,
        selfie: selfie
      })
    })
    .then(res => res.json())
    .then(data => alert(data.message));

  });
}
