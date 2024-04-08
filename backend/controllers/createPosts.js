const prisma = require('../prisma/index');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

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

//it is function to upload file to Google Drive here used the Gdrive API to store the Posts
async function uploadFile(filePath) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: path.basename(filePath),
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath),
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw new Error("Failed to upload file to Google Drive");
    }
}

// it is function to generate sharable link where by using this link,we stored this sharable link into the MONGO DB databse 
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

exports.createPost = async (req, res, next) => {
    try {
        const { title, content, authorId, filePath } = req.body;

        // Upload file to Google Drive
        const fileData = await uploadFile(filePath);
        const { id: fileId } = fileData;

        // here we called the function to generate the URL
        const fileLink = await generatePublicUrl(fileId);

        //creating the posts
        const result = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl: fileLink.webViewLink, 
                author: { connect: { id: authorId } }
            }
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

exports.updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const result = await prisma.post.update({
            where: { id: id },
            data: {
                title,
                content
            }
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

exports.deletePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await prisma.post.delete({
            where: { id: id }
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const result = await prisma.post.findMany();
        res.json(result);
    } catch (error) {
        next(error);
    }
}
