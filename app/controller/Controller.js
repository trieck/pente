Ext.define('Pente.controller.Controller', {
		extend: 'Ext.app.Controller',
		models: [ 'Pente.model.Board' ],
		stores: [ 'Pente.store.Store' ],
		views: [ 'Pente.view.View' ],

		init: function () {
			var BoardType = this.getPenteModelBoardModel();
			this.board = Ext.create(BoardType);
			this.control({
				'pente-view': {
					render: this.onViewRendered
				}
			});
		},

		onViewRendered: function (view) {
			this.view = view;
			view.body.on('click', Ext.bind(this.onClicked, this));
		},

		onClicked: function (e) {
			var event = e.browserEvent;
			var x = event.offsetX ? event.offsetX : event.layerX;
			var y = event.offsetY ? event.offsetY : event.layerY;
			var bOnBoard = this.board.self.ptOnBoard(x, y);
			if (bOnBoard) {
				var pt = this.board.self.getSquare(x, y);
				if (this.board.addPiece(pt)) {
					this.view.drawPiece(pt);
				}
			}
		}
	}
);
