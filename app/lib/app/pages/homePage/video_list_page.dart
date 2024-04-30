import 'dart:convert';

import 'package:app/app/pages/homePage/player.dart';
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
    final response = await http.get(
        Uri.parse('http://10.0.2.2:5000/api/video/getAllVideosWithComments'));

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
          'videourl': videoJson['url']
        };
      }).toList();
      setState(() {});
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
        final videoUrl =
            video['videourl'] as String; // Assuming you have a 'videourl' field

        return GestureDetector(
            onTap: () {
              // Navigate to VideoApp page and pass the videoUrl
              Navigator.of(context).push(MaterialPageRoute(
                builder: (context) => VideoApp(videoUrl: videoUrl),
              ));
            },
            child: ListTile(
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              leading: ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: Image.network(
                  "https://drive.google.com/uc?export=download&id=1r-jpH4S9f8AeKc3QypmF6PPWl-Fv5Q4s",
                  width: 80,
                  height: 60,
                  fit: BoxFit.cover,
                ),
              ),
              title: Text(
                title,
                style: const TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    description ?? '',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  Row(
                    children: [
                      Icon(Icons.remove_red_eye,
                          size: 16.0, color: Colors.grey[600]),
                      const SizedBox(width: 4.0),
                      Text(
                        likes.toString(),
                        style: TextStyle(
                          fontSize: 12.0,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.thumb_up, color: Colors.blue),
                  Text(
                    likes.toString(),
                    style: TextStyle(
                      fontSize: 12.0,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ));
      },
    );
  }
}
