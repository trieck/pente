Ext.define('Pente.store.TurnStore', {
    extend: 'Ext.data.Store',
    model: 'Pente.model.Turn',
    uses: 'Pente.model.Piece',
    autoSync: true,
    autoLoad: true,
    proxy: {
        type: 'sessionstorage',
        id: 'TurnKey',
        reader: {
            model: 'Pente.model.Turn'
        }
    },
    changeTurns: function () {
        var pt = Pente.model.Piece;
        var record = this.getRecord();
        record.data.who = record.data.who === pt.PT_PLAYER_ONE ? pt.PT_PLAYER_TWO : pt.PT_PLAYER_ONE;
        record.dirty = true;
        this.sync();
    },
    who: function () {
        var record = this.getRecord();
        return record.data.who;
    },
    getRecord: function () {
        var pt = Pente.model.Piece;
        var record = this.getAt(0);
        if (!record) {
            record = this.add({who: pt.PT_PLAYER_ONE})[0];
        }
        return record;
    },
    removeAll: function () {
        this.callParent(arguments);
        this.proxy.clear();
        this.proxy.initialize();
    }
});
