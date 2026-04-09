import 'package:http/http.dart' as http;
import 'dart:convert';

class AppDataPost {

  // static method to send http request (post method) and return json
  static Future<String> getJSON(String url, String outgoing) async {

    String ret = "";

    try {
      http.Response response = await http.post(Uri.parse(url),
        body: utf8.encode(outgoing),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        encoding: Encoding.getByName("utf-8")
      );

      ret = response.body;
    }
    catch (e) {
      print(e.toString());
    }

    return ret;
  }
}

class AppDataGet {

  // static method to send http request (get method) and return json
  static Future<String> getJSON(String url) async {

    String ret = "";

    try {
      http.Response response = await http.get(Uri.parse(url));
      ret = response.body;
    }
    catch (e) {
      print(e.toString());
    }

    return ret;
  }
}

class PingTest {
  // static method used during development to test api connection
  static Future<Map <String, dynamic>> getPing(String url) async {

    late Map <String, dynamic> ret;

    try {
      http.Response response = await http.get(Uri.parse(url));
      ret = jsonDecode(response.body);
    }
    catch (e) {
      print(e.toString());
    }

    return ret;
  }
}