Ext.define('Pente.lib.Machine', {
	requires: [ 'Pente.lib.Board' ],
	vectors: [],
	statics: {
		VSIZE: 5,
		MIN_WEIGHT: -Number.MIN_VALUE,
		MAX_WEIGHT: Number.MAX_VALUE,
		PIECE_WEIGHT: 1,
		CONT_WEIGHT: 0.5,
		CENTER: 180,
		MEAN_POINT: this.VSIZE / 2,
		PLAYER_ONE: 0,
		PLAYER_TWO: 1
	},

	constructor: function () {
		this.pieceStore = Ext.getStore('Pente.store.PieceStore');
		this.turnStore = Ext.getStore('Pente.store.TurnStore');
		this.generate();
	},

	generate: function () {
		var i, j, m, n, v = [];
		var bt = Pente.lib.Board;
		var entries = bt.entries();

		// generate all initially feasible vectors
		for (i = 0; i < entries; ++i) {
			m = Math.floor(i / bt.boardSize);
			n = i % bt.boardSize;

			// check for horizontal vector
			if (this.self.VSIZE + n <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.self.VSIZE; ++j) {
					v.push({x: m, y: n + j});
				}
				this.vectors.push(v);
			}

			// check for vertical vector
			if (this.self.VSIZE + m <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.self.VSIZE; j++) {
					v.push({x: m + j, y: n});
				}
				this.vectors.push(v);
			}

			// check for a "diagonal down" vector
			if (this.self.VSIZE + m <= bt.boardSize && this.self.VSIZE + n <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.self.VSIZE; j++) {
					v.push({x: m + j, y: n + j});
				}
				this.vectors.push(v);
			}

			// check for a "diagonal up" vector
			if (m >= this.self.VSIZE - 1 && this.self.VSIZE + n <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.self.VSIZE; j++) {
					v.push({x: m - j, y: n + j});
				}
				this.vectors.push(v);
			}
		}
	},

	move: function (pt) {
		var pieceT = Pente.model.Piece;
		var nweight, maxWeight = this.self.MIN_WEIGHT;
		var maxV = -1;
		var nlen = this.vectors.length;
		pt = {};

		var turn = this.turnStore.who();
		if (turn != pieceT.PT_PLAYER_TWO)
			return false;

		for (var i = 0; i < nlen; ++i) {
			nweight = this.weightVector(i);
			if (nweight > maxWeight) {
				maxWeight = nweight;
				maxV = i;
			}
		}

		return false;
	},

	weightVector: function (i) {
		var weight = 0;

		return weight;
	}
});
