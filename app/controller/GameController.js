Ext.define('Pente.controller.GameController', {
    extend: 'Ext.app.Controller',
    models: [ 'Board' ],
    views: [ 'GameView' ],

    init: function () {
        this.control({
            'gameview': {
                render: this.onViewRendered
            }
        });
    },

    onViewRendered: function (view) {
        view.body.on('click', this.onClicked);
    },

    onClicked: function () {
    }
});