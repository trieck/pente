Ext.define('Pente.lib.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.pente-toolbar',
    items: [
        {
            xtype: 'button',
            tooltip: { text: 'Play a new game', title: 'New Game'},
            iconCls: 'new',
            onClick: function () {
                Ext.Msg.alert('new');
            }
        },
        {
            xtype: 'button',
            tooltip: { text: 'Change game settings', title: 'Settings' },
            iconCls: 'gear',
            onClick: function () {
                Ext.Msg.alert('settings');
            }
        },
        {
            xtype: 'button',
            tooltip: { text: 'About Pente for ExtJS', title: 'About' },
            iconCls: 'help',
            onClick: function () {
                Ext.Msg.alert('help');
            }
        }
    ],
    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 150;
        this.callParent(arguments);
    }
});

