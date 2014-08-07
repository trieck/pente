Ext.define('Pente.view.View', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.pente-view',
	bodyStyle: 'background-color:#503200;',
	requires: [ 'Pente.lib.Table' ],
	items: [
		{ xtype: 'pente-table' }
	],

	initComponent: function () {
		var dims = Pente.model.Board.boundingRect();
		var size = dims.getSize();
		this.height = size.height;
		this.width = size.width;
		this.callParent(arguments);
	},

	drawPiece: function (pt) {
	}
});