import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';


// widget for the login screen
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
      appBar: AppBar(
        title: Text(
          'COP 4331 Group 7 Large Project',
          textAlign: TextAlign.center,
        ),
        automaticallyImplyLeading: false,
      ),
      backgroundColor: Colors.blue,
      body: LoginPage(),
    );
  }
}

// widget for the login page
class LoginPage extends StatefulWidget {

  @override
  State<LoginPage> createState() => _LoginPageState();
}

// widget for building the login page
class _LoginPageState extends State<LoginPage> with RouteAware {
  String message = "";
  String newMessageText = "";
  // controllers for textfields (objects contain the text inputs)
  late TextEditingController loginController;
  late TextEditingController passwordController;

  @override
  void initState() {
    super.initState();
    loginController = TextEditingController();
    passwordController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // route observer used to clear previous textfields when going back to login page
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    // route observer used to clear previous textfields when going back to login page
    routeObserver.unsubscribe(this);
    loginController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  void didPopNext() {
    // called when coming back from another page
    setState(() {
      message = "";
      newMessageText = "";
      loginController.clear();
      passwordController.clear();
    });
  }

  // method to change the state of select widget attributes when called
  void changeText() {
    setState(() {
      message = newMessageText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 250,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start, // center column contents vertically
          crossAxisAlignment: CrossAxisAlignment.center, // center column contents horizontally
          children: <Widget> [
            SizedBox(height: 150.0),
            // row for login instruction
            Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    'PLEASE LOG IN',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
              ],
            ),
            // row (conditional) for potential error message
            if (message != '') Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    '$message',
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.black,
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            // row for login name textfield
            Row (
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: loginController,
                 /*   onChanged: (text) {
                      loginName = text;
                    },*/
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Username',
                    ),
                  ),
                )
              ],
            ),
            // row for password textfield
            Row(
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: passwordController,
                    obscureText: true,
               /*     onChanged: (text) {
                      password = text;
                    },*/
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Password',
                    ),
                  ),
                ),
              ],
            ),
            // row for login button
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget> [
                LoginButton(
                  onPressed: () async {
                    newMessageText = "";
                    changeText();
                    String payload = '{"Username":"${loginController.text.trim()}", "Password":"${passwordController.text.trim()}"}';
                    var userId = -1;
                    var jsonObject;

                    try {
                      String url = 'http://leandrovivares.com/api/login';
                      String ret = await AppData.getJSON(url, payload);
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
                    if (jsonObject.containsKey('message')) {
                      if (jsonObject['message'] == 'Login successful') {
                        // navigate to user home page
                        Navigator.pushNamed(context, '/user_home');
                      }
                      else {
                        newMessageText = jsonObject['message'];
                        changeText();
                      }
                    }
                    else {
                      newMessageText = 'Unknown Error!';
                      changeText();
                    }
                  },
                ),
              ],
            ),
            // row for registration page link
            Row(
              children: [
                Expanded(
                  child: RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      style: TextStyle(color: Colors.black),
                      children: [
                        TextSpan(text: "Don't have an account? Click "),
                        TextSpan(
                          text: "here",
                          style: TextStyle(
                            color: Colors.indigo[900],
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              Navigator.pushNamed(context, '/register');
                            },
                        ),
                        TextSpan(text: " to make one!"),
                      ],
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

// custom class for the login button
class LoginButton extends StatelessWidget {
  // function initialized from constructor
  final VoidCallback onPressed;
  // constructor
  const LoginButton({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
        ),
        backgroundColor: Colors.brown[50],
        foregroundColor: Colors.black,
        padding: EdgeInsets.all(8.0),
      ),
      child: Text(
        'Login',
        style: TextStyle(fontSize: 14.0),
      ),
    );
  }
}

