Ext.define('Pente.view.GameView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gameview',
    bodyStyle: 'background-color:#503200;',

    initComponent: function () {
        console.log('The view was initialized!');
        this.callParent(arguments);
    }
});