Ext.define('Pente.store.PieceStore', {
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
	removeAll: function() {
		this.callParent(arguments);
		this.proxy.clear();
		this.proxy.initialize();
	}
});
