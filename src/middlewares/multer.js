const publicURL = require('../../get_url');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicURL + '/uploads');
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

    cb(
      null,
      Date.now() +
        '-' +
        file.originalname
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
    );
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
