Ext.application({
    name: 'Pente',
    appFolder: 'app',
    controllers: [ 'GameController' ],

    launch: function () {
        var controller = this.getController('GameController');
        var ModelType = controller.getBoardModel();

        Ext.create('Ext.window.Window', {
            height: 480,
            width: 438,
            frame: true,
            closable: false,
            title: 'Pente for ExtJS',
            border: true,
            layout: 'fit',
            items: { xtype: 'gameview' },
            resizable: false
        }).show();
    }
});
