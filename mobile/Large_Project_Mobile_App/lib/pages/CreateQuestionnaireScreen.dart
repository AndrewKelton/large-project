import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


class CreateQuestionnaireScreen extends StatefulWidget {
  @override
  State<CreateQuestionnaireScreen> createState() => _CreateQuestionnaireScreenState();
}

class _CreateQuestionnaireScreenState extends State<CreateQuestionnaireScreen> {

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
      body: CreateQuestionnairePage(),
    );
  }
}

// widget for the create questionnaire page
class CreateQuestionnairePage extends StatefulWidget {

  @override
  State<CreateQuestionnairePage> createState() => _CreateQuestionnairePageState();
}

class _CreateQuestionnairePageState extends State<CreateQuestionnairePage> with RouteAware {

  late String selectedProfessorName = context.read<GlobalData>().selectedProfessor; // professor selected from dropdown
  late String selectedCourseName = context.read<GlobalData>().selectedCourse; // course name

  late String selectedProfessorId = context.read<GlobalData>().selectedProfessorId; // professor id
  late String selectedCourseId = context.read<GlobalData>().selectedCourseId; // course id

  // controls text boxes enabled/disabled
  final TextEditingController questionController = TextEditingController();
  final TextEditingController option1Controller = TextEditingController();
  final TextEditingController option2Controller = TextEditingController();
  final TextEditingController option3Controller = TextEditingController();
  final TextEditingController option4Controller = TextEditingController();

  // option 3 and 4 disabled by default until 2->3 and 3->4
  bool option3Enabled = false;
  bool option4Enabled = false;

  @override
  void initState() {
    super.initState();
    option2Controller.addListener(() {
      if (!mounted) return;
      setState(() {
        option3Enabled = option2Controller.text.isNotEmpty;
        if (!option3Enabled) {
          option3Controller.clear();
          option4Enabled = false;
          option4Controller.clear();
        }
      });
    });
    option3Controller.addListener(() {
      if (!mounted) return;
      setState(() {
        option4Enabled = option3Controller.text.isNotEmpty;
        if (!option4Enabled) {
          option4Controller.clear();
        }
      });
    });
  }

  @override
  void dispose() {
    questionController.dispose();
    option1Controller.dispose();
    option2Controller.dispose();
    option3Controller.dispose();
    option4Controller.dispose();
    super.dispose();
  }

  // text box widget
  Widget labeledTextField(String label, TextEditingController controller, bool enabled) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold, color: enabled ? Colors.black : Colors.grey)),
        SizedBox(height: 5),
        TextField(
          controller: controller,
          enabled: enabled,
          decoration: InputDecoration(
            filled: true,
            fillColor: enabled ? Colors.white : Colors.grey[300],
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 10),
      ],
    );
  }

  // error message updater
  String message = '';

  void updateErrorMessage(String msg) {
    if (!mounted) return;
    setState(() {
      message = msg;
    });
  }

  // post questionnaire api call
  void postQuestionnaire(String question, String A, String B, String C, String D) async {

    final userId = context.read<GlobalData>().userId;

    String payload = jsonEncode({
      "User": userId,
      "Course": selectedCourseId,
      "Professor": selectedProfessorId.isEmpty ? null : selectedProfessorId,
      "Question": question,
      "Option_A": A,
      "Option_B": B,
      if (C.isNotEmpty) "Option_C": C,
      if (D.isNotEmpty) "Option_D": D,
    });

    try {
      String ret = await AppDataPost.getJSON('http://leandrovivares.com/api/createQuestionnaire', payload);

      Map<String, dynamic> decoded = jsonDecode(ret);
      print(decoded);
    } catch (e) {
      updateErrorMessage('Network error — please try again.');
      print(e.toString());
    }

    updateErrorMessage('Questionnaire submitted!');
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
              Text('Questionnaire Page',

                style: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold)
              ),
              SizedBox(height: 20.0),

              // display course code - name
              Text(
                'Course: ${selectedCourseName}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              SizedBox(height: 8.0),

              // display professor name
              Text(
                'Professor: ${context.read<GlobalData>().selectedProfessor}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold, color: Colors.white),
              ),

              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 15,
              ),

              Text(
                'Please enter a question, and at least 2 options for users to select from',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),

              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 5,
              ),

              SizedBox(height: 15.0),
              labeledTextField('Question', questionController, true),
              labeledTextField('Option 1', option1Controller, true),
              labeledTextField('Option 2', option2Controller, true),
              labeledTextField('Option 3', option3Controller, option3Enabled),
              labeledTextField('Option 4', option4Controller, option4Enabled),

              ElevatedButton(
                onPressed: () {

                  // question and option field inputs
                  final question = questionController.text.trim();
                  final option1 = option1Controller.text.trim();
                  final option2 = option2Controller.text.trim();
                  final option3 = option3Controller.text.trim();
                  final option4 = option4Controller.text.trim();

                  if (question.isEmpty) {
                    updateErrorMessage('Please enter a question.');
                    return;
                  }
                  if (option1.isEmpty) {
                    updateErrorMessage('Please enter at least 2 options.');
                    return;
                  }
                  if (option2.isEmpty) {
                    updateErrorMessage('Please enter at least 2 options.');
                    return;
                  }

                  // all passing; clear error field
                  updateErrorMessage('');

                  // API call to add questionnaire
                  postQuestionnaire(question, option1, option2, option3, option4);

                  print('redirect to home page');
                  if (mounted && Navigator.canPop(context)) {
                    Navigator.pop(context);
                  }

                },
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  backgroundColor: Colors.brown[50],
                  foregroundColor: Colors.black,
                  padding: EdgeInsets.all(8.0),
                ),
                child: Text(
                  'Submit Questionnaire',
                  style: TextStyle(fontSize: 15.0),
                  textAlign: TextAlign.center,
                )
              ),

              if (message != '') ...[
                SizedBox(height: 10.0),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
              SizedBox(height: 100.0),
            ]
          )
        )
      )
    );
  }
}
