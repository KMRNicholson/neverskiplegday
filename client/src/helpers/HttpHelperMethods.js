import axios from 'axios';
import AuthHelperMethods from './AuthHelperMethods';
import { apiBaseUrl } from '../constants/operations';

export default class HttpHelperMethods {
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || apiBaseUrl; // API server domain
  }

  get(url){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + AuthHelperMethods.getToken();
    }

    return axios.get(this.domain+url, {
      headers
    })
      .then(response => { return response })
      .catch(error => { return error });
  };

  post(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + AuthHelperMethods.getToken();
    }

    return axios.post(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => console.log(error));
  }

  put(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + AuthHelperMethods.getToken();
    }

    return axios.put(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => console.log(error));
  }

  delete(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + AuthHelperMethods.getToken();
    }

    return axios.delete(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => console.log(error));
  }
}