import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


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
    final data = context.watch<GlobalData>(); // rebuild widget if global data changes
    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            Text(
              'COP 4331 Group 7 Large Project',
              textAlign: TextAlign.center,
            ),
            Text(
              'Welcome to KnightRate',
              textAlign: TextAlign.center,
            ),
          ],
        ),
        automaticallyImplyLeading: true,
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
  String message1 = ""; // message to describe errors
  String message2 = ""; // message to notify that temporary password was sent
  String newMessageText = "";
  String tempPasswordMessage = "";
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
      message1 = "";
      newMessageText = "";
      tempPasswordMessage = "";
      loginController.clear();
      passwordController.clear();
    });
  }

  // method to change the state of select widget attributes when called
  void changeText() {
    setState(() {
      message1 = newMessageText;
      message2 = "";
    });
  }

  // method to change the state of select widget attributes when called
  void changeTempPasswordMessage() {
    setState(() {
      message1 = "";
      message2 = tempPasswordMessage;
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
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
              ],
            ),
            // row (conditional) for potential error message
            if (message1 != '') Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    '$message1',
                    style: TextStyle(
                      fontSize: 16.0,
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
            SizedBox(height: 10.0),
            // row for login button
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget> [
                SizedBox(
                  width: 100.0,
                  child: LoginButton(
                    onPressed: () async {
                      newMessageText = "";
                      changeText();
                      String username = loginController.text.trim();
                      String password = passwordController.text.trim();
                      String payload = '{"Username":"${loginController.text.trim()}", "Password":"${passwordController.text.trim()}"}';

                      print('password = ${username}');
                      print('password = ${password}');
                      print('payload = ${payload}');

                      var jsonObject;

                      try {
                        String url = 'http://leandrovivares.com/api/login';
                        String ret = await AppDataPost.getJSON(url, payload);
                        jsonObject = json.decode(ret);
                        print('jsonObject = ${jsonObject}');
                      }
                      catch (e) {
                        newMessageText = e.toString();
                        changeText();
                        return;
                      }

                      // check response object to verify successful login
                      if (jsonObject.containsKey('message')) {
                        if (jsonObject['message'] == 'Login Successful') {
                          // set token after successful login
                          context.read<GlobalData>().setToken(jsonObject['token']);

                          // decode userId from JWT token
                          final parts = context.read<GlobalData>().token.split('.');
                          final payload = parts[1];
                          final decoded = utf8.decode(base64Url.decode(base64Url.normalize(payload)));
                          final map = jsonDecode(decoded);

                          // set global variable for userId upon successful login
                          context.read<GlobalData>().setUserId(map['userId']);

                          // navigate to home page while removing everything from the stack before pushing the new route
                          Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
                          print('userId global: ${context.read<GlobalData>().userId}');
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
                ),
              ],
            ),
            SizedBox(height: 25.0),
            // row for registration page link
            Row(
              children: [
                Expanded(
                  child: RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 18.0,
                        height: 1.2,),
                      children: [
                        TextSpan(text: "Don't have an account?\nClick "),
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
            SizedBox(height: 40.0),
            // row for forgot password page link
            Row(
              children: [
                Expanded(
                  child: RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 18.0,
                        height: 1.2,),
                      children: [
                        TextSpan(text: "Forgot password?\nEnter \'Username\' above then\nclick "),
                        TextSpan(
                          text: "here",
                          style: TextStyle(
                            color: Colors.indigo[900],
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              // call api that requests temporary password be sent via NodeMailer
                              // .......
                              tempPasswordMessage = 'A temporary password has been sent to your email.';
                              changeTempPasswordMessage();
                            },
                        ),
                        TextSpan(text: " to request a temporary password."),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // row (conditional) for message notifying that temporary password was sent to email
            if (message2 != '') ... [
              SizedBox(height: 25.0),
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      '$message2',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18.0,
                        color: Colors.amber[500],
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ], // end IF statement for temporary password notify
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
        style: TextStyle(fontSize: 16.0),
      ),
    );
  }
}



