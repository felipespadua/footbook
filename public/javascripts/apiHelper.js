class ApiHandler{
  constructor(){
    this.axios = axios.create({
      baseURL: window.location.origin
    });
  }
  setLocation(lat,lng,place = undefined){
    return this.axios.get(`/matches/${lat}/${lng}`)
  }
  getFieldLocation(fieldId){
    return this.axios.get(`/api/field/${fieldId}/location`)
  }
  reloadMatches(){
    return this.axios.get()
  }
}

class GoogleApiHandler{
  constructor(apiKey){
    this.axios = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api/geocode"
    });
    this.apiKey = "AIzaSyAM67FmXYTA2to7SnkdpMwTQJ399FXrgeo"
  }
  getAddressByLatLng(lat,lng){
    return this.axios.get(`json?latlng=${lat},${lng}&key=${this.apiKey}`)
  }
}