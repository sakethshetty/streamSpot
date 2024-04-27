import 'dart:convert';

import 'package:app/app/pages/homePage/home_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const storage = FlutterSecureStorage();
const SERVER = "http://10.0.2.2:5000/api/";

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  Future<String> get jwtOrEmpty async {
    var jwt = await storage.read(key: "jwt");
    if (jwt == null) return "";
    return jwt;
  }

  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  void displayDialog(context, title, text) => showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(title: Text(title), content: Text(text)),
      );

  Future<String?> attemptLogIn(String username, String password) async {
    try {
    var res = await http.post(Uri.parse('http://10.0.2.2:5000/api/login'),
        body: {"email": _email, "password": password});
    if (res.statusCode == 200) {
      final Map<String, dynamic> responseJson = json.decode(res.body);
      final String token = responseJson['token']; // Extract the token
      return token;
    }
    return null;
  } catch (e) {
    print("Error during login: $e");
    return null;
  }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Form(
        key: _formKey,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value?.isEmpty ?? false) {
                    return 'Please enter your email';
                  }
                  return null;
                },
                onSaved: (value) => _email = value!,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value?.isEmpty ?? false) {
                    return 'Please enter your password';
                  }
                  return null;
                },
                onSaved: (value) => _password = value!,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: ElevatedButton(
                onPressed: () async {
                  _formKey.currentState?.save();
                  if(_formKey.currentState!.validate()){
                    var jwt = await attemptLogIn(_email, _password);
                    if (jwt != null) {
                      storage.write(key: "jwt", value: jwt);
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => HomePage.fromBase64(jwt)));
                    } else {
                      displayDialog(context, "An Error Occurred",
                          "No account was found matching that username and password");
                    }
                    }
                  },
                child: const Text('Login'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  const Text('Don\'t have an account? '),
                  TextButton(
                    onPressed: () {
                      // Navigate to the login page
                      Navigator.of(context).pushReplacementNamed('/signup');
                    },
                    child: const Text('SignUp'),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
