document.addEventListener('DOMContentLoaded', () => {
  function startMap() {
    const input = document.getElementById('location')
    console.log(input.value);
    const field = {
      lat: -23.5626946,
      lng: -46.6550198};
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 13,
        center: field
      }
    );
    const myMarker = new google.maps.Marker({
      position: {
        lat: -23.5626946,
        lng: -46.6550198
      },
      map: map,
      title: "Field"
    });
  }
  startMap();
}, false);




