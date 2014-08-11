Ext.define('Pente.model.Piece', {
	extend: 'Ext.data.Model',
	statics: {
		PT_PLAYER_ONE: 0,
		PT_PLAYER_TWO: 1
	},
	fields: [
		{ name: 'key', type: 'int' },
		{ name: 'x', type: 'int'},
		{ name: 'y', type: 'int'},
		{ name: 'who', type: 'int'}
	]
});
