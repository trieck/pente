Ext.define('Pente.lib.Statusbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.pente-statusbar',
    items: [
        {
            xtype: 'tbtext',
            text: 'Ready'
        },
        '->',
        '-',
        {
            xtype: 'tbtext',
            id: 'player-one-captures'
        },
        '-',
        {
            xtype: 'tbtext',
            id: 'player-two-captures'
        }
    ],

    initComponent: function () {
        var comp, text;
        this.callParent(arguments);

        text = Ext.String.format('Player One Captures: {0}', 0);
        comp = Ext.ComponentManager.get('player-one-captures');
        comp.setText(text);

        text = Ext.String.format('Player Two Captures: {0}', 0);
        comp = Ext.ComponentManager.get('player-two-captures');
        comp.setText(text);
    }
});