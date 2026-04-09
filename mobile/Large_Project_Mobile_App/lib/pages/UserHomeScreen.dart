import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';



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
    final data = context.watch<GlobalData>(); // rebuild widget if global data changes
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