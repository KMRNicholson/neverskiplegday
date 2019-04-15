const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./private.key', 'utf8');

module.exports = {
  sign: (payload) => {
    // Token signing options
    return jwt.sign(payload, privateKEY);
  },
  verify: (token) => {
    try{
      return jwt.verify(token, privateKEY); //need to look into why public key isn't working
    }catch (err){
      return false;
    }
  },  
  decode: (token) => {
    return jwt.decode(token.replace("Bearer ", ""), {complete: true});
    //returns null if token is invalid
  }
}