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
				store.add(piece);
				store.sync();
				view.drawPiece(pt);
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

		onStoreLoaded: function () {
			view = this.getPenteView();
			var store = this.getPenteStoreStoreStore();
			store.data.each(function (item) {
				view.drawPiece({x: item.data.x, y: item.data.y});
			});
		}
	}
);
