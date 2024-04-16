const prisma = require('../prisma/index');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// it's all Google Drive API credentials
const CLIENT_ID = '796518376376-h1akdhreatbcrh9kiglvm2veoggit2pf.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04ddaRyUdGrpyCgYIARAAGAQSNwF-L9IrJH6p2ni9PsuUDtNy-JAaCv0-8qPqFtnarXq_FUOpKmFvNoLu0tSxl9uDn5AJOQ-w7VY'

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
exports.uploadVideo = async (req, res, next) => {
    const { filePath, title, description, channelId } = req.body;

    console.log("Uploading file from path:", filePath);

    try {
        const fileStream = fs.createReadStream(filePath);
        const response = await drive.files.create({
            requestBody: {
                name: path.basename(filePath),
                mimeType: 'video/mp4' 
            },
            media: {
                mimeType: 'video/mp4',
                body: fileStream,
            },
        });

        const fileId = response.data.id;
        const publicUrl = await generatePublicUrl(fileId);
        const { webViewLink, webContentLink } = publicUrl;

        const video = await prisma.video.create({
            data: {
                title,
                description,
                url: webViewLink,
                channelId,
            }
        });
        res.json(video);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'File not found at the specified file path' });
        } else {
            next(error);
        }
    }
};


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
exports.getAllVideos = async (req, res, next) => {
    //console.log("<AIN***");
    try {
        const result = await prisma.video.findMany();
        res.json(result);
    } catch (error) {
        next(error);
    }
}