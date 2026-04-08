import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'dart:convert';


// widget for building the professor rating summary section
class ProfessorRatingsSummary extends StatefulWidget {

  // course id
  final String courseId;
  // professor id
  final String professorId;

  // constructor
  const ProfessorRatingsSummary({required this.courseId, required this.professorId});

  @override
  State<ProfessorRatingsSummary> createState() => _ProfessorRatingsSummaryState();
}

Widget _buildRatingTile(double ratingNum, String badTag, String goodTag) {
  if (2 < ratingNum && ratingNum < 4) return SizedBox.shrink();

  final bool isBad = ratingNum <= 2;

  return Container(
    padding: EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
    decoration: BoxDecoration(
      color: isBad ? Colors.red.shade300 : Colors.green.shade300,
      borderRadius: BorderRadius.circular(25.0),
      border: Border.all(
        color: isBad ? Colors.red.shade200 : Colors.green.shade200,
        width: 5.0,
      ),
    ),
    child: Text(
      isBad ? badTag : goodTag,
      style: TextStyle(
        color: Colors.black,
        fontWeight: FontWeight.bold,
      ),
    ),
  );
}

// this widget holds the question, numeric rating value, and shaded stars for q1->q5
Widget _RatingCard(String question, double rating) {
  double ParsedRating = rating ?? 0;

  return Container(
      width: double.infinity,
      margin: EdgeInsets.symmetric(vertical: 6.0),
      padding: EdgeInsets.symmetric(vertical: 16.0, horizontal: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(7.5),
        border: Border.all(color: Colors.grey.shade300, width: 1.5),
      ),
      child: Column(
          children: [
            Text(question, textAlign: TextAlign.center, style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold)),
            SizedBox(height: 4.0),
            Text('$rating / 5', textAlign: TextAlign.center, style: TextStyle(fontSize: 17.0, fontWeight: FontWeight.bold, )),
            SizedBox(height: 4.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                if (index < ParsedRating.floor()) return Icon(Icons.star, color: Colors.black);
                if (index < ParsedRating) return Icon(Icons.star_half, color: Colors.black);
                return Icon(Icons.star_border, color: Colors.black);
              }),
            )
          ]
      )
  );
}

// custom class for displaying professor ratings summary
class _ProfessorRatingsSummaryState extends State<ProfessorRatingsSummary> {

  // total number of ratings
  late int numProfessorRatings = 0;
  // professor ratings summary data
  late List<double> professorRatingsList = [];

  @override initState() {
    super.initState();
    loadProfessorRatings();
    print(widget.courseId);
    print(widget.professorId);
  }

  @override
  void didUpdateWidget(ProfessorRatingsSummary oldWidget) {
    super.didUpdateWidget(oldWidget);
    // reload only if courseId or professor Id actually changed
    if (oldWidget.courseId != widget.courseId || oldWidget.professorId != widget.professorId) {
      professorRatingsList = [];   // clear old data
      numProfessorRatings = 0;
      loadProfessorRatings();
    }
  }

  void loadProfessorRatings() async {

    var jsonObjectProfessorRatings;

    // get professor ratings from database
    try {
      String url = 'http://leandrovivares.com/api/fetchratings/course/';
      String ret = await AppDataGet.getJSON(url + widget.courseId.trim() + '/professor/' + widget.professorId.trim());
      jsonObjectProfessorRatings = json.decode(ret);

      setState (() {
        numProfessorRatings = jsonObjectProfessorRatings["totalProfessorRatings"];
        professorRatingsList = [
          jsonObjectProfessorRatings["averageQ6"].toDouble(),
          jsonObjectProfessorRatings["averageQ7"].toDouble(),
          jsonObjectProfessorRatings["averageQ8"].toDouble(),
          jsonObjectProfessorRatings["averageQ9"].toDouble(),
          jsonObjectProfessorRatings["averageQ10"].toDouble(),
        ];
      });
      print(numProfessorRatings);
      print(professorRatingsList);
    }
    catch (e) {
      print(e.toString());
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    // collect ratings for each question
    double q1Rating = professorRatingsList.isNotEmpty ? professorRatingsList[0] : 0;
    double q2Rating = professorRatingsList.isNotEmpty ? professorRatingsList[1] : 0;
    double q3Rating = professorRatingsList.isNotEmpty ? professorRatingsList[2] : 0;
    double q4Rating = professorRatingsList.isNotEmpty ? professorRatingsList[3] : 0;
    double q5Rating = professorRatingsList.isNotEmpty ? professorRatingsList[4] : 0;

    return Column(
      children: [
        if (numProfessorRatings == 0) ... [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget> [
              Expanded(
                child: Text(
                  'No ratings yet',
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
        ]  // end of IF statement for selected courses summary
        else ... [  // enter if professor has at least 1 rating for the selected course
          // professor summary title
          Row(
            children: <Widget> [
              Expanded(
                child: Text(
                  'Professor Ratings (${numProfessorRatings} total)',
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

          // Container for professor tags
          Container(
            width: double.infinity,
            margin: EdgeInsets.symmetric(vertical: 5.0),
            padding: EdgeInsets.symmetric(vertical: 15.0, horizontal: 10.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(7.5),
            ),
            child: Wrap(
              spacing: 5.0, // horizontal gap
              runSpacing: 5.0, // vertical gap
              alignment: WrapAlignment.center,
              children: [
                // rating pills for q[1-5]Ratings
                _buildRatingTile(q1Rating, "Poorly Rated", "Highly Rated"),
                _buildRatingTile(q2Rating, "Unclear Explanations", "Good Explainer"),
                _buildRatingTile(q3Rating, "Hard to Reach", "Very Accessible"),
                _buildRatingTile(q4Rating, "Unfair Grader", "Fair Grader"),
                _buildRatingTile(q5Rating, "Not Recommended", "Recommended"),
              ],
            ),
          ),

          // rows for professor ratings (questions and answer summary)
          _RatingCard('Overall, how would you rate this professor?', q1Rating),
          _RatingCard('How clearly did the professor explain the material?', q2Rating),
          _RatingCard('How available was the professor outside of class?', q3Rating),
          _RatingCard('How fairly did the professor grade assignments?', q4Rating),
          _RatingCard('Would you recommend this professor to others?', q5Rating),
      ], // end of ELSE statement for selected course summary
      ], // end of list of children for column
    );
  }
}
