// import { BlobServiceClient } from '@azure/storage-blob';

// Replace with your connection string and container nameconst { BlobServiceClient } = require("@azure/storage-blob");
// const containerName = "video";
// const connectionString = "UseDevelopmentStorage=true;DevelopmentStorageProxyUri=http://localhost:10000"; // Azurite endpoint
// const blobServiceClient = new BlobServiceClient(connectionString);

// Use the blobServiceClient to interact with your Azurite blob storage

// async function uploadToAzure(file){

//   try {
//     if (!file) {
//       return res.status(400).send('No video file uploaded');
//     }

//     const videoFile = file; // Assuming the video file is named 'video' in the request

//     // Create a blob name with UUID to avoid conflicts
//     const blobName = `${uuidv4()}.${videoFile.name.split('.').pop()}`;

//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blobClient = containerClient.getBlobClient(blobName);

//     // Upload the video stream to Azure Blob Storage
//     await blobClient.uploadStream(videoFile.data, videoFile.size);

//     return blobName

//   } catch (error) {
//     console.error('Error uploading video:', error);
    
//     return -1;
//   }
// }

exports.upload = async (req, res, next) => {
    try {
        const { file, title, description } = req.body;
        if (!file || !title || !description) {
            throw new Error('Please Provide all details');
        }

        // var oid = uploadToAzure(file);

        // if(oid === -1)  throw new Error('Internal Error occured!')

        const user = await prisma.video.create({
            data: {
                title : title,
                description : description,
                views : 0,
                file : file,
                createdAt : Date.UTC
            }
        });

        cookieToken(user, res);
        res.status(200).json({ message: 'Video uploaded successfully!' });
    } catch (error) {
        next(error);
    }
};
