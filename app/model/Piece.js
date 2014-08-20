Ext.define('Pente.model.Piece', {
    extend: 'Ext.data.Model',
    statics: {
        PT_PLAYER_ONE: 1,
        PT_PLAYER_TWO: 2,
        PT_PLAYER_ONE_DEFAULT_COLOR: '008000',
        PT_PLAYER_TWO_DEFAULT_COLOR: '800000'
    },
    fields: [
        { name: 'key', type: 'int' },
        { name: 'x', type: 'int'},
        { name: 'y', type: 'int'},
        { name: 'who', type: 'int'}
    ]
});
