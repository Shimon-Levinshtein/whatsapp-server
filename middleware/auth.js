const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ENCRYPTED_TOKEN);
    req.userData = { 
      userId: decodedToken.userId,
      mail: decodedToken.mail,
    };
    next();
  } catch (error) {
    console.log('error:', error);
    res.status(500).send({ error: error.message })
  }
};
try {
  
} catch (error) {
  
}