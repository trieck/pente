/**
 * The MapStore class is used for storing data as an associate container
 * instead of an array of records like the Store class
 */
Ext.define('Pente.lib.MapStore', {
    extend: 'Ext.data.AbstractStore',
    alias: 'store.mapstore',

    requires: [
        'Ext.data.StoreManager',
        'Ext.data.Model'
    ],

    uses: [
        'Ext.ModelManager'
    ],

    statics: {
        recordIdFn: function (record) {
            return record.data.key;
        }
    },

    /**
     * Creates the map store
     * @param {Object} [config] Config object.
     */
    constructor: function (config) {
        // Clone the config so we don't modify the original config object
        config = Ext.apply({}, config);

        var me = this;

        me.callParent([config]);

        me.data = new Ext.util.MixedCollection({
            getKey: Pente.lib.MapStore.recordIdFn
        });

        if (me.autoLoad) {
            // Defer the load until after the current event handler has finished and set up any associated views.
            Ext.defer(me.load, 1, me, [ typeof me.autoLoad === 'object' ? me.autoLoad : undefined ]);
        }
    },

    /**
     * Add Model instance to the map store
     *
     * @param (Object) [arg] model instance data or object to add
     * @return {Ext.data.Model} The model instances that was added
     * @param arg
     */
    add: function (arg) {
        var me = this, record;

        record = arg;
        if (!record.isModel) {
            record = me.createModel(record);
        }
        record = me.data.add(record);

        me.fireEvent('add', me, [record], 0);
        me.fireEvent('datachanged', me);
        if (me.autoSync && !me.autoSyncSuspended) {
            me.sync();
        }

        return record;
    },

    get: function (key) {
        var me = this;
        return me.data.map[key];
    },

    /**
     * Converts a literal to a model, if it's not a model already
     * @private
     * @param {Ext.data.Model/Object} record The record to create
     * @return {Ext.data.Model}
     */
    createModel: function (record) {
        if (!record.isModel) {
            record = Ext.ModelManager.create(record, this.model, record.key);
            record.phantom = true;
        }

        return record;
    },

    getNewRecords: function () {
        return this.data.filterBy(this.filterNew).items;
    },

    getUpdatedRecords: function () {
        return this.data.filterBy(this.filterUpdated).items;
    },

    load: function (options) {
        var me = this;

        options = options || {};

        if (typeof options == 'function') {
            options = {
                callback: options
            };
        }
        return me.callParent([options]);
    },

    onProxyLoad: function (operation) {
        var me = this,
            resultSet = operation.getResultSet(),
            records = operation.getRecords(),
            successful = operation.wasSuccessful();

        if (me.isDestroyed) {
            return;
        }

        if (resultSet) {
            me.totalCount = resultSet.total;
        }

        // Loading should be set to false before loading the records.
        // loadRecords doesn't expose any hooks or events until refresh
        // and datachanged, so by that time loading should be false
        me.loading = false;
        if (successful) {
            me.loadRecords(records, operation);
        }

        if (me.hasListeners.load) {
            me.fireEvent('load', me, records, successful);
        }
    },
    removeAll: function (silent) {
        var me = this;
        me.remove({
            start: 0,
            end: me.getCount() - 1
        }, silent);
        if (silent !== true) {
            me.fireEvent('clear', me);
        }
    },
    remove: function (records, silent) {
        var me = this,
            isNotPhantom,
            i,
            index,
            record,
            length,
            sync,
            data = me.data,
            removeRange,
            removeCount,
            allRecords = [],
            indexes = [],
            fireRemoveEvent = !silent && me.hasListeners.remove;

        // Remove a single record
        if (records.isModel) {
            records = [records];
            length = 1;
        }
        // Or remove(myRecord)
        else if (Ext.isIterable(records)) {
            length = records.length;
        }
        // Allow remove({start:100: end: 110})
        // Private API used by removeAt to remove multiple, contiguous records
        else if (typeof records === 'object') {
            removeRange = true;
            i = records.start;
            length = records.end + 1;
            removeCount = length - i;
        }

        for (; i < length; i++) {
            if (removeRange) {
                record = data.getAt(i);
                index = i;
            } else {
                record = records[i];
                index = me.indexOf(record);
            }

            isNotPhantom = record.phantom !== true;
            record.unjoin(me);
            sync = sync || isNotPhantom;

            allRecords.push(record);
            indexes.push(index);

            if (!removeRange) {
                data.removeAt(index);

                // Only fire individual remove events if not silent, and there are listeners.
                if (fireRemoveEvent) {
                    me.fireEvent('remove', me, record, index, false);
                }
            }
        }

        // If there was no listener for the single remove event, remove all records
        // from collection in one call
        if (removeRange) {
            data.removeRange(records.start, removeCount);
        }

        if (!silent) {
            me.fireEvent('bulkremove', me, allRecords, indexes, false);
            me.fireEvent('datachanged', me);
        }

        if (me.autoSync && sync && !me.autoSyncSuspended) {
            me.sync();
        }
    },
    getCount: function () {
        return this.data.getCount();
    },

    loadRecords: function (records, options) {
        var me = this,
            i = 0,
            length = records.length,
            start,
            addRecords;

        if (options) {
            start = options.start;
            addRecords = options.addRecords;
        }

        if (!addRecords) {
            me.clearData(true);
        }

        me.data.addAll(records);

        if (start !== undefined) {
            for (; i < length; i++) {
                records[i].index = start + i;
                records[i].join(me);
            }
        } else {
            for (; i < length; i++) {
                records[i].join(me);
            }
        }

        me.fireEvent('datachanged', me);
        me.fireEvent('refresh', me);
    }
});
