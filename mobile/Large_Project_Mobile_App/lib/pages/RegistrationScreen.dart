import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


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
  // textfield border colors
  Color _borderColor1 = Colors.grey.shade700;
  Color _borderColor2 = Colors.grey.shade700;
  Color _borderColor3 = Colors.grey.shade700;
  Color _borderColor4 = Colors.grey.shade700;
  Color _borderColor5 = Colors.grey.shade700;
  Color _borderColor6 = Colors.grey.shade700;
  // error message for textfield
  String message1 = "";
  String message2 = "";
  String message3 = "";
  String message4 = "";
  String message5 = "";
  String message6 = "";

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

  // reset the textfield borders and error messages
  void resetInputMessages() {
    message1 = '';
    message2 = '';
    message3 = '';
    message4 = '';
    message5 = '';
    message6 = '';
    _borderColor1 = Colors.grey.shade700;
    _borderColor2 = Colors.grey.shade700;
    _borderColor3 = Colors.grey.shade700;
    _borderColor4 = Colors.grey.shade700;
    _borderColor5 = Colors.grey.shade700;
    _borderColor6 = Colors.grey.shade700;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: 250,
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start, // center column contents vertically
            crossAxisAlignment: CrossAxisAlignment.center, // center column contents horizontally
            children: <Widget> [
              SizedBox(height: 100.0),
              // row for register instruction
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      'REGISTER',
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
                        hintText: 'First Name',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor1, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor1, width: 2.0),
                        ),
                      ),
                    ),
                  )
                ],
              ),
              // row (conditional) for first name required error
              if (message1 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message1,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 5.0),
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
                        hintText: 'Last Name',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor2, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor2, width: 2.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for last name required error
              if (message2 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message2,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 5.0),
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
                        hintText: 'Email Address',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor3, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor3, width: 2.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for email required error
              if (message3 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message3,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 5.0),
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
                        hintText: 'Username',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor4, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor4, width: 2.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for username required error
              if (message4 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message4,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 5.0),
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
                        hintText: 'Password',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor5, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor5, width: 2.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for password required error
              if (message5 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message5,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 5.0),
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
                        hintText: 'Re-enter your Password',
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor6, width: 2.0),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _borderColor6, width: 2.0),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for confirm password required error
              if (message6 != '') ...[
                Row(
                  children: <Widget> [
                    Icon(Icons.warning_rounded, color: Colors.red),
                    Expanded(
                      child: Text(
                        message6,
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10.0),
              ],
              SizedBox(height: 10.0),
              // row for registration button
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                  SizedBox(
                    width: 120.0,
                    child: RegisterButton(
                      onPressed: () async {
                        resetInputMessages();
                        newMessageText = "";
                        changeText();
          
                        // checkout that the two password textfields match
                        if (passwordController.text.trim() != confirmPasswordController.text.trim()) {
                          print('Passwords do not match.');
                          newMessageText = "Passwords do not match.";
                          changeText();
                          _borderColor5 = Colors.red;
                          _borderColor6 = Colors.red;
                          setState(() {});
                          return;
                        }
          
                        String payload = '{"First_Name":"${firstNameController.text.trim()}", '
                            '              "Last_Name":"${lastNameController.text.trim()}", '
                            '              "Email":"${emailAddressController.text.trim()}", '
                            '              "Username":"${usernameController.text.trim()}", '
                            '               "Password":"${passwordController.text.trim()}"}';
                        print(payload);
          
                        var jsonObject;
          
                        try {
                          String url = 'http://leandrovivares.com/api/register';
                          String ret = await AppDataPost.getJSON(url, payload);
                          jsonObject = json.decode(ret);
                          print(jsonObject);
                        }
                        catch (e) {
                          newMessageText = e.toString();
                          changeText();
                          return;
                        }
          
                        // check response object to verify successful registrations
                        if (jsonObject.containsKey('message')) {
                          resetInputMessages();
                          if (jsonObject['message'] == 'Account created successfully') {
                            newMessageText = "Account created successfully! Redirecting to Login Screen...";
                            changeText();
                            // delay to allow time for user to read message before redirecting to another page
                            await Future.delayed(Duration(milliseconds: 1500));
                            // navigate to login page after popping the current registration page from the stack
                            Navigator.popAndPushNamed(context, '/login');
                          }
                          else if (jsonObject['message'] == 'Email already registered!') {
                            newMessageText = jsonObject['message'];
                            changeText();
                            _borderColor3 = Colors.red;
                          }
                          else if (jsonObject['message'] == 'Username already taken!') {
                            newMessageText = jsonObject['message'];
                            changeText();
                            _borderColor4 = Colors.red;
                          }
                          else {
                            newMessageText = jsonObject['message'];
                            changeText();
                          }
                          // rebuild
                          setState(() {});
                        }
                        else if (jsonObject.containsKey('errors')) {
                          print('jsonObject contains errors key');
                          print(jsonObject);
                          newMessageText = 'Please fix the highlighted fields.';
                          changeText();
          
                          if (firstNameController.text == '') {
                            _borderColor1 = Colors.red;
                            message1 = 'First name is required.';
                          }
                          else {
                            _borderColor1 = Colors.grey.shade700;
                            message1 = '';
                          }
          
                          if (lastNameController.text == '') {
                            _borderColor2 = Colors.red;
                            message2 = 'Last name is required.';
                          }
                          else {
                            _borderColor2 = Colors.grey.shade700;
                            message2 = '';
                          }
          
                          if (emailAddressController.text == '') {
                            _borderColor3 = Colors.red;
                            message3 = 'Email is required.';
                          }
                          else {
                            if ((jsonObject['errors'] as List).any((error) => error['msg'] == 'Must be a valid email!')) {
                              _borderColor3 = Colors.red;
                              message3 = 'Must be a valid email!';
                            }
                            else {
                              _borderColor3 = Colors.grey.shade700;
                              message3 = '';
                            }
                          }
          
                          if (usernameController.text == '') {
                            _borderColor4 = Colors.red;
                            message4 = 'Username is required.';
                          }
                          else {
                            _borderColor4 = Colors.grey.shade700;
                            message4 = '';
                          }
          
                          if (passwordController.text == '') {
                            _borderColor5 = Colors.red;
                            message5 = 'Password is required';
                          }
                          else {
                            if ((jsonObject['errors'] as List).any((error) => error['msg'] == 'Password must be at least 5 characters.')) {
                              _borderColor5 = Colors.red;
                              message5 = 'Password must be at least 5 characters.';
                            }
                            else {
                              _borderColor5 = Colors.grey.shade700;
                              message5 = '';
                            }
                          }

                          if (confirmPasswordController.text == '') {
                            _borderColor6 = Colors.red;
                            message6 = 'Please confirm your password.';
                          }
                          else {
                            if (confirmPasswordController.text != passwordController.text) {
                              _borderColor6 = Colors.red;
                              message6 = 'Passwords do not match.';
                            }
                            else {
                              _borderColor6 = Colors.grey.shade700;
                              message6 = '';
                            }
                          }
          
                          // rebuild this screen
                          setState(() {});
                        }
                        else {
                          newMessageText = "Unknown Error!";
                          changeText();
                        }
                      },
                    ),
                  ),
                ],
              ),
              // row (conditional) for potential error message
              if (message != '') Row(
                children: <Widget> [
                  if (message != "Account created successfully! Redirecting to Login Screen...") ... [
                    Icon(
                      Icons.warning_rounded,
                      color:  Colors.red,
                    ),
                  ],
                  Expanded(
                    child: Text(
                      '$message',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16.0,
                        color: message == "Account created successfully! Redirecting to Login Screen..." ? Colors.amber : Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20.0),
              // row for login page link
              Row(
                children: [
                  Expanded(
                    child: RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        text: 'Already have an account? Please go back to Login.',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 18.0,
                          height: 1.2,),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 100.0),
            ],
          ),
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
        style: TextStyle(fontSize: 16.0),
      ),
    );
  }
}

