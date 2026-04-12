import 'package:flutter/material.dart';
import 'package:group7_mobile_app/pages/LoginScreen.dart';
import 'package:group7_mobile_app/pages/RegistrationScreen.dart';
import 'package:group7_mobile_app/pages/HomeScreen.dart';
import 'package:group7_mobile_app/pages/CreateRatingScreen.dart';
import 'package:group7_mobile_app/pages/CreateQuestionnaireScreen.dart';
import 'package:group7_mobile_app/pages/UserSettingsScreen.dart';
import 'package:group7_mobile_app/pages/Loading.dart';
import 'package:group7_mobile_app/utils/GlobalData.dart';
import 'package:provider/provider.dart';

void main() => runApp(ChangeNotifierProvider(
  create: (context) => GlobalData(),
  child: MaterialApp(
    initialRoute: '/home',
    title: 'KnightRate',
    debugShowCheckedModeBanner: true,
    routes: {
      '/': (context) => Loading(),
      '/login': (context) => LoginScreen(),
      '/register': (context) => RegistrationScreen(),
      '/home': (context) => HomeScreen(),
      '/create_rating': (context) => CreateRatingScreen(),
      '/create_questionnaire': (context) => CreateQuestionnaireScreen(),
      '/user_settings': (context) => UserSettingsScreen(),
    },
    navigatorObservers: [routeObserver],
  ),
));

final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();
