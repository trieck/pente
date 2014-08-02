Ext.define('Pente.lib.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.pentebar',
    items: [
        {
            xtype: 'splitbutton',
            text: 'Users',
            iconCls: 'user'
        }
    ]
});

