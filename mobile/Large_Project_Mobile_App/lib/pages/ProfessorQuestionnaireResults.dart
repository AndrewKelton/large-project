import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'dart:convert';
import 'package:provider/provider.dart';

class ProfessorQuestionnaireResults extends StatefulWidget {
  final String courseId;
  final String professorId;

  const ProfessorQuestionnaireResults({super.key, required this.courseId, required this.professorId});

  @override
  State<ProfessorQuestionnaireResults> createState() => _ProfessorQuestionnaireResultsState();
}

class _ProfessorQuestionnaireResultsState extends State<ProfessorQuestionnaireResults> {

  // list of course+professor questionnaire results
  List<Map<String, dynamic>> professorQuestionnaireObjects = [];
  // list of questionnaires answer by user
  List<String> answeredProfessorQuestionnairesList = [];

  @override
  void initState() {
    super.initState();
    loadProfessorQuestionnaires();
    getAnsweredProfessorQuestionnaires();
  }

  @override
  void didUpdateWidget(ProfessorQuestionnaireResults oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.courseId != widget.courseId || oldWidget.professorId != widget.professorId) {
      setState(() {
        professorQuestionnaireObjects = [];
        answeredProfessorQuestionnairesList = [];
      });
      loadProfessorQuestionnaires();
      getAnsweredProfessorQuestionnaires();
    }
  }

  // function to get the professor ratings from database
  void loadProfessorQuestionnaires() async {
    String courseId = widget.courseId.trim();
    String professorId = widget.professorId.trim();
    String url = "http://leandrovivares.com/api/fetchCAP/course/${courseId}/professor/${professorId}";

    try {
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = json.decode(ret);
      List<dynamic> questionnaires = decoded["Questionnaires"];

      setState(() {
        professorQuestionnaireObjects = questionnaires.map((q) {
          return {
            "questionnaire_id": q["_id"],
            "question": q["Question"],
            "options": q["Options"],
            "counts": q["Counts"],
            "_showQuestions": false,
            "answerMessage": '',
          };
        }).toList().cast<Map<String, dynamic>>();
      });

    } catch (e) {
      print('Professor questionnaire results error: ${e.toString()}');
    }
  }

  // function to get course+professor questionnaires and results from questionnaire
  void getAnsweredProfessorQuestionnaires() async {
    String userId = context.read<GlobalData>().userId;
    String url = "http://leandrovivares.com/api/user/${userId}/answered-questionnaires";

    try {
      String ret = await AppDataGet.getJSON(url);
      Map<String, dynamic> decoded = json.decode(ret);
      List<dynamic> answered = decoded["answeredQuestionnaires"];

      setState(() {
        answeredProfessorQuestionnairesList = List<String>.from(answered.map((item) => item.toString()));;
      });

    } catch (e) {
      print('Answered course+professor questionnaire list error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // title bar
        if (professorQuestionnaireObjects.isNotEmpty) ...[
          Row(
            children: [
              Expanded(
                child: Text(
                  'Professor Questionnaire Results',
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
        ...professorQuestionnaireObjects.asMap().entries.map((entry) {
          int index = entry.key;

          // information for current questionnaire
          Map<String, dynamic> q = entry.value;
          // id for current questionnaire
          String questionnaireId = q["questionnaire_id"];
          // the multiple-choice answer options for current questionnaire
          Map<String, dynamic> options = q["options"];
          // counts for each multiple-choice answer options for current questionnaire
          Map<String, dynamic> counts = q["counts"];
          // answer messages
          String answerMessage = q["answerMessage"];

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
                      if (answeredProfessorQuestionnairesList.any((item) => item == q['questionnaire_id'])) ... [
                        AnsweredTag(),
                      ] // end of if statement for 'Answered/Unanswered'
                      else ... [ // enter if the question was unanswered by the user
                        UnansweredTag(),
                      ], // end of else statement for 'Answered/Unanswered'
                    ],
                  ),
                ),
                SizedBox(height: 8.0),
                // ternary operator - if true, then display form to allow user to answer course+professor questionnaire; otherwise just show the course+professor questionnaire results summary
                professorQuestionnaireObjects[index]["_showQuestions"] as bool
                    ? AnswerProfessorQuestionnaire(
                  questionnaireId: questionnaireId,
                  options: options,
                  onViewResults: () {
                    final int curIndex = index;
                    setState(() {
                      professorQuestionnaireObjects[curIndex]["_showQuestions"] = !professorQuestionnaireObjects[curIndex]["_showQuestions"];
                      professorQuestionnaireObjects[curIndex]["answerMessage"] = '';
                    });
                  },
                  onSubmitAnswer: (String? message) {
                    final int curIndex = index;
                    setState(() {
                      print(message);
                      professorQuestionnaireObjects[curIndex]["_showQuestions"] = !professorQuestionnaireObjects[curIndex]["_showQuestions"];
                      if (message == 'Response recorded successfully') {
                        professorQuestionnaireObjects[curIndex]["answerMessage"] = '';
                        loadProfessorQuestionnaires();
                        getAnsweredProfessorQuestionnaires();
                      }
                      else {
                        professorQuestionnaireObjects[curIndex]["answerMessage"] = message ?? '';
                      }
                    });
                  },
                )
                    : QuestionnaireResults(options: options, counts: counts, totalVotes: totalVotes, answerMessage: answerMessage),
                // button for answer questions (only displayed when a question is marked 'unanswered')
                if (!(answeredProfessorQuestionnairesList.any((item) => item == q['questionnaire_id']))) ... [ // enter if user can answer this question
                  if (!(professorQuestionnaireObjects[index]["_showQuestions"] as bool)) ... [ // enter if the user clicked button to answer questionnaire
                    Center(
                      child: SizedBox(
                        width: 200.0,
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {
                              print('Clicked \'Answer this Question\' Button');
                              professorQuestionnaireObjects[index]["_showQuestions"] = !professorQuestionnaireObjects[index]["_showQuestions"];
                            });
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
                            'Answer this Question',
                            style: TextStyle(fontSize: 15.0),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ],
            ),
          );
        }).toList(),
      ],
    );
  }
}

// class used to display answer summary to questionnaires
class QuestionnaireResults extends StatefulWidget {

  // the multiple-choice answer options for this questionnaire
  final dynamic options;
  // counts for each multiple-choice answer options for this questionnaire
  final dynamic counts;
  // total number of responses to this questionnaire
  final int totalVotes;
  // used for messages from parent class
  final String answerMessage;

  const QuestionnaireResults({super.key, required this.options, required this.counts, required this.totalVotes, required this.answerMessage});

  @override
  State<QuestionnaireResults> createState() => _QuestionnaireResultsState();
}

class _QuestionnaireResultsState extends State<QuestionnaireResults> {

  @override
  void initState() {
    super.initState();
  }

  Widget build(BuildContext context) {
    return Column(
      children: [
        ...(widget.options).entries.map((entry) {
          String key = entry.key;
          String? option = entry.value;
          int count = (widget.counts)[key] ?? 0;
          double proportion = widget.totalVotes > 0 ? count / widget.totalVotes : 0.0;
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
        if (widget.answerMessage != '') ... [
          Text(
              widget.answerMessage,
              style: TextStyle(
                color: Colors.red,
                fontSize: 14.0,
              )
          ),
        ],
      ],
    );
  }
}

// class used to format the unanswered tag
class UnansweredTag extends StatefulWidget {

  const UnansweredTag({super.key});

  @override
  State<UnansweredTag> createState() => _UnansweredTagState();
}

class _UnansweredTagState extends State<UnansweredTag> {

  @override
  void initState() {
    super.initState();
  }

  Widget build(BuildContext context) {
    return ConstrainedBox(
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
    );
  }
}

// class used to format the answered tag
class AnsweredTag extends StatefulWidget {

  const AnsweredTag({super.key});

  @override
  State<AnsweredTag> createState() => _AnsweredTagState();
}

class _AnsweredTagState extends State<AnsweredTag> {

  @override
  void initState() {
    super.initState();
  }

  Widget build(BuildContext context) {
    return ConstrainedBox(
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
    );
  }
}


// class used to answer course+professor questionnaires
class AnswerProfessorQuestionnaire extends StatefulWidget {

  // course+professor questionnaire id
  final String questionnaireId;
  // the multiple-choice answer options for this questionnaire
  final dynamic options;
  // function from parent to go back to results summary view
  final VoidCallback onViewResults;
  // function from parent to send message back to parent and go back to results summary view
  final ValueChanged<String?> onSubmitAnswer;

  const AnswerProfessorQuestionnaire({super.key, required this.questionnaireId, required this.options, required this.onViewResults, required this.onSubmitAnswer});

  @override
  State<AnswerProfessorQuestionnaire> createState() => _AnswerProfessorQuestionnaireState();
}

class _AnswerProfessorQuestionnaireState extends State<AnswerProfessorQuestionnaire> {

  // used to hold the selected answer
  String? _selectedValue;

  @override
  void initState() {
    super.initState();
  }

  void submitAnswerProfessorQuestionnaire(String? option) async {

    String url = "http://leandrovivares.com/api/respondToCAP/${widget.questionnaireId}/respond";
    String payload = '{"userId":"${context.read<GlobalData>().userId}", "response":"${_selectedValue}"}';

    print(url);

    try {
      String ret = await AppDataPost.getJSON(url, payload);
      Map<String, dynamic> decoded = json.decode(ret);
      print(decoded);
      widget.onSubmitAnswer(decoded['message']);
    } catch (e) {
      print('Professor questionnaire submit answer error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return RadioGroup<String>(
      groupValue: _selectedValue,
      onChanged: (String? value) {
        setState(() => _selectedValue = value);
      },
      child: Column(
        children: [
          ...(widget.options).entries.map((entry) {
            String? option = entry.value;

            if (option == null) return SizedBox.shrink();

            return Padding(
              padding: EdgeInsets.symmetric(vertical: 1.0),
              child: RadioListTile<String>(
                title: Text(
                  option,
                  style: TextStyle(
                    fontSize: 14.0,
                    color: Colors.black,
                  ),
                ),
                value: entry.key,
                dense: true,
              ),
            );
          }).toList(),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    print('Clicked \'Submit Answer\' Button');
                    print('questionnaire id: ${widget.questionnaireId}');
                    if (_selectedValue != null) {
                      print('Selected: $_selectedValue');
                      // send answer to database
                      submitAnswerProfessorQuestionnaire(_selectedValue);
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
                    'Submit Answer',
                    style: TextStyle(fontSize: 15.0),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              SizedBox(width: 8),   // gap between buttons
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    print('Clicked \'View Results\' Button');
                    widget.onViewResults();
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
                    'View Results',
                    style: TextStyle(fontSize: 15.0),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}




