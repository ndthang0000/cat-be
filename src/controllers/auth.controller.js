const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const generateImage = require('../utils/generate.image');
const publicURL = require('../../get_url');
const { uploadFile } = require('../utils/upload.file');

const register = catchAsync(async (req, res) => {
  req.body.userId = await userService.randomIdUser();
  const textImage = req.body.name
    .split(' ')
    .map((item) => item.slice(0, 1))
    .join('')
    .slice(0, 4)
    .toUpperCase();
  await generateImage(textImage, `user-${req.body.userId}`);
  const dataUpload = await uploadFile(
    `${publicURL}/generate-image/user-${req.body.userId}.png`,
    `user-${req.body.userId}.png`
  );
  req.body.avatar = dataUpload.Location;
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens, status: true });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkTokenValid = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ data: true, user: req.user });
});

const addTranslationMemory = catchAsync(async (req, res) => {
  await userService.addTranslationMemory(req.user, req.body);
  res.status(httpStatus.OK).send({
    status: true,
    message: `${req.body.name} translation memory added`,
  });
});

const addDictionary = catchAsync(async (req, res) => {
  await userService.addDictionary(req.user, req.body);
  res.status(httpStatus.OK).send({
    status: true,
    message: `${req.body.name} dictionary added`,
  });
});

const getTmDict = catchAsync(async (req, res) => {
  const data = await userService.getTmDict(req.user, req.query.source, req.query.target);
  res.status(httpStatus.OK).send(data);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  checkTokenValid,
  addTranslationMemory,
  addDictionary,
  getTmDict,
};
