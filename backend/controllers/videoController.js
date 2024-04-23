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
    const { filePath, title, description, channelId } = req.body;

    console.log("Uploading file from path:", filePath);

    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log("File not found at the specified file path:", filePath);
            return res.status(404).json({ error: 'File not found at the specified file path' });
        }

        // Create read stream for file
        const fileStream = fs.createReadStream(filePath);

        console.log("File stream created");

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: path.basename(filePath),
                mimeType: 'video/mp4',
            },
            media: {
                mimeType: 'video/mp4',
                body: fileStream,
            },
        });

        console.log("File uploaded to Google Drive");

        // Generate sharable link for the uploaded video
        const fileId = response.data.id;
        const publicUrl = await generatePublicUrl(fileId);
        const { webViewLink, webContentLink } = publicUrl;

        console.log("Sharable link generated:", webViewLink);

        // Store video details in MongoDB
        const video = await prisma.video.create({
            data: {
                title,
                description,
                url: webViewLink,
                channelId,
            }
        });

        console.log("Video details stored in MongoDB");

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