module("record.js");

/*
 * Before test
 */
var TestSpace = {};
try {
  // Define a RecordTestClass that can be used in test cases
  TestSpace.RecordTestClass = $.klass(MTools.Record);
  $.extend(TestSpace.RecordTestClass, {
    className: function() {
      return "RecordTestClass";
    },
    rootUrl: function(args) {
      return "";
    },
    pluralizedClassName: function() {
      return this.className() + "es";
    }
  });
}
catch(exception) {
  //continue to run other tests. They will failed if RecordTestClass has not been defined  
}

/*
 * Tests
 */
test("Record class definition", function() {
  ok(TestSpace.RecordTestClass !== undefined, 'RecordTestClass has been defined');
});

test("New record", function() {
  
  var newRecord  = new TestSpace.RecordTestClass();
  var serverManagerMock = new jqMock.Mock(MTools.ServerManager, "newObject");
  
  ok(newRecord.isNew, 'New record is flagged as new record');
  ok(newRecord.uuid().match(/([0-9a-fA-F]{8})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-([0-9a-fA-F]{12})/),'New record has a valid UUID: ' + newRecord.uuid());
  ok(newRecord.creationDate(), 'New record has a creation date ' + newRecord.creationDate);
  equals(newRecord.className(), 'RecordTestClass', 'New record has a correct class name');
  equals(newRecord.pluralizedClassName(), 'RecordTestClasses', 'New reord has a correct pluralized class name');
  same(newRecord.to_json(), { 'RecordTestClass[uuid]' : newRecord.uuid(), 'RecordTestClass[created_at]' : newRecord.creationDate().toISO8601String()}, "New record generate correct rails json");   
  serverManagerMock.modify().args(jqMock.is.anything,jqMock.is.anything);
  newRecord.save();    
  serverManagerMock.verify("saving new record Call newObject");  
  
  serverManagerMock.restore();
});

test("ExistingRecord", function() {
  var rUuid = "12345678-1234-1234-1234-123456791234";
  var rDate = new Date();
  rDate.setISO8601("2010-03-10T08:39:23.336Z");
  var rName = "Record Name";
  var existingRecord  = new TestSpace.RecordTestClass({ 'RecordTestClass': {
    uuid: rUuid,
    created_at: rDate.toISO8601String(),
    name: rName
  }});
  var serverManagerMock = new jqMock.Mock(MTools.ServerManager, "updateObject");
  ok(!existingRecord.isNew, 'New record is not flagged as new record');
  equals(existingRecord.uuid(), rUuid ,'Existing record has corresponding UUID');
  same(existingRecord.creationDate(), rDate, "Existing record has correct creation date");
  equals(existingRecord.data.name, rName, 'Existing record has correct name');
  equals(existingRecord.className(), 'RecordTestClass', 'New record has a correct class name');
  equals(existingRecord.pluralizedClassName(), 'RecordTestClasses', 'New reord has a correct pluralized class name');
  same(existingRecord.to_json(), {'RecordTestClass[uuid]': rUuid,
                                  'RecordTestClass[created_at]': rDate.toISO8601String(),
                                  'RecordTestClass[name]': rName}, "Existing record generate correct rails json");   
  serverManagerMock.modify().args(jqMock.is.anything,jqMock.is.anything);
  existingRecord.save();    
  serverManagerMock.verify("saving existing record Call updateObject");  
  
  serverManagerMock.restore();  
});

test("Destroy a record", function() {
  var rUuid = "12345678-1234-1234-1234-123456791234";
  var rDate = new Date();
  rDate.setISO8601("2010-03-10T08:39:23.336Z");
  var rName = "Record Name";
  var existingRecord  = new TestSpace.RecordTestClass({ 'RecordTestClass': {
    uuid: rUuid,
    created_at: rDate.toISO8601String(),
    name: rName
  }});
  var serverManagerMock = new jqMock.Mock(MTools.ServerManager, "deleteObject"); 
  
  serverManagerMock.modify().args(jqMock.is.anything, jqMock.is.anything);
  existingRecord.destroy();    
  serverManagerMock.verify("destroying existing record Call deleteObject");  
  
  serverManagerMock.restore();   
});
