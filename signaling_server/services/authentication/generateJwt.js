const jwt = require('jsonwebtoken');


const generateAccessToken = (username) => {
    return jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

const generateRefreshToken = (username) => {
    return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10h' });
}

module.exports = { generateAccessToken, generateRefreshToken }