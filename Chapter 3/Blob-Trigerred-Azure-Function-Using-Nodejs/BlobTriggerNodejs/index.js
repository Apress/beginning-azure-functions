var storage = require('azure-storage');
var URI = require('urijs');
const stream = require('stream');
const Jimp = require('jimp');
var async = require('async');

module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

    var blobService = storage.createBlobService(process.env.AzureWebJobsStorage);
    var blockBlobName = context.bindingData.name;
    const widthInPixels = 60;
    const heightInPixels = 60;
    const blobContainerName = 'output-blob';
    async.series(
      [
        function (callback) {
          blobService.createContainerIfNotExists(
            blobContainerName,
            null,
            (err, result) => {
              callback(err, result)
            })
        },
        function (callback) {
          var readBlobName = generateSasToken('input-blob', blockBlobName, null)
          Jimp.read(readBlobName.uri).then((thumbnail) => {
  
            thumbnail.resize(widthInPixels, heightInPixels);
  
            thumbnail.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
  
              const readStream = stream.PassThrough();
              readStream.end(buffer);
  
              blobService.createBlockBlobFromStream(blobContainerName, blockBlobName, readStream, buffer.length, null, (err, blobResult) => {
                callback(err, blobResult);
              });
            });
          });
        }
      ],
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
};

function generateSasToken(container, blobName, permissions) {
    var connString = process.env.AzureWebJobsStorage;
    var blobService = azure.createBlobService(connString);
  
    // Create a SAS token that expires in an hour
    // Set start time to five minutes ago to avoid clock skew.
    var startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 5);
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60);
  
    permissions = permissions || storage.BlobUtilities.SharedAccessPermissions.READ;
  
    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: permissions,
            Start: startDate,
            Expiry: expiryDate
        }
    };
    
    var sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
    
    return {
        token: sasToken,
        uri: blobService.getUrl(container, blobName, sasToken, true)
    };
  }