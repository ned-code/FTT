module("date.js");
test("parse date '2010-03-10T08:39:23.336Z'", function() {
  var dateInISO8601 = '2010-03-10T08:39:23.336Z';
  var currentDate = new Date();
  currentDate.setISO8601(dateInISO8601);
  equals(currentDate.getUTCFullYear(), 2010, "full year is 2010");
  equals(currentDate.getUTCMonth()+1, 3, "month is March");
  equals(currentDate.getUTCDate(), 10, "day is 10");
  equals(currentDate.getUTCHours(), 8, "hour is 8");
  equals(currentDate.getUTCMinutes(), 39, "minutes is 39");
  equals(currentDate.getUTCSeconds(), 23, "seconds is 23");
  equals(currentDate.getUTCMilliseconds(),336, "miliseconds is 336");
});
test("display date 10/03/2010 08:39:23.336Z in ISO8601", function() {
  var referenceDate = new Date();
  referenceDate.setUTCFullYear(2010);
  referenceDate.setUTCMonth(2);
  referenceDate.setUTCDate(10);
  referenceDate.setUTCHours(8);
  referenceDate.setUTCMinutes(39);
  referenceDate.setUTCSeconds(23);
  referenceDate.setUTCMilliseconds(336);
  equals(referenceDate.toISO8601String(), '2010-03-10T08:39:23.336Z', 'date is correctlly dispay in ISO 8601 format');
});
