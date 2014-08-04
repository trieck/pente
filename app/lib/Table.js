Ext.define('Pente.lib.Table', {
	extend: 'Ext.draw.Component',
	alias: 'widget.pente-table',
	requires: [ 'Pente.model.Board' ],
	viewBox: false,
	items: [],
	initComponent: function () {
		var dims = Pente.model.Board.dimensions();
		var cx = Pente.model.Board.squareSize;
		var cy = Pente.model.Board.squareSize;
		var x = Pente.model.Board.cxBorder;
		var y = Pente.model.Board.cyBorder;

		this.items.push({
			type: 'rect',
			width: Pente.model.Board.width(),
			height: Pente.model.Board.height(),
			fill: '#fff0d4',
			stroke: '#c0c0c0',
			x: Pente.model.Board.cxBorder,
			y: Pente.model.Board.cyBorder
		});

		// draw vertical lines
		var ptStart = Ext.create('Ext.util.Point', x + cx, y);
		while (ptStart.x < dims.right) {
			var ptEnd = Ext.create('Ext.util.Point', ptStart.x, dims.bottom + y);
			var path = Ext.String.format("M{0} {1} L{2} {3}", ptStart.x, ptStart.y, ptEnd.x, ptEnd.y);
			var item = {
				type: 'path',
				path: path,
				stroke: '#c0c0c0',
				'stroke-width': 1
			};
			this.items.push(item);
			ptStart.x += cx;
		}

		// Draw horizontal lines
		ptStart = Ext.create('Ext.util.Point', x, y + cy);
		while (ptStart.y < dims.bottom) {
			ptEnd = Ext.create('Ext.util.Point', dims.right + x, ptStart.y);
			path = Ext.String.format("M{0} {1} L{2} {3}", ptStart.x, ptStart.y, ptEnd.x, ptEnd.y);
			item = {
				type: 'path',
				path: path,
				stroke: '#c0c0c0',
				'stroke-width': 1
			};
			this.items.push(item);
			ptStart.y += cy;
		}

		this.callParent(arguments);
	}
});