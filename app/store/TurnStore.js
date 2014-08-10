Ext.define('Pente.store.TurnStore', {
	extend: 'Ext.data.Store',
	model: 'Pente.model.Turn',
	autoSync: true,
	autoLoad: true,
	proxy: {
		type: 'sessionstorage',
		id: 'TurnKey',
		reader: {
			model: 'Pente.model.Turn'
		}
	},
	changeTurns: function () {
		var record = this.getRecord();
		record.data.who = record.data.who == 0 ? 1 : 0;
		record.dirty = true;
		this.sync();
	},
	who: function () {
		var record = this.getRecord();
		return record.data.who;
	},
	getRecord: function () {
		var record = this.getAt(0);
		if (!record) {
			record = this.add({who: 0})[0];
		}
		return record;
	},
	removeAll: function () {
		this.callParent(arguments);
		this.proxy.clear();
		this.proxy.initialize();
	}
});
