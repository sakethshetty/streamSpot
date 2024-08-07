import 'package:app/app/pages/login_page/login_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
// Drawer Widget
class CustomDrawer extends StatefulWidget {
  const CustomDrawer({Key? key}) : super(key: key);

  @override
  CustomDrawerState createState() => CustomDrawerState();
}

class CustomDrawerState extends State<CustomDrawer> {
  late Future<bool> isLoggedIn;

  @override
  void initState() {
    super.initState();
    // Initialize isLoggedIn here with your logic to check logged-in status
    isLoggedIn = checkLoggedIn();
  }

  Future<bool> checkLoggedIn() async {
    
    var tok = await storage.read(key: 'jwt');
    if(tok != null)   return true;
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Text(
              'Menu',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          FutureBuilder<bool>(
            future: isLoggedIn,
            builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasData && snapshot.data!) {
                  // If the user is logged in, show the logout option
                  return ListTile(
                    leading: const Icon(Icons.exit_to_app),
                    title: const Text('Logout'),
                    onTap: () async {
                      // Implement logout logic
                      var tok = await storage.read(key: "jwt");
                      var res = await http.get(Uri.parse("http://10.0.2.2:5000/api/logout"), headers : {
                        'Authorization' : 'Bearer $tok',
                      });
                      print(res.statusCode);
                      if(res.statusCode == 200){

                        await storage.delete(key: "jwt");

                        Navigator.of(context).pushReplacementNamed('/login');
                      }
                    },
                  );
                } else {
                  // If the user is not logged in, show the login option
                  return ListTile(
                    leading: const Icon(Icons.account_circle),
                    title: const Text('Login'),
                    onTap: () {
                      // Navigate to the login page
                      Navigator.of(context).pushNamed('/login');
                    },
                  );
                }
              } else {
                // While checking the login state, show a progress indicator
                return const Center(child: CircularProgressIndicator());
              }
            },
          ),
        ],
      ),
    );
  }
}
