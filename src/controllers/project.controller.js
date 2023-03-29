const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { testFunction } = require('../python');

const test = catchAsync(async (req, res) => {
  const data = await testFunction();
  res.status(httpStatus.CREATED).send({ data: data });
});

const testUploadFile = catchAsync(async (req, res) => {
  console.log(req.file);
  res.status(httpStatus.CREATED).send({ data: 1 });
});

module.exports = {
  test,
  testUploadFile,
};
