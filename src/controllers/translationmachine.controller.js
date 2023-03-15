// const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');

// const getWordMean = catchAsync(async (req, res) => {
//     const word = await fetch("http://localhost:5000/translate", {
//         method: "POST",
//         body: JSON.stringify({
//             q: req.body.q,
//             source: req.body.source,
//             target: req.body.target,
//             format: "text",
//             api_key: ""
//         }),
//         headers: { "Content-Type": "application/json" }});
//     res.send(await word.json());
//   });

//   module.exports = {
//     getWordMean,
//   }