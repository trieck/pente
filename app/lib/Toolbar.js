Ext.define('Pente.lib.Toolbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.pente-toolbar',
    items: [
        {
            xtype: 'button',
            tooltip: { text: 'Play a new game', title: 'New Game'},
            text: 'New Game',
            iconCls: 'new',
            focusCls: '',
            id: 'newButton'
        },
        {
            xtype: 'button',
            tooltip: { text: 'Change game settings', title: 'Settings' },
            text: 'Settings',
            iconCls: 'gear',
            focusCls: '',
            id: 'settingsButton',
            menu: {
                items: [
                    {
                        text: 'Table Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'colorpicker',
                                    id: 'table-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Board Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'colorpicker',
                                    id: 'board-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Grid Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'colorpicker',
                                    id: 'grid-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Player One Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'colorpicker',
                                    id: 'player-one-picker'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Player Two Color',
                        iconCls: 'colors',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    xtype: 'colorpicker',
                                    id: 'player-two-picker'
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            xtype: 'button',
            tooltip: { text: 'About Pente for ExtJS', title: 'About' },
            text: 'About Pente',
            iconCls: 'help',
            focusCls: '',
            id: 'helpButton'
        }
    ],
    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 150;
        this.callParent(arguments);
    }
});

