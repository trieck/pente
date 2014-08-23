Ext.define('Pente.view.BoardComponent', {
    extend: 'Ext.draw.Component',
    alias: 'widget.board-component',
    uses: [ 'Pente.lib.Board', 'Pente.model.Piece' ],
    viewBox: false,
    items: [],
    initComponent: function () {
        var bt = Pente.lib.Board;
        var dims = bt.dimensions();
        var cx = bt.squareSize;
        var cy = bt.squareSize;
        var x = bt.cxBorder;
        var y = bt.cyBorder;
        var ptStart, ptEnd;
        var path, item;

        this.items.push({
            type: 'rect',
            id: 'pente-board',
            width: bt.width(),
            height: bt.height(),
            fill: '#fff0d4',
            stroke: '#c0c0c0',
            x: bt.cxBorder,
            y: bt.cyBorder,
            group: 'board'
        });

        // draw vertical lines
        ptStart = Ext.create('Ext.util.Point', x + cx, y);
        while (ptStart.x < dims.right) {
            ptEnd = Ext.create('Ext.util.Point', ptStart.x, dims.bottom + y);
            path = Ext.String.format("M{0} {1} L{2} {3}", ptStart.x, ptStart.y, ptEnd.x, ptEnd.y);
            item = {
                type: 'path',
                path: path,
                stroke: '#c0c0c0',
                'stroke-width': 0.5,
                group: 'grid-lines'
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
                'stroke-width': 0.5,
                group: 'grid-lines'
            };
            this.items.push(item);
            ptStart.y += cy;
        }

        dims = Pente.lib.Board.boundingRect();
        var size = dims.getSize();
        this.height = size.height;
        this.width = size.width;

        this.playerOnePieces = Ext.create('Ext.draw.CompositeSprite', { surface: this });
        this.playerTwoPieces = Ext.create('Ext.draw.CompositeSprite', { surface: this });

        this.callParent(arguments);
    },

    drawPiece: function (piece, color) {
        var pt = Pente.model.Piece;
        var bt = Pente.lib.Board;
        var r = bt.cxPiece / 2;
        var ptOrigin = this.getOrigin({x: piece.data.x, y: piece.data.y});
        var sColor = Ext.String.format('#{0}', color);

        var sprite = this.surface.add({
            type: 'circle',
            fill: sColor,
            stroke: '#000000',
            'stroke-width': 1,
            opacity: 1,
            radius: r,
            x: ptOrigin.x,
            y: ptOrigin.y
        });

        // add piece to appropriate composite sprite
        var key = bt.key(piece.data.x, piece.data.y);
        if (piece.data.who === pt.PT_PLAYER_ONE) {
            this.playerOnePieces.add(key, sprite);
        } else {
            this.playerTwoPieces.add(key, sprite);
        }

        sprite.show(true);
    },

    removePiece: function (pt) {
        var bt = Pente.lib.Board;
        var key = bt.key(pt.x, pt.y);
        var sprite = this.playerOnePieces.get(key);
        if (sprite) {
            this.playerOnePieces.remove(sprite);
            this.surface.remove(sprite, true);
        } else if ((sprite = this.playerTwoPieces.get(key))) {
            this.playerTwoPieces.remove(sprite);
            this.surface.remove(sprite, true);
        }
    },

    getOrigin: function (pt) {
        var bt = Pente.lib.Board;
        var mapped = bt.mapPoint(pt.x, pt.y);
        var x = mapped.x + (bt.cxPiece / 2);
        var y = mapped.y + (bt.cyPiece / 2);
        return {x: x, y: y};
    },

    setBoardColor: function (color) {
        var sColor = Ext.String.format('#{0}', color);
        var boards = this.surface.getGroup('board');
        boards.setAttributes({fill: sColor}, true);
    },

    setGridColor: function (color) {
        var items = this.surface.getGroup('grid-lines');
        var sColor = Ext.String.format('#{0}', color);
        items.setAttributes({stroke: sColor}, true);
    },

    setPlayerOneColor: function (color) {
        var sColor = Ext.String.format('#{0}', color);
        this.playerOnePieces.setAttributes({fill: sColor}, true);
    },

    setPlayerTwoColor: function (color) {
        var sColor = Ext.String.format('#{0}', color);
        this.playerTwoPieces.setAttributes({fill: sColor}, true);
    }
});