const hash = require("object-hash");

export default class MqttFilter {
  pattern: any;
  filters: any;
  filterHash: any;
  /**
   *
   * @param {String} topicPattern topic pattern is how the mqtt topics are structured,
   * Example: /drones/long/location/db9a0b0611df188fec2e3f4cca220a30 - {"latitude":-1.7786803408873624,"longitude":-6.164547423631673}
   * topic pattern will look like (/drones/type/metric/id)
   * the algorithm will these pattern names to identify the filters set
   */
  constructor(topicPattern: string) {
    this.pattern = {};
    const splits = topicPattern.split("/");
    splits.splice(0, 1);
    splits.forEach((element, i) => {
      this.pattern[element] = i;
    });

    this.pattern["message"] = "message";
    this.filters = [];
    this.filterHash = [];
  }

  /**
   * @param {Any} filters array of objects that takes structure of [{ property: "type", comparison: "= or > or <", value: "value" }]
   * single filter will look like { property: "type", comparison: "=", value: "value" }]
   * the value stated by the filter will be the left-hand side of the comparison
   * @param {Function} event event to be triggered if the filters are triggered. if all the conditions in a filter is satisified
   * even callback(topic, message) is triggered: if no callback is defined it'll print the topic and message
   */
  addFilter(
    filters: any,
    event = function (topic: string, message: string) {
      console.log(topic + " - " + message);
    }
  ) {
    if (this.filterHash.indexOf(hash(filters)) === -1) {
      this.filters.push({ filters, event });
      this.filterHash.push(hash(filters));
    }
  }

  compare(val1: any, comparison: any, val2: any) {
    switch (comparison) {
      case "!=":
        return val1 != val2;
      case "=":
        return val1 == val2;
      case "==":
        return val1 == val2;
      case "<=":
        return val1 <= val2;
      case ">=":
        return val1 >= val2;
      case "<":
        return val1 < val2;
      case ">":
        return val1 > val2;
      default:
        return false;
    }
  }

  /**
   *
   * @param {String} topic mqtt topic
   * @param {String} message mqtt message
   */
  filter(topic: string, message: string) {
    const splits = topic.split("/");
    splits.splice(0, 1);

    this.filters.forEach((filters: any) => {
      var accumilate = true;
      filters.filters.forEach((filter: any) => {
        const idx = this.pattern[filter.property];
        if (idx !== undefined) {
          if (idx !== "message") {
            if (!this.compare(splits[idx], filter.comparison, filter.value)) {
              accumilate = false;
            }
          } else {
            if (!this.compare(message, filter.comparison, filter.value)) {
              accumilate = false;
            }
          }
        }
      });
      if (accumilate) {
        filters.event(topic, message);
      }
    });
  }
}
