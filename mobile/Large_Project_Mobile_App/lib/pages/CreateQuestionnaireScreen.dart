import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:group7_mobile_app/pages/RatingForm.dart';
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
              )
            ]
          )
        )
      )
    );
  }

  late String selectedProfessorName = context.read<GlobalData>().selectedProfessor; // professor selected from dropdown
  late String selectedCourseName = context.read<GlobalData>().selectedCourse; // course name



}
