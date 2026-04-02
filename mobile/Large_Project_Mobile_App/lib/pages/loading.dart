import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';

class Loading extends StatefulWidget {
  @override
  State<Loading> createState() => _LoadingState();
}

class _LoadingState extends State<Loading> {

  late Map<String, dynamic> response;

  @override
  void initState() {
    super.initState();
    pingTest();
  }

  void pingTest() async {
    response = await PingTest.getPing('http://leandrovivares.com/api/ping');
    print(response);
    print(response.runtimeType);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[900],
      body: SafeArea(
        child: Column(
          children: <Widget> [
            Text('Loading Page'),
          ],
        )
      ),
    );
  }
}