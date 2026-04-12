import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


class UserSettingsScreen extends StatefulWidget {
  @override
  State<UserSettingsScreen> createState() => _UserSettingsScreenState();
}

class _UserSettingsScreenState extends State<UserSettingsScreen> {

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
      body: UserSettingsPage(),
    );
  }
}

// widget for the user settings page (allows users to change their account information)
class UserSettingsPage extends StatefulWidget {

  @override
  State<UserSettingsPage> createState() => _UserSettingsPageState();
}

class _UserSettingsPageState extends State<UserSettingsPage> with RouteAware {

  // current user account settings
  String curFirstName = '';
  String curLastName = '';
  String curUsername = '';
  String curEmail = '';
  // controls text boxes for user settings
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController passwordConfirmController = TextEditingController();
  // messages
  String errorMessage = '';
  String successMessage = '';

  @override
  void initState() {
    super.initState();
    getUserAccountSettings();
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    passwordConfirmController.dispose();
    super.dispose();
  }

  // text box widget
  Widget labeledTextField(String label, TextEditingController controller, [bool obscure = false, String hint = '']) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.black)),
        SizedBox(height: 5),
        TextField(
          controller: controller,
          obscureText: obscure,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey[300],
            border: OutlineInputBorder(),
            hintText: hint,
          ),
        ),
        SizedBox(height: 10),
      ],
    );
  }

  void updateErrorMessage(String msg) {
    setState(() {
      errorMessage = msg;
    });
  }

  void updateSuccessMessage(String msg) {
    setState(() {
      successMessage = msg;
    });
  }

  // check if email is valid
  bool isValidEmail(String value) {
    final regex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    return regex.hasMatch(value.trim());
  }

  // get user account settings
  void getUserAccountSettings() async {

    final userId = context.read<GlobalData>().userId;
    String firstName = '';
    String lastName = '';
    String username = '';
    String email = '';

    try {
      String url = 'http://leandrovivares.com/api/userSettings/${userId}';
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = jsonDecode(ret);
      print(decoded);
      firstName = decoded['First_Name'];
      lastName = decoded['Last_Name'];
      username = decoded['Username'];
      email = decoded['Email'];
      setState(() {
        // set state for current user account settings
        curFirstName = firstName;
        curLastName= lastName;
        curUsername = username;
        curEmail = email;
        // fill in textfield with current user account settings
        firstNameController.text = firstName;
        lastNameController.text = lastName;
        usernameController.text = username;
        emailController.text = email;
      });
    } catch (e) {
      updateErrorMessage(e.toString());
      print(e.toString());
    }
  }

  // submit updated user account setting
  void submitUserAccountSettings() async {

    final userId = context.read<GlobalData>().userId;
    // send user account settings to database
    String url = "http://leandrovivares.com/api/updateUser/${userId}";
    String payload = '{'
        '"First_Name": "${firstNameController.text.trim()}", '
        '"Last_Name": "${lastNameController.text.trim()}", '
        '"Username": "${usernameController.text.trim()}", '
        '"Password": "${passwordController.text.trim()}", '
        '"Email": "${emailController.text.trim()}" '
        '}';

    print(payload);

    try {
      String ret = await AppDataPut.getJSON(url, payload);
      Map<String, dynamic> decoded = json.decode(ret);
      print(decoded);

      if (decoded.containsKey('message')) { // enter when api throws back an input error
        print(decoded['message']);
        if (decoded['message'] == "Validation failed: Username: Path `Username` is required.") {
          updateErrorMessage('Username is required.');
        }
        else if (decoded['message'] == "Email already registered!") {
          updateErrorMessage('Email already registered!');
        }
        else if (decoded['message'] == "Validation failed: Email: Path `Email` is required.") {
          updateErrorMessage('Email is required.');
        }
        else {
          updateErrorMessage(decoded['message']);
        }
      }
      else {
        print('Account settings successfully saved');
        updateSuccessMessage('Account updated successfully!');
        updateErrorMessage('');
        // delay to allow time for user to read message before redirecting to another page
        await Future.delayed(Duration(milliseconds: 1500));
        // redirect back to the home page by popping the screen off the stack
        if (Navigator.canPop(context)) {
          Navigator.pop(context);
        }
      }
    } catch (e) {
      print('Account settings update error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: 300,
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: 40.0),
              // title heading for the screen
              Text('Account Settings',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                )
              ),
              SizedBox(height: 20.0),
              // card to display account settings
              _AccountSettingsCard({
                'FirstName': '${curFirstName}',
                'LastName': '${curLastName}',
                'Username': '${curUsername}',
                'Email': '${curEmail}'
              }),
              SizedBox(height: 30.0),
              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 15,
              ),
              SizedBox(height: 20.0),
              // heading for the update info section
              Text('Update Info',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                )
              ),
              SizedBox(height: 20.0),
              // textfields for account settings inputs
              labeledTextField('First Name', firstNameController),
              labeledTextField('Last Name', lastNameController),
              labeledTextField('Username', usernameController),
              labeledTextField('Email', emailController),
              SizedBox(height: 30.0),
              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 15,
              ),
              SizedBox(height: 20.0),
              // heading for the change password section
              Text('Change Password',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                )
              ),
              SizedBox(height: 20.0),
              Text(
                'Leave blank to keep your current password.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16.0,
                  color: Colors.grey[850],
                  fontWeight: FontWeight.bold,
                )
              ),
              SizedBox(height: 20.0),
              // textfields for account settings inputs
              labeledTextField('New Password', passwordController, true, 'New password'),
              labeledTextField('Confirm New Password', passwordConfirmController, true, 'Confirm new password'),
              SizedBox(height: 30.0),
              // error message
              if (errorMessage != '') ...[
                Text(
                  errorMessage,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 18.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 20.0),
              ],
              // successful change message
              if (successMessage != '') ...[
                Text(
                  successMessage,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.amber[500],
                    fontSize: 18.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 20.0),
              ],
              // save button to submit account settings
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.all(8.0),
                  backgroundColor: Colors.brown[50],
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () {
                  // question and option field inputs
                  final String firstName = firstNameController.text.trim();
                  final String lastName = lastNameController.text.trim();
                  final String username = usernameController.text.trim();
                  final String email = emailController.text.trim();
                  final String password = passwordController.text.trim();
                  final String passwordConfirm = passwordConfirmController.text.trim();

                  if (!isValidEmail(email)) {
                    // email doesn't meet formatting requirements
                    updateErrorMessage('Please enter a valid email address.');
                    return;
                  }
                  
                  if (password != passwordConfirm) {
                    // passwords don't match
                    updateErrorMessage('Passwords do not match.');
                    return;
                  }

                  if (password.length < 5 && password != '') {
                    // password doesn't meet minimum length requirement
                    updateErrorMessage('Password must be at least 5 characters.');
                    return;
                  }

                  // api call to update user account settings
                  submitUserAccountSettings();
                },
                child: Text(
                  'Save Changes',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: 15.0,
                  ),
                )
              ),
              SizedBox(height: 150.0),
            ]
          )
        )
      )
    );
  }
}


// this widget holds the current account settings
Widget _AccountSettingsCard(Map<String, String> accountSettings) {

  String curFirstName = accountSettings['FirstName'] ?? '';
  String curLastName = accountSettings['LastName'] ?? '';
  String curUsername = accountSettings['Username'] ?? '';
  String curEmail = accountSettings['Email'] ?? '';

  return Container(
    width: double.infinity,
    margin: EdgeInsets.symmetric(vertical: 6.0),
    padding: EdgeInsets.symmetric(vertical: 16.0, horizontal: 12.0),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(7.5),
      border: Border.all(color: Colors.grey.shade300, width: 1.5),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Name: ${curFirstName} ${curLastName}',
          textAlign: TextAlign.left,
          style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 4.0),
        Text(
          'Username: ${curUsername}',
          textAlign: TextAlign.left,
          style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold, ),
        ),
        SizedBox(height: 4.0),
        Text(
          'Email: ${curEmail}',
          textAlign: TextAlign.left,
          style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold, ),
        ),
        SizedBox(height: 4.0),
      ]
    )
  );
}
