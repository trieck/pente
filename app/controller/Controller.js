Ext.define('Pente.controller.Controller', {
        extend: 'Ext.app.Controller',
        models: [ 'Pente.model.Piece' ],
        stores: [ 'Pente.store.PieceStore', 'Pente.store.TurnStore' ],
        views: [ 'Pente.view.View' ],
        uses: [ 'Pente.lib.Machine'],
        refs: [
            { selector: 'pente-view', ref: 'penteView' }
        ],

        init: function () {
            var store = this.getPenteStorePieceStoreStore();
            store.on("load", this.onStoreLoad, this);
            store.on("add", this.onStoreAdd, this);
            store.on("bulkremove", this.onStoreBulkRemove, this);
            this.control({
                'pente-view': {
                    render: this.onViewRendered
                },
                'pente-toolbar > button#newButton': {
                    click: this.onNewGame
                }
            });
        },

        onLaunch: function () {
            this.machine = Ext.create('Pente.lib.Machine');
        },

        onViewRendered: function () {
            var view = this.getPenteView();
            view.body.on('click', Ext.bind(this.onClicked, this));
        },

        onClicked: function (e) {
            var event = e.browserEvent;
            var bt = Pente.lib.Board;
            var x = event.offsetX ? event.offsetX : event.layerX;
            var y = event.offsetY ? event.offsetY : event.layerY;
            var bOnBoard = bt.ptOnBoard(x, y);
            if (bOnBoard) {
                if (this.addPoint(x, y)) {
                    this.machineMove();
                }
            }
        },

        addPoint: function (x, y) {
            var bt = Pente.lib.Board;
            var store = this.getPenteStorePieceStoreStore();
            var pt = bt.getSquare(x, y);
            var piece = this.getPiece(pt.x, pt.y);
            if (!store.get(piece.key)) {
                return this.addPiece(piece);
            }
            return false;
        },

        machineMove: function () {
            var pt = this.machine.move(), piece;
            if (pt) {
                piece = this.getPiece(pt.x, pt.y);
                this.addPiece(piece);
            }
        },

        addPiece: function (piece) {
            var store = this.getPenteStorePieceStoreStore();
            store.add(piece);
            this.changeTurns();
            return !this.checkWinner();
        },

        checkWinner: function () {
            var pieceT = Pente.model.Piece;
            var winner = this.machine.winner();
            var sWinner;

            if (winner) {
                sWinner = winner === pieceT.PT_PLAYER_ONE ? 'Player One' : 'Player Two';
                Ext.MessageBox.alert('Game Over!', sWinner + ' Wins!', function () {
                    this.onNewGame();
                }, this);
            }
            return winner;
        },

        changeTurns: function () {
            var store = this.getPenteStoreTurnStoreStore();
            store.changeTurns();
        },

        getPiece: function (x, y) {
            var store = this.getPenteStoreTurnStoreStore();
            var key = Pente.lib.Board.key(x, y);
            return { key: key, x: x, y: y, who: store.who() };
        },

        onStoreLoad: function (store, records, successful, eOpts) {
            this.addToView(records);
        },

        onStoreAdd: function (store, records, index, eOpts) {
            this.addToView(records);
        },

        onStoreBulkRemove: function (store, records, indexes, isMove, eOpts) {
            var view = this.getPenteView();
            var len = records.length;
            for (var i = 0; i < len; ++i) {
                var item = records[i];
                view.removePiece({x: item.data.x, y: item.data.y});
            }
        },

        addToView: function (records) {
            var view = this.getPenteView();
            var len = records.length;
            for (var i = 0; i < len; ++i) {
                view.drawPiece(records[i]);
            }
        },

        onNewGame: function () {
            var store = this.getPenteStorePieceStoreStore();
            store.removeAll();

            store = this.getPenteStoreTurnStoreStore();
            store.removeAll();
        }
    }
)
;
