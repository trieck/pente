Ext.define('Pente.lib.Game', {
	uses: [ 'Pente.lib.Board' ],
	vectors: [],
	VSIZE: 5,

	constructor: function () {
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
			if (this.VSIZE + n <= bt.boardSize) {
				v = []
				for (j = 0; j < this.VSIZE; ++j) {
					v.push({x: m, y: n + j});
				}
				this.vectors.push(v);
			}

			// check for vertical vector
			if (this.VSIZE + m <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.VSIZE; j++) {
					v.push({x: m + j, y: n});
				}
				this.vectors.push(v);
			}

			// check for a "diagonal down" vector
			if (this.VSIZE + m <= bt.boardSize && this.VSIZE + n <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.VSIZE; j++) {
					v.push({x: m + j, y: n + j});
				}
				this.vectors.push(v);
			}

			// check for a "diagonal up" vector
			if (m >= this.VSIZE - 1 && this.VSIZE + n <= bt.boardSize) {
				v = [];
				for (j = 0; j < this.VSIZE; j++) {
					v.push({x: m - j, y: n + j});
				}
				this.vectors.push(v);
			}
		}
	}
});
