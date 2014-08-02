Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
    layout: 'fit',
    items: { xtype: 'gameview' },
    resizable: false,

    initComponent: function() {
        var dims = Pente.model.Board.boundingRect();
        var size = dims.getSize();
        this.height = size.height;
        this.width = size.width;
        this.callParent(arguments);
    }
});
