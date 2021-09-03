import 'package:flutter/material.dart';

class Header extends StatelessWidget {
  const Header({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Center(
            child: Text(
      "Devices",
      style: TextStyle(
          fontSize: 30, fontWeight: FontWeight.w700, letterSpacing: -1),
    )));
  }
}
