import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: 300, left: 30, right: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            "Sign in",
            style: TextStyle(
                fontSize: 30, fontWeight: FontWeight.w700, letterSpacing: -1),
          ),
          TextFormField(
            decoration: InputDecoration(
                border: UnderlineInputBorder(),
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.black)),
                labelText: 'Email',
                labelStyle: TextStyle(color: Colors.black)),
            cursorColor: Colors.black,
          ),
          TextFormField(
            obscureText: true,
            decoration: InputDecoration(
                border: UnderlineInputBorder(),
                focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.black)),
                labelText: 'Password',
                labelStyle: TextStyle(color: Colors.black)),
            cursorColor: Colors.black,
          ),
          Padding(
            padding: EdgeInsets.only(top: 20),
            child: GestureDetector(
              child: Container(
                color: Colors.black,
                padding: EdgeInsets.fromLTRB(20, 5, 20, 5),
                child: Text(
                  "SIGN IN",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
              onTap: () => {print("Sign in")},
            ),
          )
        ],
      ),
    );
  }
}
