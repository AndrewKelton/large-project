
import 'package:flutter/cupertino.dart';

class GlobalData extends ChangeNotifier {
  String _userId = '-1'; // initialize to -1 (test id 69d6b3c5cdb6529abc79f64c)
  String _selectedCourseId = '';// (test id 69cfe4e05d3fb0a1a7d346ef);
  String _selectedCourse = '';
  String _selectedProfessorId = ''; // (test id 69c746a172bc22bb12d805e3)
  String _selectedProfessor = ''; // (test name Tanvir Ahmed)

  // get methods
  String get userId => _userId;
  String get selectedCourseId => _selectedCourseId;
  String get selectedCourse => _selectedCourse;
  String get selectedProfessorId => _selectedProfessorId;
  String get selectedProfessor => _selectedProfessor;

  // set methods
  void setUserId(String userId) {
    _userId = userId;
    notifyListeners();  // rebuilds widgets listening to GlobalData
  }

  void setSelectedCourseId(String selectedCourseId) {
    _selectedCourseId = selectedCourseId;
    notifyListeners();  // rebuilds widgets listening to GlobalData
  }

  void setSelectedCourse(String selectedCourse) {
    _selectedCourse = selectedCourse;
    notifyListeners();  // rebuilds widgets listening to GlobalData
  }

  void setSelectedProfessorId(String selectedProfessorId) {
    _selectedProfessorId = selectedProfessorId;
    notifyListeners();  // rebuilds widgets listening to GlobalData
  }

  void setSelectedProfessor(String selectedProfessor) {
    _selectedProfessor = selectedProfessor;
    notifyListeners();  // rebuilds widgets listening to GlobalData
  }
}