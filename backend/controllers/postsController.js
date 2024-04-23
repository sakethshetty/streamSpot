const prisma = require('../prisma/index');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

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

//it is function to Create and upload Post to Google Drive by using the Gdrive API to store the Posts
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

exports.getAllPostsWithComments = async (req, res, next) => {
    try {
        // Fetch all videos along with their related comments
        const postsWithComments = await prisma.post.findMany({
            include: {
                postcomments: {
                    include: {
                        user: true,
                    }
                },
            },
        });
        res.json(postsWithComments);
    } catch (error) {
        next(error);
    }
};
