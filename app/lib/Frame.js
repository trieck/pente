Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    requires: [ 'Pente.lib.Toolbar', 'Pente.lib.Statuspanel' ],
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
    items: [
        { xtype: 'pente-toolbar' },
        { xtype: 'pente-view' },
        { xtype: 'pente-statuspanel' }
    ],
    resizable: false,

    initComponent: function () {
        this.callParent(arguments);
    }
});
