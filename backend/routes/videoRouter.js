const express = require('express');
const router = express.Router();
const { uploadVideo, deleteVideo,getAllVideosWithComments} = require('../controllers/videoController');
const isLogedIN = require('../middleware/isLoggedIn');

router.route('/video/uploadVideo').post(uploadVideo);
router.route('/video/deleteVideo/:id').delete(isLogedIN,deleteVideo);
router.route('/video/getAllVideosWithComments').get(getAllVideosWithComments);

module.exports = router