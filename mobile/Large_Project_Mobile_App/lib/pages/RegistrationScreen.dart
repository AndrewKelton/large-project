import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';


// widget for the registration screen
class RegistrationScreen extends StatefulWidget {
  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {

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
      body: RegistrationPage(),
    );
  }
}

// widget for the registration page
class RegistrationPage extends StatefulWidget {

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

// widget for building the registration page
class _RegistrationPageState extends State<RegistrationPage> with RouteAware {
  String message = "";
  String newMessageText = "";
  // controllers for textfields (objects contain the text inputs)
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController emailAddressController;
  late TextEditingController usernameController;
  late TextEditingController passwordController;
  late TextEditingController confirmPasswordController;

  @override
  void initState() {
    super.initState();
    firstNameController = TextEditingController();
    lastNameController = TextEditingController();
    emailAddressController = TextEditingController();
    usernameController = TextEditingController();
    passwordController = TextEditingController();
    confirmPasswordController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // route observer used to clear previous textfields when going back to registration page
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    // route observer used to clear previous textfields when going back to registration page
    routeObserver.unsubscribe(this);
    firstNameController.dispose();
    lastNameController.dispose();
    emailAddressController.dispose();
    usernameController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  void didPopNext() {
    // called when coming back from another page
    setState(() {
      message = "";
      newMessageText = "";
      firstNameController.clear();
      lastNameController.clear();
      emailAddressController.clear();
      usernameController.clear();
      passwordController.clear();
      confirmPasswordController.clear();
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
            // row for register instruction
            Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    'REGISTER',
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
            // row for first name textfield
            Row (
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: firstNameController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'First Name',
                    ),
                  ),
                )
              ],
            ),
            // row for last name textfield
            Row(
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: lastNameController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Last Name',
                    ),
                  ),
                ),
              ],
            ),
            // row for email address textfield
            Row(
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: emailAddressController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Email Address',
                    ),
                  ),
                ),
              ],
            ),
            // row for username textfield
            Row(
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: usernameController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Username',
                    ),
                  ),
                ),
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
            // row for re-entering password textfield
            Row(
              children: <Widget> [
                Container(
                  width: 250,
                  child: TextField(
                    controller: confirmPasswordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(),
                      hintText: 'Re-enter your Password',
                    ),
                  ),
                ),
              ],
            ),
            // row for registration button
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget> [
                RegisterButton(
                  onPressed: () async {
                    newMessageText = "";
                    changeText();
                    String payload = '{"FirstName":"${firstNameController.text.trim()}", '
                        '              "LastName":"${lastNameController.text.trim()}", '
                        '              "Email":"${emailAddressController.text.trim()}", '
                        '              "Username":"${usernameController.text.trim()}", '
                        '               "Password":"${passwordController.text.trim()}"}';
                    print(payload);
                    var userId = -1;
                    var jsonObject;

                    try {
                      String url = 'http://leandrovivares.com/api/register';
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
                      if (jsonObject['message'] == 'Account created successfully') {
                        // navigate to login page
                        Navigator.pushNamed(context, '/login');
                        newMessageText = "Account created successfully! Redirecting to Login Screen...";
                        changeText();
                      }
                      else {
                        newMessageText = jsonObject['message'];
                        changeText();
                      }
                    }
                    else if (jsonObject.containsKey('errors')) {
                      //print(jsonObject['errors'][0]['msg']);
                      //print(jsonObject['errors'][0].runtimeType);
                      newMessageText = jsonObject['errors'][0]['msg'];
                      changeText();
                    }
                    else {
                      newMessageText = "Unknown Error!";
                      changeText();
                    }
                  },
                ),
              ],
            ),
            // row (conditional) for potential error message
            if (message != '') Row(
              children: <Widget> [
                Expanded(
                  child: Text(
                    '$message',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
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
                        TextSpan(text: "Already have an account? Click "),
                        TextSpan(
                          text: "here",
                          style: TextStyle(
                            color: Colors.indigo[900],
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              Navigator.pushNamed(context, '/login');
                            },
                        ),
                        TextSpan(text: " to Login."),
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

// custom class for the register button
class RegisterButton extends StatelessWidget {
  // function initialized from constructor
  final VoidCallback onPressed;
  // constructor
  const RegisterButton({required this.onPressed});

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
        'Sign Me Up!',
        style: TextStyle(fontSize: 14.0),
      ),
    );
  }
}

