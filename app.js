Ext.application({
    name: 'Pente',
    appFolder: 'app',
    controllers: [ 'Controller' ],
    uses: 'Pente.lib.Frame',

    launch: function () {
        Ext.create('pente-frame').show();
    }
});
