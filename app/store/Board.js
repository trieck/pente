Ext.define('Pente.store.Board', {
    extend: 'Ext.data.Store',
    model: 'Pente.model.Board',
    uses: 'Pente.model.Piece',
    autoSync: true,
    autoLoad: false,
    proxy: {
        type: 'sessionstorage',
        id: 'BoardKey',
        reader: {
            model: 'Pente.model.Board'
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

    setTurn: function (turn) {
        var record = this.getRecord();
        record.data.who = turn;
        record.dirty = true;
        this.sync();
    },

    setTableColor: function (color) {
        var record = this.getRecord();
        record.data['table-color'] = color;
        record.dirty = true;
        this.sync();
    },

    setBoardColor: function (color) {
        var record = this.getRecord();
        record.data['board-color'] = color;
        record.dirty = true;
        this.sync();
    },

    setGridColor: function (color) {
        var record = this.getRecord();
        record.data['grid-color'] = color;
        record.dirty = true;
        this.sync();
    },

    setPlayerOneColor: function (color) {
        var record = this.getRecord();
        record.data['player-one-color'] = color;
        record.dirty = true;
        this.sync();
    },

    setPlayerTwoColor: function (color) {
        var record = this.getRecord();
        record.data['player-two-color'] = color;
        record.dirty = true;
        this.sync();
    },

    tableColor: function () {
        var record = this.getRecord();
        return record.data['table-color'];
    },

    boardColor: function () {
        var record = this.getRecord();
        return record.data['board-color'];
    },

    gridColor: function () {
        var record = this.getRecord();
        return record.data['grid-color'];
    },

    playerOneColor: function () {
        var record = this.getRecord();
        return record.data['player-one-color'];
    },

    playerTwoColor: function () {
        var record = this.getRecord();
        return record.data['player-two-color'];
    },

    getRecord: function () {
        var pt = Pente.model.Piece;
        var record = this.getAt(0);
        if (!record) {
            record = this.add({ who: pt.PT_PLAYER_ONE })[0];
        }
        return record;
    },

    removeAll: function () {
        this.callParent(arguments);
        this.proxy.clear();
        this.proxy.initialize();
    },

    empty: function () {
        return this.getCount() === 0;
    }
});
