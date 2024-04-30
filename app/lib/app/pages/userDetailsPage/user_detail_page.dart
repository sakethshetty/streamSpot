import 'dart:io';

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class AccountDetailsPage extends StatefulWidget {
  const AccountDetailsPage({super.key});

  @override
  AccountDetailsPageState createState() => AccountDetailsPageState();
}

class AccountDetailsPageState extends State<AccountDetailsPage> {
  late Future<UserAccount> userAccount;

  @override
  void initState() {
    super.initState();
    userAccount = fetchUserAccount();
  }

  Future<UserAccount> fetchUserAccount() async {
    // Your existing fetchUserAccount logic
    return UserAccount(
        username: 'username', email: 'email', videos: ['video1', 'video2']);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserAccount>(
      future: userAccount,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          if (snapshot.hasData) {
            return AccountDetails(userAccount: snapshot.data!);
          } else if (snapshot.hasError) {
            return Text("${snapshot.error}");
          }
        }
        // By default, show a loading spinner.
        return const CircularProgressIndicator();
      },
    );
  }
}

// AccountDetails widget
class AccountDetails extends StatelessWidget {
  final UserAccount userAccount;

  const AccountDetails({super.key, required this.userAccount});

  Future<void> uploadVideo(File videoFile, File thumbnailFile) async {
  var url = Uri.parse('http://10.0.2.2:5000/api/video/uploadVideo'); // Replace with your server URL
  var request = http.MultipartRequest('POST', url);

  // Add video and thumbnail as multipart files
  request.files.add(await http.MultipartFile.fromPath('video', videoFile.path, contentType: MediaType('video', 'mp4')));
  request.files.add(await http.MultipartFile.fromPath('thumbnail', thumbnailFile.path, contentType: MediaType('image', 'jpeg')));

  // Add title and description fields (optional, modify as needed based on your API)
  request.fields['title'] = 'My Video Title';
  request.fields['description'] = 'My Video Description';

  var response = await request.send();

  if (response.statusCode == 200) {
    print('Video uploaded successfully!');
    // Handle successful upload response (e.g., navigate to success screen)
  } else {
    print('Error uploading video: ${response.reasonPhrase}');
    // Handle upload errors (e.g., display error message to user)
  }
}


  @override
  Widget build(BuildContext context) {
    // Your existing AccountDetails build method
    return Column(
      children: <Widget>[
        ListTile(
          title: const Text('Username'),
          subtitle: Text(userAccount.username),
        ),
        ListTile(
          title: const Text('Email'),
          subtitle: Text(userAccount.email),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: userAccount.videos.length,
            itemBuilder: (context, index) {
              return ListTile(
                leading: const Icon(Icons.video_library),
                title: Text('Video ${index + 1}'),
                subtitle: Text(userAccount.videos[index]),
              );
            },
          ),
        ),
        ElevatedButton(
          onPressed: () async {
            FilePickerResult? result = await FilePicker.platform.pickFiles();

            if (result != null) {
              // Handle the selected file here
              File file = File(result.files.single.path!);
              uploadFile(file);
            }
          },
          child: const Text('Select File'),
        )
      ],
    );
  }
}

// UserAccount model
class UserAccount {
  final String username;
  final String email;
  final List<String> videos;

  UserAccount(
      {required this.username, required this.email, required this.videos});
  // Add any other necessary fields and methods
}
