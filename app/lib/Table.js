Ext.define('Pente.lib.Table', {
    extend: 'Ext.draw.Component',
    alias: 'widget.pente-table',
    requires: [ 'Pente.model.Board' ],
    viewBox: false,
    items: [
        {
            type: 'rect',
            width: Pente.model.Board.width(),
            height: Pente.model.Board.height(),
            fill: '#fff0d4',
            x: Pente.model.Board.cxBorder,
            y: Pente.model.Board.cyBorder
        }
    ]
});