Ext.define('Pente.store.PieceStore', {
    extend: 'Pente.lib.MapStore',
    model: 'Pente.model.Piece',
    uses: 'Pente.lib.Board',
    autoSync: true,
    autoLoad: true,
    proxy: {
        type: 'sessionstorage',
        id: 'PieceKey',
        reader: {
            model: 'Pente.model.Piece'
        }
    },

    getByPoint: function (pt) {
        var key = Pente.lib.Board.key(pt.x, pt.y);
        return this.get(key);
    },

    removeAll: function () {
        this.callParent(arguments);
        this.proxy.clear();
        this.proxy.initialize();
    },

    who: function(pt) {
        var piece = this.getByPoint(pt);
        if (piece) {
            return piece.data.who;
        }
    }
});
