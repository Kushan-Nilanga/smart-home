import 'package:http/http.dart' as http;
import '../data/data.dart';
import 'dart:convert';

// https://dev.to/joshuamdeguzman/integrating-graphql-in-flutter-using-graphqlflutter-5a61
// Good graphql example

Future<http.Response> fetchData(String data) {
  return http.post(
    Uri.parse(graphql_uri),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(data),
  );
}
