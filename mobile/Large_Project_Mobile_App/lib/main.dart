import 'package:flutter/material.dart';
import 'package:group7_mobile_app/pages/LoginScreen.dart';
import 'package:group7_mobile_app/pages/RegistrationScreen.dart';
import 'package:group7_mobile_app/pages/UserHomeScreen.dart';
import 'package:group7_mobile_app/pages/HomeScreen.dart';
import 'package:group7_mobile_app/pages/Loading.dart';

void main() => runApp(MaterialApp(
  initialRoute: '/home',
  title: 'KnightRate',
  routes: {
    '/': (context) => Loading(),
    '/login': (context) => LoginScreen(),
    '/register': (context) => RegistrationScreen(),
    '/user_home': (context) => UserHomeScreen(),
    '/home': (context) => HomeScreen(),
  },
  navigatorObservers: [routeObserver],
));

final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();

