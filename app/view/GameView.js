Ext.define('Pente.view.GameView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gameview',
    bodyStyle: 'background-color:#503200;',
    items: [
        {
            xtype: 'draw',
            x: 200,
            y: 100,
            viewBox: false,
            items: [{
                type: 'circle',
                fill: '#ffc',
                radius: 100,
                x: 100,
                y: 100
            }],
            renderTo: document.body
        }
    ],

    initComponent: function () {
        console.log('The view was initialized!');
        this.callParent(arguments);
    }
});