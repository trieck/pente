Ext.define('Pente.controller.Controller', {
		extend: 'Ext.app.Controller',
		models: [ 'Pente.model.Piece' ],
		stores: [ 'Pente.store.Store' ],
		views: [ 'Pente.view.View' ],

		refs: [
			{
				selector: 'pente-view',
				ref: 'penteView'
			}
		],

		init: function () {
			var store = this.getPenteStoreStoreStore();
			store.on("load", this.onStoreLoad, this);
			store.on("add", this.onStoreAdd, this);
			this.control({
				'pente-view': {
					render: this.onViewRendered
				}
			});
		},

		onViewRendered: function () {
			var view = this.getPenteView();
			view.body.on('click', Ext.bind(this.onClicked, this));
		},

		onClicked: function (e) {
			var pt, piece, view = this.getPenteView(), event = e.browserEvent;
			var bt = Pente.lib.Board;
			var store = this.getPenteStoreStoreStore();
			var x = event.offsetX ? event.offsetX : event.layerX;
			var y = event.offsetY ? event.offsetY : event.layerY;
			var bOnBoard = bt.ptOnBoard(x, y);
			if (bOnBoard) {
				pt = bt.getSquare(x, y);
				piece = this.getPiece(pt.x, pt.y);
				if (!store.findRecord('key', piece.key)) {
					store.add(piece);
				}
			}
		},

		getPiece: function (x, y) {
			var key = Pente.lib.Board.key(x, y);
			return { key: key, x: x, y: y, who: 1 };
		},

		onLaunch: function () {
			var store = this.getPenteStoreStoreStore();
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

		addToView: function (records) {
			var view = this.getPenteView();
			var len = records.length;
			for (var i = 0; i < len; ++i) {
				var item = records[i];
				view.drawPiece({x: item.data.x, y: item.data.y});
			}
		}
	}
)
;
