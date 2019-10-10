document.addEventListener('DOMContentLoaded', () => {
  function startMap() {
    const inputLat = document.getElementById('latitude')
    const inputLng = document.getElementById('longitude')
   
    const field = {
      lat: Number(inputLat.value),
      lng: Number(inputLng.value)};
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 13,
        center: field
      }
    );
    const myMarker = new google.maps.Marker({
      position: {
        lat: Number(inputLat.value),
        lng: Number(inputLng.value)
      },
      map: map,
      title: "Field"
    });
  }
  startMap();
}, false);

const deleteMatch = (id) => {
  let baseurl = window.location.origin;
  window.location.href = baseurl + '/match/delete/' + id;
}



