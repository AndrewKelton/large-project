import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';


// widget for the home screen
class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  @override
  void initState() {
    super.initState();
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
        automaticallyImplyLeading: false,
      ),
      backgroundColor: Colors.blue,
      body: HomePage(),
    );
  }
}

// widget for the home page
class HomePage extends StatefulWidget {

  @override
  State<HomePage> createState() => _HomePageState();
}

// widget for building the home page
class _HomePageState extends State<HomePage> with RouteAware {
  String message = "";
  String newMessageText = "";

  late Map<String, String> courseIdMap = {}; // key=course_dropdown, value=course_id
  late Map<String, String> courseNameMap = {}; // key=course_dropdown, value=course_name
  late Map<String,String> professorIdMap = {}; // key=profess_dropdown, value=professor_id
  late List<String> courseList = []; // course dropdown list
  late List<String> professorList = []; // professor drop list
  late String selectedCourse = ''; // course selected from dropdown
  late String selectedProfessor = ''; // professor selected from dropdown

  void loadDropdownLists() async {

    var jsonObjectCourses;
    var jsonObjectProfessors;

    // get courses table from database
    try {
      String url = 'http://leandrovivares.com/api/courses';
      String ret = await DropdownData.getJSON(url);
      jsonObjectCourses = json.decode(ret);
      List<dynamic> ids = jsonObjectCourses.map((item) => item["_id"] as String).toList();
      List<dynamic> names = jsonObjectCourses.map((item) => item["Name"] as String).toList();
      List<dynamic> courses = jsonObjectCourses.map((item) => item["Code"] as String).toList();
      courseList = List.generate(courses.length, (i) => "${courses[i]}");
      List<String> tempIdsList = List.generate(ids.length, (i) => "${ids[i]}");
      List<String> tempNamesList = List.generate(names.length, (i) => "${names[i]}");
      courseIdMap = Map.fromIterables(courseList, tempIdsList);
      courseNameMap = Map.fromIterables(courseList, tempNamesList);
      print(courseList);
    }
    catch (e) {
      newMessageText = e.toString();
      changeText();
      return;
    }

    // get professors table from database
    try {
      String url = 'http://leandrovivares.com/api/professors';
      String ret = await DropdownData.getJSON(url);
      jsonObjectProfessors = json.decode(ret);
      List<dynamic> ids = jsonObjectProfessors.map((item) => item["_id"] as String).toList();
      List<dynamic> firstNames = jsonObjectProfessors.map((item) => item["First_Name"] as String).toList();
      List<dynamic> lastNames = jsonObjectProfessors.map((item) => item["Last_Name"] as String).toList();
      professorList = List.generate(firstNames.length, (i) => "${lastNames[i]} - ${firstNames[i]} ");
      List<String> tempIdsList = List.generate(ids.length, (i) => "${ids[i]}");
      professorIdMap = Map.fromIterables(professorList, tempIdsList);
      print(professorList);
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
    print('testing home screen');
    loadDropdownLists();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // route observer used to clear previous dropdown when going back to home page
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    // route observer used to clear previous dropdown when going back to home page
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

  // sets course each time course is selected from dropdown
  void setCourse(String course) {
    setState(() {
      selectedCourse = course.trim();
    });
  }

  // sets professor each time course is selected from dropdown
  void setProfessor(String professor) {
    setState(() {
      selectedProfessor = professor.trim();
    });
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
              // row for course dropdown label
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      'Course Dropdown',
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
              // row for coursedropdown menu
              Row(
                children: <Widget> [
                  Container(
                    width: 250,
                    child: DropdownMenu(
                      width: double.infinity,
                      inputDecorationTheme: InputDecorationTheme(
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      enableSearch: true,
                      enableFilter: true,
                      requestFocusOnTap: true,
                      onSelected: (text) {
                        setCourse(text ?? "");
                      },
                      dropdownMenuEntries: [
                        DropdownMenuEntry<String>(
                          value: "", // empty value
                          label: "Select Course",
                        ),
                        ...courseList.map((item) {
                          return DropdownMenuEntry<String>(
                            value: item,
                            label: item,
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                ],
              ),
              // row for professor dropdown label
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      'Professor Dropdown',
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
              // row for professor dropdown menu
              Row(
                children: <Widget> [
                  Container(
                    width: 250,
                    child: DropdownMenu(
                      width: double.infinity,
                      inputDecorationTheme: InputDecorationTheme(
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      enableSearch: true,
                      enableFilter: true,
                      requestFocusOnTap: true,
                      onSelected: (text) {
                        setProfessor(text ?? "");
                      },
                      dropdownMenuEntries: [
                        DropdownMenuEntry<String>(
                          value: "", // empty value
                          label: "Select Professor",
                        ),
                        ...professorList.map((item) {
                          return DropdownMenuEntry<String>(
                            value: item,
                            label: item,
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                ],
              ),
              // row for create rating button (build conditionally - course must be selected)
              if (selectedCourse != '') ... [
                SizedBox(height: 15.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(
                      width: 250,
                      child: CreateRatingButton(
                        onPressed: () async {
                          newMessageText = "";
                          changeText();
                          print('Create Rating Button:');
                          print('Selected Course: ${selectedCourse}');
                          print('Selected Professor: ${selectedProfessor}');
                        },
                        course: selectedCourse,
                        professor: selectedProfessor,
                      ),
                    ),
                  ],
                ),
              ], // end of create rating button conditional subtree
              // row for create questionnaire button (build conditionally - course must be selected)
              if (selectedCourse != '') ... [
                SizedBox(height: 5.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(
                      width: 250,
                      child: CreateQuestionnaireButton(
                        onPressed: () async {
                          newMessageText = "";
                          changeText();
                          print('Create Questionnaire Button:');
                          print('Selected Course: ${selectedCourse}');
                          print('Selected Professor: ${selectedProfessor}');
                        },
                        course: selectedCourse,
                        professor: selectedProfessor,
                      ),
                    ),
                  ],
                ),
              ], // end of create rating button conditional subtree
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
              // row (conditional) for selected course summary
              if (selectedCourse != '') ... [
                // row for course summary label
                SizedBox(height: 20.0),
                Row(
                  children: <Widget> [
                    Expanded(
                      child: Text(
                        "Course Summary",
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
                // row for course code-name title
                SizedBox(height: 20.0),
                Row(
                  children: <Widget> [
                    Expanded(
                      child: Text(
                        "${selectedCourse}\n${courseNameMap[selectedCourse]}",
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
                // row for course ratings title
                SizedBox(height: 20.0),
                // summary of course ratings
                CourseRatingsSummary(courseId: courseIdMap[selectedCourse] ?? ''),
              ], // end of selected courses conditional subtree
            ],
          ),
        ),
      ),
    );
  }
}

// custom class for the home page button
abstract class HomePageButton extends StatelessWidget {
  // function initialized from constructor
  final VoidCallback onPressed;

  // constructor
  const HomePageButton({required this.onPressed});

  // abstract method - creates label for the button
  String getLabel();

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
        getLabel(),
        style: TextStyle(fontSize: 14.0),
        textAlign: TextAlign.center,
      ),
    );
  }
}

// custom class for the create rating button
class CreateRatingButton extends HomePageButton {
  // course selected
  final String course;
  // professor selected (if selected)
  final String professor;
  // constructor
  const CreateRatingButton({required VoidCallback onPressed, required this.course, required this.professor}) : super(onPressed: onPressed);

  // creates label for the button
  @override
  String getLabel() {

    String label = 'Rate ' + course;

    if (professor != '') {
      List<String> parts = professor.split("-");
      label += ' with ' + parts[1].trim() + ' ' + parts[0].trim();
    }
    return label;
  }
}

// custom class for the create rating button
class CreateQuestionnaireButton extends HomePageButton {
  // course selected
  final String course;
  // professor selected (if selected)
  final String professor;
  // constructor
  const CreateQuestionnaireButton({required VoidCallback onPressed, required this.course, required this.professor}) : super(onPressed: onPressed);

  // creates label for the button
  @override
  String getLabel() {

    String label = 'Create Questionnaire for ' + course;

    if (professor != '') {
      List<String> parts = professor.split("-");
      label += ' with ' + parts[1].trim() + ' ' + parts[0].trim();
    }
    return label;
  }
}


// widget for building the course rating summary section
class CourseRatingsSummary extends StatefulWidget {

  // course id
  final String courseId;

  // constructor
  const CourseRatingsSummary({required this.courseId});

  @override
  State<CourseRatingsSummary> createState() => _CourseRatingsSummaryState();
}

// custom class for the home page button
class _CourseRatingsSummaryState extends State<CourseRatingsSummary> {

  // total number of ratings
  late int numCourseRatings = 0;
  // course ratings summary data
  late List<double> courseRatingsList = [];

  @override initState() {
    super.initState();
    loadCourseRatings();
    print(widget.courseId);
  }

  void loadCourseRatings() async {

    var jsonObjectCourseRatings;

    // get courses table from database
    try {
      String url = 'http://leandrovivares.com/api/fetchratings/course/';
      String ret = await DropdownData.getJSON(url + widget.courseId.trim());
      jsonObjectCourseRatings = json.decode(ret);

      numCourseRatings = jsonObjectCourseRatings["totalRatings"];
      courseRatingsList.add(jsonObjectCourseRatings["averageQ1"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ2"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ3"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ4"]);

      print(numCourseRatings);
      print(courseRatingsList);
    }
    catch (e) {
      print(e.toString());
      return;
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // course summary title
        Row(
          children: <Widget> [
            Expanded(
              child: Text(
                'Course Ratings (${numCourseRatings} total)',
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
        // row for Q1 course ratings
        Row(
          children: <Widget> [
            Expanded(
              child: Text(
                'Q1:  ${courseRatingsList.isNotEmpty ? courseRatingsList[0] : 'Loading...'}',
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ],
        ),
        // row for Q2 course ratings
        Row(
          children: <Widget> [
            Expanded(
              child: Text(
                'Q2:  ${courseRatingsList.isNotEmpty ? courseRatingsList[1] : 'Loading...'}',
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ],
        ),
        // row for Q3 course ratings
        Row(
          children: <Widget> [
            Expanded(
              child: Text(
                'Q3:  ${courseRatingsList.isNotEmpty ? courseRatingsList[2] : 'Loading...'}',
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ],
        ),
        // row for Q4 course ratings
        Row(
          children: <Widget> [
            Expanded(
              child: Text(
                'Q4:  ${courseRatingsList.isNotEmpty ? courseRatingsList[3] : 'Loading...'}',
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
