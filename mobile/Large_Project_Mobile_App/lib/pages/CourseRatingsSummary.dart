import 'package:flutter/material.dart';
import 'package:group7_mobile_app/utils/getAPI.dart';
import 'dart:convert';


// widget for building the course rating summary section
class CourseRatingsSummary extends StatefulWidget {

  // course id
  final String courseId;

  // constructor
  const CourseRatingsSummary({required this.courseId});

  @override
  State<CourseRatingsSummary> createState() => _CourseRatingsSummaryState();
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
      String ret = await AppDataGet.getJSON(url + widget.courseId.trim());
      jsonObjectCourseRatings = json.decode(ret);

      numCourseRatings = jsonObjectCourseRatings["totalRatings"];
      courseRatingsList.add(jsonObjectCourseRatings["averageQ1"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ2"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ3"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ4"]);
      courseRatingsList.add(jsonObjectCourseRatings["averageQ5"]);

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
    // collect ratings for all courses
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
        // row for Q1 course ratings
        _RatingCard('Overall, how would you rate this course?', q1Rating),
        _RatingCard('How would you rate the course difficulty?', q2Rating),
        _RatingCard('How manageable was the course workload?', q3Rating),
        _RatingCard('How useful were the course materials?', q4Rating),
        _RatingCard('Would you recommend this course to others?', q5Rating),
      ],
    );
  }
}
