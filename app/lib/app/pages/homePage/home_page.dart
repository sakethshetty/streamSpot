import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:app/app/widgets/bottom_nav_bar.dart';
import 'package:app/app/pages/userDetailsPage/user_detail_page.dart';
import 'package:app/app/pages/homePage/video_list_page.dart';
import 'package:app/app/widgets/drawer.dart';
// import 'dart:convert';


class HomePage extends StatefulWidget {

  
  const HomePage(this.jwt, this.payload, {super.key});

  final String jwt;
  final Map<String, dynamic> payload;

  factory HomePage.fromBase64(String jwt) {
  try {
    final payload = json.decode(
      utf8.decode(
        base64.decode(base64.normalize(jwt.split(".")[1])),
      ),
    );
    return HomePage(jwt, payload);
  } catch (e) {
    // Handle the error (e.g., return a default instance or show an error message)
    return const HomePage("default_jwt", {});
  }
}



  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      print(_pages.length);
      _selectedIndex = index;
    });
  }

  // List of pages for navigation
  final List<Widget> _pages = [
    const VideoListPage(),
    const AccountDetailsPage(),// VideoListPage is now one of the pages
    // Add other pages here
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('StreamSpot'),
        backgroundColor: Colors.redAccent,
      ),
      drawer: const CustomDrawer(),
      body: Center(
        child: _pages.elementAt(_selectedIndex), // Display the page based on the index
      ),
      bottomNavigationBar: CustomBottomNavBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}