Ext.define('Pente.controller.Controller', {
        extend: 'Ext.app.Controller',
        models: [ 'Pente.model.Piece' ],
        stores: [ 'Pente.store.PieceStore', 'Pente.store.BoardStateStore' ],
        views: [ 'Pente.view.View' ],
        uses: [ 'Pente.lib.Machine'],
        refs: [
            { selector: 'pente-view', ref: 'penteView' }
        ],

        init: function () {
            var store = this.getPenteStoreBoardStateStoreStore();
            store.on('load', this.onStoreLoadBoard, this);

            store = this.getPenteStorePieceStoreStore();
            store.on('load', this.onStoreLoadPieces, this);
            store.on('add', this.onStoreAddPieces, this);
            store.on('bulkremove', this.onStoreBulkRemovePieces, this);

            this.control({
                'pente-view': {
                    afterrender: this.onViewAfterRender
                },
                '#newButton': {
                    click: this.onNewGame
                },
                '#table-picker': {
                    select: this.onTableColor
                },
                '#board-picker': {
                    select: this.onBoardColor
                },
                '#grid-picker': {
                    select: this.onGridColor
                },
                '#player-one-picker': {
                    select: this.onPlayerOneColor
                },
                '#player-two-picker': {
                    select: this.onPlayerTwoColor
                },
                '#aboutButton': {
                    click: this.onAbout
                }
            });
        },

        onLaunch: function () {
            this.machine = Ext.create('Pente.lib.Machine');
        },

        onViewAfterRender: function (view) {
            // load the board state store
            var store = this.getPenteStoreBoardStateStoreStore();
            store.load();

            // load the piece store
            store = this.getPenteStorePieceStoreStore();
            store.load();

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
            var store = this.getPenteStoreBoardStateStoreStore();
            store.changeTurns();
        },

        getPiece: function (x, y) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var key = Pente.lib.Board.key(x, y);
            return { key: key, x: x, y: y, who: store.who() };
        },

        onStoreLoadPieces: function (store, records, successful, eOpts) {
            this.addToView(records);
        },

        onStoreAddPieces: function (store, records, index, eOpts) {
            this.addToView(records);
        },

        onStoreBulkRemovePieces: function (store, records, indexes, isMove, eOpts) {
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
            var piece, color;

            for (var i = 0; i < len; ++i) {
                piece = records[i];
                color = this.getPieceColor(piece);
                view.drawPiece(records[i], color);
            }
        },

        getPieceColor: function (piece) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var pt = Pente.model.Piece;
            var color;

            if (piece.data.who === pt.PT_PLAYER_ONE) {
                if (store.empty()) {
                    color = pt.PT_PLAYER_ONE_DEFAULT_COLOR;
                } else {
                    color = store.playerOneColor();
                    color = color.length ? color : pt.PT_PLAYER_ONE_DEFAULT_COLOR;
                }
            } else {
                if (store.empty()) {
                    color = pt.PT_PLAYER_TWO_DEFAULT_COLOR;
                } else {
                    color = store.playerTwoColor();
                    color = color.length ? color : pt.PT_PLAYER_TWO_DEFAULT_COLOR;
                }
            }

            return color;
        },

        onNewGame: function () {
            var pt = Pente.model.Piece;

            var store = this.getPenteStorePieceStoreStore();
            store.removeAll();

            store = this.getPenteStoreBoardStateStoreStore();
            store.setTurn(pt.PT_PLAYER_ONE);
        },

        onTableColor: function (picker, color, eOpts) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var view = this.getPenteView();
            view.setColor(color);
            store.setTableColor(color);
        },

        onBoardColor: function (picker, color, eOpts) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var view = this.getPenteView();
            view.setBoardColor(color);
            store.setBoardColor(color);
        },

        onGridColor: function (picker, color, eOpts) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var view = this.getPenteView();
            view.setGridColor(color);
            store.setGridColor(color);
        },

        onPlayerOneColor: function (picker, color, eOpts) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var view = this.getPenteView();
            view.setPlayerOneColor(color);
            store.setPlayerOneColor(color);
        },

        onPlayerTwoColor: function (picker, color, eOpts) {
            var store = this.getPenteStoreBoardStateStoreStore();
            var view = this.getPenteView();
            view.setPlayerTwoColor(color);
            store.setPlayerTwoColor(color);
        },

        onStoreLoadBoard: function (store, records, successful, eOpts) {
            var view = this.getPenteView();
            var value;

            if (successful && records.length > 0) {
                value = records[0].data['table-color'];
                if (value.length) {
                    view.setColor(value);
                }
                value = records[0].data['board-color'];
                if (value.length) {
                    view.setBoardColor(value);
                }
                value = records[0].data['grid-color'];
                if (value.length) {
                    view.setGridColor(value);
                }
                value = records[0].data['player-one-color'];
                if (value.length) {
                    view.setPlayerOneColor(value);
                }
                value = records[0].data['player-two-color'];
                if (value.length) {
                    view.setPlayerTwoColor(value);
                }
            }
        },

        onAbout: function () {
            Ext.create('Ext.window.Window', {
                bodyStyle: 'background:#fff; padding:10px;',
                title: 'About Pente for ExtJS',
                titleAlign: 'center',
                height: 200,
                width: 400,
                modal: true,
                resizable: false,
                buttons: [
                    {
                        text: 'OK',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }).show();
        }
    }
);

