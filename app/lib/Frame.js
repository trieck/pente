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
	resizable: false,
	listeners: {
		afterrender: function () {
			var mask = this.getComponent('load-indicator');
			mask.show();
		}
	},
	initComponent: function () {
		var mask = new Ext.LoadMask(this, { id: 'load-indicator' });
		this.items.push(mask);
		this.callParent(arguments);
	}
})
;
