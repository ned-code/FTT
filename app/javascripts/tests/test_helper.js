QUnit.mockObject = function (rootObject, objectToMockName) {
  var mockedObject  = new Mock();
  mockedObject._originalObject = rootObject[objectToMockName];
  mockedObject._rootObject = rootObject;
  mockedObject._objectToMockName = objectToMockName;
  rootObject[objectToMockName] = mockedObject;
  return mockedObject;
};

QUnit.restoreMock = function (mock) {
  mock._rootObject[mock._objectToMockName] = mock._originalObject;
};
