document.addEventListener('DOMContentLoaded', () => {
  var newMatch = document.getElementById('autocompleteNewMatch');
  var autocompleteNewMatch = new google.maps.places.Autocomplete(newMatch);
  google.maps.event.addListener(autocompleteNewMatch, 'place_changed', function () {
      var place = autocompleteNewMatch.getPlace();
      document.getElementById('locationNewMatch').value = place.name;
      document.getElementById('newMatchLat').value = place.geometry.location.lat();
      document.getElementById('newMatchLng').value = place.geometry.location.lng();
  });

 
}, false);


