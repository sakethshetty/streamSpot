import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class VideoListPage extends StatefulWidget {
  const VideoListPage({super.key});

  @override
  VideoListPageState createState() => VideoListPageState();
}

class VideoListPageState extends State<VideoListPage> {
  List<Map<String, dynamic>> videos = [];

  @override
  void initState() {
    super.initState();
    fetchVideos();
  }

  Future<void> fetchVideos() async {
  // Make an API call to get the list of videos
  final response = await http.get(Uri.parse('http://10.0.2.2:5000/api/video/getAllVideosWithComments'));

  print(response.statusCode);
  if (response.statusCode == 200) {
    final List<dynamic> videoData = json.decode(response.body);
    videos = videoData.map((videoJson) {
      return {
        'title': videoJson['title'],
        'description': videoJson['description'],
        'thumbnail': videoJson['thumbnail'],
        'likes': videoJson['likes'],
        'dislikes': videoJson['dislikes'],
      };
    }).toList();
    setState(() {
      
    });
  } else {
    // Handle error (e.g., show an error message)
    print('Error fetching videos: ${response.statusCode}');
  }
}


  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: videos.length,
      itemBuilder: (context, index) {
        final video = videos[index];
        final title = video['title'] as String;
        final description = video['description'] as String?;
        final thumbnail = video['thumbnail'] as String?;
        final likes = video['likes'] as int;
        final dislikes = video['dislikes'] as int;

        return ListTile(
          title: Text(title),
          subtitle: Text(description ?? ''),
          leading: thumbnail != null
              ? Image.network(thumbnail)
              : const Icon(Icons.video_library), // Placeholder icon
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.thumb_up),
              Text(likes.toString()),
              const SizedBox(width: 10),
              const Icon(Icons.thumb_down),
              Text(dislikes.toString()),
            ],
          ),
          // Add onTap or other event handling as needed
        );
      },
    );
  }
}