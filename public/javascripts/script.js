document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('autocompleteSearch').value = localStorage.getItem("place")
}, false);

let apiHandler = new ApiHandler()
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

if (navigator.geolocation) {
  document.getElementById("loading").style.display = "block"
  navigator.geolocation.getCurrentPosition(function (position) {
    const user_location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    document.getElementById('locationLat').value =  position.coords.latitude;
    document.getElementById('locationLng').value =  position.coords.longitude;
    document.getElementById("loading").style.display = "none"
  })
}else {
  document.getElementById("loading").style.display = "none"
}
var id

function error (err) {
  let baseurl = window.location.origin; 
  let locationCode = localStorage.getItem("locationCode")
  if(locationCode != 3){
    if (err.code == err.PERMISSION_DENIED){
      console.log(err)
      window.location.href = baseurl + '/matches/clearlocation';
      document.getElementById("loading").style.display = "none";
      localStorage.setItem("locationCode", 3)
    }
  }else{
    document.getElementById("loading").style.display = "none";
  }
}
  
function success(){

}

id = navigator.geolocation.watchPosition(success,error);
