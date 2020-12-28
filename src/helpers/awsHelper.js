const { S3, SES } = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const AWS_S3 = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

const AWS_SES = new SES({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.SES_REGION
});

exports.imgUploadToS3 = multer({
  'storage': multerS3({
    's3': AWS_S3,
    'acl': 'public-read',
    'cacheControl': 'max-age=31536000',
    'bucket': process.env.ASSET_BUCKET,
    'metadata': (req, file, cb) => {
      cb(null, {
        'fieldName': file.fieldname
      });
    },
    'key': (req, file, cb) => {
      let path = '';
      if (req.originalUrl.includes('mongo')) {
        path += req.originalUrl.includes('mongoose') ? 'mongoose/' : 'mongodb/';
      } else if (req.originalUrl.includes('sequelize')) {
        path += 'sequelize/';
      } else if (req.originalUrl.includes('mysql')) {
        path += 'mysql/';
      }
      if (req.originalUrl.includes('product')) {
        path += 'productImages/';
      }
      cb(null, path + Date.now().toString() + '-' + file.originalname);
    }
  }),
  'fileFilter': (req, file, cb) => {
    let mimetypes = [];
    if (req.originalUrl.includes('image') || req.originalUrl.includes('logo')) {
      mimetypes = ['image/png', 'image/jpg', 'image/jpeg'];
    }
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

exports.sendMail = (to, from, subject, html) => {
  return AWS_SES.sendEmail({
    Source: from,
    Destination: {
      ToAddresses: [
        to
      ],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    }
  }).promise();
}
