const publicURL = require('../../get_url');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicURL + '/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const splitName = file.originalname.split('.');
    const dotFile = splitName[splitName.length - 1];
    if (dotFile != 'docx') {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;
