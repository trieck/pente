Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    requires: [ 'Pente.lib.Toolbar' ],
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
   items: [
        { xtype: 'pentebar' },
        { xtype: 'gameview' }
    ],
    resizable: false,

    initComponent: function () {
        this.callParent(arguments);
    }
});
