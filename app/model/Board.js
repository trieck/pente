Ext.define('Pente.model.Board', {
    extend: 'Ext.data.Model',
    fields: [],
    vectors: null,

    boardSize: function () {
        return 19;
    },

    getDimensions: function () {
        return null;
    },

    boardEntries: function () {
        return boardSize() * boardSize();
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