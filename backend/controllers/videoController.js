const prisma = require('../prisma/index');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// it's all Google Drive API credentials
const CLIENT_ID = '796518376376-e24tlbe3i51pgviolmk7o7btaef9esh7.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Tew6QKZPoU3CgYIARAAGAQSNwF-L9IrDrQBqHpzjbef2TrBzRJnRv3ShC8P2fBpGj2daeP5rEnL6Da_4LYYhG2y59AXBtNp3iM';


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

// Function to upload file to Google Drive
exports.uploadVideo = async (req, res, next) => {
    const { videoFilePath, thumbnailFilePath, title, description,} = req.body;
    //now here neglectd the channelId ... later we have to take as input parameter
    try {
        // Check if files exist
        if (!fs.existsSync(videoFilePath) || !fs.existsSync(thumbnailFilePath)) {
            return res.status(404).json({ error: 'One or more files not found at the specified file paths' });
        }

        // Create read streams for video and thumbnail files
        const videoFileStream = fs.createReadStream(videoFilePath);
        const thumbnailFileStream = fs.createReadStream(thumbnailFilePath);

        // it is for uploading video file to Google Drive
        const videoResponse = await drive.files.create({
            requestBody: {
                name: path.basename(videoFilePath),
                mimeType: 'video/mp4',
            },
            media: {
                mimeType: 'video/mp4',
                body: videoFileStream,
            },
        });
        console.log("video uploaded to Google Drive");
        //it is for Uploading thumbnail image to Google Drive
        const thumbnailResponse = await drive.files.create({
            requestBody: {
                name: path.basename(thumbnailFilePath),
                mimeType: 'image/jpeg', // Adjust MIME type if needed
            },
            media: {
                mimeType: 'image/jpeg',
                body: thumbnailFileStream,
            },
        });
        
        console.log("photo uploaded to Google Drive");
        

        // Generate sharable links for the uploaded video and thumbnail
        const videoFileId = videoResponse.data.id;
        const thumbnailFileId = thumbnailResponse.data.id;
        const videoPublicUrl = await generatePublicUrl(videoFileId);
        const thumbnailPublicUrl = await generatePublicUrl(thumbnailFileId);    

        console.log("video Sharable link generated:", videoPublicUrl);
        console.log("tumbnail Sharable link generated:", thumbnailPublicUrl);
        
        // Store video details in MongoDB
        const video = await prisma.video.create({
            data: {
                title,
                description,
                url: videoPublicUrl.webViewLink,
                thumbnail: thumbnailPublicUrl.webViewLink,
                //channelId,
            }
        });

        // Send response with created video data
        res.json(video);
    } catch (error) {
        // Handle errors
        console.error("Error during video upload:", error);
        next(error);
    }
};

// Function to generate sharable link for the uploaded video
async function generatePublicUrl(fileId) {
    try {
        // Set permissions for the file
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get sharable link for the file
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        // Return the link data
        return result.data;
    } catch (error) {
        // Handle errors
        console.error(error.message);
        throw new Error("Failed to generate sharable link");
    }
}




//it is a function to delete a video
exports.deleteVideo = async (req, res, next) => {
    //console.log("DDD***");

    const { id } = req.params;
    try {
        const result = await prisma.video.delete({
            where: { id: id }  // Pass the raw ID if it's an ObjectId
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// it is a function to get all videos
exports.getAllVideosWithComments = async (req, res, next) => {
    try {
        // Fetch all videos along with their related comments
        const videosWithComments = await prisma.video.findMany({
            include: {
                videocomments: {
                    include: {
                        user: true,
                    }
                },
            },
        });
        res.json(videosWithComments);
    } catch (error) {
        next(error);
    }
};