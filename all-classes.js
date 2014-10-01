/*
Copyright(c) 2014 Rieck Enterprises
*/
Ext.define('Pente.model.Piece', {
    extend: 'Ext.data.Model',
    statics: {
        PT_PLAYER_ONE: 1,
        PT_PLAYER_TWO: 2,
        PT_PLAYER_ONE_DEFAULT_COLOR: '008000',
        PT_PLAYER_TWO_DEFAULT_COLOR: '800000'
    },
    fields: [
        { name: 'key', type: 'int' },
        { name: 'x', type: 'int'},
        { name: 'y', type: 'int'},
        { name: 'who', type: 'int'}
    ]
});

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
/**
 * The MapStore class is used for storing data as an associate container
 * instead of an array of records like the Store class
 */
Ext.define('Pente.lib.MapStore', {
    extend: 'Ext.data.AbstractStore',
    alias: 'store.mapstore',

    requires: [
        'Ext.data.StoreManager',
        'Ext.data.Model'
    ],

    uses: [
        'Ext.ModelManager'
    ],

    statics: {
        recordIdFn: function (record) {
            return record.data.key;
        }
    },

    /**
     * Creates the map store
     * @param {Object} [config] Config object.
     */
    constructor: function (config) {
        // Clone the config so we don't modify the original config object
        config = Ext.apply({}, config);

        var me = this;

        me.callParent([config]);

        me.data = new Ext.util.MixedCollection({
            getKey: Pente.lib.MapStore.recordIdFn
        });

        if (me.autoLoad) {
            // Defer the load until after the current event handler has finished and set up any associated views.
            Ext.defer(me.load, 1, me, [ typeof me.autoLoad === 'object' ? me.autoLoad : undefined ]);
        }
    },

    /**
     * Add Model instance to the map store
     *
     * @param (Object) [arg] model instance data or object to add
     * @return {Ext.data.Model} The model instances that was added
     * @param arg
     */
    add: function (arg) {
        var me = this, record;

        record = arg;
        if (!record.isModel) {
            record = me.createModel(record);
        }
        record = me.data.add(record);

        me.fireEvent('add', me, [record], 0);
        me.fireEvent('datachanged', me);
        if (me.autoSync && !me.autoSyncSuspended) {
            me.sync();
        }

        return record;
    },

    get: function (key) {
        var me = this;
        return me.data.map[key];
    },

    /**
     * Converts a literal to a model, if it's not a model already
     * @private
     * @param {Ext.data.Model/Object} record The record to create
     * @return {Ext.data.Model}
     */
    createModel: function (record) {
        if (!record.isModel) {
            record = Ext.ModelManager.create(record, this.model, record.key);
            record.phantom = true;
        }

        return record;
    },

    getNewRecords: function () {
        return this.data.filterBy(this.filterNew).items;
    },

    getUpdatedRecords: function () {
        return this.data.filterBy(this.filterUpdated).items;
    },

    load: function (options) {
        var me = this;

        options = options || {};

        if (typeof options == 'function') {
            options = {
                callback: options
            };
        }
        return me.callParent([options]);
    },

    onProxyLoad: function (operation) {
        var me = this,
            resultSet = operation.getResultSet(),
            records = operation.getRecords(),
            successful = operation.wasSuccessful();

        if (me.isDestroyed) {
            return;
        }

        if (resultSet) {
            me.totalCount = resultSet.total;
        }

        // Loading should be set to false before loading the records.
        // loadRecords doesn't expose any hooks or events until refresh
        // and datachanged, so by that time loading should be false
        me.loading = false;
        if (successful) {
            me.loadRecords(records, operation);
        }

        if (me.hasListeners.load) {
            me.fireEvent('load', me, records, successful);
        }
    },
    removeAll: function (silent) {
        var me = this;
        me.remove({
            start: 0,
            end: me.getCount() - 1
        }, silent);
        if (silent !== true) {
            me.fireEvent('clear', me);
        }
    },
    remove: function (records, silent) {
        var me = this,
            isNotPhantom,
            i,
            index,
            record,
            length,
            sync,
            data = me.data,
            removeRange,
            removeCount,
            allRecords = [],
            indexes = [],
            fireRemoveEvent = !silent && me.hasListeners.remove;

        // Remove a single record
        if (records.isModel) {
            records = [records];
            length = 1;
        }
        // Or remove(myRecord)
        else if (Ext.isIterable(records)) {
            length = records.length;
        }
        // Allow remove({start:100: end: 110})
        // Private API used by removeAt to remove multiple, contiguous records
        else if (typeof records === 'object') {
            removeRange = true;
            i = records.start;
            length = records.end + 1;
            removeCount = length - i;
        }

        for (; i < length; i++) {
            if (removeRange) {
                record = data.getAt(i);
                index = i;
            } else {
                record = records[i];
                index = me.indexOf(record);
            }

            isNotPhantom = record.phantom !== true;
            record.unjoin(me);
            sync = sync || isNotPhantom;

            allRecords.push(record);
            indexes.push(index);

            if (!removeRange) {
                data.removeAt(index);

                // Only fire individual remove events if not silent, and there are listeners.
                if (fireRemoveEvent) {
                    me.fireEvent('remove', me, record, index, false);
                }
            }
        }

        // If there was no listener for the single remove event, remove all records
        // from collection in one call
        if (removeRange) {
            data.removeRange(records.start, removeCount);
        }

        if (!silent) {
            me.fireEvent('bulkremove', me, allRecords, indexes, false);
            me.fireEvent('datachanged', me);
        }

        if (me.autoSync && sync && !me.autoSyncSuspended) {
            me.sync();
        }
    },
    getCount: function () {
        return this.data.getCount();
    },

    loadRecords: function (records, options) {
        var me = this,
            i = 0,
            length = records.length,
            start,
            addRecords;

        if (options) {
            start = options.start;
            addRecords = options.addRecords;
        }

        if (!addRecords) {
            me.clearData(true);
        }

        me.data.addAll(records);

        if (start !== undefined) {
            for (; i < length; i++) {
                records[i].index = start + i;
                records[i].join(me);
            }
        } else {
            for (; i < length; i++) {
                records[i].join(me);
            }
        }

        me.fireEvent('datachanged', me);
        me.fireEvent('refresh', me);
    }
});

Ext.define('Pente.model.Board', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'who', type: 'int' },
        { name: 'table-color', type: 'string' },
        { name: 'board-color', type: 'string' },
        { name: 'grid-color', type: 'string' },
        { name: 'player-one-color', type: 'string' },
        { name: 'player-two-color', type: 'string' },
        { name: 'player-one-captures', type: 'int'},
        { name: 'player-two-captures', type: 'int'}
    ]
});

Ext.define('Pente.view.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pente-view',
    bodyStyle: 'background-color:#503200;',
    requires: [ 'Pente.view.BoardComponent' ],
    items: [
        { xtype: 'board-component' }
    ],

    initComponent: function () {
        var dims = Pente.lib.Board.boundingRect();
        var size = dims.getSize();
        this.height = size.height;
        this.width = size.width;
        this.callParent(arguments);
    },

    drawPiece: function (piece, color) {
        var bc = this.query('board-component')[0];
        bc.drawPiece(piece, color);
    },

    removePiece: function (pt) {
        var bc = this.query('board-component')[0];
        bc.removePiece(pt);
    },

    setColor: function (color) {
        this.setBodyStyle('background-color', color);
    },

    setBoardColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setBoardColor(color);
    },

    setGridColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setGridColor(color);
    },

    setPlayerOneColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setPlayerOneColor(color);
    },

    setPlayerTwoColor: function (color) {
        var bc = this.query('board-component')[0];
        bc.setPlayerTwoColor(color);
    }
});
Ext.define('Pente.store.Piece', {
    extend: 'Pente.lib.MapStore',
    model: 'Pente.model.Piece',
    uses: 'Pente.lib.Board',
    autoSync: true,
    autoLoad: false,
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

    who: function (pt) {
        var piece = this.getByPoint(pt);
        if (piece) {
            return piece.data.who;
        }
    }
});

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

Ext.define('Pente.controller.Controller', {
        extend: 'Ext.app.Controller',
        models: [ 'Piece' ],
        stores: [ 'Piece', 'Board' ],
        views: [ 'Pente.view.View' ],
        uses: [ 'Pente.lib.Machine'],
        refs: [
            { selector: 'pente-view', ref: 'penteView' }
        ],

        init: function () {
            var store = this.getBoardStore();
            store.on('load', this.onStoreLoadBoard, this);

            store = this.getPieceStore();
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
            // load the board store
            var store = this.getBoardStore();
            store.load();

            // load the piece store
            store = this.getPieceStore();
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
            var store = this.getPieceStore();
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
            var store = this.getPieceStore();
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
            var store = this.getBoardStore();
            store.changeTurns();
        },

        getPiece: function (x, y) {
            var store = this.getBoardStore();
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
            var store = this.getBoardStore();
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

            var store = this.getPieceStore();
            store.removeAll();

            store = this.getBoardStore();
            store.setTurn(pt.PT_PLAYER_ONE);
        },

        onTableColor: function (picker, color, eOpts) {
            var store = this.getBoardStore();
            var view = this.getPenteView();
            view.setColor(color);
            store.setTableColor(color);
        },

        onBoardColor: function (picker, color, eOpts) {
            var store = this.getBoardStore();
            var view = this.getPenteView();
            view.setBoardColor(color);
            store.setBoardColor(color);
        },

        onGridColor: function (picker, color, eOpts) {
            var store = this.getBoardStore();
            var view = this.getPenteView();
            view.setGridColor(color);
            store.setGridColor(color);
        },

        onPlayerOneColor: function (picker, color, eOpts) {
            var store = this.getBoardStore();
            var view = this.getPenteView();
            view.setPlayerOneColor(color);
            store.setPlayerOneColor(color);
        },

        onPlayerTwoColor: function (picker, color, eOpts) {
            var store = this.getBoardStore();
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
                bodyStyle: 'background:#fff; padding: 10px',
                title: 'About Pente for ExtJS',
                titleAlign: 'center',
                height: 200,
                width: 250,
                modal: true,
                resizable: false,
                buttons: [
                    {
                        text: 'OK',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ],
                html: '<h1>Pente for ExtJS</h1><br/>Version: 0.0.1<br/>By: Thomas A. Rieck'
            }).show();
        }
    }
);


Ext.define('Pente.lib.Board', {
    statics: {
        boardSize: 19,
        cxPiece: 18,
        cyPiece: 18,
        cxBorder: 20,
        cyBorder: 20,
        cxOffset: 2,
        cyOffset: 2,
        cxSquares: 18,
        cySquares: 18,
        squareSize: 21,
        width: function () {
            return this.squareSize * this.cxSquares;
        },
        height: function () {
            return this.squareSize * this.cySquares;
        },
        entries: function () {
            return this.boardSize * this.boardSize;
        },
        dimensions: function () {
            var right = this.width();
            var bottom = this.height();
            return new Ext.util.Region(0, right, bottom, 0);
        },
        boundingRect: function () {
            var dims = this.dimensions();
            dims.right += this.cxBorder * 2;
            dims.bottom += this.cyBorder * 2;
            return dims;
        },
        ptOnBoard: function (x, y) {
            var dims = this.dimensions().copy();
            dims.adjust(-(this.cyPiece / 2), this.cxPiece / 2, this.cyPiece / 2, -(this.cxPiece / 2));
            dims.adjust(this.cyBorder, this.cyBorder, this.cyBorder, this.cxBorder);
            return !!(x >= dims.x && y >= dims.y && x < dims.right && y < dims.bottom);
        },
        getSquare: function (x, y) {
            var aPoint = Ext.create('Ext.util.Point', x, y);

            aPoint.x -= (this.cxBorder - (this.cxPiece / 2));
            aPoint.y -= (this.cyBorder - (this.cyPiece / 2));

            var ptSquare = Ext.create('Ext.util.Point');
            ptSquare.x = parseInt(Math.min(Math.max(0, (aPoint.x / this.squareSize)), this.cxSquares), 10);
            ptSquare.y = parseInt(Math.min(Math.max(0, (aPoint.y / this.squareSize)), this.cySquares), 10);

            return ptSquare;
        },
        mapPoint: function (x, y) {
            x = Math.min(Math.max(0, x), this.cxSquares);
            y = Math.min(Math.max(0, y), this.cySquares);
            x = (this.cxBorder - (this.cxPiece / 2)) + (x * this.squareSize);
            y = (this.cyBorder - (this.cyPiece / 2)) + (y * this.squareSize);
            return Ext.create('Ext.util.Point', x, y);
        },

        key: function (x, y) {
            return (y % this.boardSize) * this.boardSize + (x % this.boardSize);
        }
    }
});
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
        this.pieceStore = Ext.getStore('Piece');
        this.boardStore = Ext.getStore('Board');
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

        var turn = this.boardStore.who();
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
     */
    mustBlock: function () {
        var pt;

        if ((pt = this.matchBlock(4, 1)))
            return pt;

        pt = this.matchBlock(3, 2);

        return pt;
    },

    matchBlock: function (player, empty) {
        var weight = 0, maxWeight = this.self.MIN_WEIGHT, nlen = this.vectors.length;
        var i, j, p, who;
        var candidates = [], clen;
        var pieceT = Pente.model.Piece;
        var p1s, empties, maxP;

        for (i = 0; i < nlen; ++i) {
            candidates = [];
            for (j = 0, p1s = 0, empties = 0; j < this.self.VSIZE; ++j) {
                p = this.vectors[i][j];
                who = this.pieceStore.who(p);
                if (!who) {
                    candidates.push(p);
                    empties++;
                }
                else if (who === pieceT.PT_PLAYER_ONE) {
                    p1s++;
                }
            }
            if (p1s === player && empties === empty) {
                clen = candidates.length;
                for (j = 0; j < clen; ++j) {
                    weight = this.weightPoint(candidates[j]);
                    if (weight > maxWeight) {
                        maxP = { x: candidates[j].x, y: candidates[j].y };
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
        var weight, maxWeight = this.self.MIN_WEIGHT;

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
            }

            if (i > 0 && this.pieceStore.who(pt) === pieceT.PT_PLAYER_TWO) {
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
        var i, j, who, maxV, weight, maxWeight = this.self.MIN_WEIGHT, nlen = this.vectors.length;

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
    },

    winner: function () {
        var i, j, nlen = this.vectors.length;
        var pieceT = Pente.model.Piece;
        var pt, who;
        var onecount, twocount;

        for (i = 0; i < nlen; ++i) {
            for (j = 0, onecount = 0, twocount = 0; j < this.self.VSIZE; ++j) {
                pt = this.vectors[i][j];
                who = this.pieceStore.who(pt);
                if (!who) continue;
                if (who === pieceT.PT_PLAYER_ONE) onecount++;
                if (who === pieceT.PT_PLAYER_TWO) twocount++;
            }
            if (onecount === this.self.VSIZE)
                return pieceT.PT_PLAYER_ONE;
            if (twocount === this.self.VSIZE)
                return pieceT.PT_PLAYER_TWO;
        }
    }
});

Ext.define('Pente.lib.Statusbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.pente-statusbar',
    items: [
        {
            xtype: 'tbtext',
            text: 'Ready'
        },
        '->',
        '-'
    ],

    initComponent: function () {
        this.callParent(arguments);
        this.setCaptures(3, 2);
    },

    removeCaptures: function () {
        var items = Ext.ComponentQuery.query('imagecomponent[imgCls^=capture]');
        Ext.each(items, function (item) {
            item.destroy();
        });
    },

    setCaptures: function (playerOne, playerTwo) {
        var i;

        this.removeCaptures();

        for (i = 0; i < playerOne; ++i) {
            this.add({
                xtype: 'imagecomponent',
                imgCls: 'capture-green'
            });
        }

        for (i = 0; i < playerTwo; ++i) {
            this.add({
                xtype: 'imagecomponent',
                imgCls: 'capture-red'
            });
        }
    }
});
Ext.define('Pente.lib.ColorPicker', {
    extend: 'Ext.picker.Color',
    alias: 'widget.pente-colorpicker',
    colors: [
        '000000', '800000', '008000', '808000', '000080', '800080', '008080', 'C0C0C0',
        'C0DCC0', 'A6CAF0', 'FFF0D4', 'FFE2B1', 'FFD48E', 'FFC66B', 'FFB848', 'FFAA25',
        'FFAA00', 'DC9200', 'B97A00', '966200', '734A00', '503200', 'FFE3D4', 'FFC7B1',
        'FFAB8E', 'FF8F6B', 'FF7348', 'FF5725', 'FF5500', 'DC4900', 'B93D00', '963100',
        '732500', '501900', 'FFD4D4', 'FFB1B1', 'FF8E8E', 'FF6B6B', 'FF4848', 'FF2525',
        'FF0000', 'DC0000', 'B90000', '960000', '730000', '500000', 'FFD4E3', 'FFB1C7',
        'FF8EAB', 'FF6B8F', 'FF4873', 'FF2557', 'FF0055', 'DC0049', 'B9003D', '960031',
        '730025', '500019', 'FFD4F0', 'FFB1E2', 'FF8ED4', 'FF6BC6', 'FF48B8', 'FF25AA',
        'FF00AA', 'DC0092', 'B9007A', '960062', '73004A', '500032', 'FFD4FF', 'FFB1FF',
        'FF8EFF', 'FF6BFF', 'FF48FF', 'FF25FF', 'FF00FF', 'DC00DC', 'B900B9', '960096',
        '730073', '500050', 'F0D4FF', 'E2B1FF', 'D48EFF', 'C66BFF', 'B848FF', 'AA25FF',
        'AA00FF', '9200DC', '7A00B9', '620096', '4A0073', '320050', 'E3D4FF', 'C7B1FF',
        'AB8EFF', '8F6BFF', '7348FF', '5725FF', '5500FF', '4900DC', '3D00B9', '310096',
        '250073', '190050', 'D4D4FF', 'B1B1FF', '8E8EFF', '6B6BFF', '4848FF', '2525FF',
        '0000FF', '0000DC', '0000B9', '000096', '000073', '000050', 'D4E3FF', 'B1C7FF',
        '8EABFF', '6B8FFF', '4873FF', '2557FF', '0055FF', '0049DC', '003DB9', '003196',
        '002573', '001950', 'D4F0FF', 'B1E2FF', '8ED4FF', '6BC6FF', '48B8FF', '25AAFF',
        '00AAFF', '0092DC', '007AB9', '006296', '004A73', '003250', 'D4FFFF', 'B1FFFF',
        '8EFFFF', '6BFFFF', '48FFFF', '25FFFF', '00FFFF', '00DCDC', '00B9B9', '009696',
        '007373', '005050', 'D4FFF0', 'B1FFE2', '8EFFD4', '6BFFC6', '48FFB8', '25FFAA',
        '00FFAA', '00DC92', '00B97A', '009662', '00734A', '005032', 'D4FFE3', 'B1FFC7',
        '8EFFAB', '6BFF8F', '48FF73', '25FF57', '00FF55', '00DC49', '00B93D', '009631',
        '007325', '005019', 'D4FFD4', 'B1FFB1', '8EFF8E', '6BFF6B', '48FF48', '25FF25',
        '00FF00', '00DC00', '00B900', '009600', '007300', '005000', 'E3FFD4', 'C7FFB1',
        'ABFF8E', '8FFF6B', '73FF48', '57FF25', '55FF00', '49DC00', '3DB900', '319600',
        '257300', '195000', 'F0FFD4', 'E2FFB1', 'D4FF8E', 'C6FF6B', 'B8FF48', 'AAFF25',
        'AAFF00', '92DC00', '7AB900', '629600', '4A7300', '325000', 'FFFFD4', 'FFFFB1',
        'FFFF8E', 'FFFF6B', 'FFFF48', 'FFFF25', 'FFFF00', 'DCDC00', 'B9B900', '969600',
        '737300', '505000', 'F2F2F2', 'E6E6E6', 'DADADA', 'CECECE', 'C2C2C2', 'B6B6B6',
        'AAAAAA', '9E9E9E', '929292', '868686', '7A7A7A', '6E6E6E', '626262', '565656',
        '4A4A4A', '3E3E3E', '323232', '262626', '1A1A1A', '0E0E0E', 'FFFBF0', 'A0A0A4',
        '808080', 'FF0000', '00FF00', 'FFFF00', '0000FF', 'FF00FF', '00FFFF', 'FFFFFF'
    ]
});

Ext.define('Pente.lib.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.pente-toolbar',
    requires: [ 'Pente.lib.ColorPicker' ],
    items: [
        {
            xtype: 'button',
            tooltip: { text: 'Play a new game', title: 'New Game'},
            text: 'New Game',
            iconCls: 'new',
            focusCls: '',
            id: 'newButton'
        },
        {
            xtype: 'button',
            tooltip: { text: 'Change game settings', title: 'Settings' },
            text: 'Settings',
            iconCls: 'gear',
            focusCls: '',
            id: 'settingsButton',
            menu: {
                items: [
                    {
                        text: 'Table Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'pente-colorpicker',
                                    id: 'table-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Board Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'pente-colorpicker',
                                    id: 'board-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Grid Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'pente-colorpicker',
                                    id: 'grid-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Player One Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'pente-colorpicker',
                                    id: 'player-one-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Player Two Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'pente-colorpicker',
                                    id: 'player-two-picker'
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            xtype: 'button',
            tooltip: { text: 'About Pente for ExtJS', title: 'About' },
            text: 'About Pente',
            iconCls: 'help',
            focusCls: '',
            id: 'aboutButton'
        }
    ],
    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 150;
        this.callParent(arguments);
    }
});


Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    requires: [ 'Pente.lib.Toolbar', 'Pente.lib.Statusbar' ],
    alias: 'pente-frame',
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
    items: [
        { xtype: 'pente-view' }
    ],
    dockedItems: [
        { xtype: 'pente-toolbar' }
    ],
    bbar: { xtype: 'pente-statusbar' },
    resizable: false
});


