Ext.define('Pente.view.GameView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gameview',
    bodyStyle: 'background-color:#503200;',
    requires: [ 'Pente.lib.Table' ],
    items: [
        { xtype: 'pentetable' }
    ],

    initComponent: function () {
        var dims = Pente.model.Board.boundingRect();
        var size = dims.getSize();
        this.height = size.height;
        this.width = size.width;
        this.callParent(arguments);
    }
});