Ext.define('Pente.store.PieceStore', {
	extend: 'Pente.lib.MapStore',
	model: 'Pente.model.Piece',
	autoSync: true,
	autoLoad: true,
	proxy: {
		type: 'sessionstorage',
		id: 'PieceKey',
		reader: {
			model: 'Pente.model.Piece'
		}
	},

	removeAll: function () {
		this.callParent(arguments);
		this.proxy.clear();
		this.proxy.initialize();
	}
});
