Ext.define('Pente.view.BoardComponent', {
	extend: 'Ext.draw.Component',
	alias: 'widget.board-component',
	requires: [ 'Pente.lib.Board' ],
	viewBox: false,
	items: [],
	initComponent: function () {
		var bt = Pente.lib.Board;
		var dims = bt.dimensions();
		var cx = bt.squareSize;
		var cy = bt.squareSize;
		var x = bt.cxBorder;
		var y = bt.cyBorder;

		this.items.push({
			type: 'rect',
			width: bt.width(),
			height: bt.height(),
			fill: '#fff0d4',
			stroke: '#c0c0c0',
			x: bt.cxBorder,
			y: bt.cyBorder
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
				'stroke-width': .5
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
				'stroke-width': .5
			};
			this.items.push(item);
			ptStart.y += cy;
		}

		dims = Pente.lib.Board.boundingRect();
		var size = dims.getSize();
		this.height = size.height;
		this.width = size.width;

		this.pieceGroup = Ext.create('Ext.draw.CompositeSprite', { surface: this });

		this.callParent(arguments);
	},

	drawPiece: function (piece) {
		var bt = Pente.lib.Board;
		var r = bt.cxPiece / 2;
		var ptOrigin = this.getOrigin({x: piece.data.x, y: piece.data.y});
		var color = piece.data.who == 0 ? '#008000' : '#800000';

		var sprite = this.surface.add({
			type: 'circle',
			fill: color,
			stroke: '#000000',
			'stroke-width': 1,
			opacity: 1,
			radius: r,
			x: ptOrigin.x,
			y: ptOrigin.y});

		var key = bt.key(piece.data.x, piece.data.y);
		this.pieceGroup.add(key, sprite);
		sprite.show(true);
	},

	removePiece: function (pt) {
		var bt = Pente.lib.Board;
		var key = bt.key(pt.x, pt.y);
		var sprite = this.pieceGroup.get(key);
		if (sprite) {
			this.pieceGroup.remove(sprite);
			this.surface.remove(sprite, true);
		}
	},

	getOrigin: function (pt) {
		var bt = Pente.lib.Board;
		var mapped = bt.mapPoint(pt.x, pt.y);
		var x = mapped.x + (bt.cxPiece / 2);
		var y = mapped.y + (bt.cyPiece / 2);
		return {x: x, y: y};
	}
});