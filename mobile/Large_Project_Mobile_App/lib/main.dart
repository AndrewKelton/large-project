import 'package:flutter/material.dart';
import 'package:group7_mobile_app/pages/LoginScreen.dart';
import 'package:group7_mobile_app/pages/RegistrationScreen.dart';
import 'package:group7_mobile_app/pages/UserHomeScreen.dart';
import 'package:group7_mobile_app/pages/loading.dart';

void main() => runApp(MaterialApp(
  initialRoute: '/login',
  title: 'COP4431 Group 7 Large Project',
  routes: {
    '/': (context) => Loading(),
    '/login': (context) => LoginScreen(),
    '/register': (context) => RegistrationScreen(),
    '/user_home': (context) => UserHomeScreen(),
  },
  navigatorObservers: [routeObserver],
));

final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();

