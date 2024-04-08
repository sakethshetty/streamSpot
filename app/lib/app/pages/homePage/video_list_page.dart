import 'package:flutter/material.dart';

class VideoListPage extends StatefulWidget {
  const VideoListPage({super.key});

  @override
  VideoListPageState createState() => VideoListPageState();
}

class VideoListPageState extends State<VideoListPage> {
  List videos = [];

  @override
  void initState() {
    super.initState();
    fetchVideos();
  }

  Future<void> fetchVideos() async {
    // Your existing fetchVideos logic
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: videos.length,
      itemBuilder: (context, index) {
        var video = videos[index];
        return ListTile(
          title: Text(video),
          // Add onTap or other event handling as needed
        );
      },
    );
  }
}