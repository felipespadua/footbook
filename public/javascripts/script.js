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
  const apiHandler = new ApiHandler(window.location.href);     
  var inputSearch = document.getElementById('autocompleteSearch');
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
          })
          .catch((err) => console.log("Ocorreu um erro ao enviar localizacao:", err))
       
    });
    
}
google.maps.event.addDomListener(window, 'load', initialize);
