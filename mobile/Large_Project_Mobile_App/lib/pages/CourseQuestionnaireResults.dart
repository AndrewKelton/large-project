import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'dart:convert';

class CourseQuestionnaireResults extends StatefulWidget {
  final String courseId;

  const CourseQuestionnaireResults({super.key, required this.courseId});

  @override
  State<CourseQuestionnaireResults> createState() => _CourseQuestionnaireResultsState();
}

class _CourseQuestionnaireResultsState extends State<CourseQuestionnaireResults> {

  List<Map<String, dynamic>> courseQuestionnaireObjects = [];
  List<String> answeredCourseQuestionnairesList = [];

  @override
  void initState() {
    super.initState();
    loadCourseQuestionnaires();
    getAnsweredCourseQuestionnaires();
  }

  @override
  void didUpdateWidget(CourseQuestionnaireResults oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.courseId != widget.courseId) {
      setState(() {
        courseQuestionnaireObjects = [];
        answeredCourseQuestionnairesList = [];
      });
      loadCourseQuestionnaires();
      getAnsweredCourseQuestionnaires();
    }
  }

  void loadCourseQuestionnaires() async {
    String courseId = widget.courseId.trim();
    String url = "http://leandrovivares.com:3000/api/fetchCO/course/${courseId}";

    try {
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = json.decode(ret);
      List<dynamic> questionnaires = decoded["Questionnaires"];

      setState(() {
        courseQuestionnaireObjects = questionnaires.map((q) {
          return {
            "questionnaire_id": q["_id"],
            "question": q["Question"],
            "options": q["Options"],
            "counts": q["Counts"],
          };
        }).toList().cast<Map<String, dynamic>>();
      });

    } catch (e) {
      print('Course questionnaire results error: ${e.toString()}');
    }
  }

  void getAnsweredCourseQuestionnaires() async {
    String userId = GlobalData.userId;
    String url = "http://leandrovivares.com/api/user/${userId}/answered-questionnaires";

    try {
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = json.decode(ret);
      List<dynamic> answered = decoded["answeredQuestionnaires"];

      setState(() {
        answeredCourseQuestionnairesList = List<String>.from(answered.map((item) => item.toString()));;
      });

    } catch (e) {
      print('Answered course questionnaire list error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // title bar
        if (courseQuestionnaireObjects.isNotEmpty) ...[
          Row(
            children: [
              Expanded(
                child: Text(
                  'Course Questionnaire Results',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 25.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 5.0),
        ],
        // questionnaire cards
        ...courseQuestionnaireObjects.map((q) {
          Map<String, dynamic> options = q["options"];
          Map<String, dynamic> counts = q["counts"];

          // calculate total votes for this question
          int totalVotes = counts.values.fold(0, (sum, count) => sum + (count as int));

          return Container(
            width: double.infinity,
            margin: EdgeInsets.symmetric(vertical: 6.0),
            padding: EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(7.5),
              border: Border.all(color: Colors.grey.shade300, width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: double.infinity,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(q["question"], style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold)),
                      ),
                      SizedBox(width: 5.0),
                      if (answeredCourseQuestionnairesList.any((item) => item == q['questionnaire_id'])) ... [
                        ConstrainedBox(
                          constraints: BoxConstraints(maxWidth: 90.0),
                          child: Container(
                            width: 90.0,
                            padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
                            decoration: BoxDecoration(
                              color: Colors.green,
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                            child: Text(
                              'Answered',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                              color: Colors.white,
                              fontSize: 10.0,
                              fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ] // end of if statement for 'Answered/Unanswered'
                      else ... [
                        ConstrainedBox(
                          constraints: BoxConstraints(maxWidth: 90.0),
                          child: Container(
                            width: 90.0,
                            padding: EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                            child: Text(
                              'Unanswered',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10.0,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ], // end of else statement for 'Answered/Unanswered'
                    ],
                  ),
                ),
                SizedBox(height: 8.0),
                ...options.entries.map((entry) {
                  String key = entry.key;
                  String? option = entry.value;
                  int count = counts[key] ?? 0;
                  double proportion = totalVotes > 0 ? count / totalVotes : 0.0;

                  if (option == null) return SizedBox.shrink();

                  return Padding(
                    padding: EdgeInsets.symmetric(vertical: 4.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // option text and vote count
                        Text('$key: $option ($count votes — ${(proportion * 100).toStringAsFixed(1)}%)'),
                        SizedBox(height: 4.0),
                        // proportion bar
                        LinearProgressIndicator(
                          value: proportion,
                          minHeight: 8.0,
                          backgroundColor: Colors.grey.shade200,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }
}
