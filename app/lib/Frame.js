Ext.define('Pente.lib.Frame', {
    extend: 'Ext.window.Window',
    requires: [ 'Pente.lib.Toolbar', 'Pente.lib.Statuspanel' ],
    alias: 'pente-frame',
    frame: true,
    closable: false,
    title: 'Pente for ExtJS',
    border: true,
    items: [
        { xtype: 'pente-view' }
    ],
    dockedItems: [
        { xtype: 'pente-toolbar' }
    ],
    bbar: { xtype: 'pente-statuspanel' },
    resizable: false
});
