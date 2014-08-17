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
        MEAN_POINT: 2
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
                for (j = 0; j < this.self.VSIZE; ++j) {
                    v.push({x: m + j, y: n});
                }
                this.vectors.push(v);
            }

            // check for a "diagonal down" vector
            if (this.self.VSIZE + m <= bt.boardSize && this.self.VSIZE + n <= bt.boardSize) {
                v = [];
                for (j = 0; j < this.self.VSIZE; ++j) {
                    v.push({x: m + j, y: n + j});
                }
                this.vectors.push(v);
            }

            // check for a "diagonal up" vector
            if (m >= this.self.VSIZE - 1 && this.self.VSIZE + n <= bt.boardSize) {
                v = [];
                for (j = 0; j < this.self.VSIZE; ++j) {
                    v.push({x: m - j, y: n + j});
                }
                this.vectors.push(v);
            }
        }
    },

    move: function () {
        var pieceT = Pente.model.Piece;
        var nweight, maxWeight = this.self.MIN_WEIGHT;
        var maxV, nlen = this.vectors.length;
        var pt, block;

        var turn = this.turnStore.who();
        if (turn !== pieceT.PT_PLAYER_TWO)
            return false;

        for (var i = 0; i < nlen; ++i) {
            nweight = this.weightVector(this.vectors[i]);
            if (nweight > maxWeight) {
                maxWeight = nweight;
                maxV = this.vectors[i];
            }
        }

        block = this.mustBlock();
        if (!block && maxWeight === this.self.MIN_WEIGHT) {  // no feasible strategy found
            if (!(pt = this.blockMove())) {
                pt = this.randomMove();
            }
        }

        // check if we must block
        if (block && maxWeight < this.self.MAX_WEIGHT) {
            pt = block;
        } else if (maxV) {
            pt = this.bestMove(maxV);
        }

        return pt;
    },

    /*
     * Determine square where we must block
     * where the vector contains VSIZE-1 PT_PLAYER_ONE pieces and one empty
     */
    mustBlock: function () {
        var b, i, j, who, p, q, maxP;
        var weight, maxWeight = this.self.MIN_WEIGHT, nlen = this.vectors.length;
        var onecount, ecount;
        var pieceT = Pente.model.Piece;

        for (i = 0; i < nlen; ++i) {
            for (j = 0, onecount = 0, ecount = 0; j < this.self.VSIZE; ++j) {
                p = this.vectors[i][j];
                who = this.pieceStore.who(p);
                if (!who) {
                    ecount++;
                    b = p;
                }
                else if (who === pieceT.PT_PLAYER_ONE) onecount++;
            }

            if (onecount === this.self.VSIZE - 1 && ecount == 1) { // must block, b contains the square to block
                weight = this.weightPoint(b);
                if (weight > maxWeight) {
                    maxP = { x: b.x, y: b.y };
                    maxWeight = weight;
                }
            }

            // block contiguous with open ends
            if (onecount === this.self.VSIZE - 2 && ecount == 2) {
                p = this.vectors[i][0];
                q = this.vectors[i][this.self.VSIZE - 1];

                if (!this.pieceStore.who(p) && !this.pieceStore.who(q)) {
                    weight = this.weightPoint(b);
                    if (weight > maxWeight) {
                        maxP = { x: b.x, y: b.y };
                        maxWeight = weight;
                    }
                }
            }
        }

        return maxP;
    },

    /*
     * Attempt to block opponent on a maximally feasible vector
     */
    blockMove: function () {
        var i, p, who, v;

        if (!(v = this.maxOpponentV())) {
            return false;
        }

        for (i = 0; i < this.self.VSIZE; ++i) {
            p = v[i];
            who = this.pieceStore.who(p);
            if (!who) return p;
        }
    },

    randomMove: function () {
        var empty = this.emptySet();
        var length = empty.length, n;
        if (length > 0) {
            n = Math.floor(Math.random() * (empty.length - 1));
            return empty[n];
        }
    },

    emptySet: function () {
        var bt = Pente.lib.Board;
        var i, j, who, empty = [];

        for (i = 0; i < bt.boardSize; ++i) {
            for (j = 0; j < bt.boardSize; ++j) {
                who = this.pieceStore.who({x: i, y: j});
                if (!who) empty.push({x: i, y: j});
            }
        }

        return empty;
    },

    weightVector: function (v) {
        var bt = Pente.lib.Board;
        var pieceT = Pente.model.Piece;
        var weight = 0;
        var who, i, m, n, x, y, d, pt;

        for (i = 0; i < this.self.VSIZE; ++i) {
            who = this.pieceStore.who(v[i]);
            if (!who) continue;
            switch (who) {
                case pieceT.PT_PLAYER_ONE:
                    return this.self.MIN_WEIGHT;    // vector must not contain opponent pieces
                case pieceT.PT_PLAYER_TWO:
                    weight += this.self.PIECE_WEIGHT;
                    break;
            }
        }

        if (weight === (this.self.VSIZE - 1) * this.self.PIECE_WEIGHT)
            return this.self.MAX_WEIGHT;   // winner

        // TODO: vector must contain a blocking strategy

        // add the individual piece weights
        for (i = 0; i < this.self.VSIZE; ++i) {
            who = this.pieceStore.who(v[i]);
            if (!who) continue;
            if (who === pieceT.PT_PLAYER_TWO) {
                weight += this.weightPoint(v[i]);
            }
        }

        // add weighted distance from center
        pt = v[this.self.MEAN_POINT];
        m = pt.x;
        n = pt.y;
        x = Math.floor(this.self.CENTER / bt.boardSize);
        y = this.self.CENTER % bt.boardSize;
        d = Math.abs(Math.floor(x - m)) + Math.abs(Math.floor(y - n)) + 1;
        weight += 1 / d;

        // add weighted contiguity
        weight += this.self.CONT_WEIGHT * this.contiguity(v);

        return weight;
    },

    /*
     * Determine weight of a square
     * By the number of maximally feasible vectors
     * it is contained in.
     */
    weightPoint: function (pt) {

        var weight = 0, vweight, nlen = this.vectors.length, i, j, p;

        if (this.pieceStore.who(pt))
            return this.self.MIN_WEIGHT;

        for (i = 0; i < nlen; ++i) {
            for (j = 0; j < this.self.VSIZE; ++j) {
                p = this.vectors[i][j];
                if (this.isEqualPoint(p, pt))
                    break;
            }
            if (j < this.self.VSIZE) {
                vweight = this.weightVector(this.vectors[i]);
                weight += Math.max(0, vweight);
            }
        }

        return weight;
    },

    isEqualPoint: function (pt1, pt2) {
        return pt1.x === pt2.x && pt1.y === pt2.y;
    },

    contiguity: function (v) {
        var pieceT = Pente.model.Piece;
        var cont = 0, maxCont = 0, i, who;

        for (i = 0; i < this.self.VSIZE; ++i) {
            who = this.pieceStore.who(v[i]);
            if (!who) {   // empty
                cont = 0;
            } else if (who === pieceT.PT_PLAYER_TWO) {
                if (++cont > maxCont) {
                    maxCont = cont;
                }
            }
        }

        return maxCont;
    },

    bestMove: function (v) {
        var i, pt, maxP;
        var bt = Pente.lib.Board;
        var pieceT = Pente.model.Piece;
        var weight, maxWeight = 0;

        if (this.center(v)) {
            pt = { x: Math.floor(this.self.CENTER / bt.boardSize), y: this.self.CENTER % bt.boardSize };
            return pt;
        }

        // try to find an adjacent move
        for (i = 0; i < this.self.VSIZE; ++i) {
            pt = v[i];
            if (i < this.self.VSIZE - 1 && this.pieceStore.who(pt) === pieceT.PT_PLAYER_TWO) {
                pt = v[i + 1];
                if (!this.pieceStore.who(pt)) {
                    if ((weight = this.weightPoint(pt)) > maxWeight) {
                        maxWeight = weight;
                        maxP = { x: pt.x, y: pt.y };
                    }
                }
            } else if (i > 0 && this.pieceStore.who(pt) === pieceT.PT_PLAYER_TWO) {
                pt = v[i - 1];
                if (!this.pieceStore.who(pt)) {
                    if ((weight = this.weightPoint(pt)) > maxWeight) {
                        maxWeight = weight;
                        maxP = { x: pt.x, y: pt.y };
                    }
                }
            }
        }

        if (maxP)
            return maxP;

        // try to find an empty piece
        for (i = 0; i < this.self.VSIZE; ++i) {
            pt = v[i];
            if (!this.pieceStore.who(pt)) {
                if ((weight = this.weightPoint(pt)) > maxWeight) {
                    maxWeight = weight;
                    maxP = { x: pt.x, y: pt.y };
                }
            }
        }

        return maxP;
    },

    /*
     * does vector contain empty center?
     */
    center: function (v) {
        var i, pt, pos, who;
        var bt = Pente.lib.Board;

        for (i = 0; i < this.self.VSIZE; ++i) {
            pt = v[i];
            pos = pt.x * bt.boardSize + pt.y;
            who = this.pieceStore.who(pt);
            if ((pos === this.self.CENTER) && !who)
                return true;
        }

        return false;
    },

    /*
     * find an opponent's maximally feasible vector
     */
    maxOpponentV: function () {
        var pieceT = Pente.model.Piece;
        var i, j, who, maxV, weight, maxWeight, nlen = this.vectors.length;

        for (i = 0; i < nlen; ++i) {
            for (j = 0, weight = 0; j < this.self.VSIZE; ++j) {
                who = this.pieceStore.who(this.vectors[i][j]);
                if (who === pieceT.PT_PLAYER_ONE) {
                    weight += pieceT.PIECE_WEIGHT;
                } else if (who === pieceT.PT_PLAYER_TWO) {
                    break;  // not feasible
                }
            }

            if (weight > maxWeight) {
                maxWeight = weight;
                maxV = this.vectors[i];
            }
        }

        return maxV;
    }
});
