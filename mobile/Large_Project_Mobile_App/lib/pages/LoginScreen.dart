import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue,
      body: MainPage(),
    );
  }
}

class MainPage extends StatefulWidget {
  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  String message = "This is a message";
  String newMessageText = "";
  String loginName = "";
  String password = "";

  void changeText() {
    setState(() {
      message = newMessageText;
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 200,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center, // center column contents vertically
          crossAxisAlignment: CrossAxisAlignment.center, // center column contents horizontally
          children: <Widget> [
            Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    '$message',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.black,
                    ),
                  ),
                ),
              ],
            ),
            Row (
              children: <Widget> [
                Container(
                  width: 200,
                  child: TextField(
                    onChanged: (text) {
                      loginName = text;
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Login Name',
                      hintText: 'Enter Your Login Name',
                    ),
                  ),
                )
              ],
            ),
            Row(
              children: <Widget> [
                Container(
                  width: 200,
                  child: TextField(
                    obscureText: true,
                    onChanged: (text) {
                      password = text;
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      labelText: 'Password',
                      hintText: 'Enter Your Password',
                    ),
                  ),
                ),
              ],
            ),
            Row(
              children: <Widget> [
                ElevatedButton(
                  onPressed: () async {
                    newMessageText = "";
                    changeText();
                    String payload = '{"Username":"${loginName.trim()}", "Password":"${password.trim()}"}';
                    var userId = -1;
                    var jsonObject;

                    try {
                      String url = 'http://leandrovivares.com/api/login';
                      String ret = await AppData.getJSON(url, payload);
                      print(ret);
                      jsonObject = json.decode(ret);
                      print(jsonObject);
                      //userId = jsonObject['id'];
                    }
                    catch (e) {
                      newMessageText = e.toString();
                      changeText();
                      return;
                    }
/*
                    if (userId <= 0) {
                      newMessageText = "Incorrect Login/Password";
                      changeText();
                    }
                    else {
                      GlobalData.userId = userId;
                      GlobalData.firstName = jsonObject['firstName'];
                      GlobalData.lastName = jsonObject['lastName'];
                      GlobalData.loginName = loginName;
                      GlobalData.password = password;
                      Navigator.pushNamed(context, '/user_home');
                    }
*/
                    if (jsonObject['message'] == 'Login successful') {

                      // placeholder nagivation for testing
                      Navigator.pushNamed(context, '/user_home');
                    }
                    else {

                      newMessageText = 'Invalid Username or Password';
                      changeText();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.brown[50],
                    foregroundColor: Colors.black,
                    padding: EdgeInsets.all(8.0),
                  ),
                  child: Text(
                    'Do Login',
                    style: TextStyle(
                      fontSize: 14.0,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }


}