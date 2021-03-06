Ext.define('Pente.view.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pente-view',
    bodyStyle: 'background-color:#503200;',
    requires: [ 'Pente.view.BoardComponent' ],
    items: [
        { xtype: 'board-component' }
    ],

    initComponent: function () {
        var dims = Pente.lib.Board.boundingRect();
        var size = dims.getSize();
        this.height = size.height;
        this.width = size.width;
        this.callParent(arguments);
    },

    drawPiece: function (piece, color) {
        var bc = this.query('board-component')[0];
        bc.drawPiece(piece, color);
    },

    removePiece: function (pt) {
        var bc = this.query('board-component')[0];
        bc.removePiece(pt);
    },

    setColor: function (color) {
        this.setBodyStyle('background-color', color);
    },

    setBoardColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setBoardColor(color);
    },

    setGridColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setGridColor(color);
    },

    setPlayerOneColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setPlayerOneColor(color);
    },

    setPlayerTwoColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setPlayerTwoColor(color);
    }
});