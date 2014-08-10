Ext.define('Pente.model.Piece', {
	extend: 'Ext.data.Model',
	fields: [
		{ name: 'key', type: 'int' },
		{ name: 'x', type: 'int'},
		{ name: 'y', type: 'int'},
		{ name: 'who', type: 'int'}
	]
});
