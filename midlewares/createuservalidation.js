const { check } = require('express-validator');


// Validation rules.
var singinValidate = [
  check('email', 'Email is not define').isEmail(),
  check('username').isLength({min:3}).withMessage('Very short username'),
  check('password').isLength({ min: 5 })
  .withMessage('Password Must Be at Least 8 Characters')];

var loginValidate=[
      check('email', 'Email is not define').isEmail()
];
module.exports={
      singinValidate,
      loginValidate,
}