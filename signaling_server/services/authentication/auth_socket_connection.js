const jwt = require('jsonwebtoken');

const authenticateSocketConnection = (accessToken, username) => {
    console.log(accessToken)
    try {
        var decodedToken = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        if(decodedToken.username === username){
            return { authenticated: true, decodedToken }
        } else {
            return { authenticated: false, error: null }
        }
      } catch(error) {
        console.log(error)
        return  { authenticated: false, error }
      }
    
}

module.exports = authenticateSocketConnection