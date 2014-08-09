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

	drawPiece: function (pt) {
		var bc = this.query('board-component')[0];
		bc.drawPiece(pt);
	}
});