const { verify } = require('jsonwebtoken');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const { model: mongooseModel } = require('mongoose');

const { model: sequelizeModel } = require('../helpers/sequelizeHelper');
const { responseObj } = require('../helpers/utilsHelper');

exports.custom = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    let user = await sequelizeModel('User').findAll({ where: { api_token: token } });
    if (user.length) {
      next();
    } else {
      user = await mongooseModel('user').find({ apiToken: token });
      if (user.length) {
        next();
      } else {
        return res.status(401).json(responseObj('Not authenticated!'));
      }
    }
  } else {
    return res.status(401).json(responseObj('Not authenticated!'));
  }
}

exports.jwtAuth = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let decodedToken = verify(req.headers.authorization.split(' ')[1], process.env.APP_KEY);
      if (decodedToken) {
        req.userId = decodedToken.userId;
        next();
      } else {
        return res.status(401).json(responseObj('Not authenticated!'));
      }
    } catch (error) {
      return res.status(401).json(responseObj('Not authenticated!'));
    }
  } else {
    return res.status(401).json(responseObj('Not authenticated!'));
  }
}

exports.mongoAuthorize = async (req, res, next) => {
  if (req.userId) {
    try {
      const data = await mongooseModel('user').findById(req.userId);
      if (data) {
        next();
      } else {
        return res.status(401).json(responseObj('You are not authorised to access this page!'));
      }
    } catch (error) {
      return res.status(401).json(responseObj('You are not authorised to access this page!'));
    }
  } else {
    return res.status(401).json(responseObj('You are not authorised to access this page!'));
  }
}

exports.sqlAuthorize = async (req, res, next) => {
  if (req.userId) {
    try {
      const user = await sequelizeModel('User').findAll({ where: {id: parseInt(req.userId)} });
      if (user.length) {
        next();
      } else {
        return res.status(401).json(responseObj('You are not authorised to access this page!'));
      }
    } catch (error) {
      return res.status(401).json(responseObj('You are not authorised to access this page!'));
    }
  } else {
    return res.status(401).json(responseObj('You are not authorised to access this page!'));
  }
}

exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: process.env.CAN_CACHE,
    rateLimit: process.env.CAN_RATE_LIMIT,
    jwksRequestsPerMinute: process.env.JWKS_REQUESTS_PER_MINUTE,
    jwksUri: process.env.JWKS_URI
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ['RS256']
});

exports.checkScopes = jwtAuthz([ 'read:messages' ]);
