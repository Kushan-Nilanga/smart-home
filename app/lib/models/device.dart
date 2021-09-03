class State {
  final String date;
  final String connection;
  final String value;
  const State(this.date, this.connection, this.value);
}

class Device {
  final String id;
  final String name;
  final List<State> state;

  const Device(this.id, this.name, this.state);
}
