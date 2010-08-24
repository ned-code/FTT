/**
 * @author Julien Bachmann
 */

WebDoc.ShapeManager = {
  _initialized: false,
  _defaultShape: undefined,

  SHAPE_1: new WebDoc.Shape({
    shape: {
      uuid: "s1",
      path: "M0 50 C0 22 22 0 50 0 C75 0 100 22 100 50 C100 78 78 100 50 100 L0 150 L25 100 C0 90 0 50 0 50Z",
      stroke: "black",
      fill: "white",
      strokeWidth: "2",
      textTopOffset: "10",
      textLeftOffset: "10",
      textRightOffset: "10",
      textBottomOffset: "10"
    }
  }),

  SHAPE_2: new WebDoc.Shape({
    shape: {
      uuid: "s2",
      path: "M0 0 L100 0 L 100 100 L 50 100 L 100 150 L 30 100 L 0 100Z",
      stroke: "black",
      fill: "blue",
      strokeWidth: "0",
      textTopOffset: "10",
      textLeftOffset: "10",
      textRightOffset: "10",
      textBottomOffset: "10"
    }
  }),

  init: function(callBack) {
    if (!this._initialized) {
      this._initialize();
    }
    callBack.call(this, WebDoc.ShapeManager);
  },

  getInstance: function() {
    return this;
  },

  _initialize: function() {
    this._defaultShape = this.SHAPE_1;
    this._allShapes = {
      s1: this.SHAPE_1,
      s2: this.SHAPE_2
    }
    this._initialized = true;
  },

  getDefaultShape: function(callBack) {
    return this._defaultShape;
  },

  getAllShapes: function() {
    return [SHAPE_1, SHAPE_2];  
  },

  getShape: function(uuid) {
    return this._allShapes[uuid];
  }
};

