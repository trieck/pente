function init() {
    var panel = Ext.create('Ext.form.FormPanel', {
        bodyStyle: 'background-color:#503200;'
    });

    Ext.create('Ext.window.Window', {
        height: 125,
        width: 200,
        closable: false,
        title: 'Pente',
        border: true,
        layout: 'fit',
        items: panel,
        resizable: false
    }).show();
}

Ext.onReady(init);
