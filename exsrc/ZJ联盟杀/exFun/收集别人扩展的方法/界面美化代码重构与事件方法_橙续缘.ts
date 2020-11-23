//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "界面美化代码重构与事件方法_橙续缘", NG.ImportFumType.run,

            //独立提取橙续缘-界面美化 的 代码重构与事件方法，即使删除扩展了，想使用这些核心方法可以使用；
            //其独特的改写方法方式，可进行方法扩展，与部分替换，可对内部方法进行大量动态改写提供一定的操作；
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //去除掉扩展加载相关的：
                var app = {
                    name: '界面美化',
                    each: function (obj, fn, node) {
                        if (!obj) return node;
                        if (typeof obj.length === 'number') {
                            for (var i = 0; i < obj.length; i++) {
                                if (fn.call(node, obj[i], i) === false) {
                                    break;
                                }
                            }
                            return node;
                        }
                        for (var i in obj) {
                            if (fn.call(node, obj[i], i) === false) {
                                break;
                            }
                        }
                        return node;
                    },
                    isFunction: function (fn) {
                        return typeof fn === 'function';
                    },
                    event: {
                        listens: {},
                        on: function (name, listen, remove) {
                            if (!this.listens[name]) {
                                this.listens[name] = [];
                            }
                            this.listens[name].push({
                                listen: listen,
                                remove: remove,
                            });
                            return this;
                        },
                        off: function (name, listen) {
                            return app.each(this.listens[name], function (item, index) {
                                if (listen === item || listen === item.listen) {
                                    this.listens[name].splice(index, 1);
                                }
                            }, this);
                        },
                        emit: function (name) {
                            var args = Array.from(arguments).slice(1);
                            return app.each(this.listens[name], function (item) {
                                item.listen.apply(null, args);
                                item.remove && this.off(name, item);
                            }, this);
                        },
                        once: function (name, listen) {
                            return this.on(name, listen, true);
                        },
                    },
                    create: {},
                    listens: {},

                    // 事件api：
                    on: function (event, listen) {
                        if (!app.listens[event]) {
                            app.listens[event] = [];
                        }
                        app.listens[event].add(listen);
                    },
                    once: function (event, listen) {
                        if (!app.listens[event]) {
                            app.listens[event] = [];
                        }
                        app.listens[event].push({
                            listen: listen,
                            remove: true,
                        });
                    },
                    off: function (event, listen) {
                        var listens = app.listens[event] || [];
                        var filters = listen ? listens.filter(function (item) {
                            return item === listen || item.listen === listen;
                        }) : listens.slice(0);
                        filters.forEach(function (item) {
                            listens.remove(item);
                        });
                    },
                    emit: function (event) {
                        var args = Array.from(arguments).slice(1);
                        var listens = app.listens[event] || [];
                        listens.forEach(function (item) {
                            if (typeof item === 'function') {
                                item.apply(null, args);
                            } else if (typeof item.listen === 'function') {
                                item.listen.apply(null, args);
                                item.remove && listens.remove(item);
                            }
                        });
                    },

                    // 重写方法：
                    reWriteFunction: function (target, name, replace, str) {
                        if (name && typeof name === 'object') {
                            return app.each(name, function (item, index) {
                                app.reWriteFunction(target, index, item[0], item[1]);
                            }, target);
                        }

                        // var plugins = app.pluginsMap;
                        if ((typeof replace === 'string' || replace instanceof RegExp) &&
                            (typeof str === 'string' || str instanceof RegExp)) {
                            var funcStr = target[name].toString().replace(replace, str);
                            eval('target.' + name + ' = ' + funcStr);
                        } else {
                            var func = target[name];
                            target[name] = function () {
                                var result, cancel;
                                var args = Array.from(arguments);
                                var args2 = Array.from(arguments);
                                if (typeof replace === 'function') cancel = replace.apply(this, [args].concat(args));
                                if (typeof func === 'function' && !cancel) result = func.apply(this, args);
                                if (typeof str === 'function') str.apply(this, [result].concat(args2));
                                return cancel || result;
                            };
                        }
                        return target[name];
                    },

                    //todo：改版过：
                    reWriteFunctionX: function (target, name, replace, str) {
                        if (name && typeof name === 'object') {
                            return app.each(name, function (item, index) {
                                //方式一： 个人扩展，方便同个方法多个修改时书写格式：（下面使用方式二优化方案）
                                // if(app.isDeep(item)){
                                //     return app.each(item, function (itemX, indexX) {
                                //         app.reWriteFunctionX(target, index, itemX); //目测这种方法不适用于套娃（一般不推荐套娃）
                                //     }, target);
                                // } else {
                                //     app.reWriteFunctionX(target, index, item);
                                // }
                                app.reWriteFunctionX(target, index, item);
                            }, target);
                        }

                        if (Array.isArray(replace)) {
                            //方式二：这样可以稍微提高点效率：
                            if(app.isDeep(replace)){
                                var funcStr = target[name].toString();
                                app.each(replace, function (itemX, indexX) {
                                    var item1 = itemX[0];
                                    var item2 = itemX[1];
                                    var item3 = itemX[2];
                                    if (item3 === 'append') {
                                        item2 = item1 + item2;
                                    } else if (item3 === 'insert') {
                                        item2 = item2 + item1;
                                    }
                                    if (typeof item1 === 'string' && typeof item2 === 'string') {
                                        funcStr = funcStr.replace(item1, item2);
                                    } //采用数组方式，抛弃方法拼接： 
                                }, target);
                                eval('target.' + name + ' = ' + funcStr); //处理完字符串再操作
                            } else {
                                var item1 = replace[0];
                                var item2 = replace[1];
                                var item3 = replace[2];
                                if (item3 === 'append') {
                                    item2 = item1 + item2;
                                } else if (item3 === 'insert') {
                                    item2 = item2 + item1;
                                }
                                // todo: 奇怪，没法替换，不过按照上面的拼装逻辑，用正则表达式作为参数貌似不大可行
                                // if (typeof item1 === 'string') {
                                //     item1 = new RegExp(item1);
                                // }
                                // if (item1 instanceof RegExp && typeof item2 === 'string') {
                                if (typeof item1 === 'string' && typeof item2 === 'string') {
                                    var funcStr = target[name].toString();
                                    funcStr = funcStr.replace(item1, item2);
                                    eval('target.' + name + ' = ' + funcStr);
                                } else {
                                    var func = target[name];
                                    target[name] = function () {
                                        var arg1 = Array.from(arguments);
                                        var arg2 = Array.from(arguments);
                                        var result;
                                        if (app.isFunction(item1)) result = item1.apply(this, [arg1].concat(arg1));
                                        if (app.isFunction(func) && !result) result = func.apply(this, arg1);
                                        if (app.isFunction(item2)) item2.apply(this, [result].concat(arg2));
                                        return result;
                                    };
                                }
                            }

                        } else {
                            console.info(arguments);
                        }
                        return target[name];
                    },

                    //新增一个简单检索是否是二维数组的方法
                    isDeep: arr => arr.some(item=> item instanceof Array),

                    // 原版：
                    // reWriteFunctionX_原版: function (target, name, replace, str) {
                    //     if (name && typeof name === 'object') {
                    //         return app.each(name, function (item, index) {
                    //             app.reWriteFunction(target, index, item);
                    //         }, target);
                    //     }

                    //     if (Array.isArray(replace)) {
                    //         var item1 = replace[0];
                    //         var item2 = replace[1];
                    //         var item3 = replace[2];
                    //         if (item3 === 'append') {
                    //             item2 = item1 + item2;
                    //         } else if (item3 === 'insert') {
                    //             item2 = item2 + item1;
                    //         }
                    //         if (typeof item1 === 'string') {
                    //             item1 = RegExp(item1);
                    //         }
                    //         if (item1 instanceof RegExp && typeof item2 === 'string') {
                    //             var funcStr = target[name].toString().replace(item1, item2);
                    //             eval('target.' + name + ' = ' + funcStr);
                    //         } else {
                    //             var func = target[name];
                    //             target[name] = function () {
                    //                 var arg1 = Array.from(arguments);
                    //                 var arg2 = Array.from(arguments);
                    //                 var result;
                    //                 if (app.isFunction(item1)) result = item1.apply(this, [arg1].concat(arg1));
                    //                 if (app.isFunction(func) && !result) result = func.apply(this, arg1);
                    //                 if (app.isFunction(item2)) item2.apply(this, [result].concat(arg2));
                    //                 return result;
                    //             };
                    //         }
                    //     } else {
                    //         console.info(arguments);
                    //     }
                    //     return target[name];
                    // },
                    
                    //该扩展，拥有自己的一套模块化方式，暂时删除；
                    //import，importPlugin，loadPlugins

                    //开发过程中，感觉后续需要增加的功能：
                    //1.去空格：防止新文件有时会出现多一个空格少一个空格，检索无效，可以指定搜不到时，再去一次空格搜一下；
                    //2.枚举支持同一个key对应多个修改，这样比较方便；
                };

                //保存在lib中：
                if(lib.app){
                    for (const key in app) {
                        lib.app[key] = app[key];
                    }
                } else {
                    lib.app = app;
                }

                return null;
            });
    })();
}