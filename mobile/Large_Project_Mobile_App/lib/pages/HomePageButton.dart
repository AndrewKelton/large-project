import 'package:flutter/material.dart';


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
        style: TextStyle(fontSize: 15.0),
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
      label += ' with ' + professor.trim();
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
      label += ' with ' + professor.trim();
    }
    return label;
  }
}


