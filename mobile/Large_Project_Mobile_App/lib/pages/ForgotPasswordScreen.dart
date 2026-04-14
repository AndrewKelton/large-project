import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'dart:convert';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {

  late TextEditingController emailController;
  String message = '';
  bool messageIsError = false;

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
  }

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  bool isValidEmail(String email) {
    return RegExp(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$').hasMatch(email);
  }

  void submitForgotPassword() async {

    String email = emailController.text.trim();
    if (email.isEmpty) {
      setState(() {
        message = 'Please enter your email address.';
        messageIsError = true;
      });
      return;
    }

    if (!isValidEmail(email)) {
      setState(() {
        message = 'Please enter a valid email address.';
        messageIsError = true;
      });
      return;
    }

    String url = "http://leandrovivares.com/api/auth/password/reset/request";
    String payload = '{"email": "$email"}';

    try {
      String ret = await AppDataPost.getJSON(url, payload);
      Map<String, dynamic> decoded = json.decode(ret);
      print(decoded);

      setState(() {
        message = 'If that email exists, a reset link has been sent.';
        messageIsError = false;
      });

      Future.delayed(Duration(seconds: 5), () {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      });

    } catch (e) {
      print('Forgot password error: ${e.toString()}');
      setState(() {
        message = 'Something went wrong. Please try again.';
        messageIsError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
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
      body: Column(
        children: [
          SizedBox(height: 125.0),
          // title bar
          Row(
            children: [
              Expanded(
                child: Text(
                  'Forgot Password',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 25.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10.0),
          // email text field
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 300,
                child: TextField(
                  controller: emailController,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(),
                    hintText: 'Enter your email address...',
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10.0),
          // submit button
          ElevatedButton(
            onPressed: submitForgotPassword,
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              backgroundColor: Colors.brown[50],
              foregroundColor: Colors.black,
              padding: EdgeInsets.all(8.0),
            ),
            child: Text(
              'Send Reset Link',
              style: TextStyle(fontSize: 15.0),
            ),
          ),
          // message
          if (message != '') ...[
            SizedBox(height: 10.0),
            Text(
              message,
              style: TextStyle(
                color: messageIsError ? Colors.red : Colors.yellow,
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
