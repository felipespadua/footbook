
document.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem("reloaded")){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        document.getElementById('locationLat').value =  position.coords.latitude;
        document.getElementById('locationLng').value =  position.coords.longitude;
        const apiHandler = new ApiHandler();     
        apiHandler.setLocation(user_location.lat, user_location.lng)
          .then(() => {
            console.log("Localizacao enviada com sucesso")
            window.location.reload();
            localStorage.setItem("reloaded", true)
          })
          .catch((err) => console.log("Ocorreu um erro ao enviar localizacao:", err))
      })
    }
  }
}, false);
