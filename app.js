Ext.application({
    name: 'Pente',
    appFolder: 'app',
    controllers: [ 'GameController' ],

    launch: function () {
        Ext.create('Pente.lib.Frame').show();
    }
});
