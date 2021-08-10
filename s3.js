require('dotenv').config();

const aws = require('aws-sdk/clients/s3');
const fs = require('fs');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretKeyId = process.env.AWS_SECRET_ACCESS_KEY;
const bucketRegion = process.env.AWS_S3_REGION;
const bucketName = process.env.AWS_S3_BUCKET;

const s3 = new aws({
    bucketRegion,
    accessKeyId,
    secretKeyId
});

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.originalname
    }

    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;


function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;