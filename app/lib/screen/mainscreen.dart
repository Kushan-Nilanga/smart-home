import 'package:app/widgets/widgets.dart';
import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Header(),
      Container(
          height: 670,
          child: GridView.count(
            padding: EdgeInsets.fromLTRB(30, 0, 30, 0),
            shrinkWrap: true,
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            children: [
              Device(isOn: false, connect: "NCON", name: "Kushan's Room"),
              Device(isOn: true, connect: "CONN", name: "Living Room"),
              Device(isOn: false, connect: "CNTN", name: "Kitchen"),
              Device(isOn: true, connect: "CONN", name: "Laundry"),
              Device(isOn: false, connect: "CONN", name: "Garage"),
            ],
          )),
    ]);
  }
}
