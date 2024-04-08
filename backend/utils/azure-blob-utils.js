const { BlobServiceClient } = require("@azure/storage-blob");

const connectionString = "UseDevelopmentStorage=true;DevelopmentStorageProxyUri=http://localhost:10000";

const blobServiceClient = new BlobServiceClient(connectionString);

module.exports = { blobServiceClient };
