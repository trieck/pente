Ext.define('Pente.controller.GameController', {
    extend: 'Ext.app.Controller',
    models: [ 'Pente.model.Board' ],
    views: [ 'Pente.view.View' ],

    init: function () {
        this.control({
            'view': {
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