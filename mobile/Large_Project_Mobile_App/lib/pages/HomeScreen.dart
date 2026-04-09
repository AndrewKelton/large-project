import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/pages/HomePageButton.dart';
import 'package:group7_mobile_app/pages/CourseRatingsSummary.dart';
import 'package:group7_mobile_app/pages/ProfessorRatingsSummary.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';


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
  late String selectedCourseCode = ''; // course selected from dropdown
  late String selectedProfessorName = ''; // professor selected from dropdown

  void loadDropdownLists() async {

    var jsonObjectCourses;
    var jsonObjectProfessors;

    // get courses table from database
    try {
      String url = 'http://leandrovivares.com/api/courses';
      String ret = await AppDataGet.getJSON(url);
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
      String ret = await AppDataGet.getJSON(url);
      jsonObjectProfessors = json.decode(ret);
      List<dynamic> ids = jsonObjectProfessors.map((item) => item["_id"] as String).toList();
      List<dynamic> firstNames = jsonObjectProfessors.map((item) => item["First_Name"] as String).toList();
      List<dynamic> lastNames = jsonObjectProfessors.map((item) => item["Last_Name"] as String).toList();
      professorList = List.generate(firstNames.length, (i) => "${firstNames[i]} ${lastNames[i]}");
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
    print('opened home screen');
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

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: 400,
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start, // center column contents vertically
            crossAxisAlignment: CrossAxisAlignment.center, // center column contents horizontally
            children: <Widget> [
              SizedBox(height: 100.0),
              // row for course dropdown label
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
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
              // row for course dropdown menu
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                  Container(
                    width: 250,
                    child: DropdownMenu(
                      width: double.infinity,
                      initialSelection: "",
                      inputDecorationTheme: InputDecorationTheme(
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      enableSearch: true,
                      enableFilter: true,
                      requestFocusOnTap: true,
                      onSelected: (text) {
                        print('text-course = ${text}');
                        selectedCourseCode = text ?? '';
                        String? courseId = courseIdMap[text] ?? '';
                        String? courseName = courseNameMap[text] ?? '';
                        String courseNameGlobal = (selectedCourseCode == '') ? '' : ('${selectedCourseCode} - ${courseName}');
                        print('selectedCourseCode = ${selectedCourseCode}');
                        print('courseId = ${courseId}');
                        print('courseName = ${courseName}');
                        context.read<GlobalData>().setSelectedCourseId(courseId);
                        context.read<GlobalData>().setSelectedCourse(courseNameGlobal);
                        print('GlobalData.selectedCourse: ${context.read<GlobalData>().selectedCourse}');
                        print('GlobalData.selectedCourseId: ${context.read<GlobalData>().selectedCourseId}');
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
                mainAxisAlignment: MainAxisAlignment.center,
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
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget> [
                  Container(
                    width: 250,
                    child: DropdownMenu(
                      width: double.infinity,
                      initialSelection: "",
                      inputDecorationTheme: InputDecorationTheme(
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      enableSearch: true,
                      enableFilter: true,
                      requestFocusOnTap: true,
                      onSelected: (text) {
                        print('text-professor = ${text}');
                        selectedProfessorName = text ?? '';
                        String? professorId = professorIdMap[text] ?? '';
                        print('selectedProfessorName = ${selectedProfessorName}');
                        print('professorId = ${professorId}');
                        context.read<GlobalData>().setSelectedProfessorId(professorId);
                        context.read<GlobalData>().setSelectedProfessor(selectedProfessorName);
                        print('GlobalData.selectedProfessor: ${context.read<GlobalData>().selectedProfessor}');
                        print('GlobalData.selectedProfessorId: ${context.read<GlobalData>().selectedProfessorId}');
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
              if (selectedCourseCode != '') ... [
                SizedBox(height: 15.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(
                      width: 300,
                      child: CreateRatingButton(
                        onPressed: () {
                          newMessageText = "";
                          changeText();
                          print('Create Rating Button:');
                          print('Selected Course: ${selectedCourseCode}');
                          print('Selected Professor: ${selectedProfessorName}');
                        },
                        course: selectedCourseCode,
                        professor: selectedProfessorName,
                      ),
                    ),
                  ],
                ),
              ], // end of create rating button conditional subtree
              // row for create questionnaire button (build conditionally - course must be selected)
              if (selectedCourseCode != '') ... [
                SizedBox(height: 5.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(
                      width: 300,
                      child: CreateQuestionnaireButton(
                        onPressed: () async {
                          newMessageText = "";
                          changeText();
                          print('Create Questionnaire Button:');
                          print('Selected Course: ${selectedCourseCode}');
                          print('Selected Professor: ${selectedProfessorName}');
                        },
                        course: selectedCourseCode,
                        professor: selectedProfessorName,
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
              // row for course summary label
              SizedBox(height: 20.0),
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      "Course Summary",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 35.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for selected course summary
              if (selectedCourseCode != '') ... [
                // row for course code-name title
                SizedBox(height: 20.0),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget> [
                    // Holds course code title bar
                    Container(
                      width: 175,
                      padding: EdgeInsets.symmetric(vertical: 5.0),
                      decoration: BoxDecoration(
                        color: Color(0xFF2575FF),
                        borderRadius: BorderRadius.circular(7.5),
                        border: Border.all(color: Color(0xFF2575FF), width: 5),
                      ),
                      child: Text("${selectedCourseCode}", textAlign: TextAlign.center, style: TextStyle(fontSize: 25.0, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                    SizedBox(height:10.0),
                    // Holds course name title bar
                    Container(
                      width: 450,
                      padding: EdgeInsets.symmetric(vertical: 5.0),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(7.5),
                        border: Border.all(color: Colors.white, width: 1.5),
                      ),
                      child: Text("${courseNameMap[selectedCourseCode]}", textAlign: TextAlign.center, style: TextStyle(fontSize: 25.0, fontWeight: FontWeight.bold, color: Colors.black)),
                    ),
                  ],
                ),
                SizedBox(height: 20.0),
                // summary of course ratings
                CourseRatingsSummary(courseId: courseIdMap[selectedCourseCode] ?? ''),
              ] // end of IF statement for selected courses summary
              else ... [ // enter if no course is selected
                // row for message to indicate no course selected
                SizedBox(height: 15.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget> [
                    Expanded(
                      child: Text(
                        'No course selected',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ], // end of ELSE statement for selected course summary
              // row for professor summary label
              SizedBox(height: 20.0),
              Row(
                children: <Widget> [
                  Expanded(
                    child: Text(
                      "Professor Summary",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 35.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
              // row (conditional) for selected professor summary
              if (selectedCourseCode != '' && selectedProfessorName != '') ... [
                // row for professor name
                SizedBox(height: 20.0),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget> [
                    // Holds professor name title bar
                    Container(
                      width: 175,
                      padding: EdgeInsets.symmetric(vertical: 5.0),
                      decoration: BoxDecoration(
                        color: Color(0xFF2575FF),
                        borderRadius: BorderRadius.circular(7.5),
                        border: Border.all(color: Color(0xFF2575FF), width: 5),
                      ),
                      child: Text("${selectedProfessorName}", textAlign: TextAlign.center, style: TextStyle(fontSize: 25.0, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                SizedBox(height: 20.0),
                // summary of professor ratings
                ProfessorRatingsSummary(courseId: courseIdMap[selectedCourseCode] ?? '', professorId: professorIdMap[selectedProfessorName] ?? ''),
              ] // end of IF statement for selected courses summary
              else ... [ // enter if no professor is selected
                // row for message to indicate no professor selected
                SizedBox(height: 15.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget> [
                    Expanded(
                      child: Text(
                        'You need to select a course with a professor',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ],  // end of ELSE statement for selected professor summary
              // some space at the bottom of the screen
              SizedBox(height: 80.0),
            ], // end of children array for column
          ),
        ),
      ),
    );
  }
}

