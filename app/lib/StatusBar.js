Ext.define('Pente.lib.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    cls: 'x-statusbar',
    busyIconCls: 'x-status-busy',
    busyText: 'Loading...',
    autoClear: 5000,
    emptyText: '&#160;',
    activeThreadId: 0,

    initComponent: function () {
        var right = this.statusAlign === 'right';

        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });

        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }
    },

    setStatus: function (o) {
        var me = this;

        o = o || {};
        Ext.suspendLayouts();
        if (Ext.isString(o)) {
            o = {text: o};
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }

        if (o.clear) {
            var c = o.clear,
                wait = me.autoClear,
                defaults = {useDefaults: true, anim: true};

            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }

            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    clearStatus: function (o) {
        o = o || {};

        var me = this,
            statusEl = me.statusEl;

        if (o.threadId && o.threadId !== me.activeThreadId) {
            // this means the current call was made internally, but a newer
            // thread has set a message since this call was deferred.  Since
            // we don't want to overwrite a newer message just ignore.
            return me;
        }

        var text = o.useDefaults ? me.defaultText : me.emptyText,
            iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';

        if (o.anim) {
            // animate the statusEl Ext.Element
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function () {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
            me.setStatus({
                text: text,
                iconCls: iconCls
            });
        }
        return me;
    },

    setText: function (text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    getText: function () {
        return this.text;
    },

    setIcon: function (cls) {
        var me = this;

        me.activeThreadId++;
        cls = cls || '';

        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    showBusy: function (o) {
        if (Ext.isString(o)) {
            o = { text: o };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    }
});
