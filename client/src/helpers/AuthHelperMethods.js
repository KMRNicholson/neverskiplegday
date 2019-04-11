import decode from "jwt-decode";

export default class AuthHelperMethods {
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || "http://localhost:3000"; // API server domain
  }
  // Initializing important variables
  login(email, password){
    // Get a token from api server using the fetch api
    return this.fetch(this.domain+`/signin`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      this.setToken(res.access_token); // Setting the token in localStorage
      return Promise.resolve(res);
    });
  };
  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    //The double exclamation is a way to cast the variable to a boolean, allowing you to easily check if the token exusts.
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };
  isTokenExpired(token){
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      } else return false;
    } catch (err) {
      console.log("expired check failed! Line 42: AuthService.js");
      return false;
    }
  };
  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  };
  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  };

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  };
  getConfirm(){
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    console.log("Received answer!");
    return answer;
  };
  fetch(url, options){
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }
    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };
  _checkStatus(response){
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
