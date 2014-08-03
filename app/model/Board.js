Ext.define('Pente.model.Board', {
    extend: 'Ext.data.Model',
    statics: {
        boardSize: 19,
        cxBorder: 20,
        cyBorder: 20,
        cxOffset: 2,
        cyOffset: 2,
        cxSquares: 18,
        cySquares: 18,
        squareSize: 21,
        boardEntries: 19 * 19,
        width: function () {
            return this.squareSize * this.cxSquares;
        },
        height: function () {
            return this.squareSize * this.cySquares;
        },
        dimensions: function () {
            var right = this.width();
            var bottom = this.height();
            return new Ext.util.Region(0, right, bottom, 0);
        },
        boundingRect: function () {
            var dims = this.dimensions();
            dims.right += this.cxBorder * 2;
            dims.bottom += this.cyBorder * 2;
            return dims;
        }
    },

    vectors: null,

    getEntry: function (x, y) {
        return null;
    },

    setEntry: function (x, y, type) {

    },

    remove: function (x, y) {

    },

    clear: function () {

    },

    enumEntries: function () {

    },

    empty: function () {
        return true;
    },

    winner: function (player) {
        return null;
    },

    getCaptures: function (x, y, captureVec) {
        return null;
    },

    generate: function () {
    }

});