import axios from 'axios';
import AuthHelperMethods from './AuthHelperMethods';
import { apiBaseUrl } from '../constants/operations';

export default class HttpHelperMethods {
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || apiBaseUrl; // API server domain
  }

  get(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + new AuthHelperMethods().getToken();
    }

    return axios.get(this.domain+url, {
      params:payload,
      headers:headers
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
      headers["Authorization"] = "Bearer " + new AuthHelperMethods().getToken();
    }

    return axios.post(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => { return error });
  }

  postImage(url, payload){
    const headers = {
      'content-type':'multipart/form-data'
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + new AuthHelperMethods().getToken();
    }

    return axios.post(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => { return error });
  }

  put(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + new AuthHelperMethods().getToken();
    }

    return axios.put(this.domain+url, payload, {
      headers
    })
      .then(response => { return response })
      .catch(error => { return error });
  }

  delete(url, payload){
    // performs api calls sending the required authentication headers
    const headers = {};

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (new AuthHelperMethods().loggedIn()) {
      headers["Authorization"] = "Bearer " + new AuthHelperMethods().getToken();
    }

    return axios.delete(this.domain+url, {
      data:payload,
      headers:headers
    })
      .then(response => { return response })
      .catch(error => {return error});
  }
}