Ext.define('Pente.lib.Table', {
    extend: 'Ext.draw.Component',
    alias: 'widget.pentetable',
    viewBox: false,
    items: [
        {
            type: "path",
            path: "M75,75 c0,-25 50,25 50,0 c0,-25 -50,25 -50,0",
            fill: "purple"
        }
    ],
    renderTo: document.body
});