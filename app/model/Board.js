Ext.define('Pente.model.Board', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'who', type: 'int' },
        { name: 'table-color', type: 'string' },
        { name: 'board-color', type: 'string' },
        { name: 'grid-color', type: 'string' },
        { name: 'player-one-color', type: 'string' },
        { name: 'player-two-color', type: 'string' }
    ]
});
