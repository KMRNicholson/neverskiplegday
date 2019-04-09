const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./private.key', 'utf8');
var publicKEY = fs.readFileSync('./public.key', 'utf8');

module.exports = {
  sign: (payload, $Options) => {
    // Token signing options
    var signOptions = {
        expiresIn:  $Options.expiresIn
    };
    return jwt.sign(payload, privateKEY, signOptions);
  },
  verify: (token, $Options) => {
    var verifyOptions = {
      expiresIn: $Options.expiresIn
    };
    try{
      return jwt.verify(token, publicKEY, verifyOptions);
    }catch (err){
      return false;
    }
  },  
  decode: (token) => {
    return jwt.decode(token.replace("Bearer ", ""), {complete: true});
    //returns null if token is invalid
  }
}