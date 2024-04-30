import 'package:flutter/material.dart';

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
    return UserAccount(username: 'username', email: 'email', videos: ['video1', 'video2']);
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
      ],
    );
  }
}

// UserAccount model
class UserAccount {
  final String username;
  final String email;
  final List<String> videos;

  UserAccount({required this.username, required this.email, required this.videos});
  // Add any other necessary fields and methods
}