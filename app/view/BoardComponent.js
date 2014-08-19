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
            y: bt.cyBorder
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
                'stroke-width': 0.5
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
                'stroke-width': 0.5
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
        var pt = Pente.model.Piece;
        var bt = Pente.lib.Board;
        var r = bt.cxPiece / 2;
        var ptOrigin = this.getOrigin({x: piece.data.x, y: piece.data.y});
        var color = piece.data.who === pt.PT_PLAYER_ONE ? '#008000' : '#800000';

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
    },

    setBoardColor: function (color) {
        Ext.fly('pente-board').setStyle('fill', color);
    },

    setGridColor: function (color) {
        var items = Ext.query('path');
        var nlength = items.length;
        for (var i = 0; i < nlength; ++i) {
            Ext.fly(items[i]).setStyle('stroke', color);
        }
    }
});