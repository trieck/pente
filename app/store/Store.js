Ext.define('Pente.store.Store', {
	extend: 'Ext.data.Store',
	model: 'Pente.model.Piece',
	autoSync: true,
	proxy: {
		type: 'sessionstorage',
		id: 'PenteProxyKey',
		reader: {
			model: 'Pente.model.Piece',
			type: 'json'
		}
	},
	load: function () {
		this.callParent(arguments);
	}
});
