import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


class CreateRatingScreen extends StatefulWidget {
  @override
  State<CreateRatingScreen> createState() => _CreateRatingScreenState();
}

class _CreateRatingScreenState extends State<CreateRatingScreen> {

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
        automaticallyImplyLeading: false,
      ),
      backgroundColor: Colors.blue,
      body: CreateRatingPage(),
    );
  }
}

// widget for the create rating page
class CreateRatingPage extends StatefulWidget {

  @override
  State<CreateRatingPage> createState() => _CreateRatingPageState();
}

// widget for building the create rating page
class _CreateRatingPageState extends State<CreateRatingPage> with RouteAware {
  String message = "";
  String newMessageText = "";

  late Map<String, String> courseIdMap = {}; // key=course_dropdown, value=course_id
  late Map<String, String> courseNameMap = {}; // key=course_dropdown, value=course_name
  late Map<String,String> professorIdMap = {}; // key=profess_dropdown, value=professor_id
  late List<String> courseList = []; // course dropdown list
  late List<String> professorList = []; // professor drop list
  late String selectedCourse = ''; // course selected from dropdown
  late String selectedProfessor = ''; // professor selected from dropdown

  final Map<int, String> courseQuestionOptions = {1: '1 - Very Poor', 2: '2 - Poor', 3: '3 - Average', 4: '4 - Good', 5: '5 - Excellent'};
  final Map<String, String> courseRatingsQuestions = {
    'Q1': 'Overall, how would you rate this course?',
    'Q2': 'How would you rate the course difficulty?',
    'Q3': 'How manageable was the course workload?',
    'Q4': 'Do you feel that you will retain the material from the course?',
    'Q5': 'Would you recommend this course to others?'};
  late Map<String, int> selectedCourseRatings = {'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'Q5': 0};
  late Map<String, int> selectedProfessorRatings = {'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'Q5': 0};
  late bool isProfessorRated = false;


  void loadDropdownLists() async {

    var jsonObjectProfessors;

    // get professors table from database
    try {
      String url = 'http://leandrovivares.com/api/professors';
      String ret = await AppDataGet.getJSON(url);
      jsonObjectProfessors = json.decode(ret);
      List<dynamic> ids = jsonObjectProfessors.map((item) => item["_id"] as String).toList();
      List<dynamic> firstNames = jsonObjectProfessors.map((item) => item["First_Name"] as String).toList();
      List<dynamic> lastNames = jsonObjectProfessors.map((item) => item["Last_Name"] as String).toList();
      professorList = List.generate(firstNames.length, (i) => "${lastNames[i]} - ${firstNames[i]}");
      List<String> tempIdsList = List.generate(ids.length, (i) => "${ids[i]}");
      professorIdMap = Map.fromIterables(professorList, tempIdsList);
      print(professorList);
      print(professorIdMap);
    }
    catch (e) {
      newMessageText = e.toString();
      changeText();
      return;
    }

    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    print('opened create rating screen');
    loadDropdownLists();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // route observer used to clear previous dropdown when going back to create rating page
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    // route observer used to clear previous dropdown when going back to create rating page
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  void didPopNext() {
    // called when coming back from another page
    setState(() {
      message = "";
      newMessageText = "";
    });
  }

  // method to change the state of select widget attributes when called
  void changeText() {
    setState(() {
      message = newMessageText;
    });
  }

  // sets course rating each time one is selected from dropdown
  void setCourseRating(int val, String question) {
    setState(() {
      message = '';
      selectedCourseRatings[question] = val;
      print(selectedCourseRatings);
    });
  }

  // submits the selected ratings
  void submitRatings() async {
    print('Final Selected Ratings: ${selectedCourseRatings}');
    // check that course ratings have been selected for all course questions
    if (selectedCourseRatings.values.contains(0)) {
      newMessageText = 'Please answer all course questions.';
      changeText();
      return;
    }
    // when a professor is selected, check that professor ratings have been selected for all professor questions
    if (isProfessorRated) {
      if (selectedProfessorRatings.values.contains(0)) {
        newMessageText = 'Please answer all professor questions.';
        changeText();
        return;
      }
    }
    // send rating to database
    String url = "http://leandrovivares.com/api/ratings";
    String payload = '{'
      '"User":"${context.read<GlobalData>().userId}", '
      '"Course":"${context.read<GlobalData>().selectedCourseId}", '
      '"Professor": ${isProfessorRated ? "${context.read<GlobalData>().selectedProfessorId}" : null}, '
      '"Option_A_Count": ${selectedCourseRatings["Q1"]}, '
      '"Option_B_Count": ${selectedCourseRatings["Q2"]}, '
      '"Option_C_Count": ${selectedCourseRatings["Q3"]}, '
      '"Option_D_Count": ${selectedCourseRatings["Q4"]}, '
      '"Option_E_Count": ${selectedCourseRatings["Q5"]}, '
      '"Professor_Rated": ${isProfessorRated}, '
      '"Option_F_Count": ${isProfessorRated ? "${selectedProfessorRatings["Q1"]}" : 1}, '
      '"Option_G_Count": ${isProfessorRated ? "${selectedProfessorRatings["Q2"]}" : 1}, '
      '"Option_H_Count": ${isProfessorRated ? "${selectedProfessorRatings["Q3"]}" : 1}, '
      '"Option_I_Count": ${isProfessorRated ? "${selectedProfessorRatings["Q4"]}" : 1}, '
      '"Option_J_Count": ${isProfessorRated ? "${selectedProfessorRatings["Q5"]}" : 1} '
      '}';

    print(payload);
    try {
      String ret = await AppDataPost.getJSON(url, payload);
      Map<String, dynamic> decoded = json.decode(ret);
      print(decoded);
      print('decoded["__v"] = ${decoded["__v"]}');
// redirect back to the home page
    } catch (e) {
      print('Course questionnaire submit answer error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<GlobalData>(); // widget rebuilds if changes are made to global data
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: 300,
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(height: 40.0),
              // page title
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      'Create Rating',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 28.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20.0),
              // course title
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      'Course:  ${context.read<GlobalData>().selectedCourse}',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 40.0),
              Column(
                children: [
                  ...courseRatingsQuestions.entries.map((entry) {
                    return Column(
                      children: [
                        // row for question description
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget> [
                            Expanded(
                              child: Text(
                                entry.value,
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
                        // row for question multiple-choice dropdown menu
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            SizedBox(
                              width: 250,
                              child: DropdownMenu(
                                width: double.infinity,
                                initialSelection: 0,
                                inputDecorationTheme: InputDecorationTheme(
                                  filled: true,
                                  fillColor: Colors.white,
                                ),
                                enableSearch: true,
                                enableFilter: true,
                                requestFocusOnTap: true,
                                onSelected: (val) {
                                  if (val != null) {
                                    String curKey = entry.key;
                                    print('val = ${val}');
                                    setCourseRating(val, curKey);
                                  }
                                  else {
                                    print('Error - null value in dropdown menu');
                                  }
                                },
                                dropdownMenuEntries: [
                                  DropdownMenuEntry<int>(
                                    value: 0,
                                    label: "Select a Rating",
                                  ),
                                  ...courseQuestionOptions.entries.map((item) {
                                    return DropdownMenuEntry<int>(
                                      value: item.key,
                                      label: item.value,
                                    );
                                  }).toList(),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 30.0),
                      ],
                    );
                  }).toList(),
                ],
              ),
              SizedBox(height: 10.0),
              Center(
                child: SizedBox(
                  width: 200.0,
                  child: ElevatedButton(
                    onPressed: () {
                      print('Clicked \'Submit Rating\' Button');
                      submitRatings();
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
                      'Submit Rating',
                      style: TextStyle(fontSize: 15.0),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
              if (message != '') ... [
                Text(
                  message,
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 14.0,
                    fontWeight: FontWeight.bold,
                  )
                ),
              ],
              SizedBox(height: 100.0),
            ],
          ),
        ),
      ),
    );
  }
}
