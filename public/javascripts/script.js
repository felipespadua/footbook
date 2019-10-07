// function geolocate() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var geolocation = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//       var circle = new google.maps.Circle(
//           {center: geolocation, radius: position.coords.accuracy});
//       autocomplete.setBounds(circle.getBounds());
//     });
//   }
// }

// var map;
// function initialize(){

//   var mapOptions = {
//     zoom: 12,
//     center: new google.maps.LatLng(-34.397,150.644)
//   };
//   map = new google.maps.Map(document.getElementById('map'), mapOptions)
// }
// google.maps.event.addDomListener(window,'load',initialize)
// var defaultBounds = new google.maps.LatLngBounds(
//   new google.maps.LatLng(-90, -180),
//   new google.maps.LatLng(90, 180)
// );
// var options = {
//   bounds: defaultBounds
// }
// var input =  document.getElementById('autocomplete');
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// var autocomplete = new google.maps.places.Autocomplete(input, options);


document.addEventListener('DOMContentLoaded', () => {

  const signUpPage = () => {
    let baseurl = window.location.origin;
    window.location.href = baseurl + "/signup"
  }




// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.


}, false);
function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'));

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  console.log(place)
  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
  
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position)
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
          {center: geolocation, radius: position.coords.accuracy});
      
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// const login = document.querySelector('.login-page');
// const signup = document.querySelector('.signup-page');


// const signUpPage = () => {
//   signup.style.display = 'block';
//   login.style.opacity = '0';
//   setTimeout(() => {
//     signup.style.opacity = '1';
//     login.style.display = 'none';
  
//   }, 500);
// };
