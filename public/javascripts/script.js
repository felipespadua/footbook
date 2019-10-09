document.addEventListener('DOMContentLoaded', () => {

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

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      document.getElementById('locationLat').value =  position.coords.latitude;
      document.getElementById('locationLng').value =  position.coords.longitude;
      console.log(user_location)
    })
  }



function initialize() {
  var inputSearch = document.getElementById('autocompleteSearch');
  var autocompleteSearch = new google.maps.places.Autocomplete(inputSearch);
    google.maps.event.addListener(autocompleteSearch, 'place_changed', function () {
        var place = autocompleteSearch.getPlace();
        document.getElementById('location').value = place.name;
        document.getElementById('locationLat').value = place.geometry.location.lat();
        document.getElementById('locationLng').value = place.geometry.location.lng();
        let baseurl = window.location.origin;
        window.location.href = baseurl + '/matches';
    });
    var newMatch = document.getElementById('autocompleteNewMatch');
    var autocompleteNewMatch = new google.maps.places.Autocomplete(newMatch);
      google.maps.event.addListener(autocompleteNewMatch, 'place_changed', function () {
          var place = autocompleteNewMatch.getPlace();
          document.getElementById('location').value = place.name;
          document.getElementById('locationLat').value = place.geometry.location.lat();
          document.getElementById('locationLng').value = place.geometry.location.lng();
          let baseurl = window.location.origin;
          window.location.href = baseurl + '/matches';
      });
}
google.maps.event.addDomListener(window, 'load', initialize);
