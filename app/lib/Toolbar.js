Ext.define('Pente.lib.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.pente-toolbar',
    items: [
        {
            xtype: 'button',
            tooltip: { text: 'Play a new game', title: 'New Game'},
            iconCls: 'new',
            id: 'newButton'
        },
        {
            xtype: 'button',
            tooltip: { text: 'Change game settings', title: 'Settings' },
            iconCls: 'gear',
            id: 'settingsButton'
        },
        {
            xtype: 'button',
            tooltip: { text: 'About Pente for ExtJS', title: 'About' },
            iconCls: 'help',
            id: 'helpButton'
        }
    ],
    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 150;
        this.callParent(arguments);
    }
});

