import 'package:flutter/material.dart';
import 'package:app/app/widgets/bottom_nav_bar.dart';
import 'package:app/app/pages/userDetailsPage/user_detail_page.dart';
import 'package:app/app/pages/homePage/video_list_page.dart';
import 'package:app/app/widgets/drawer.dart';
// import 'dart:convert';


class HomePage extends StatefulWidget {
  const HomePage({super.key});
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
    const VideoListPage(), // VideoListPage is now one of the pages
    const AccountDetailsPage()
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