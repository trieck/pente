Ext.define('Pente.controller.GameController', {
		extend: 'Ext.app.Controller',
		models: [ 'Pente.model.Board' ],
		views: [ 'Pente.view.View' ],
		board: null,

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
			view.body.on('click', Ext.bind(this.onClicked, this));
		},

		onClicked: function (e) {
			var event = e.browserEvent;
			var x = event.offsetX ? event.offsetX : event.layerX;
			var y = event.offsetY ? event.offsetY : event.layerY;
			var bOnBoard = this.board.self.ptOnBoard(x, y);
			if (bOnBoard) {
				var pt = this.board.self.getSquare(x, y);
				this.board.addPiece(pt);
			}
		}
	}
);
