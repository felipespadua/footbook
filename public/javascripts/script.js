document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('autocompleteSearch').value = localStorage.getItem("place")
}, false);
const signUpPage = () => {
  let baseurl = window.location.origin;
  window.location.href = baseurl + '/signup';
}
const viewMatch = (id) => {
  console.log(id)
  let baseurl = window.location.origin;
  window.location.href = baseurl + '/match/show/' + id;
}
const addPlayerToMatch = (id) => {
  let baseurl = window.location.origin;
  window.location.href = baseurl + `/match/${id}/add/player` ;
}
const createNewMatch = () => {
  let baseurl = window.location.origin;
  window.location.href = baseurl + '/match/add';
}
// function initialize() {
//   var input = document.getElementById('autocomplete');
//   new google.maps.places.Autocomplete(input);
// }

// google.maps.event.addDomListener(window, 'load', initialize);




function initialize() {
  const apiHandler = new ApiHandler();     
  var inputSearch = document.getElementById('autocompleteSearch');
  inputSearch.placeholder = "Search"
  var autocompleteSearch = new google.maps.places.Autocomplete(inputSearch);
    google.maps.event.addListener(autocompleteSearch, 'place_changed', function () {
        var place = autocompleteSearch.getPlace();
        document.getElementById('location').value = place.name;
        document.getElementById('locationLat').value = place.geometry.location.lat();
        document.getElementById('locationLng').value = place.geometry.location.lng();
        let baseurl = window.location.origin;    
        localStorage.setItem("place",place.formatted_address)
        console.log(place)
        apiHandler.setLocation(place.geometry.location.lat(), place.geometry.location.lng(), place.name)
          .then(() => {
            console.log("Localizacao enviada com sucesso")
            window.location.href = baseurl + '/matches';
            document.getElementById("loading").style.display = "none"
          })
          .catch((err) => console.log("Ocorreu um erro ao enviar localizacao:", err))
       
    });
    
}
google.maps.event.addDomListener(window, 'load', initialize);


window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.getElementById("loading").style.display = "block"
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
        // let baseurl = window.location.origin;
        // window.location.href = baseurl + `/matches/${position.coords.latitude}/${position.coords.longitude}`;
        // localStorage.setItem("reloaded", true)
        document.getElementById("loading").style.display = "none"
      })
      .catch((err) =>{
        document.getElementById("loading").style.display = "none"
        console.log("Ocorreu um erro ao enviar localizacao:", err)
      })
  })
}else {
  document.getElementById("loading").style.display = "none"
}