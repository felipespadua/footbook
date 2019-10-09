class ApiHandler{
  constructor(baseURL){
    this.axios = axios.create({
      baseURL: baseURL
    });
  }
  setLocation(lat,lng,place){
    return this.axios.post("",{lat,lng,place})
  }
  reloadMatches(){
    return this.axios.get()
  }
}