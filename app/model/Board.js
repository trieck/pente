Ext.define('Pente.model.Board', {
	extend: 'Ext.data.Model',
	statics: {
		boardSize: 19,
		cxPiece: 18,
		cyPiece: 18,
		cxBorder: 20,
		cyBorder: 20,
		cxOffset: 2,
		cyOffset: 2,
		cxSquares: 18,
		cySquares: 18,
		squareSize: 21,
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
		},
		ptOnBoard: function (x, y) {
			var dims = this.dimensions().copy();
			dims.adjust(-(this.cyPiece / 2), this.cxPiece / 2, this.cyPiece / 2, -(this.cxPiece / 2));
			dims.adjust(this.cyBorder, this.cyBorder, this.cyBorder, this.cxBorder);
			return !!(x >= dims.x && y >= dims.y && x < dims.right && y < dims.bottom);
		},
		getSquare: function (x, y) {
			var aPoint = Ext.create('Ext.util.Point', x, y);

			aPoint.x -= (this.cxBorder - (this.cxPiece / 2));
			aPoint.y -= (this.cyBorder - (this.cyPiece / 2));

			var ptSquare = Ext.create('Ext.util.Point');
			ptSquare.x = parseInt(Math.min(Math.max(0, (aPoint.x / this.squareSize)), this.cxSquares), 10);
			ptSquare.y = parseInt(Math.min(Math.max(0, (aPoint.y / this.squareSize)), this.cySquares), 10);

			return ptSquare;
		},
		key: function (x, y) {
			return (y % this.boardSize) * this.boardSize + (x % this.boardSize);
		}
	},

	rep: {},
	vectors: null,

	getEntry: function (x, y) {
		var k = this.self.key(x, y);
		return this.rep.hasOwnProperty(k);
	},

	setEntry: function (x, y) {
		var k = this.self.key(x, y);
		this.rep[k] = 1;
	},

	addPiece: function (pt) {
		if (this.getEntry(pt.x, pt.y))
			return false;

		this.setEntry(pt.x, pt.y);

		return true;
	},
	clear: function () {
		this.rep = {};
	}



});