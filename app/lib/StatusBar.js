Ext.define('Pente.lib.Statusbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.pente-statusbar',
    items: [
        {
            xtype: 'tbtext',
            text: 'Ready'
        },
        '->',
        '-'
    ],

    initComponent: function () {
        this.callParent(arguments);
        this.setCaptures(3, 2);
    },

    removeCaptures: function () {
        var items = Ext.ComponentQuery.query('imagecomponent[imgCls^=capture]');
        Ext.each(items, function (item) {
            item.destroy();
        });
    },

    setCaptures: function (playerOne, playerTwo) {
        var i;

        this.removeCaptures();

        for (i = 0; i < playerOne; ++i) {
            this.add({
                xtype: 'imagecomponent',
                imgCls: 'capture-green'
            });
        }

        for (i = 0; i < playerTwo; ++i) {
            this.add({
                xtype: 'imagecomponent',
                imgCls: 'capture-red'
            });
        }
    }
});