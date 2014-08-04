Ext.define('Pente.lib.Table', {
	extend: 'Ext.draw.Component',
	alias: 'widget.pente-table',
	requires: [ 'Pente.model.Board' ],
	viewBox: false,
	items: [
		{
			type: 'rect',
			width: Pente.model.Board.width(),
			height: Pente.model.Board.height(),
			fill: '#fff0d4',
			stroke: '#c0c0c0',
			x: Pente.model.Board.cxBorder,
			y: Pente.model.Board.cyBorder
		}
	],
	initComponent: function () {
		var dims = Pente.model.Board.dimensions();
		var cx = Pente.model.Board.squareSize;
		var cy = Pente.model.Board.squareSize;
		var x = Pente.model.Board.cxBorder;
		var y = Pente.model.Board.cyBorder;
		var ptStart = Ext.create('Ext.util.Point', x, y);

		// draw vertical lines
		while (ptStart.x <= dims.right) {
			var ptEnd = Ext.create('Ext.util.Point', ptStart.x, (dims.bottom + y) - 1);
			var path = Ext.String.format("M{0} {1} L{2} {3}", ptStart.x, ptStart.y, ptEnd.x, ptEnd.y);
			var item = {
				type: 'path',
				path: path,
				stroke: '#c0c0c0',
				'stroke-width': .5
			};
			this.items.push(item);
			ptStart.x += cx;
		}

		this.callParent(arguments);
	}
});