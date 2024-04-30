import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class VideoApp extends StatefulWidget {
  final String videoUrl;

  const VideoApp({super.key, required this.videoUrl});

  @override
  VideoAppState createState() => VideoAppState();
}

class VideoAppState extends State<VideoApp> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(Uri.parse("https://drive.google.com/uc?export=download&id=1sXD0Y9fiQpt0Mbf8qJiWkpiqBSXYZFWw"))
      ..initialize().then((_) {
        // Ensure the first frame is shown after the video is initialized, even before the play button has been pressed.
        setState(() {});
      });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Video Player')),
        body: Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [
    Expanded(
      flex: 4,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Center(
            child: _controller.value.isInitialized
                ? AspectRatio(
                    aspectRatio: _controller.value.aspectRatio,
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _controller.value.isPlaying
                              ? _controller.pause()
                              : _controller.play();
                        });
                      },
                      child: VideoPlayer(_controller),
                    ),
                  )
                : const CircularProgressIndicator(),
          ),
          if (!_controller.value.isPlaying)
            IconButton(
              onPressed: () {
                setState(() {
                  _controller.value.isPlaying
                      ? _controller.pause()
                      : _controller.play();
                });
              },
              icon: const Icon(
                Icons.play_arrow,
                size: 64.0,
                color: Colors.white,
              ),
            ),
        ],
      ),
    ),
    Expanded(
      flex: 2,
      child: SingleChildScrollView(
        child:
            // Comments Section (Replace with actual comments widget)
            Container(
              padding: const EdgeInsets.all(16.0),
              color: const Color.fromARGB(255, 237, 226, 226),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Comments',
                    style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8.0),
                  // Sample Comment
                  ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.blue,
                      child: Icon(Icons.person, color: Colors.white),
                    ),
                    title: Text('User123'),
                    subtitle: Text('Great video!'),
                  ),
                  // Add more comments here...
                ],
              ),
            ),
              ),
            ),
          ],
        ),
      );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
