import 'package:flutter/material.dart';


class UserHomeScreen extends StatefulWidget {
  @override
  State<UserHomeScreen> createState() => _UserHomeScreenState();
}

class _UserHomeScreenState extends State<UserHomeScreen> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.yellow,
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: Text('User Home Page'),
      ),
    /*  body: ElevatedButton(
        onPressed: () {
          // pop off current screen
          Navigator.pop(context);
        },
        child: Text('Back'),
      ),*/
    );
  }
}