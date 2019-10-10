document.addEventListener('DOMContentLoaded', () => {
  

}, false);

let listenerHandle

const enableAutocomplete = () => {
  var newMatch = document.getElementById('autocompleteNewMatch');
  newMatch.placeholder = "Search"
  var autocompleteNewMatch = new google.maps.places.Autocomplete(newMatch);
  listenerHandle = google.maps.event.addListener(autocompleteNewMatch, 'place_changed', function () {
      var place = autocompleteNewMatch.getPlace();
      document.getElementById('locationNewMatch').value = place.formatted_address;
      document.getElementById('newMatchLat').value = place.geometry.location.lat();
      document.getElementById('newMatchLng').value = place.geometry.location.lng();
  });

}

const setFieldAddress = () => {
  let fieldId = document.getElementById("field").value
  if(fieldId != "Other"){
    // var newMatch = document.getElementById('autocompleteNewMatch');
    // document.removeEventListener('onfocus',newMatch)
    // listenerHandle != undefined ? google.maps.event.clearListeners(newMatch,'place_changed') : listenerHandle
    document.getElementById("autocompleteNewMatch").readOnly = true;
    let apiHandler = new ApiHandler();
    let fieldId = document.getElementById("field").value
    let googleApiHandler = new GoogleApiHandler();
    apiHandler.getFieldLocation(fieldId)
      .then((result) => {
        console.log("Endereco do campo:", result)
        let lat = result.data.coordinates[1];
        let lng = result.data.coordinates[0];
        googleApiHandler.getAddressByLatLng(lat,lng)
          .then((result) => {
            console.log("Result google: ",result)
            let place = result.data.results[0].formatted_address
            document.getElementById('autocompleteNewMatch').value = place;
          })
          .catch((err) => console.log(err))
      })
  }else {
    enableAutocomplete()
    document.getElementById('autocompleteNewMatch').value = "";
    document.getElementById("autocompleteNewMatch").readOnly = false;
  }
 
} 

