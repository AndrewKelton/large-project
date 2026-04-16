import 'package:flutter/material.dart';


// custom class for the course or professor ratings
class RatingForm extends StatefulWidget {

  // dropdown options for the course or professor questions (see parent widget)
  final Map<int, String> questionOptions;
  // course or professor questions (see parent widget)
  final Map<String, String> ratingsQuestions;
  // reference to the parent methods setCourseRating or setProfessorRating
  final void Function(int val, String key) onSetRating;

  const RatingForm({super.key, required this.questionOptions, required this.ratingsQuestions, required this.onSetRating});

  @override
  State<RatingForm> createState() => _RatingFormState();
}

class _RatingFormState extends State<RatingForm> {

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ...(widget.ratingsQuestions).entries.map((entry) {
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
              // row for answers dropdown menu
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
                          // call reference to parent method 'setProfessorRating'
                          widget.onSetRating(val, curKey);
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
                        ...(widget.questionOptions).entries.map((item) {
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
    );
  }
}