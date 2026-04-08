
import 'package:flutter/cupertino.dart';

class GlobalData extends ChangeNotifier {
  String _userId = '69d46f9f02e9eae7e5ab9246'; // initialize to -1
  String _selectedCourseId = '';//'69cfe4e05d3fb0a1a7d346ef';
  String _selectedCourse = '';
  String _selectedProfessorId = '';
  String _selectedProfessor = '';

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