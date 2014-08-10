Ext.define('Pente.controller.Controller', {
		extend: 'Ext.app.Controller',
		models: [ 'Pente.model.Piece' ],
		stores: [ 'Pente.store.PieceStore' ],
		views: [ 'Pente.view.View' ],

		refs: [
			{
				selector: 'pente-view',
				ref: 'penteView'
			}
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

		onViewRendered: function () {
			var view = this.getPenteView();
			view.body.on('click', Ext.bind(this.onClicked, this));
		},

		onClicked: function (e) {
			var pt, piece, event = e.browserEvent;
			var bt = Pente.lib.Board;
			var store = this.getPenteStorePieceStoreStore();
			var x = event.offsetX ? event.offsetX : event.layerX;
			var y = event.offsetY ? event.offsetY : event.layerY;
			var bOnBoard = bt.ptOnBoard(x, y);
			if (bOnBoard) {
				pt = bt.getSquare(x, y);
				piece = this.getPiece(pt.x, pt.y);
				if (store.findExact('key', piece.key) == -1) {
					store.add(piece);
				}
			}
		},

		getPiece: function (x, y) {
			var key = Pente.lib.Board.key(x, y);
			return { key: key, x: x, y: y, who: 1 };
		},

		onLaunch: function () {
			var store = this.getPenteStorePieceStoreStore();
			store.load({
				callback: this.onStoreLoaded,
				scope: this
			});
		},

		onStoreLoad: function (store, records, successful, eOpts) {
			this.addToView(records);
		},

		onStoreAdd: function (store, records, index, eOpts) {
			this.addToView(records);
		},

		onStoreLoaded: function () {
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
				var item = records[i];
				view.drawPiece({x: item.data.x, y: item.data.y});
			}
		},

		onNewGame: function () {
			var store = this.getPenteStorePieceStoreStore();
			store.removeAll();
		}
	}
)
;
