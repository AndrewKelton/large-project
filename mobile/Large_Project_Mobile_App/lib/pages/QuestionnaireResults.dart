import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'dart:convert';

class QuestionnaireResults extends StatefulWidget {
  final String courseId;

  const QuestionnaireResults({super.key, required this.courseId});

  @override
  State<QuestionnaireResults> createState() => _QuestionnaireResultsState();
}

class _QuestionnaireResultsState extends State<QuestionnaireResults> {

  List<Map<String, dynamic>> questionnaireObjects = [];

  @override
  void initState() {
    super.initState();
    loadQuestionnaires();
  }

  @override
  void didUpdateWidget(QuestionnaireResults oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.courseId != widget.courseId) {
      setState(() {
        questionnaireObjects = [];
      });
      loadQuestionnaires();
    }
  }

  void loadQuestionnaires() async {
    String courseId = widget.courseId.trim();
    String url = "http://leandrovivares.com:3000/api/fetchCO/course/${courseId}";

    try {
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = json.decode(ret);
      List<dynamic> questionnaires = decoded["Questionnaires"];

      setState(() {
        questionnaireObjects = questionnaires.map((q) {
          return {
            "question": q["Question"],
            "options": q["Options"],
            "counts": q["Counts"],
          };
        }).toList().cast<Map<String, dynamic>>();
      });

    } catch (e) {
      print('Questionnaire error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // title bar
        if (questionnaireObjects.isNotEmpty) ...[
          Row(
            children: [
              Expanded(
                child: Text(
                  'Questionnaire Results',
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
        ...questionnaireObjects.map((q) {
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
                Text(q["question"], style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold)),
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
