const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  sign: (payload) => {
    // Token signing options
    return jwt.sign(payload, process.env.SECRET);
  },
  verify: (token) => {
    try{
      return jwt.verify(token, process.env.SECRET); //need to look into why public key isn't working
    }catch (err){
      return false;
    }
  },  
  decode: (token) => {
    return jwt.decode(token.replace("Bearer ", ""), {complete: true});
    //returns null if token is invalid
  }
}