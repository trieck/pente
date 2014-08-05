Ext.define('Pente.controller.GameController', {
		extend: 'Ext.app.Controller',
		models: [ 'Pente.model.Board' ],
		views: [ 'Pente.view.View' ],

		init: function () {
			this.control({
				'pente-view': {
					render: this.onViewRendered
				}
			});
		},

		onViewRendered: function (view) {
			view.body.on('click', this.onClicked);
		},

		onClicked: function (e) {
			var event = e.browserEvent;
			var x = event.offsetX ? event.offsetX : event.layerX;
			var y = event.offsetY ? event.offsetY : event.layerY;
			var bOnBoard = Pente.model.Board.ptOnBoard(x, y);
			if (bOnBoard) {
				var pt = Pente.model.Board.getSquare(x, y);
				Ext.Msg.alert(Ext.String.format("{0},{1}", pt.x, pt.y));
			}
		}
	}
);
