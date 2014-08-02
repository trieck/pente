Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    requires: [ 'Pente.lib.Toolbar', 'Pente.lib.Statusbar' ],
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
    items: [
        { xtype: 'pente-toolbar' },
        { xtype: 'pente-view' },
        { xtype: 'pente-statusbar' }
    ],
    resizable: false,

    initComponent: function () {
        this.callParent(arguments);
    }
});
