require('dotenv').config();

const aws = require('aws-sdk/clients/s3');
const fs = require('fs');

const accessKeyId = "AKIAYYUXYZXPMZLDQWI5";
const secretKeyId = "o/3LZ+yBSkz1qAKOBkaQ09L2r2inEbIug0fOlxZ1";
const bucketRegion = "us-east-1";
const bucketName = "scriptcase-allison";

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