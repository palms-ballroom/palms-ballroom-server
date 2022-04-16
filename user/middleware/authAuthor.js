const { User, News, Customer } = require("../models");
const { readToken } = require('../helpers/jwt')

let authenticate = async function (req, res, next) {
  try {
    if(!req.headers.access_token) throw{name: 'jwt must be provided'}
    const token = readToken(req.headers.access_token);
    const user = await User.findOne({ where: { email: token.email } });
    if (!user) throw{name: "Unauthorized"}
    req.user = user;
    next();
  } catch (err) {
    next(err)
  }
};

let authenticateCustomer = async function (req, res, next) {
  try {
    if(!req.headers.access_token) throw{name: 'jwt must be provided'}
    const token = readToken(req.headers.access_token);
    const user = await Customer.findOne({ where: { email: token.email } });
    if (!user) throw{name: "Unauthorized"}
    req.user = user;
    next();
  } catch (err) {
    next(err)
  }
};

let authorize = async function(req, res, next){
  try {
    const { role, id } = req.user
    if(role === 'Staff'){
      const news = await News.findOne({where: {id: +req.params.id}})
      if(!news) throw{name: 'News Id not found'}
      if(news.userId !== id) throw{name: "Forbidden"}
    }
    next()
  }
  catch(err){
    next(err)
  }
}

let authorizeCustomer = async function(req, res, next){
  try {
    const { role } = req.user
    if(role !== 'Customer'){
      throw{name: "Forbidden"}
    }
    return next()
  }
  catch(err){
    next(err)
  }
}

module.exports = {
  authenticate,
  authorize,
  authorizeCustomer,
  authenticateCustomer
}
