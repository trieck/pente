Ext.define('Pente.model.Board', {
    extend: 'Ext.data.Model',
    singleton: true,
    fields: [],
    vectors: null,

    statics: {
        boardSize: 19,
        cxBorder: 20,
        cyBorder: 20,
        cxOffset: 2,
        cyOffset: 2,
        cxSquares: 19 - 1,
        cySquares: 19 - 1,
        squareSize: 21,
        boardEntries: 19 * 19,
        dimensions: function () {
        }
    },

    constructor: function (config) {
        console.log('Board was constructed...');
    },

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


    getVectors: function () {
        return this.vectors;
    },

    winner: function (player) {
        return null;
    },

    size: function () {
        return 0;
    },

    getCaptures: function (x, y, captureVec) {
        return null;
    },

    /*
     * @private
     */
    generate: function () {

    }

});