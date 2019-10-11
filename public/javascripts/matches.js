
document.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem("reloaded")){
    if (navigator.geolocation) {
      document.getElementById("loading").style.display = "block"
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
            let baseurl = window.location.origin;
            window.location.href = baseurl + `/matches/${position.coords.latitude}/${position.coords.longitude}`;
            // localStorage.setItem("reloaded", true)
            // window.location.href = baseurl + '/matches';
            document.getElementById("loading").style.display = "none"
            localStorage.setItem("reloaded", true)
           
          })
          .catch((err) =>{
            document.getElementById("loading").style.display = "none"
            console.log("Ocorreu um erro ao enviar localizacao:", err)
          })
      })
    }else{
      document.getElementById("loading").style.display = "none"
    }
  }
}, false);
