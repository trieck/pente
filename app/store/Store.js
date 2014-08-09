Ext.define('Pente.store.Store', {
	extend: 'Ext.data.Store',
	model: 'Pente.model.Board',
	proxy: {
		type: 'memory',
		reader: {
			model: 'Pente.model.Board',
			type: 'json'
		}
	}
});
