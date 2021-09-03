import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class Device extends StatefulWidget {
  final String connect;
  final bool isOn;
  final String name;
  const Device({
    Key? key,
    required this.connect,
    required this.isOn,
    required this.name,
  }) : super(key: key);

  @override
  _DeviceState createState() => _DeviceState();
}

class _DeviceState extends State<Device> {
  @override
  Widget build(BuildContext context) {
    Color back = widget.isOn ? Colors.black : Colors.white;
    Color fore = widget.isOn ? Colors.white : Colors.black;
    Color circleColor;

    switch (widget.connect) {
      case "NCON":
        circleColor = Colors.red;
        break;
      case "CNTN":
        circleColor = Colors.amber;
        break;
      case "CONN":
        circleColor = Colors.green;
        break;
      default:
        circleColor = Colors.grey;
    }

    return GestureDetector(
      child: Container(
        width: 120,
        height: 130,
        margin: EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(10),
            topRight: Radius.circular(10),
            bottomLeft: Radius.circular(10),
            bottomRight: Radius.circular(10),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 1,
              blurRadius: 1, // changes position of shadow
            ),
          ],
        ),
        child: Padding(
            padding: EdgeInsets.all(10),
            child: Stack(
              children: [
                Container(
                  width: 7.0,
                  height: 7.0,
                  decoration: new BoxDecoration(
                    color: circleColor,
                    shape: BoxShape.circle,
                  ),
                ),
                Container(
                  alignment: Alignment.center,
                  child: Text(
                    widget.name, // 22 Chars are max
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                        letterSpacing: -.5),
                  ),
                ),
                Container(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.green,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(10),
                        topRight: Radius.circular(10),
                        bottomLeft: Radius.circular(10),
                        bottomRight: Radius.circular(10),
                      ),
                    ),
                  ),
                )
              ],
            )),
      ),
      onTap: () => {
        // Send request to change the light status
        print("Clicked " + widget.name)
      },
    );
  }
}
