import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'dart:convert';
import 'package:group7_mobile_app/pages/CourseQuestionnaireResults.dart';


// widget for building the course rating summary section
class CourseRatingsSummary extends StatefulWidget {

  // course id
  final String courseId;

  // constructor
  const CourseRatingsSummary({required this.courseId});

  @override
  State<CourseRatingsSummary> createState() => _CourseRatingsSummaryState();
}

// custom class for displaying course ratings summary
class _CourseRatingsSummaryState extends State<CourseRatingsSummary> {

  // total number of ratings
  late int numCourseRatings = 0;
  // course ratings summary data
  late List<double> courseRatingsList = [];

  // stores all questions
  late List<String> questionList = [];

  @override initState() {
    super.initState();
    loadCourseRatings();
    print(widget.courseId);
  }

  @override
  void didUpdateWidget(CourseRatingsSummary oldWidget) {
    super.didUpdateWidget(oldWidget);
    // reload only if courseId actually changed
    if (oldWidget.courseId != widget.courseId) {
      courseRatingsList = [];   // clear old data
      numCourseRatings = 0;
      loadCourseRatings();
    }
  }

  void loadCourseRatings() async {

    var jsonObjectCourseRatings;

    // get course ratings from database
    try {
      String url = 'http://leandrovivares.com/api/fetchratings/course/';
      String ret = await AppDataGet.getJSON(url + widget.courseId.trim());
      jsonObjectCourseRatings = json.decode(ret);

      setState(() {
        numCourseRatings = jsonObjectCourseRatings["totalRatings"];
        courseRatingsList = [
          jsonObjectCourseRatings["averageQ1"].toDouble(),
          jsonObjectCourseRatings["averageQ2"].toDouble(),
          jsonObjectCourseRatings["averageQ3"].toDouble(),
          jsonObjectCourseRatings["averageQ4"].toDouble(),
          jsonObjectCourseRatings["averageQ5"].toDouble(),
        ];
      });

      print(numCourseRatings);
      print(courseRatingsList);
    }
    catch (e) {
      print(e.toString());
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    // collect ratings for each question
    double q1Rating = courseRatingsList.isNotEmpty ? courseRatingsList[0] : 0;
    double q2Rating = courseRatingsList.isNotEmpty ? courseRatingsList[1] : 0;
    double q3Rating = courseRatingsList.isNotEmpty ? courseRatingsList[2] : 0;
    double q4Rating = courseRatingsList.isNotEmpty ? courseRatingsList[3] : 0;
    double q5Rating = courseRatingsList.isNotEmpty ? courseRatingsList[4] : 0;

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
                  fontSize: 25.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        // rows for course ratings (questions and answer summary)
        _RatingCard('Overall, how would you rate this course?', q1Rating),
        _RatingCard('How would you rate the course difficulty?', q2Rating),
        _RatingCard('How manageable was the course workload?', q3Rating),
        _RatingCard('How useful were the course materials?', q4Rating),
        _RatingCard('Would you recommend this course to others?', q5Rating),

        // course-specific questionnaire results
        SizedBox(height: 5.0),
        CourseQuestionnaireResults(courseId: widget.courseId),
      ],
    );
  }
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
