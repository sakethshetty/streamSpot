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
async function uploadFileToDrive(fileStream, fileName, mimeType) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fileStream,
            },
        });
        return response.data.id;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw new Error('Failed to upload file to Google Drive');
    }
}

// Function to upload video to Google Drive
exports.uploadVideo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const videoFileStream = req.files.video[0].stream;
        const thumbnailFileStream = req.files.thumbnail[0].stream;
        const videoName = req.files.video[0].originalname;
        const thumbnailName = req.files.thumbnail[0].originalname;

        const videoFileId = await uploadFileToDrive(videoFileStream, videoName, 'video/mp4');
        const thumbnailFileId = await uploadFileToDrive(thumbnailFileStream, thumbnailName, 'image/jpeg');

        // generating sharable link for the uploaded video and thumbnail
        const videoPublicUrl = await generatePublicUrl(videoFileId);
        const thumbnailPublicUrl = await generatePublicUrl(thumbnailFileId);

        
        const video = await prisma.video.create({
            data: {
                title,
                description,
                url: videoPublicUrl.webViewLink,
                thumbnail: thumbnailPublicUrl.webViewLink,
            }
        });

        res.json({ videoUrl: videoPublicUrl.webViewLink, thumbnailUrl: thumbnailPublicUrl.webViewLink });
    } catch (error) {
        console.error("Error during video upload:", error);
        next(error);
    }
};

// Function to generate sharable link for the uploaded file
async function generatePublicUrl(fileId) {
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        return result.data;
    } catch (error) {
        console.error(error.message);
        throw new Error("Failed to generate sharable link");
    }
}


//it is a function to delete a video
exports.deleteVideo = async (req, res, next) => {

    const { id } = req.params;
    try {
        const result = await prisma.video.delete({
            where: { id: id }  
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