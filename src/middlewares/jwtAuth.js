const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { ServerSetting, User } = require('../models');
const logger = require('../config/logger');

module.exports.authJwt = (role) => async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: false,
      message: 'No token Bearer',
    });
  }
  if (!token.startsWith('Bearer')) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: 'Token start with Bearer',
    });
  }
  token = token.split(' ')[1];

  try {
    const { sub } = jwt.verify(token, config.jwt.secret);
    const user = await User.findOne({ userId: sub });
    if (!user)
      return res.status(httpStatus.BAD_REQUEST).json({
        status: false,
        message: `Don't find user in system`,
      });
    if (user.isBlock)
      return res.status(200).json({
        status: false,
        message: `Your account is temporarily locked due to detecting misconduct. Please contact support@herobook.io for more details!.`,
      });
    if (role && user.role !== role) {
      return res.status(200).json({
        status: false,
        message: `Permission deny`,
      });
    }

    const checkMaintain = await ServerSetting.findOne({});

    if (checkMaintain && checkMaintain.maintain === 1) {
      if (!checkMaintain.whitelist.includes(user.userId))
        return res.status(200).json({
          status: false,
          message: `The system is maintenance!. Please try again in another time.`,
        });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: err.message });
  }
};

module.exports.generateJWT = async (userId) => {
  const expireTime = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const payload = {
    userId,
    role,
    iat: moment().unix(),
    exp: expireTime.unix(),
  };
  try {
    return jwt.sign(payload, config.jwt.secret);
  } catch (error) {
    console.log(error);
  }
};
