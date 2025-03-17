const jwt = require("jsonwebtoken");

const token = jwt.sign({username:'', email:'yafiakmal45@gmail.com'}, 'kuncirahasia', {
    expiresIn: 60 * 10,
  })

const decoded = jwt.verify(token, 'kuncirahasia');

console.log(decoded)
