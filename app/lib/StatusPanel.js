Ext.define('Pente.lib.Statuspanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pente-statuspanel',
    require: 'Ext.lib.StatusBar',

    bbar: Ext.create('Pente.lib.StatusBar', {
        id: 'pente-status',

        // defaults to use when the status is cleared:
        defaultText: 'Default status text',
        defaultIconCls: 'default-icon',

        // values to set initially:
        text: 'Ready',
        iconCls: 'ready-icon'
    })
});