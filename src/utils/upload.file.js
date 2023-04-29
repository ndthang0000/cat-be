const { S3 } = require('aws-sdk');
const config = require('../config/config');
const fs = require('fs');
const publicURL = require('../../get_url');

const s3Client = new S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey,
});

const uploadFileBase64 = (name, buffer) => {
  try {
    const uploadParam = {
      Bucket: 'images-storage-bucket',
      Body: buffer,
      Key: name,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };
    return s3Client.upload(uploadParam).promise();
  } catch (e) {
    logger.error(e.message);
    return false;
  }
};

const uploadFile = (path, name) => {
  try {
    const fileStream = fs.createReadStream(path);
    const pathFile = `upload/avatar/`;
    const uploadParam = {
      Bucket: 'images-storage-bucket',
      Body: fileStream,
      Key: pathFile + name,
    };
    return s3Client.upload(uploadParam).promise();
  } catch (e) {
    logger.error(e.message);
    return false;
  }
};

module.exports = {
  uploadFileBase64,
  uploadFile,
};
