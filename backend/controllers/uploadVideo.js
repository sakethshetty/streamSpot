const prisma = require('../prisma/index');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// it's all Google Drive API credentials
const CLIENT_ID = '796518376376-h1akdhreatbcrh9kiglvm2veoggit2pf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04ddaRyUdGrpyCgYIARAAGAQSNwF-L9IrJH6p2ni9PsuUDtNy-JAaCv0-8qPqFtnarXq_FUOpKmFvNoLu0tSxl9uDn5AJOQ-w7VY';


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

//it is Function to upload file to Google Drive
async function uploadVideo(filePath) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: path.basename(filePath),
                mimeType: 'video/mp4' 
            },
            media: {
                mimeType: 'video/mp4',
                body: fs.createReadStream(filePath),
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw new Error("Failed to upload file to Google Drive");
    }
}

// it is a Function to generate sharable link for the video uploaded video into Gdrive which helps to store the link into MONGO DB database
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
        console.log(error.message);
        throw new Error("Failed to generate sharable link");
    }
}

// it is a function to delete a video
exports.deleteVideo = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await prisma.video.delete({
            where: { id: parseInt(id) }
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// it is a function to get all videos
exports.getAllVideos = async (req, res, next) => {
    try {
        const result = await prisma.video.findMany();
        res.json(result);
    } catch (error) {
        next(error);
    }
}
