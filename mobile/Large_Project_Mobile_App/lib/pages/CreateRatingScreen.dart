import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:group7_mobile_app/main.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:group7_mobile_app/pages/RatingForm.dart';
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

  late Map<String,String> professorIdMap = {}; // key=profess_dropdown, value=professor_id
  late List<String> professorList = []; // professor drop list
  late String selectedProfessorName = context.read<GlobalData>().selectedProfessor; // professor selected from dropdown

  final Map<int, String> courseQuestionOptions = {1: '1 - Very Poor', 2: '2 - Poor', 3: '3 - Average', 4: '4 - Good', 5: '5 - Excellent'};
  final Map<String, String> courseRatingsQuestions = {
    'Q1': 'Overall, how would you rate this course?',
    'Q2': 'How would you rate the course difficulty?',
    'Q3': 'How manageable was the course workload?',
    'Q4': 'Do you feel that you will retain the material from the course?',
    'Q5': 'Would you recommend this course to others?'};
  late Map<String, int> selectedCourseRatings = {'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'Q5': 0};

  final Map<int, String> professorQuestionOptions = {1: '1 - Very Poor', 2: '2 - Poor', 3: '3 - Average', 4: '4 - Good', 5: '5 - Excellent'};
  final Map<String, String> professorRatingsQuestions = {
    'Q1': 'Overall, how would you rate this professor?',
    'Q2': 'How clearly did the professor explain the material?',
    'Q3': 'How available was the professor outside of class?',
    'Q4': 'How fairly did the professor grade assignments?',
    'Q5': 'Would you recommend this professor to others?'};
  late Map<String, int> selectedProfessorRatings = {'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0, 'Q5': 0};

  // flag to track whether the user has selected to rate a professor
  late bool isProfessorRated = ((context.read<GlobalData>().selectedProfessor == '') ? isProfessorRated = false : isProfessorRated = true);

  // retrives the list of professors from the database
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

  // sets professor rating each time one is selected from dropdown
  void setProfessorRating(int val, String question) {
    setState(() {
      message = '';
      selectedProfessorRatings[question] = val;
      print(selectedProfessorRatings);
    });
  }

  // submits the selected ratings
  void submitRatings() async {
    print('Final Selected Course Ratings: ${selectedCourseRatings}');
    print('Final Selected Professor Ratings: ${selectedProfessorRatings}');
    print('Professor: ${selectedProfessorName}');
    // check that course ratings have been selected for all course questions
    if (selectedCourseRatings.values.contains(0)) {
      newMessageText = 'Please answer all course questions.';
      changeText();
      return;
    }
    // when a professor is selected, check that professor ratings have been selected for all professor questions
    if (isProfessorRated) {
      if (selectedProfessorName == '') {
        newMessageText = 'Please select a professor.';
        changeText();
        return;
      }
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
      '"Professor": ${isProfessorRated ? "\"${context.read<GlobalData>().selectedProfessorId}\"" : null}, '
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
      if (decoded["__v"] == null) {
        newMessageText = decoded['message'];
        changeText();
      }
      else {
// redirect back to the home page
        print('redirect to home page');
      }
    } catch (e) {
      print('Course questionnaire submit answer error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<GlobalData>(); // rebuild widget if global data changes
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
                        fontSize: 24.0,
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
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 10.0),
              // professor's name
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      (context.read<GlobalData>().selectedProfessor == '') ? 'Professor: Not Selected' : 'Professor:  ${context.read<GlobalData>().selectedProfessor}',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 5.0),
              // divider line across the screen
              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 30,
              ),
              // instructions to user
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      'Please answer the following questions from the dropdown menu, with 1 being the lowest rating, and 5 being the highest rating',
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
              // divider line across the screen
              Divider(
                thickness: 2,
                color: Colors.black,
                indent: 20,
                endIndent: 20,
                height: 30,
              ),
              SizedBox(height: 5.0),
              // row for title of section for course rating questions
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      'Course Rating Questions',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 30.0),
              // course rating questions and dropdown options
              RatingForm(
                questionOptions: courseQuestionOptions,
                ratingsQuestions: courseRatingsQuestions,
                onSetRating: setCourseRating,
              ),
              SizedBox(height: 20.0),
              // row for checkbox
              Row(
                children: [
                  Checkbox(
                    value: isProfessorRated,
                    onChanged: (bool? newValue) {
                      setState(() {
                        isProfessorRated = newValue ?? false;
                        if (isProfessorRated == false) {
                          selectedProfessorName = '';
                          newMessageText = '';
                          changeText();
                          context.read<GlobalData>().setSelectedProfessorId('');
                          context.read<GlobalData>().setSelectedProfessor('');
                        }
                      });
                    },
                  ),
                  Expanded(
                    child: Text(
                      'Would you like to also rate a professor?',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 30.0),
              if (isProfessorRated == true) ... [
                // divider line across the screen
                Divider(
                  thickness: 2,
                  color: Colors.black,
                  indent: 20,
                  endIndent: 20,
                  height: 30,
                ),
                SizedBox(height: 10.0),
                // row for professor dropdown menu
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget> [
                    Expanded(
                      child: Text(
                        'Select Professor',
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget> [
                    Container(
                      width: 250,
                      child: professorList.isEmpty
                        ? CircularProgressIndicator()
                        : DropdownMenu(
                          width: double.infinity,
                          initialSelection: context.read<GlobalData>().selectedProfessor,
                          inputDecorationTheme: InputDecorationTheme(
                            filled: true,
                            fillColor: Colors.white,
                          ),
                          enableSearch: true,
                          enableFilter: true,
                          requestFocusOnTap: true,
                          onSelected: (text) {
                            print('Before: GlobalData.selectedProfessor: ${context.read<GlobalData>().selectedProfessor}');
                            print('Before: GlobalData.selectedProfessorId: ${context.read<GlobalData>().selectedProfessorId}');
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
                SizedBox(height: 40.0),
                // row for title of section for professor rating questions
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        'Professor Rating Questions',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 20.0,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 30.0),
                // professor rating questions and dropdown options
                RatingForm(
                  questionOptions: professorQuestionOptions,
                  ratingsQuestions: professorRatingsQuestions,
                  onSetRating: setProfessorRating,
                ),
              ],
              // submit rating button
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
              // row for potential error message after submitting rating
              if (message != '') ... [
                SizedBox(height: 20.0),
                Text(
                  message,
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 16.0,
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


