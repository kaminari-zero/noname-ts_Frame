var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var NG;
(function (NG) {
    function initContent(_lib, _status, _game, _ui, _get, _ai) {
        NG.lib = _lib;
        NG.status = _status;
        NG.game = _game;
        NG.ui = _ui;
        NG.get = _get;
        NG.ai = _ai;
    }
    NG.initContent = initContent;
    function deleteContent() {
        delete NG.lib;
        delete NG.status;
        delete NG.game;
        delete NG.ui;
        delete NG.get;
        delete NG.ai;
    }
    NG.deleteContent = deleteContent;
    var SimpleSkillFrame = (function () {
        function SimpleSkillFrame() {
        }
        SimpleSkillFrame.simpleZhuDongJi = function () {
            var skill = {
                enable: "chooseToUse",
            };
        };
        SimpleSkillFrame.isFilterCard = function (data) {
            var condis = [];
            for (var key in data) {
                var element = data[key];
                if (element) {
                    var subCondis = [];
                    var condType = data[key + "_condType"];
                    if (condType === undefined) {
                        condType = 6;
                    }
                    if (Array.isArray(element)) {
                        for (var j = 0; j < element.length; j++) {
                            var value = element[j];
                            subCondis.push(this.CardFilterFun(key, value, condType));
                        }
                        condis.push(this.setCondition(4, subCondis));
                    }
                    else {
                        condis.push(this.CardFilterFun(key, element, condType));
                    }
                }
            }
            return this.setCondition(data.conditionType, condis);
        };
        SimpleSkillFrame.CardFilterFun = function (key, value, condType) {
            var _this = this;
            return function (event, player) {
                if (NG.get[key]) {
                    var result = _this.setCondition(condType, [
                        function (event, player) {
                            return NG.get[key](event.card);
                        },
                        function () {
                            return value;
                        }
                    ]);
                    return result(event, player);
                }
                else {
                    return event.card[key] == name;
                }
            };
        };
        SimpleSkillFrame.isFilterPlayer = function (data) {
        };
        SimpleSkillFrame.PlayerFilterFun = function (key, value, condType) {
        };
        SimpleSkillFrame.isFilterTarget = function (data) {
        };
        SimpleSkillFrame.TargetFilterFun = function (key, value, condType) {
        };
        SimpleSkillFrame.setCondition = function (type, condis) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var fun = NG.FunctionUtil.getConditon(type, condis);
            return fun;
        };
        return SimpleSkillFrame;
    }());
    NG.SimpleSkillFrame = SimpleSkillFrame;
    var SkillUtil = (function () {
        function SkillUtil() {
        }
        return SkillUtil;
    }());
    NG.SkillUtil = SkillUtil;
})(NG || (NG = {}));
var NG;
(function (NG) {
    var DevUtil;
    (function (DevUtil) {
        var isUseVersion = false;
        var DEBUG = true;
        var ALERT_DEBUG = false;
        DevUtil.version = "";
        Date.prototype.format = function (format) {
            if (!format) {
                format = 'yyyy-MM-dd HH:mm:ss';
            }
            var padNum = function (value, digits) {
                return Array(digits - value.toString().length + 1).join('0') + value;
            };
            var cfg = {
                yyyy: this.getFullYear(),
                MM: padNum(this.getMonth() + 1, 2),
                dd: padNum(this.getDate(), 2),
                HH: padNum(this.getHours(), 2),
                mm: padNum(this.getMinutes(), 2),
                ss: padNum(this.getSeconds(), 2),
                fff: padNum(this.getMilliseconds(), 3),
            };
            return format.replace(/([a-z]|[A-Z])(\1)*/ig, function (m) {
                return cfg[m];
            });
        };
        function getVersionUrl(isV, versionStr) {
            if (isV) {
                if (versionStr)
                    return "v" + versionStr + "/";
                return "v" + DevUtil.version + "/";
            }
            return "master/";
        }
        DevUtil.getVersionUrl = getVersionUrl;
        function printDebug() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (ALERT_DEBUG && DEBUG)
                return;
            var rest = Array.prototype.splice.call(arguments, 0);
            var body2 = "";
            if (rest && rest.length > 0) {
                body2 = rest.join("\n");
            }
            alert(body2);
        }
        DevUtil.printDebug = printDebug;
        function createConsoleDebugLog() {
            if (typeof __dirname === 'string' && __dirname.length && require) {
                var fs_1 = require('fs');
                var options = {
                    flags: 'a',
                    encoding: 'utf8',
                };
                var outUrl_1 = './log.txt';
                var outErrorUrl_1 = "./errorLog.txt";
                if (fs_1.existsSync(outUrl_1)) {
                    fs_1.unlink(outUrl_1, function () { });
                }
                if (fs_1.existsSync(outErrorUrl_1)) {
                    fs_1.unlink(outErrorUrl_1, function () { });
                }
                var outQueue_1 = [];
                var outErrorQueue_1 = [];
                function loggerLog() {
                    if (!DEBUG)
                        return;
                    var time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
                    var start = "[" + time + "] - log message:";
                    var rest = Array.prototype.splice.call(arguments, 0);
                    var data = start + rest.join("\n") + "\n";
                    outQueue_1.push(data);
                    fs_1.appendFile(outUrl_1, outQueue_1.shift(), function () { });
                }
                function errorLog() {
                    if (!DEBUG)
                        return;
                    var time = new Date().format('yyyy-MM-dd HH:mm:ss.fff');
                    var start = "[" + time + "] - err message:";
                    var rest = Array.prototype.splice.call(arguments, 0);
                    var data = start + rest.join("\n") + "\n";
                    outErrorQueue_1.push(data);
                    fs_1.appendFile(outErrorUrl_1, outErrorQueue_1.shift(), function () { });
                }
                return [
                    loggerLog,
                    errorLog
                ];
            }
            return [console.log, console.error];
        }
        var printLogFun = createConsoleDebugLog();
        DevUtil.printLog = printLogFun[0];
        DevUtil.printErrorLog = printLogFun[1];
    })(DevUtil = NG.DevUtil || (NG.DevUtil = {}));
})(NG || (NG = {}));
var NG;
(function (NG) {
    var FunctionUtil = (function () {
        function FunctionUtil() {
        }
        FunctionUtil.defaultTrue = function () {
            return true;
        };
        FunctionUtil.defaultFalse = function () {
            return false;
        };
        FunctionUtil.getDefaultTrueFun = function () {
            return this.defaultTrue;
        };
        FunctionUtil.getDefaultFalseFun = function () {
            return this.defaultFalse;
        };
        FunctionUtil.resultNotFun = function (cond) {
            var condis = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                condis[_i - 1] = arguments[_i];
            }
            var result = cond.apply(null, condis);
            return !result;
        };
        FunctionUtil.resultAndFun = function (conds) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var result = conds.every(function (element) {
                return element.apply(null, args);
            });
            return result;
        };
        FunctionUtil.resultOrFun = function (conds) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var result = conds.some(function (element) {
                return element.apply(null, args);
            });
            return result;
        };
        FunctionUtil.resultXorFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 != result2;
        };
        FunctionUtil.defaultDoAllFun = function (conds) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            conds.forEach(function (element) {
                element.apply(null, args);
            });
            return true;
        };
        FunctionUtil.selectedFun = function (conds) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var fristCond = conds.shift();
            var result = fristCond.apply(null, args);
            var seletedCond = conds[result];
            if (seletedCond) {
                return seletedCond.apply(null, args);
            }
            else {
                return false;
            }
        };
        FunctionUtil.equalFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 == result2;
        };
        FunctionUtil.unequalFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 != result2;
        };
        FunctionUtil.gtFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 > result2;
        };
        FunctionUtil.gteFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 >= result2;
        };
        FunctionUtil.ltFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 < result2;
        };
        FunctionUtil.lteFun = function (cond1, cond2) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result1 = cond1.apply(null, args);
            var result2 = cond2.apply(null, args);
            return result1 == result2;
        };
        FunctionUtil.resultFun = function (cond) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return cond.apply(null, args);
        };
        FunctionUtil.getConditon = function (type, condis) {
            switch (type) {
                case 0:
                    return this.getDefaultTrueFun();
                case 1:
                    return this.getDefaultTrueFun();
                case 2:
                    return this.curry(this.resultNotFun, null, [condis[0]]);
                case 3:
                    return this.curry(this.resultAndFun, null, condis);
                case 4:
                    return this.curry(this.resultOrFun, null, condis);
                case 5:
                    return this.curry(this.resultXorFun, null, [condis[0], condis[1]]);
                case 14:
                    return this.curry(this.selectedFun, null, condis);
                case 16:
                    return this.curry(this.resultFun, null, [condis[0]]);
                case 6:
                    return this.curry(this.equalFun, null, [condis[0], condis[1]]);
                case 7:
                    return this.curry(this.unequalFun, null, [condis[0], condis[1]]);
                case 8:
                    return this.curry(this.gtFun, null, [condis[0], condis[1]]);
                case 9:
                    return this.curry(this.gteFun, null, [condis[0], condis[1]]);
                case 10:
                    return this.curry(this.ltFun, null, [condis[0], condis[1]]);
                case 11:
                    return this.curry(this.lteFun, null, [condis[0], condis[1]]);
            }
        };
        FunctionUtil.createConditionTree = function (datas) {
            var type = datas.type;
            var nodes = datas.nodes;
            var condis = datas.conditionFuns;
            var resultFun = [];
            if (nodes && nodes.length) {
                for (var i = 0; i < nodes.length; i++) {
                    var fun = this.createConditionTree(nodes[i]);
                    resultFun.push(fun);
                }
            }
            var lastFun = this.getConditon(type, resultFun.concat(condis));
            return lastFun;
        };
        FunctionUtil.map = function (array, fn) {
            var results = [];
            if (!fn)
                fn = function (x) { return x; };
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var value = array_1[_i];
                results.push(fn(value));
            }
            return results;
        };
        FunctionUtil.filter = function (array, fn) {
            var results = [];
            if (!fn)
                fn = function (x) { return true; };
            for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
                var value = array_2[_i];
                (fn(value)) ? results.push(value) : undefined;
            }
            return results;
        };
        FunctionUtil.contentAll = function (array, fn) {
            var results = [];
            if (!fn)
                fn = function (x) { return x; };
            for (var _i = 0, array_3 = array; _i < array_3.length; _i++) {
                var value = array_3[_i];
                results.push.apply(results, value);
            }
            return results;
        };
        FunctionUtil.reduce = function (array, fn, initialValue) {
            var accumlator = (initialValue !== undefined) ? initialValue : array[0];
            if (!fn)
                fn = function (x, y) { return x + y; };
            if (initialValue === undefined)
                for (var i = 1; i < array.length; i++)
                    accumlator = fn(accumlator, array[i]);
            else
                for (var _i = 0, array_4 = array; _i < array_4.length; _i++) {
                    var value = array_4[_i];
                    accumlator = fn(accumlator, value);
                }
            return [accumlator];
        };
        FunctionUtil.zip = function (leftArr, rightArr, fn) {
            var index, results = [];
            for (index = 0; index < Math.min(leftArr.length, rightArr.length); index++)
                results.push(fn(leftArr[index], rightArr[index]));
            return results;
        };
        FunctionUtil.curry = function (fn, constext) {
            var arg = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                arg[_i - 2] = arguments[_i];
            }
            var all = arg;
            return function () {
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                all.push.apply(all, rest);
                return fn.apply(constext, all);
            };
        };
        FunctionUtil.curry2 = function (fn) {
            var _this = this;
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            var all = arg || [], length = fn.length;
            return function () {
                var _a;
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                var _args = all.slice(0);
                _args.push.apply(_args, rest);
                if (_args.length < length) {
                    return (_a = _this.curry2).call.apply(_a, __spreadArrays([_this, fn], _args));
                }
                else {
                    return fn.apply(_this, _args);
                }
            };
        };
        FunctionUtil.curry3 = function (fn) {
            var _this = this;
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            var all = arg || [], length = fn.length;
            return function () {
                var _a;
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                var _args = all;
                _args.push.apply(_args, rest);
                if (rest.length === 0) {
                    all = [];
                    return fn.apply(_this, _args);
                }
                else {
                    return (_a = _this.curry3).call.apply(_a, __spreadArrays([_this, fn], _args));
                }
            };
        };
        FunctionUtil.partial = function (fn) {
            var partialArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                partialArgs[_i - 1] = arguments[_i];
            }
            var args = partialArgs;
            return function () {
                var position = 0, len = args.length;
                for (var i = 0; i < len && position < arguments.length; i++) {
                    if (args[i] === undefined) {
                        args[i] = arguments[position++];
                    }
                }
                return fn.apply(null, args);
            };
        };
        FunctionUtil.identity = function (x) {
            return x;
        };
        FunctionUtil.memorize = function (fn) {
            var cache = Object.create(null);
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var key = args.join("-");
                if (key in cache)
                    return cache[key];
                else
                    return cache[key] = fn.apply(this, arguments);
            };
        };
        FunctionUtil.compose = function () {
            var _this = this;
            var fns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fns[_i] = arguments[_i];
            }
            return function (value) {
                return _this.reduce(fns.reverse(), function (acc, fn) { return fn(acc); }, value);
            };
        };
        FunctionUtil.pipe = function () {
            var _this = this;
            var fns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fns[_i] = arguments[_i];
            }
            return function (value) {
                return _this.reduce(fns, function (acc, fn) { return fn(acc); }, value);
            };
        };
        return FunctionUtil;
    }());
    NG.FunctionUtil = FunctionUtil;
    var Container = (function () {
        function Container(val) {
            this.value = val;
        }
        Container.prototype.map = function (fn) {
            return new Container(fn(this.value));
        };
        return Container;
    }());
    NG.Container = Container;
    var Pointed = (function (_super) {
        __extends(Pointed, _super);
        function Pointed() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Pointed.prototype.map = function (fn) {
            return Pointed.of(fn(this.value));
        };
        Pointed.prototype.join = function () {
            return this.value;
        };
        Pointed.of = function (val) {
            return new this(val);
        };
        return Pointed;
    }(Container));
    NG.Pointed = Pointed;
    var MayBe = (function (_super) {
        __extends(MayBe, _super);
        function MayBe() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MayBe.prototype.isNothing = function () {
            return (this.value === null || this.value === undefined);
        };
        MayBe.prototype.map = function (fn) {
            return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value));
        };
        return MayBe;
    }(Pointed));
    NG.MayBe = MayBe;
    var Either = (function () {
        function Either(left, right) {
            this.left = left;
            this.value = right;
        }
        Either.prototype.map = function (fn) {
            return this.value ?
                Either.of(this.left, fn(this.value)) :
                Either.of(fn(this.left), this.value);
        };
        Either.of = function (left, right) {
            return new Either(left, right);
        };
        ;
        return Either;
    }());
    NG.Either = Either;
    var Nothing = (function (_super) {
        __extends(Nothing, _super);
        function Nothing() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Nothing.prototype.map = function (fn) {
            return this;
        };
        return Nothing;
    }(Pointed));
    NG.Nothing = Nothing;
    var Some = (function (_super) {
        __extends(Some, _super);
        function Some() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Some;
    }(Pointed));
    NG.Some = Some;
    var Either2 = (function (_super) {
        __extends(Either2, _super);
        function Either2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Either2.prototype.map = function (fn) {
            var result;
            try {
                result = Either2.of(fn(this.value));
            }
            catch (err) {
                result = Nothing.of({ message: "Nothing错误截取：" + this.value, errorCode: err });
            }
            return result;
        };
        return Either2;
    }(Pointed));
    NG.Either2 = Either2;
    var Monad = (function (_super) {
        __extends(Monad, _super);
        function Monad(val) {
            return _super.call(this, val) || this;
        }
        Monad.prototype.map = function (fn) {
            return Monad.of(fn(this.value));
        };
        Monad.prototype.join = function () {
            return this.value;
        };
        Monad.prototype.chain = function (fn) {
            return this.map(fn).join();
        };
        return Monad;
    }(Pointed));
    NG.Monad = Monad;
    var Ap = (function (_super) {
        __extends(Ap, _super);
        function Ap(val) {
            return _super.call(this, val) || this;
        }
        Ap.prototype.ap = function (f) {
            return Ap.of(this.value(f.value));
        };
        Ap.of = function (val) {
            return new this(val);
        };
        return Ap;
    }(Pointed));
    NG.Ap = Ap;
})(NG || (NG = {}));
var NG;
(function (NG) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.createHelp = function (content, type) {
            var _this = this;
            var str = "";
            var itemTag = "";
            var data;
            if (NG.ObjectUtil.isString(content)) {
                data = [content];
            }
            else if (NG.ObjectUtil.isArray(content)) {
                data = content;
            }
            else {
                console.error("content类型不正确！");
                return "";
            }
            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                if (NG.ObjectUtil.isString(element)) {
                    var _a = [element, type ? type : "0"], text = _a[0], curType = _a[1];
                    switch (curType) {
                        case "0":
                            itemTag = "ol";
                            break;
                        case "1":
                            itemTag = "ul";
                            break;
                    }
                    str += "<li>" + text + "</li>";
                }
                else if (NG.ObjectUtil.isArray(element)) {
                    element.forEach(function (value, index, array) {
                        str += _this.createHelp(value, "1");
                    });
                }
            }
            str = "<" + itemTag + ">" + str + "</" + itemTag + ">";
            return str;
        };
        Utils.getDesc = function (desc) {
            desc = desc.replace(/\#\{[a-zA-Z]+\}/g, function (sub) {
                switch (sub) {
                    case "${content}":
                        return "";
                }
                return sub;
            });
            return desc;
        };
        Utils.setTrigger = function () {
        };
        Utils.loadDevData = function (content, extensionData, lib, game, ui, get, ai, _status) {
            var loadHeroDatas = [];
            var loadCardDatas = [];
            var skillDatas = [];
            for (var key in content) {
                if (content.hasOwnProperty(key)) {
                    var element = content[key];
                    if (key.indexOf("outputHero_") > -1) {
                        loadHeroDatas.push(element(lib, game, ui, get, ai, _status));
                    }
                    else if (key.indexOf("outputCard_") > -1) {
                        loadCardDatas.push(element(lib, game, ui, get, ai, _status));
                    }
                    else if (key.indexOf("outputSkill_") > -1) {
                        skillDatas.push(element(lib, game, ui, get, ai, _status));
                    }
                    else if (key.indexOf("onlyRun_") > -1) {
                        element(lib, game, ui, get, ai, _status);
                    }
                }
            }
            var packName = extensionData.key;
            var heros = extensionData.package.character;
            var cards = extensionData.package.card;
            var skills = extensionData.package.skill;
            console.log(content, extensionData);
            for (var i = 0; i < loadHeroDatas.length; i++) {
                var element = loadHeroDatas[i];
                var cfgName = packName + "_" + element.name;
                heros.character[cfgName] = element.character;
                heros.characterTitle[cfgName] = element.characterTitle;
                heros.characterIntro[cfgName] = element.characterIntro;
                element.nickName && (heros.translate[cfgName] = element.nickName);
                var heroSkills = element.skill;
                for (var skillname in heroSkills) {
                    var skill = heroSkills[skillname];
                    if (skills.skill[skillname]) {
                        console.warn("当前有相同的技能==》", skillname, ";已有技能名：", skills.skill[skillname], ";当前技能名：", skill.name);
                    }
                    else {
                        skills.skill[skillname] = skill;
                        skill.name && (skills.translate[skillname] = skill.name);
                        if (skill.description) {
                            skills.translate[skillname + "_info"] = skill.description;
                        }
                        else {
                            if (!skills.translate[skillname + "_info"]) {
                                skills.translate[skillname + "_info"] = "(暂无描述)";
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < loadCardDatas.length; i++) {
                var element = loadCardDatas[i];
                var cfgName = packName + "_" + element.name;
                cards.card[cfgName] = element.card;
                element.cardName && (cards.translate[cfgName] = element.cardName);
                element.description && (cards.translate[cfgName + "_info"] = element.description);
                if (element.bgName) {
                    cards.translate[cfgName + "_bg"] = element.bgName;
                }
                var cardSkills = element.skill;
                for (var skillname in cardSkills) {
                    var skill = cardSkills[skillname];
                    if (skills.skill[skillname]) {
                        console.warn("当前有相同的技能==》", skillname, ";已有技能名：", skills.skill[skillname], ";当前技能名：", skill.name);
                    }
                    else {
                        skills.skill[skillname] = skill;
                        skill.name && (skills.translate[skillname + "_skill"] = skill.name);
                        if (skill.description) {
                            skills.translate[skillname + "_info"] = skill.description;
                        }
                        else {
                            if (!skills.translate[skillname + "_info"]) {
                                skills.translate[skillname + "_info"] = "(暂无描述)";
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < skillDatas.length; i++) {
                var element = skillDatas[i];
                for (var skillname in element) {
                    var skill = element[skillname];
                    if (skills.skill[skillname]) {
                        console.warn("当前有相同的技能==》", skillname, ";已有技能名：", skills.skill[skillname], ";当前技能名：", skill.name);
                    }
                    else {
                        skills.skill[skillname] = skill;
                        skill.name && (skills.translate[skillname] = skill.name);
                        if (skill.description) {
                            skills.translate[skillname + "_info"] = skill.description;
                        }
                        else {
                            if (!skills.translate[skillname + "_info"]) {
                                skills.translate[skillname + "_info"] = "(暂无描述)";
                            }
                        }
                    }
                }
            }
        };
        Utils.importCurContent = function (content, key, type, importFun) {
            var printHead = "";
            switch (type) {
                case 1:
                    printHead = "outputHero_";
                    break;
                case 2:
                    printHead = "outputCard_";
                    break;
                case 3:
                    printHead = "outputSkill_";
                    break;
                case 4:
                    printHead = "onlyRun_";
                    break;
                case 0:
                    console.warn("暂不导入，已忽略key:", key);
                    return;
            }
            var fieldName = printHead + key;
            if (content && content[fieldName]) {
                console.warn("已导入内有相同的key:", key);
            }
            else if (content && !content[fieldName]) {
                content[fieldName] = importFun;
                console.log("\u5BFC\u5165" + fieldName + "\u6210\u529F\uFF01");
            }
            else {
                console.error("不能导入到空环境中！！！！！");
            }
        };
        Utils.translateDescTxt = function (str) {
            var context = str;
            for (var i = 0; i < this.DescTags.length; i++) {
                var element = this.DescTags[i];
                context = this.replaceTxtUtil(context, element[0], element[1]);
            }
            return context;
        };
        ;
        Utils.replaceTxtUtil = function (context, tag, replaceTxt) {
            var regexp = new RegExp("" + tag, "g");
            return context.replace(regexp, replaceTxt);
        };
        ;
        Utils.DescTags = [
            ["\\[自\\]", "你自己"],
            ["\\[他\\]", "其他一名角色"],
            ["\\[任一\\]", "任意一名角色"],
            ["\\[任\\]", "任意一名角色"],
            ["\\[其他\\]", "除你自己以外任意一名角色"],
            ["\\[全\\]", "全部所有角色"],
            ["\\[他们\\]", "全部所有其他角色"],
            ["\\[判定\\]", "进行一次判定"],
            ["\\[判\\]", "进行一次判定"],
            ["\\[正面\\]", "角色牌正面朝上时"],
            ["\\[正\\]", "角色牌正面朝上时"],
            ["\\[反面\\]", "角色牌反面朝上时"],
            ["\\[反\\]", "角色牌反面朝上时"],
            ["\\[翻面\\]", "将角色牌翻面"],
            ["\\[翻\\]", "将角色牌翻面"],
            ["\\[受伤\\]", "血量不满的角色"],
            ["\\[叠置\\]", "将牌置于角色牌下"],
            ["\\[置\\]", "将牌置于角色牌下，称为"],
            ["\\[结果\\]", "判定牌的判定结果为"],
            ["\\[结\\]", "判定牌的判定结果为"],
            ["\\[D\\]", "置于角色牌下的牌"],
            ["\\[手限\\]", "手牌上限"],
            ["\\[展\\]", "展示牌堆顶(展示完的牌放回去牌堆顶)"],
            ["\\[捡\\]", "展示牌堆顶(展示完的牌放置入弃牌区)"],
            ["\\[摸\\]", "摸牌摸"],
            ["\\[距\\]", "与其他角色计算的距离"],
            ["\\[手\\]", "手牌区域内的"],
            ["\\[场\\]", "装备区域和判定牌区域内的"],
            ["\\[区\\]", "所有区域内的"],
            ["\\{手\\}", "手牌区域"],
            ["\\{装\\}", "装备区域"],
            ["\\{判\\}", "判定牌区域"],
            ["\\{D\\}", "叠置牌区域"],
            ["\\{武\\}", "装备区域武器牌区"],
            ["\\{防\\}", "装备区域防具牌区"],
            ["\\{宝\\}", "装备区域宝具牌区"],
            ["<准备>", "准备阶段"],
            ["<准>", "准备阶段"],
            ["<判定>", "判定阶段"],
            ["<判>", "判定阶段"],
            ["<摸牌>", "摸牌阶段"],
            ["<摸>", "摸牌阶段"],
            ["<出牌>", "出牌阶段"],
            ["<出>", "出牌阶段"],
            ["<弃牌>", "弃牌阶段"],
            ["<弃>", "弃牌阶段"],
            ["<结束>", "结束阶段"],
            ["<结>", "结束阶段"],
            ["\\(男\\)", "(男性角色)"],
            ["\\(女\\)", "(女性角色)"],
            ["\\(火\\)", "(火属性角色)"],
            ["\\(水\\)", "(水属性角色)"],
            ["\\(土\\)", "(土属性角色)"],
            ["\\(金\\)", "(金属性角色)"],
            ["\\(木\\)", "(木属性角色)"],
            ["\\(无\\)", "(无属性角色)"],
            ["\\(非火\\)", "(不是火属性角色)"],
            ["\\(非水\\)", "(不是水属性角色)"],
            ["\\(非土\\)", "(不是土属性角色)"],
            ["\\(非金\\)", "(不是金属性角色)"],
            ["\\(非木\\)", "(不是木属性角色)"],
            ["\\(非无\\)", "(不是无属性角色)"],
            ["\\[入魔\\]", "【入魔状态】（回合内，使用的《杀》的伤害值+1。）"],
            ["\\[重伤\\]", "【重伤状态】（回合内，重伤状态的角色[自]非《血》的目标。）"],
            ["\\[次元\\]", "【次元状态】（回合内，角色不会被选为目标，不会受到伤害，不会）"],
            ["\\[翻面\\]", "【翻面状态】（直到下一轮自己的回合开始时，角色牌背面向上，自己的回合开始时，角色牌翻开正面向上，跳过自己的回合。）"],
            ["\\[连环\\]", "【连环状态】（所有连环状态的角色把角色牌横置，连环状态的角色受到的伤害时，依次受到那一次伤害值的伤害，然后将角色重置为原来的样子。）"],
            ["\\【天\\】", "(势力【天】角色)"],
            ["\\【狱\\】", "(势力【狱】角色)"],
            ["\\【佛\\】", "(势力【佛】角色)"],
            ["\\【魔\\】", "(势力【魔】角色)"],
            ["\\【杀\\】", "(势力【杀】角色)"],
            ["\\【妖\\】", "(势力【妖】角色)"],
            ["\\【法\\】", "(势力【法】角色)"],
            ["\\【骑\\】", "(势力【骑】角色)"],
            ["\\【龍\\】", "(势力【龍】角色)"],
            ["\\【机\\】", "(势力【机】角色)"],
        ];
        return Utils;
    }());
    NG.Utils = Utils;
})(NG || (NG = {}));
var NG;
(function (NG) {
    var ObjectUtil = (function () {
        function ObjectUtil() {
        }
        ObjectUtil.contains = function (obj, member) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && obj[prop] == member) {
                    return true;
                }
            }
            return false;
        };
        ObjectUtil.deepClone = function (obj, isDeep) {
            if (isDeep === void 0) { isDeep = true; }
            if (!obj || typeof obj !== 'object') {
                throw new Error("error type");
            }
            var targetObj = obj.constructor === Array ? [] : {};
            for (var keys in obj) {
                if (obj.hasOwnProperty(keys)) {
                    if (obj[keys] && typeof obj[keys] === 'object' && isDeep) {
                        targetObj[keys] = obj[keys].constructor === Array ? [] : {};
                        targetObj[keys] = this.deepClone(obj[keys], isDeep);
                    }
                    else {
                        targetObj[keys] = obj[keys];
                    }
                }
            }
            return targetObj;
        };
        ObjectUtil.clone = function (value, deep) {
            var _this = this;
            if (this.isPrimitive(value)) {
                return value;
            }
            if (this.isArrayLike(value)) {
                value = Array.prototype.slice.call(value);
                return value.map(function (item) { return deep ? _this.clone(item, deep) : item; });
            }
            else if (this.isPlainObject(value)) {
                var target = {}, key = void 0;
                for (key in value) {
                    value.hasOwnProperty(key) && (target[key] = deep ? this.clone(value[key], deep) : value[key]);
                }
            }
            var type = this.getRawType(value);
            switch (type) {
                case 'Date':
                case 'RegExp':
                case 'Error':
                    value = new Window[type](value);
                    break;
            }
            return value;
        };
        ObjectUtil.arrayClone = function (obj, deep) {
            if (deep === void 0) { deep = false; }
            var buf = [];
            var i = obj.length;
            while (i--) {
                buf[i] = deep ? arguments.callee(obj[i]) : obj[i];
            }
            return buf;
        };
        ObjectUtil.getKeys = function (obj) {
            var keys = [];
            for (var i in obj)
                if (obj.hasOwnProperty(i))
                    keys.push(i);
            return keys;
        };
        ObjectUtil.isStatic = function (value) {
            return (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                typeof value === 'undefined' ||
                value === null);
        };
        ObjectUtil.isPrimitive = function (value) {
            return this.isStatic(value) || typeof value === 'symbol';
        };
        ObjectUtil.isArrayLike = function (value) {
            return value != null && this.isLength(value.length) && !this.isFunction(value);
        };
        ObjectUtil.isLength = function (value) {
            return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
        };
        ObjectUtil.isMethod = function (obj, methodName) {
            if (obj.hasOwnProperty(methodName))
                return obj[methodName] instanceof Function;
            return false;
        };
        ObjectUtil.isUndefined = function (obj) {
            return this.isNull(obj) || obj === undefined || typeof obj === 'undefined';
        };
        ObjectUtil.isNull = function (obj) {
            return obj === null;
        };
        ObjectUtil.isEmpty = function (obj) {
            if (obj == undefined)
                return true;
            if (typeof (obj) == "number")
                return isNaN(obj) || obj == 0;
            if (obj instanceof Array || typeof (obj) == "string")
                return obj.length == 0;
            if (obj instanceof Object) {
                for (var prop in obj)
                    if (obj.hasOwnProperty(prop))
                        return false;
                return true;
            }
            return false;
        };
        ObjectUtil.isObject = function (value) {
            var type = typeof value;
            return value != null && (type == 'object' || type == 'function');
        };
        ObjectUtil.getRawType = function (value) {
            return Object.prototype.toString.call(value).slice(8, -1);
        };
        ObjectUtil.isPlainObject = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        };
        ObjectUtil.isRegExp = function (value) {
            return Object.prototype.toString.call(value) === '[object RegExp]';
        };
        ObjectUtil.isDate = function (value) {
            return Object.prototype.toString.call(value) === '[object Date]';
        };
        ObjectUtil.isArray = function (arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        };
        ObjectUtil.isNumber = function (value) {
            return typeof value == "number" || (!isNaN(value) && !this.isNaN2(value));
        };
        ObjectUtil.isNaN2 = function (value) {
            return value != value;
        };
        ObjectUtil.isString = function (value) {
            return typeof value == "string" || Object.prototype.toString.call(value) == "[object String]";
        };
        ObjectUtil.isFunction = function (value) {
            return Object.prototype.toString.call(value) === '[object Function]';
        };
        ObjectUtil.isNative = function (value) {
            return typeof value === 'function' && /native code/.test(value.toString());
        };
        ObjectUtil.extend = function (to, _from) {
            for (var key in _from) {
                to[key] = _from[key];
            }
            return to;
        };
        ObjectUtil.getClassName = function (obj) {
            if (obj.__proto__ && obj.__proto__.constructor) {
                return obj.__proto__.constructor.name;
            }
            else if (Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor) {
                return Object.getPrototypeOf(obj).constructor.name;
            }
            else {
                throw "不支持__proto__.constructor 或者没有 prototype";
            }
        };
        ObjectUtil.getClass = function (obj) {
            if (obj.__proto__ && obj.__proto__.constructor) {
                return obj.__proto__.constructor;
            }
            else if (Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor) {
                return Object.getPrototypeOf(obj).constructor;
            }
            else {
                throw "不支持__proto__.constructor 或者没有 prototype";
            }
        };
        return ObjectUtil;
    }());
    NG.ObjectUtil = ObjectUtil;
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.getLimitRandom = function (min, max, type) {
            if (type === void 0) { type = 0; }
            switch (type) {
                case 1:
                    return Math.floor(Math.random() * (max - min)) + min;
                    ;
                case 2:
                    return Math.ceil(Math.random() * (max - min)) + min;
                    ;
                case 0:
                default:
                    return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        };
        MathUtil.map = function (value, start, end, targetStart, targetEnd) {
            return ((end - start) / (value - start)) * (targetEnd - targetStart) + targetStart;
        };
        MathUtil.lerp = function (start, end, amt) {
            return start + (end - start) * amt;
        };
        return MathUtil;
    }());
    NG.MathUtil = MathUtil;
    var StringUtil = (function () {
        function StringUtil() {
        }
        StringUtil.multiSplit = function (str, separators, Split) {
            if (Split === void 0) { Split = false; }
            function split2(strs, separators, separatorIndex) {
                var separator = separators[separatorIndex];
                if (separator && strs) {
                    for (var i in strs) {
                        var stra = strs[i];
                        if (stra == "") {
                            delete strs[i];
                            strs.length = strs.length - 1;
                            continue;
                        }
                        if (stra == separator) {
                            strs[i] = [];
                        }
                        if (stra.indexOf(separator) >= 0) {
                            strs[i] = split2(stra.split(separator), separators, separatorIndex + 1);
                        }
                        else {
                            if (Split) {
                                strs[i] = split2([stra], separators, separatorIndex + 1);
                            }
                        }
                    }
                }
                return strs;
            }
            if (str) {
                var r = split2([str], separators, 0)[0];
                if (r == str) {
                    return [r];
                }
                else {
                    return r;
                }
            }
            else {
                return [];
            }
        };
        StringUtil.format = function (str) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var index = str.indexOf("$");
            while (index != -1 && params.length > 0) {
                str = str.substring(0, index) + params.shift() + str.substring(index + 1);
                index = str.indexOf("$");
            }
            return str;
        };
        StringUtil.dateFormater = function (formater, t) {
            var date = t ? new Date(t) : new Date(), Y = date.getFullYear() + '', M = date.getMonth() + 1, D = date.getDate(), H = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
            return formater.replace(/YYYY|yyyy/g, Y)
                .replace(/YY|yy/g, Y.substr(2, 2))
                .replace(/MM/g, (M < 10 ? '0' : '') + M)
                .replace(/DD/g, (D < 10 ? '0' : '') + D)
                .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
                .replace(/mm/g, (m < 10 ? '0' : '') + m)
                .replace(/ss/g, (s < 10 ? '0' : '') + s);
        };
        StringUtil.dateStrForma = function (str, from, to) {
            str += '';
            var Y = '';
            if (~(Y = from.indexOf('YYYY'))) {
                Y = str.substr(Y, 4);
                to = to.replace(/YYYY|yyyy/g, Y);
            }
            else if (~(Y = from.indexOf('YY'))) {
                Y = str.substr(Y, 2);
                to = to.replace(/YY|yy/g, Y);
            }
            var k, i;
            ['M', 'D', 'H', 'h', 'm', 's'].forEach(function (s) {
                i = from.indexOf(s + s);
                k = ~i ? str.substr(i, 2) : '';
                to = to.replace(s + s, k);
            });
            return to;
        };
        return StringUtil;
    }());
    NG.StringUtil = StringUtil;
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.find = function (arr, param, value) {
            if (arr instanceof Array == false) {
                if (arr[param] == value) {
                    return arr;
                }
                else {
                    return null;
                }
            }
            var every;
            if (typeof param == "string") {
                every = function (item) { return item[param] == value; };
            }
            else {
                every = param;
            }
            for (var key in arr) {
                if (every.call(null, arr[key]) == true) {
                    return arr[key];
                }
            }
            return null;
        };
        ArrayUtil.findAll = function (arr, param, value) {
            var every;
            if (typeof param == "string") {
                every = function (item) { return item[param] == value; };
            }
            else {
                every = param;
            }
            var a = [];
            for (var key in arr) {
                if (every.call(null, arr[key]) == true) {
                    a.push(arr[key]);
                }
            }
            return a;
        };
        return ArrayUtil;
    }());
    NG.ArrayUtil = ArrayUtil;
    var RegExpUtil = (function () {
        function RegExpUtil() {
        }
        RegExpUtil.replace = function (regex, str, callback) {
            return str.replace(regex, callback);
        };
        RegExpUtil.matchAll = function (regex, str, callback) {
            var allResult = [];
            var result;
            regex.lastIndex = 0;
            while ((result = regex.exec(str)) != null) {
                if (callback) {
                    callback.call(null, result);
                }
                allResult.push(result);
            }
            return allResult;
        };
        return RegExpUtil;
    }());
    NG.RegExpUtil = RegExpUtil;
})(NG || (NG = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "优化下载方法bug", 4, function (lib, game, ui, get, ai, _status) {
            if (typeof window.require == 'function') {
                game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
                    if (url.indexOf('http') != 0) {
                        url = get.url(dev) + url;
                    }
                    var count_1 = 0;
                    var dir = folder.split('/');
                    game.ensureDirectory(folder, function () {
                        try {
                            var file = lib.node.fs.createWriteStream(__dirname + '/' + folder);
                        }
                        catch (e) {
                            if (onerror)
                                onerror();
                        }
                        lib.config.brokenFile.add(folder);
                        game.saveConfigValue('brokenFile');
                        if (!lib.node.http)
                            lib.node.http = require('http');
                        if (!lib.node.https)
                            lib.node.https = require('https');
                        var opts = require('url').parse(encodeURI(url));
                        opts.headers = { 'User-Agent': 'AppleWebkit' };
                        var isGetError = false;
                        var request = (url.indexOf('https') == 0 ? lib.node.https : lib.node.http).get(opts, function (response) {
                            var stream = response.pipe(file);
                            stream.on('finish', function () {
                                lib.config.brokenFile.remove(folder);
                                game.saveConfigValue('brokenFile');
                                if (onsuccess) {
                                    onsuccess();
                                }
                            });
                            stream.on('error', function (e) {
                                if (onerror)
                                    onerror();
                            });
                            if (onprogress) {
                                var streamInterval = setInterval(function () {
                                    if (stream.closed) {
                                        clearInterval(streamInterval);
                                    }
                                    else {
                                        onprogress(stream.bytesWritten);
                                    }
                                }, 200);
                            }
                        });
                        request.addListener('finish', function () {
                        });
                        request.addListener('error', function (e) {
                            isGetError = true;
                        });
                        request.addListener('close', function () {
                            if (isGetError) {
                                if (count_1 >= 7) {
                                    if (onerror)
                                        onerror();
                                }
                                else {
                                    ++count_1;
                                    game.download(url, folder, onsuccess, onerror, dev, onprogress);
                                }
                            }
                        });
                    }, true);
                };
            }
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "替换下载地址", 4, function (lib, game, ui, get, ai, _status) {
            lib.configMenu.general.config.update_link = {
                name: '更新地址',
                init: 'coding',
                unfrequent: true,
                item: {
                    coding: 'GitLab',
                    github: 'GitHub',
                    codingR: 'Coding'
                },
                onclick: function (item) {
                    game.saveConfig('update_link', item);
                    lib.updateURL = lib.updateURLS[item] || lib.updateURLS.coding;
                },
            };
            lib.updateURLS = {
                coding: 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw',
                github: 'https://raw.githubusercontent.com/libccy/noname',
                codingR: 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw'
            };
            lib.updateURL = 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw';
            lib.mirrorURL = 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw';
            lib.hallURL = '192.168.1.192';
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "内部加载游戏配置", 4, function (lib, game, ui, get, ai, _status) {
            var data = "";
            if (lib.device) {
                data = "eyJjb25maWciOnsiYWRkaXRpb25hbF9wbGF5ZXJfbW9kZV9jb25maWdfY2hlc3MiOnRydWUsImFpX3N0cmF0ZWd5X21vZGVfY29uZmlnX2lkZW50aXR5IjoiYWlfc3RyYXRlZ3lfMSIsImFvemhhbl9iZ21fbW9kZV9jb25maWdfZ3VvemhhbiI6InJld3JpdGUiLCJhb3poYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiYXNzZXRfYXVkaW8iOnRydWUsImFzc2V0X2Z1bGwiOnRydWUsImFzc2V0X3NraW4iOnRydWUsImFzc2V0X3ZlcnNpb24iOiIxLjkuOTguMSIsImF1dG9fY2hlY2tfdXBkYXRlIjp0cnVlLCJhdXRvX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5Ijoib2ZmIiwiYXV0b19tYXJrX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJhdXRvX3BvcHBlZF9oaXN0b3J5IjpmYWxzZSwiYXV0b2JvcmRlcl9jb3VudCI6Im1peCIsImF1dG9ib3JkZXJfc3RhcnQiOiJicm9uemUiLCJhdXRvc2tpbGxsaXN0IjpbInhpbmZ1X3R1c2hlIl0sImJhaXlpZHVqaWFuZ19tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwiYmFuX2lkZW50aXR5Ml9tb2RlX2NvbmZpZ19pZGVudGl0eSI6Im9mZiIsImJhbl9pZGVudGl0eTNfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJvZmYiLCJiYW5faWRlbnRpdHlfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJvZmYiLCJiYXR0bGVfbnVtYmVyX21vZGVfY29uZmlnX2NoZXNzIjozLCJiYXR0bGVfbnVtYmVyX21vZGVfY29uZmlnX3N0b25lIjoiMSIsImJsdXJfdWkiOmZhbHNlLCJib3JkZXJfc3R5bGUiOiJkZWZhdWx0IiwiYm9zc19iYWltYW5nc2hpbGlhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiZGVuZ2FpIiwiamlhbmd3ZWkiLCJiaWFuZnVyZW4iLCJjYW9jYW8iLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImNhb3BpIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aW1hbyIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJndW9qaWEiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsInNpbWF5aSIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwieHVueXUiLCJ4dXpodSIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJ6aGFuZ2xpYW8iLCJ6aGVuamkiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJndWFueXUiLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd5dWV5aW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsImxpdWJlaSIsInNwX2xpdWJlaSIsIm1hY2hhbyIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsInJlX3l1YW5zaHUiLCJvbGRfeXVhbnNodSIsInJlX3l1YW5zaGFvIiwieWFud2VuIiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJwYW5nZGUiLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwibHZidSIsIm9sX2xpdXl1IiwibGlydSIsImxpcXVlZ3Vvc2kiLCJvbGRfbGluZ2p1Iiwia29uZ3JvbmciLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJ6aHVnZWxpYW5nIiwib2xkX3podWdlemhhbiIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJvbGRfemhhbmd4aW5nY2FpIiwiemhhbmdnb25nIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJvbGRfbWFqdW4iLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwibnNfY2FvY2FvIiwibnNfZ3Vhbmx1IiwibnNfc2ltYXpoYW8iLCJkaXlfd2VueWFuZyIsIm5zX3hpbnhpYW55aW5nIiwibnNfemhhbmd3ZWkiLCJuc19tYXN1IiwibnNfeWFuZ3lpIiwibnNfemh1Z2VsaWFuZyIsIm5zX2x2bWVuZyIsIm5zX3N1bmppYW4iLCJuc19jYW9jYW9zcCIsIm5zX2R1YW5ndWkiLCJuc19odWFtdWxhbiIsInNwX3podWdlbGlhbmciLCJvbF96aGFuZ2xpYW8iLCJyZV9ndWFucWl1amlhbiIsInJlX3Bhbmd0b25nIl0sImJvc3NfYmFubmVkY2FyZHMiOlsibXVuaXUiXSwiYm9zc19iaWZhbmdfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19jYWl3ZW5qaV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2Nhb2Nhb19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2NoaXlhbnNoaWxpYW5fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19kaWFvY2hhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2Rvbmd6aHVvX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfZW5hYmxlX3BsYXlwYWNrY29uZmlnIjpmYWxzZSwiYm9zc19lbmFibGVhaV9wbGF5cGFja2NvbmZpZyI6ZmFsc2UsImJvc3NfZ3VvamlhX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfaHVhbmd5dWV5aW5nX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfaHVhdHVvX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfaHVuZHVuX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfbGl1YmVpX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfbHZidTFfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19uaWFuc2hvdV9oZXRpX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfcGFuZ3RvbmdfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19xaW5nbXVzaGlsaWFuX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfcWluZ3Vhbmd3YW5nX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfcWlvbmdxaV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3N1bmNlX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfdGFvdGllX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfdGFvd3VfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc194aWFuZ2xpdV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3h1YW5saW5zaGlsaWFuX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfeWluZ3poYW9fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196aGFuZ2NodW5odWFfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196aGFuZ2ppYW9fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196aGFveXVuX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfemhlbmppX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfemhvdXl1X2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3Nfemh1Z2VsaWFuZ19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3podW9ndWlxdXhpZV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3podXlhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3p1b2NpX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJyb2tlbkZpbGUiOltdLCJidXR0b25jaGFyYWN0ZXJfc3R5bGUiOiJkZWZhdWx0IiwiY2FyZF9zdHlsZSI6InNpbXBsZSIsImNhcmRiYWNrX3N0eWxlIjoib2ZmaWNpYWwiLCJjYXJkcGlsZV9lbmFibGVfcGxheXBhY2tjb25maWciOmZhbHNlLCJjYXJkcGlsZV9ndW9oZV9wbGF5cGFja2NvbmZpZyI6IjAiLCJjYXJkcGlsZV9odW9zaGFfcGxheXBhY2tjb25maWciOiIxIiwiY2FyZHBpbGVfaml1X3BsYXlwYWNrY29uZmlnIjoiMCIsImNhcmRwaWxlX2xlaXNoYV9wbGF5cGFja2NvbmZpZyI6IjEiLCJjYXJkcGlsZV9uYW5tYW5fcGxheXBhY2tjb25maWciOiIwIiwiY2FyZHBpbGVfc2hhX3BsYXlwYWNrY29uZmlnIjoiMSIsImNhcmRwaWxlX3NoYW5fcGxheXBhY2tjb25maWciOiIxIiwiY2FyZHBpbGVfc2h1bnNob3VfcGxheXBhY2tjb25maWciOiIwIiwiY2FyZHBpbGVfdGFvX3BsYXlwYWNrY29uZmlnIjoiMCIsImNhcmRwaWxlX3RpZXN1b19wbGF5cGFja2NvbmZpZyI6IjAiLCJjYXJkcGlsZV93YW5qaWFuX3BsYXlwYWNrY29uZmlnIjoiMCIsImNhcmRwaWxlX3d1eGllX3BsYXlwYWNrY29uZmlnIjoiMC41IiwiY2FyZHBpbGVuYW1lX21vZGVfY29uZmlnX2lkZW50aXR5Ijoi5b2T5YmN54mM5aCGIiwiY2FyZHMiOlsic3RhbmRhcmQiLCJleCIsImV4dHJhIiwiY2xhc3NpYyIsImJhc2ljIiwiemh1bHUiXSwiY2FyZHNoYXBlIjoib2Jsb25nIiwiY2FyZHRlbXBuYW1lIjoiZGVmYXVsdCIsImNhcmR0ZXh0X2ZvbnQiOiJkZWZhdWx0IiwiY2hhbmdlVmljZVR5cGVfbW9kZV9jb25maWdfZ3VvemhhbiI6ImRlZmF1bHQiLCJjaGFuZ2VfY2FyZF9tb2RlX2NvbmZpZ19kb3VkaXpodSI6InVubGltaXRlZCIsImNoYW5nZV9jYXJkX21vZGVfY29uZmlnX2d1b3poYW4iOiJ1bmxpbWl0ZWQiLCJjaGFuZ2VfY2FyZF9tb2RlX2NvbmZpZ19pZGVudGl0eSI6InVubGltaXRlZCIsImNoYW5nZV9jaG9pY2VfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX3N0b25lIjp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwiY2hhbmdlX2lkZW50aXR5X21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjaGFuZ2VfaWRlbnRpdHlfbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY2hhbmdlX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjaGFuZ2VfaWRlbnRpdHlfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJjaGFuZ2Vfc2tpbiI6dHJ1ZSwiY2hhbmdlX3NraW5fYXV0byI6IjMwMDAwIiwiY2hhcmFjdGVyX2RpYWxvZ190b29sIjoi5pyA6L+RIiwiY2hhcmFjdGVycyI6WyJzdGFuZGFyZCIsInNoZW5odWEiLCJzcCIsInlpamlhbmciLCJyZWZyZXNoIiwieGluZ2h1b2xpYW95dWFuIiwibW9iaWxlIiwiZXh0cmEiLCJvbGQiXSwiY2hlY2tfdmVyc2lvbiI6IjEuOS45OC43LjEiLCJjaGVzc19jYXJkX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJjaGVzc19jaGFyYWN0ZXJfbW9kZV9jb25maWdfY2hlc3MiOnRydWUsImNoZXNzX2xlYWRlcl9zYXZlX21vZGVfY29uZmlnX2NoZXNzIjoic2F2ZTEiLCJjaGVzc19tb2RlX21vZGVfY29uZmlnX2NoZXNzIjoiY29tYmF0IiwiY2hlc3Nfb2JzdGFjbGVfbW9kZV9jb25maWdfY2hlc3MiOiIwLjIiLCJjaGVzc3Njcm9sbF9zcGVlZF9tb2RlX2NvbmZpZ19jaGVzcyI6IjIwIiwiY2hlc3NzY3JvbGxfc3BlZWRfbW9kZV9jb25maWdfdGFmYW5nIjoiMjAiLCJjaG9pY2VfZmFuX21vZGVfY29uZmlnX2RvdWRpemh1IjoiMyIsImNob2ljZV9mYW5fbW9kZV9jb25maWdfaWRlbnRpdHkiOiI2IiwiY2hvaWNlX25laV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6IjEwIiwiY2hvaWNlX251bV9tb2RlX2NvbmZpZ19ndW96aGFuIjoiNyIsImNob2ljZV9udW1iZXJfbW9kZV9jb25maWdfY2hlc3MiOjYsImNob2ljZV96aG9uZ19tb2RlX2NvbmZpZ19pZGVudGl0eSI6IjgiLCJjaG9pY2Vfemh1X21vZGVfY29uZmlnX2RvdWRpemh1IjoiNSIsImNob2ljZV96aHVfbW9kZV9jb25maWdfaWRlbnRpdHkiOiI2IiwiY2hvb3NlX2dyb3VwX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjbGVhcl9sb2ciOmZhbHNlLCJjb2luX2NhbnZhc19wbGF5cGFja2NvbmZpZyI6ZmFsc2UsImNvaW5fZGlzcGxheV9wbGF5cGFja2NvbmZpZyI6InRleHQiLCJjb2luX2VuYWJsZV9wbGF5cGFja2NvbmZpZyI6ZmFsc2UsImNvbXBhdGlibGVtb2RlIjpmYWxzZSwiY29uZmlybV9leGl0Ijp0cnVlLCJjb25uZWN0X2Fvemhhbl9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X2F2YXRhciI6ImJhb3Nhbm5pYW5nIiwiY29ubmVjdF9hdmF0YXJfbW9kZV9jb25maWdfY29ubmVjdCI6ImJhb3Nhbm5pYW5nIiwiY29ubmVjdF9jYXJkcyI6WyJzcCIsImd1b3poYW4iLCJodWFubGVrYXBhaSJdLCJjb25uZWN0X2NoYW5nZV9jYXJkX21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjb25uZWN0X2NoYW5nZV9jYXJkX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImNvbm5lY3RfY2hhbmdlX2NhcmRfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNvbm5lY3RfY2hhcmFjdGVycyI6WyJkaXkiLCJ0dyJdLCJjb25uZWN0X2Nob2ljZV9udW1fbW9kZV9jb25maWdfdmVyc3VzIjoiMjAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX2RvdWRpemh1IjoiMzAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX2d1b3poYW4iOiIzMCIsImNvbm5lY3RfY2hvb3NlX3RpbWVvdXRfbW9kZV9jb25maWdfaWRlbnRpdHkiOiIzMCIsImNvbm5lY3RfY2hvb3NlX3RpbWVvdXRfbW9kZV9jb25maWdfc2luZ2xlIjoiMzAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX3ZlcnN1cyI6IjMwIiwiY29ubmVjdF9kb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2RvdWRpemh1IjpmYWxzZSwiY29ubmVjdF9kb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9kb3VibGVfbmVpX21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9kb3VkaXpodV9iYW5uZWQiOlsiY2FvY2FvIiwiZ3VvamlhIiwic2ltYXlpIiwiemhhbmdsaWFvIiwieHV6aHUiLCJ4aWFob3VkdW4iLCJ6aGVuamkiLCJndWFueXUiLCJodWFuZ3l1ZXlpbmciLCJsaXViZWkiLCJtYWNoYW8iLCJ6aGFuZ2ZlaSIsImRhcWlhbyIsInpodWdlbGlhbmciLCJ6aGFveXVuIiwiZ2FubmluZyIsImx1eHVuIiwiaHVhbmdnYWkiLCJsdm1lbmciLCJzdW5xdWFuIiwic3Vuc2hhbmd4aWFuZyIsInpob3V5dSIsImRpYW9jaGFuIiwiaHVhdHVvIiwibHZidSIsImh1YXhpb25nIiwicmVfeXVhbnNodSIsImdvbmdzdW56YW4iLCJyZV95dWppIiwic3BfemhhbmdqaWFvIiwieHVueXUiLCJwYW5ndG9uZyIsInNwX3podWdlbGlhbmciLCJ5YW53ZW4iLCJyZV95dWFuc2hhbyIsImNhb3BpIiwibWVuZ2h1byIsInN1bmppYW4iLCJ6aHVyb25nIiwiZG9uZ3podW8iLCJjYWl3ZW5qaSIsImppYW5nd2VpIiwiZGVuZ2FpIiwicmVfeXVqaW4iLCJvbGRfaHVheGlvbmciLCJoYW5iYSIsIm5pdWppbiIsImhhbnN1aSIsImhlamluIiwiYmlhbmZ1cmVuIiwiY3VpbWFvIiwiemFuZ2JhIiwiY2hlbmRvbmciLCJtaWZ1cmVuIiwic3BfZG9uZ3podW8iLCJsdmZhbiIsImppYW5nZmVpIiwiamlhbmdxaW5nIiwiamlsaW5nIiwia29uZ3JvbmciLCJsaXF1ZWd1b3NpIiwiemhhbmdyZW4iLCJ6b3VzaGkiLCJtYXRlbmciLCJ0aWFuZmVuZyIsImdhbmZ1cmVuIiwianNwX3poYW95dW4iLCJzcF9nYW5uaW5nIiwiaHVhbmdqaW5sZWlzaGkiLCJzcF9wYW5ndG9uZyIsInNwX2x2bWVuZyIsInNwX3poYW5nZmVpIiwic3BfZGFxaWFvIiwic3BfeGlhaG91c2hpIiwic3BfbGl1YmVpIiwic3BfeGlhaG91ZHVuIiwiY3VpeWFuIiwid2FuZ3l1biIsIm9sZF95dWFuc2h1Iiwib2xkX2J1bGlhbnNoaSIsImppa2FuZyIsIm9sZF9jYW9yZW4iLCJ4aWFob3V5dWFuIiwiaHVhbmd6aG9uZyIsIndlaXlhbiIsInhpYW9xaWFvIiwib2xkX3pob3V0YWkiLCJwYW5nZGUiLCJ4dWh1YW5nIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInpoYW5nZ29uZyIsInJlX3dlaXdlbnpodWdlemhpIiwicmVfeHVnb25nIiwicmVfZGlhbndlaSIsInJlX3N1bmNlIiwib2xkX3l1YW5zaGFvIiwib2xfbGl1c2hhbiIsInhpbl95dWFuc2hhbyIsInJlX2dhb3NodW4iLCJ3dWd1b3RhaSIsInh1c2hlbmciLCJ4aW5feGlhaG91ZHVuIiwic3Bfc2ltYXpoYW8iLCJzcF93YW5neXVhbmppIiwic3BfeGlueGlhbnlpbmciLCJzcF9saXV4aWUiLCJzcF9nb25nc3VuemFuIiwicmVfeGlhaG91eXVhbiIsImJhb3Nhbm5pYW5nIiwicmVfc3Bfemh1Z2VsaWFuZyIsInlsX3l1YW5zaHUiLCJ6aGFuZ3lpIiwiaGVxaSIsIm9sX3poYW5nbGlhbyIsInJlX3Bhbmd0b25nIiwicmVfZ3VhbnFpdWppYW4iXSwiY29ubmVjdF9kb3VkaXpodV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJjb25uZWN0X2VuaGFuY2Vfemh1X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9ndW96aGFuX2Jhbm5lZCI6WyJjYW9jYW8iLCJndW9qaWEiLCJzaW1heWkiLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsInhpYWhvdWR1biIsInpoZW5qaSIsImd1YW55dSIsImh1YW5neXVleWluZyIsImxpdWJlaSIsIm1hY2hhbyIsInpoYW5nZmVpIiwiZGFxaWFvIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJnYW5uaW5nIiwibHV4dW4iLCJodWFuZ2dhaSIsImx2bWVuZyIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwiemhvdXl1IiwiZGlhb2NoYW4iLCJodWF0dW8iLCJsdmJ1IiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwiZ29uZ3N1bnphbiIsInJlX3l1amkiLCJzcF96aGFuZ2ppYW8iLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJtZW5naHVvIiwic3VuamlhbiIsInpodXJvbmciLCJkb25nemh1byIsImNhaXdlbmppIiwiamlhbmd3ZWkiLCJkZW5nYWkiLCJyZV95dWppbiIsIm9sZF9odWF4aW9uZyIsImhhbmJhIiwibml1amluIiwiaGFuc3VpIiwiaGVqaW4iLCJiaWFuZnVyZW4iLCJjdWltYW8iLCJ6YW5nYmEiLCJjaGVuZG9uZyIsIm1pZnVyZW4iLCJzcF9kb25nemh1byIsImx2ZmFuIiwiamlhbmdmZWkiLCJqaWFuZ3FpbmciLCJqaWxpbmciLCJrb25ncm9uZyIsImxpcXVlZ3Vvc2kiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsIm1hdGVuZyIsInRpYW5mZW5nIiwiZ2FuZnVyZW4iLCJqc3Bfemhhb3l1biIsInNwX2dhbm5pbmciLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfbHZtZW5nIiwic3BfemhhbmdmZWkiLCJzcF9kYXFpYW8iLCJzcF94aWFob3VzaGkiLCJzcF9saXViZWkiLCJzcF94aWFob3VkdW4iLCJjdWl5YW4iLCJ3YW5neXVuIiwib2xkX3l1YW5zaHUiLCJvbGRfYnVsaWFuc2hpIiwiamlrYW5nIiwib2xkX2Nhb3JlbiIsInhpYWhvdXl1YW4iLCJodWFuZ3pob25nIiwid2VpeWFuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsInBhbmdkZSIsInh1aHVhbmciLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwiemhhbmdnb25nIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbGRfeXVhbnNoYW8iLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJjb25uZWN0X2d1b3poYW5fYmFubmVkY2FyZHMiOlsiZGluZ2xhbnllbWluZ3podSIsInRhaXBpbmd5YW9zaHUiLCJsaXVsb25nY2FuamlhIiwiZmVpbG9uZ2R1b2ZlbmciXSwiY29ubmVjdF9ndW96aGFucGlsZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X2lkZW50aXR5X2Jhbm5lZCI6WyJjYW9jYW8iLCJzaW1heWkiLCJ4aWFob3VkdW4iLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsImd1b2ppYSIsInpoZW5qaSIsImxpdWJlaSIsImd1YW55dSIsInpoYW5nZmVpIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJtYWNoYW8iLCJodWFuZ3l1ZXlpbmciLCJzdW5xdWFuIiwiZ2FubmluZyIsImx2bWVuZyIsImh1YW5nZ2FpIiwiemhvdXl1IiwiZGFxaWFvIiwibHV4dW4iLCJzdW5zaGFuZ3hpYW5nIiwiaHVhdHVvIiwibHZidSIsImRpYW9jaGFuIiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwieHVueXUiLCJwYW5ndG9uZyIsInNwX3podWdlbGlhbmciLCJ5YW53ZW4iLCJyZV95dWFuc2hhbyIsImNhb3BpIiwibWVuZ2h1byIsInpodXJvbmciLCJzdW5qaWFuIiwiZG9uZ3podW8iLCJkZW5nYWkiLCJjYWl3ZW5qaSIsImppYW5nd2VpIiwicmVfeXVqaW4iLCJvbGRfaHVheGlvbmciLCJoYW5iYSIsImhlamluIiwiaGFuc3VpIiwibml1amluIiwibWlmdXJlbiIsIm1hdGVuZyIsInRpYW5mZW5nIiwiY2hlbmRvbmciLCJzcF9kb25nemh1byIsImppYW5nZmVpIiwiamlhbmdxaW5nIiwia29uZ3JvbmciLCJiaWFuZnVyZW4iLCJsaXF1ZWd1b3NpIiwibHZmYW4iLCJjdWltYW8iLCJqaWxpbmciLCJ6YW5nYmEiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsImdhbmZ1cmVuIiwic3BfeGlhaG91c2hpIiwianNwX3poYW95dW4iLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfZGFxaWFvIiwic3BfZ2FubmluZyIsInNwX3hpYWhvdWR1biIsInNwX2x2bWVuZyIsInNwX3poYW5nZmVpIiwic3BfbGl1YmVpIiwiY3VpeWFuIiwid2FuZ3l1biIsIm9sZF95dWFuc2h1Iiwib2xkX2J1bGlhbnNoaSIsImdvbmdzdW56YW4iLCJyZV95dWppIiwic3BfemhhbmdqaWFvIiwiamlrYW5nIiwiZGl5X3dlbnlhbmciLCJuc196dW9jaSIsIm5zX2x2emhpIiwibnNfd2FuZ3l1biIsIm5zX25hbmh1YSIsIm5zX25hbmh1YV9sZWZ0IiwibnNfbmFuaHVhX3JpZ2h0IiwibnNfaHVhbXVsYW4iLCJuc19odWFuZ3p1IiwibnNfamlua2UiLCJuc195YW5saWFuZyIsIm5zX3dlbmNob3UiLCJuc19jYW9jYW8iLCJuc19jYW9jYW9zcCIsIm5zX3podWdlbGlhbmciLCJuc193YW5neXVlIiwibnNfeXVqaSIsIm5zX3hpbnhpYW55aW5nIiwibnNfZ3Vhbmx1IiwibnNfc2ltYXpoYW8iLCJuc19zdW5qaWFuIiwibnNfZHVhbmd1aSIsIm5zX3poYW5nYmFvIiwibnNfbWFzdSIsIm5zX3poYW5neGl1IiwibnNfbHZtZW5nIiwibnNfc2hlbnBlaSIsIm5zX3l1amlzcCIsIm5zX3lhbmd5aSIsIm5zX2xpdXpoYW5nIiwibnNfeGlubmFuaHVhIiwiZGl5X2ZlaXNoaSIsImRpeV9saXV5YW4iLCJkaXlfeXVqaSIsImRpeV9jYWl3ZW5qaSIsImRpeV9sdWthbmciLCJkaXlfemhlbmppIiwiZGl5X2xpdWZ1IiwiZGl5X3hpemhlbnhpaG9uZyIsImRpeV9saXV6YW4iLCJkaXlfemFvemhpcmVuanVuIiwiZGl5X3lhbmd5aSIsImRpeV90aWFueXUiLCJrZXlfbHVjaWEiLCJrZXlfa3lvdXN1a2UiLCJrZXlfeXVyaSIsImtleV9oYXJ1a28iLCJrZXlfa2FnYXJpIiwib2xkX2Nhb3JlbiIsInhpYWhvdXl1YW4iLCJodWFuZ3pob25nIiwid2VpeWFuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsInBhbmdkZSIsInh1aHVhbmciLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwiemhhbmdnb25nIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbGRfeXVhbnNoYW8iLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJjb25uZWN0X2lkZW50aXR5X21vZGVfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJub3JtYWwiLCJjb25uZWN0X2luaXRzaG93X2RyYXdfbW9kZV9jb25maWdfZ3VvemhhbiI6Im1hcmsiLCJjb25uZWN0X2p1bnpodV9tb2RlX2NvbmZpZ19ndW96aGFuIjpmYWxzZSwiY29ubmVjdF9tb2RlIjoiaWRlbnRpdHkiLCJjb25uZWN0X25pY2tuYW1lIjoi5peg5ZCN546p5a62IiwiY29ubmVjdF9uaWNrbmFtZV9tb2RlX2NvbmZpZ19jb25uZWN0Ijoi5peg5ZCN546p5a62IiwiY29ubmVjdF9vYnNlcnZlX2hhbmRjYXJkX21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29ubmVjdF9vYnNlcnZlX2hhbmRjYXJkX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfc2luZ2xlIjp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJjb25uZWN0X29ic2VydmVfbW9kZV9jb25maWdfZG91ZGl6aHUiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X29ic2VydmVfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ19zaW5nbGUiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImNvbm5lY3Rfb25seWd1b3poYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29ubmVjdF9wbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2d1b3poYW4iOiI4IiwiY29ubmVjdF9wbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2lkZW50aXR5IjoiOCIsImNvbm5lY3RfcmVwbGFjZV9oYW5kY2FyZF9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImNvbm5lY3RfcmVwbGFjZV9udW1iZXJfbW9kZV9jb25maWdfdmVyc3VzIjoiMiIsImNvbm5lY3Rfc2luZ2xlX2Jhbm5lZCI6WyJjYW9jYW8iLCJndW9qaWEiLCJzaW1heWkiLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsInhpYWhvdWR1biIsInpoZW5qaSIsImd1YW55dSIsImh1YW5neXVleWluZyIsImxpdWJlaSIsIm1hY2hhbyIsInpoYW5nZmVpIiwiZGFxaWFvIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJnYW5uaW5nIiwibHV4dW4iLCJodWFuZ2dhaSIsImx2bWVuZyIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwiemhvdXl1IiwiZGlhb2NoYW4iLCJodWF0dW8iLCJsdmJ1IiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwiZ29uZ3N1bnphbiIsInJlX3l1amkiLCJzcF96aGFuZ2ppYW8iLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJtZW5naHVvIiwic3VuamlhbiIsInpodXJvbmciLCJkb25nemh1byIsImNhaXdlbmppIiwiamlhbmd3ZWkiLCJkZW5nYWkiLCJyZV95dWppbiIsIm9sZF9odWF4aW9uZyIsImhhbmJhIiwibml1amluIiwiaGFuc3VpIiwiaGVqaW4iLCJiaWFuZnVyZW4iLCJjdWltYW8iLCJ6YW5nYmEiLCJjaGVuZG9uZyIsIm1pZnVyZW4iLCJzcF9kb25nemh1byIsImx2ZmFuIiwiamlhbmdmZWkiLCJqaWFuZ3FpbmciLCJqaWxpbmciLCJrb25ncm9uZyIsImxpcXVlZ3Vvc2kiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsIm1hdGVuZyIsInRpYW5mZW5nIiwiZ2FuZnVyZW4iLCJqc3Bfemhhb3l1biIsInNwX2dhbm5pbmciLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfbHZtZW5nIiwic3BfemhhbmdmZWkiLCJzcF9kYXFpYW8iLCJzcF94aWFob3VzaGkiLCJzcF9saXViZWkiLCJzcF94aWFob3VkdW4iLCJjdWl5YW4iLCJ3YW5neXVuIiwib2xkX3l1YW5zaHUiLCJvbGRfYnVsaWFuc2hpIiwiamlrYW5nIiwib2xkX2Nhb3JlbiIsInhpYWhvdXl1YW4iLCJodWFuZ3pob25nIiwid2VpeWFuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsInBhbmdkZSIsInh1aHVhbmciLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwiemhhbmdnb25nIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbGRfeXVhbnNoYW8iLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJjb25uZWN0X3NpbmdsZV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJjb25uZWN0X3NpbmdsZV9tb2RlX21vZGVfY29uZmlnX3NpbmdsZSI6ImNoYW5nYmFuIiwiY29ubmVjdF9zcGVjaWFsX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF92ZXJzdXNfYmFubmVkIjpbImNhb2NhbyIsImd1b2ppYSIsInNpbWF5aSIsInpoYW5nbGlhbyIsInh1emh1IiwieGlhaG91ZHVuIiwiemhlbmppIiwiZ3Vhbnl1IiwiaHVhbmd5dWV5aW5nIiwibGl1YmVpIiwibWFjaGFvIiwiemhhbmdmZWkiLCJkYXFpYW8iLCJ6aHVnZWxpYW5nIiwiemhhb3l1biIsImdhbm5pbmciLCJsdXh1biIsImh1YW5nZ2FpIiwibHZtZW5nIiwic3VucXVhbiIsInN1bnNoYW5neGlhbmciLCJ6aG91eXUiLCJkaWFvY2hhbiIsImh1YXR1byIsImx2YnUiLCJodWF4aW9uZyIsInJlX3l1YW5zaHUiLCJnb25nc3VuemFuIiwicmVfeXVqaSIsInNwX3poYW5namlhbyIsInh1bnl1IiwicGFuZ3RvbmciLCJzcF96aHVnZWxpYW5nIiwieWFud2VuIiwicmVfeXVhbnNoYW8iLCJjYW9waSIsIm1lbmdodW8iLCJzdW5qaWFuIiwiemh1cm9uZyIsImRvbmd6aHVvIiwiY2Fpd2VuamkiLCJqaWFuZ3dlaSIsImRlbmdhaSIsInJlX3l1amluIiwib2xkX2h1YXhpb25nIiwiaGFuYmEiLCJuaXVqaW4iLCJoYW5zdWkiLCJoZWppbiIsImJpYW5mdXJlbiIsImN1aW1hbyIsInphbmdiYSIsImNoZW5kb25nIiwibWlmdXJlbiIsInNwX2Rvbmd6aHVvIiwibHZmYW4iLCJqaWFuZ2ZlaSIsImppYW5ncWluZyIsImppbGluZyIsImtvbmdyb25nIiwibGlxdWVndW9zaSIsInpoYW5ncmVuIiwiem91c2hpIiwibWF0ZW5nIiwidGlhbmZlbmciLCJnYW5mdXJlbiIsImpzcF96aGFveXVuIiwic3BfZ2FubmluZyIsImh1YW5namlubGVpc2hpIiwic3BfcGFuZ3RvbmciLCJzcF9sdm1lbmciLCJzcF96aGFuZ2ZlaSIsInNwX2RhcWlhbyIsInNwX3hpYWhvdXNoaSIsInNwX2xpdWJlaSIsInNwX3hpYWhvdWR1biIsImN1aXlhbiIsIndhbmd5dW4iLCJvbGRfeXVhbnNodSIsIm9sZF9idWxpYW5zaGkiLCJqaWthbmciLCJvbGRfY2FvcmVuIiwieGlhaG91eXVhbiIsImh1YW5nemhvbmciLCJ3ZWl5YW4iLCJ4aWFvcWlhbyIsIm9sZF96aG91dGFpIiwicGFuZ2RlIiwieHVodWFuZyIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJ6aGFuZ2dvbmciLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sZF95dWFuc2hhbyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfbGl1eGllIiwic3BfZ29uZ3N1bnphbiIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsInJlX3NwX3podWdlbGlhbmciLCJ5bF95dWFuc2h1Iiwiemhhbmd5aSIsImhlcWkiLCJvbF96aGFuZ2xpYW8iLCJyZV9wYW5ndG9uZyIsInJlX2d1YW5xaXVqaWFuIl0sImNvbm5lY3RfdmVyc3VzX2Jhbm5lZGNhcmRzIjpbIm11bml1Il0sImNvbm5lY3RfdmVyc3VzX21vZGVfbW9kZV9jb25maWdfdmVyc3VzIjoiMnYyIiwiY29ubmVjdF92aWV3bmV4dF9tb2RlX2NvbmZpZ19ndW96aGFuIjpmYWxzZSwiY29ubmVjdF96aG9uZ19jYXJkX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb25uZWN0X3podWxpYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29udGludWVfZ2FtZV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiY29udGludWVfZ2FtZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb250aW51ZV9nYW1lX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb250cm9sX3N0eWxlIjoic2ltcGxlIiwiY3Vyc29yX3N0eWxlIjoiYXV0byIsImN1c3RvbV9idXR0b24iOmZhbHNlLCJjdXN0b21fYnV0dG9uX2NvbnRyb2xfYm90dG9tIjoiMHgiLCJjdXN0b21fYnV0dG9uX2NvbnRyb2xfdG9wIjoiMHgiLCJjdXN0b21fYnV0dG9uX3N5c3RlbV9ib3R0b20iOiIweCIsImN1c3RvbV9idXR0b25fc3lzdGVtX3RvcCI6IjB4IiwiY3VzdG9tY2FyZHBpbGUiOnsi5b2T5YmN54mM5aCGIjpbeyJzdGFuZGFyZCI6W10sImV4dHJhIjpbXSwic3AiOls4LDksMTAsMTEsMTIsMTMsMTRdfSx7InN0YW5kYXJkIjpbXSwiZXh0cmEiOltdLCJzcCI6W119XX0sImRhb3poaXl1ZXlpbmdfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImRldiI6dHJ1ZSwiZGlhbG9nX3RyYW5zZm9ybSI6WzAsMF0sImRpZV9tb3ZlIjoibW92ZSIsImRpZXJlc3RhcnRfbW9kZV9jb25maWdfZG91ZGl6aHUiOnRydWUsImRpZmZpY3VsdHlfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJub3JtYWwiLCJkb3VibGVfY2hhcmFjdGVyX2ppYW5nZV9tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJkb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2RvdWRpemh1IjpmYWxzZSwiZG91YmxlX2NoYXJhY3Rlcl9tb2RlX2NvbmZpZ19pZGVudGl0eSI6ZmFsc2UsImRvdWJsZV9jaGFyYWN0ZXJfbW9kZV9jb25maWdfc3RvbmUiOmZhbHNlLCJkb3VibGVfaHBfbW9kZV9jb25maWdfZG91ZGl6aHUiOiJwaW5nanVuIiwiZG91YmxlX2hwX21vZGVfY29uZmlnX2d1b3poYW4iOiJwaW5nanVuIiwiZG91YmxlX2hwX21vZGVfY29uZmlnX2lkZW50aXR5IjoicGluZ2p1biIsImRvdWJsZV9uZWlfbW9kZV9jb25maWdfaWRlbnRpdHkiOmZhbHNlLCJkb3VkaXpodV9iYW5uZWQiOlsiZ29uZ3N1bnphbiIsImNhb2NhbyIsInNpbWF5aSIsInhpYWhvdWR1biIsInpoYW5nbGlhbyIsInh1emh1IiwiZ3VvamlhIiwiemhlbmppIiwibGl1YmVpIiwiZ3Vhbnl1IiwiemhhbmdmZWkiLCJ6aHVnZWxpYW5nIiwiemhhb3l1biIsIm1hY2hhbyIsImh1YW5neXVleWluZyIsInN1bnF1YW4iLCJnYW5uaW5nIiwibHZtZW5nIiwiaHVhbmdnYWkiLCJ6aG91eXUiLCJkYXFpYW8iLCJsdXh1biIsInN1bnNoYW5neGlhbmciLCJodWF0dW8iLCJsdmJ1IiwiZGlhb2NoYW4iLCJodWF4aW9uZyIsInJlX3l1YW5zaHUiLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJ6aHVyb25nIiwic3VuamlhbiIsImRvbmd6aHVvIiwiZGVuZ2FpIiwiamlhbmd3ZWkiLCJiaWFuZnVyZW4iLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImpzcF9jYW9yZW4iLCJvbGRfY2FvcmVuIiwib2xkX2Nhb3hpdSIsIm9sZF9jYW96aGVuIiwib2xkX2NoZW5xdW4iLCJjdWltYW8iLCJjdWl5YW4iLCJvbF9ndW9odWFpIiwib2xfbWFuY2hvbmciLCJuaXVqaW4iLCJvbGRfd2FuZ3lpIiwic3BfeGlhaG91ZHVuIiwieGlhaG91eXVhbiIsIm9sX3hpbnhpYW55aW5nIiwieHVodWFuZyIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsInNwX2xpdWJlaSIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsIm9sZF95dWFuc2h1Iiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJwYW5nZGUiLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwib2xfbGl1eXUiLCJsaXJ1IiwibGlxdWVndW9zaSIsIm9sZF9saW5nanUiLCJrb25ncm9uZyIsIm1pZnVyZW4iLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsIm9sZF9idWxpYW5zaGkiLCJjaGVuZG9uZyIsInNwX2RhcWlhbyIsImppYW5ncWluZyIsIm9sZF9saW5ndG9uZyIsImx2ZmFuIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwic3BfZG9uZ3podW8iLCJvbGRfZnVodWFuZ2hvdSIsInNwX2dhbm5pbmciLCJoYW5iYSIsImhhbnN1aSIsImhlamluIiwiaHVhbmdqaW5sZWlzaGkiLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJvbGRfemh1Z2V6aGFuIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsIm9sZF96aGFuZ3hpbmdjYWkiLCJ6aGFuZ2dvbmciLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsIm9sZF9tYWp1biIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV96aGFuZ2ZlaSIsIm9sX21hbGlhbmciLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfZ29uZ3N1bnphbiIsInNwX2xpdXhpZSIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsIm9sX2d1YW5zdW8iLCJyZV9zcF96aHVnZWxpYW5nIiwiemhhbmd5aSIsImhlcWkiLCJuc19jYW9jYW8iLCJuc19ndWFubHUiLCJuc19zaW1hemhhbyIsImRpeV93ZW55YW5nIiwibnNfeGlueGlhbnlpbmciLCJuc196aGFuZ3dlaSIsIm5zX21hc3UiLCJuc195YW5neWkiLCJuc196aHVnZWxpYW5nIiwibnNfbHZtZW5nIiwibnNfc3VuamlhbiIsIm5zX2Nhb2Nhb3NwIiwibnNfZHVhbmd1aSIsIm5zX2h1YW11bGFuIiwib2xfemhhbmdsaWFvIiwicmVfZ3VhbnFpdWppYW4iLCJyZV9wYW5ndG9uZyJdLCJkb3VkaXpodV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJkdXpoYW5zYW5ndW9fbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImVuYWJsZV9hbGxfY2FyZHNfZm91cl9tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJlbmFibGVfYWxsX2NhcmRzX21vZGVfY29uZmlnX3ZlcnN1cyI6ZmFsc2UsImVuYWJsZV9hbGxfbW9kZV9jb25maWdfdmVyc3VzIjpmYWxzZSwiZW5hYmxlX2FsbF90aHJlZV9tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJlbmFibGVfZHJhZ2xpbmUiOnRydWUsImVuYWJsZV90b3VjaGRyYWdsaW5lIjp0cnVlLCJlbmFibGVfdmlicmF0ZSI6ZmFsc2UsImVuaGFuY2Vfemh1X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiZXF1aXBfYXVkaW8iOmZhbHNlLCJlcnJzdG9wIjpmYWxzZSwiZXhwYW5kX2RpYWxvZ19tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfYm9yZGVyTGV2ZWwiOiJmaXZlIiwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2NhbXBJZGVudGl0eUltYWdlTW9kZSI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2NhcmRSZXBsYWNlIjp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfY2FyZFNlY29uZGFyeU5hbWVWaXNpYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2NhcmRVc2VFZmZlY3QiOnRydWUsImV4dGVuc2lvbl/ljYHlkajlubRVSV9lbmFibGUiOnRydWUsImV4dGVuc2lvbl/ljYHlkajlubRVSV9lcnVkYSI6ZmFsc2UsImV4dGVuc2lvbl/ljYHlkajlubRVSV9nYWluU2tpbGxzVmlzaWJsZSI6Im9uIiwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2dhbWVTdGFydEVmZmVjdCI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX291dGNyb3BTa2luIjpmYWxzZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX3BsYXllckRpZUVmZmVjdCI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX3BsYXllcktpbGxFZmZlY3QiOnRydWUsImV4dGVuc2lvbl/ljYHlkajlubRVSV9wbGF5ZXJMaW5lRWZmZWN0Ijp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfc2tpbGxNYXJrQ29sb3IiOiJ5ZWxsb3ciLCJleHRlbnNpb25f5ZCI57q15oqX56emX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl9leHBhbmRfY2hhcmFjdGVyIjpmYWxzZSwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl9rYW5ncWluX2dyb3VwIjoid2VpIiwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl9rYW5ncWluX2xldmVsIjoiNSIsImV4dGVuc2lvbl/lkIjnurXmipfnp6Zfa2FuZ3Fpbl9wbGF5ZXIiOiJkYXFpbl9mZW1hbGUzIiwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl92ZXJzaW9uIjoiMS4xIiwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl92ZXJ0aWNhbF9pZCI6ZmFsc2UsImV4dGVuc2lvbl/lr7zlhaXliqnmiYtfZW5hYmxlIjp0cnVlLCJleHRlbnNpb25f5peg5ZCN5omp5bGVX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9ucyI6WyLlr7zlhaXliqnmiYsiLCLlkIjnurXmipfnp6YiLCLljYHlkajlubRVSSJdLCJmaWx0ZXJub2RlX2J1dHRvbiI6dHJ1ZSwiZmlyc3RfbGVzc19tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwiZm9sZF9jYXJkIjp0cnVlLCJmb2xkX21vZGUiOmZhbHNlLCJmb3JiaWRhaV91c2VyIjpbImdvbmdzdW56YW4iLCJzaGVuX2Nhb2NhbyIsInNoZW5fZ2FubmluZyIsInNoZW5fZ3Vhbnl1Iiwic2hlbl9saXViZWkiLCJzaGVuX2x1eHVuIiwic2hlbl9sdmJ1Iiwic2hlbl9sdm1lbmciLCJzaGVuX3NpbWF5aSIsInNoZW5femhhbmdsaWFvIiwic2hlbl96aGFveXVuIiwic2hlbl96aG91eXUiLCJzaGVuX3podWdlbGlhbmciLCJqaWFuZ3dlaSIsImJpYW5mdXJlbiIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW9jaHVuIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwieHV6aHUiLCJyZV95dWppbiIsInhpbl95dWppbiIsInl1amluIiwiemFuZ2JhIiwiemhhbmdsaWFvIiwiemhlbmppIiwib2xkX3pob25naHVpIiwiZmF6aGVuZyIsImdhbmZ1cmVuIiwiZ3Vhbnl1Iiwib2xkX2d1YW56aGFuZyIsImh1YW5neXVleWluZyIsImh1YW5nemhvbmciLCJqaWFuZ2ZlaSIsIm9sX2xpYW9odWEiLCJsaXViZWkiLCJzcF9saXViZWkiLCJtYWNoYW8iLCJvbGRfbWFkYWkiLCJvbGRfbWFsaWFuZyIsIm1hc3UiLCJ6b3VzaGkiLCJqc3Bfemhhb3l1biIsInpoYW5ncmVuIiwib2xfemhhbmdyYW5nIiwiemhhbmdsaWFuZyIsInpoYW5namlhbyIsInl1amkiLCJyZV95dWFuc2h1Iiwib2xkX3l1YW5zaHUiLCJyZV95dWFuc2hhbyIsInlhbndlbiIsIndhbmd5dW4iLCJ0aWFuZmVuZyIsInNwX3Bhbmd0b25nIiwicGFuZ2RlIiwibWF0ZW5nIiwib2xkX21hY2hhbyIsImx2YnUiLCJvbF9saXV5dSIsImxpcnUiLCJsaXF1ZWd1b3NpIiwib2xkX2xpbmdqdSIsImNhb2NhbyIsImNhb3BpIiwiY3VpbWFvIiwiZGVuZ2FpIiwiZ3VvamlhIiwic2ltYXlpIiwieGlhaG91ZHVuIiwieHVueXUiLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJrb25ncm9uZyIsInpodWdlbGlhbmciLCJvbGRfemh1Z2V6aGFuIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsIm9sZF96aGFuZ3hpbmdjYWkiLCJ6aGFuZ2dvbmciLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsIm9sZF9tYWp1biIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsInhpbl95dWFuc2hhbyIsInJlX3poYW5nZmVpIiwib2xfbWFsaWFuZyIsInJlX2dhb3NodW4iLCJ3dWd1b3RhaSIsInh1c2hlbmciLCJ4aW5feGlhaG91ZHVuIiwic3Bfc2ltYXpoYW8iLCJzcF93YW5neXVhbmppIiwic3BfeGlueGlhbnlpbmciLCJzcF9nb25nc3VuemFuIiwic3BfbGl1eGllIiwicmVfeGlhaG91eXVhbiIsImJhb3Nhbm5pYW5nIiwib2xfZ3VhbnN1byIsInJlX3NwX3podWdlbGlhbmciLCJ6aGFuZ3lpIiwiaGVxaSIsIm5zX2Nhb2NhbyIsIm5zX2d1YW5sdSIsIm5zX3NpbWF6aGFvIiwiZGl5X3dlbnlhbmciLCJuc194aW54aWFueWluZyIsIm5zX3poYW5nd2VpIiwibnNfbWFzdSIsIm5zX3lhbmd5aSIsIm5zX3podWdlbGlhbmciLCJuc19sdm1lbmciLCJuc19zdW5qaWFuIiwibnNfY2FvY2Fvc3AiLCJuc19kdWFuZ3VpIiwic3Bfemh1Z2VsaWFuZyIsIm9sX3poYW5nbGlhbyIsInJlX2d1YW5xaXVqaWFuIiwicmVfcGFuZ3RvbmciXSwiZm91cl9hc3NpZ25fbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJmb3VyX3BoYXNlc3dhcF9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImZvdXJhbGlnbl9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImZyZWVfY2hvb3NlX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImZyZWVfY2hvb3NlX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiZnJlZV9jaG9vc2VfbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiZnJlZV9jaG9vc2VfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImZyZWVfY2hvb3NlX21vZGVfY29uZmlnX3N0b25lIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImdhbWVSZWNvcmQiOnsiaWRlbnRpdHkiOnsiZGF0YSI6eyJmYW4iOlsxLDBdfSwic3RyIjoi5Y+N6LS877yaMeiDnCAw6LSfPGJyPiJ9LCJndW96aGFuIjp7ImRhdGEiOnt9fSwidmVyc3VzIjp7ImRhdGEiOnt9fSwiY29ubmVjdCI6eyJkYXRhIjp7fX0sImJvc3MiOnsiZGF0YSI6e319LCJicmF3bCI6eyJkYXRhIjp7fX0sImRvdWRpemh1Ijp7ImRhdGEiOnt9fSwic2luZ2xlIjp7ImRhdGEiOnt9fX0sImdhbWVfc3BlZWQiOiJtaWQiLCJnbGFzc191aSI6ZmFsc2UsImdsb2JhbF9mb250IjoiZGVmYXVsdCIsImdsb3dfcGhhc2UiOiJwdXJwbGUiLCJndW96aGFuU2tpbl9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJndW96aGFuX2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiamlhbmd3ZWkiLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImpzcF9jYW9yZW4iLCJvbGRfY2FvcmVuIiwib2xkX2Nhb3hpdSIsIm9sZF9jYW96aGVuIiwib2xkX2NoZW5xdW4iLCJjdWl5YW4iLCJvbF9ndW9odWFpIiwib2xfbWFuY2hvbmciLCJuaXVqaW4iLCJvbGRfd2FuZ3lpIiwic3BfeGlhaG91ZHVuIiwieGlhaG91eXVhbiIsIm9sX3hpbnhpYW55aW5nIiwieHVodWFuZyIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJ6aGFuZ2xpYW8iLCJ6aGVuamkiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJndWFueXUiLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd5dWV5aW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsImxpdWJlaSIsInNwX2xpdWJlaSIsIm1hY2hhbyIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsInJlX3l1YW5zaHUiLCJvbGRfeXVhbnNodSIsInJlX3l1YW5zaGFvIiwieWFud2VuIiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJwYW5nZGUiLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwibHZidSIsIm9sX2xpdXl1IiwibGlydSIsImxpcXVlZ3Vvc2kiLCJvbGRfbGluZ2p1Iiwia29uZ3JvbmciLCJiaWFuZnVyZW4iLCJjYW9jYW8iLCJjYW9waSIsImN1aW1hbyIsImRlbmdhaSIsImd1b2ppYSIsInNpbWF5aSIsInhpYWhvdWR1biIsInh1bnl1IiwieHV6aHUiLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJ6aHVnZWxpYW5nIiwib2xkX3podWdlemhhbiIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJvbGRfemhhbmd4aW5nY2FpIiwiemhhbmdnb25nIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJvbGRfbWFqdW4iLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwibnNfY2FvY2FvIiwibnNfZ3Vhbmx1IiwibnNfc2ltYXpoYW8iLCJkaXlfd2VueWFuZyIsIm5zX3hpbnhpYW55aW5nIiwibnNfemhhbmd3ZWkiLCJuc19tYXN1IiwibnNfeWFuZ3lpIiwibnNfemh1Z2VsaWFuZyIsIm5zX2x2bWVuZyIsIm5zX3N1bmppYW4iLCJuc19jYW9jYW9zcCIsIm5zX2R1YW5ndWkiLCJuc19odWFtdWxhbiIsInNwX3podWdlbGlhbmciLCJvbF96aGFuZ2xpYW8iLCJyZV9ndWFucWl1amlhbiIsInJlX3Bhbmd0b25nIl0sImd1b3poYW5fYmFubmVkY2FyZHMiOltdLCJndW96aGFuX21vZGVfbW9kZV9jb25maWdfZ3VvemhhbiI6Im5vcm1hbCIsImd1b3poYW5waWxlX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImhhbGxfYnV0dG9uX21vZGVfY29uZmlnX2Nvbm5lY3QiOnRydWUsImhhbGxfaXBfbW9kZV9jb25maWdfY29ubmVjdCI6IjQ3LjEwMC4xNjIuNTIiLCJoaWRkZW5CYWNrZ3JvdW5kUGFjayI6W10sImhpZGRlbkNhcmRQYWNrIjpbInpoZW5mYSIsInl1bmNob3UiLCJzd2QiLCJndWppYW4iLCJoZWFydGgiLCJnd2VudCIsIm10ZyIsImh1YW5sZWthcGFpIl0sImhpZGRlbkNoYXJhY3RlclBhY2siOlsieGlhbmppYW4iLCJndWppYW4iLCJzd2QiLCJvdyIsIm10ZyIsImd3ZW50IiwiaGVhcnRoIiwieXhzIiwiZGl5Il0sImhpZGRlbk1vZGVQYWNrIjpbInN0b25lIiwidGFmYW5nIiwiY2hlc3MiXSwiaGlkZGVuUGxheVBhY2siOlsid3V4aW5nIl0sImhpZGVfY2FyZF9pbWFnZSI6ZmFsc2UsImhpZGVfY2FyZF9wcm9tcHRfYmFzaWMiOmZhbHNlLCJoaWRlX2NhcmRfcHJvbXB0X2VxdWlwIjpmYWxzZSwiaHBfc3R5bGUiOiJnbGFzcyIsImh1YW5odWF6aGl6aGFuX21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJpZGVudGl0eV9iYW5uZWQiOlsiZ29uZ3N1bnphbiIsImNhb2NhbyIsInhpYWhvdWR1biIsInpoYW5nbGlhbyIsInh1emh1IiwiZ3VvamlhIiwiemhlbmppIiwibGl1YmVpIiwiZ3Vhbnl1IiwiemhhbmdmZWkiLCJ6aHVnZWxpYW5nIiwiemhhb3l1biIsIm1hY2hhbyIsImh1YW5neXVleWluZyIsInN1bnF1YW4iLCJnYW5uaW5nIiwibHZtZW5nIiwiaHVhbmdnYWkiLCJ6aG91eXUiLCJkYXFpYW8iLCJsdXh1biIsInN1bnNoYW5neGlhbmciLCJodWF0dW8iLCJsdmJ1IiwiZGlhb2NoYW4iLCJodWF4aW9uZyIsInJlX3l1YW5zaHUiLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJ6aHVyb25nIiwic3VuamlhbiIsImRvbmd6aHVvIiwiZGVuZ2FpIiwiamlhbmd3ZWkiLCJjYWl3ZW5qaSIsInJlX3l1amluIiwib2xkX2h1YXhpb25nIiwiaGFuYmEiLCJoZWppbiIsImhhbnN1aSIsIm5pdWppbiIsIm1pZnVyZW4iLCJtYXRlbmciLCJ0aWFuZmVuZyIsImNoZW5kb25nIiwic3BfZG9uZ3podW8iLCJqaWFuZ2ZlaSIsImppYW5ncWluZyIsImtvbmdyb25nIiwiYmlhbmZ1cmVuIiwibGlxdWVndW9zaSIsImx2ZmFuIiwiY3VpbWFvIiwiamlsaW5nIiwiemFuZ2JhIiwiemhhbmdyZW4iLCJ6b3VzaGkiLCJnYW5mdXJlbiIsInNwX3hpYWhvdXNoaSIsImpzcF96aGFveXVuIiwiaHVhbmdqaW5sZWlzaGkiLCJzcF9wYW5ndG9uZyIsInNwX2RhcWlhbyIsInNwX2dhbm5pbmciLCJzcF94aWFob3VkdW4iLCJzcF9sdm1lbmciLCJzcF96aGFuZ2ZlaSIsInNwX2xpdWJlaSIsIndhbmd5dW4iLCJvbGRfYnVsaWFuc2hpIiwib2xkX3l1YW5zaHUiLCJ5dWppIiwiemhhbmdqaWFvIiwib2xkX3podWdlemhhbiIsIm9sZF96aG91dGFpIiwib2xkX2Nhb3JlbiIsInhpYWhvdXl1YW4iLCJ4aWFvcWlhbyIsImh1YW5nemhvbmciLCJ3ZWl5YW4iLCJ4dWh1YW5nIiwicGFuZ2RlIiwibWFzdSIsInh1c2h1IiwiZmF6aGVuZyIsInl1amluIiwieGluX3l1amluIiwib2xkX3h1c2hlbmciLCJvbGRfbGluZ3RvbmciLCJvbGRfbWFkYWkiLCJvbGRfemhvbmdodWkiLCJvbGRfd2FuZ3lpIiwib2xkX2d1YW56aGFuZyIsIm9sX2xpYW9odWEiLCJsaXJ1Iiwib2xkX3podXJhbiIsIm9sX3podXJhbiIsIm9sX21hbmNob25nIiwib2xfZ3VvaHVhaSIsIm9sZF9mdWh1YW5naG91Iiwib2xkX2Nhb2Nob25nIiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsIm9sZF96aHVodWFuIiwib2xfd3V5aSIsIm9sZF9jYW94aXUiLCJvbGRfcXVhbmNvbmciLCJvbGRfemh1emhpIiwib2xfeGlueGlhbnlpbmciLCJvbF96aGFuZ3JhbmciLCJvbF9saXV5dSIsIm9sZF9jYW9jaHVuIiwib2xkX2xpbmdqdSIsIm9sZF9tYWxpYW5nIiwib2xkX21hY2hhbyIsInpoYW5nbGlhbmciLCJqc3BfY2FvcmVuIiwiY3VpeWFuIiwic2ltYXlpIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsIm9sZF96aGFuZ3hpbmdjYWkiLCJ6aGFuZ2dvbmciLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsIm9sZF9tYWp1biIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV96aGFuZ2ZlaSIsIm9sX21hbGlhbmciLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfZ29uZ3N1bnphbiIsInNwX2xpdXhpZSIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsIm9sX2d1YW5zdW8iLCJyZV9zcF96aHVnZWxpYW5nIiwiemhhbmd5aSIsImhlcWkiLCJuc19jYW9jYW8iLCJuc19ndWFubHUiLCJuc19zaW1hemhhbyIsImRpeV93ZW55YW5nIiwibnNfeGlueGlhbnlpbmciLCJuc196aGFuZ3dlaSIsIm5zX21hc3UiLCJuc195YW5neWkiLCJuc196aHVnZWxpYW5nIiwibnNfbHZtZW5nIiwibnNfc3VuamlhbiIsIm5zX2Nhb2Nhb3NwIiwibnNfZHVhbmd1aSIsIm5zX2h1YW11bGFuIiwib2xfemhhbmdsaWFvIiwicmVfZ3VhbnFpdWppYW4iLCJyZV9wYW5ndG9uZyJdLCJpZGVudGl0eV9mb250IjoieGlud2VpIiwiaWRlbnRpdHlfbW9kZV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6Im5vcm1hbCIsImltYWdlX2JhY2tncm91bmQiOiJ4aW5zaGFfYmciLCJpbWFnZV9iYWNrZ3JvdW5kX2JsdXIiOmZhbHNlLCJpbWFnZV9iYWNrZ3JvdW5kX3JhbmRvbSI6ZmFsc2UsImltcG9ydF9kYXRhX2J1dHRvbiI6ZmFsc2UsImppdV9lZmZlY3QiOnRydWUsImp1bnpodV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJrZWVwX2F3YWtlIjp0cnVlLCJsYWRkZXJfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJsYWRkZXJfbW9udGhseV9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImxhc3RfaXAiOiI0Ny4xMDAuMTYyLjUyIiwibGF5b3V0IjoibG9uZzIiLCJsaW5rX3N0eWxlMiI6ImNoYWluIiwibG93X3BlcmZvcm1hbmNlIjp0cnVlLCJsdWNreV9zdGFyIjpmYWxzZSwibWFpbl96aHVfbW9kZV9jb25maWdfY2hlc3MiOmZhbHNlLCJtYW5hX21vZGVfbW9kZV9jb25maWdfc3RvbmUiOiJpbmMiLCJtYXJrX2lkZW50aXR5X3N0eWxlIjoibWVudSIsIm1heF9sb2FkdGltZSI6IjUwMDAiLCJtZW51X3N0eWxlIjoic2ltcGxlIiwibW9kZSI6ImNvbm5lY3QiLCJuYW1lX2ZvbnQiOiJzaG91c2hhIiwibmV3X3R1dG9yaWFsIjp0cnVlLCJub3JlcGxhY2VfZW5kX21vZGVfY29uZmlnX2NoZXNzIjpmYWxzZSwib25seWd1b3poYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwib25seWd1b3poYW5leHBhbmRfbW9kZV9jb25maWdfZ3VvemhhbiI6ZmFsc2UsInBob25lbGF5b3V0Ijp0cnVlLCJwbGF5ZXJfYm9yZGVyIjoic2xpbSIsInBsYXllcl9oZWlnaHQiOiJsb25nIiwicGxheWVyX2hlaWdodF9ub3ZhIjoic2hvcnQiLCJwbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2d1b3poYW4iOiI4IiwicGxheWVyX251bWJlcl9tb2RlX2NvbmZpZ19pZGVudGl0eSI6IjgiLCJwbGF5ZXJfc3R5bGUiOiJzaW1wbGUiLCJwbGF5cyI6WyJib3NzIl0sInBvcF9sb2d2Ijp0cnVlLCJwb3BlcXVpcCI6dHJ1ZSwicHJvbXB0X2hpZGVwYWNrIjp0cnVlLCJwdW5pc2hfbW9kZV9jb25maWdfY2hlc3MiOiLml6AiLCJyYWRpdXNfc2l6ZSI6ImluY3JlYXNlIiwicmVjZW50Q2hhcmFjdGVyX21vZGVfY29uZmlnX2Jvc3MiOlsiY2FvY2h1biIsImNhb3lpbmciLCJ6aGFuZ2NoYW5ncHUiXSwicmVjZW50Q2hhcmFjdGVyX21vZGVfY29uZmlnX2NoZXNzIjpbInd1eGlhbiIsInNoYW1va2UiLCJjYW9jaHVuIl0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19kb3VkaXpodSI6WyJ3ZW55YW5nIl0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19ndW96aGFuIjpbImd6X3dhbmdwaW5nIiwiZ3pfaHVhbmd5dWV5aW5nIiwiZ3pfc3Bfemh1Z2VsaWFuZyIsImd6X21hY2hhbyIsImd6X3NoYW1va2UiLCJnel9wYW5nZGUiLCJnel9iZWltaWh1Il0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19pZGVudGl0eSI6WyJ6aGFveGlhbmciLCJjYW9jaHVuIiwibGlqdWUiLCJzaGVucGVpIiwiZ3VhbnFpdWppYW4iLCJsaWZlbmciLCJyZV9saXVzaGFuIiwieGZfaHVhbmdxdWFuIiwiZ3Vhbmx1Iiwid2FuZ2NhbiIsInRhb3FpYW4iLCJyZV9qaWthbmciXSwicmVjZW50Q2hhcmFjdGVyX21vZGVfY29uZmlnX3NpbmdsZSI6WyJzdW54aXUiLCJyZV9zdW5xdWFuIiwicmVfZGFxaWFvIl0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19zdG9uZSI6WyJyZV9jYWl3ZW5qaSJdLCJyZWNlbnRDaGFyYWN0ZXJfbW9kZV9jb25maWdfdmVyc3VzIjpbImJvc3NfaHVuZHVuIiwiYm9zc19uaWFuc2hvdV9iYW9udSJdLCJyZWNlbnRJUCI6WyI0Ny4xMDAuMTYyLjUyOjgwODAiLCJub25hbWUubW9iaTo4MDgwIiwiMTIzLjU2LjE2Ni4xMDU6ODA4MCJdLCJyZWNlbnRfY2hhcmFjdGVyX251bWJlciI6IjEyIiwicmVjb25uZWN0X2luZm8iOlsiNDcuMTAwLjE2Mi41Mjo4MDgwIixudWxsXSwicmVtZW1iZXJfZGlhbG9nIjpmYWxzZSwicmVtZW1iZXJfcm91bmRfYnV0dG9uIjp0cnVlLCJyZXBlYXRfYXVkaW8iOmZhbHNlLCJyZXBsYWNlX2NoYXJhY3Rlcl90d29fbW9kZV9jb25maWdfdmVyc3VzIjpmYWxzZSwicmVwbGFjZV9oYW5kY2FyZF90d29fbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJyZXBsYWNlX251bWJlcl9tb2RlX2NvbmZpZ19jaGVzcyI6MCwicmV2aXZlX21vZGVfY29uZmlnX2RvdWRpemh1IjpmYWxzZSwicmV2aXZlX21vZGVfY29uZmlnX2d1b3poYW4iOmZhbHNlLCJyZXZpdmVfbW9kZV9jb25maWdfaWRlbnRpdHkiOmZhbHNlLCJyZXdhcmRfbW9kZV9jb25maWdfY2hlc3MiOjMsInJpZ2h0X2NsaWNrIjoicGF1c2UiLCJyaWdodF9yYW5nZSI6dHJ1ZSwicm9vbV9idXR0b25fbW9kZV9jb25maWdfY29ubmVjdCI6dHJ1ZSwicm91bmRfbWVudV9mdW5jIjoic3lzdGVtIiwic2NlbmVfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInNlYXRfb3JkZXJfbW9kZV9jb25maWdfY2hlc3MiOiLkuqTmm78iLCJzZXBlcmF0ZV9jb250cm9sIjp0cnVlLCJzaG93X2Jhbl9tZW51IjpmYWxzZSwic2hvd19jYXJkX3Byb21wdCI6dHJ1ZSwic2hvd19jYXJkcGlsZV9udW1iZXIiOnRydWUsInNob3dfY2hhcmFjdGVyY2FyZCI6dHJ1ZSwic2hvd19kaXNjYXJkcGlsZSI6ZmFsc2UsInNob3dfZGlzdGFuY2VfbW9kZV9jb25maWdfY2hlc3MiOnRydWUsInNob3dfZGlzdGFuY2VfbW9kZV9jb25maWdfdGFmYW5nIjp0cnVlLCJzaG93X2V4dGVuc2lvbm1ha2VyIjp0cnVlLCJzaG93X2V4dGVuc2lvbnNoYXJlIjp0cnVlLCJzaG93X2Zhdm1vZGUiOmZhbHNlLCJzaG93X2Zhdm91cml0ZSI6ZmFsc2UsInNob3dfZmF2b3VyaXRlX21lbnUiOmZhbHNlLCJzaG93X2dpdmV1cCI6dHJ1ZSwic2hvd19oYW5kY2FyZGJ1dHRvbiI6dHJ1ZSwic2hvd19oaXN0b3J5IjoicmlnaHQiLCJzaG93X2xvZyI6Im9mZiIsInNob3dfcGhhc2VfcHJvbXB0Ijp0cnVlLCJzaG93X3BoYXNldXNlX3Byb21wdCI6dHJ1ZSwic2hvd19yYW5nZV9tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwic2hvd19yYW5nZV9tb2RlX2NvbmZpZ190YWZhbmciOnRydWUsInNob3dfcmVwbGF5Ijp0cnVlLCJzaG93X3NvcnRjYXJkIjp0cnVlLCJzaG93X3NwbGFzaCI6ImluaXQiLCJzaG93X3N0YXR1c2Jhcl9hbmRyb2lkIjpmYWxzZSwic2hvd190aW1lIjp0cnVlLCJzaG93X3RpbWUyIjpmYWxzZSwic2hvd190aW1lMyI6dHJ1ZSwic2hvd193dXhpZSI6ZmFsc2UsInNpZ3VvX2NoYXJhY3Rlcl9tb2RlX2NvbmZpZ192ZXJzdXMiOiJub3JtYWwiLCJzaW5nbGVfYmFubmVkIjpbImdvbmdzdW56YW4iLCJkZW5nYWkiLCJqaWFuZ3dlaSIsImJpYW5mdXJlbiIsImNhb2NhbyIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW9jaHVuIiwiY2FvcGkiLCJqc3BfY2FvcmVuIiwib2xkX2Nhb3JlbiIsIm9sZF9jYW94aXUiLCJvbGRfY2FvemhlbiIsIm9sZF9jaGVucXVuIiwiY3VpbWFvIiwiY3VpeWFuIiwib2xfZ3VvaHVhaSIsImd1b2ppYSIsIm9sX21hbmNob25nIiwibml1amluIiwic2ltYXlpIiwib2xkX3dhbmd5aSIsInNwX3hpYWhvdWR1biIsInhpYWhvdWR1biIsInhpYWhvdXl1YW4iLCJvbF94aW54aWFueWluZyIsInh1aHVhbmciLCJ4dW55dSIsInh1emh1IiwicmVfeXVqaW4iLCJ4aW5feXVqaW4iLCJ5dWppbiIsInphbmdiYSIsInpoYW5nbGlhbyIsInpoZW5qaSIsIm9sZF96aG9uZ2h1aSIsImZhemhlbmciLCJnYW5mdXJlbiIsImd1YW55dSIsIm9sZF9ndWFuemhhbmciLCJodWFuZ3l1ZXlpbmciLCJodWFuZ3pob25nIiwiamlhbmdmZWkiLCJvbF9saWFvaHVhIiwibGl1YmVpIiwic3BfbGl1YmVpIiwibWFjaGFvIiwib2xkX21hZGFpIiwib2xkX21hbGlhbmciLCJtYXN1Iiwiem91c2hpIiwianNwX3poYW95dW4iLCJ6aGFuZ3JlbiIsIm9sX3poYW5ncmFuZyIsInpoYW5nbGlhbmciLCJ6aGFuZ2ppYW8iLCJ5dWppIiwicmVfeXVhbnNodSIsIm9sZF95dWFuc2h1IiwicmVfeXVhbnNoYW8iLCJ5YW53ZW4iLCJ3YW5neXVuIiwidGlhbmZlbmciLCJzcF9wYW5ndG9uZyIsInBhbmdkZSIsIm1hdGVuZyIsIm9sZF9tYWNoYW8iLCJsdmJ1Iiwib2xfbGl1eXUiLCJsaXJ1IiwibGlxdWVndW9zaSIsIm9sZF9saW5nanUiLCJrb25ncm9uZyIsIm1pZnVyZW4iLCJwYW5ndG9uZyIsIndlaXlhbiIsIm9sX3d1eWkiLCJzcF94aWFob3VzaGkiLCJ4dXNodSIsInNwX3poYW5nZmVpIiwiemhhbmdmZWkiLCJ6aGFveXVuIiwiemh1cm9uZyIsIm9sZF9idWxpYW5zaGkiLCJjaGVuZG9uZyIsImRhcWlhbyIsInNwX2RhcWlhbyIsImdhbm5pbmciLCJqaWFuZ3FpbmciLCJodWFuZ2dhaSIsIm9sZF9saW5ndG9uZyIsImx1eHVuIiwibHZmYW4iLCJsdm1lbmciLCJzcF9sdm1lbmciLCJvbGRfcXVhbmNvbmciLCJzdW5qaWFuIiwic3VucXVhbiIsInN1bnNoYW5neGlhbmciLCJ4aWFvcWlhbyIsIm9sZF94dXNoZW5nIiwib2xkX3pob3V0YWkiLCJ6aG91eXUiLCJvbGRfemh1aHVhbiIsIm9sX3podXJhbiIsIm9sZF96aHVyYW4iLCJvbGRfemh1emhpIiwiY2Fpd2VuamkiLCJkaWFvY2hhbiIsImRvbmd6aHVvIiwic3BfZG9uZ3podW8iLCJvbGRfZnVodWFuZ2hvdSIsInNwX2dhbm5pbmciLCJoYW5iYSIsImhhbnN1aSIsImhlamluIiwiaHVhbmdqaW5sZWlzaGkiLCJodWF0dW8iLCJodWF4aW9uZyIsIm9sZF9odWF4aW9uZyIsImppbGluZyIsInpodWdlbGlhbmciLCJvbGRfemh1Z2V6aGFuIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsIm9sZF96aGFuZ3hpbmdjYWkiLCJ6aGFuZ2dvbmciLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsIm9sZF9tYWp1biIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV96aGFuZ2ZlaSIsIm9sX21hbGlhbmciLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfZ29uZ3N1bnphbiIsInNwX2xpdXhpZSIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsIm9sX2d1YW5zdW8iLCJyZV9zcF96aHVnZWxpYW5nIiwiemhhbmd5aSIsImhlcWkiLCJuc19jYW9jYW8iLCJuc19ndWFubHUiLCJuc19zaW1hemhhbyIsImRpeV93ZW55YW5nIiwibnNfeGlueGlhbnlpbmciLCJuc196aGFuZ3dlaSIsIm5zX21hc3UiLCJuc195YW5neWkiLCJuc196aHVnZWxpYW5nIiwibnNfbHZtZW5nIiwibnNfc3VuamlhbiIsIm5zX2Nhb2Nhb3NwIiwibnNfZHVhbmd1aSIsIm5zX2h1YW11bGFuIiwic3Bfemh1Z2VsaWFuZyIsIm9sX3poYW5nbGlhbyIsInJlX2d1YW5xaXVqaWFuIiwicmVfcGFuZ3RvbmciXSwic2luZ2xlX2Jhbm5lZGNhcmRzIjpbIm11bml1Il0sInNpbmdsZV9jb250cm9sX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsInNpbmdsZV9jb250cm9sX21vZGVfY29uZmlnX2NoZXNzIjpmYWxzZSwic2luZ2xlX21vZGVfbW9kZV9jb25maWdfc2luZ2xlIjoiY2hhbmdiYW4iLCJza2lsbF9hbmltYXRpb25fdHlwZSI6ImRlZmF1bHQiLCJza2lsbF9iYXJfbW9kZV9jb25maWdfc3RvbmUiOnRydWUsInNraW4iOnsiemh1Z2VqaW4iOjEsInJlX3poYW5namlhbyI6NSwicmVfamlrYW5nIjoyLCJyZV94dXpodSI6MywibWFuY2hvbmciOjIsInJlX3dhbmd5dW4iOjEsInlhbmp1biI6MSwiZ3VhbnBpbmciOjEsInJlX2dhbm5pbmciOjEsInJlX2xpdXNoYW4iOjUsInJlX2xpdWJlaSI6MSwicmVfc3VucXVhbiI6NSwieWxfeXVhbnNodSI6MSwicmVfZG9uZ3podW8iOjYsInJlX3N1bmJlbiI6NSwicmVfY2FvY2FvIjoyLCJ6aG9uZ2h1aSI6MSwibGlqdWUiOjEsInp1bWFvIjoxLCJzdW54aXUiOjMsInJlX2ppYW5nd2VpIjoyLCJtZW5naHVvIjozLCJjYW9jaHVuIjoyLCJoYW5kYW5nIjoxLCJzdW5oYW8iOjEsInpob3VjYW5nIjoxfSwic2tpcF9zaGFuIjp0cnVlLCJzcGVjaWFsX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwic3RvcmFnZUltcG9ydGVkIjp0cnVlLCJzd2lwZSI6dHJ1ZSwic3dpcGVfZG93biI6Im1lbnUiLCJzd2lwZV9sZWZ0Ijoic3lzdGVtIiwic3dpcGVfcmlnaHQiOiJzeXN0ZW0iLCJzd2lwZV91cCI6ImF1dG8iLCJzeW5jX3NwZWVkIjpmYWxzZSwidGFmYW5nX2RpZmZpY3VsdHlfbW9kZV9jb25maWdfdGFmYW5nIjoiMiIsInRhZmFuZ190dXJuX21vZGVfY29uZmlnX3RhZmFuZyI6IjEwIiwidGFvX2VuZW15IjpmYWxzZSwidGFyZ2V0X3NoYWtlIjoic2hha2UiLCJ0ZXh0ZXF1aXAiOiJpbWFnZSIsInRoZW1lIjoic2ltcGxlIiwidG9uZ2ppYW5nbW9zaGlfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvbmdxdWVkdW9wYW9fbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvbmd4aW5nemhpemhlbmdfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvdG91Y2hlZCI6dHJ1ZSwidG91Y2hzY3JlZW4iOnRydWUsInRyYW5zcGFyZW50X2RpYWxvZyI6ZmFsc2UsInR1cm5lZF9zdHlsZSI6dHJ1ZSwidHdvX2Fzc2lnbl9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsInR3b19waGFzZXN3YXBfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJ1aV96b29tIjoidnNtYWxsIiwidXBkYXRlX2xpbmsiOiJjb2RpbmciLCJ2ZXJzaW9uIjoiMS45Ljk4LjcuMSIsInZlcnN1c19iYW5uZWQiOlsiZ29uZ3N1bnphbiIsImRlbmdhaSIsImppYW5nd2VpIiwiYmlhbmZ1cmVuIiwiY2FvY2FvIiwib2xkX2Nhb2Nob25nIiwib2xkX2Nhb2NodW4iLCJjYW9waSIsImpzcF9jYW9yZW4iLCJvbGRfY2FvcmVuIiwib2xkX2Nhb3hpdSIsIm9sZF9jYW96aGVuIiwib2xkX2NoZW5xdW4iLCJjdWltYW8iLCJjdWl5YW4iLCJvbF9ndW9odWFpIiwiZ3VvamlhIiwib2xfbWFuY2hvbmciLCJuaXVqaW4iLCJzaW1heWkiLCJvbGRfd2FuZ3lpIiwic3BfeGlhaG91ZHVuIiwieGlhaG91ZHVuIiwieGlhaG91eXVhbiIsIm9sX3hpbnhpYW55aW5nIiwieHVodWFuZyIsInh1bnl1IiwieHV6aHUiLCJyZV95dWppbiIsInhpbl95dWppbiIsInl1amluIiwiemFuZ2JhIiwiemhhbmdsaWFvIiwiemhlbmppIiwib2xkX3pob25naHVpIiwiZmF6aGVuZyIsImdhbmZ1cmVuIiwiZ3Vhbnl1Iiwib2xkX2d1YW56aGFuZyIsImh1YW5neXVleWluZyIsImh1YW5nemhvbmciLCJqaWFuZ2ZlaSIsIm9sX2xpYW9odWEiLCJsaXViZWkiLCJzcF9saXViZWkiLCJtYWNoYW8iLCJvbGRfbWFkYWkiLCJvbGRfbWFsaWFuZyIsIm1hc3UiLCJ6b3VzaGkiLCJqc3Bfemhhb3l1biIsInpoYW5ncmVuIiwib2xfemhhbmdyYW5nIiwiemhhbmdsaWFuZyIsInpoYW5namlhbyIsInl1amkiLCJyZV95dWFuc2h1Iiwib2xkX3l1YW5zaHUiLCJyZV95dWFuc2hhbyIsInlhbndlbiIsIndhbmd5dW4iLCJ0aWFuZmVuZyIsInNwX3Bhbmd0b25nIiwicGFuZ2RlIiwibWF0ZW5nIiwib2xkX21hY2hhbyIsImx2YnUiLCJvbF9saXV5dSIsImxpcnUiLCJsaXF1ZWd1b3NpIiwib2xkX2xpbmdqdSIsImtvbmdyb25nIiwibWlmdXJlbiIsInBhbmd0b25nIiwid2VpeWFuIiwib2xfd3V5aSIsInNwX3hpYWhvdXNoaSIsInh1c2h1Iiwic3BfemhhbmdmZWkiLCJ6aGFuZ2ZlaSIsInpoYW95dW4iLCJ6aHVyb25nIiwib2xkX2J1bGlhbnNoaSIsImNoZW5kb25nIiwiZGFxaWFvIiwic3BfZGFxaWFvIiwiZ2FubmluZyIsImppYW5ncWluZyIsImh1YW5nZ2FpIiwib2xkX2xpbmd0b25nIiwibHV4dW4iLCJsdmZhbiIsImx2bWVuZyIsInNwX2x2bWVuZyIsIm9sZF9xdWFuY29uZyIsInN1bmppYW4iLCJzdW5xdWFuIiwic3Vuc2hhbmd4aWFuZyIsInhpYW9xaWFvIiwib2xkX3h1c2hlbmciLCJvbGRfemhvdXRhaSIsInpob3V5dSIsIm9sZF96aHVodWFuIiwib2xfemh1cmFuIiwib2xkX3podXJhbiIsIm9sZF96aHV6aGkiLCJjYWl3ZW5qaSIsImRpYW9jaGFuIiwiZG9uZ3podW8iLCJzcF9kb25nemh1byIsIm9sZF9mdWh1YW5naG91Iiwic3BfZ2FubmluZyIsImhhbmJhIiwiaGFuc3VpIiwiaGVqaW4iLCJodWFuZ2ppbmxlaXNoaSIsImh1YXR1byIsImh1YXhpb25nIiwib2xkX2h1YXhpb25nIiwiamlsaW5nIiwiemh1Z2VsaWFuZyIsIm9sZF96aHVnZXpoYW4iLCJzcF96aGFuZ2ppYW8iLCJyZV95dWppIiwienVvY2kiLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwib2xkX3poYW5neGluZ2NhaSIsInpoYW5nZ29uZyIsInJlX3dlaXdlbnpodWdlemhpIiwicmVfeHVnb25nIiwib2xkX21hanVuIiwicmVfZGlhbndlaSIsInJlX3N1bmNlIiwib2xkX3l1YW5zaGFvIiwib2xkX2d1YW5xaXVqaWFuIiwib2xkX2h1YW5nZnVzb25nIiwib2xfbGl1c2hhbiIsInhpbl95dWFuc2hhbyIsInJlX3poYW5nZmVpIiwib2xfbWFsaWFuZyIsInJlX2dhb3NodW4iLCJ3dWd1b3RhaSIsInh1c2hlbmciLCJ4aW5feGlhaG91ZHVuIiwic3Bfc2ltYXpoYW8iLCJzcF93YW5neXVhbmppIiwic3BfeGlueGlhbnlpbmciLCJzcF9nb25nc3VuemFuIiwic3BfbGl1eGllIiwicmVfeGlhaG91eXVhbiIsImJhb3Nhbm5pYW5nIiwib2xfZ3VhbnN1byIsInJlX3NwX3podWdlbGlhbmciLCJ6aGFuZ3lpIiwiaGVxaSIsIm5zX2Nhb2NhbyIsIm5zX2d1YW5sdSIsIm5zX3NpbWF6aGFvIiwiZGl5X3dlbnlhbmciLCJuc194aW54aWFueWluZyIsIm5zX3poYW5nd2VpIiwibnNfbWFzdSIsIm5zX3lhbmd5aSIsIm5zX3podWdlbGlhbmciLCJuc19sdm1lbmciLCJuc19zdW5qaWFuIiwibnNfY2FvY2Fvc3AiLCJuc19kdWFuZ3VpIiwibnNfaHVhbXVsYW4iLCJzcF96aHVnZWxpYW5nIiwib2xfemhhbmdsaWFvIiwicmVfZ3VhbnFpdWppYW4iLCJyZV9wYW5ndG9uZyJdLCJ2ZXJzdXNfYmFubmVkY2FyZHMiOlsibXVuaXUiXSwidmVyc3VzX21vZGVfbW9kZV9jb25maWdfdmVyc3VzIjoidHdvIiwidmlkZW8iOiI1Iiwidmlld25leHRfbW9kZV9jb25maWdfZ3VvemhhbiI6ZmFsc2UsInZvbHVtbl9hdWRpbyI6Miwidm9sdW1uX2JhY2tncm91bmQiOjAsIndhdGNoZmFjZSI6InNpbXBsZSIsIndlaXdvZHV6dW5fbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInd1eGllX3JpZ2h0Ijp0cnVlLCJ3dXhpZV9zZWxmIjpmYWxzZSwid3V4aW5nX2VuYWJsZV9wbGF5cGFja2NvbmZpZyI6ZmFsc2UsInd1eGluZ19udW1fcGxheXBhY2tjb25maWciOiIwLjMiLCJ6aG9uZ19jYXJkX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJ6aHVfbW9kZV9jb25maWdfY2hlc3MiOmZhbHNlLCJ6aHVsaWFuX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWV9LCJkYXRhIjp7ImJvc3MiOnsiY3VycmVudCI6ImJvc3NfaHVuZHVuIiwidmVyc2lvbiI6IjEuOS45NS44LjIifSwiYnJhd2wiOnsic2NlbmUiOnt9LCJzdGFnZSI6eyLlkIjnurXmipfnp6YiOnsibmFtZSI6IuWQiOe6teaKl+enpiIsImludHJvIjoi5rOo77ya5Y+v5Zyo6K6+572u4oaS5byA5aeL4oaS6IGU5py64oaS6IGU5py65pi156ew5Lit6K6+572u546p5a6255qE5pi156ew44CCIiwic2NlbmVzIjpbeyJuYW1lIjoi5Y+Y5rOV6ICFIiwiaW50cm8iOiLku47igJznp6blm73igJ3liLDigJznp6bmnJ3igJ3vvIzkuIDliIfpg73lvIDlp4vkuo7ku5YuLi4iLCJwbGF5ZXJzIjpbeyJuYW1lIjoiaGV6b25na2FuZ3Fpbl9wbGF5ZXIiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjoxLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjp0cnVlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkYXFpbl9zaGFuZ3lhbmciLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6InpodSIsInBvc2l0aW9uIjoyLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfbGl1YmVpIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuWQiOe6tei/nuaoqiIsImludHJvIjoi5b2T5LuK5aSp5LiL77yM5ZCI57q15oqX56em44CC5qyy56C05ZCI57q177yM5LuK5b2T6L+e5qiq77yBIiwicGxheWVycyI6W3sibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5femhhbmd5aSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5Ijoiemh1IiwicG9zaXRpb24iOjIsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkaWFud2VpIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuWni+WkquWQjiIsImludHJvIjoi4oCc6Ieq5q2k5pe25q2k5Yi76LW377yM5oiR5LiN5YaN5Li65ZCO77yM5Li65aSq5ZCO77yB4oCdIiwicGxheWVycyI6W3sibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fbWl5dWUiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6InpodSIsInBvc2l0aW9uIjozLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fYnViaW5nIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aG9uZyIsInBvc2l0aW9uIjo0LCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfY2FvY2FvIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuihgOaImOmVv+W5syIsImludHJvIjoi6Z2i5a+55pyq5bCd6LSl57up55qE5LuW77yM5L2g6IO95Y+W5b6X6IOc5Yip5ZCX77yfIiwicGxheWVycyI6W3sibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fcWliaW5nIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aG9uZyIsInBvc2l0aW9uIjozLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fYmFpcWkiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6InpodSIsInBvc2l0aW9uIjo0LCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfemhhbmdsaWFvIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuWQleawj+aYpeeniyIsImludHJvIjoi6LSp54+g5Y2W546J6Z2e5oiR5omA5oS/77yM56uL5ZCb5bu65Zu95pa55Y+v5rO96KKr5ZCO5LiWIiwicGxheWVycyI6W3sibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fcWliaW5nIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aG9uZyIsInBvc2l0aW9uIjozLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fbHZidXdlaSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5Ijoiemh1IiwicG9zaXRpb24iOjQsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJyZV9odWFuZ2dhaSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiZmFuIiwicG9zaXRpb24iOjIsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfV0sImNhcmRQaWxlVG9wIjpbXSwiY2FyZFBpbGVCb3R0b20iOltdLCJkaXNjYXJkUGlsZSI6W10sImdhbWVEcmF3Ijp0cnVlfSx7Im5hbWUiOiLnpbjkubHlrqvpl7EiLCJpbnRybyI6Iuiwhei/meWkqeS4i++8jOS5n+ayoeacieS4gOS4queUt+S6uuiDveaLkue7neaIke+8jOWTvOWTvOWTvOKApuKApiIsInBsYXllcnMiOlt7Im5hbWUiOiJkYXFpbl9idWJpbmciLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6Inpob25nIiwicG9zaXRpb24iOjIsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJoZXpvbmdrYW5ncWluX3BsYXllciIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiZmFuIiwicG9zaXRpb24iOjMsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOnRydWUsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX3poYW9qaSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5Ijoiemh1IiwicG9zaXRpb24iOjUsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkYXFpbl9udXNob3UiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6Inpob25nIiwicG9zaXRpb24iOjYsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJyZV94aWFob3VkdW4iLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjoxLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfY2FvY2FvIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6NCwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuaoquaJq+WFreWQiCIsImludHJvIjoi5qiq5omr5YWt5ZCI77yM5bm25ZCe5YWr6I2S44CC5Li+5bGx5rKz5YaF5aSW77yM55qG5YyN5YyQ6ISa5LiL44CCIiwicGxheWVycyI6W3sibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5feWluZ3poZW5nIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aHUiLCJwb3NpdGlvbiI6NCwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX3FpYmluZyIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6NSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX2J1YmluZyIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6NiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6InJlX2d1b2ppYSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiZmFuIiwicG9zaXRpb24iOjEsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJyZV94aWFob3V5dWFuIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuaymeS4mOiwi+WPmCIsImludHJvIjoi56em55qH5bey5bSp77yM5LuO5LuK5aSp6LW377yM5oiR5aeT6LW155qE6K+05LqG566X44CCIiwicGxheWVycyI6W3sibmFtZSI6ImRhcWluX3poYW9nYW8iLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6InpodSIsInBvc2l0aW9uIjoyLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiaGV6b25na2FuZ3Fpbl9wbGF5ZXIiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjozLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjp0cnVlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkYXFpbl9xaWJpbmciLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6Inpob25nIiwicG9zaXRpb24iOjUsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkYXFpbl9udXNob3UiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6Inpob25nIiwicG9zaXRpb24iOjYsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJyZV9jYW9jYW8iLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjoxLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfbGl1YmVpIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6NCwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuWMuemFjeaooeW8jyIsImludHJvIjoiIiwicGxheWVycyI6W3sibmFtZSI6ImRhcWluX2FscGhhMSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX2FscGhhMCIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6MiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiaGV6b25na2FuZ3Fpbl9wbGF5ZXIiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjo0LCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjp0cnVlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJoZXpvbmdrYW5ncWluX3BsYXllciIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiZmFuIiwicG9zaXRpb24iOjUsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOnRydWUsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX2FscGhhNCIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6NiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX2FscGhhMyIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6NywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6ImRhcWluX2FscGhhMiIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiemhvbmciLCJwb3NpdGlvbiI6OCwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuW4neWbveWFiOmpsSIsImludHJvIjoi5aSn56em5bid5Zu955qE6Z2p5paw6ICF5ZKM5oiY55Wl5a6256uZ5Zyo5LqG5LiA6LW3IiwicGxheWVycyI6W3sibmFtZSI6ImRhcWluX3poYW5neWkiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6InpodSIsInBvc2l0aW9uIjoxLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fc2hhbmd5YW5nIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aG9uZyIsInBvc2l0aW9uIjoyLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiaGV6b25na2FuZ3Fpbl9wbGF5ZXIiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjozLCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjp0cnVlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJyZV94aWFob3VkdW4iLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6ImZhbiIsInBvc2l0aW9uIjo0LCJocCI6bnVsbCwibWF4SHAiOm51bGwsImxpbmtlZCI6ZmFsc2UsInR1cm5lZG92ZXIiOmZhbHNlLCJwbGF5ZXJjb250cm9sIjpmYWxzZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoicmVfemhhbmdqaWFvIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6NSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119XSwiY2FyZFBpbGVUb3AiOltdLCJjYXJkUGlsZUJvdHRvbSI6W10sImRpc2NhcmRQaWxlIjpbXSwiZ2FtZURyYXciOnRydWV9LHsibmFtZSI6IuS4rea1geegpeafsSIsImludHJvIjoi5YaF5aSW5aS55Ye755qE6K+d5by654OI5pS75Yq/77yM5L2g6IO95ZCm5Z2a5oyB5aSa5LmF77yfIiwicGxheWVycyI6W3sibmFtZSI6ImRhcWluX2JhaXFpIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJ6aHUiLCJwb3NpdGlvbiI6MSwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6Imhlem9uZ2thbmdxaW5fcGxheWVyIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MywiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6dHJ1ZSwiaGFuZGNhcmRzIjpbXSwiZXF1aXBzIjpbXSwianVkZ2VzIjpbXX0seyJuYW1lIjoiZGFxaW5fbWl5dWUiLCJuYW1lMiI6Im5vbmUiLCJpZGVudGl0eSI6Inpob25nIiwicG9zaXRpb24iOjUsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfSx7Im5hbWUiOiJkaWFud2VpIiwibmFtZTIiOiJub25lIiwiaWRlbnRpdHkiOiJmYW4iLCJwb3NpdGlvbiI6MiwiaHAiOm51bGwsIm1heEhwIjpudWxsLCJsaW5rZWQiOmZhbHNlLCJ0dXJuZWRvdmVyIjpmYWxzZSwicGxheWVyY29udHJvbCI6ZmFsc2UsImhhbmRjYXJkcyI6W10sImVxdWlwcyI6W10sImp1ZGdlcyI6W119LHsibmFtZSI6InJlX2xpdWJlaSIsIm5hbWUyIjoibm9uZSIsImlkZW50aXR5IjoiZmFuIiwicG9zaXRpb24iOjQsImhwIjpudWxsLCJtYXhIcCI6bnVsbCwibGlua2VkIjpmYWxzZSwidHVybmVkb3ZlciI6ZmFsc2UsInBsYXllcmNvbnRyb2wiOmZhbHNlLCJoYW5kY2FyZHMiOltdLCJlcXVpcHMiOltdLCJqdWRnZXMiOltdfV0sImNhcmRQaWxlVG9wIjpbXSwiY2FyZFBpbGVCb3R0b20iOltdLCJkaXNjYXJkUGlsZSI6W10sImdhbWVEcmF3Ijp0cnVlfV0sIm1vZGUiOiJub3JtYWwiLCJsZXZlbCI6MH19LCJjdXJyZW50QnJhd2wiOiJ0b25namlhbmdtb3NoaSIsInZlcnNpb24iOiIxLjkuOTgifSwiaWRlbnRpdHkiOnsibGFkZGVyIjp7ImN1cnJlbnQiOjkwMCwidG9wIjo5MDAsIm1vbnRoIjoxMX0sInZlcnNpb24iOiIxLjkuOTYifSwidmVyc3VzIjp7ImxhZGRlciI6eyJjdXJyZW50Ijo5MDAsInRvcCI6OTAwLCJtb250aCI6M30sInZlcnNpb24iOiIxLjkuOTguNC40In19fQ==";
            }
            else {
                data = "eyJjb25maWciOnsiWkRKTF9zYXZlIjp7ImNhb2NhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaW1heWkiOnsid2luIjowLCJsb3NlIjowfSwieGlhaG91ZHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5nbGlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4dXpodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndW9qaWEiOnsid2luIjowLCJsb3NlIjowfSwiemhlbmppIjp7IndpbiI6MCwibG9zZSI6MH0sImxpdWJlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndWFueXUiOnsid2luIjowLCJsb3NlIjowfSwiemhhbmdmZWkiOnsid2luIjowLCJsb3NlIjowfSwiemh1Z2VsaWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFveXVuIjp7IndpbiI6MCwibG9zZSI6MH0sIm1hY2hhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJodWFuZ3l1ZXlpbmciOnsid2luIjowLCJsb3NlIjowfSwic3VucXVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnYW5uaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImx2bWVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJodWFuZ2dhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aG91eXUiOnsid2luIjowLCJsb3NlIjowfSwiZGFxaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sImx1eHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInN1bnNoYW5neGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiaHVhdHVvIjp7IndpbiI6MCwibG9zZSI6MH0sImx2YnUiOnsid2luIjowLCJsb3NlIjowfSwiZGlhb2NoYW4iOnsid2luIjowLCJsb3NlIjowfSwiaHVheGlvbmciOnsid2luIjowLCJsb3NlIjowfSwiZ29uZ3N1bnphbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjYW96aGFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4Zl95aWppIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3l1YW5zaHUiOnsid2luIjowLCJsb3NlIjowfSwib2xkX21hanVuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aGFuZ3hpbmdjYWkiOnsid2luIjowLCJsb3NlIjowfSwib2xkX2Z1aHVhbmdob3UiOnsid2luIjowLCJsb3NlIjowfSwib2xkX2Nhb2Nob25nIjp7IndpbiI6MCwibG9zZSI6MH0sInl1amkiOnsid2luIjowLCJsb3NlIjowfSwiemhhbmdqaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aGFuZ2ZlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfaHVhdHVvIjp7IndpbiI6MCwibG9zZSI6MH0sImpzcF9jYW9yZW4iOnsid2luIjowLCJsb3NlIjowfSwib2xkX2Nhb2NodW4iOnsid2luIjowLCJsb3NlIjowfSwibWFzdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4dXNodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmYXpoZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxpcnUiOnsid2luIjowLCJsb3NlIjowfSwieXVqaW4iOnsid2luIjowLCJsb3NlIjowfSwieGluX3l1amluIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aG9uZ2h1aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfeHVzaGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfemh1cmFuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9saW5ndG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfbWFkYWkiOnsid2luIjowLCJsb3NlIjowfSwib2xkX2Nhb3hpdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfd2FuZ3lpIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9jYW96aGVuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9xdWFuY29uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfbGluZ2p1Ijp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9tYWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9jaGVucXVuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aHVodWFuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aHV6aGkiOnsid2luIjowLCJsb3NlIjowfSwib2xkX21hY2hhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbGRfemh1Z2V6aGFuIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5nbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwib2xkX2d1YW56aGFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbF94aW54aWFueWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbF96aGFuZ3JhbmciOnsid2luIjowLCJsb3NlIjowfSwib2xfeXVqaW4iOnsid2luIjowLCJsb3NlIjowfSwib2xfemh1cmFuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sX2xpYW9odWEiOnsid2luIjowLCJsb3NlIjowfSwib2xfZ3VhbnN1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbF9tYW5jaG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJvbF9ndW9odWFpIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sX3d1eWkiOnsid2luIjowLCJsb3NlIjowfSwib2xfbGl1eXUiOnsid2luIjowLCJsb3NlIjowfSwidHdfYmVpbWlodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJuYXNoaW1lIjp7IndpbiI6MCwibG9zZSI6MH0sInR3X3hpYWhvdWJhIjp7IndpbiI6MCwibG9zZSI6MH0sInR3X3p1bWFvIjp7IndpbiI6MCwibG9zZSI6MH0sInR3X2Nhb2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ0d19kaW5nZmVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ0d19jYW9ob25nIjp7IndpbiI6MCwibG9zZSI6MH0sInR3X21hbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwia2Fpc2EiOnsid2luIjowLCJsb3NlIjowfSwicmVfamlrYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9idWxpYW5zaGkiOnsid2luIjowLCJsb3NlIjowfSwibWloZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInRhb3FpYW4iOnsid2luIjowLCJsb3NlIjowfSwibGl1emFuIjp7IndpbiI6MCwibG9zZSI6MH0sImxpbmdjYW8iOnsid2luIjowLCJsb3NlIjowfSwic3VucnUiOnsid2luIjowLCJsb3NlIjowfSwibGlmZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInpodWxpbmciOnsid2luIjowLCJsb3NlIjowfSwibGl1eWUiOnsid2luIjowLCJsb3NlIjowfSwiemhhb3Rvbmd6aGFvZ3VhbmciOnsid2luIjowLCJsb3NlIjowfSwibWFqdW4iOnsid2luIjowLCJsb3NlIjowfSwic2ltYXpoYW8iOnsid2luIjowLCJsb3NlIjowfSwid2FuZ3l1YW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJwYW5nZGVnb25nIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF95dWFuc2h1Ijp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5wZWkiOnsid2luIjowLCJsb3NlIjowfSwicmVfd2FuZ3l1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9iYW9zYW5uaWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJodWppbmRpbmciOnsid2luIjowLCJsb3NlIjowfSwicmVfemhhbmdnb25nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3h1Z29uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV93ZWl3ZW56aHVnZXpoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaGVuX2d1YW55dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaGVuX3poYW95dW4iOnsid2luIjowLCJsb3NlIjowfSwic2hlbl96aHVnZWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5fbHZtZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5femhvdXl1Ijp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5fc2ltYXlpIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5fY2FvY2FvIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5fbHZidSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaGVuX2xpdWJlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaGVuX2x1eHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5femhhbmdsaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sInNoZW5fZ2FubmluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9jYW9jYW8iOnsid2luIjowLCJsb3NlIjowfSwicmVfc2ltYXlpIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2d1b2ppYSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9saWRpYW4iOnsid2luIjowLCJsb3NlIjowfSwicmVfemhhbmdsaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3h1emh1Ijp7IndpbiI6MCwibG9zZSI6MH0sInJlX3hpYWhvdWR1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV96aGFuZ2ZlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV96aGFveXVuIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2d1YW55dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9tYWNoYW8iOnsid2luIjowLCJsb3NlIjowfSwicmVfeHVzaHUiOnsid2luIjowLCJsb3NlIjowfSwicmVfemhvdXl1Ijp7IndpbiI6MCwibG9zZSI6MH0sInJlX2x2bWVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9nYW5uaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2x1eHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2RhcWlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9odWFuZ2dhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9sdmJ1Ijp7IndpbiI6MCwibG9zZSI6MH0sInJlX2dvbmdzdW56YW4iOnsid2luIjowLCJsb3NlIjowfSwicmVfaHVhdHVvIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2xpdWJlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9kaWFvY2hhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9odWFuZ3l1ZXlpbmciOnsid2luIjowLCJsb3NlIjowfSwicmVfc3VucXVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9zdW5zaGFuZ3hpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3poZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV96aHVnZWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2h1YXhpb25nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3poYW5namlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aW5feXVqaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV96dW9jaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV94aWFob3V5dWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImNhb3JlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9odWFuZ3pob25nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3dlaXlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV94aWFvcWlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aG91dGFpIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3BhbmdkZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV94dWh1YW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3NwX3podWdlbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwicmVfeHVueXUiOnsid2luIjowLCJsb3NlIjowfSwicmVfZGlhbndlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV95YW53ZW4iOnsid2luIjowLCJsb3NlIjowfSwicmVfcGFuZ3RvbmciOnsid2luIjowLCJsb3NlIjowfSwieGluX3l1YW5zaGFvIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3podXJvbmciOnsid2luIjowLCJsb3NlIjowfSwicmVfbWVuZ2h1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9kb25nemh1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9zdW5qaWFuIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2Nhb3BpIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX2RlbmdhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9qaWFuZ3dlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9jYWl3ZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9saXVzaGFuIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3N1bmJlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV96aGFuZ3poYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIndhbmdjYW4iOnsid2luIjowLCJsb3NlIjowfSwic3BfdGFpc2hpY2kiOnsid2luIjowLCJsb3NlIjowfSwicmVfanNwX3Bhbmd0b25nIjp7IndpbiI6MCwibG9zZSI6MH0sImx2ZGFpIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3poYW5nbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwibHZxaWFuIjp7IndpbiI6MCwibG9zZSI6MH0sInBhbmp1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkdWppIjp7IndpbiI6MCwibG9zZSI6MH0sInpob3VmYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInlhbmp1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsaXV5YW8iOnsid2luIjowLCJsb3NlIjowfSwibGl1eWFuIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF96aG91dGFpIjp7IndpbiI6MCwibG9zZSI6MH0sIm9sZF9jYW9yZW4iOnsid2luIjowLCJsb3NlIjowfSwieHVodWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJwYW5nZGUiOnsid2luIjowLCJsb3NlIjowfSwieGlhaG91eXVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJodWFuZ3pob25nIjp7IndpbiI6MCwibG9zZSI6MH0sIndlaXlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aWFvcWlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF96aGFuZ2ppYW8iOnsid2luIjowLCJsb3NlIjowfSwicmVfeXVqaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF96aHVnZWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInBhbmd0b25nIjp7IndpbiI6MCwibG9zZSI6MH0sInh1bnl1Ijp7IndpbiI6MCwibG9zZSI6MH0sImRpYW53ZWkiOnsid2luIjowLCJsb3NlIjowfSwidGFpc2hpY2kiOnsid2luIjowLCJsb3NlIjowfSwieWFud2VuIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3l1YW5zaGFvIjp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmdodW8iOnsid2luIjowLCJsb3NlIjowfSwiemh1cm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjYW9waSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJyZV9sdXN1Ijp7IndpbiI6MCwibG9zZSI6MH0sInN1bmppYW4iOnsid2luIjowLCJsb3NlIjowfSwiZG9uZ3podW8iOnsid2luIjowLCJsb3NlIjowfSwiamlheHUiOnsid2luIjowLCJsb3NlIjowfSwiamlhbmd3ZWkiOnsid2luIjowLCJsb3NlIjowfSwibGl1c2hhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ2hlIjp7IndpbiI6MCwibG9zZSI6MH0sImRlbmdhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzdW5jZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ3poYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImNhaXdlbmppIjp7IndpbiI6MCwibG9zZSI6MH0sInp1b2NpIjp7IndpbiI6MCwibG9zZSI6MH0sIndhbmdqaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5YW55YW4iOnsid2luIjowLCJsb3NlIjowfSwid2FuZ3BpbmciOnsid2luIjowLCJsb3NlIjowfSwibHVqaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzdW5saWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4dXlvdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5bF9sdXpoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrdWFpbGlhbmdrdWFpeXVlIjp7IndpbiI6MCwibG9zZSI6MH0sImd1YW5xaXVqaWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImhhb3poYW8iOnsid2luIjowLCJsb3NlIjowfSwiemh1Z2V6aGFuIjp7IndpbiI6MCwibG9zZSI6MH0sImx1a2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5bF95dWFuc2h1Ijp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5neGl1Ijp7IndpbiI6MCwibG9zZSI6MH0sImNoZW5kYW8iOnsid2luIjowLCJsb3NlIjowfSwiemhvdWZlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndW9odWFpIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5nY2h1bmh1YSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjYW96aGkiOnsid2luIjowLCJsb3NlIjowfSwiY2FvY2hvbmciOnsid2luIjowLCJsb3NlIjowfSwieHVueW91Ijp7IndpbiI6MCwibG9zZSI6MH0sInhpbl94dXNodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aW5fbWFzdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aW5fZmF6aGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aHVyYW4iOnsid2luIjowLCJsb3NlIjowfSwieHVzaGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ3dWd1b3RhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsaW5ndG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsaXViaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sIndhbmd5aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5dWZhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjaGVuZ29uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJidWxpYW5zaGkiOnsid2luIjowLCJsb3NlIjowfSwiaGFuZGFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmdWh1YW5naG91Ijp7IndpbiI6MCwibG9zZSI6MH0sInpob25naHVpIjp7IndpbiI6MCwibG9zZSI6MH0sImppYW55b25nIjp7IndpbiI6MCwibG9zZSI6MH0sIm1hZGFpIjp7IndpbiI6MCwibG9zZSI6MH0sImxpdWZlbmciOnsid2luIjowLCJsb3NlIjowfSwibWFuY2hvbmciOnsid2luIjowLCJsb3NlIjowfSwiZ3VhbnpoYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImNoZW5xdW4iOnsid2luIjowLCJsb3NlIjowfSwic3VubHViYW4iOnsid2luIjowLCJsb3NlIjowfSwiZ3V5b25nIjp7IndpbiI6MCwibG9zZSI6MH0sImNhaWZ1cmVuIjp7IndpbiI6MCwibG9zZSI6MH0sInlqX2p1c2hvdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ3NvbmciOnsid2luIjowLCJsb3NlIjowfSwiemh1aHVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aWFob3VzaGkiOnsid2luIjowLCJsb3NlIjowfSwicGFuemhhbmdtYXpob25nIjp7IndpbiI6MCwibG9zZSI6MH0sInpob3VjYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImd1YW5waW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxpYW9odWEiOnsid2luIjowLCJsb3NlIjowfSwiY2hlbmdwdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnYW9zaHVuIjp7IndpbiI6MCwibG9zZSI6MH0sImNhb3poZW4iOnsid2luIjowLCJsb3NlIjowfSwid3V5aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJoYW5oYW9zaGlodWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImNhb3J1aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjYW94aXUiOnsid2luIjowLCJsb3NlIjowfSwiemhvbmd5YW8iOnsid2luIjowLCJsb3NlIjowfSwibGl1Y2hlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ3lpIjp7IndpbiI6MCwibG9zZSI6MH0sInN1bnhpdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aHV6aGkiOnsid2luIjowLCJsb3NlIjowfSwicXVhbmNvbmciOnsid2luIjowLCJsb3NlIjowfSwiZ29uZ3N1bnl1YW4iOnsid2luIjowLCJsb3NlIjowfSwiZ3VvdHVmZW5namkiOnsid2luIjowLCJsb3NlIjowfSwieGluX2xpcnUiOnsid2luIjowLCJsb3NlIjowfSwiZ3VvaHVhbmdob3UiOnsid2luIjowLCJsb3NlIjowfSwibGl1eXUiOnsid2luIjowLCJsb3NlIjowfSwibGl5YW4iOnsid2luIjowLCJsb3NlIjowfSwic3VuZGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjZW5odW4iOnsid2luIjowLCJsb3NlIjowfSwiaHVhbmdoYW8iOnsid2luIjowLCJsb3NlIjowfSwiemhhbmdyYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInN1bnppbGl1ZmFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4aW54aWFueWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ3dXhpYW4iOnsid2luIjowLCJsb3NlIjowfSwieHVzaGkiOnsid2luIjowLCJsb3NlIjowfSwiY2FvamllIjp7IndpbiI6MCwibG9zZSI6MH0sImNhaXlvbmciOnsid2luIjowLCJsb3NlIjowfSwiamlrYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInFpbm1pIjp7IndpbiI6MCwibG9zZSI6MH0sInh1ZXpvbmciOnsid2luIjowLCJsb3NlIjowfSwib2xkX2h1YXhpb25nIjp7IndpbiI6MCwibG9zZSI6MH0sInJlX3l1amluIjp7IndpbiI6MCwibG9zZSI6MH0sInl1YW50YW55dWFuc2hhbmciOnsid2luIjowLCJsb3NlIjowfSwiaHVhbWFuIjp7IndpbiI6MCwibG9zZSI6MH0sInh1amluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4dXNoYW8iOnsid2luIjowLCJsb3NlIjowfSwicHV5dWFuIjp7IndpbiI6MCwibG9zZSI6MH0sInhpbnBpIjp7IndpbiI6MCwibG9zZSI6MH0sImxpc3UiOnsid2luIjowLCJsb3NlIjowfSwiemhhbmd3ZW4iOnsid2luIjowLCJsb3NlIjowfSwiaGVqaW4iOnsid2luIjowLCJsb3NlIjowfSwiaGFuc3VpIjp7IndpbiI6MCwibG9zZSI6MH0sIm5pdWppbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndWFubHUiOnsid2luIjowLCJsb3NlIjowfSwiZ2V4dWFuIjp7IndpbiI6MCwibG9zZSI6MH0sIndlbnlhbmciOnsid2luIjowLCJsb3NlIjowfSwibWFuZ3lhY2hhbmciOnsid2luIjowLCJsb3NlIjowfSwieHVnb25nIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5nY2hhbmdwdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJqaWFuZ2dhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsaWp1ZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ2ppIjp7IndpbiI6MCwibG9zZSI6MH0sImZhbmNob3UiOnsid2luIjowLCJsb3NlIjowfSwiZ3Vvc2kiOnsid2luIjowLCJsb3NlIjowfSwibHZrYWkiOnsid2luIjowLCJsb3NlIjowfSwiemhhbmdnb25nIjp7IndpbiI6MCwibG9zZSI6MH0sIndlaXdlbnpodWdlemhpIjp7IndpbiI6MCwibG9zZSI6MH0sInhmX3Rhbmd6aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4Zl9odWFuZ3F1YW4iOnsid2luIjowLCJsb3NlIjowfSwieGZfc3VmZWkiOnsid2luIjowLCJsb3NlIjowfSwiY2FveWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzaW1haHVpIjp7IndpbiI6MCwibG9zZSI6MH0sImJhb3Nhbm5pYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInh1cm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ3FpeWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF94aWFob3VzaGkiOnsid2luIjowLCJsb3NlIjowfSwieWFuZ3hpdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjaGVubGluIjp7IndpbiI6MCwibG9zZSI6MH0sImNhb2hvbmciOnsid2luIjowLCJsb3NlIjowfSwieGlhaG91YmEiOnsid2luIjowLCJsb3NlIjowfSwieXVhbnNodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9kaWFvY2hhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF96aGFveXVuIjp7IndpbiI6MCwibG9zZSI6MH0sImpzcF96aGFveXVuIjp7IndpbiI6MCwibG9zZSI6MH0sImxpdXhpZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aHVnZWppbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aHVnZWtlIjp7IndpbiI6MCwibG9zZSI6MH0sImd1YW55aW5waW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInNpbWFsYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5neGluZ2NhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmdXdhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9zdW5zaGFuZ3hpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImNhb2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9jYW9yZW4iOnsid2luIjowLCJsb3NlIjowfSwiemhhbmdiYW8iOnsid2luIjowLCJsb3NlIjowfSwiaHVhbmdqaW5sZWlzaGkiOnsid2luIjowLCJsb3NlIjowfSwibWFsaWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9wYW5ndG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aHVnZWRhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9qaWFuZ3dlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9tYWNoYW8iOnsid2luIjowLCJsb3NlIjowfSwic3VuaGFvIjp7IndpbiI6MCwibG9zZSI6MH0sInNoaXhpZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtYXl1bmx1Ijp7IndpbiI6MCwibG9zZSI6MH0sInpoYW5nbHUiOnsid2luIjowLCJsb3NlIjowfSwid3V0dWd1Ijp7IndpbiI6MCwibG9zZSI6MH0sInNwX2NhaXdlbmppIjp7IndpbiI6MCwibG9zZSI6MH0sInpodWdlZ3VvIjp7IndpbiI6MCwibG9zZSI6MH0sImxpbmdqdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjdWl5YW4iOnsid2luIjowLCJsb3NlIjowfSwic3BfemhhbmdmZWkiOnsid2luIjowLCJsb3NlIjowfSwianNwX2d1YW55dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJqc3BfaHVhbmd5dWV5aW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInN1bmx1eXUiOnsid2luIjowLCJsb3NlIjowfSwiaGFuYmEiOnsid2luIjowLCJsb3NlIjowfSwienVtYW8iOnsid2luIjowLCJsb3NlIjowfSwid2VucGluIjp7IndpbiI6MCwibG9zZSI6MH0sImRheGlhb3FpYW8iOnsid2luIjowLCJsb3NlIjowfSwic3BfZGFxaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sInNwX2dhbm5pbmciOnsid2luIjowLCJsb3NlIjowfSwic3BfeGlhaG91ZHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInNwX2x2bWVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndWFuc3VvIjp7IndpbiI6MCwibG9zZSI6MH0sInRhZHVuIjp7IndpbiI6MCwibG9zZSI6MH0sInlhbmJhaWh1Ijp7IndpbiI6MCwibG9zZSI6MH0sImNoZW5neXUiOnsid2luIjowLCJsb3NlIjowfSwid2FuZ2xhbmciOnsid2luIjowLCJsb3NlIjowfSwic3BfcGFuZ2RlIjp7IndpbiI6MCwibG9zZSI6MH0sInNwX2ppYXh1Ijp7IndpbiI6MCwibG9zZSI6MH0sImxpdG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtaXpodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJidXpoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9saXViZWkiOnsid2luIjowLCJsb3NlIjowfSwiY2FvY2h1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkb25nYmFpIjp7IndpbiI6MCwibG9zZSI6MH0sInpoYW94aWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtYXpob25nIjp7IndpbiI6MCwibG9zZSI6MH0sImRvbmd5dW4iOnsid2luIjowLCJsb3NlIjowfSwia2FuemUiOnsid2luIjowLCJsb3NlIjowfSwiaGVxaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnYW5mdXJlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtaWZ1cmVuIjp7IndpbiI6MCwibG9zZSI6MH0sIm1hdGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ0aWFuZmVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5dWVqaW4iOnsid2luIjowLCJsb3NlIjowfSwiY2hlbmRvbmciOnsid2luIjowLCJsb3NlIjowfSwic3BfZG9uZ3podW8iOnsid2luIjowLCJsb3NlIjowfSwiamlhbmdmZWkiOnsid2luIjowLCJsb3NlIjowfSwiamlhbmdxaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImhldGFpaG91Ijp7IndpbiI6MCwibG9zZSI6MH0sImtvbmdyb25nIjp7IndpbiI6MCwibG9zZSI6MH0sImRpbmdmZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInBhbmZlbmciOnsid2luIjowLCJsb3NlIjowfSwiYmlhbmZ1cmVuIjp7IndpbiI6MCwibG9zZSI6MH0sInNoYW1va2UiOnsid2luIjowLCJsb3NlIjowfSwibGlxdWVndW9zaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsdmZhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjdWltYW8iOnsid2luIjowLCJsb3NlIjowfSwiamlsaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sInphbmdiYSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6aGFuZ3JlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6b3VzaGkiOnsid2luIjowLCJsb3NlIjowfSwiaHVhbmdmdXNvbmciOnsid2luIjowLCJsb3NlIjowfSwid2FuZ3l1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzdW5xaWFuIjp7IndpbiI6MCwibG9zZSI6MH0sInhpemhpY2FpIjp7IndpbiI6MCwibG9zZSI6MH0sInF1eWkiOnsid2luIjowLCJsb3NlIjowfSwiYmVpbWlodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzcF9saXVxaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsdXpoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJESU5HX2d1b3l1YW4iOnsid2luIjowLCJsb3NlIjowfSwiRElOR19odWFuZmFuIjp7IndpbiI6MCwibG9zZSI6MH0sIkRJTkdfaHVveWkiOnsid2luIjowLCJsb3NlIjowfSwiRElOR196b25neXUiOnsid2luIjowLCJsb3NlIjowfSwiRElOR19zdW5kZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIkRJTkdfbHZqdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJESU5HX3h1cm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJESU5HX2dvbmdzdW5kdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJESU5HX2ZhbnllIjp7IndpbiI6MCwibG9zZSI6MH0sIkxTSlJfZG9uZ2JhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJMU0pSX2x2amkiOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl93YW5neXVhbmppIjp7IndpbiI6MCwibG9zZSI6MH0sIkxTSlJfeGlueGlhbnlpbmciOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl9iYW9zYW5uaWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJMU0pSX21pZnVyZW4iOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl96aGFuZ3hpbmdjYWkiOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl9zdW5sdWJhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJMU0pSX3N1bnNoYW5neGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl9idWxpYW5zaGkiOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl9zdW5sdXl1Ijp7IndpbiI6MCwibG9zZSI6MH0sIkxTSlJfY2FpZnVyZW4iOnsid2luIjowLCJsb3NlIjowfSwiTFNKUl96aGFuZ2NodW5odWEiOnsid2luIjowLCJsb3NlIjowfSwiTFNKUjFfbWlmdXJlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJxd3PpnZLpvpkiOnsid2luIjowLCJsb3NlIjowfSwiendz5pyx6ZuAIjp7IndpbiI6MCwibG9zZSI6MH0sInh3c+eOhOatpiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJid3Pnmb3omY4iOnsid2luIjowLCJsb3NlIjowfSwiendz54Ob6b6ZIjp7IndpbiI6MCwibG9zZSI6MH0sInF3c+m6kum6nyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJod3PmtZHmsowiOnsid2luIjowLCJsb3NlIjowfSwidHdz6aWV6aSuIjp7IndpbiI6MCwibG9zZSI6MH0sInR3c+aivOadjCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJxd3PnqbflpYciOnsid2luIjowLCJsb3NlIjowfSwidHdz6IW+6JuHIjp7IndpbiI6MCwibG9zZSI6MH0sInl3c+mbqOW4iOWmviI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmd3Ppo47nlJ/lhb0iOnsid2luIjowLCJsb3NlIjowfSwiVExQX21vZmFzaGkiOnsid2luIjowLCJsb3NlIjowfSwiVExQX252amlzaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJUTFBfbnZodWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJUTFBfaHVhbmdkaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJUTFBfamlhb2h1YW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF9saWFucmVuIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF96aGFuY2hlIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF9saWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF95aW56aGUiOnsid2luIjowLCJsb3NlIjowfSwiVExQX21pbmd5dW56aGlsdW4iOnsid2luIjowLCJsb3NlIjowfSwiVExQX3poZW5neWkiOnsid2luIjowLCJsb3NlIjowfSwiVExQX2Rhb2RpYW9yZW4iOnsid2luIjowLCJsb3NlIjowfSwiVExQX3Npc2hlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJUTFBfamllemhpIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF9lbW8iOnsid2luIjowLCJsb3NlIjowfSwiVExQX2dhb3RhIjp7IndpbiI6MCwibG9zZSI6MH0sIlRMUF94aW5neGluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJUTFBfeXVlbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiVExQX3RhaXlhbmciOnsid2luIjowLCJsb3NlIjowfSwiVExQX3NoZW5wYW4iOnsid2luIjowLCJsb3NlIjowfSwiVExQX3NoaWppZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJiYWl5eXPnmb3ni7wiOnsid2luIjowLCJsb3NlIjowfSwieWFueXlz54Of54Of572XIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmd5eXPlhbXkvaMiOnsid2luIjowLCJsb3NlIjowfSwiaHV5eXPonbTonbbnsr4iOnsid2luIjowLCJsb3NlIjowfSwiaHVhbmd5eXPojZIiOnsid2luIjowLCJsb3NlIjowfSwiamlueXlz6YeR6bG85aesIjp7IndpbiI6MCwibG9zZSI6MH0sImppdXl5c+S5neWRveeMqyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJodWFuZ3l5c+iNkuW3neS5i+S4uyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJndWl5eXPprLzkvb/nmb0iOnsid2luIjowLCJsb3NlIjowfSwidGlhb3l5c+i3s+i3s+WmueWmuSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjaXl5c+iMqOacqOerpeWtkCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5YW95eXPlppbni5AiOnsid2luIjowLCJsb3NlIjowfSwiZ3VpeXlz6ay85L2/6buRIjp7IndpbiI6MCwibG9zZSI6MH0sInFpbmd5eXPpnZLooYznga8iOnsid2luIjowLCJsb3NlIjowfSwidGFveXlz5qGD6Iqx5aaWIjp7IndpbiI6MCwibG9zZSI6MH0sInNob3V5eXPpppbml6AiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+Wkp+WkqeeLlyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf6YWS5ZCe56ul5a2QIjp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/ovonlpJzlp6wiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+iMqOacqOerpeWtkCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf546J6Je75YmNIjp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/lppbliIDlp6wiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+mdkuihjOeBryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf6Iqx6bif55S7Ijp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/ojZIiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+W+oemmlOa0pSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf5bCP6bm/55S3Ijp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/pm6rnq6XlrZAiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+iNkuW3neS5i+S4uyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf5b285bK46IqxIjp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/kuIDnm67ov54iOnsid2luIjowLCJsb3NlIjowfSwieXlzX+WxsemiqiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf5Lik6Z2i5L2bIjp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/pmI7prZQiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+mbquWlsyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5eXNf56We5LmQIjp7IndpbiI6MCwibG9zZSI6MH0sInl5c1/luqfmlbfnq6XlrZAiOnsid2luIjowLCJsb3NlIjowfSwieXlzX+akkuWbviI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX2Z1cWlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX3poYW9ndWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX2d1YW5zdW8iOnsid2luIjowLCJsb3NlIjowfSwiTkhITF96aHVnZXpoYW4iOnsid2luIjowLCJsb3NlIjowfSwiTkhITF93ZW55YW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIk5ISExfd3V0dWd1Ijp7IndpbiI6MCwibG9zZSI6MH0sIk5ISExfeGlhaG91YmEiOnsid2luIjowLCJsb3NlIjowfSwiTkhITF96aHVnZWRhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX2RvbmdiYWkiOnsid2luIjowLCJsb3NlIjowfSwiTkhITF95YW5iYWlodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX3N1bmx1YmFuIjp7IndpbiI6MCwibG9zZSI6MH0sIk5ISExfenVtYW8iOnsid2luIjowLCJsb3NlIjowfSwiTkhITF9jaGVucXVuIjp7IndpbiI6MCwibG9zZSI6MH0sIk5ISExfd3Vhbmd1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX2x1a2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJOSEhMX3pob3VqaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+WumeaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+i1q+aLiSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+azouWhnuWGrCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+WTiOmHjOaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+mYv+azoue9lyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+mYv+eRnuaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+mYv+iKmee9l+eLhOW/kiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+W+t+WiqOW/kuWwlCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+i1q+WwlOWiqOaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+i1q+iPsuaWr+aJmOaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+eLhOS/hOWwvOe0ouaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+mYv+WwlOW/kuW8peaWryI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bHNoX+mbheWFuOWonCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3VucXVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfZ2FubmluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfbHZtZW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19odWFuZ2dhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfemhvdXl1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU19kYXFpYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2x1eHVuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zdW5zaGFuZ3hpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zdW5qaWFuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zdW5jZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeGlhb3FpYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3RhaXNoaWNpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aG91dGFpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19sdXN1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU19saW5ndG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeHVzaGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfYnVsaWFuc2hpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19kaW5nZmVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfemhhbmd6aGFvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19idXpoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfd3VndW90YWkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NwemhvdXRhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3BkYXFpYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NweGlhb3FpYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NwemhvdXl1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zcGx2bWVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfbGl1YmVpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19ndWFueXUiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3poYW5nZmVpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aHVnZWxpYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aGFveXVuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19tYWNoYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2h1YW5neXVleWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfaHVhbmd6aG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfd2VpeWFuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zcHpodWdlbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2ppYW5nd2VpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19ndWFucGluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfbWVuZ2h1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfemh1cm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfemhhbmd4aW5nY2FpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aG91Y2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfYmFvc2FubmlhbmciOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2d1YW5zdW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX21hZGFpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19saXVzaGFuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19tYXN1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zcHN1bnNoYW5neGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3lhbnlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfZmF6aGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeHVzaHUiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3Bhbmd0b25nIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19jYW9jYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NpbWF5aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeGlhaG91ZHVuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aGFuZ2xpYW8iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3h1emh1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU19ndW9qaWEiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3poZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeGlhaG91eXVhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfY2FvaG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeHVodWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfY2FvcmVuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19kaWFud2VpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU194dW55dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfY2FvcGkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NwemhlbmppIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zcHBhbmdkZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3BqaWF4dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfeXVqaW4iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2Nhb3poaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3BjYWl3ZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3BzaW1heWkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NpbWFzaGkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3NpbWF6aGFvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aGFuZ2NodW5odWEiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3dhbmd5dWFuamkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3pob25naHVpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19kZW5nYWkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3hpYWhvdWJhIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19ndW9odWFpIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19jaGVuZ3l1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aGFuZ2hlIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU195YW5neGl1Ijp7IndpbiI6MCwibG9zZSI6MH0sIldTU193YW5neWkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2h1YXR1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfbHZidSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfZGlhb2NoYW4iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3l1YW5zaGFvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU195YW5saWFuZ3dlbmNob3UiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2Rvbmd6aHVvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19qaWF4dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfcGFuZ2RlIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196dW9jaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfemhhbmdqaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19jaGVuZ29uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfZ2Fvc2h1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfY2Fpd2VuamkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3l1YW5zaHUiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2dvbmdzdW56YW4iOnsid2luIjowLCJsb3NlIjowfSwiV1NTX3Nwemh1cm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1Nfc3BtZW5naHVvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19rb25ncm9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJXU1NfbGl1eGllIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19zcGRpYW9jaGFuIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU19kYXhpYW9xaWFvIjp7IndpbiI6MCwibG9zZSI6MH0sIldTU196aGVubWkiOnsid2luIjowLCJsb3NlIjowfSwiV1NTX2h1YXhpb25nIjp7IndpbiI6MCwibG9zZSI6MH0sImFsanhf5pif6a2UIjp7IndpbiI6MCwibG9zZSI6MH0sImFsanhf5Lyg5aWH5pyx6ZuAIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf57695p6X5Y2rIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5q+S6b2/5p2Q5a6YIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5a6/5Y2r6JmO6aqRIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5Li56Ziz5YW1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6Juf6bOE5YabIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf55m96ICz5YW1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5aSc5Y+J6KGMIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6KW/5YeJ5YabIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5peg5b2T6aOe5YabIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6Z2S5bee5YW1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6JmO6LG56aqRIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6JmO5Y2r5YabIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5YWr55m+5q275aOrIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5paw5Yuf5YW1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf55m96ams5LmJ5LuOIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5YWI55m75q275aOrIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf5aSn5oif5aOrIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6Zm36Zi16JClIjp7IndpbiI6MCwibG9zZSI6MH0sImJpbmdf6buE5be+5YabIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9kcmx6X2NoZW5kYW8iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfemhvdWNhbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfeGlhbmdjaG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZHJsel9zdW5oYW8iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfamlhbmdxaW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfY2hlbnd1Ijp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9kcmx6X2Nhb3poZW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfeGluZ2Rhb3JvbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfd2FuZ3NodWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZHJsel9saWp1ZWd1b3NpIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9kcmx6X3F1eWkiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2RybHpfaGFuc3VpIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9scmZqX3dhbmdwaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9scmZqX3NoYW1va2UiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2xyZmpfbWF5dW5sdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHJmal9jYW9ydWkiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2xyZmpfY2FvY2h1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHJmal9jaGVuZ3l1Ijp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9scmZqX3N1bmh1YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2xyZmpfZG9uZ3hpIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9scmZqX3podWh1YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2xyZmpfd2FuZ3l1ZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHJmal96aGFuZ3NvbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2xyZmpfemhhbmdyZW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfbGl5YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfeWFuZ3lpIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9uenJ5X2ZlaXlpIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9uenJ5X2Nhb3lpbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfamlhbmdnYW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfeHV5b3UiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfa2FuemUiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfemhvdWZhbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfZmFuamlhbmd6aGFuZ2RhIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9uenJ5X3dhbmd5dW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX256cnlfc2ltYWh1aSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZ21yaF9odWFuZ3F1YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2dtcmhfbWVuZ2RhIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9nbXJoX2Rlbmd6aGkiOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2dtcmhfenVtYW8iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2dtcmhfcXVhbmNvbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2dtcmhfbHVrYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9nbXJoX3NpbWF6aGFvIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9nbXJoX2h1YXhpbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZ21yaF9jaGVucXVuIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9nbXJoX2ppcGluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZ21yaF9uYW5odWFsYW94aWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9nbXJoX2d1YW5sdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfZ21yaF9taWhlbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2h5cnNfbGl1Y2hlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfaHlyc195YW55YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2h5cnNfamlhbmd3YW4iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2h5cnNfZ3V5b25nIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9oeXJzX3dlaXdlbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfaHlyc19xdWF4aWFvamlhbmciOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2h5cnNfY2FvYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9oeXJzX2xpZGlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfaHlyc19oYW96aGFvIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9oeXJzX21hdGVuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfaHlyc196aGFuZ2x1Ijp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9oeXJzX3d1dHVndSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHliX2ppa2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHliX3dhbmdsYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9seWJfc2ltYXNoaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHliX2d1YW55dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHliX2h1YW5naGFvIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9seWJfemhvdWNodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsanloc2xfbHliX3FpYW9ndW9sYW8iOnsid2luIjowLCJsb3NlIjowfSwibGp5aHNsX2x5Yl9odWFuZ2NoZW5neWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImxqeWhzbF9seWJfdGFkdW4iOnsid2luIjowLCJsb3NlIjowfSwieGluU1Bf5b6Q5bq2Ijp7IndpbiI6MCwibG9zZSI6MH0sImxueWh6cuWSr+WTqeWSr+WTqW9sIjp7IndpbiI6MCwibG9zZSI6MH0sImxueWh6cuiOieiOieWnhi7mj5DpnLLln4Pmi4lvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsbnloenLpvpnpqpHlo6tvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJubnloenLlpq7lqJxvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLlvrflj6Tmi4lvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJobnloenLlkI7nvr9vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLoi4/lsJTogq9vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJubnloenLnk6blsJTln7rph4xvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrbnloenLlh6/mkpJvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLlsI/kuZRvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLni4TlqJxvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLlj7jpqazmh79vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJqbnloenLph5HkuYxvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbnloenLpmL/liqrmr5Tmlq9vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLnjoTmraZvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnbnloenLnlJjpgZPlpKtvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLmoJHnsr7plb/ogIFvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ0bnloenLms7DlnaZvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLmsLTlhYPntKBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLmrbvnpZ5vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLpobnnvr1vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJibnloenLlhavmraflpKfom4dvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrbnloenLni4LlvpJvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5bnloenLmnajmiKxvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtbnloenLnsbPov6bli5JvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLnlLXlhYnkvqBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsbnloenLlhbBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLlpKfkuZRvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5bnloenLpm4XlhbjlqJxvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLopb/ojqtvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjbnloenLkuJvmnpfkuYvlrZBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnbnloenLlrqvmnKzmrabol49vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsbnloenLpsoHnk6ZvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbnloenLpmL/nkZ7mlq9vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLluK3nkpDovr5vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ6bnloenLpkp/pppdvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbnloenLpmL/ms6LnvZdvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJobnloenLoirHmnKjlhbBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ4bnloenLopb/pl6jpo57pm6pvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLlrZnmgp/nqbpvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLmlq/lt7Tovr5vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLpu5vopb/kuppvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkbnloenLlprLlt7FvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrbnloenLljaHmn69vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbnloenLoib7olodvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmbnloenLnpo/lqINvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJnbnloenLlhbPnvr1vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsbnloenLmnY7nmb1vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJjbnloenLlq6blqKVvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJmbnloenLmnI3pg6jljYrol49vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJzbnloenLnpZ7pm5XkvqBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJsbnloenLojrHmiIjmi4nmlq9vbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJ5bnloenLmnIjlhZRvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbnloenLoib7ov6rlhbBvbCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtbnloenLnga3kuJbprZTmmJ8iOnsid2luIjowLCJsb3NlIjowfSwibXJmel/og73lpKnkvb8iOnsid2luIjowLCJsb3NlIjowfSwibXJmel/mlq/ljaHokoIiOnsid2luIjowLCJsb3NlIjowfSwibXJmel/or5fmgIDpm4UiOnsid2luIjowLCJsb3NlIjowfSwibXJmel/mmJ/nhooiOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+Wwj+aZuiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtZW5nemhhbmNf5bCP6ZyeIjp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmd6aGFuY1/lj6Tmn7MiOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+WdguacqCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtZW5nemhhbmNf55Cq6Zyy6K+6Ijp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmd6aGFuY1/mqZkiOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+e6oue+jumTgyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtZW5nemhhbmNf6JW+57Gz6I6J5LqaIjp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmd6aGFuY1/niqzotbDmpJsiOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+exs+aWr+iSguWohSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtZW5nemhhbmNf5Yew6I6y5Lil5LmL5LuLIjp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmd6aGFuY1/kuIrmnYnosKbkv6EiOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+acneeUsOivl+S5gyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtZW5nemhhbmNf6YCi5Z2C5aSn5rKzIjp7IndpbiI6MCwibG9zZSI6MH0sIm1lbmd6aGFuY1/lsI/nuqLluL0iOnsid2luIjowLCJsb3NlIjowfSwibWVuZ3poYW5jX+S6mumHjOS6miI6eyJ3aW4iOjAsImxvc2UiOjB9LCJhbGRfYWlsdWRpIjp7IndpbiI6MCwibG9zZSI6MH0sIk5HTkxfeGl1YmkiOnsid2luIjowLCJsb3NlIjowfSwiRkdPX3FpZ2UiOnsid2luIjowLCJsb3NlIjowfSwiRkdPX21heGl1amlsaWVsYWl0ZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJGR09fa2Fyb25nIjp7IndpbiI6MCwibG9zZSI6MH0sIkZHT19oYWlzZW5sdW9ibyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJGR09famllcmRlbGVpIjp7IndpbiI6MCwibG9zZSI6MH0sImppYW5nc2hpZnoiOnsid2luIjowLCJsb3NlIjowfSwiamlhbmdzaGluaiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2h1bmR1biI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3Fpb25ncWkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc190YW90aWUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc190YW93dSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3podXlpbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3hpYW5nbGl1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJvc3Nfemh1eWFuIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfYmlmYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfeWluZ3poYW8iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19xaW5nbG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX211c2hlbmdvdW1hbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19zaHVqaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfdGFpaGFvIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3Nfemh1cXVlIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfaHVvc2hlbnpodXJvbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc195YW5saW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfeWFuZGkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19iYWlodSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2ppbnNoZW5ydXNob3UiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19taW5neGluZ3podSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3NoYW9oYW8iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc194dWFud3UiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19zaHVpc2hlbmdvbmdnb25nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3Nfc2h1aXNoZW54dWFubWluZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3podWFueHUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19uaWFuc2hvdV9oZXRpIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfbmlhbnNob3VfamluZ2p1ZSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX25pYW5zaG91X3JlbnhpbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19uaWFuc2hvdV9ydWl6aGkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19uaWFuc2hvdV9iYW9udSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2JhaXd1Y2hhbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19oZWl3dWNoYW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfbHVvY2hhIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfeWVjaGEiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19uaXV0b3UiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19tYW1pYW4iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19jaGkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19tbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3dhbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19saWFuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3Fpbmd1YW5nd2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2NodWppYW5nd2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3NvbmdkaXdhbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc193dWd1YW53YW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfeWFubHVvd2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2JpYW5jaGVuZ3dhbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc190YWlzaGFud2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2R1c2hpd2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3BpbmdkZW5nd2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3podWFubHVud2FuZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2x2YnUxIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfbHZidTIiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19sdmJ1MyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2Nhb2NhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2d1b2ppYSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3poYW5nY2h1bmh1YSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3poZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2xpdWJlaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3podWdlbGlhbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19odWFuZ3l1ZXlpbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19wYW5ndG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3poYW95dW4iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc196aG91eXUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19jYWl3ZW5qaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3poYW5namlhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3p1b2NpIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfZGlhb2NoYW4iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19odWF0dW8iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19kb25nemh1byI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3N1bmNlIjp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfbGllZGl4dWFuZGUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19nb25nc2hlbnl1ZXlpbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc190aWFuaG91a29uZ21pbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc195dWh1b3NoaXl1YW4iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19xaWFva3VpanVueWkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19qaWFyZW56aWRhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2R1YW55dXpob25nZGEiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19qdWVjaGVubWlhb2NhaSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX2ppbGVpYmFpaHUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc195dW5waW5ncWluZ2xvbmciOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19saW5namlheHVhbnd1Ijp7IndpbiI6MCwibG9zZSI6MH0sImJvc3NfY2hpeXV6aHVxdWUiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19mdWRpYmlhbiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJib3NzX3R1bnRpYW5jaGl3ZW4iOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19zaGlodW9zdWFubmkiOnsid2luIjowLCJsb3NlIjowfSwiYm9zc19saWVzaGl5YXppIjp7IndpbiI6MCwibG9zZSI6MH0sImRhcWluX3poYW5neWkiOnsid2luIjowLCJsb3NlIjowfSwiZGFxaW5femhhb2dhbyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkYXFpbl95aW5nemhlbmciOnsid2luIjowLCJsb3NlIjowfSwiZGFxaW5fc2hhbmd5YW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImRhcWluX251c2hvdSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJkYXFpbl9xaWJpbmciOnsid2luIjowLCJsb3NlIjowfSwiZGFxaW5fYnViaW5nIjp7IndpbiI6MCwibG9zZSI6MH0sImRhcWluX2JhaXFpIjp7IndpbiI6MCwibG9zZSI6MH0sImRhcWluX21peXVlIjp7IndpbiI6MCwibG9zZSI6MH0sImRhcWluX2x2YnV3ZWkiOnsid2luIjowLCJsb3NlIjowfSwiZGFxaW5femhhb2ppIjp7IndpbiI6MCwibG9zZSI6MH0sIm55aHpybGllbG9uZyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cueBq+m+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cuawtOm+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cumbt+m+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cuWcn+m+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cuacqOm+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cumjjum+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJueWh6cuWGsOm+mSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJtbnloenLnga3kuJbprZTmmJ9CT1NTIjp7IndpbiI6MCwibG9zZSI6MH0sIm55aHpy5bCP5YO15bC4Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pu55pONNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+abueaTjTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lj7jpqazmh783Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Y+46ams5oe/NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mDreWYiTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pg63lmIk0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df56iL5pixNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eoi+aYsTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nlITlp6w3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55SE5aesNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W8oOi+vTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lvKDovr00Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSP5L6v5oOHNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+Wkj+S+r+aDhzUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lvKDpg4M3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5byg6YODNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+a7oeWuoDciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mu6HlrqA0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6I2A5b2nNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iNgOW9pzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjpvpnnjos3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo6b6Z546LNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+Wkj+S+r+a4ijYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lpI/kvq/muIozIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pu55LuBNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+abueS7gTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nvornpZw2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df576K56WcMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iMg+WinjYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ojIPlop4zIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6I2A5pS4NiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iNgOaUuDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuqHogIXkuYvlv4M3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Lqh6ICF5LmL5b+DNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WcsOeLseS9v+iAhTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lnLDni7Hkvb/ogIU0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5ber5pyv5L2/6ICFNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W3q+acr+S9v+iAhTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lub3lhqXnm77ljas3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bm95Yal55u+5Y2rNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W5veWGpeWNqzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lub3lhqXljas0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr54KO6Zu35Y2rNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+eCjumbt+WNqzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lub3prLw3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr54Sw5L2/6ICFNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+eEsOS9v+iAhTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ng4jpm4DpqpE3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54OI6ZuA6aqRNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+i9u+mqqOW8kzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ovbvpqqjlvJM0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo55u+5Yy75biINyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOebvuWMu+W4iDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjngbXluIg3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo54G15biINCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOeBtemqkeWjqzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjngbXpqpHlo6s0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo5Yy754G1NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOWMu+eBtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjpvpk3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo6b6ZNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOm+memqkeWjqzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjpvpnpqpHlo6s0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aq36auF546LNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqt+mrheeOizQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/prLznjoTmraY3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yi655u+5YW1NiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WIuuebvuWFtTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lpKnpibTogIU2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSp6Ym06ICFMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WwuOWFtTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lsLjlhbUzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bC46a2UNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WwuOmtlDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mr5LmtrLpk4Hlo4E2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5q+S5ray6ZOB5aOBMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ihgOaxoOmVnDYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ooYDmsaDplZwzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KGA6a2UNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ihgOmtlDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLlt57ph43pqpE2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Z2S5bee6YeN6aqRMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOW8qTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjlvKkzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo5rOVNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOazlTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjnm77ljas2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo55u+5Y2rMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOefm+aJizYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqqjnn5vmiYszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6JuK5oOR5LmL55+zNSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ibiuaDkeS5i+efszIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ooYDmnqrljas1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KGA5p6q5Y2rMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ihgOmqkTUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ooYDpqpEyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZO+55CD5YW1NSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mTvueQg+WFtTIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLlt57lhbU1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Z2S5bee5YW1MiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mdkuW3nuaal+mqkTUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLlt57mmpfpqpEyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aqo6aqRNSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqqOmqkTIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lub3lhqXni7w0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bm95Yal54u8MSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mqt+mrheWFtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqrfpq4XlhbUxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5q+S6Zu+6Zi1NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+avkumbvumYtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuqHngbXor4XlkpI2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSN5rS75ZKSNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBreWGm+mtguWSkjQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lkajnkZw3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5ZCV6JKZNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WQleiSmTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lpKfkuZQ3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSn5LmUNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WtmeWwmummmTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lrZnlsJrpppk0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5a2Z562WNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WtmeetljQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lsI/kuZQ3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bCP5LmUNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eUmOWugTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nlJjlroE0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZmG6YCKNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mZhumAijQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pu4Tnm5Y3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6buE55uWNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+m7keibn+m+mTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuIHlpYk2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5LiB5aWJMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WRqOazsDYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lkajms7AzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSq5Y+y5oWINiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WkquWPsuaFiDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lvKDmmK02Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5byg5pitMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+acseayuzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mnLHmsrszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6bKB6IKDNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mygeiCgzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lkJXojIM2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5ZCV6IyDMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+avkua1t+ichzUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mr5LmtbfonIcyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aaW5pyv5biINyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+Wmluacr+W4iDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lrp3nn7PmtbfmmJ83Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5a6d55+z5rW35pifNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aOt+aWp+aJizciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mjrfmlqfmiYs0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pyx6ZuA6aqR5YW1NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+acsembgOmqkeWFtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mtbfliLrpvpk3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rW35Yi66b6ZNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+a4uOS+oDciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/muLjkvqA0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df546J56yb5LuZNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eOieesm+S7mTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLpvpk3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yaw5YmR5Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WGsOWJkeWNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/liLrlrqI2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yi65a6iMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WJkemxvOWNqzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/liZHpsbzljaszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aaZ5omL5Yy75biINiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WmmeaJi+WMu+W4iDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/moLzmjKHlsY82Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5qC85oyh5bGPMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+avkuWIgOWNqzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mr5LliIDljaszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5q+S6JufNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+avkuibnzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/msLTmm7zom4c2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rC05pu86JuHMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+awtOavkum+mTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/msLTmr5LpvpkzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rC06aqR5YW1NiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+awtOmqkeWFtTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mtbfliLrpsbw2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rW35Yi66bG8MyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eCvOiNr+W4iDYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ngrzoja/luIgzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55qH5a625rC05Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eah+WutuawtOWNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nmoflrrbpooToqIDluIg2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55qH5a626aKE6KiA5biIMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iNr+WwiuiAhTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/oja/lsIrogIUzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6JKZ5Yay6Ii5NiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iSmeWGsuiIuTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/muLjmlrnmnK/lo6s2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5ri45pa55pyv5aOrMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+makOWIgOWNqzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pmpDliIDljaszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Zy4546L6aqRNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mcuOeOi+mqkTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqazlvJPmiYs2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ams5byT5omLMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WMu+W4iDUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ljLvluIgyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5ZKS5pyv5aOrNSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WSkuacr+WjqzIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lpKnpm7fljas1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aSp6Zu35Y2rMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+a4uOaWuembt+WNqzUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/muLjmlrnpm7fljasyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr6Zu3NSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+mbtzIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pooToqIDluIg1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6aKE6KiA5biIMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+awtOefm+aJizQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/msLTnn5vmiYsxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rWq5Lq6NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+a1quS6ujEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mta7mnKjpkogxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KeC5pif6ICFNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+inguaYn+iAhTEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ov5HljavmsLTlhbUxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6L+R6Lqr5YW1MSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WFq+WNpumYtOmYs+mYtTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/msLTniaLpmLU3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rC054mi6Zi1NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eLgumbt+Wkqee9kTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ni4Lpm7flpKnnvZEzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bm76Zu+5q+S6Zi1NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WImOWkhzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/liJjlpIc0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5YWz5769NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W8oOmjnjciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lvKDpo540Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6LW15LqRNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mprOi2hTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqazotoU1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6buE5b+gNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+m7hOW/oDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/or7jokZvkuq43Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6K+46JGb5LquNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WnnOe7tDciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lp5znu7Q0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6a2P5bu2NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mtj+W7tjQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pu4TmnIjoi7E3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6buE5pyI6IuxNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WRqOS7kzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lkajku5MzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5byg6IueNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W8oOiLnjMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ms5XmraM2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rOV5q2jMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iSi+eQrDYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/okovnkKwzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5YWz5bmzNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WFs+W5szMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lup7nu582Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5bqe57ufMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WGsOe6ueixuTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhrDnurnosbk0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pan5aS05YW1NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aWp+WktOWFtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mtYHmtarliZHkvqA3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rWB5rWq5YmR5L6gNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mbque/vOiZjjciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm6rnv7zomY40Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6bm/5Y+35omLNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+m5v+WPt+aJizQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pvpnkuYvpk4HpqpE3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6b6Z5LmL6ZOB6aqRNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WFtei9pjYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhbXovaYzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yi655Sy55u+5Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WIuueUsuebvuWNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lt6jpub/op5LpmLU2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5beo6bm/6KeS6Zi1MyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WGsumYtei9pjYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhrLpmLXovaYzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55qH5a626Zu35Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eah+Wutumbt+WNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nqoHooq3pk4HpqpE2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df56qB6KKt6ZOB6aqRMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+e/vOeZveiZjjYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/nv7znmb3omY4zIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Iie5aiYNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iInuWomDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pg47kuK02Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6YOO5LitMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WMu+S+oDYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ljLvkvqAzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6YeN55Sy57K+6aqRNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mHjeeUsueyvumqkTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pk7bmnqrljas2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZO25p6q5Y2rMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mbqueLrjYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm6rni64zIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Zy56Zuz5Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mcuembs+WNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLlt57nm5/lhbU2Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Z2S5bee55uf5YW1MyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WuiOacm+WhlDUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lrojmnJvloZQyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pq06aOO6bmwNSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aatOmjjum5sDIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mnKjnm77lhbU1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pyo55u+5YW1MiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aequmqkeWFtTUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mnqrpqpHlhbUyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55qH5a625pyv5biINSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eah+Wutuacr+W4iDIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ol4/njZI1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6JeP542SMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ihgOWJkeWNqzUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ooYDliZHljasyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6L276aqR5YW1NSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+i9u+mqkeWFtTIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/plb/mnqrljas1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZW/5p6q5Y2rMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+S8j+WHu+WFtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kvI/lh7vlhbUxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5aaW5biINCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WmluW4iDEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mi5LpqazpmLXlnLAxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pqX5Zmo5omLNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aal+WZqOaJizEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lj7fop5LmiYs0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Y+36KeS5omLMSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+icgOWFtTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/onIDlhbUxIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5YiA6L2m5YW1NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WIgOi9puWFtTEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/msJHljas0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rCR5Y2rMSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+S4gOWtl+mVv+ibhzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuIDlrZfplb/om4czIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6L+36a2C6Zi1NSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+i/t+mtgumYtTIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhbXkuaY0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5YWr5Y2m5Zu+NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WNkeW8peWRvDciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ljZHlvKXlkbw0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5byg5Y2XNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+W8oOWNlzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuo7lkIk3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5LqO5ZCJNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iigeacrzYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/oooHmnK8zIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KKB57uNNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+iigee7jTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lt6jpvJPmiYs1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5beo6byT5omLMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ilv+WHiem5sOmqkTUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/opb/lh4npubDpqpEyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pyI5pyv5aOrNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aciOacr+WjqzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhrDngavprZTluIg3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yaw54Gr6a2U5biINCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WGsOezu+WSkuazlTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhrDns7vlkpLms5U0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr54KO5YW9NyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+eCjuWFvTMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ngavnhLDlhb3pqpE3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr54Sw5YW96aqRNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+e/vOeOhOibhzciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ngavnv7znjoTom4c0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rGf5rmW56We566XNyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+axn+a5luelnueulzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mjqfngavlvILlo6s3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5o6n54Gr5byC5aOrNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eDiOeEsOWHpOmqkTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ng4jnhLDlh6TpqpE0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Zyj5YW95pyx6ZuANyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+Wco+WFveacsembgDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/otbDovbIzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54yO6bmwNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eMjum5sDEiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lhrDpm4A1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Yaw6ZuAMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mbqueDiOeGijYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm6rng4jnhoozIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Y+M5aS054Gr6JuHNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WPjOWktOeBq+ibhzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm43lh4nlvJPpqpE3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZuN5YeJ5byT6aqRNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mbjeWHieaKleaJizYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm43lh4nmipXmiYszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr6b6Z5Y2rNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+m+meWNqzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/njI7mjZXogIU1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54yO5o2V6ICFMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+aApeWFiOmUizUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/mgKXlhYjplIsyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5oyr6aqo5Y2rMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+m7hOW3vuWmluW4iDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pqbHprZTpgZPkuroyIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KW/5YeJ6LCL5aOrMiI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ilv+WHieeLguaImDMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/opb/lh4nmipXmiYszIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6KW/5YeJ5YuH6ICFNSI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+ilv+WHieWLh+iAhTIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ph43miJ/lhbU0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5rGf5rmW5Y2m5biIMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WPjOiCoeWJkTYiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ngavnhLDor4A1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Z2S5ZuK5LmmNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+S4g+aYn+WIgDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pm7fnlLXnrKY0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5LuZ6bmkNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WHpOWHsOWPt+inkjQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ovbDlpKnpm7c0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5pWR5rK76I2v566xMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+mYlOWJkTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuIjlhavom4fnn5s0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gr54Sw5omHNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+e7reWRveeBrzQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ojYbmo5jpnq00Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5YCa5aSp5YmRNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+eBq+eEsOivgDIiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kvI/lhbXokKY1Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df5Y+k6Yyg5YiANyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WPpOmMoOWIgDQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/pnZLpvpnlgYPmnIjliIA3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6Z2S6b6Z5YGD5pyI5YiANCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+WNl+ibruaAquixoTciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ljZfom67mgKrosaE0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df55qE5Y2iNCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+e7neW9sTQiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/niKrpu4Tpo57nlLU3Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54iq6buE6aOe55S1NCI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+m5iueUu+W8kzMiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/kuInlsJbkuKTliIPliIAzIjp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6ZOB6ISK6JuH55+bMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+avgeeBreeDiOeEsDciOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/ova/pqqjmnK82Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df6L2v6aqo5pyvMyI6eyJ3aW4iOjAsImxvc2UiOjB9LCJrenNnX+Wco+WFiTUiOnsid2luIjowLCJsb3NlIjowfSwia3pzZ1/lnJ/pmpDmnYA0Ijp7IndpbiI6MCwibG9zZSI6MH0sImt6c2df54Gt57+85ZKSNiI6eyJ3aW4iOjAsImxvc2UiOjB9LCLmtYvor5XkurrniakiOnsid2luIjowLCJsb3NlIjowfX0sImFjYmpfM2RfbW9kZV9jb25maWdfa3pzZyI6ZmFsc2UsImFjaGlldmVtZW50Ijp7ImNvdXJzZSI6eyJjaHVjaHVtYW9sdSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImNodWNodW1hb2x1IjowfX0sImNodXNoaXNoZW5zaG91Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiY2h1Y2h1bWFvbHUiOjB9fSwieGlhb3NoaW5pdWRhbyI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImNodWNodW1hb2x1IjowfX0sInhpYW95b3VtaW5ncWkiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJjaHVjaHVtYW9sdSI6MH19LCJmZW5nbWFuZ2JpbHUiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJjaHVjaHVtYW9sdSI6MH19LCJjaHVjaGFuZ3NoZW5nZ3VvIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiY2h1Y2hhbmdzaGVuZ2d1byI6MH19LCJjaHVqaXNoYXNob3UiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJjaHVjaGFuZ3NoZW5nZ3VvIjowfX0sInpob25namlzaGFzaG91Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiY2h1Y2hhbmdzaGVuZ2d1byI6MH19LCJnYW9qaXNoYXNob3UiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJjaHVjaGFuZ3NoZW5nZ3VvIjowfX0sInF1YW56aGlzaGFzaG91Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiY2h1Y2hhbmdzaGVuZ2d1byI6MH19fSwid3UiOnsibmlhbnFpbmdkZXhpYW5qdW4iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJuaWFucWluZ2RleGlhbmp1biI6MH19LCJuaWFucWluZ3lvdXdlaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Im5pYW5xaW5neW91d2VpIjowfX0sImppbmZhbnlvdXhpYSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImppbmZhbnlvdXhpYSI6MH19LCJzaGVuY2h1Z3VpbW8iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJzaGVuY2h1Z3VpbW8iOjB9fSwicWluZ3NoZW53ZWlndW8iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJxaW5nc2hlbndlaWd1byI6MH19LCJ3dWppbmRlYmlhbnRhIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsid3VqaW5kZWJpYW50YSI6MH19LCJiYWl5aWR1amlhbmciOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJiYWl5aWR1amlhbmciOjB9fSwic2lqaWRhaWZhIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsic2lqaWRhaWZhIjowfX0sImppbmNoaXpoaWh1YSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImppbmNoaXpoaWh1YSI6MH19LCJ5aWh1YWppZW11Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsieWlodWFqaWVtdSI6MH19LCJnb25neWFvamkiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJnb25neWFvamkiOjB9fSwieWluaHVvZGVmdSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Inlpbmh1b2RlZnUiOjB9fSwiZGFkdWR1Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiZGFkdWR1IjowfX0sInd1amluZGV6aGVuZ3poYSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Ind1amluZGV6aGVuZ3poYSI6MH19LCJydXNoZW5neGlvbmdjYWkiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJydXNoZW5neGlvbmdjYWkiOjB9fSwibGlhbm1pYW5idWp1ZSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImxpYW5taWFuYnVqdWUiOjB9fX0sInNodSI6eyJsdWFuc2hpZGV4aWFveGlvbmciOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJsdWFuc2hpZGV4aWFveGlvbmciOjB9fSwiaml1amllemhpeGluIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiaml1amllemhpeGluIjowfX0sIndhbmZ1YnVkYW5nIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsid2FuZnVidWRhbmciOjB9fSwieWFucmVuZGVwYW94aWFvIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsieWFucmVuZGVwYW94aWFvIjowfX0sInlpcWlkYW5ncWlhbiI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7InlpcWlkYW5ncWlhbiI6MH19LCJxdWFuanVudHVqaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7InF1YW5qdW50dWppIjowfX0sIm1laXJhbmdvbmciOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJtZWlyYW5nb25nIjowfX0sInd1c2hlbmd4aWFubGluZyI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Ind1c2hlbmd4aWFubGluZyI6MH19LCJzaGFvbmlhbmppYW5nanVuIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsic2hhb25pYW5qaWFuZ2p1biI6MH19LCJodW5zaGVuc2hpZGFuIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiaHVuc2hlbnNoaWRhbiI6MH19LCJndWl5aW5kZWppZW52Ijp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiZ3VpeWluZGVqaWVudiI6MH19LCJqaW5uYW5nZGFpIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiamlubmFuZ2RhaSI6MH19LCJjaGltdWRlY2hlbmd4aWFuZyI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImNoaW11ZGVjaGVuZ3hpYW5nIjowfX0sImtvbmdjaGVuZ2p1ZWNoYW5nIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsia29uZ2NoZW5nanVlY2hhbmciOjB9fX0sIndlaSI6eyJ3ZWl3dWRpIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsid2Vpd3VkaSI6MH19LCJsdWFuc2hpZGVqaWFueGlvbmciOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJsdWFuc2hpZGVqaWFueGlvbmcxIjowLCJsdWFuc2hpZGVqaWFueGlvbmcyIjowfX0sInFpYW5qaWFuZ2p1biI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7InFpYW5qaWFuZ2p1biI6MH19LCJzaGVucWl3dWJlaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7InNoZW5xaXd1YmVpIjowfX0sImR1eWFuZGVsdW9jaGEiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJkdXlhbmRlbHVvY2hhIjowfX0sImxpYW5nYmFpanVzaGFuZyI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImxpYW5nYmFpanVzaGFuZyI6MH19LCJodWNoaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Imh1Y2hpIjowfX0sIm1hd29sZW5nIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsibWF3b2xlbmcxIjowLCJtYXdvbGVuZzIiOjB9fSwiemFvemhvbmdkZXhpYW56aGkiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJ6YW96aG9uZ2RleGlhbnpoaSI6MH19LCJidXlpeXVsaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImJ1eWl5dWxpIjowfX0sImxhbmdndXpoaWd1aSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImxhbmdndXpoaWd1aSI6MH19LCJzaG91eWFudG9uZ3RpYW4iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJzaG91eWFudG9uZ3RpYW4iOjB9fSwiYm94aW5nZGVtZWlyZW4iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJib3hpbmdkZW1laXJlbiI6MH19LCJsdW9zaGVuZnUiOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJsdW9zaGVuZnUiOjB9fX0sInF1biI6eyJ3dWRlaHVhc2hlbiI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Ind1ZGVodWFzaGVuIjowfX0sImZlaWppYW5nIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsiZmVpamlhbmciOjB9fSwianVlc2hpZGV3dWppIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsianVlc2hpZGV3dWppIjowfX0sInFpbmdndW9xaW5nY2hlbmciOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJxaW5nZ3VvcWluZ2NoZW5nIjowfX0sInNoZW55aSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7InNoZW55aSI6MH19LCJsdWFuc2hpbWluZ3lpIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsibHVhbnNoaW1pbmd5aSI6MH19LCJmZWl5YW5nYmFodSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7ImZlaXlhbmdiYWh1IjowfX0sInlhb3d1eWFuZ3dlaSI6eyJmaW5pc2hlZCI6ZmFsc2UsImZpbmlzaGVkX3RpbWVzIjp7Inlhb3d1eWFuZ3dlaSI6MH19LCJ5ZXhpbmppYW56ZW5nIjp7ImZpbmlzaGVkIjpmYWxzZSwiZmluaXNoZWRfdGltZXMiOnsieWV4aW5qaWFuemVuZyI6MH19LCJkZW5naml6aGl6dW4iOnsiZmluaXNoZWQiOmZhbHNlLCJmaW5pc2hlZF90aW1lcyI6eyJkZW5naml6aGl6dW4iOjB9fX19LCJhZGRpdGlvbmFsX3BsYXllcl9tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwiYWlfc3RyYXRlZ3lfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJhaV9zdHJhdGVneV8xIiwiYWx4X2Zoc3hfbW9kZV9jb25maWdfYW9sYVN0YXIiOmZhbHNlLCJhbHhfeHRfbW9kZV9jb25maWdfYW9sYVN0YXIiOnRydWUsImFseF94dGNkX21vZGVfY29uZmlnX2FvbGFTdGFyIjoiZ3MiLCJhbHhfeHRzel9tb2RlX2NvbmZpZ19hb2xhU3RhciI6Im1pZGRsZSIsImFvemhhbl9iZ21fbW9kZV9jb25maWdfZ3VvemhhbiI6InJld3JpdGUiLCJhb3poYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiYXNzZXRfYXVkaW8iOnRydWUsImFzc2V0X2Z1bGwiOnRydWUsImFzc2V0X2ltYWdlIjp0cnVlLCJhc3NldF9za2luIjp0cnVlLCJhc3NldF92ZXJzaW9uIjoidjEuOS45OC43LjEiLCJhdXRvX2NoZWNrX3VwZGF0ZSI6dHJ1ZSwiYXV0b19pZGVudGl0eV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6Im9mZiIsImF1dG9fbWFya19pZGVudGl0eV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6dHJ1ZSwiYXV0b19wb3BwZWRfaGlzdG9yeSI6ZmFsc2UsImF1dG9ib3JkZXJfY291bnQiOiJtaXgiLCJhdXRvYm9yZGVyX3N0YXJ0IjoiYnJvbnplIiwiYmFja2dyb3VuZF9tdXNpYyI6Im11c2ljX2RlZmF1bHQiLCJiYWl5aWR1amlhbmdfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImJhbl9pZGVudGl0eTJfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJvZmYiLCJiYW5faWRlbnRpdHkzX21vZGVfY29uZmlnX2lkZW50aXR5Ijoib2ZmIiwiYmFuX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5Ijoib2ZmIiwiYmF0dGxlX251bWJlcl9tb2RlX2NvbmZpZ19jaGVzcyI6MywiYmF0dGxlX251bWJlcl9tb2RlX2NvbmZpZ19zdG9uZSI6IjEiLCJiaW5namluZ2xpYW5nenVfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImJsdXJfdWkiOmZhbHNlLCJib3JkZXJfc3R5bGUiOiJkZWZhdWx0IiwiYm9zc19iYWltYW5nc2hpbGlhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiZGVuZ2FpIiwiamlhbmd3ZWkiLCJiaWFuZnVyZW4iLCJjYW9jYW8iLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImNhb3BpIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aW1hbyIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJndW9qaWEiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsInNpbWF5aSIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwieHVueXUiLCJ4dXpodSIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJ6aGFuZ2xpYW8iLCJ6aGVuamkiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJndWFueXUiLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd5dWV5aW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsImxpdWJlaSIsInNwX2xpdWJlaSIsIm1hY2hhbyIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsInJlX3l1YW5zaHUiLCJvbGRfeXVhbnNodSIsInJlX3l1YW5zaGFvIiwieWFud2VuIiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwibHZidSIsIm9sX2xpdXl1IiwibGlydSIsImxpcXVlZ3Vvc2kiLCJvbGRfbGluZ2p1Iiwia29uZ3JvbmciLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJ6aHVnZWxpYW5nIiwib2xkX3podWdlemhhbiIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJwYW5nZGUiLCJvbGRfemhhbmd4aW5nY2FpIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfbWFqdW4iLCJyZV9zdW5jZSIsInJlX2RpYW53ZWkiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJib3NzX2Jhbm5lZGNhcmRzIjpbIm11bml1Il0sImJvc3NfYmlmYW5nX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfY2Fpd2VuamlfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19jYW9jYW9fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19jaGl5YW5zaGlsaWFuX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfZGlhb2NoYW5fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19kb25nemh1b19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2VuYWJsZV9wbGF5cGFja2NvbmZpZyI6ZmFsc2UsImJvc3NfZW5hYmxlYWlfcGxheXBhY2tjb25maWciOmZhbHNlLCJib3NzX2d1b2ppYV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2h1YW5neXVleWluZ19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2h1YXR1b19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2h1bmR1bl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2xpdWJlaV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX2x2YnUxX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfbmlhbnNob3VfaGV0aV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3Bhbmd0b25nX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfcWluZ211c2hpbGlhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3Fpbmd1YW5nd2FuZ19ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3Fpb25ncWlfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc19zdW5jZV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3Rhb3RpZV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3Rhb3d1X2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfeGlhbmdsaXVfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc194dWFubGluc2hpbGlhbl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3lpbmd6aGFvX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfemhhbmdjaHVuaHVhX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3NfemhhbmdqaWFvX2Jvc3NfY29uZmlnX21vZGVfY29uZmlnX2Jvc3MiOnRydWUsImJvc3Nfemhhb3l1bl9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3poZW5qaV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3pob3V5dV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJib3NzX3podWdlbGlhbmdfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196aHVvZ3VpcXV4aWVfYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196aHV5YW5fYm9zc19jb25maWdfbW9kZV9jb25maWdfYm9zcyI6dHJ1ZSwiYm9zc196dW9jaV9ib3NzX2NvbmZpZ19tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJicm9rZW5GaWxlIjpbXSwiYnV0dG9uY2hhcmFjdGVyX3N0eWxlIjoiZGVmYXVsdCIsImNhcmRfc3R5bGUiOiJzaW1wbGUiLCJjYXJkYmFja19zdHlsZSI6Im9mZmljaWFsIiwiY2FyZHBpbGVfZW5hYmxlX3BsYXlwYWNrY29uZmlnIjpmYWxzZSwiY2FyZHBpbGVfZ3VvaGVfcGxheXBhY2tjb25maWciOiIwIiwiY2FyZHBpbGVfaHVvc2hhX3BsYXlwYWNrY29uZmlnIjoiMSIsImNhcmRwaWxlX2ppdV9wbGF5cGFja2NvbmZpZyI6IjAiLCJjYXJkcGlsZV9sZWlzaGFfcGxheXBhY2tjb25maWciOiIxIiwiY2FyZHBpbGVfbmFubWFuX3BsYXlwYWNrY29uZmlnIjoiMCIsImNhcmRwaWxlX3NoYV9wbGF5cGFja2NvbmZpZyI6IjEiLCJjYXJkcGlsZV9zaGFuX3BsYXlwYWNrY29uZmlnIjoiMSIsImNhcmRwaWxlX3NodW5zaG91X3BsYXlwYWNrY29uZmlnIjoiMCIsImNhcmRwaWxlX3Rhb19wbGF5cGFja2NvbmZpZyI6IjAiLCJjYXJkcGlsZV90aWVzdW9fcGxheXBhY2tjb25maWciOiIwIiwiY2FyZHBpbGVfd2Fuamlhbl9wbGF5cGFja2NvbmZpZyI6IjAiLCJjYXJkcGlsZV93dXhpZV9wbGF5cGFja2NvbmZpZyI6IjAuNSIsImNhcmRwaWxlbmFtZV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6IuW9k+WJjeeJjOWghiIsImNhcmRzIjpbInN0YW5kYXJkIiwiZXgiLCJleHRyYSIsImNsYXNzaWMiLCJiYXNpYyIsInpodWx1Il0sImNhcmRzaGFwZSI6Im9ibG9uZyIsImNhcmR0ZW1wbmFtZSI6ImRlZmF1bHQiLCJjYXJkdGV4dF9mb250IjoiZGVmYXVsdCIsImNoYW5nZVZpY2VUeXBlX21vZGVfY29uZmlnX2d1b3poYW4iOiJkZWZhdWx0IiwiY2hhbmdlX2NhcmRfbW9kZV9jb25maWdfZG91ZGl6aHUiOiJ1bmxpbWl0ZWQiLCJjaGFuZ2VfY2FyZF9tb2RlX2NvbmZpZ19ndW96aGFuIjoidW5saW1pdGVkIiwiY2hhbmdlX2NhcmRfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJ1bmxpbWl0ZWQiLCJjaGFuZ2VfY2FyZF9tb2RlX2NvbmZpZ19wYXJ0bmVyIjoiZGlzYWJsZWQiLCJjaGFuZ2VfY2FyZF9tb2RlX2NvbmZpZ193YW5nemhlemhpemhhbiI6ImRpc2FibGVkIiwiY2hhbmdlX2NhcmRfbW9kZV9jb25maWdfd2ptcyI6ImRpc2FibGVkIiwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjaGFuZ2VfY2hvaWNlX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImNoYW5nZV9jaG9pY2VfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNoYW5nZV9jaG9pY2VfbW9kZV9jb25maWdfcGFydG5lciI6dHJ1ZSwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ19zdG9uZSI6dHJ1ZSwiY2hhbmdlX2Nob2ljZV9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImNoYW5nZV9jaG9pY2VfbW9kZV9jb25maWdfd2FuZ3poZXpoaXpoYW4iOnRydWUsImNoYW5nZV9pZGVudGl0eV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiY2hhbmdlX2lkZW50aXR5X21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImNoYW5nZV9pZGVudGl0eV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6dHJ1ZSwiY2hhbmdlX2lkZW50aXR5X21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwiY2hhbmdlX3NraW4iOnRydWUsImNoYW5nZV9za2luX2F1dG8iOiIzMDAwMCIsImNoYXJhY3Rlcl9kaWFsb2dfdG9vbCI6IuacgOi/kSIsImNoYXJhY3RlcnMiOlsic3RhbmRhcmQiLCJzaGVuaHVhIiwic3AiLCJ5aWppYW5nIiwicmVmcmVzaCIsInhpbmdodW9saWFveXVhbiIsIm1vYmlsZSIsImV4dHJhIiwib2xkIl0sImNoZWNrX3ZlcnNpb24iOiIxLjkuOTguNy4xIiwiY2hlc3NfY2FyZF9tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwiY2hlc3NfY2hhcmFjdGVyX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJjaGVzc19sZWFkZXJfc2F2ZV9tb2RlX2NvbmZpZ19jaGVzcyI6InNhdmUxIiwiY2hlc3NfbW9kZV9tb2RlX2NvbmZpZ19jaGVzcyI6ImNvbWJhdCIsImNoZXNzX29ic3RhY2xlX21vZGVfY29uZmlnX2NoZXNzIjoiMC4yIiwiY2hlc3NzY3JvbGxfc3BlZWRfbW9kZV9jb25maWdfY2hlc3MiOiIyMCIsImNoZXNzc2Nyb2xsX3NwZWVkX21vZGVfY29uZmlnX3RhZmFuZyI6IjIwIiwiY2hvaWNlX2Zhbl9tb2RlX2NvbmZpZ19kb3VkaXpodSI6IjMiLCJjaG9pY2VfZmFuX21vZGVfY29uZmlnX2lkZW50aXR5IjoiNiIsImNob2ljZV9uZWlfbW9kZV9jb25maWdfaWRlbnRpdHkiOiIxMCIsImNob2ljZV9udW1fbW9kZV9jb25maWdfZ3VvemhhbiI6IjciLCJjaG9pY2VfbnVtYmVyX21vZGVfY29uZmlnX2NoZXNzIjo2LCJjaG9pY2VfemhvbmdfbW9kZV9jb25maWdfaWRlbnRpdHkiOiI4IiwiY2hvaWNlX3podV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6IjUiLCJjaG9pY2Vfemh1X21vZGVfY29uZmlnX2lkZW50aXR5IjoiNiIsImNob29zZUNoYXJhY3RlckxpbWl0X21vZGVfY29uZmlnX3BhcnRuZXIiOiJubyIsImNob29zZUNoYXJhY3Rlck51bWJlcl9tb2RlX2NvbmZpZ19wYXJ0bmVyIjozLCJjaG9vc2VDaGFyYWN0ZXJOdW1iZXJfbW9kZV9jb25maWdfd2FuZ3poZXpoaXpoYW4iOjQsImNob29zZUNoYXJhY3RlclByaW9yaXR5X21vZGVfY29uZmlnX3BhcnRuZXIiOiJyYW5kb20iLCJjaG9vc2VfZ3JvdXBfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNramNfbW9kZV9jb25maWdfa3pzZyI6dHJ1ZSwiY2xlYXJfbG9nIjpmYWxzZSwiY29pbiI6LTM2LCJjb2luX2NhbnZhc19wbGF5cGFja2NvbmZpZyI6ZmFsc2UsImNvaW5fZGlzcGxheV9wbGF5cGFja2NvbmZpZyI6InN5bWJvbCIsImNvaW5fZW5hYmxlX3BsYXlwYWNrY29uZmlnIjpmYWxzZSwiY29tcGF0aWJsZW1vZGUiOmZhbHNlLCJjb25maXJtX2V4aXQiOmZhbHNlLCJjb25uZWN0X2Fvemhhbl9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X2F2YXRhciI6ImJhb3Nhbm5pYW5nIiwiY29ubmVjdF9hdmF0YXJfbW9kZV9jb25maWdfY29ubmVjdCI6ImJhb3Nhbm5pYW5nIiwiY29ubmVjdF9jYXJkcyI6WyJzcCIsImd1b3poYW4iLCJodWFubGVrYXBhaSJdLCJjb25uZWN0X2NoYW5nZV9jYXJkX21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjb25uZWN0X2NoYW5nZV9jYXJkX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImNvbm5lY3RfY2hhbmdlX2NhcmRfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNvbm5lY3RfY2hhcmFjdGVycyI6WyJkaXkiLCJ0dyJdLCJjb25uZWN0X2Nob2ljZV9udW1fbW9kZV9jb25maWdfdmVyc3VzIjoiMjAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX2RvdWRpemh1IjoiMzAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX2d1b3poYW4iOiIzMCIsImNvbm5lY3RfY2hvb3NlX3RpbWVvdXRfbW9kZV9jb25maWdfaWRlbnRpdHkiOiIzMCIsImNvbm5lY3RfY2hvb3NlX3RpbWVvdXRfbW9kZV9jb25maWdfc2luZ2xlIjoiMzAiLCJjb25uZWN0X2Nob29zZV90aW1lb3V0X21vZGVfY29uZmlnX3ZlcnN1cyI6IjMwIiwiY29ubmVjdF9kb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2RvdWRpemh1IjpmYWxzZSwiY29ubmVjdF9kb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9kb3VibGVfbmVpX21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9kb3VkaXpodV9iYW5uZWQiOlsiY2FvY2FvIiwiZ3VvamlhIiwic2ltYXlpIiwiemhhbmdsaWFvIiwieHV6aHUiLCJ4aWFob3VkdW4iLCJ6aGVuamkiLCJndWFueXUiLCJodWFuZ3l1ZXlpbmciLCJsaXViZWkiLCJtYWNoYW8iLCJ6aGFuZ2ZlaSIsImRhcWlhbyIsInpodWdlbGlhbmciLCJ6aGFveXVuIiwiZ2FubmluZyIsImx1eHVuIiwiaHVhbmdnYWkiLCJsdm1lbmciLCJzdW5xdWFuIiwic3Vuc2hhbmd4aWFuZyIsInpob3V5dSIsImRpYW9jaGFuIiwiaHVhdHVvIiwibHZidSIsImh1YXhpb25nIiwicmVfeXVhbnNodSIsImdvbmdzdW56YW4iLCJyZV95dWppIiwic3BfemhhbmdqaWFvIiwieHVueXUiLCJwYW5ndG9uZyIsInNwX3podWdlbGlhbmciLCJ5YW53ZW4iLCJyZV95dWFuc2hhbyIsImNhb3BpIiwibWVuZ2h1byIsInN1bmppYW4iLCJ6aHVyb25nIiwiZG9uZ3podW8iLCJjYWl3ZW5qaSIsImppYW5nd2VpIiwiZGVuZ2FpIiwicmVfeXVqaW4iLCJvbGRfaHVheGlvbmciLCJoYW5iYSIsIm5pdWppbiIsImhhbnN1aSIsImhlamluIiwiYmlhbmZ1cmVuIiwiY3VpbWFvIiwiemFuZ2JhIiwiY2hlbmRvbmciLCJtaWZ1cmVuIiwic3BfZG9uZ3podW8iLCJsdmZhbiIsImppYW5nZmVpIiwiamlhbmdxaW5nIiwiamlsaW5nIiwia29uZ3JvbmciLCJsaXF1ZWd1b3NpIiwiemhhbmdyZW4iLCJ6b3VzaGkiLCJtYXRlbmciLCJ0aWFuZmVuZyIsImdhbmZ1cmVuIiwianNwX3poYW95dW4iLCJzcF9nYW5uaW5nIiwiaHVhbmdqaW5sZWlzaGkiLCJzcF9wYW5ndG9uZyIsInNwX2x2bWVuZyIsInNwX3poYW5nZmVpIiwic3BfZGFxaWFvIiwic3BfeGlhaG91c2hpIiwic3BfbGl1YmVpIiwic3BfeGlhaG91ZHVuIiwiY3VpeWFuIiwid2FuZ3l1biIsIm9sZF95dWFuc2h1Iiwib2xkX2J1bGlhbnNoaSIsImppa2FuZyIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJ4dWh1YW5nIiwid2VpeWFuIiwib2xkX2Nhb3JlbiIsInhpYW9xaWFvIiwib2xkX3pob3V0YWkiLCJodWFuZ3pob25nIiwieGlhaG91eXVhbiIsInBhbmdkZSIsInJlX3dlaXdlbnpodWdlemhpIiwicmVfeHVnb25nIiwiemhhbmdnb25nIiwib2xkX3l1YW5zaGFvIiwicmVfZGlhbndlaSIsInJlX3N1bmNlIiwib2xfbGl1c2hhbiIsInhpbl95dWFuc2hhbyIsInJlX2dhb3NodW4iLCJ3dWd1b3RhaSIsInh1c2hlbmciLCJ4aW5feGlhaG91ZHVuIiwic3Bfc2ltYXpoYW8iLCJzcF93YW5neXVhbmppIiwic3BfeGlueGlhbnlpbmciLCJzcF9saXV4aWUiLCJzcF9nb25nc3VuemFuIiwicmVfeGlhaG91eXVhbiIsImJhb3Nhbm5pYW5nIiwicmVfc3Bfemh1Z2VsaWFuZyIsInlsX3l1YW5zaHUiLCJ6aGFuZ3lpIiwiaGVxaSIsInJlX3Bhbmd0b25nIiwicmVfZ3VhbnFpdWppYW4iLCJvbF96aGFuZ2xpYW8iXSwiY29ubmVjdF9kb3VkaXpodV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJjb25uZWN0X2VuaGFuY2Vfemh1X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF9ndW96aGFuX2Jhbm5lZCI6WyJjYW9jYW8iLCJndW9qaWEiLCJzaW1heWkiLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsInhpYWhvdWR1biIsInpoZW5qaSIsImd1YW55dSIsImh1YW5neXVleWluZyIsImxpdWJlaSIsIm1hY2hhbyIsInpoYW5nZmVpIiwiZGFxaWFvIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJnYW5uaW5nIiwibHV4dW4iLCJodWFuZ2dhaSIsImx2bWVuZyIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwiemhvdXl1IiwiZGlhb2NoYW4iLCJodWF0dW8iLCJsdmJ1IiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwiZ29uZ3N1bnphbiIsInJlX3l1amkiLCJzcF96aGFuZ2ppYW8iLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJtZW5naHVvIiwic3VuamlhbiIsInpodXJvbmciLCJkb25nemh1byIsImNhaXdlbmppIiwiamlhbmd3ZWkiLCJkZW5nYWkiLCJyZV95dWppbiIsIm9sZF9odWF4aW9uZyIsImhhbmJhIiwibml1amluIiwiaGFuc3VpIiwiaGVqaW4iLCJiaWFuZnVyZW4iLCJjdWltYW8iLCJ6YW5nYmEiLCJjaGVuZG9uZyIsIm1pZnVyZW4iLCJzcF9kb25nemh1byIsImx2ZmFuIiwiamlhbmdmZWkiLCJqaWFuZ3FpbmciLCJqaWxpbmciLCJrb25ncm9uZyIsImxpcXVlZ3Vvc2kiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsIm1hdGVuZyIsInRpYW5mZW5nIiwiZ2FuZnVyZW4iLCJqc3Bfemhhb3l1biIsInNwX2dhbm5pbmciLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfbHZtZW5nIiwic3BfemhhbmdmZWkiLCJzcF9kYXFpYW8iLCJzcF94aWFob3VzaGkiLCJzcF9saXViZWkiLCJzcF94aWFob3VkdW4iLCJjdWl5YW4iLCJ3YW5neXVuIiwib2xkX3l1YW5zaHUiLCJvbGRfYnVsaWFuc2hpIiwiamlrYW5nIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInh1aHVhbmciLCJ3ZWl5YW4iLCJvbGRfY2FvcmVuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsImh1YW5nemhvbmciLCJ4aWFob3V5dWFuIiwicGFuZ2RlIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfeXVhbnNoYW8iLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiIsIm9sX3poYW5nbGlhbyJdLCJjb25uZWN0X2d1b3poYW5fYmFubmVkY2FyZHMiOlsiZGluZ2xhbnllbWluZ3podSIsInRhaXBpbmd5YW9zaHUiLCJsaXVsb25nY2FuamlhIiwiZmVpbG9uZ2R1b2ZlbmciXSwiY29ubmVjdF9ndW96aGFucGlsZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X2lkZW50aXR5X2Jhbm5lZCI6WyJjYW9jYW8iLCJzaW1heWkiLCJ4aWFob3VkdW4iLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsImd1b2ppYSIsInpoZW5qaSIsImxpdWJlaSIsImd1YW55dSIsInpoYW5nZmVpIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJtYWNoYW8iLCJodWFuZ3l1ZXlpbmciLCJzdW5xdWFuIiwiZ2FubmluZyIsImx2bWVuZyIsImh1YW5nZ2FpIiwiemhvdXl1IiwiZGFxaWFvIiwibHV4dW4iLCJzdW5zaGFuZ3hpYW5nIiwiaHVhdHVvIiwibHZidSIsImRpYW9jaGFuIiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwieHVueXUiLCJwYW5ndG9uZyIsInNwX3podWdlbGlhbmciLCJ5YW53ZW4iLCJyZV95dWFuc2hhbyIsImNhb3BpIiwibWVuZ2h1byIsInpodXJvbmciLCJzdW5qaWFuIiwiZG9uZ3podW8iLCJkZW5nYWkiLCJjYWl3ZW5qaSIsImppYW5nd2VpIiwicmVfeXVqaW4iLCJvbGRfaHVheGlvbmciLCJoYW5iYSIsImhlamluIiwiaGFuc3VpIiwibml1amluIiwibWlmdXJlbiIsIm1hdGVuZyIsInRpYW5mZW5nIiwiY2hlbmRvbmciLCJzcF9kb25nemh1byIsImppYW5nZmVpIiwiamlhbmdxaW5nIiwia29uZ3JvbmciLCJiaWFuZnVyZW4iLCJsaXF1ZWd1b3NpIiwibHZmYW4iLCJjdWltYW8iLCJqaWxpbmciLCJ6YW5nYmEiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsImdhbmZ1cmVuIiwic3BfeGlhaG91c2hpIiwianNwX3poYW95dW4iLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfZGFxaWFvIiwic3BfZ2FubmluZyIsInNwX3hpYWhvdWR1biIsInNwX2x2bWVuZyIsInNwX3poYW5nZmVpIiwic3BfbGl1YmVpIiwiY3VpeWFuIiwid2FuZ3l1biIsIm9sZF95dWFuc2h1Iiwib2xkX2J1bGlhbnNoaSIsImdvbmdzdW56YW4iLCJyZV95dWppIiwic3BfemhhbmdqaWFvIiwiamlrYW5nIiwiZGl5X3dlbnlhbmciLCJuc196dW9jaSIsIm5zX2x2emhpIiwibnNfd2FuZ3l1biIsIm5zX25hbmh1YSIsIm5zX25hbmh1YV9sZWZ0IiwibnNfbmFuaHVhX3JpZ2h0IiwibnNfaHVhbXVsYW4iLCJuc19odWFuZ3p1IiwibnNfamlua2UiLCJuc195YW5saWFuZyIsIm5zX3dlbmNob3UiLCJuc19jYW9jYW8iLCJuc19jYW9jYW9zcCIsIm5zX3podWdlbGlhbmciLCJuc193YW5neXVlIiwibnNfeXVqaSIsIm5zX3hpbnhpYW55aW5nIiwibnNfZ3Vhbmx1IiwibnNfc2ltYXpoYW8iLCJuc19zdW5qaWFuIiwibnNfZHVhbmd1aSIsIm5zX3poYW5nYmFvIiwibnNfbWFzdSIsIm5zX3poYW5neGl1IiwibnNfbHZtZW5nIiwibnNfc2hlbnBlaSIsIm5zX3l1amlzcCIsIm5zX3lhbmd5aSIsIm5zX2xpdXpoYW5nIiwibnNfeGlubmFuaHVhIiwiZGl5X2ZlaXNoaSIsImRpeV9saXV5YW4iLCJkaXlfeXVqaSIsImRpeV9jYWl3ZW5qaSIsImRpeV9sdWthbmciLCJkaXlfemhlbmppIiwiZGl5X2xpdWZ1IiwiZGl5X3hpemhlbnhpaG9uZyIsImRpeV9saXV6YW4iLCJkaXlfemFvemhpcmVuanVuIiwiZGl5X3lhbmd5aSIsImRpeV90aWFueXUiLCJrZXlfbHVjaWEiLCJrZXlfa3lvdXN1a2UiLCJrZXlfeXVyaSIsImtleV9oYXJ1a28iLCJrZXlfa2FnYXJpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInh1aHVhbmciLCJ3ZWl5YW4iLCJvbGRfY2FvcmVuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsImh1YW5nemhvbmciLCJ4aWFob3V5dWFuIiwicGFuZ2RlIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfeXVhbnNoYW8iLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiIsIm9sX3poYW5nbGlhbyJdLCJjb25uZWN0X2lkZW50aXR5X21vZGVfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJub3JtYWwiLCJjb25uZWN0X2luaXRzaG93X2RyYXdfbW9kZV9jb25maWdfZ3VvemhhbiI6Im1hcmsiLCJjb25uZWN0X2p1bnpodV9tb2RlX2NvbmZpZ19ndW96aGFuIjpmYWxzZSwiY29ubmVjdF9tb2RlIjoiaWRlbnRpdHkiLCJjb25uZWN0X25pY2tuYW1lIjoi5peg5ZCN546p5a62IiwiY29ubmVjdF9uaWNrbmFtZV9tb2RlX2NvbmZpZ19jb25uZWN0Ijoi5peg5ZCN546p5a62IiwiY29ubmVjdF9vYnNlcnZlX2hhbmRjYXJkX21vZGVfY29uZmlnX2RvdWRpemh1Ijp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29ubmVjdF9vYnNlcnZlX2hhbmRjYXJkX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfc2luZ2xlIjp0cnVlLCJjb25uZWN0X29ic2VydmVfaGFuZGNhcmRfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJjb25uZWN0X29ic2VydmVfbW9kZV9jb25maWdfZG91ZGl6aHUiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb25uZWN0X29ic2VydmVfbW9kZV9jb25maWdfaWRlbnRpdHkiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ19zaW5nbGUiOnRydWUsImNvbm5lY3Rfb2JzZXJ2ZV9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImNvbm5lY3Rfb25seWd1b3poYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29ubmVjdF9wbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2d1b3poYW4iOiI4IiwiY29ubmVjdF9wbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2lkZW50aXR5IjoiOCIsImNvbm5lY3RfcmVwbGFjZV9oYW5kY2FyZF9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImNvbm5lY3RfcmVwbGFjZV9udW1iZXJfbW9kZV9jb25maWdfdmVyc3VzIjoiMiIsImNvbm5lY3Rfc2luZ2xlX2Jhbm5lZCI6WyJjYW9jYW8iLCJndW9qaWEiLCJzaW1heWkiLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsInhpYWhvdWR1biIsInpoZW5qaSIsImd1YW55dSIsImh1YW5neXVleWluZyIsImxpdWJlaSIsIm1hY2hhbyIsInpoYW5nZmVpIiwiZGFxaWFvIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJnYW5uaW5nIiwibHV4dW4iLCJodWFuZ2dhaSIsImx2bWVuZyIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwiemhvdXl1IiwiZGlhb2NoYW4iLCJodWF0dW8iLCJsdmJ1IiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwiZ29uZ3N1bnphbiIsInJlX3l1amkiLCJzcF96aGFuZ2ppYW8iLCJ4dW55dSIsInBhbmd0b25nIiwic3Bfemh1Z2VsaWFuZyIsInlhbndlbiIsInJlX3l1YW5zaGFvIiwiY2FvcGkiLCJtZW5naHVvIiwic3VuamlhbiIsInpodXJvbmciLCJkb25nemh1byIsImNhaXdlbmppIiwiamlhbmd3ZWkiLCJkZW5nYWkiLCJyZV95dWppbiIsIm9sZF9odWF4aW9uZyIsImhhbmJhIiwibml1amluIiwiaGFuc3VpIiwiaGVqaW4iLCJiaWFuZnVyZW4iLCJjdWltYW8iLCJ6YW5nYmEiLCJjaGVuZG9uZyIsIm1pZnVyZW4iLCJzcF9kb25nemh1byIsImx2ZmFuIiwiamlhbmdmZWkiLCJqaWFuZ3FpbmciLCJqaWxpbmciLCJrb25ncm9uZyIsImxpcXVlZ3Vvc2kiLCJ6aGFuZ3JlbiIsInpvdXNoaSIsIm1hdGVuZyIsInRpYW5mZW5nIiwiZ2FuZnVyZW4iLCJqc3Bfemhhb3l1biIsInNwX2dhbm5pbmciLCJodWFuZ2ppbmxlaXNoaSIsInNwX3Bhbmd0b25nIiwic3BfbHZtZW5nIiwic3BfemhhbmdmZWkiLCJzcF9kYXFpYW8iLCJzcF94aWFob3VzaGkiLCJzcF9saXViZWkiLCJzcF94aWFob3VkdW4iLCJjdWl5YW4iLCJ3YW5neXVuIiwib2xkX3l1YW5zaHUiLCJvbGRfYnVsaWFuc2hpIiwiamlrYW5nIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInh1aHVhbmciLCJ3ZWl5YW4iLCJvbGRfY2FvcmVuIiwieGlhb3FpYW8iLCJvbGRfemhvdXRhaSIsImh1YW5nemhvbmciLCJ4aWFob3V5dWFuIiwicGFuZ2RlIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfeXVhbnNoYW8iLCJyZV9kaWFud2VpIiwicmVfc3VuY2UiLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2xpdXhpZSIsInNwX2dvbmdzdW56YW4iLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJyZV9zcF96aHVnZWxpYW5nIiwieWxfeXVhbnNodSIsInpoYW5neWkiLCJoZXFpIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiIsIm9sX3poYW5nbGlhbyJdLCJjb25uZWN0X3NpbmdsZV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJjb25uZWN0X3NpbmdsZV9tb2RlX21vZGVfY29uZmlnX3NpbmdsZSI6ImNoYW5nYmFuIiwiY29ubmVjdF9zcGVjaWFsX2lkZW50aXR5X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiY29ubmVjdF92ZXJzdXNfYmFubmVkIjpbImNhb2NhbyIsImd1b2ppYSIsInNpbWF5aSIsInpoYW5nbGlhbyIsInh1emh1IiwieGlhaG91ZHVuIiwiemhlbmppIiwiZ3Vhbnl1IiwiaHVhbmd5dWV5aW5nIiwibGl1YmVpIiwibWFjaGFvIiwiemhhbmdmZWkiLCJkYXFpYW8iLCJ6aHVnZWxpYW5nIiwiemhhb3l1biIsImdhbm5pbmciLCJsdXh1biIsImh1YW5nZ2FpIiwibHZtZW5nIiwic3VucXVhbiIsInN1bnNoYW5neGlhbmciLCJ6aG91eXUiLCJkaWFvY2hhbiIsImh1YXR1byIsImx2YnUiLCJodWF4aW9uZyIsInJlX3l1YW5zaHUiLCJnb25nc3VuemFuIiwicmVfeXVqaSIsInNwX3poYW5namlhbyIsInh1bnl1IiwicGFuZ3RvbmciLCJzcF96aHVnZWxpYW5nIiwieWFud2VuIiwicmVfeXVhbnNoYW8iLCJjYW9waSIsIm1lbmdodW8iLCJzdW5qaWFuIiwiemh1cm9uZyIsImRvbmd6aHVvIiwiY2Fpd2VuamkiLCJqaWFuZ3dlaSIsImRlbmdhaSIsInJlX3l1amluIiwib2xkX2h1YXhpb25nIiwiaGFuYmEiLCJuaXVqaW4iLCJoYW5zdWkiLCJoZWppbiIsImJpYW5mdXJlbiIsImN1aW1hbyIsInphbmdiYSIsImNoZW5kb25nIiwibWlmdXJlbiIsInNwX2Rvbmd6aHVvIiwibHZmYW4iLCJqaWFuZ2ZlaSIsImppYW5ncWluZyIsImppbGluZyIsImtvbmdyb25nIiwibGlxdWVndW9zaSIsInpoYW5ncmVuIiwiem91c2hpIiwibWF0ZW5nIiwidGlhbmZlbmciLCJnYW5mdXJlbiIsImpzcF96aGFveXVuIiwic3BfZ2FubmluZyIsImh1YW5namlubGVpc2hpIiwic3BfcGFuZ3RvbmciLCJzcF9sdm1lbmciLCJzcF96aGFuZ2ZlaSIsInNwX2RhcWlhbyIsInNwX3hpYWhvdXNoaSIsInNwX2xpdWJlaSIsInNwX3hpYWhvdWR1biIsImN1aXlhbiIsIndhbmd5dW4iLCJvbGRfeXVhbnNodSIsIm9sZF9idWxpYW5zaGkiLCJqaWthbmciLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwieHVodWFuZyIsIndlaXlhbiIsIm9sZF9jYW9yZW4iLCJ4aWFvcWlhbyIsIm9sZF96aG91dGFpIiwiaHVhbmd6aG9uZyIsInhpYWhvdXl1YW4iLCJwYW5nZGUiLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsInpoYW5nZ29uZyIsIm9sZF95dWFuc2hhbyIsInJlX2RpYW53ZWkiLCJyZV9zdW5jZSIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfbGl1eGllIiwic3BfZ29uZ3N1bnphbiIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsInJlX3NwX3podWdlbGlhbmciLCJ5bF95dWFuc2h1Iiwiemhhbmd5aSIsImhlcWkiLCJyZV9wYW5ndG9uZyIsInJlX2d1YW5xaXVqaWFuIiwib2xfemhhbmdsaWFvIl0sImNvbm5lY3RfdmVyc3VzX2Jhbm5lZGNhcmRzIjpbIm11bml1Il0sImNvbm5lY3RfdmVyc3VzX21vZGVfbW9kZV9jb25maWdfdmVyc3VzIjoiMnYyIiwiY29ubmVjdF92aWV3bmV4dF9tb2RlX2NvbmZpZ19ndW96aGFuIjpmYWxzZSwiY29ubmVjdF96aG9uZ19jYXJkX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb25uZWN0X3podWxpYW5fbW9kZV9jb25maWdfZ3VvemhhbiI6dHJ1ZSwiY29udGludWVfZ2FtZV9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiY29udGludWVfZ2FtZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJjb250aW51ZV9nYW1lX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJjb250cm9sX3N0eWxlIjoic2ltcGxlIiwiY3Vyc29yX3N0eWxlIjoiYXV0byIsImN1c3RvbUJhY2tncm91bmRQYWNrIjpbXSwiY3VzdG9tX2J1dHRvbiI6ZmFsc2UsImN1c3RvbV9idXR0b25fY29udHJvbF9ib3R0b20iOiIweCIsImN1c3RvbV9idXR0b25fY29udHJvbF90b3AiOiIweCIsImN1c3RvbV9idXR0b25fc3lzdGVtX2JvdHRvbSI6IjB4IiwiY3VzdG9tX2J1dHRvbl9zeXN0ZW1fdG9wIjoiMHgiLCJjdXN0b21jYXJkcGlsZSI6eyLlvZPliY3niYzloIYiOlt7InN0YW5kYXJkIjpbXSwiZXh0cmEiOltdLCJzcCI6WzgsOSwxMCwxMSwxMiwxMywxNF19LHsic3RhbmRhcmQiOltdLCJleHRyYSI6W10sInNwIjpbXX1dfSwiZGFvemhpeXVleWluZ19tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwiZGJ6el9tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwiZGV2Ijp0cnVlLCJkaWFsb2dfdHJhbnNmb3JtIjpbMCwwXSwiZGllX21vdmUiOiJtb3ZlIiwiZGllcmVzdGFydF9tb2RlX2NvbmZpZ19kb3VkaXpodSI6dHJ1ZSwiZGlmZmljdWx0eV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6Im5vcm1hbCIsImRvdWJsZV9jaGFyYWN0ZXJfamlhbmdlX21vZGVfY29uZmlnX3ZlcnN1cyI6ZmFsc2UsImRvdWJsZV9jaGFyYWN0ZXJfbW9kZV9jb25maWdfZG91ZGl6aHUiOmZhbHNlLCJkb3VibGVfY2hhcmFjdGVyX21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiZG91YmxlX2NoYXJhY3Rlcl9tb2RlX2NvbmZpZ19zdG9uZSI6ZmFsc2UsImRvdWJsZV9ocF9tb2RlX2NvbmZpZ19kb3VkaXpodSI6InBpbmdqdW4iLCJkb3VibGVfaHBfbW9kZV9jb25maWdfZ3VvemhhbiI6InBpbmdqdW4iLCJkb3VibGVfaHBfbW9kZV9jb25maWdfaWRlbnRpdHkiOiJwaW5nanVuIiwiZG91YmxlX25laV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6ZmFsc2UsImRvdWRpemh1X2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiY2FvY2FvIiwic2ltYXlpIiwieGlhaG91ZHVuIiwiemhhbmdsaWFvIiwieHV6aHUiLCJndW9qaWEiLCJ6aGVuamkiLCJsaXViZWkiLCJndWFueXUiLCJ6aGFuZ2ZlaSIsInpodWdlbGlhbmciLCJ6aGFveXVuIiwibWFjaGFvIiwiaHVhbmd5dWV5aW5nIiwic3VucXVhbiIsImdhbm5pbmciLCJsdm1lbmciLCJodWFuZ2dhaSIsInpob3V5dSIsImRhcWlhbyIsImx1eHVuIiwic3Vuc2hhbmd4aWFuZyIsImh1YXR1byIsImx2YnUiLCJkaWFvY2hhbiIsImh1YXhpb25nIiwicmVfeXVhbnNodSIsInh1bnl1IiwicGFuZ3RvbmciLCJzcF96aHVnZWxpYW5nIiwieWFud2VuIiwicmVfeXVhbnNoYW8iLCJjYW9waSIsInpodXJvbmciLCJzdW5qaWFuIiwiZG9uZ3podW8iLCJkZW5nYWkiLCJqaWFuZ3dlaSIsImJpYW5mdXJlbiIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW9jaHVuIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aW1hbyIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwicmVfeXVqaW4iLCJ4aW5feXVqaW4iLCJ5dWppbiIsInphbmdiYSIsIm9sZF96aG9uZ2h1aSIsImZhemhlbmciLCJnYW5mdXJlbiIsIm9sZF9ndWFuemhhbmciLCJodWFuZ3pob25nIiwiamlhbmdmZWkiLCJvbF9saWFvaHVhIiwic3BfbGl1YmVpIiwib2xkX21hZGFpIiwib2xkX21hbGlhbmciLCJtYXN1Iiwiem91c2hpIiwianNwX3poYW95dW4iLCJ6aGFuZ3JlbiIsIm9sX3poYW5ncmFuZyIsInpoYW5nbGlhbmciLCJ6aGFuZ2ppYW8iLCJ5dWppIiwib2xkX3l1YW5zaHUiLCJ3YW5neXVuIiwidGlhbmZlbmciLCJzcF9wYW5ndG9uZyIsIm1hdGVuZyIsIm9sZF9tYWNoYW8iLCJvbF9saXV5dSIsImxpcnUiLCJsaXF1ZWd1b3NpIiwib2xkX2xpbmdqdSIsImtvbmdyb25nIiwibWlmdXJlbiIsIndlaXlhbiIsIm9sX3d1eWkiLCJzcF94aWFob3VzaGkiLCJ4dXNodSIsInNwX3poYW5nZmVpIiwib2xkX2J1bGlhbnNoaSIsImNoZW5kb25nIiwic3BfZGFxaWFvIiwiamlhbmdxaW5nIiwib2xkX2xpbmd0b25nIiwibHZmYW4iLCJzcF9sdm1lbmciLCJvbGRfcXVhbmNvbmciLCJ4aWFvcWlhbyIsIm9sZF94dXNoZW5nIiwib2xkX3pob3V0YWkiLCJvbGRfemh1aHVhbiIsIm9sX3podXJhbiIsIm9sZF96aHVyYW4iLCJvbGRfemh1emhpIiwiY2Fpd2VuamkiLCJzcF9kb25nemh1byIsIm9sZF9mdWh1YW5naG91Iiwic3BfZ2FubmluZyIsImhhbmJhIiwiaGFuc3VpIiwiaGVqaW4iLCJodWFuZ2ppbmxlaXNoaSIsIm9sZF9odWF4aW9uZyIsImppbGluZyIsIm9sZF96aHVnZXpoYW4iLCJzcF96aGFuZ2ppYW8iLCJyZV95dWppIiwienVvY2kiLCJsaXVzaGFuIiwic3VuY2UiLCJ6aGFuZ3poYW5nIiwicGFuZ2RlIiwib2xkX3poYW5neGluZ2NhaSIsInJlX3dlaXdlbnpodWdlemhpIiwicmVfeHVnb25nIiwiemhhbmdnb25nIiwib2xkX21hanVuIiwicmVfc3VuY2UiLCJyZV9kaWFud2VpIiwib2xkX3l1YW5zaGFvIiwib2xkX2d1YW5xaXVqaWFuIiwib2xkX2h1YW5nZnVzb25nIiwib2xfbGl1c2hhbiIsInhpbl95dWFuc2hhbyIsInJlX3poYW5nZmVpIiwib2xfbWFsaWFuZyIsInJlX2dhb3NodW4iLCJ3dWd1b3RhaSIsInh1c2hlbmciLCJ4aW5feGlhaG91ZHVuIiwic3Bfc2ltYXpoYW8iLCJzcF93YW5neXVhbmppIiwic3BfeGlueGlhbnlpbmciLCJzcF9nb25nc3VuemFuIiwic3BfbGl1eGllIiwicmVfeGlhaG91eXVhbiIsImJhb3Nhbm5pYW5nIiwib2xfZ3VhbnN1byIsInJlX3NwX3podWdlbGlhbmciLCJ6aGFuZ3lpIiwiaGVxaSIsIm9sX3poYW5nbGlhbyIsInJlX3Bhbmd0b25nIiwicmVfZ3VhbnFpdWppYW4iXSwiZG91ZGl6aHVfYmFubmVkY2FyZHMiOlsibXVuaXUiXSwiZHJrel9tb2RlX2NvbmZpZ193YW5nemhlemhpemhhbiI6ZmFsc2UsImR1emhhbnNhbmd1b19tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwiZW5hYmxlX2FsbF9jYXJkc19mb3VyX21vZGVfY29uZmlnX3ZlcnN1cyI6ZmFsc2UsImVuYWJsZV9hbGxfY2FyZHNfbW9kZV9jb25maWdfdmVyc3VzIjpmYWxzZSwiZW5hYmxlX2FsbF9tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJlbmFibGVfYWxsX3RocmVlX21vZGVfY29uZmlnX3ZlcnN1cyI6ZmFsc2UsImVuYWJsZV9kcmFnbGluZSI6dHJ1ZSwiZW5hYmxlX3RvdWNoZHJhZ2xpbmUiOmZhbHNlLCJlbmFibGVfdmlicmF0ZSI6ZmFsc2UsImVuaGFuY2Vfemh1X21vZGVfY29uZmlnX2lkZW50aXR5IjpmYWxzZSwiZXF1aXBfYXVkaW8iOmZhbHNlLCJlcnJzdG9wIjpmYWxzZSwiZXhwYW5kX2RpYWxvZ19tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJleHRlbnNpb25Nb2RlIjp7IuaJqeWxlW9sIjp7Im1vZGUiOlsicGFydG5lciIsImt6c2ciXX19LCJleHRlbnNpb25fRkdPX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl9ib3NzX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX2NhcmRwaWxlX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX2NvaW5fZW5hYmxlIjp0cnVlLCJleHRlbnNpb25fd3V4aW5nX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX+S4h+S4luelnuWFvV9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5Lmx5LiW5L2z5Lq6X2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/kubHmrabmtLvliqjlnLpfZW5hYmxlIjp0cnVlLCJleHRlbnNpb25f5Y2B5LqM55Sf6IKWX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/ljYHlkajlubRVSV9hdXRob3IiOmZhbHNlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfYm9yZGVyTGV2ZWwiOiJmaXZlIiwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2NhbXBJZGVudGl0eUltYWdlTW9kZSI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2NhcmRSZXBsYWNlIjp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfY2FyZFNlY29uZGFyeU5hbWVWaXNpYmxlIjp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfY2FyZFVzZUVmZmVjdCI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2VydWRhIjpmYWxzZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX2dhaW5Ta2lsbHNWaXNpYmxlIjoib24iLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfZ2FtZVN0YXJ0RWZmZWN0Ijp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfaW50cm8iOnRydWUsImV4dGVuc2lvbl/ljYHlkajlubRVSV9vdXRjcm9wU2tpbiI6ZmFsc2UsImV4dGVuc2lvbl/ljYHlkajlubRVSV9wbGF5ZXJEaWVFZmZlY3QiOnRydWUsImV4dGVuc2lvbl/ljYHlkajlubRVSV9wbGF5ZXJLaWxsRWZmZWN0Ijp0cnVlLCJleHRlbnNpb25f5Y2B5ZGo5bm0VUlfcGxheWVyTGluZUVmZmVjdCI6dHJ1ZSwiZXh0ZW5zaW9uX+WNgeWRqOW5tFVJX3NraWxsTWFya0NvbG9yIjoieWVsbG93IiwiZXh0ZW5zaW9uX+WNleWwhuiDnOeOh+mAiemhuV9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5ZCI57q15oqX56emX2F1dGhvciI6ZmFsc2UsImV4dGVuc2lvbl/lkIjnurXmipfnp6ZfZW5hYmxlIjp0cnVlLCJleHRlbnNpb25f5ZCI57q15oqX56emX2V4cGFuZF9jaGFyYWN0ZXIiOmZhbHNlLCJleHRlbnNpb25f5ZCI57q15oqX56emX2thbmdxaW5fZ3JvdXAiOiJ3ZWkiLCJleHRlbnNpb25f5ZCI57q15oqX56emX2thbmdxaW5fbGV2ZWwiOiI1IiwiZXh0ZW5zaW9uX+WQiOe6teaKl+enpl9rYW5ncWluX3BsYXllciI6ImRhcWluX2ZlbWFsZTMiLCJleHRlbnNpb25f5ZCI57q15oqX56emX3ZlcnNpb24iOiIxLjAiLCJleHRlbnNpb25f5ZCI57q15oqX56emX3ZlcnRpY2FsX2lkIjpmYWxzZSwiZXh0ZW5zaW9uX+WfuuacrOS4u+S7o+eggV9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5aGU572X54mMX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/lo6vlhbVfZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+WkqeawlOezu+e7n19lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5aWI5L2V6Iqx6JC9X2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/lpaXmi4nCt+mVnOWDj19lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5a6aX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/lr7zlhaXliqnmiYtfZW5hYmxlIjp0cnVlLCJleHRlbnNpb25f5biM6IWK56We6K+dX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/mj5DnpLrvvIhnYW1lLnNheeWHveaVsO+8iV9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5pawc3BfZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+aWsOiLsemtguS5i+WIg19lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5peg5Y+M5p2AX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/ml6foi7HprYLkuYvliINfZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+aYjuaXpeaWueiIn19lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5p2C6aG5X2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/mn6XnnIvliqDovb3lhoXlrrlfZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+atpuWwhuWMhea1j+iniF9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f5q2m5bCG5pCc57SiX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/nibnmlYjmtYvor5VfZW5hYmxlIjp0cnVlLCJleHRlbnNpb25f54m55pWI5rWL6K+VX3R4Y3NfYmwiOnRydWUsImV4dGVuc2lvbl/nibnmlYjmtYvor5VfdHhjc19ieiI6ZmFsc2UsImV4dGVuc2lvbl/nibnmlYjmtYvor5VfdHhjc19mdW5jIjoibm9uZSIsImV4dGVuc2lvbl/nibnmlYjmtYvor5VfdHhjc19oaGtzIjp0cnVlLCJleHRlbnNpb25f54m55pWI5rWL6K+VX3R4Y3NfbGIiOnRydWUsImV4dGVuc2lvbl/nibnmlYjmtYvor5VfdHhjc19wZCI6dHJ1ZSwiZXh0ZW5zaW9uX+eJueaViOa1i+ivlV90eGNzX3BlaXlpbjEiOmZhbHNlLCJleHRlbnNpb25f54m55pWI5rWL6K+VX3R4Y3NfcGVpeWluMiI6dHJ1ZSwiZXh0ZW5zaW9uX+eJueaViOa1i+ivlV90eGNzX3NkIjp0cnVlLCJleHRlbnNpb25f54m55pWI5rWL6K+VX3R4Y3NfemxzcCI6ImF1dG8iLCJleHRlbnNpb25f55WM6Z2i57yp5pS+X2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/nmb7pl7vniYxfZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+iBiuWkqeihqOaDhV9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f6IGU5py65qih5byPX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/ogZTnvZHlip/og71fZW5hYmxlIjpmYWxzZSwiZXh0ZW5zaW9uX+iJvumcsui/ql9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f6Iux6a2C5LmL5YiD6IGU5py6X2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbl/okIzmiJhjb21wZXRpdGlvbl9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f6JyA5rGJ5Lit5YW0X2VuYWJsZSI6dHJ1ZSwiZXh0ZW5zaW9uX+icgOaxieS4reWFtF9za2luIjpmYWxzZSwiZXh0ZW5zaW9uX+mYtOmYs+adgF9lbmFibGUiOmZhbHNlLCJleHRlbnNpb25f6Zu36YeR6Zi05rSq55+z5LmQX2VuYWJsZSI6ZmFsc2UsImV4dGVuc2lvbnMiOlsi5ZCI57q15oqX56emIiwi5Y2B5ZGo5bm0VUkiLCLlr7zlhaXliqnmiYsiXSwiZmRsb2dfbW9kZV9jb25maWdfYW9sYVN0YXIiOmZhbHNlLCJmaWx0ZXJub2RlX2J1dHRvbiI6dHJ1ZSwiZmluaXNoX3Rhc2siOnt9LCJmaXJzdF9sZXNzX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJmaXJzdF9sZXNzX21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwiZm9sZF9jYXJkIjp0cnVlLCJmb2xkX21vZGUiOmZhbHNlLCJmb3JiaWRhaV91c2VyIjpbImdvbmdzdW56YW4iLCJzaGVuX2Nhb2NhbyIsInNoZW5fZ2FubmluZyIsInNoZW5fZ3Vhbnl1Iiwic2hlbl9saXViZWkiLCJzaGVuX2x1eHVuIiwic2hlbl9sdmJ1Iiwic2hlbl9sdm1lbmciLCJzaGVuX3NpbWF5aSIsInNoZW5femhhbmdsaWFvIiwic2hlbl96aGFveXVuIiwic2hlbl96aG91eXUiLCJzaGVuX3podWdlbGlhbmciLCJqaWFuZ3dlaSIsImJpYW5mdXJlbiIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW9jaHVuIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwieHV6aHUiLCJyZV95dWppbiIsInhpbl95dWppbiIsInl1amluIiwiemFuZ2JhIiwiemhhbmdsaWFvIiwiemhlbmppIiwib2xkX3pob25naHVpIiwiZmF6aGVuZyIsImdhbmZ1cmVuIiwiZ3Vhbnl1Iiwib2xkX2d1YW56aGFuZyIsImh1YW5neXVleWluZyIsImh1YW5nemhvbmciLCJqaWFuZ2ZlaSIsIm9sX2xpYW9odWEiLCJsaXViZWkiLCJzcF9saXViZWkiLCJtYWNoYW8iLCJvbGRfbWFkYWkiLCJvbGRfbWFsaWFuZyIsIm1hc3UiLCJ6b3VzaGkiLCJqc3Bfemhhb3l1biIsInpoYW5ncmVuIiwib2xfemhhbmdyYW5nIiwiemhhbmdsaWFuZyIsInpoYW5namlhbyIsInl1amkiLCJyZV95dWFuc2h1Iiwib2xkX3l1YW5zaHUiLCJyZV95dWFuc2hhbyIsInlhbndlbiIsIndhbmd5dW4iLCJ0aWFuZmVuZyIsInNwX3Bhbmd0b25nIiwibWF0ZW5nIiwib2xkX21hY2hhbyIsImx2YnUiLCJvbF9saXV5dSIsImxpcnUiLCJsaXF1ZWd1b3NpIiwib2xkX2xpbmdqdSIsImNhb2NhbyIsImNhb3BpIiwiY3VpbWFvIiwiZGVuZ2FpIiwiZ3VvamlhIiwic2ltYXlpIiwieGlhaG91ZHVuIiwieHVueXUiLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJrb25ncm9uZyIsInpodWdlbGlhbmciLCJvbGRfemh1Z2V6aGFuIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInBhbmdkZSIsIm9sZF96aGFuZ3hpbmdjYWkiLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsInpoYW5nZ29uZyIsIm9sZF9tYWp1biIsInJlX3N1bmNlIiwicmVfZGlhbndlaSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV96aGFuZ2ZlaSIsIm9sX21hbGlhbmciLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfZ29uZ3N1bnphbiIsInNwX2xpdXhpZSIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsIm9sX2d1YW5zdW8iLCJyZV9zcF96aHVnZWxpYW5nIiwiemhhbmd5aSIsImhlcWkiLCJvbF96aGFuZ2xpYW8iLCJyZV9wYW5ndG9uZyIsInJlX2d1YW5xaXVqaWFuIl0sImZvdXJfYXNzaWduX21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwiZm91cl9waGFzZXN3YXBfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJmb3VyYWxpZ25fbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ19jaGVzcyI6dHJ1ZSwiZnJlZV9jaG9vc2VfbW9kZV9jb25maWdfZG91ZGl6aHUiOnRydWUsImZyZWVfY2hvb3NlX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImZyZWVfY2hvb3NlX21vZGVfY29uZmlnX2lkZW50aXR5Ijp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ19wYXJ0bmVyIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ19zdG9uZSI6dHJ1ZSwiZnJlZV9jaG9vc2VfbW9kZV9jb25maWdfdmVyc3VzIjp0cnVlLCJmcmVlX2Nob29zZV9tb2RlX2NvbmZpZ193YW5nemhlemhpemhhbiI6dHJ1ZSwiZ2FtZU1lSGFzUGxheWVyMSI6ImxqeWhzbF9seWJfaHVhbmdoYW8iLCJnYW1lTWVIYXNQbGF5ZXJBIjp0cnVlLCJnYW1lTWVIYXNQbGF5ZXJIcDEiOjMsImdhbWVSZWNvcmQiOnsiaWRlbnRpdHkiOnsiZGF0YSI6eyJuZWkiOlsxLDBdLCJ6aG9uZyI6WzEsMF19LCJzdHIiOiLlv6Doh6PvvJox6IOcIDDotJ88YnI+5YaF5aW477yaMeiDnCAw6LSfPGJyPiJ9LCJndW96aGFuIjp7ImRhdGEiOnt9fSwidmVyc3VzIjp7ImRhdGEiOnsi5Lq6IjpbMSwwXX0sInN0ciI6IiJ9LCJjb25uZWN0Ijp7ImRhdGEiOnt9fSwiYm9zcyI6eyJkYXRhIjp7fX0sImJyYXdsIjp7ImRhdGEiOnt9fSwiZG91ZGl6aHUiOnsiZGF0YSI6e319LCJzaW5nbGUiOnsiZGF0YSI6e319fSwiZ2FtZV9zcGVlZCI6Im1pZCIsImdjbXNfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImdrX251bV9tb2RlX2NvbmZpZ193am1zIjozLCJnbGFzc191aSI6ZmFsc2UsImdsb2JhbF9mb250IjoiZGVmYXVsdCIsImdsb3dfcGhhc2UiOiJwdXJwbGUiLCJndW96aGFuU2tpbl9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJndW96aGFuX2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiamlhbmd3ZWkiLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImpzcF9jYW9yZW4iLCJvbGRfY2FvcmVuIiwib2xkX2Nhb3hpdSIsIm9sZF9jYW96aGVuIiwib2xkX2NoZW5xdW4iLCJjdWl5YW4iLCJvbF9ndW9odWFpIiwib2xfbWFuY2hvbmciLCJuaXVqaW4iLCJvbGRfd2FuZ3lpIiwic3BfeGlhaG91ZHVuIiwieGlhaG91eXVhbiIsIm9sX3hpbnhpYW55aW5nIiwieHVodWFuZyIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJ6aGFuZ2xpYW8iLCJ6aGVuamkiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJndWFueXUiLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd5dWV5aW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsImxpdWJlaSIsInNwX2xpdWJlaSIsIm1hY2hhbyIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsInJlX3l1YW5zaHUiLCJvbGRfeXVhbnNodSIsInJlX3l1YW5zaGFvIiwieWFud2VuIiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwibHZidSIsIm9sX2xpdXl1IiwibGlydSIsImxpcXVlZ3Vvc2kiLCJvbGRfbGluZ2p1Iiwia29uZ3JvbmciLCJiaWFuZnVyZW4iLCJjYW9jYW8iLCJjYW9waSIsImN1aW1hbyIsImRlbmdhaSIsImd1b2ppYSIsInNpbWF5aSIsInhpYWhvdWR1biIsInh1bnl1IiwieHV6aHUiLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJ6aHVnZWxpYW5nIiwib2xkX3podWdlemhhbiIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJwYW5nZGUiLCJvbGRfemhhbmd4aW5nY2FpIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfbWFqdW4iLCJyZV9zdW5jZSIsInJlX2RpYW53ZWkiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJndW96aGFuX2Jhbm5lZGNhcmRzIjpbXSwiZ3Vvemhhbl9tb2RlX21vZGVfY29uZmlnX2d1b3poYW4iOiJub3JtYWwiLCJndW96aGFucGlsZV9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCJoYWxsX2J1dHRvbl9tb2RlX2NvbmZpZ19jb25uZWN0IjpmYWxzZSwiaGFsbF9pcF9tb2RlX2NvbmZpZ19jb25uZWN0IjoiNDcuMTAwLjE2Mi41MiIsImhpZGRlbkJhY2tncm91bmRQYWNrIjpbXSwiaGlkZGVuQ2FyZFBhY2siOlsiemhlbmZhIiwieXVuY2hvdSIsInN3ZCIsImd1amlhbiIsImhlYXJ0aCIsImd3ZW50IiwibXRnIiwiaHVhbmxla2FwYWkiXSwiaGlkZGVuQ2hhcmFjdGVyUGFjayI6W10sImhpZGRlbk1vZGVQYWNrIjpbInN0b25lIiwidGFmYW5nIiwiY2hlc3MiXSwiaGlkZGVuUGxheVBhY2siOlsid3V4aW5nIl0sImhpZGVfY2FyZF9pbWFnZSI6ZmFsc2UsImhpZGVfY2FyZF9wcm9tcHRfYmFzaWMiOmZhbHNlLCJoaWRlX2NhcmRfcHJvbXB0X2VxdWlwIjpmYWxzZSwiaG92ZXJhdGlvbiI6IjcwMCIsImhwX3N0eWxlIjoiZ2xhc3MiLCJodWFuaHVhemhpemhhbl9tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwiaWRlbnRpdHlfYmFubmVkIjpbImdvbmdzdW56YW4iLCJjYW9jYW8iLCJ4aWFob3VkdW4iLCJ6aGFuZ2xpYW8iLCJ4dXpodSIsImd1b2ppYSIsInpoZW5qaSIsImxpdWJlaSIsImd1YW55dSIsInpoYW5nZmVpIiwiemh1Z2VsaWFuZyIsInpoYW95dW4iLCJtYWNoYW8iLCJodWFuZ3l1ZXlpbmciLCJzdW5xdWFuIiwiZ2FubmluZyIsImx2bWVuZyIsImh1YW5nZ2FpIiwiemhvdXl1IiwiZGFxaWFvIiwibHV4dW4iLCJzdW5zaGFuZ3hpYW5nIiwiaHVhdHVvIiwibHZidSIsImRpYW9jaGFuIiwiaHVheGlvbmciLCJyZV95dWFuc2h1IiwieHVueXUiLCJwYW5ndG9uZyIsInNwX3podWdlbGlhbmciLCJ5YW53ZW4iLCJyZV95dWFuc2hhbyIsImNhb3BpIiwiemh1cm9uZyIsInN1bmppYW4iLCJkb25nemh1byIsImRlbmdhaSIsImppYW5nd2VpIiwiY2Fpd2VuamkiLCJyZV95dWppbiIsImhhbmJhIiwiaGVqaW4iLCJoYW5zdWkiLCJuaXVqaW4iLCJtaWZ1cmVuIiwibWF0ZW5nIiwidGlhbmZlbmciLCJjaGVuZG9uZyIsInNwX2Rvbmd6aHVvIiwiamlhbmdmZWkiLCJqaWFuZ3FpbmciLCJrb25ncm9uZyIsImJpYW5mdXJlbiIsImxpcXVlZ3Vvc2kiLCJsdmZhbiIsImN1aW1hbyIsImppbGluZyIsInphbmdiYSIsInpoYW5ncmVuIiwiem91c2hpIiwiZ2FuZnVyZW4iLCJzcF94aWFob3VzaGkiLCJqc3Bfemhhb3l1biIsImh1YW5namlubGVpc2hpIiwic3BfcGFuZ3RvbmciLCJzcF9kYXFpYW8iLCJzcF9nYW5uaW5nIiwic3BfeGlhaG91ZHVuIiwic3BfbHZtZW5nIiwic3BfemhhbmdmZWkiLCJzcF9saXViZWkiLCJ3YW5neXVuIiwib2xkX2J1bGlhbnNoaSIsIm9sZF95dWFuc2h1IiwieXVqaSIsInpoYW5namlhbyIsIm9sZF96aHVnZXpoYW4iLCJvbGRfemhvdXRhaSIsIm9sZF9jYW9yZW4iLCJ4aWFob3V5dWFuIiwieGlhb3FpYW8iLCJodWFuZ3pob25nIiwid2VpeWFuIiwieHVodWFuZyIsIm1hc3UiLCJ4dXNodSIsImZhemhlbmciLCJ5dWppbiIsInhpbl95dWppbiIsIm9sZF94dXNoZW5nIiwib2xkX2xpbmd0b25nIiwib2xkX21hZGFpIiwib2xkX3pob25naHVpIiwib2xkX3dhbmd5aSIsIm9sZF9ndWFuemhhbmciLCJvbF9saWFvaHVhIiwibGlydSIsIm9sZF96aHVyYW4iLCJvbF96aHVyYW4iLCJvbF9tYW5jaG9uZyIsIm9sX2d1b2h1YWkiLCJvbGRfZnVodWFuZ2hvdSIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW96aGVuIiwib2xkX2NoZW5xdW4iLCJvbGRfemh1aHVhbiIsIm9sX3d1eWkiLCJvbGRfY2FveGl1Iiwib2xkX3F1YW5jb25nIiwib2xkX3podXpoaSIsIm9sX3hpbnhpYW55aW5nIiwib2xfemhhbmdyYW5nIiwib2xfbGl1eXUiLCJvbGRfY2FvY2h1biIsIm9sZF9saW5nanUiLCJvbGRfbWFsaWFuZyIsIm9sZF9tYWNoYW8iLCJ6aGFuZ2xpYW5nIiwianNwX2Nhb3JlbiIsImN1aXlhbiIsInNpbWF5aSIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJwYW5nZGUiLCJvbGRfemhhbmd4aW5nY2FpIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfbWFqdW4iLCJyZV9zdW5jZSIsInJlX2RpYW53ZWkiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwib2xkX2h1YXhpb25nIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJpZGVudGl0eV9iYW5uZWRjYXJkcyI6W10sImlkZW50aXR5X2ZvbnQiOiJ4aW53ZWkiLCJpZGVudGl0eV9tb2RlX21vZGVfY29uZmlnX2lkZW50aXR5Ijoibm9ybWFsIiwiaW1hZ2VfYmFja2dyb3VuZCI6InhpbnNoYV9iZyIsImltYWdlX2JhY2tncm91bmRfYmx1ciI6ZmFsc2UsImltYWdlX2JhY2tncm91bmRfcmFuZG9tIjpmYWxzZSwiaW1wb3J0X2RhdGFfYnV0dG9uIjpmYWxzZSwiaW1wb3J0X211c2ljIjp0cnVlLCJqY19tb2RlX2NvbmZpZ193am1zIjoidGIiLCJqY3dqX21vZGVfY29uZmlnX3dqbXMiOnRydWUsImppYW5iaW5nbW9zaGlfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImppYW5nc2hpbW9zaGlfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImppbHVlZHVpanVlMSI6ImxqeWhzbF9seWJfaHVhbmdoYW8iLCJqaWx1ZWR1aWp1ZTEwIjoieWFueWFuIiwiamlsdWVkdWlqdWUxMSI6ImxqeWhzbF9nbXJoX21paGVuZyIsImppbHVlZHVpanVlMTIiOiJjaGVuZG9uZyIsImppbHVlZHVpanVlMTMiOiJXU1NfbGl1eGllIiwiamlsdWVkdWlqdWUxNCI6ImxpcXVlZ3Vvc2kiLCJqaWx1ZWR1aWp1ZTE1IjoieGZfdGFuZ3ppIiwiamlsdWVkdWlqdWUxNiI6Im1lbmd6aGFuY1/mqZkiLCJqaWx1ZWR1aWp1ZTE3IjoieWFveXlz5aaW54uQIiwiamlsdWVkdWlqdWUxOCI6Inl5c1/lvbzlsrjoirEiLCJqaWx1ZWR1aWp1ZTE5IjoicmVfemhhb3l1biIsImppbHVlZHVpanVlMiI6IldTU19kb25nemh1byIsImppbHVlZHVpanVlMjAiOiJkYXFpbl9tYWxlNiIsImppbHVlZHVpanVlMjEiOiJ0YW9xaWFuIiwiamlsdWVkdWlqdWUyMiI6IldTU195YW5saWFuZ3dlbmNob3UiLCJqaWx1ZWR1aWp1ZTIzIjoiV1NTX2Jhb3Nhbm5pYW5nIiwiamlsdWVkdWlqdWUyNCI6InJlX3pob3V5dSIsImppbHVlZHVpanVlMjUiOiJ5eXNf6I2SIiwiamlsdWVkdWlqdWUzIjoid3V4aWFuIiwiamlsdWVkdWlqdWU0Ijoiemh1Z2VrZSIsImppbHVlZHVpanVlNSI6InRhaXNoaWNpIiwiamlsdWVkdWlqdWU2IjoiZ3VhbnN1byIsImppbHVlZHVpanVlNyI6ImJpbmdf5YWr55m+5q275aOrIiwiamlsdWVkdWlqdWU4IjoiY3VpeWFuIiwiamlsdWVkdWlqdWU5IjoiZ3VhbnBpbmciLCJqaWx1ZWR1aWp1ZURYRyI6MSwiamlsdWVkdWlqdWVFYXN5IjowLCJqaWx1ZWR1aWp1ZU5EIjoibWVkaXVtIiwiamlsdWVkdWlqdWVfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImppbHVlZHVpanVlaGFyZCI6MCwiamlsdWVkdWlqdWVtZWRpdW0iOjAsImppdV9lZmZlY3QiOnRydWUsImptc2ZfbW9kZV9jb25maWdfa3pzZyI6ZmFsc2UsImptc2ZfemRfbW9kZV9jb25maWdfa3pzZyI6dHJ1ZSwianVuemh1X21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsImtlZXBfYXdha2UiOmZhbHNlLCJrem9sX2JhZyI6e30sImt6b2xfYmFnX251bSI6MCwia3pvbF9iaW5namluZ2xpYW5nenUiOiJpZGVudGl0eSIsImt6b2xfYnciOnt9LCJrem9sX2Nvbm5lY3QiOnsiYWxsIjowLCJ3aW4iOjB9LCJrem9sX2pzd2oiOnt9LCJrem9sX2t6b2xfbHVja3lfbW9kZSI6ImlkZW50aXR5Iiwia3pvbF9renNnIjp7Im5hbWUiOiLml6DlkI3njqnlrrYiLCJjb2luIjoxMDAwLCJjb2luMSI6MCwia2IiOltdLCJjazIiOnt9LCJzZCI6eyJpdGVtIjpbeyJuYW1lIjoia3pzZ1/msJHljasiLCJ0cmFuc2xhdGUiOiLmsJHljasiLCJzZXgiOiJtYWxlIiwiZ3JvdXAiOiJzaHUiLCJxdWFpbHR5IjoxLCJ0eXBlIjoi5q2l5YW1IiwiaHAiOjUsImF0dGFjayI6MSwicHJlcGFyZVJvdW5kIjoyLCJiaW5nIjowLCJiYW8iOjAsInNodSI6MCwic2tpbGxzIjpbXSwidmFsdWUiOnsiY29pbiI6MjAwMH19LHsibmFtZSI6Imt6c2df5rWq5Lq6IiwidHJhbnNsYXRlIjoi5rWq5Lq6Iiwic2V4IjoibWFsZSIsImdyb3VwIjoid3UiLCJxdWFpbHR5IjoxLCJ0eXBlIjoi5q2l5YW1IiwiaHAiOjIsImF0dGFjayI6MSwicHJlcGFyZVJvdW5kIjo2LCJiaW5nIjowLCJiYW8iOjAsInNodSI6MCwic2tpbGxzIjpbImt6c2df6Zm36ZixMSJdLCJ2YWx1ZSI6eyJjb2luIjoxNTAwfX0seyJuYW1lIjoia3pzZ1/mta7mnKjpkogiLCJ0cmFuc2xhdGUiOiLmta7mnKjpkogiLCJzZXgiOiJtYWxlIiwiZ3JvdXAiOiJ3dSIsInF1YWlsdHkiOjEsInR5cGUiOiLlhpvlpIciLCJocCI6MiwiYXR0YWNrIjowLCJwcmVwYXJlUm91bmQiOjQsImJpbmciOjAsImJhbyI6MCwic2h1IjowLCJza2lsbHMiOlsia3pzZ1/pmbfpmLExIiwia3pzZ1/liIPnlLIxIl0sInZhbHVlIjp7ImNvaW4iOjc1MH19LHsibmFtZSI6Imt6c2df5beo6byT5omLIiwidHJhbnNsYXRlIjoi5beo6byT5omLIiwic2V4IjoibWFsZSIsImdyb3VwIjoicXVuIiwicXVhaWx0eSI6MiwidHlwZSI6IuW8guaXjyIsImhwIjo1LCJhdHRhY2siOjIsInByZXBhcmVSb3VuZCI6OCwiYmluZyI6MCwiYmFvIjowLCJzaHUiOjAsInNraWxscyI6WyJrenNnX+a/gOWKseatpeWFtSIsImt6c2df6bij6byTMiJdLCJ2YWx1ZSI6eyJjb2luIjoyMDAwfX0seyJuYW1lIjoia3pzZ1/opb/lh4nni4LmiJgiLCJ0cmFuc2xhdGUiOiLopb/lh4nni4LmiJgiLCJzZXgiOiJtYWxlIiwiZ3JvdXAiOiJxdW4iLCJxdWFpbHR5IjozLCJ0eXBlIjoi5byC5pePIiwiaHAiOjMsImF0dGFjayI6MiwicHJlcGFyZVJvdW5kIjo2LCJiaW5nIjowLCJiYW8iOjAsInNodSI6MCwic2tpbGxzIjpbImt6c2df54Gr54SwIl0sInZhbHVlIjp7ImNvaW4iOjQwMDB9fSx7Im5hbWUiOiJrenNnX+W5veWGpeeLvCIsInRyYW5zbGF0ZSI6IuW5veWGpeeLvCIsInNleCI6Im1hbGUiLCJncm91cCI6IndlaSIsInF1YWlsdHkiOjEsInR5cGUiOiLkuqHngbUiLCJocCI6MiwiYXR0YWNrIjoxLCJwcmVwYXJlUm91bmQiOjIsImJpbmciOjAsImJhbyI6MCwic2h1IjowLCJza2lsbHMiOlsia3pzZ1/mr5LliIMyIl0sInZhbHVlIjp7ImNvaW4iOjc1MH19LHsibmFtZSI6Imt6c2df54yO6bmwIiwidHJhbnNsYXRlIjoi54yO6bmwIiwic2V4IjoibWFsZSIsImdyb3VwIjoicXVuIiwicXVhaWx0eSI6MSwidHlwZSI6IuW8guWFvSIsImhwIjo0LCJhdHRhY2siOjEsInByZXBhcmVSb3VuZCI6NCwiYmluZyI6MCwiYmFvIjowLCJzaHUiOjAsInNraWxscyI6WyJrenNnX+mjnuihjCJdLCJ2YWx1ZSI6eyJjb2luMSI6NX19LHsibmFtZSI6Imt6c2df6Z2S5bee5YW1IiwidHJhbnNsYXRlIjoi6Z2S5bee5YW1Iiwic2V4IjoibWFsZSIsImdyb3VwIjoid2VpIiwicXVhaWx0eSI6MiwidHlwZSI6IuatpeWFtSIsImhwIjo0LCJhdHRhY2siOjAsInByZXBhcmVSb3VuZCI6NCwiYmluZyI6MCwiYmFvIjowLCJzaHUiOjAsInNraWxscyI6WyJrenNnX+e0ouWRvTEiXSwidmFsdWUiOnsiY29pbiI6MzAwMH19XSwieWVhciI6MjAyMCwibW9udGgiOjIsImRheSI6MTl9LCJhdmF0YXIiOiJsaXViZWkiLCJjYXJkIjp7IjAiOnsibmFtZSI6Imt6c2df5YWz5bmzIiwidHJhbnNsYXRlIjoi5YWz5bmzIiwic2V4IjoibWFsZSIsImdyb3VwIjoic2h1IiwicXVhaWx0eSI6MywidHlwZSI6IuatpuWwhiIsImhwIjo2LCJhdHRhY2siOjMsInByZXBhcmVSb3VuZCI6OCwiYmluZyI6NiwiYmFvIjowLCJzaHUiOjAsInNraWxscyI6WyJrenNnX+i3tei4jyJdfSwiMSI6eyJuYW1lIjoia3pzZ1/msJHljasiLCJ0cmFuc2xhdGUiOiLmsJHljasiLCJzZXgiOiJtYWxlIiwiZ3JvdXAiOiJzaHUiLCJxdWFpbHR5IjoxLCJ0eXBlIjoi5q2l5YW1IiwiaHAiOjUsImF0dGFjayI6MSwicHJlcGFyZVJvdW5kIjoyLCJiaW5nIjowLCJiYW8iOjAsInNodSI6MCwic2tpbGxzIjpbXSwidmFsdWUiOnsiY29pbiI6MjAwMH19LCIyIjp7Im5hbWUiOiJrenNnX+awkeWNqyIsInRyYW5zbGF0ZSI6IuawkeWNqyIsInNleCI6Im1hbGUiLCJncm91cCI6InNodSIsInF1YWlsdHkiOjEsInR5cGUiOiLmraXlhbUiLCJocCI6NSwiYXR0YWNrIjoxLCJwcmVwYXJlUm91bmQiOjIsImJpbmciOjAsImJhbyI6MCwic2h1IjowLCJza2lsbHMiOltdLCJ2YWx1ZSI6eyJjb2luIjoyMDAwfX0sIjMiOnsibmFtZSI6Imt6c2df5rCR5Y2rIiwidHJhbnNsYXRlIjoi5rCR5Y2rIiwic2V4IjoibWFsZSIsImdyb3VwIjoic2h1IiwicXVhaWx0eSI6MSwidHlwZSI6IuatpeWFtSIsImhwIjo1LCJhdHRhY2siOjEsInByZXBhcmVSb3VuZCI6MiwiYmluZyI6MCwiYmFvIjowLCJzaHUiOjAsInNraWxscyI6W10sInZhbHVlIjp7ImNvaW4iOjIwMDB9fSwiNCI6eyJuYW1lIjoia3pzZ1/msJHljasiLCJ0cmFuc2xhdGUiOiLmsJHljasiLCJzZXgiOiJtYWxlIiwiZ3JvdXAiOiJzaHUiLCJxdWFpbHR5IjoxLCJ0eXBlIjoi5q2l5YW1IiwiaHAiOjUsImF0dGFjayI6MSwicHJlcGFyZVJvdW5kIjoyLCJiaW5nIjowLCJiYW8iOjAsInNodSI6MCwic2tpbGxzIjpbXSwidmFsdWUiOnsiY29pbiI6MjAwMH19fSwiY2FyZF9udW0iOjUsImFybXkiOnt9LCJhcm15X251bSI6MCwiYmF0dGxlIjp7IuWIneWHuuiMheW6kCI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZX0sIuWNoOWxseS4uueOiyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2UsIjkiOmZhbHNlLCIxMCI6ZmFsc2UsIjExIjpmYWxzZSwiMTIiOmZhbHNlfSwi5Yid5Li66K+45L6vIjp7IjEiOmZhbHNlLCIyIjpmYWxzZSwiMyI6ZmFsc2UsIjQiOmZhbHNlLCI1IjpmYWxzZSwiNiI6ZmFsc2UsIjciOmZhbHNlLCI4IjpmYWxzZSwiOSI6ZmFsc2UsIjEwIjpmYWxzZX0sIumtj+WbveW8uuaUuyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2V9LCLogZTlkIjonIDlkLQiOnsiMSI6ZmFsc2UsIjIiOmZhbHNlLCIzIjpmYWxzZSwiNCI6ZmFsc2UsIjUiOmZhbHNlLCI2IjpmYWxzZSwiNyI6ZmFsc2UsIjgiOmZhbHNlfSwi6IGU5Yab5YaF6K6nIjp7IjEiOmZhbHNlLCIyIjpmYWxzZSwiMyI6ZmFsc2UsIjQiOmZhbHNlLCI1IjpmYWxzZSwiNiI6ZmFsc2UsIjciOmZhbHNlLCI4IjpmYWxzZX0sIuemu+mXtOicgOWQtCI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2V9LCLprY/lm73lj43mlLsiOnsiMSI6ZmFsc2UsIjIiOmZhbHNlLCIzIjpmYWxzZSwiNCI6ZmFsc2UsIjUiOmZhbHNlLCI2IjpmYWxzZSwiNyI6ZmFsc2UsIjgiOmZhbHNlfSwi5LiD5Ye656WB5bGxIjp7IjEiOmZhbHNlLCIyIjpmYWxzZSwiMyI6ZmFsc2UsIjQiOmZhbHNlLCI1IjpmYWxzZSwiNiI6ZmFsc2UsIjciOmZhbHNlLCI4IjpmYWxzZX0sIuWKqOS5seWxgOWKvyI6eyIxIjpmYWxzZSwiMiI6ZmFsc2UsIjMiOmZhbHNlLCI0IjpmYWxzZSwiNSI6ZmFsc2UsIjYiOmZhbHNlLCI3IjpmYWxzZSwiOCI6ZmFsc2UsIjkiOmZhbHNlLCIxMCI6ZmFsc2UsIjExIjpmYWxzZX19LCJkYWlseV9yZXdhcmQiOnsi5Yid5Ye66IyF5bqQIjp7fSwi5Y2g5bGx5Li6546LIjp7fSwi5Yid5Li66K+45L6vIjp7fSwi6a2P5Zu95by65pS7Ijp7fSwi6IGU5ZCI6JyA5ZC0Ijp7fSwi6IGU5Yab5YaF6K6nIjp7fSwi56a76Ze06JyA5ZC0Ijp7fSwi6a2P5Zu95Y+N5pS7Ijp7fSwi5LiD5Ye656WB5bGxIjp7fSwi5Yqo5Lmx5bGA5Yq/Ijp7fX0sImNrIjp7IuWfuuehgOaxoCI6MCwi6L+b6Zi25rGgIjowfSwiZmlyc3QiOnRydWV9LCJrem9sX2x1Y2t5X21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJrem9sX3NraWxsU2tpbiI6eyLlvLrlvKnnpZ7lsIQiOmZhbHNlLCLlubvlvbHlsITmiYsiOmZhbHNlLCLpk7bmnIjnrq3ljY4iOmZhbHNlLCLnmo7mnIjnjovkvq8iOmZhbHNlLCLpu4Tph5HkuYvnv7wiOmZhbHNlLCLntKvogIDlvILmmJ8iOmZhbHNlfSwia3pvbF9za2lsbFNraW5FcXVpcGluZyI6e30sImt6b2xfdGFzayI6e30sImt6b2xfdGFza190aW1lIjp7InllYXIiOjIwMjAsIm1vbnRoIjoyLCJkYXkiOjE5fSwia3pvbF93ZWF0aGVyX21vZGVfY29uZmlnX2Jvc3MiOmZhbHNlLCJrem9sX3dlYXRoZXJfbW9kZV9jb25maWdfYnJhd2wiOmZhbHNlLCJrem9sX3dlYXRoZXJfbW9kZV9jb25maWdfZG91ZGl6aHUiOmZhbHNlLCJrem9sX3dlYXRoZXJfbW9kZV9jb25maWdfZ3VvemhhbiI6ZmFsc2UsImt6b2xfd2VhdGhlcl9tb2RlX2NvbmZpZ19pZGVudGl0eSI6ZmFsc2UsImt6b2xfd2VhdGhlcl9tb2RlX2NvbmZpZ19renNnIjpmYWxzZSwia3pvbF93ZWF0aGVyX21vZGVfY29uZmlnX3BhcnRuZXIiOmZhbHNlLCJrem9sX3dlYXRoZXJfbW9kZV9jb25maWdfc2luZ2xlIjpmYWxzZSwia3pvbF93ZWF0aGVyX21vZGVfY29uZmlnX3ZlcnN1cyI6ZmFsc2UsImt6b2xfd2VhdGhlcl9tb2RlX2NvbmZpZ193YW5nemhlemhpemhhbiI6ZmFsc2UsImt6b2xfd2VhdGhlcl9tb2RlX2NvbmZpZ193am1zIjpmYWxzZSwia3pvbF93am1zIjp7IndqYndfZXF1aXBlZCI6e319LCJrem9sX3d6enoiOnsid2FuZ19jYWl3ZW5qaSI6eyJ3eiI6MCwiZnIiOjB9LCJ3YW5nX2RpYW9jaGFuIjp7Ind6IjowLCJmciI6MH0sIndhbmdfaHVheGlvbmciOnsid3oiOjAsImZyIjowfSwid2FuZ19saXJ1Ijp7Ind6IjowLCJmciI6MH0sIndhbmdfbHZidSI6eyJ3eiI6MCwiZnIiOjB9LCJ4aWFuX21hY2hhbyI6eyJ3eiI6MCwiZnIiOjB9LCJ4aWFuX3RhaXNoaWNpIjp7Ind6IjowLCJmciI6MH0sInhpYW5femhlbmppIjp7Ind6IjowLCJmciI6MH0sInhpYW5femhvdXl1Ijp7Ind6IjowLCJmciI6MH0sInhpYW5femh1Z2VrZSI6eyJ3eiI6MCwiZnIiOjB9fSwia3pvbF95c3dzX21vZGUiOiJpZGVudGl0eSIsImxhZGRlcl9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsImxhZGRlcl9tb250aGx5X21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwibGFzdF9pcCI6IjQ3LjEwMC4xNjIuNTIiLCJsYXlvdXQiOiJsb25nMiIsImxldmVsX2V4X21vZGVfY29uZmlnX2FvbGFTdGFyIjo4LCJsZXZlbF9tb2RlX2NvbmZpZ19hb2xhU3RhciI6MSwibGluZ3poYW5fbW9kZV9jb25maWdfYnJhd2wiOnRydWUsImxpbmtfc3R5bGUyIjoiY2hhaW4iLCJsb3dfcGVyZm9ybWFuY2UiOmZhbHNlLCJsc3d3X21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJsc3d6X21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJsdWNreV9zdGFyIjpmYWxzZSwibWFpbl96aHVfbW9kZV9jb25maWdfY2hlc3MiOmZhbHNlLCJtYW5hX21vZGVfbW9kZV9jb25maWdfc3RvbmUiOiJpbmMiLCJtYXJrX2lkZW50aXR5X3N0eWxlIjoibWVudSIsIm1heF9sb2FkdGltZSI6IjUwMDAiLCJtZW51X3N0eWxlIjoic2ltcGxlIiwibW9kZSI6ImNvbm5lY3QiLCJtb2RlX21vZGVfY29uZmlnX2FvbGFTdGFyIjoibm9ybWFsIiwibW9kZV9tb2RlX2NvbmZpZ19wYXJ0bmVyIjoic3RhbmRhcmQiLCJteWtwc19tb2RlX2NvbmZpZ19renNnIjoxOCwibmFtZV9mb250Ijoic2hvdXNoYSIsIm5ld190dXRvcmlhbCI6dHJ1ZSwibm9uYW1lX2V4dGVuc2lvbk9MX3VwZGF0ZUZpbGVzIjp7Imt6c2df5pu55pONLmpwZyI6dHJ1ZSwia3pzZ1/lj7jpqazmh78uanBnIjp0cnVlLCJrenNnX+mDreWYiS5qcGciOnRydWUsImt6c2df56iL5pixLmpwZyI6dHJ1ZSwia3pzZ1/nlITlp6wuanBnIjp0cnVlLCJrenNnX+W8oOi+vS5qcGciOnRydWUsImt6c2df5aSP5L6v5oOHLmpwZyI6dHJ1ZSwia3pzZ1/lvKDpg4MuanBnIjp0cnVlLCJrenNnX+a7oeWuoC5qcGciOnRydWUsImt6c2df6I2A5b2nLmpwZyI6dHJ1ZSwia3pzZ1/pqqjpvpnnjosuanBnIjp0cnVlLCJrenNnX+Wkj+S+r+a4ii5qcGciOnRydWUsImt6c2df5pu55LuBLmpwZyI6dHJ1ZSwia3pzZ1/nvornpZwuanBnIjp0cnVlLCJrenNnX+iMg+Wini5qcGciOnRydWUsImt6c2df6I2A5pS4LmpwZyI6dHJ1ZSwia3pzZ1/kuqHogIXkuYvlv4MuanBnIjp0cnVlLCJrenNnX+WcsOeLseS9v+iAhS5qcGciOnRydWUsImt6c2df5ber5pyv5L2/6ICFLmpwZyI6dHJ1ZSwia3pzZ1/lub3lhqXnm77ljasuanBnIjp0cnVlLCJrenNnX+W5veWGpeWNqy5qcGciOnRydWUsImt6c2df54Gr54KO6Zu35Y2rLmpwZyI6dHJ1ZSwia3pzZ1/lub3prLwuanBnIjp0cnVlLCJrenNnX+eBq+eEsOS9v+iAhS5qcGciOnRydWUsImt6c2df54OI6ZuA6aqRLmpwZyI6dHJ1ZSwia3pzZ1/ovbvpqqjlvJMuanBnIjp0cnVlLCJrenNnX+mqqOebvuWMu+W4iC5qcGciOnRydWUsImt6c2df6aqo54G15biILmpwZyI6dHJ1ZSwia3pzZ1/pqqjngbXpqpHlo6suanBnIjp0cnVlLCJrenNnX+mqqOWMu+eBtS5qcGciOnRydWUsImt6c2df6aqo6b6ZLmpwZyI6dHJ1ZSwia3pzZ1/pqqjpvpnpqpHlo6suanBnIjp0cnVlLCJrenNnX+mqt+mrheeOiy5qcGciOnRydWUsImt6c2df6ay8546E5q2mLmpwZyI6dHJ1ZSwia3pzZ1/liLrnm77lhbUuanBnIjp0cnVlLCJrenNnX+WkqemJtOiAhS5qcGciOnRydWUsImt6c2df5bC45YW1LmpwZyI6dHJ1ZSwia3pzZ1/lsLjprZQuanBnIjp0cnVlLCJrenNnX+avkua2sumTgeWjgS5qcGciOnRydWUsImt6c2df6KGA5rGg6ZWcLmpwZyI6dHJ1ZSwia3pzZ1/ooYDprZQuanBnIjp0cnVlLCJrenNnX+mdkuW3numHjemqkS5qcGciOnRydWUsImt6c2df6aqo5bypLmpwZyI6dHJ1ZSwia3pzZ1/pqqjms5UuanBnIjp0cnVlLCJrenNnX+mqqOebvuWNqy5qcGciOnRydWUsImt6c2df6aqo55+b5omLLmpwZyI6dHJ1ZSwia3pzZ1/om4rmg5HkuYvnn7MuanBnIjp0cnVlLCJrenNnX+ihgOaequWNqy5qcGciOnRydWUsImt6c2df6KGA6aqRLmpwZyI6dHJ1ZSwia3pzZ1/pk77nkIPlhbUuanBnIjp0cnVlLCJrenNnX+mdkuW3nuWFtS5qcGciOnRydWUsImt6c2df6Z2S5bee5pqX6aqRLmpwZyI6dHJ1ZSwia3pzZ1/pqqjpqpEuanBnIjp0cnVlLCJrenNnX+W5veWGpeeLvC5qcGciOnRydWUsImt6c2df6aq36auF5YW1LmpwZyI6dHJ1ZSwia3pzZ1/mr5Lpm77pmLUuanBnIjp0cnVlLCJrenNnX+S6oeeBteivheWSki5qcGciOnRydWUsImt6c2df5aSN5rS75ZKSLmpwZyI6dHJ1ZSwia3pzZ1/nga3lhpvprYLlkpIuanBnIjp0cnVlLCJrenNnX+WRqOeRnC5qcGciOnRydWUsImt6c2df5ZCV6JKZLmpwZyI6dHJ1ZSwia3pzZ1/lpKfkuZQuanBnIjp0cnVlLCJrenNnX+WtmeWwmummmS5qcGciOnRydWUsImt6c2df5a2Z562WLmpwZyI6dHJ1ZSwia3pzZ1/lsI/kuZQuanBnIjp0cnVlLCJrenNnX+eUmOWugS5qcGciOnRydWUsImt6c2df6ZmG6YCKLmpwZyI6dHJ1ZSwia3pzZ1/pu4Tnm5YuanBnIjp0cnVlLCJrenNnX+m7keibn+m+mS5qcGciOnRydWUsImt6c2df5LiB5aWJLmpwZyI6dHJ1ZSwia3pzZ1/lkajms7AuanBnIjp0cnVlLCJrenNnX+WkquWPsuaFiC5qcGciOnRydWUsImt6c2df5byg5pitLmpwZyI6dHJ1ZSwia3pzZ1/mnLHmsrsuanBnIjp0cnVlLCJrenNnX+mygeiCgy5qcGciOnRydWUsImt6c2df5ZCV6IyDLmpwZyI6dHJ1ZSwia3pzZ1/mr5LmtbfonIcuanBnIjp0cnVlLCJrenNnX+Wmluacr+W4iC5qcGciOnRydWUsImt6c2df5a6d55+z5rW35pifLmpwZyI6dHJ1ZSwia3pzZ1/mjrfmlqfmiYsuanBnIjp0cnVlLCJrenNnX+acsembgOmqkeWFtS5qcGciOnRydWUsImt6c2df5rW35Yi66b6ZLmpwZyI6dHJ1ZSwia3pzZ1/muLjkvqAuanBnIjp0cnVlLCJrenNnX+eOieesm+S7mS5qcGciOnRydWUsImt6c2df6Z2S6b6ZLmpwZyI6dHJ1ZSwia3pzZ1/lhrDliZHljasuanBnIjp0cnVlLCJrenNnX+WIuuWuoi5qcGciOnRydWUsImt6c2df5YmR6bG85Y2rLmpwZyI6dHJ1ZSwia3pzZ1/lppnmiYvljLvluIguanBnIjp0cnVlLCJrenNnX+agvOaMoeWxjy5qcGciOnRydWUsImt6c2df5q+S5YiA5Y2rLmpwZyI6dHJ1ZSwia3pzZ1/mr5Lom58uanBnIjp0cnVlLCJrenNnX+awtOabvOibhy5qcGciOnRydWUsImt6c2df5rC05q+S6b6ZLmpwZyI6dHJ1ZSwia3pzZ1/msLTpqpHlhbUuanBnIjp0cnVlLCJrenNnX+a1t+WIuumxvC5qcGciOnRydWUsImt6c2df54K86I2v5biILmpwZyI6dHJ1ZSwia3pzZ1/nmoflrrbmsLTljasuanBnIjp0cnVlLCJrenNnX+eah+WutumihOiogOW4iC5qcGciOnRydWUsImt6c2df6I2v5bCK6ICFLmpwZyI6dHJ1ZSwia3pzZ1/okpnlhrLoiLkuanBnIjp0cnVlLCJrenNnX+a4uOaWueacr+Wjqy5qcGciOnRydWUsImt6c2df6ZqQ5YiA5Y2rLmpwZyI6dHJ1ZSwia3pzZ1/pnLjnjovpqpEuanBnIjp0cnVlLCJrenNnX+mprOW8k+aJiy5qcGciOnRydWUsImt6c2df5Yy75biILmpwZyI6dHJ1ZSwia3pzZ1/lkpLmnK/lo6suanBnIjp0cnVlLCJrenNnX+Wkqembt+WNqy5qcGciOnRydWUsImt6c2df5ri45pa56Zu35Y2rLmpwZyI6dHJ1ZSwia3pzZ1/ngavpm7cuanBnIjp0cnVlLCJrenNnX+mihOiogOW4iC5qcGciOnRydWUsImt6c2df5rC055+b5omLLmpwZyI6dHJ1ZSwia3pzZ1/mtarkurouanBnIjp0cnVlLCJrenNnX+a1ruacqOmSiC5qcGciOnRydWUsImt6c2df6KeC5pif6ICFLmpwZyI6dHJ1ZSwia3pzZ1/ov5HljavmsLTlhbUuanBnIjp0cnVlLCJrenNnX+i/kei6q+WFtS5qcGciOnRydWUsImt6c2df5YWr5Y2m6Zi06Ziz6Zi1LmpwZyI6dHJ1ZSwia3pzZ1/msLTniaLpmLUuanBnIjp0cnVlLCJrenNnX+eLgumbt+Wkqee9kS5qcGciOnRydWUsImt6c2df5bm76Zu+5q+S6Zi1LmpwZyI6dHJ1ZSwia3pzZ1/liJjlpIcuanBnIjp0cnVlLCJrenNnX+WFs+e+vS5qcGciOnRydWUsImt6c2df5byg6aOeLmpwZyI6dHJ1ZSwia3pzZ1/otbXkupEuanBnIjp0cnVlLCJrenNnX+mprOi2hS5qcGciOnRydWUsImt6c2df6buE5b+gLmpwZyI6dHJ1ZSwia3pzZ1/or7jokZvkuq4uanBnIjp0cnVlLCJrenNnX+WnnOe7tC5qcGciOnRydWUsImt6c2df6a2P5bu2LmpwZyI6dHJ1ZSwia3pzZ1/pu4TmnIjoi7EuanBnIjp0cnVlLCJrenNnX+WRqOS7ky5qcGciOnRydWUsImt6c2df5byg6IueLmpwZyI6dHJ1ZSwia3pzZ1/ms5XmraMuanBnIjp0cnVlLCJrenNnX+iSi+eQrC5qcGciOnRydWUsImt6c2df5YWz5bmzLmpwZyI6dHJ1ZSwia3pzZ1/lup7nu58uanBnIjp0cnVlLCJrenNnX+WGsOe6ueixuS5qcGciOnRydWUsImt6c2df5pan5aS05YW1LmpwZyI6dHJ1ZSwia3pzZ1/mtYHmtarliZHkvqAuanBnIjp0cnVlLCJrenNnX+mbque/vOiZji5qcGciOnRydWUsImt6c2df6bm/5Y+35omLLmpwZyI6dHJ1ZSwia3pzZ1/pvpnkuYvpk4HpqpEuanBnIjp0cnVlLCJrenNnX+WFtei9pi5qcGciOnRydWUsImt6c2df5Yi655Sy55u+5Y2rLmpwZyI6dHJ1ZSwia3pzZ1/lt6jpub/op5LpmLUuanBnIjp0cnVlLCJrenNnX+WGsumYtei9pi5qcGciOnRydWUsImt6c2df55qH5a626Zu35Y2rLmpwZyI6dHJ1ZSwia3pzZ1/nqoHooq3pk4HpqpEuanBnIjp0cnVlLCJrenNnX+e/vOeZveiZji5qcGciOnRydWV9LCJub25hbWVfZXh0ZW5zaW9uT0xfdmVyc2lvbiI6IjEuNC42MS4xMDciLCJub25hbWVfZXh0ZW5zaW9uT0xfdmVyc2lvbjEiOiIxLjE0LjEyIiwibm9yZXBsYWNlX2VuZF9tb2RlX2NvbmZpZ19jaGVzcyI6ZmFsc2UsIm9ubHlndW96aGFuX21vZGVfY29uZmlnX2d1b3poYW4iOnRydWUsIm9ubHlndW96aGFuZXhwYW5kX21vZGVfY29uZmlnX2d1b3poYW4iOmZhbHNlLCJwaG9uZWxheW91dCI6ZmFsc2UsInBsYXllcl9ib3JkZXIiOiJzbGltIiwicGxheWVyX2hlaWdodCI6ImxvbmciLCJwbGF5ZXJfaGVpZ2h0X25vdmEiOiJzaG9ydCIsInBsYXllcl9udW1iZXJfbW9kZV9jb25maWdfZ3VvemhhbiI6IjgiLCJwbGF5ZXJfbnVtYmVyX21vZGVfY29uZmlnX2lkZW50aXR5IjoiOCIsInBsYXllcl9zdHlsZSI6InNpbXBsZSIsInBsYXllcnNfZXhfbW9kZV9jb25maWdfYW9sYVN0YXIiOjIsInBsYXllcnNfbW9kZV9jb25maWdfYW9sYVN0YXIiOjIsInBsYXllcnNfbW9kZV9jb25maWdfcGFydG5lciI6NCwicGxheXMiOlsiYm9zcyJdLCJwb3BfbG9ndiI6dHJ1ZSwicG9wZXF1aXAiOnRydWUsInByb21wdF9oaWRlYmciOnRydWUsInByb21wdF9oaWRlcGFjayI6dHJ1ZSwicHVuaXNoX21vZGVfY29uZmlnX2NoZXNzIjoi5pegIiwicXhoel9tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwicmFkaXVzX3NpemUiOiJpbmNyZWFzZSIsInJhaW5fcnVzZUxpZ2h0IjowLCJyYWluX3J1c2VOdW1iZXIiOiI3MjMwNTc0MTUiLCJyYWluX3J1c2VfRFhCIjoxLCJyYWluX3J1c2VfTUFYTEMiOjAsInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19ib3NzIjpbImNhb2NodW4iLCJjYW95aW5nIiwiemhhbmdjaGFuZ3B1Il0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ19jaGVzcyI6WyJ3dXhpYW4iLCJzaGFtb2tlIiwiY2FvY2h1biJdLCJyZWNlbnRDaGFyYWN0ZXJfbW9kZV9jb25maWdfZG91ZGl6aHUiOlsicmVfeHVzaGVuZyIsImppYWt1aSJdLCJyZWNlbnRDaGFyYWN0ZXJfbW9kZV9jb25maWdfZ3VvemhhbiI6WyJnel93YW5ncGluZyIsImd6X2h1YW5neXVleWluZyIsImd6X3NwX3podWdlbGlhbmciLCJnel9tYWNoYW8iLCJnel9zaGFtb2tlIiwiZ3pfcGFuZ2RlIiwiZ3pfYmVpbWlodSJdLCJyZWNlbnRDaGFyYWN0ZXJfbW9kZV9jb25maWdfaWRlbnRpdHkiOlsiZ3VhbnN1byIsInNoZW5fbGl1YmVpIiwid2FuZ2NhbiIsInJlX2Jhb3Nhbm5pYW5nIiwiemh1emhpIiwiemh1bGluZyIsInhmX2h1YW5ncXVhbiIsImd1YW5sdSIsInRhb3FpYW4iLCJyZV9qaWthbmciLCJ6aG91ZmVpIiwienVvY2kiXSwicmVjZW50Q2hhcmFjdGVyX21vZGVfY29uZmlnX3N0b25lIjpbInJlX2NhaXdlbmppIl0sInJlY2VudENoYXJhY3Rlcl9tb2RlX2NvbmZpZ192ZXJzdXMiOlsidGFuZ3ppIiwiZGlhbndlaSIsImNhb3poaSIsImxpbmd0b25nIiwibHVqaSIsInRhb3FpYW4iLCJ4aW5feXVhbnNoYW8iXSwicmVjZW50SVAiOlsiNDcuMTAwLjE2Mi41Mjo4MDgwIiwiMTIzLjU2LjE2Ni4xMDU6ODA4MCIsIm5vbmFtZS5tb2JpOjgwODAiXSwicmVjZW50X2NoYXJhY3Rlcl9udW1iZXIiOiIxMiIsInJlY29ubmVjdF9pbmZvIjpbIjQ3LjEwMC4xNjIuNTI6ODA4MCIsbnVsbF0sInJlbWVtYmVyX2RpYWxvZyI6ZmFsc2UsInJlbWVtYmVyX3JvdW5kX2J1dHRvbiI6ZmFsc2UsInJlcGVhdF9hdWRpbyI6ZmFsc2UsInJlcGxhY2VfY2hhcmFjdGVyX3R3b19tb2RlX2NvbmZpZ192ZXJzdXMiOmZhbHNlLCJyZXBsYWNlX2hhbmRjYXJkX3R3b19tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsInJlcGxhY2VfbnVtYmVyX21vZGVfY29uZmlnX2NoZXNzIjowLCJyZXZpdmVfbW9kZV9jb25maWdfZG91ZGl6aHUiOmZhbHNlLCJyZXZpdmVfbW9kZV9jb25maWdfZ3VvemhhbiI6ZmFsc2UsInJldml2ZV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6ZmFsc2UsInJld2FyZF9tb2RlX2NvbmZpZ19jaGVzcyI6MywicmlnaHRfY2xpY2siOiJwYXVzZSIsInJpZ2h0X3JhbmdlIjp0cnVlLCJyb29tX2J1dHRvbl9tb2RlX2NvbmZpZ19jb25uZWN0IjpmYWxzZSwicm91bmRfbWVudV9mdW5jIjoic3lzdGVtIiwic2F2ZV9hbHgiOnsicGV0Ijp7fSwicGV0X251bSI6MH0sInNjZW5lX21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJzZWF0X29yZGVyX21vZGVfY29uZmlnX2NoZXNzIjoi5Lqk5pu/Iiwic2VwZXJhdGVfY29udHJvbCI6dHJ1ZSwic2hvd19iYW5fbWVudSI6ZmFsc2UsInNob3dfY2FyZF9wcm9tcHQiOnRydWUsInNob3dfY2FyZHBpbGVfbnVtYmVyIjp0cnVlLCJzaG93X2NoYXJhY3RlcmNhcmQiOnRydWUsInNob3dfZGlzY2FyZHBpbGUiOmZhbHNlLCJzaG93X2Rpc3RhbmNlX21vZGVfY29uZmlnX2NoZXNzIjp0cnVlLCJzaG93X2Rpc3RhbmNlX21vZGVfY29uZmlnX3RhZmFuZyI6dHJ1ZSwic2hvd19leHRlbnNpb25tYWtlciI6dHJ1ZSwic2hvd19leHRlbnNpb25zaGFyZSI6dHJ1ZSwic2hvd19mYXZtb2RlIjpmYWxzZSwic2hvd19mYXZvdXJpdGUiOmZhbHNlLCJzaG93X2Zhdm91cml0ZV9tZW51IjpmYWxzZSwic2hvd19naXZldXAiOnRydWUsInNob3dfaGFuZGNhcmRidXR0b24iOnRydWUsInNob3dfaGlzdG9yeSI6InJpZ2h0Iiwic2hvd19sb2ciOiJvZmYiLCJzaG93X3BoYXNlX3Byb21wdCI6dHJ1ZSwic2hvd19waGFzZXVzZV9wcm9tcHQiOnRydWUsInNob3dfcmFuZ2VfbW9kZV9jb25maWdfY2hlc3MiOnRydWUsInNob3dfcmFuZ2VfbW9kZV9jb25maWdfdGFmYW5nIjp0cnVlLCJzaG93X3JlcGxheSI6dHJ1ZSwic2hvd19zb3J0Y2FyZCI6dHJ1ZSwic2hvd19zcGxhc2giOiJpbml0Iiwic2hvd190aW1lIjp0cnVlLCJzaG93X3RpbWUyIjpmYWxzZSwic2hvd190aW1lMyI6dHJ1ZSwic2hvd193dXhpZSI6ZmFsc2UsInNpZ3VvX2NoYXJhY3Rlcl9tb2RlX2NvbmZpZ192ZXJzdXMiOiJub3JtYWwiLCJzaW5nbGVfYmFubmVkIjpbImdvbmdzdW56YW4iLCJkZW5nYWkiLCJqaWFuZ3dlaSIsImJpYW5mdXJlbiIsImNhb2NhbyIsIm9sZF9jYW9jaG9uZyIsIm9sZF9jYW9jaHVuIiwiY2FvcGkiLCJqc3BfY2FvcmVuIiwib2xkX2Nhb3JlbiIsIm9sZF9jYW94aXUiLCJvbGRfY2FvemhlbiIsIm9sZF9jaGVucXVuIiwiY3VpbWFvIiwiY3VpeWFuIiwib2xfZ3VvaHVhaSIsImd1b2ppYSIsIm9sX21hbmNob25nIiwibml1amluIiwic2ltYXlpIiwib2xkX3dhbmd5aSIsInNwX3hpYWhvdWR1biIsInhpYWhvdWR1biIsInhpYWhvdXl1YW4iLCJvbF94aW54aWFueWluZyIsInh1aHVhbmciLCJ4dW55dSIsInh1emh1IiwicmVfeXVqaW4iLCJ4aW5feXVqaW4iLCJ5dWppbiIsInphbmdiYSIsInpoYW5nbGlhbyIsInpoZW5qaSIsIm9sZF96aG9uZ2h1aSIsImZhemhlbmciLCJnYW5mdXJlbiIsImd1YW55dSIsIm9sZF9ndWFuemhhbmciLCJodWFuZ3l1ZXlpbmciLCJodWFuZ3pob25nIiwiamlhbmdmZWkiLCJvbF9saWFvaHVhIiwibGl1YmVpIiwic3BfbGl1YmVpIiwibWFjaGFvIiwib2xkX21hZGFpIiwib2xkX21hbGlhbmciLCJtYXN1Iiwiem91c2hpIiwianNwX3poYW95dW4iLCJ6aGFuZ3JlbiIsIm9sX3poYW5ncmFuZyIsInpoYW5nbGlhbmciLCJ6aGFuZ2ppYW8iLCJ5dWppIiwicmVfeXVhbnNodSIsIm9sZF95dWFuc2h1IiwicmVfeXVhbnNoYW8iLCJ5YW53ZW4iLCJ3YW5neXVuIiwidGlhbmZlbmciLCJzcF9wYW5ndG9uZyIsIm1hdGVuZyIsIm9sZF9tYWNoYW8iLCJsdmJ1Iiwib2xfbGl1eXUiLCJsaXJ1IiwibGlxdWVndW9zaSIsIm9sZF9saW5nanUiLCJrb25ncm9uZyIsIm1pZnVyZW4iLCJwYW5ndG9uZyIsIndlaXlhbiIsIm9sX3d1eWkiLCJzcF94aWFob3VzaGkiLCJ4dXNodSIsInNwX3poYW5nZmVpIiwiemhhbmdmZWkiLCJ6aGFveXVuIiwiemh1cm9uZyIsIm9sZF9idWxpYW5zaGkiLCJjaGVuZG9uZyIsImRhcWlhbyIsInNwX2RhcWlhbyIsImdhbm5pbmciLCJqaWFuZ3FpbmciLCJodWFuZ2dhaSIsIm9sZF9saW5ndG9uZyIsImx1eHVuIiwibHZmYW4iLCJsdm1lbmciLCJzcF9sdm1lbmciLCJvbGRfcXVhbmNvbmciLCJzdW5qaWFuIiwic3VucXVhbiIsInN1bnNoYW5neGlhbmciLCJ4aWFvcWlhbyIsIm9sZF94dXNoZW5nIiwib2xkX3pob3V0YWkiLCJ6aG91eXUiLCJvbGRfemh1aHVhbiIsIm9sX3podXJhbiIsIm9sZF96aHVyYW4iLCJvbGRfemh1emhpIiwiY2Fpd2VuamkiLCJkaWFvY2hhbiIsImRvbmd6aHVvIiwic3BfZG9uZ3podW8iLCJvbGRfZnVodWFuZ2hvdSIsInNwX2dhbm5pbmciLCJoYW5iYSIsImhhbnN1aSIsImhlamluIiwiaHVhbmdqaW5sZWlzaGkiLCJodWF0dW8iLCJodWF4aW9uZyIsIm9sZF9odWF4aW9uZyIsImppbGluZyIsInpodWdlbGlhbmciLCJvbGRfemh1Z2V6aGFuIiwic3BfemhhbmdqaWFvIiwicmVfeXVqaSIsInp1b2NpIiwibGl1c2hhbiIsInN1bmNlIiwiemhhbmd6aGFuZyIsInBhbmdkZSIsIm9sZF96aGFuZ3hpbmdjYWkiLCJyZV93ZWl3ZW56aHVnZXpoaSIsInJlX3h1Z29uZyIsInpoYW5nZ29uZyIsIm9sZF9tYWp1biIsInJlX3N1bmNlIiwicmVfZGlhbndlaSIsIm9sZF95dWFuc2hhbyIsIm9sZF9ndWFucWl1amlhbiIsIm9sZF9odWFuZ2Z1c29uZyIsIm9sX2xpdXNoYW4iLCJ4aW5feXVhbnNoYW8iLCJyZV96aGFuZ2ZlaSIsIm9sX21hbGlhbmciLCJyZV9nYW9zaHVuIiwid3VndW90YWkiLCJ4dXNoZW5nIiwieGluX3hpYWhvdWR1biIsInNwX3NpbWF6aGFvIiwic3Bfd2FuZ3l1YW5qaSIsInNwX3hpbnhpYW55aW5nIiwic3BfZ29uZ3N1bnphbiIsInNwX2xpdXhpZSIsInJlX3hpYWhvdXl1YW4iLCJiYW9zYW5uaWFuZyIsIm9sX2d1YW5zdW8iLCJyZV9zcF96aHVnZWxpYW5nIiwiemhhbmd5aSIsImhlcWkiLCJvbF96aGFuZ2xpYW8iLCJyZV9wYW5ndG9uZyIsInJlX2d1YW5xaXVqaWFuIl0sInNpbmdsZV9iYW5uZWRjYXJkcyI6WyJtdW5pdSJdLCJzaW5nbGVfY29udHJvbF9tb2RlX2NvbmZpZ19ib3NzIjp0cnVlLCJzaW5nbGVfY29udHJvbF9tb2RlX2NvbmZpZ19jaGVzcyI6ZmFsc2UsInNpbmdsZV9tb2RlX21vZGVfY29uZmlnX3NpbmdsZSI6ImNoYW5nYmFuIiwic2tpbGxfYW5pbWF0aW9uX3R5cGUiOiJkZWZhdWx0Iiwic2tpbGxfYmFyX21vZGVfY29uZmlnX3N0b25lIjp0cnVlLCJza2luIjp7InpodWdlamluIjoxLCJwYW5qdW4iOjEsImd1b2h1YWkiOjMsInJlX3podXJvbmciOjEsImhlcWkiOjMsInpodXpoaSI6MywibWl6aHUiOjIsInhpYWhvdXNoaSI6MSwiZ3VhbnN1byI6MiwiemhhbmdjaHVuaHVhIjoyLCJyZV9kZW5nYWkiOjQsInJlX2Nhb3BpIjoxLCJzdW54aXUiOjQsImNlbmh1biI6NCwiY2hlbmxpbiI6MiwicmVfY2FvY2FvIjoyLCJzaGVuX2xpdWJlaSI6MSwiZnV3YW4iOjEsImd1YW5waW5nIjoyLCJ5bF95dWFuc2h1IjozLCJjYW9ydWkiOjQsInJlX3poYW5namlhbyI6MywibHV6aGkiOjEsInJlX21hY2hhbyI6MX0sInNraXBfc2hhbiI6dHJ1ZSwic3BlY2lhbF9pZGVudGl0eV9tb2RlX2NvbmZpZ19pZGVudGl0eSI6ZmFsc2UsInNzYnhfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInN0b3JhZ2VJbXBvcnRlZCI6dHJ1ZSwic3dpcGUiOnRydWUsInN3aXBlX2Rvd24iOiJtZW51Iiwic3dpcGVfbGVmdCI6InN5c3RlbSIsInN3aXBlX3JpZ2h0Ijoic3lzdGVtIiwic3dpcGVfdXAiOiJhdXRvIiwic3luY19zcGVlZCI6ZmFsc2UsInRhZmFuZ19kaWZmaWN1bHR5X21vZGVfY29uZmlnX3RhZmFuZyI6IjIiLCJ0YWZhbmdfdHVybl9tb2RlX2NvbmZpZ190YWZhbmciOiIxMCIsInRhb19lbmVteSI6ZmFsc2UsInRhcmdldF9zaGFrZSI6InNoYWtlIiwidGR5eGpfbW9kZV9jb25maWdfd2FuZ3poZXpoaXpoYW4iOmZhbHNlLCJ0ZXh0ZXF1aXAiOiJpbWFnZSIsInRoZW1lIjoic2ltcGxlIiwidG9uZ2ppYW5nbW9zaGlfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvbmdxdWVkdW9wYW9fbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvbmd4aW5nemhpemhlbmdfbW9kZV9jb25maWdfYnJhd2wiOnRydWUsInRvdWNoc2NyZWVuIjpmYWxzZSwidHJhbnNwYXJlbnRfZGlhbG9nIjpmYWxzZSwidHVybmVkX3N0eWxlIjp0cnVlLCJ0d29fYXNzaWduX21vZGVfY29uZmlnX3ZlcnN1cyI6dHJ1ZSwidHdvX3BoYXNlc3dhcF9tb2RlX2NvbmZpZ192ZXJzdXMiOnRydWUsInVpX3pvb20iOiJ2c21hbGwiLCJ1cGRhdGVfbGluayI6ImNvZGluZyIsInZlcnNpb24iOiIxLjkuOTguNy4xIiwidmVyc3VzX2Jhbm5lZCI6WyJnb25nc3VuemFuIiwiZGVuZ2FpIiwiamlhbmd3ZWkiLCJiaWFuZnVyZW4iLCJjYW9jYW8iLCJvbGRfY2FvY2hvbmciLCJvbGRfY2FvY2h1biIsImNhb3BpIiwianNwX2Nhb3JlbiIsIm9sZF9jYW9yZW4iLCJvbGRfY2FveGl1Iiwib2xkX2Nhb3poZW4iLCJvbGRfY2hlbnF1biIsImN1aW1hbyIsImN1aXlhbiIsIm9sX2d1b2h1YWkiLCJndW9qaWEiLCJvbF9tYW5jaG9uZyIsIm5pdWppbiIsInNpbWF5aSIsIm9sZF93YW5neWkiLCJzcF94aWFob3VkdW4iLCJ4aWFob3VkdW4iLCJ4aWFob3V5dWFuIiwib2xfeGlueGlhbnlpbmciLCJ4dWh1YW5nIiwieHVueXUiLCJ4dXpodSIsInJlX3l1amluIiwieGluX3l1amluIiwieXVqaW4iLCJ6YW5nYmEiLCJ6aGFuZ2xpYW8iLCJ6aGVuamkiLCJvbGRfemhvbmdodWkiLCJmYXpoZW5nIiwiZ2FuZnVyZW4iLCJndWFueXUiLCJvbGRfZ3VhbnpoYW5nIiwiaHVhbmd5dWV5aW5nIiwiaHVhbmd6aG9uZyIsImppYW5nZmVpIiwib2xfbGlhb2h1YSIsImxpdWJlaSIsInNwX2xpdWJlaSIsIm1hY2hhbyIsIm9sZF9tYWRhaSIsIm9sZF9tYWxpYW5nIiwibWFzdSIsInpvdXNoaSIsImpzcF96aGFveXVuIiwiemhhbmdyZW4iLCJvbF96aGFuZ3JhbmciLCJ6aGFuZ2xpYW5nIiwiemhhbmdqaWFvIiwieXVqaSIsInJlX3l1YW5zaHUiLCJvbGRfeXVhbnNodSIsInJlX3l1YW5zaGFvIiwieWFud2VuIiwid2FuZ3l1biIsInRpYW5mZW5nIiwic3BfcGFuZ3RvbmciLCJtYXRlbmciLCJvbGRfbWFjaGFvIiwibHZidSIsIm9sX2xpdXl1IiwibGlydSIsImxpcXVlZ3Vvc2kiLCJvbGRfbGluZ2p1Iiwia29uZ3JvbmciLCJtaWZ1cmVuIiwicGFuZ3RvbmciLCJ3ZWl5YW4iLCJvbF93dXlpIiwic3BfeGlhaG91c2hpIiwieHVzaHUiLCJzcF96aGFuZ2ZlaSIsInpoYW5nZmVpIiwiemhhb3l1biIsInpodXJvbmciLCJvbGRfYnVsaWFuc2hpIiwiY2hlbmRvbmciLCJkYXFpYW8iLCJzcF9kYXFpYW8iLCJnYW5uaW5nIiwiamlhbmdxaW5nIiwiaHVhbmdnYWkiLCJvbGRfbGluZ3RvbmciLCJsdXh1biIsImx2ZmFuIiwibHZtZW5nIiwic3BfbHZtZW5nIiwib2xkX3F1YW5jb25nIiwic3VuamlhbiIsInN1bnF1YW4iLCJzdW5zaGFuZ3hpYW5nIiwieGlhb3FpYW8iLCJvbGRfeHVzaGVuZyIsIm9sZF96aG91dGFpIiwiemhvdXl1Iiwib2xkX3podWh1YW4iLCJvbF96aHVyYW4iLCJvbGRfemh1cmFuIiwib2xkX3podXpoaSIsImNhaXdlbmppIiwiZGlhb2NoYW4iLCJkb25nemh1byIsInNwX2Rvbmd6aHVvIiwib2xkX2Z1aHVhbmdob3UiLCJzcF9nYW5uaW5nIiwiaGFuYmEiLCJoYW5zdWkiLCJoZWppbiIsImh1YW5namlubGVpc2hpIiwiaHVhdHVvIiwiaHVheGlvbmciLCJvbGRfaHVheGlvbmciLCJqaWxpbmciLCJ6aHVnZWxpYW5nIiwib2xkX3podWdlemhhbiIsInNwX3poYW5namlhbyIsInJlX3l1amkiLCJ6dW9jaSIsImxpdXNoYW4iLCJzdW5jZSIsInpoYW5nemhhbmciLCJwYW5nZGUiLCJvbGRfemhhbmd4aW5nY2FpIiwicmVfd2Vpd2Vuemh1Z2V6aGkiLCJyZV94dWdvbmciLCJ6aGFuZ2dvbmciLCJvbGRfbWFqdW4iLCJyZV9zdW5jZSIsInJlX2RpYW53ZWkiLCJvbGRfeXVhbnNoYW8iLCJvbGRfZ3VhbnFpdWppYW4iLCJvbGRfaHVhbmdmdXNvbmciLCJvbF9saXVzaGFuIiwieGluX3l1YW5zaGFvIiwicmVfemhhbmdmZWkiLCJvbF9tYWxpYW5nIiwicmVfZ2Fvc2h1biIsInd1Z3VvdGFpIiwieHVzaGVuZyIsInhpbl94aWFob3VkdW4iLCJzcF9zaW1hemhhbyIsInNwX3dhbmd5dWFuamkiLCJzcF94aW54aWFueWluZyIsInNwX2dvbmdzdW56YW4iLCJzcF9saXV4aWUiLCJyZV94aWFob3V5dWFuIiwiYmFvc2FubmlhbmciLCJvbF9ndWFuc3VvIiwicmVfc3Bfemh1Z2VsaWFuZyIsInpoYW5neWkiLCJoZXFpIiwib2xfemhhbmdsaWFvIiwicmVfcGFuZ3RvbmciLCJyZV9ndWFucWl1amlhbiJdLCJ2ZXJzdXNfYmFubmVkY2FyZHMiOlsibXVuaXUiXSwidmVyc3VzX21vZGVfbW9kZV9jb25maWdfdmVyc3VzIjoidHdvIiwidmlkZW8iOiI1Iiwidmlld25leHRfbW9kZV9jb25maWdfZ3VvemhhbiI6ZmFsc2UsInZvbHVtbl9hdWRpbyI6Miwidm9sdW1uX2JhY2tncm91bmQiOjAsIndhdGNoZmFjZSI6Im5vbmUiLCJ3ZWl3b2R1enVuX21vZGVfY29uZmlnX2JyYXdsIjp0cnVlLCJ3am1zX2Zoc3hfbW9kZV9jb25maWdfd2ptcyI6ZmFsc2UsInd1amlubW9zaGlEUyI6MSwid3VqaW5tb3NoaURYQiI6MSwid3VqaW5tb3NoaURhbWFnZSI6MCwid3VqaW5tb3NoaURhbWFnZUkiOjAsInd1amlubW9zaGlEcmF3IjowLCJ3dWppbm1vc2hpRHJhd0kiOjAsInd1amlubW9zaGlFU2tpbGxFIjoibGp5aHNsX256cnlfbGlhbmd3dSIsInd1amlubW9zaGlISksiOjAsInd1amlubW9zaGlNQVhMQyI6MCwid3VqaW5tb3NoaU1BWExDV0oiOiIiLCJ3dWppbm1vc2hpTWF4SGFuZENhcmQiOjAsInd1amlubW9zaGlNYXhIYW5kQ2FyZEkiOjAsInd1amlubW9zaGlNYXhIcCI6MCwid3VqaW5tb3NoaU1heEhwSSI6MCwid3VqaW5tb3NoaVJlY292ZXIiOjAsInd1amlubW9zaGlSZWNvdmVySSI6MCwid3VqaW5tb3NoaVhSSyI6MCwid3VqaW5tb3NoaV9tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwid3V4aWVfcmlnaHQiOnRydWUsInd1eGllX3NlbGYiOmZhbHNlLCJ3dXhpbmdfZW5hYmxlX3BsYXlwYWNrY29uZmlnIjpmYWxzZSwid3V4aW5nX251bV9wbGF5cGFja2NvbmZpZyI6IjAuMyIsInlkZHdmaGRfbW9kZV9jb25maWdfa3pzZyI6ZmFsc2UsInlkZmpfbW9kZV9jb25maWdfa3pzZyI6MSwieXN3c19tb2RlX2NvbmZpZ19icmF3bCI6dHJ1ZSwieXhzZF9tb2RlX2NvbmZpZ19renNnIjoxLCJ6ZGdiY3Btc19tb2RlX2NvbmZpZ193YW5nemhlemhpemhhbiI6dHJ1ZSwiemRnYmNwbXNfbW9kZV9jb25maWdfd2ptcyI6dHJ1ZSwiemRnYmxzamxsX21vZGVfY29uZmlnX2t6c2ciOnRydWUsInpkZ2J4empzc2RfbW9kZV9jb25maWdfa3pzZyI6dHJ1ZSwiemhvbmdfY2FyZF9tb2RlX2NvbmZpZ19pZGVudGl0eSI6dHJ1ZSwiemh1X21vZGVfY29uZmlnX2NoZXNzIjpmYWxzZSwiemh1bGlhbl9tb2RlX2NvbmZpZ19ndW96aGFuIjp0cnVlLCLlsLjprYIiOjB9LCJkYXRhIjp7ImJvc3MiOnsiY3VycmVudCI6ImJvc3NfaHVuZHVuIiwidmVyc2lvbiI6IjEuOS45NS44LjIifSwiYnJhd2wiOnsic2NlbmUiOnt9LCJzdGFnZSI6e30sImN1cnJlbnRCcmF3bCI6InRvbmdqaWFuZ21vc2hpIiwidmVyc2lvbiI6IjEuOS45NiJ9LCJpZGVudGl0eSI6eyJsYWRkZXIiOnsiY3VycmVudCI6OTAwLCJ0b3AiOjkwMCwibW9udGgiOjExfSwidmVyc2lvbiI6IjEuOS45NiJ9LCJ2ZXJzdXMiOnsibGFkZGVyIjp7ImN1cnJlbnQiOjkwMCwidG9wIjo5MDAsIm1vbnRoIjoxfSwidmVyc2lvbiI6IjEuOS45OCIsImNob2ljZSI6MjAsInpodSI6dHJ1ZSwibm9yZXBsYWNlX2VuZCI6dHJ1ZSwiYXV0b3JlcGxhY2Vpbm5lcmh0bWwiOnRydWUsInNpbmdsZV9jb250cm9sIjp0cnVlLCJudW1iZXIiOjMsInZlcnN1c19yZXdhcmQiOjMsInZlcnN1c19wdW5pc2giOiLlvIPniYwiLCJyZXBsYWNlX251bWJlciI6MywiY3Jvc3Nfc2VhdCI6ZmFsc2UsInJhbmRvbV9zZWF0IjpmYWxzZSwib25seV96aHUiOnRydWUsIm1haW5femh1IjpmYWxzZSwiYXNzaWduX2VuZW15IjpmYWxzZSwic2VhdF9vcmRlciI6IuWvuemYtSJ9fX0=";
            }
            if (!data)
                return;
            try {
                var parseData = lib.init.decode(data);
                data = JSON.parse(parseData);
                if (!data || typeof data != 'object') {
                    throw ('err');
                }
                if (lib.db && (!data.config || !data.data)) {
                    throw ('err');
                }
                if (data) {
                    delete data.config.extensions;
                    data.config.auto_check_update = false;
                    data.config.asset_version = lib.config.asset_version;
                    data.config.target_shake = "zoom";
                    data.config.extension_十周年UI_campIdentityImageMode = true;
                    data.config.extension_十周年UI_cardSecondaryNameVisible = true;
                    data.config.extension_boss_enable = false;
                    data.config.extension_未来科技_KJfiel = true;
                    var noname_default_load_inited = localStorage.getItem(lib.configprefix + 'default_load_inited');
                    if (!noname_default_load_inited) {
                        localStorage.setItem(lib.configprefix + 'default_load_inited', true);
                    }
                    else {
                        return;
                    }
                }
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (!lib.db) {
                var noname_inited = localStorage.getItem('noname_inited');
                var onlineKey = localStorage.getItem(lib.configprefix + 'key');
                localStorage.clear();
                if (noname_inited) {
                    localStorage.setItem('noname_inited', noname_inited);
                }
                if (onlineKey) {
                    localStorage.setItem(lib.configprefix + 'key', onlineKey);
                }
                for (var i in data) {
                    localStorage.setItem(i, data[i]);
                }
            }
            else {
                for (var i in data.config) {
                    game.putDB('config', i, data.config[i]);
                    lib.config[i] = data.config[i];
                }
                for (var i in data.data) {
                    game.putDB('data', i, data.data[i]);
                }
            }
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "标记优化扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.player.markAutoBySpecial = function (name, datas, noToSpecial, nolog) {
                if (get.itemtype(datas) == "cards" && noToSpecial !== false) {
                    var areaList = [];
                    var orderingList = [];
                    var specialList = [];
                    for (var i = 0; i < datas.length; i++) {
                        var element = datas[i];
                        var type_1 = get.position(element, true);
                        switch (type_1) {
                            case "h":
                            case "j":
                            case "e":
                                areaList.push(element);
                                break;
                            case "o":
                                orderingList.push(element);
                                break;
                            default:
                                specialList.push(element);
                                break;
                        }
                    }
                    if (areaList.length) {
                        this.lose(areaList, ui.special, "visible", "toStorage");
                    }
                    if (orderingList.length) {
                        var evt = _status.event._trigger || _status.event.getParent();
                        if (evt && evt.orderingCards) {
                            evt.orderingCards.removeArray(orderingList);
                        }
                        game.cardsGotoSpecial(orderingList);
                    }
                    if (specialList.length) {
                        game.cardsGotoSpecial(specialList);
                    }
                }
                if (nolog !== false) {
                    var str = false;
                    var info = get.info(name);
                    if (info && info.marktext)
                        str = info.marktext;
                    else if (info && info.intro && (info.intro.name || info.intro.name2))
                        str = info.intro.name2 || info.intro.name;
                    else
                        str = lib.translate[name];
                    if (str)
                        game.log(this, '将', datas, '置于武将牌下,获得了', '#g【' + str + '】');
                }
                this.$gain2(datas);
                this.markAuto(name, datas);
                this.syncStorage(name);
            };
            lib.element.player.unmarkAutoBySpecial = function (name, datas, onLose, nolog) {
                var storage = this.getStorage(name);
                if (get.itemtype(datas) == "cards" && Array.isArray(storage)) {
                    var _datas = datas.slice(0);
                    for (var i = _datas.length - 1; i >= 0; i--) {
                        if (!storage.contains(_datas[i]))
                            _datas.splice(i, 1);
                    }
                    var info = lib.skill[name];
                    if (info && info.intro && info.intro.onunmark && !onLose) {
                        if (info.intro.onunmark == 'throw') {
                            this.$throw(_datas, 1000);
                            game.cardsDiscard(_datas);
                            if (nolog !== false)
                                game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                        }
                        else if (typeof info.intro.onunmark == 'function') {
                            info.intro.onunmark(_datas, this);
                        }
                    }
                    else if (onLose) {
                        switch (onLose) {
                            case "h":
                                this.gain(_datas, "fromStorage", this, "bySelf", "gain2");
                                break;
                            case "o":
                                var evt = _status.event._trigger || _status.event.getParent();
                                this.$throw(_datas, 1000);
                                game.cardsGotoOrdering(_datas).relatedEvent = evt;
                                if (nolog !== false)
                                    game.log('置于武将牌下的', _datas, '，进入了处理区');
                                break;
                            case "c":
                            default:
                                this.$throw(_datas, 1000);
                                if (nolog !== false)
                                    game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                                game.cardsDiscard(_datas);
                                break;
                        }
                    }
                    else {
                        this.$throw(_datas, 1000);
                        if (nolog !== false)
                            game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                        game.cardsDiscard(_datas);
                    }
                    this.unmarkAuto(name, _datas);
                }
                else {
                    this.unmarkAuto(name, datas);
                }
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "封装改判", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.content.replaceJudge = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                var next;
                var prompt = get.judegeTipPrompt(event.prompt, trigger);
                if (event.chooseType == "card") {
                    event._result = {
                        bool: true,
                        cards: [event.card],
                    };
                }
                else if (event.chooseType == "cards") {
                    next = player.chooseButton([prompt, event.cards, 'hidden']);
                    next.ai = function (button) {
                        var card = button.link;
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var judging = _status.event.judging;
                        var result = trigger.judge(card) - trigger.judge(judging);
                        var attitude = get.attitude(player, trigger.player);
                        return result * attitude;
                    };
                    next.set('judging', trigger.player.judging[0]);
                    if (event.filterButton) {
                        if (event.filterCardObj) {
                            next.filterButton = get.cardEnableRespondableFilter(event.filterCardObj);
                        }
                        else {
                            next.filterButton = event.filterButton;
                        }
                    }
                    else {
                        next.filterButton = function (button) {
                            var player = _status.event.player;
                            var card = button.link;
                            return lib.filter.cardEnableRespondable(card, player);
                        };
                    }
                }
                else {
                    next = player.chooseCard(prompt, event.filterCard, event.position);
                    next.ai = function (card) {
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var judging = _status.event.judging;
                        var result = trigger.judge(card) - trigger.judge(judging);
                        var attitude = get.attitude(player, trigger.player);
                        if (attitude == 0 || result == 0)
                            return 0;
                        if (attitude > 0) {
                            return result - get.value(card) / 2;
                        }
                        else {
                            return -result - get.value(card) / 2;
                        }
                    };
                    next.set('judging', trigger.player.judging[0]);
                }
                "step 1";
                if (result.bool) {
                    if (event.chooseType == "cards") {
                        result.cards = [result.buttons[0].link];
                    }
                    player.respond(result.cards, 'highlight', 'noOrdering');
                }
                else {
                    event.finish();
                }
                "step 2";
                if (result.bool) {
                    if (trigger.player.judging[0].clone) {
                        trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                        game.broadcast(function (card) {
                            if (card.clone) {
                                card.clone.classList.remove('thrownhighlight');
                            }
                        }, trigger.player.judging[0]);
                        game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                    }
                    event.judged = trigger.player.judging[0];
                    trigger.player.judging[0] = result.cards[0];
                    trigger.orderingCards.addArray(result.cards);
                    if (event.chooseType == "exchange" || event.exchange) {
                        player.gain(event.judged, "gain2");
                        trigger.orderingCards.remove(event.judged);
                    }
                    else {
                        game.cardsDiscard(trigger.player.judging[0]);
                        trigger.orderingCards.remove(event.judged);
                    }
                    game.log(trigger.player, '的判定牌改为', result.cards[0]);
                    game.delay(2);
                }
                else {
                    event.finish();
                }
                "step 3";
                player.changeJudge(event.judged, trigger);
            };
            lib.element.player.replaceJudge = function (params) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var next = game.createEvent('replaceJudge', false);
                next.player = this;
                if (arguments.length == 1) {
                    for (var key in arguments[0]) {
                        next[key] = params[key];
                    }
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (get.itemtype(arguments[i]) == 'player') {
                            next.source = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'cards') {
                            next.cards = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'card') {
                            next.cards = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'position') {
                            next.position = arguments[i];
                        }
                        else if (typeof arguments[i] == 'function') {
                            next.filterCard = arguments[i];
                        }
                        else if (typeof arguments[i] == 'object' && arguments[i]) {
                            if (arguments[i].name == "judge") {
                                next._trigger = arguments[i];
                            }
                            else {
                                next.filterCard = get.cardEnableRespondableFilter(arguments[i]);
                            }
                        }
                        else if (typeof arguments[i] == 'string') {
                            if (["card", "cards"].indexOf(arguments[i]) > -1) {
                                next.chooseType = arguments[i];
                            }
                            else if (arguments[i] == "exchange") {
                                next.exchange = true;
                            }
                            else
                                next.prompt = arguments[i];
                        }
                    }
                }
                if (!next.source)
                    next.source = _status.event._trigger.player;
                if (!next.prompt)
                    next.prompt = get.prompt(_status.event.name);
                if (!next.chooseType) {
                    if (next.card) {
                        next.chooseType = "card";
                    }
                    else if (next.cards) {
                        next.chooseType = "cards";
                    }
                    else {
                        next.chooseType = "replace";
                    }
                }
                if (next.chooseType == "replace") {
                    if (!next.position)
                        next.position = "he";
                    if (next.filterCard == undefined)
                        next.filterCard = lib.filter.cardEnableRespondable;
                    if (!params.filterCard && params.filterCardObj)
                        next.filterCard = get.cardEnableRespondableFilter(arguments[i]);
                }
                if (next.chooseType &&
                    next.chooseType == "cards" &&
                    next.cards == undefined) {
                    _status.event.next.remove(next);
                }
                else if (next.chooseType &&
                    next.chooseType == "card" &&
                    next.card == undefined) {
                    _status.event.next.remove(next);
                }
                if (!next.jTrigger)
                    next.jTrigger = _status.event._trigger;
                next._trigger = next.jTrigger;
                next.setContent('replaceJudge');
                next._args = Array.from(arguments);
                return next;
            };
            lib.element.player.changeJudge = function (cards, trigger) {
                var next = game.createEvent('changeJudge', false);
                next.player = this;
                if (get.itemtype(cards) == "card") {
                    next.cards = [cards];
                }
                else {
                    next.cards = cards;
                }
                if (next.cards == undefined || next.cards.length)
                    _status.event.next.remove(next);
                next.setContent(function (event) {
                    event.trigger("changeJudge");
                });
                next._args = Array.from(arguments);
                return next;
            };
            get.judegeTipPrompt = function (str, trigger) {
                if (lib.skill[str]) {
                    str = get.prompt(str);
                }
                return get.translation(trigger.player) + "\u7684" + (trigger.judgestr || '') + "\u7684\u5224\u5B9A\u4E3A" + get.translation(trigger.player.judging[0]) + "," + str;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "封装循环响应", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.content.chooseToRespondByAll = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (!event.sourceTrigger)
                    event.sourceTrigger = event.getParent()._trigger;
                event.respondPlayer = game.filterPlayer(event.filterPlayer).sort(lib.sort.seat);
                event.respondTargets = [];
                event.noRespondTargets = [];
                event.allPlayers = event.respondPlayer.concat();
                event.num = 0;
                "step 1";
                if (event.respondPlayer && event.respondPlayer.length) {
                    var current = event.respondPlayer.shift();
                    if (current)
                        event.current = current;
                    else
                        event.redo();
                }
                else {
                    event.goto(4);
                }
                "step 2";
                var _prompt;
                if (typeof event.prompt == "function") {
                    _prompt = event.prompt.apply(null, [event.sourceTrigger, player, event.current]);
                }
                else {
                    _prompt = event.prompt;
                }
                var _respondFunParms = [event, event.sourceTrigger, player, event.current, _prompt];
                event.respondFun.apply(null, _respondFunParms);
                "step 3";
                var resultBool = event.resultFun(result, player, event.current);
                if (resultBool) {
                    var _respondResultParms = [event, event.sourceTrigger, result, player, event.current];
                    event.respondResultFun.apply(null, _respondResultParms);
                    if (event.isContinue) {
                        event.goto(1);
                    }
                    event.respondTargets.push(event.current);
                }
                else {
                    event.goto(1);
                    event.noRespondTargets.push(event.current);
                }
                "step 4";
                if (!event._result) {
                    event._result = {
                        bool: event.respondTargets.length > 0,
                        noTargets: event.noRespondTargets,
                        targets: event.respondTargets,
                        notTargets: event.respondPlayer,
                        players: event.allPlayers,
                    };
                }
            };
            lib.element.player.chooseToRespondByAll = function (parames) {
                var next = game.createEvent('chooseToRespondByAll');
                next.player = this;
                for (var key in parames) {
                    var element = parames[key];
                    next[key] = element;
                }
                if (!next.filterPlayer) {
                    next.filterPlayer = lib.filter.all;
                }
                if (!next.resultFun) {
                    next.resultFun = function (result, player, current) {
                        return result.bool;
                    };
                }
                next.setContent('chooseToRespondByAll');
                next._args = Array.from(arguments);
                return next;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "改变回合阶段扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.player.changePhase = function () {
                var name = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    name[_i] = arguments[_i];
                }
                if (!name.length)
                    return;
                if (!this.name && !this.name)
                    return;
                if (name.contains(true)) {
                    this.changePhaseAllthetime = true;
                    name.remove(true);
                }
                if (!this.truephase)
                    this.truephase = this.phase;
                this.phase = function (skill) {
                    var next = game.createEvent('phase');
                    next.player = this;
                    this.changePhaseorder = name;
                    this.changePhaseordermarks = name.slice(0);
                    this.markSkill('_changePhase');
                    if (get.mode() == "guozhan")
                        next.setContent(this.name1 + 'changePhase');
                    else
                        next.setContent(this.name + 'changePhase');
                    if (!_status.roundStart) {
                        _status.roundStart = this;
                    }
                    if (skill) {
                        next.skill = skill;
                    }
                    return next;
                };
                if (get.mode() == "guozhan")
                    var b = this.name1;
                else
                    var b = this.name;
                lib.element.content[b + 'changePhase'] = function () {
                    "step 0";
                    var name = player.changePhaseorder[0];
                    if (!player[name])
                        event.goto(2);
                    player[name]();
                    "step 1";
                    if (player.changePhaseorder[0] == "phaseDraw") {
                        if (!player.noPhaseDelay) {
                            if (player == game.me) {
                                game.delay();
                            }
                            else {
                                game.delayx();
                            }
                        }
                    }
                    if (player.changePhaseorder[0] == "phaseUse") {
                        game.broadcastAll(function () {
                            if (ui.tempnowuxie) {
                                ui.tempnowuxie.close();
                                delete ui.tempnowuxie;
                            }
                        });
                    }
                    if (player.changePhaseorder[0] == "phaseDiscard") {
                        if (!player.noPhaseDelay)
                            game.delayx();
                    }
                    "step 2";
                    player.changePhaseorder.splice(0, 1);
                    if (player.changePhaseorder.length <= 0) {
                        delete player.using;
                        delete player._noSkill;
                        if (!player.changePhaseAllthetime) {
                            player.phase = player.truephase;
                            player.unmarkSkill('_changePhase');
                        }
                        return;
                    }
                    else
                        event.goto(0);
                };
                return this;
            };
            lib.skill._changePhase = {
                mark: true,
                popup: false,
                forced: true,
                nobracket: true,
                superCharlotte: true,
                unique: true,
                intro: {
                    content: function (content, player) {
                        var str = '';
                        if (player.changePhaseordermarks) {
                            str = '你现在的回合内阶段顺序分别为：<br>' + get.translation(player.changePhaseordermarks[0]);
                            for (var i = 1; i < player.changePhaseordermarks.length; i++) {
                                str += '、' + get.translation(player.changePhaseordermarks[i]);
                            }
                        }
                        return str;
                    },
                },
            };
            lib.translate.phaseZhunbei = "准备阶段";
            lib.translate.phaseJudge = "判定阶段";
            lib.translate.phaseDraw = "摸牌阶段";
            lib.translate.phaseUse = "出牌阶段";
            lib.translate.phaseDiscard = "弃牌阶段";
            lib.translate.phaseJieshu = "结束阶段";
            lib.translate._changePhase = '回合顺序';
            lib.element.player.resetChangePhase = function () {
                if (this.hasMark("_changePhase")) {
                    delete this.changePhaseAllthetime;
                    this.phase = this.truephase;
                    this.unmarkSkill('_changePhase');
                }
                return this;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人filter方法扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.filter.cardEnableRespondable = function (card, player) {
                var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                if (mod2 != 'unchanged')
                    return mod2;
                var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                if (mod != 'unchanged')
                    return mod;
                return true;
            };
            lib.filter.unequip = function (event, player, isNotUnequip2) {
                if (!isNotUnequip2 && player.hasSkillTag('unequip2'))
                    return true;
                if (event.source && event.source.hasSkillTag('unequip', false, {
                    name: event.card ? event.card.name : null,
                    target: player,
                    card: event.card
                }))
                    return true;
                return false;
            };
            lib.filter.isNotSelf = function (player, target) {
                return player != target;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人get方法扩展", 4, function (lib, game, ui, get, ai, _status) {
            get.getZJShaShiliCount = function (flag) {
                var countArray = [];
                var count = game.countPlayer(function (current) {
                    var info = get.character(current.name);
                    if (info && info[4].indexOf("ZJNGEx") > -1) {
                        var _info = info[5];
                        if (_info) {
                            if (flag) {
                                if (_info[0] == flag) {
                                    return true;
                                }
                            }
                            else {
                                if (!countArray.contains(_info[0])) {
                                    countArray.push(_info[0]);
                                    return true;
                                }
                            }
                        }
                    }
                });
                return count;
            };
            get.getZJShaShili = function (player) {
                var info = get.character(player.name);
                if (info && info[4].indexOf("ZJNGEx") > -1) {
                    return info[5] ? info[5][0] : "";
                }
                return "";
            };
            get.buttonIndex = function (button, dialog) {
                if (!dialog)
                    dialog = _status.event.dialog;
                var buttons = dialog ? dialog.buttons : [];
                return buttons.indexOf(button);
            };
            get.cardEnableRespondableFilter = function (exCard) {
                var _exCard;
                if (typeof exCard == "function") {
                }
                else if (get.objtype(exCard) == "object") {
                    _exCard = get.filter(exCard);
                }
                else {
                    _exCard = exCard;
                }
                var conditionFuns = [lib.filter.cardEnableRespondable];
                if (_exCard)
                    conditionFuns.push(_exCard);
                return lib.functionUtil.getConditon(4, conditionFuns);
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人player方法扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.player.putCardsToCardPile = function (cards, isBottom) {
                if (Array.isArray(cards)) {
                    while (cards.length) {
                        if (isBottom) {
                            ui.cardPile.insertBefore(cards.shift(), ui.cardPile.lastChild);
                        }
                        else {
                            ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
                        }
                    }
                }
                else {
                    if (isBottom) {
                        ui.cardPile.insertBefore(cards, ui.cardPile.lastChild);
                    }
                    else {
                        ui.cardPile.insertBefore(cards, ui.cardPile.firstChild);
                    }
                }
                game.updateRoundNumber();
                return this;
            };
            lib.element.player.curLoseHp = function () {
                return this.maxHp - this.hp;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "集成明置牌", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.content.choosePlayerCardByMingzhi = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (!event.dialog)
                    event.dialog = ui.create.dialog('hidden');
                else if (!event.isMine) {
                    event.dialog.style.display = 'none';
                }
                if (event.prompt) {
                    event.dialog.add(event.prompt);
                }
                else {
                    event.dialog.add('选择' + get.translation(target) + '的一张牌');
                }
                if (event.prompt2) {
                    event.dialog.addText(event.prompt2);
                }
                var directh = true;
                for (var i = 0; i < event.position.length; i++) {
                    if (event.position[i] == 'h') {
                        var hs = target.getCards('h');
                        if (hs.length) {
                            event.dialog.addText('手牌区');
                            hs.randomSort();
                            if (event.visible || target.isUnderControl(true)) {
                                event.dialog.add(hs);
                                directh = false;
                            }
                            else {
                                if (target.storage.mingzhi) {
                                    for (var j = 0; j < hs.length; j++) {
                                        if (target.storage.mingzhi.contains(hs[j])) {
                                            event.dialog.add([hs[j]]);
                                        }
                                        else {
                                            event.dialog.add([[hs[j]], 'blank']);
                                        }
                                    }
                                    directh = false;
                                }
                                else {
                                    event.dialog.add([hs, 'blank']);
                                }
                            }
                        }
                    }
                    else if (event.position[i] == 'e') {
                        var es = target.getCards('e');
                        if (es.length) {
                            event.dialog.addText('装备区');
                            event.dialog.add(es);
                            directh = false;
                        }
                    }
                    else if (event.position[i] == 'j') {
                        var js = target.getCards('j');
                        if (js.length) {
                            event.dialog.addText('判定区');
                            event.dialog.add(js);
                            directh = false;
                        }
                    }
                }
                if (event.dialog.buttons.length == 0) {
                    event.finish();
                    return;
                }
                var cs = target.getCards(event.position);
                var select = get.select(event.selectButton);
                if (event.forced && select[0] >= cs.length) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons,
                        links: cs
                    };
                }
                else if (event.forced && directh && select[0] == select[1]) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons.randomGets(select[0]),
                        links: []
                    };
                    for (var i = 0; i < event.result.buttons.length; i++) {
                        event.result.links[i] = event.result.buttons[i].link;
                    }
                }
                else {
                    if (event.isMine()) {
                        event.dialog.open();
                        game.check();
                        game.pause();
                    }
                    else if (event.isOnline()) {
                        event.send();
                    }
                    else {
                        event.result = 'ai';
                    }
                }
                "step 1";
                if (event.result == 'ai') {
                    game.check();
                    if (ai.basic.chooseButton(event.ai) || forced)
                        ui.click.ok();
                    else
                        ui.click.cancel();
                }
                event.dialog.close();
                if (event.result.links) {
                    event.result.cards = event.result.links.slice(0);
                }
                event.resume();
            };
            lib.element.content.discardPlayerCardByMingzhi = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (event.directresult) {
                    event.result = {
                        buttons: [],
                        cards: event.directresult.slice(0),
                        links: event.directresult.slice(0),
                        targets: [],
                        confirm: 'ok',
                        bool: true
                    };
                    event.cards = event.directresult.slice(0);
                    event.goto(2);
                    return;
                }
                if (!event.dialog)
                    event.dialog = ui.create.dialog('hidden');
                else if (!event.isMine) {
                    event.dialog.style.display = 'none';
                }
                if (event.prompt == undefined) {
                    var str = '弃置' + get.translation(target);
                    var range = get.select(event.selectButton);
                    if (range[0] == range[1])
                        str += get.cnNumber(range[0]);
                    else if (range[1] == Infinity)
                        str += '至少' + get.cnNumber(range[0]);
                    else
                        str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                    str += '张';
                    if (event.position == 'h' || event.position == undefined)
                        str += '手';
                    if (event.position == 'e')
                        str += '装备';
                    str += '牌';
                    event.prompt = str;
                }
                if (event.prompt) {
                    event.dialog.add(event.prompt);
                }
                if (event.prompt2) {
                    event.dialog.addText(event.prompt2);
                }
                var directh = true;
                for (var i = 0; i < event.position.length; i++) {
                    if (event.position[i] == 'h') {
                        var hs = target.getDiscardableCards(player, 'h');
                        if (hs.length) {
                            event.dialog.addText('手牌区');
                            hs.randomSort();
                            if (event.visible || target.isUnderControl(true)) {
                                event.dialog.add(hs);
                                directh = false;
                            }
                            else {
                                if (target.storage.mingzhi) {
                                    for (var j = 0; j < hs.length; j++) {
                                        if (target.storage.mingzhi.contains(hs[j])) {
                                            event.dialog.add([hs[j]]);
                                        }
                                        else {
                                            event.dialog.add([[hs[j]], 'blank']);
                                        }
                                    }
                                    directh = false;
                                }
                                else {
                                    event.dialog.add([hs, 'blank']);
                                }
                            }
                        }
                    }
                    else if (event.position[i] == 'e') {
                        var es = target.getDiscardableCards(player, 'e');
                        if (es.length) {
                            event.dialog.addText('装备区');
                            event.dialog.add(es);
                            directh = false;
                        }
                    }
                    else if (event.position[i] == 'j') {
                        var js = target.getDiscardableCards(player, 'j');
                        if (js.length) {
                            event.dialog.addText('判定区');
                            event.dialog.add(js);
                            directh = false;
                        }
                    }
                }
                if (event.dialog.buttons.length == 0) {
                    event.finish();
                    return;
                }
                var cs = target.getCards(event.position);
                var select = get.select(event.selectButton);
                if (event.forced && select[0] >= cs.length) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons,
                        links: cs
                    };
                }
                else if (event.forced && directh && select[0] == select[1]) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons.randomGets(select[0]),
                        links: []
                    };
                    for (var i = 0; i < event.result.buttons.length; i++) {
                        event.result.links[i] = event.result.buttons[i].link;
                    }
                }
                else {
                    if (event.isMine()) {
                        event.dialog.open();
                        game.check();
                        game.pause();
                    }
                    else if (event.isOnline()) {
                        event.send();
                    }
                    else {
                        event.result = 'ai';
                    }
                }
                "step 1";
                if (event.result == 'ai') {
                    game.check();
                    if (ai.basic.chooseButton(event.ai) || forced)
                        ui.click.ok();
                    else
                        ui.click.cancel();
                }
                event.dialog.close();
                "step 2";
                event.resume();
                if (event.result.bool && event.result.links && !game.online) {
                    if (event.logSkill) {
                        if (typeof event.logSkill == 'string') {
                            player.logSkill(event.logSkill);
                        }
                        else if (Array.isArray(event.logSkill)) {
                            player.logSkill.apply(player, event.logSkill);
                        }
                    }
                    var cards = [];
                    for (var i = 0; i < event.result.links.length; i++) {
                        cards.push(event.result.links[i]);
                    }
                    event.result.cards = event.result.links.slice(0);
                    event.cards = cards;
                    event.trigger("rewriteDiscardResult");
                }
                "step 3";
                if (event.boolline) {
                    player.line(target, 'green');
                }
                if (!event.chooseonly) {
                    var next = target.discard(event.cards, 'notBySelf');
                    if (event.delay === false) {
                        next.set('delay', false);
                    }
                }
            };
            lib.element.content.gainPlayerCardByMingzhi = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (event.directresult) {
                    event.result = {
                        buttons: [],
                        cards: event.directresult.slice(0),
                        links: event.directresult.slice(0),
                        targets: [],
                        confirm: 'ok',
                        bool: true
                    };
                    event.cards = event.directresult.slice(0);
                    event.goto(2);
                    return;
                }
                if (!event.dialog)
                    event.dialog = ui.create.dialog('hidden');
                else if (!event.isMine) {
                    event.dialog.style.display = 'none';
                }
                if (event.prompt == undefined) {
                    var str = '获得' + get.translation(target);
                    var range = get.select(event.selectButton);
                    if (range[0] == range[1])
                        str += get.cnNumber(range[0]);
                    else if (range[1] == Infinity)
                        str += '至少' + get.cnNumber(range[0]);
                    else
                        str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                    str += '张';
                    if (event.position == 'h' || event.position == undefined)
                        str += '手';
                    if (event.position == 'e')
                        str += '装备';
                    str += '牌';
                    event.prompt = str;
                }
                if (event.prompt) {
                    event.dialog.add(event.prompt);
                }
                if (event.prompt2) {
                    event.dialog.addText(event.prompt2);
                }
                var directh = true;
                for (var i = 0; i < event.position.length; i++) {
                    if (event.position[i] == 'h') {
                        var hs = target.getGainableCards(player, 'h');
                        if (hs.length) {
                            event.dialog.addText('手牌区');
                            hs.randomSort();
                            if (event.visible || target.isUnderControl(true)) {
                                event.dialog.add(hs);
                                directh = false;
                            }
                            else {
                                if (target.storage.mingzhi) {
                                    for (var j = 0; j < hs.length; j++) {
                                        if (target.storage.mingzhi.contains(hs[j])) {
                                            event.dialog.add([hs[j]]);
                                        }
                                        else {
                                            event.dialog.add([[hs[j]], 'blank']);
                                        }
                                    }
                                    directh = false;
                                }
                                else {
                                    event.dialog.add([hs, 'blank']);
                                }
                            }
                        }
                    }
                    else if (event.position[i] == 'e') {
                        var es = target.getGainableCards(player, 'e');
                        if (es.length) {
                            event.dialog.addText('装备区');
                            event.dialog.add(es);
                            directh = false;
                        }
                    }
                    else if (event.position[i] == 'j') {
                        var js = target.getGainableCards(player, 'j');
                        if (js.length) {
                            event.dialog.addText('判定区');
                            event.dialog.add(js);
                            directh = false;
                        }
                    }
                }
                if (event.dialog.buttons.length == 0) {
                    event.dialog.close();
                    event.finish();
                    return;
                }
                var cs = target.getCards(event.position);
                var select = get.select(event.selectButton);
                if (event.forced && select[0] >= cs.length) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons,
                        links: cs
                    };
                }
                else if (event.forced && directh && select[0] == select[1] && !target.storage.mingzhi) {
                    event.result = {
                        bool: true,
                        buttons: event.dialog.buttons.randomGets(select[0]),
                        links: []
                    };
                    for (var i = 0; i < event.result.buttons.length; i++) {
                        event.result.links[i] = event.result.buttons[i].link;
                    }
                }
                else {
                    if (event.isMine()) {
                        event.dialog.open();
                        game.check();
                        game.pause();
                    }
                    else if (event.isOnline()) {
                        event.send();
                    }
                    else {
                        event.result = 'ai';
                    }
                }
                "step 1";
                if (event.result == 'ai') {
                    game.check();
                    if (ai.basic.chooseButton(event.ai) || forced)
                        ui.click.ok();
                    else
                        ui.click.cancel();
                }
                event.dialog.close();
                "step 2";
                event.resume();
                if (game.online || !event.result.bool) {
                    event.finish();
                }
                "step 3";
                if (event.logSkill && event.result.bool && !game.online) {
                    if (typeof event.logSkill == 'string') {
                        player.logSkill(event.logSkill);
                    }
                    else if (Array.isArray(event.logSkill)) {
                        player.logSkill.apply(player, event.logSkill);
                    }
                }
                var cards = [];
                for (var i = 0; i < event.result.links.length; i++) {
                    cards.push(event.result.links[i]);
                }
                event.result.cards = event.result.links.slice(0);
                event.cards = cards;
                event.trigger("rewriteGainResult");
                "step 4";
                if (event.boolline) {
                    player.line(target, 'green');
                }
                if (!event.chooseonly) {
                    var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
                    if (event.delay === false) {
                        next.set('delay', false);
                    }
                }
                else
                    target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
            };
            lib.element.content.loseByMingzhi = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                var hs = [], es = [], js = [];
                var hej = player.getCards('hej');
                event.stockcards = cards.slice(0);
                for (var i = 0; i < cards.length; i++) {
                    cards[i].style.transform += ' scale(0.2)';
                    cards[i].classList.remove('glow');
                    cards[i].recheck();
                    var info = lib.card[cards[i].name];
                    if (info.destroy || cards[i]._destroy) {
                        cards[i].delete();
                        cards[i].destroyed = info.destroy || cards[i]._destroy;
                    }
                    else if (event.position) {
                        if (_status.discarded) {
                            if (event.position == ui.discardPile) {
                                _status.discarded.add(cards[i]);
                            }
                            else {
                                _status.discarded.remove(cards[i]);
                            }
                        }
                        cards[i].goto(event.position);
                    }
                    else {
                        cards[i].delete();
                    }
                    if (player.storage.mingzhi && player.storage.mingzhi.contains(cards[i])) {
                        if (player.storage.mingzhi.length == 1) {
                            delete player.storage.mingzhi;
                            player.unmarkSkill('mingzhi');
                        }
                        else {
                            player.storage.mingzhi.remove(cards[i]);
                            player.syncStorage('mingzhi');
                        }
                    }
                    if (!hej.contains(cards[i])) {
                        cards.splice(i--, 1);
                    }
                    else if (cards[i].parentNode) {
                        if (cards[i].parentNode.classList.contains('equips')) {
                            cards[i].original = 'e';
                            es.push(cards[i]);
                        }
                        else if (cards[i].parentNode.classList.contains('judges')) {
                            cards[i].original = 'j';
                            js.push(cards[i]);
                        }
                        else if (cards[i].parentNode.classList.contains('handcards')) {
                            cards[i].original = 'h';
                            hs.push(cards[i]);
                        }
                        else {
                            cards[i].original = null;
                        }
                    }
                }
                if (player == game.me)
                    ui.updatehl();
                ui.updatej(player);
                game.broadcast(function (player, cards, num) {
                    for (var i = 0; i < cards.length; i++) {
                        cards[i].classList.remove('glow');
                        cards[i].delete();
                    }
                    if (player == game.me) {
                        ui.updatehl();
                    }
                    ui.updatej(player);
                    _status.cardPileNum = num;
                }, player, cards, ui.cardPile.childNodes.length);
                game.addVideo('lose', player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js)]);
                player.update();
                game.addVideo('loseAfter', player);
                event.num = 0;
                "step 1";
                if (num < cards.length) {
                    if (cards[num].original == 'e') {
                        event.loseEquip = true;
                        player.removeEquipTrigger(cards[num]);
                        var info = get.info(cards[num]);
                        if (info.onLose && (!info.filterLose || info.filterLose(cards[num], player))) {
                            event.goto(2);
                            return;
                        }
                    }
                    event.num++;
                    event.redo();
                }
                else {
                    if (event.loseEquip) {
                        player.addEquipTrigger();
                    }
                    event.finish();
                }
                "step 2";
                var info = get.info(cards[num]);
                if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
                    player.popup(cards[num].name);
                    game.delayx();
                }
                if (Array.isArray(info.onLose)) {
                    for (var i = 0; i < info.onLose.length; i++) {
                        var next = game.createEvent('lose_' + cards[num].name);
                        next.setContent(info.onLose[i]);
                        if (info.forceDie)
                            next.forceDie = true;
                        next.player = player;
                        next.card = cards[num];
                    }
                }
                else {
                    var next = game.createEvent('lose_' + cards[num].name);
                    next.setContent(info.onLose);
                    next.player = player;
                    if (info.forceDie)
                        next.forceDie = true;
                    next.card = cards[num];
                }
                event.num++;
                event.goto(1);
            };
            lib.element.content.mingzhiCard = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                event.result = {};
                if (get.itemtype(cards) != 'cards') {
                    event.result.bool = false;
                    event.finish();
                    return;
                }
                if (!event.str) {
                    event.str = get.translation(player.name) + '明置了手牌';
                }
                event.dialog = ui.create.dialog(event.str, cards);
                event.dialogid = lib.status.videoId++;
                event.dialog.videoId = event.dialogid;
                if (event.hiddencards) {
                    for (var i = 0; i < event.dialog.buttons.length; i++) {
                        if (event.hiddencards.contains(event.dialog.buttons[i].link)) {
                            event.dialog.buttons[i].className = 'button card';
                            event.dialog.buttons[i].innerHTML = '';
                        }
                    }
                }
                game.broadcast(function (str, cards, cards2, id) {
                    var dialog = ui.create.dialog(str, cards);
                    dialog.videoId = id;
                    if (cards2) {
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (cards2.contains(dialog.buttons[i].link)) {
                                dialog.buttons[i].className = 'button card';
                                dialog.buttons[i].innerHTML = '';
                            }
                        }
                    }
                }, event.str, cards, event.hiddencards, event.dialogid);
                if (event.hiddencards) {
                    var cards2 = cards.slice(0);
                    for (var i = 0; i < event.hiddencards.length; i++) {
                        cards2.remove(event.hiddencards[i]);
                    }
                    game.log(player, '明置了', cards2);
                }
                else {
                    game.log(player, '明置了', cards);
                }
                game.delayx(2);
                game.addVideo('showCards', player, [event.str, get.cardsInfo(cards)]);
                "step 1";
                game.broadcast('closeDialog', event.dialogid);
                event.dialog.close();
                if (!player.storage.mingzhi)
                    player.storage.mingzhi = cards;
                else
                    player.storage.mingzhi = player.storage.mingzhi.concat(cards);
                player.markSkill('mingzhi');
                event.result.bool = true;
                event.result.cards = cards;
            };
            lib.element.content.chooseMingzhiCard = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                    event.finish();
                    return;
                }
                player.choosePlayerCard.applay(player, [
                    event.selectButton, event.forced, event.prompt, "h", event.ai
                ]);
                next.set("filterButton", event.filterButton);
                "step 1";
                if (result && result.bool && result.cards) {
                    var str = event.str ? event.str : "";
                    player.mingzhiCard(result.cards, str);
                }
                event.result = result;
            };
            lib.element.content.removeMingzhiCard = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                event.result = {};
                if (get.itemtype(cards) != 'cards') {
                    event.finish();
                    event.result.bool = false;
                    return;
                }
                if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                    event.result.bool = false;
                    event.finish();
                    return;
                }
                game.log(player, '取消明置了', cards);
                player.storage.mingzhi.removeArray(event.cards);
                if (player.storage.mingzhi.length) {
                    player.syncStorage("mingzhi");
                    player.markSkill('mingzhi');
                }
                else {
                    delete player.storage.mingzhi;
                    player.unmarkSkill('mingzhi');
                }
                event.result.bool = true;
                event.result.cards = event.cards;
            };
            lib.element.content.chooseRemoveMingzhiCard = function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                "step 0";
                if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                    event.finish();
                    return;
                }
                var next = player.choosePlayerCard.applay(player, [
                    event.target, event.selectButton, event.forced, event.prompt, "h", event.ai
                ]);
                next.set("filterButton", event.filterButton);
                "step 1";
                if (result && result.bool && result.links) {
                    player.removeMingzhiCard(result.links);
                }
                result.cards = result.links;
                event._result = result;
            };
            lib.element.player.mingzhiCard = function (cards, str) {
                var next = game.createEvent('mingzhiCard');
                next.player = this;
                next.str = str;
                if (typeof cards == 'string') {
                    str = cards;
                    cards = next.str;
                    next.str = str;
                }
                if (get.itemtype(cards) == 'card')
                    next.cards = [cards];
                else if (get.itemtype(cards) == 'cards')
                    next.cards = cards;
                var mingzhiCards = this.getMingzhiCard();
                for (var i = next.cards.length - 1; i >= 0; i--) {
                    var element = next.cards[i];
                    if (mingzhiCards.contains(element)) {
                        next.cards.splice(i, 1);
                    }
                }
                next.setContent('mingzhiCard');
                if (!Array.isArray(next.cards) || !next.cards.length) {
                    _status.event.next.remove(next);
                }
                next._args = Array.from(arguments);
                return next;
            };
            lib.element.player.chooseMingzhiCard = function () {
                var next = game.createEvent('chooseMingzhiCard');
                next.player = this;
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) == 'player') {
                        next.target = arguments[i];
                    }
                    else if (typeof arguments[i] == 'number') {
                        next.selectButton = [arguments[i], arguments[i]];
                    }
                    else if (get.itemtype(arguments[i]) == 'select') {
                        next.selectButton = arguments[i];
                    }
                    else if (typeof arguments[i] == 'boolean') {
                        next.forced = arguments[i];
                    }
                    else if (typeof arguments[i] == 'function') {
                        next.ai = arguments[i];
                    }
                    else if (typeof arguments[i] == 'string') {
                        if (next.prompt) {
                            next.str = arguments[i];
                        }
                        else {
                            next.prompt = arguments[i];
                        }
                    }
                }
                next.filterButton = function (button, player) {
                    return !lib.filter.filterMingzhiCard(player, button.link);
                };
                if (next.target == undefined)
                    next.target = this;
                if (next.selectButton == undefined)
                    next.selectButton = [1, 1];
                if (next.ai == undefined)
                    next.ai = function (button) {
                        var val = get.buttonValue(button);
                        if (get.attitude(_status.event.player, get.owner(button.link)) > 0)
                            return -val;
                        return val;
                    };
                next.setContent('chooseMingzhiCard');
                next._args = Array.from(arguments);
                if (next.player.countCards("h", function (card) {
                    return !lib.filter.filterMingzhiCard(next.player, card);
                })) {
                    _status.event.next.remove(next);
                }
                return next;
            };
            lib.element.player.removeMingzhiCard = function (cards) {
                var next = game.createEvent('removeMingzhiCard');
                next.player = this;
                if (get.itemtype(cards) == 'card')
                    next.cards = [cards];
                else if (get.itemtype(cards) == 'cards')
                    next.cards = cards;
                var mingzhiCards = this.getMingzhiCard();
                for (var i = next.cards.length - 1; i >= 0; i--) {
                    var element = next.cards[i];
                    if (!mingzhiCards.contains(element)) {
                        next.cards.splice(i, 1);
                    }
                }
                next.setContent('removeMingzhiCard');
                if (!Array.isArray(next.cards) || !next.cards.length) {
                    _status.event.next.remove(next);
                }
                next._args = Array.from(arguments);
                return next;
            };
            lib.element.player.chooseRemoveMingzhiCard = function () {
                var next = game.createEvent('chooseRemoveMingzhiCard');
                next.player = this;
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) == 'player') {
                        next.target = arguments[i];
                    }
                    else if (typeof arguments[i] == 'number') {
                        next.selectButton = [arguments[i], arguments[i]];
                    }
                    else if (get.itemtype(arguments[i]) == 'select') {
                        next.selectButton = arguments[i];
                    }
                    else if (typeof arguments[i] == 'boolean') {
                        next.forced = arguments[i];
                    }
                    else if (typeof arguments[i] == 'function') {
                        if (next.ai)
                            next.filterButton = arguments[i];
                        else
                            next.ai = arguments[i];
                    }
                    else if (typeof arguments[i] == 'object' && arguments[i]) {
                        next.filterButton = function (button, player) {
                            return get.filter(arguments[i])(button.link);
                        };
                    }
                    else if (typeof arguments[i] == 'string') {
                        next.prompt = arguments[i];
                    }
                }
                if (next.filterButton == undefined)
                    next.filterButton = lib.filter.all;
                next.filterButton = NG.FunctionUtil.getConditon(3, [
                    next.filterButton,
                    function (button, player) {
                        return lib.filter.filterMingzhiCard(player, button.link);
                    }
                ]);
                if (next.target == undefined)
                    next.target = this;
                if (next.selectButton == undefined)
                    next.selectButton = [1, 1];
                if (next.ai == undefined)
                    next.ai = function (button) {
                        var val = get.buttonValue(button);
                        if (get.attitude(_status.event.player, get.owner(button.link)) > 0)
                            return -val;
                        return val;
                    };
                next.setContent('chooseRemoveMingzhiCard');
                next._args = Array.from(arguments);
                if (next.player.countCards("h", function (card) {
                    return lib.filter.filterMingzhiCard(next.player, card);
                })) {
                    _status.event.next.remove(next);
                }
                return next;
            };
            lib.element.player.getMingzhiCard = function () {
                var getCards = [];
                if (this.storage.mingzhi && this.storage.mingzhi.length) {
                    getCards = this.storage.mingzhi.concat();
                }
                return getCards;
            };
            var tempchoosePlayerCard = lib.element.player.choosePlayerCard;
            lib.element.player.choosePlayerCard = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var next = this.choosePlayerCard.source.apply(this, args);
                if (this.getMingzhiCard().length) {
                    next.setContent("choosePlayerCardByMingzhi");
                }
                return next;
            };
            lib.element.player.choosePlayerCard.source = tempchoosePlayerCard;
            var tempdiscardPlayerCard = lib.element.player.discardPlayerCard;
            lib.element.player.discardPlayerCard = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var next = this.discardPlayerCard.source.apply(this, args);
                if (this.getMingzhiCard().length) {
                    next.setContent("discardPlayerCardByMingzhi");
                }
                return next;
            };
            lib.element.player.discardPlayerCard.source = tempdiscardPlayerCard;
            var tempgainPlayerCard = lib.element.player.gainPlayerCard;
            lib.element.player.gainPlayerCard = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var next = this.gainPlayerCard.source.apply(this, args);
                if (this.getMingzhiCard().length) {
                    next.setContent("gainPlayerCardByMingzhi");
                }
                return next;
            };
            lib.element.player.gainPlayerCard.source = tempgainPlayerCard;
            lib.skill._loseMingzhi = {
                trigger: {
                    global: "loseEnd"
                },
                forced: true,
                priority: 101,
                popup: false,
                forceDie: true,
                filter: function (event, player) {
                    if (player.storage.mingzhi && player.storage.mingzhi.length) {
                        return true;
                    }
                },
                content: function () {
                    event.cards = trigger.cards;
                    var mingzhiCard = [];
                    for (var i = 0; i < event.cards.length; i++) {
                        if (player.storage.mingzhi && player.storage.mingzhi.contains(event.cards[i])) {
                            if (player.storage.mingzhi.length == 1) {
                                delete player.storage.mingzhi;
                                player.unmarkSkill('mingzhi');
                            }
                            else {
                                player.storage.mingzhi.remove(event.cards[i]);
                                player.syncStorage('mingzhi');
                            }
                            mingzhiCard.push(event.cards[i]);
                        }
                    }
                    event.oCards = mingzhiCard;
                    if (event.oCards.length) {
                        event.source = trigger.player;
                        event.trigger("loseMingzhi");
                    }
                },
            };
            lib.skill.mingzhi = {
                intro: {
                    content: 'cards',
                },
            };
            lib.translate.mingzhi = '明置';
            lib.filter.filterMingzhiCard = function (player, card) {
                return player.storage.mingzhi && player.storage.mingzhi.contains(card);
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "收集player方法扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.content.swapJudge = function () {
                "step 0";
                game.log(player, '和', target, '交换了判定区中的牌');
                var j1 = player.getCards('j');
                if (target.storage._disableJudge) {
                    if (j1)
                        player.discard(j1);
                }
                var j2 = target.getCards('j');
                if (player.storage._disableJudge) {
                    if (j2)
                        target.discard(j2);
                }
                "step 1";
                event.cards = [player.getCards('j'), target.getCards('j')];
                player.lose(event.cards[0], ui.ordering, 'visible');
                target.lose(event.cards[1], ui.ordering, 'visible');
                if (event.cards[0].length)
                    player.$give(event.cards[0], target);
                if (event.cards[1].length)
                    target.$give(event.cards[1], player);
                "step 2";
                for (var i = 0; i < event.cards[1].length; i++) {
                    if (event.cards[1][i].viewAs)
                        player.addJudge({ name: event.cards[1][i].viewAs }, [event.cards[1][i]]);
                    else
                        player.addJudge(event.cards[1][i]);
                }
                for (var i = 0; i < event.cards[0].length; i++) {
                    if (event.cards[0][i].viewAs)
                        target.addJudge({ name: event.cards[0][i].viewAs }, [event.cards[0][i]]);
                    else
                        target.addJudge(event.cards[0][i]);
                }
            };
            lib.element.player.swapJudge = function (target) {
                var next = game.createEvent('swapJudge');
                next.player = this;
                next.target = target;
                next.setContent('swapJudge');
                return next;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "游戏流程全局技能扩展.", 4, function (lib, game, ui, get, ai, _status) {
            lib.skill._playerAudioByDie = {
                trigger: {
                    player: 'dieBegin',
                },
                priority: -Infinity,
                silent: true,
                ruleSkill: true,
                unique: true,
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    "step 0";
                    var exName = "ZJ联盟杀";
                    var name = "";
                    if (get.mode() == "guozhan")
                        name = player.name1;
                    else
                        name = player.name;
                    var name2 = player.name2;
                    var tags = lib.character[name][4];
                    if (name2)
                        var tags2 = lib.character[name2][4];
                    var audioList = [];
                    if (tags && tags.length) {
                        for (var i = 0; i < tags.length; i++) {
                            if (tags[i].indexOf('dieAudio:') == 0) {
                                audioList.push(tags[i].slice(9));
                            }
                        }
                    }
                    var audionum = audioList.length;
                    if (audionum) {
                        var num = get.rand(0, audionum - 1);
                        var audioname = audioList[num];
                        game.playAudio('..', 'extension', exName, audioname);
                    }
                    else {
                        game.playAudio('..', 'extension', exName, name + "_die");
                    }
                    if (name2 && tags2 && tags2.length) {
                        event.tags2 = tags2;
                        event.name = name2;
                    }
                    else {
                        event.finish();
                    }
                    "step 1";
                    var exName = "ZJ联盟杀";
                    var audioList = [];
                    var tags2 = event.tags2;
                    var name = event.name;
                    for (var i = 0; i < tags2.length; i++) {
                        if (tags2[i].indexOf('dieAudio:') == 0) {
                            audioList.push(tags2[i].slice(9));
                        }
                    }
                    var audionum = audioList.length;
                    if (audionum) {
                        var num = get.rand(0, audionum - 1);
                        var audioname = audioList[num];
                        game.playAudio('..', 'extension', exName, audioname);
                    }
                    else {
                        game.playAudio('..', 'extension', exName, name + "_die");
                    }
                },
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "重铸优化加强", 4, function (lib, game, ui, get, ai, _status) {
            lib.skill._chongzhu.filter = function (event, player) {
                return player.hasCard(function (card) {
                    return lib.skill._chongzhu.filterCard(card, player, event);
                });
            };
            lib.skill._chongzhu.filterCard = function (card, player, event) {
                event = event ? event : _status.event;
                player = player ? player : event.player;
                var skills = player.getSkills(true).concat(lib.skill.global);
                game.expandSkills(skills);
                for (var i = 0; i < skills.length; i++) {
                    var ifo = get.info(skills[i]);
                    if (ifo.viewAs && (ifo.viewAs.name == "tiesuo" || ifo.viewAs == "tiesuo")) {
                        if (!ifo.viewAsFilter || ifo.viewAsFilter(player)) {
                            if (ifo.filterCard && get.filter(ifo.filterCard)(card, player)) {
                                if (get.objtype(ifo.viewAs) != "object") {
                                    card = { name: ifo.viewAs };
                                }
                                else {
                                    card = ifo.viewAs;
                                }
                                break;
                            }
                        }
                    }
                    else {
                        var chongzhu = get.info(skills[i]).chongzhu;
                        if (typeof chongzhu == 'function' && chongzhu(card, event, player)) {
                            return true;
                        }
                        else if (chongzhu === true) {
                            return chongzhu;
                        }
                    }
                }
                var info = get.info(card);
                if (typeof info.chongzhu == 'function') {
                    return info.chongzhu(event, player);
                }
                return info.chongzhu;
            };
            lib.element.content.recast = function () {
                "step 0";
                game.log(player, '重铸了', cards);
                player.lose(cards, event.position);
                if (event.animate != false) {
                    event.discardid = lib.status.videoId++;
                    game.broadcastAll(function (player, cards, id) {
                        player.$throw(cards, null, 'nobroadcast');
                        var cardnodes = [];
                        cardnodes._discardtime = get.time();
                        for (var i = 0; i < cards.length; i++) {
                            if (cards[i].clone) {
                                cardnodes.push(cards[i].clone);
                            }
                        }
                        ui.todiscard[id] = cardnodes;
                    }, player, cards, event.discardid);
                    if (lib.config.sync_speed && cards[0] && cards[0].clone) {
                        if (event.delay != false) {
                            var waitingForTransition = get.time();
                            event.waitingForTransition = waitingForTransition;
                            cards[0].clone.listenTransition(function () {
                                if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                    game.resume();
                                }
                                delete event.waitingForTransition;
                            });
                        }
                        else if (event.getParent().discardTransition) {
                            delete event.getParent().discardTransition;
                            var waitingForTransition = get.time();
                            event.getParent().waitingForTransition = waitingForTransition;
                            cards[0].clone.listenTransition(function () {
                                if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                    game.resume();
                                }
                                delete event.getParent().waitingForTransition;
                            });
                        }
                    }
                }
                event.trigger('recast');
                "step 1";
                if (event.delay != false) {
                    if (event.waitingForTransition) {
                        _status.waitingForTransition = event.waitingForTransition;
                        game.pause();
                    }
                    else {
                        game.delayx();
                    }
                }
                "step 2";
                var num = 0;
                for (var i = 0; i < cards.length; i++) {
                    num++;
                }
                if (num > 0)
                    player.draw(num);
            };
            lib.element.player.recast = function () {
                var next = game.createEvent('recast');
                next.player = this;
                next.num = 0;
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) == 'player') {
                        next.source = arguments[i];
                    }
                    else if (get.itemtype(arguments[i]) == 'cards') {
                        next.cards = arguments[i];
                    }
                    else if (get.itemtype(arguments[i]) == 'card') {
                        next.cards = [arguments[i]];
                    }
                    else if (typeof arguments[i] == 'boolean') {
                        next.animate = arguments[i];
                    }
                    else if (get.objtype(arguments[i]) == 'div') {
                        next.position = arguments[i];
                    }
                }
                if (next.cards) {
                    var _targets = [];
                    next.cards.forEach(function (card) {
                        var _target = get.owner(card);
                        if (_targets.indexOf(_targets) == -1)
                            _targets.push(_target);
                    });
                    next.targets = _targets;
                }
                if (!next.source)
                    next.source = next.player;
                if (!next.position)
                    next.position = ui.discardPile;
                if (next.cards == undefined)
                    _status.event.next.remove(next);
                next.setContent('recast');
                next._args = Array.from(arguments);
                return next;
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "杀特殊功能扩展", 4, function (lib, game, ui, get, ai, _status) {
            lib.element.content.useModSha = function () {
                "step 0";
                if (event.unequip)
                    player.addSkill('unequip');
                if (event.direct)
                    player.addSkill('shadirectall');
                if (event.baseDamage) {
                    player.storage.KJmodSha_baseDamage = event.baseDamage;
                    player.addSkill('KJmodSha_baseDamage');
                }
                if (event.extraDamage) {
                    player.storage.KJmodSha_extraDamage = event.extraDamage;
                    player.addSkill('KJmodSha_extraDamage');
                }
                if (event.fengyin)
                    player.addSkill('tofengyin');
                if (event.loseHp)
                    player.addSkill('toloseHp');
                "step 1";
                player.useCard.apply(player, event.arg);
                "step 2";
                if (event.unequip)
                    player.removeSkill('unequip');
                if (event.direct)
                    player.removeSkill('shadirectall');
                if (event.baseDamage) {
                    player.storage.KJmodSha_baseDamage = 0;
                    player.removeSkill('KJmodSha_baseDamage');
                }
                if (event.extraDamage) {
                    player.storage.KJmodSha_extraDamage = 0;
                    player.removeSkill('KJmodSha_extraDamage');
                }
                if (event.fengyin)
                    player.removeSkill('tofengyin');
                if (event.loseHp)
                    player.removeSkill('toloseHp');
            };
            lib.element.player.useModSha = function () {
                var X = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    X[_i] = arguments[_i];
                }
                var next = game.createEvent('useModSha', false);
                var card = { name: "sha" };
                next._args = X.concat();
                for (var i = 0; i < X.length; i++) {
                    if (get.itemtype(X[i]) == 'card') {
                        var dinged = true;
                    }
                    else if (get.itemtype(X[i]) == 'object') {
                        var mod = X[i];
                        X.remove(X[i]);
                    }
                }
                if (!dinged)
                    X.push(card);
                if (mod) {
                    for (var i in mod) {
                        switch (i) {
                            case 'unequip':
                                next.unequip = true;
                                break;
                            case 'baseDamage':
                                next.baseDamage = mod[i];
                                break;
                            case 'extraDamage':
                                next.extraDamage = mod[i];
                                break;
                            case 'direct':
                                next.direct = true;
                                break;
                            case 'fengyin':
                                next.fengyin = true;
                                break;
                            case 'loseHp':
                                next.loseHp = true;
                                break;
                            case 'extraSha':
                                X.push(false);
                                break;
                            case 'nature':
                                card.nature = mod[i];
                                break;
                            case 'func':
                                next.func = mod[i];
                                break;
                        }
                    }
                }
                next.arg = X;
                next.player = this;
                next.setContent("useModSha");
                return next;
            };
            lib.skill.KJmodSha_baseDamage = {
                trigger: { player: 'useCard' },
                filter: function (event) {
                    return event.card && event.card.name == 'sha';
                },
                forced: true,
                popup: false,
                unique: true,
                direct: true,
                superCharlotte: true,
                charlotte: true,
                content: function () {
                    if (!trigger.baseDamage)
                        trigger.baseDamage = 1;
                    trigger.baseDamage += player.storage.KJmodSha_baseDamage;
                },
            };
            lib.skill.KJmodSha_extraDamage = {
                audio: 2,
                trigger: { player: 'shaBegin' },
                forced: true,
                popup: false,
                unique: true,
                direct: true,
                superCharlotte: true,
                charlotte: true,
                content: function () {
                    if (typeof trigger.extraDamage != 'number')
                        trigger.extraDamage = 0;
                    trigger.extraDamage += player.storage.KJmodSha_extraDamage;
                },
            };
            lib.skill.shabasenum = {
                trigger: { player: 'useCard' },
                filter: function (event) {
                    return event.card && event.card.name == 'sha';
                },
                forced: true,
                popup: false,
                unique: true,
                superCharlotte: true,
                charlotte: true,
                content: function () {
                    if (!trigger.baseDamage)
                        trigger.baseDamage = 1;
                    trigger.baseDamage++;
                },
            };
            lib.skill.shadirect = {
                trigger: { player: 'useCardToPlayered' },
                forced: true,
                popup: false,
                unique: true,
                charlotte: true,
                superCharlotte: true,
                filter: function (event, player) {
                    return event.card.name == 'sha';
                },
                content: function () {
                    trigger.getParent().directHit.push(trigger.target);
                },
            };
            lib.skill.shadirectall = {
                trigger: { player: 'shaBegin' },
                forced: true,
                popup: false,
                unique: true,
                charlotte: true,
                superCharlotte: true,
                content: function () {
                    trigger.directHit = true;
                },
            };
            lib.skill.tofengyin = {
                init: function (player, skill) {
                    var skills = player.getSkills(true, false);
                    for (var i = 0; i < skills.length; i++) {
                        if (get.skills[i]) {
                            skills.splice(i--, 1);
                        }
                    }
                    player.disableSkill(skill, skills);
                },
                onremove: function (player, skill) {
                    player.enableSkill(skill);
                },
                mark: true,
                superCharlotte: true,
                locked: true,
                intro: {
                    content: function (storage, player, skill) {
                        var list = [];
                        for (var i in player.disabledSkills) {
                            if (player.disabledSkills[i].contains(skill)) {
                                list.push(i);
                            }
                        }
                        if (list.length) {
                            var str = '失效技能：';
                            for (var i = 0; i < list.length; i++) {
                                if (lib.translate[list[i] + '_info']) {
                                    str += get.translation(list[i]) + '、';
                                }
                            }
                            return str.slice(0, str.length - 1);
                        }
                    },
                },
            };
            lib.translate.tofengyin = '封印';
            lib.skill.toloseHp = {
                trigger: { source: 'damageBegin2' },
                silent: true,
                unique: true,
                filter: function (event, player) {
                    return event.num > 0;
                },
                content: function () {
                    trigger.cancel();
                    trigger.player.loseHp(trigger.num);
                },
            };
            lib.translate.toloseHp = "流失体力";
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "XSSP-0001", 1, function (lib, game, ui, get, ai, _status) {
            var output = {
                name: "XSSP-0001",
                nickName: "测试人物1-xxx",
                character: ["male", "wei", "3/4", ["zj_shili_lianyu", "zj_shenwei", "zj_weirong"], ['ZJNGEx'], ['狱', 4]],
                characterTitle: "xxxxxxx  势力:狱",
                characterIntro: "ZJ联盟杀的人物",
                skill: {},
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "SkipPhaseSkill", 3, function (lib, game, ui, get, ai, _status) {
            var SkipPhaseSkill = {
                zj_skip_Judge: {
                    name: "判定阶段",
                    description: "跳过玩家判定阶段",
                    trigger: {
                        player: "judge" + "Before"
                    },
                    forced: true,
                    content: function (event, player, trigger, result) {
                        trigger.cancel();
                    }
                },
                zj_skip_PhaseDraw: {
                    name: "抽牌阶段",
                    description: "跳过玩家抽牌阶段",
                    trigger: {
                        player: "phaseDraw" + "Before"
                    },
                    forced: true,
                    content: function (event, player, trigger, result) {
                        trigger.cancel();
                    }
                },
                zj_skip_PhaseUse: {
                    name: "出牌阶段",
                    description: "跳过玩家出牌阶段",
                    trigger: {
                        player: "phaseUse" + "Before"
                    },
                    forced: true,
                    content: function (event, player, trigger, result) {
                        trigger.cancel();
                    }
                },
                zj_skip_PhaseDiscard: {
                    name: "弃牌阶段",
                    description: "跳过玩家弃牌阶段",
                    trigger: {
                        player: "phaseDiscard" + "Before"
                    },
                    forced: true,
                    content: function (event, player, trigger, result) {
                        trigger.cancel();
                    }
                },
                zj_skip_Phase: {
                    name: "当前回合",
                    description: "跳过玩家当前回合",
                    trigger: {
                        player: "phase" + "Before"
                    },
                    forced: true,
                    content: function (event, player, trigger, result) {
                    }
                },
            };
            return SkipPhaseSkill;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "势力通用技能组", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "天使",
                description: NG.Utils.translateDescTxt("【主动技】[自]使用一张《血》时，[自]摸一张牌。"),
                trigger: {
                    player: "useCardTo" + "Begin",
                },
                frequent: true,
                filter: function (event, player) {
                    return get.name(event.card) == "tao";
                },
                content: function (event, player, trigger, result) {
                    player.draw(1);
                }
            };
            var skill12 = {
                name: "天使",
                description: NG.Utils.translateDescTxt("【被动技】[任]【天】使用一张《血》时，[自][摸]1 。"),
                audio: 5,
                trigger: {
                    global: "useCardTo" + "Begin",
                },
                frequent: true,
                filter: function (event, player) {
                    return get.name(event.card) == "tao" && get.getZJShaShili(event.player) == "\u5929";
                },
                content: function (event, player, trigger, result) {
                    player.draw(1);
                }
            };
            var skill2 = {
                name: "炼狱",
                description: NG.Utils.translateDescTxt("【被动技】[自][反面]，[自][翻面][自]视为对[他]使用一张《杀》。"),
                trigger: {
                    player: "turnOver" + "End",
                },
                filter: function (event, player) {
                    console.log("\u70BC\u72F1\u53D1\u52A8\u8FC7\u6EE4\u662F\u7684\u7FFB\u9762\u72B6\u6001\uFF1A" + (player.isTurnedOver() ? "翻面" : "翻回正面"));
                    return player.isTurnedOver();
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.turnOver(!player.isTurnedOver());
                    "step 1";
                    player.chooseTarget(1, true, function (card, player, target) {
                        return target != player;
                    }, "\u9009\u62E9\u4E00\u540D\u5176\u4ED6\u89D2\u8272\uFF0C\u89C6\u4E3A\u5BF9\u5176\u4F7F\u7528\u4E00\u5F20" + get.translation("sha"));
                    "step 2";
                    if (result && result.bool) {
                        var target = result.targets[0];
                        if (target) {
                            player.useCard({ name: "sha", isCard: true }, target, false);
                        }
                    }
                }
            };
            var skill22 = {
                name: "炼狱",
                description: NG.Utils.translateDescTxt("【被动技】[自][反][翻],[自]获得[他][场]的一张牌。"),
                trigger: {
                    player: "turnOver" + "End",
                },
                filter: function (event, player) {
                    return !player.isTurnedOver() && game.countPlayer(function (current) {
                        return player != current && current.countCards("ej") > 0;
                    }) > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.chooseTarget(function (card, player, target) {
                        return player != target && target.countCards("ej") > 0;
                    });
                    "step 1";
                    if (result.bool && result.targets.length) {
                        event.target = result.targets[0];
                        player.choosePlayerCard(result.targets[0], "ej");
                    }
                    "step 2";
                    if (result.bool && result.links.length) {
                        player.gain(result.links, event.target, "gain2");
                    }
                }
            };
            var skill222 = {
                name: "炼狱",
                description: NG.Utils.translateDescTxt("【被动技】[任]【狱】[反][翻]时，[自]获得[他][场]一张。 "),
                audio: 4,
                trigger: {
                    global: "turnOver" + "End",
                },
                filter: function (event, player) {
                    return !player.isTurnedOver() && game.countPlayer(function (current) {
                        return player != current && current.countCards("ej") > 0;
                    }) > 0 && get.getZJShaShili(event.player) == "\u72F1";
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.chooseTarget(function (card, player, target) {
                        return player != target && target.countCards("ej") > 0;
                    });
                    "step 1";
                    if (result.bool && result.targets.length) {
                        event.target = result.targets[0];
                        player.choosePlayerCard(result.targets[0], "ej");
                    }
                    "step 2";
                    if (result.bool && result.links.length) {
                        player.gain(result.links, event.target, "gain2");
                    }
                }
            };
            var skill3 = {
                name: "佛门",
                description: NG.Utils.translateDescTxt("[自]手牌上限+X(X=现存[佛]数+1)。"),
                mod: {
                    maxHandcard: function (player, num) {
                        return num + get.getZJShaShiliCount("\u4F5B");
                    },
                },
            };
            var exFoSkill1 = {
                name: "佛祖",
                description: NG.Utils.translateDescTxt("【被动技】 [自]获得技能“佛门”；[自]<摸>时，摸牌+1。"),
                audio: 2,
                group: ["zj_shili_fozu_1", "zj_shili_fozu_2"],
                subSkill: {
                    1: {
                        trigger: {
                            global: "gameDraw" + "Before",
                        },
                        description: NG.Utils.translateDescTxt("[自]获得技能“佛门”。"),
                        derivation: ["zj_shili_fomeng"],
                        silent: true,
                        content: function (event, player, trigger, result) {
                            player.removeAdditionalSkill("zj_shili_fozu_1");
                            player.addAdditionalSkill("zj_shili_fozu_1", "zj_shili_fomeng");
                        },
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("[自]<摸>时，摸牌+1。"),
                        trigger: {
                            player: "phaseDrawBegin",
                        },
                        silent: true,
                        content: function (event, player, trigger, result) {
                            trigger.num++;
                        },
                    }
                },
            };
            var exFoSkill2 = {
                name: "菩萨",
                description: NG.Utils.translateDescTxt("【被动技】[自]获得技能“佛门”；[自]<结束>时，[自][摸]1。"),
                audio: 2,
                group: ["zj_shili_pusha_1", "zj_shili_pusha_2"],
                subSkill: {
                    1: {
                        trigger: {
                            global: "gameDraw" + "Before",
                        },
                        silent: true,
                        description: NG.Utils.translateDescTxt("[自]获得技能“佛门”。"),
                        derivation: ["zj_shili_fomeng"],
                        content: function (event, player, trigger, result) {
                            player.removeAdditionalSkill("zj_shili_pusha_1");
                            player.addAdditionalSkill("zj_shili_pusha_1", "zj_shili_fomeng");
                        },
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("[自]<结束>时，[自][摸]1。"),
                        trigger: {
                            player: "phaseJieshuBegin",
                        },
                        silent: true,
                        content: function (event, player, trigger, result) {
                            player.draw();
                        },
                    }
                },
            };
            var skill4 = {
                name: "杀手",
                description: NG.Utils.translateDescTxt("【主动技】[自]将一张红色牌当《杀》使用/打出；[自]使用方块《杀》无距离限制。"),
                enable: ["chooseToUse", "chooseToRespond"],
                filter: function (event, player) {
                    return player.countCards("he", { color: "red" }) > 0;
                },
                selectCard: 1,
                position: "he",
                filterCard: function (card, player) {
                    return get.color(card) == "red";
                },
                viewAs: "sha",
                viewAsFilter: function (player) {
                    if (player.countCards("he", { color: "red" })) {
                        return true;
                    }
                    ;
                },
                prompt: "\u5C06\u4E00\u5F20\u7EA2\u8272\u724C\u5F53\u300A\u6740\u300B\u4F7F\u7528/\u6253\u51FA",
                mod: {
                    targetInRange: function (card, player, target) {
                        if (get.suit(card) == "diamond" && get.name(card) == "sha") {
                            return true;
                        }
                    }
                },
                check: lib.filter.all,
            };
            var skill42 = {
                name: "杀手",
                description: NG.Utils.translateDescTxt("【被动技】[自]额外使用《杀》次数+X(X=现存【杀】数)。"),
                audio: 3,
                mod: {
                    cardUsable: function (card, player, num) {
                        if (get.name(card, player) == "sha") {
                            return num + get.getZJShaShiliCount("\u6740");
                        }
                    },
                },
            };
            var skill5 = {
                name: "法师",
                description: NG.Utils.translateDescTxt("【被动技】[自]使用一张魔法牌时，展示牌堆顶一张牌，若是魔法牌获得之。"),
                trigger: {
                    player: "useCard",
                },
                filter: function (event, player) {
                    if (get.type2(event.card, player) == "trick") {
                        return true;
                    }
                },
                forced: true,
                frequent: true,
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.cards = get.cards(1);
                    player.showCards(event.cards);
                    "step 1";
                    if (event.cards && get.type(event.cards[0], "trick") == "trick") {
                        player.gain(event.cards);
                    }
                    else {
                        player.putCardsToCardPile(event.cards);
                    }
                }
            };
            var skill52 = {
                name: "法师",
                description: NG.Utils.translateDescTxt("【被动技】[任]【法】使用一张魔法牌时，[展]1，若是魔法牌获得之。"),
                audio: 4,
                trigger: {
                    global: "useCard",
                },
                filter: function (event, player) {
                    if (get.type2(event.card, player) == "trick" && get.getZJShaShili(event.player) == "\u6CD5") {
                        return true;
                    }
                },
                priority: 10,
                forced: true,
                frequent: true,
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.cards = get.cards(1);
                    player.showCards(event.cards);
                    "step 1";
                    if (event.cards && get.type(event.cards[0], "trick") == "trick") {
                        player.gain(event.cards);
                    }
                    else {
                        player.putCardsToCardPile(event.cards);
                    }
                }
            };
            var skill6 = {
                name: "龙族",
                description: NG.Utils.translateDescTxt("【被动技】[自]防止受到非[龙]的魔法牌的伤害。"),
                trigger: {
                    player: "damageBegin3",
                },
                forced: true,
                frequent: true,
                filter: function (event, player) {
                    if (event.source && get.getZJShaShili(event.source) == "\u9F8D")
                        return false;
                    return get.type2(event.card) == "trick";
                },
                content: function (event, player, trigger, result) {
                    player.popup("防止伤害");
                    trigger.cancel();
                },
                ai: {
                    notrick: true,
                },
            };
            var skill62 = {
                name: "龙族",
                description: NG.Utils.translateDescTxt("【被动技】[自]防止受到非【龙】使用的红色魔法牌的伤害。"),
                trigger: {
                    player: "damageBegin3",
                },
                forced: true,
                frequent: true,
                filter: function (event, player) {
                    if (event.source && get.getZJShaShili(event.source) == "\u9F8D")
                        return false;
                    return get.type2(event.card) == "trick" && get.color(event.card) == "red";
                },
                content: function (event, player, trigger, result) {
                    player.popup("防止伤害");
                    trigger.cancel();
                },
                ai: {
                    notrick: true,
                },
            };
            var skill7 = {
                name: "圣骑",
                description: NG.Utils.translateDescTxt("【被动技】[自]攻击距离+2。"),
                mod: {
                    attackFrom: function (from, to, range) {
                        return range - 2;
                    }
                },
            };
            var skill72 = {
                name: "圣骑",
                description: NG.Utils.translateDescTxt("【被动技】[自][距]-X(X=现存【骑】数)。"),
                mod: {
                    globalFrom: function (from, to, range) {
                        return range - 2;
                    }
                },
            };
            var skill8 = {
                name: "妖族",
                description: NG.Utils.translateDescTxt("【被动技】[自]<摸牌>+X(X=现存[妖]数)。"),
                trigger: {
                    player: "phaseDraw" + "Begin",
                },
                frequent: true,
                filter: function (event, player) {
                    return get.getZJShaShiliCount("\u5996") > 0;
                },
                content: function (event, player, trigger, result) {
                    trigger.num += get.getZJShaShiliCount("\u5996");
                }
            };
            var skill9 = {
                name: "魔神",
                description: NG.Utils.translateDescTxt("【被动技】[自]角色牌不会被横置和翻面。"),
                trigger: {
                    player: ["link" + "After", "turnOver" + "After"],
                },
                filter: lib.filter.all,
                forced: true,
                content: function (event, player, trigger, result) {
                    trigger.cancel();
                },
            };
            var skill10 = {
                name: "神魔",
                description: NG.Utils.translateDescTxt("【被动技】[自]角色牌不会被横置和翻面。"),
                audio: 3,
                trigger: {
                    player: ["link" + "Begin", "turnOver" + "Begin"],
                },
                filter: lib.filter.all,
                silent: true,
                content: function (event, player, trigger, result) {
                    if (event.triggername.indexOf("link") > -1) {
                        player.popup("不能被横置");
                    }
                    else {
                        player.popup("不能被翻面");
                    }
                    trigger.cancel();
                },
                ai: {
                    noLink: true,
                    noTurnover: true
                },
            };
            var skill11 = {
                name: "机界",
                description: NG.Utils.translateDescTxt("[自]非【机】使用的黑色通常魔法牌的目标。"),
                mod: {
                    targetEnabled: function (card, player, target) {
                        if (get.getZJShaShili(player) != "\u673A" &&
                            get.type(card, null, player) == "trick" &&
                            get.color(card, player) == "black") {
                            return false;
                        }
                    },
                },
            };
            var output = {
                zj_shili_tianshi: skill12,
                zj_shili_lianyu: skill222,
                zj_shili_fomeng: skill3,
                zj_shili_fozu: exFoSkill1,
                zj_shili_pusha: exFoSkill2,
                zj_shili_shashou: skill42,
                zj_shili_fashi: skill52,
                zj_shili_longzu: skill62,
                zj_shili_shengqi: skill72,
                zj_shili_yaozu: skill8,
                zj_shili_moshen: skill9,
                zj_shili_shenmo: skill10,
                zj_shili_jijie: skill11,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "之前旧技能抽取", 3, function (lib, game, ui, get, ai, _status) {
            var zj_ganglie = {
                name: "肛裂",
                description: NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌（[自]令[他]选一项：1.其弃置两张[手]；2.其受到1点伤害)。 "),
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return event.source && event.num > 0;
                },
                logTarget: "source",
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.num = trigger.num;
                    "step 1";
                    player.judge(function (jResult) {
                        return jResult.color == "black" ? 1 : 0;
                    });
                    "step 2";
                    if (result.bool) {
                        player.chooseControlList([
                            "(1)令其弃置两张手牌",
                            "(2)你对其造成的1点伤害"
                        ], true);
                    }
                    else {
                        event.goto(4);
                    }
                    "step 3";
                    if (result.index == 0) {
                        trigger.source.chooseToDiscard(2, "h");
                    }
                    else {
                        trigger.source.damage(1);
                    }
                    "step 4";
                    event.num--;
                    if (event.num > 0) {
                        player.chooseBool(get.prompt2("zj_ganglie"));
                    }
                    else {
                        event.finish();
                    }
                    "step 5";
                    if (result.bool) {
                        event.goto(1);
                    }
                }
            };
            var zj_ganglie2 = {
                name: "肛裂",
                description: NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌（其受到1点伤害)；红色牌（其弃置[手]两张）。"),
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return event.source && event.num > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.num = trigger.num;
                    "step 1";
                    player.judge(function (jResult) {
                        return 1;
                    });
                    "step 2";
                    if (result.bool) {
                        if (result.color == "black") {
                            trigger.source.damage(1);
                        }
                        else {
                            trigger.source.chooseToDiscard(2, "h");
                        }
                    }
                    else {
                        event.goto(3);
                    }
                    "step 3";
                    event.num--;
                    if (event.num > 0) {
                        player.chooseBool(get.prompt2("zj_ganglie"));
                    }
                    else {
                        event.finish();
                    }
                    "step 4";
                    if (result.bool) {
                        event.goto(1);
                    }
                }
            };
            var zj_laobo = {
                name: "捞波",
                description: "阶段技，你可以将任意数量的手牌交给任意角色(至少1张)，你摸X张牌且血量+1，若其获得你给出的牌张数不小于2，你可以视为对你使用一张【血】或【魔】(X为你已损失的血量)。",
                enable: "phaseUse",
                usable: 1,
                precontent: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    player.storage.zj_laobo_targets = [];
                    player.storage.zj_laobo_num = 0;
                },
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    var storageTargets = player.storage.zj_laobo_targets;
                    var storageNum = player.storage.zj_laobo_num;
                    var haveHandCard = player.countCards("h") > 0;
                    'step 0';
                    if (NG.ObjectUtil.isUndefined(storageTargets) || NG.ObjectUtil.isUndefined(storageNum)) {
                        console.error("不明原因，zj_laobo的标记变量没有生成！");
                        event.finish();
                        return;
                    }
                    'step 1';
                    if (haveHandCard) {
                        player.chooseCardTarget({
                            filterCard: true,
                            selectCard: [1, Infinity],
                            filterTarget: function (card, player, target) {
                                return player != target;
                            },
                            prompt: "选择要交给牌与玩家",
                            forced: true
                        });
                    }
                    else {
                        event.goto(4);
                    }
                    'step 2';
                    if (result.bool) {
                        storageTargets.push(target);
                        result.targets[0].gain(result.cards, player, "gain");
                        player.storage.zj_laobo_num += result.cards.length;
                    }
                    'step 3';
                    if (haveHandCard) {
                        player.chooseBool("\u662F\u5426\u7EE7\u7EED\u4F7F\u7528\u3010" + lib.translate["zj_laobo"] + "\u3011\uFF1F");
                    }
                    'step 4';
                    if (result.bool) {
                        event.goto(1);
                    }
                    'step 5';
                    var loseHp = player.maxHp - player.hp;
                    player.draw(loseHp);
                    player.recover(1);
                    if (storageNum >= 2) {
                        var list = [];
                        if (player.canUse({ name: "tao" }, player)) {
                            list.push("tao");
                        }
                        if (player.canUse({ name: "jiu" }, player)) {
                            list.push("jiu");
                        }
                        if (list.length) {
                            player.chooseButton([
                                "是否视为视为对你使用一张【血】或【魔】？",
                                [list, "vcard"]
                            ]);
                        }
                        else {
                            event.finish();
                        }
                    }
                    'step 6';
                    if (result && result.bool && result.links[0]) {
                        var vard = { name: result.links[0][2], nature: result.links[0][3] };
                        player.chooseUseTarget(vard, true);
                    }
                },
                contentAfter: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    delete player.storage.zj_laobo_targets;
                    delete player.storage.zj_laobo_num;
                }
            };
            var new_zj_laobo = {
                name: "捞波",
                description: NG.Utils.translateDescTxt("【阶段技】 [自]将≥1张[手]交给[他]，[自][摸]X (X=[自]失血值)，其获得给出的牌张数≥2，[自]视为对[任]使用一张《血》。"),
                enable: "phaseUse",
                usable: 1,
                precontent: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    player.storage.zj_laobo_targets = [];
                    player.storage.zj_laobo_num = 0;
                },
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    var storageTargets = player.storage.zj_laobo_targets;
                    var storageNum = player.storage.zj_laobo_num;
                    var haveHandCard = player.countCards("h") > 0;
                    'step 0';
                    if (NG.ObjectUtil.isUndefined(storageTargets) || NG.ObjectUtil.isUndefined(storageNum)) {
                        console.error("不明原因，zj_laobo的标记变量没有生成！");
                        event.finish();
                        return;
                    }
                    'step 1';
                    if (haveHandCard) {
                        player.chooseCardTarget({
                            filterCard: true,
                            selectCard: [1, Infinity],
                            filterTarget: function (card, player, target) {
                                return player != target;
                            },
                            prompt: "选择要交给牌与玩家",
                            forced: true
                        });
                    }
                    else {
                        event.goto(4);
                    }
                    'step 2';
                    if (result.bool) {
                        storageTargets.push(target);
                        result.targets[0].gain(result.cards, player, "gain");
                        player.storage.zj_laobo_num += result.cards.length;
                    }
                    'step 3';
                    if (haveHandCard) {
                        player.chooseBool("\u662F\u5426\u7EE7\u7EED\u4F7F\u7528\u3010" + lib.translate["zj_laobo"] + "\u3011\uFF1F");
                    }
                    else {
                        result.bool = false;
                    }
                    'step 4';
                    if (result.bool) {
                        event.goto(1);
                    }
                    'step 5';
                    var loseHp = player.maxHp - player.hp;
                    player.draw(loseHp);
                    if (storageNum >= 2) {
                        player.chooseTarget("\u53EF\u4EE5\u89C6\u4E3A\u5BF9\u4EFB\u4E00\u73A9\u5BB6\u4F7F\u7528\u4E00\u5F20\u3010" + get.translation("tao") + "\u3011", function (card, player, target) {
                            return target.isDamaged();
                        });
                    }
                    else {
                        event.finish();
                    }
                    'step 6';
                    if (result && result.bool && result.targets) {
                        var vcard = { name: "tao" };
                        player.useCard(vcard, result.targets, false);
                    }
                },
                contentAfter: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    delete player.storage.zj_laobo_targets;
                    delete player.storage.zj_laobo_num;
                }
            };
            var zj_bosen = {
                name: "博森",
                description: NG.Utils.translateDescTxt("【被动技】[自]除去1点血量后，[任][摸]3；[自]死亡时，[自]所有[区]交给[他]，然后令其血量+1。"),
                group: ["zj_bosen_1", "zj_bosen_2"],
                subSkill: {
                    1: {
                        trigger: {
                            player: [
                                "loseHp" + "End",
                            ]
                        },
                        filter: function (event, player) {
                            return event.num > 0;
                        },
                        forced: true,
                        content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                            "step 0";
                            player.storage.zj_bosen_1_flag = trigger.num;
                            "step 1";
                            player.chooseTarget(lib.skill.zj_bosen_1.description);
                            "step 2";
                            if (result.bool && result.targets.length > 0) {
                                result.targets[0].draw(3);
                            }
                            player.storage.zj_bosen_1_flag--;
                            if (player.storage.zj_bosen_1_flag > 0) {
                                event.goto(1);
                            }
                            "step 3";
                            delete player.storage.zj_bosen_1_flag;
                        },
                        contentAfter: function (player) {
                            delete player.storage.zj_bosen_1_flag;
                        },
                        description: "当你除去1点血量后，你令任一角色摸三张牌"
                    },
                    2: {
                        trigger: {
                            player: "die" + "Begin"
                        },
                        content: function (event, player, trigger, result) {
                            "step 0";
                            player.chooseTarget(lib.translate.zj_bosen_2_info, function (card, player, target) {
                                return player != target;
                            });
                            "step 1";
                            if (result.bool && result.targets.length > 0) {
                                result.targets[0].gain(player.getCards("hej"), player, "gain2");
                                result.targets[0].recover();
                            }
                        },
                        description: "当你死亡时，你可以将你的所有牌交给任一其他角色，然后令其血量+1",
                    }
                }
            };
            var output = {
                zj_laobo: new_zj_laobo,
                zj_bosen: zj_bosen,
                zj_ganglie: zj_ganglie2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组1", 3, function (lib, game, ui, get, ai, _status) {
            var skill2 = {
                name: "老鬼",
                description: NG.Utils.translateDescTxt("【阶段技】[自]可除去[自]1点血量，[他]摸一张牌。"),
                enable: "phaseUse",
                usable: 1,
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.loseHp(1);
                    "step 1";
                    player.chooseTarget(1, function (card, player, target) {
                        return target != player;
                    }, true);
                    "step 2";
                    if (result.bool && result.targets.length) {
                        result.targets[0].draw();
                    }
                }
            };
            var output = {
                zj_laogui: skill2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2", 3, function (lib, game, ui, get, ai, _status) {
            var skill2 = {
                name: "华富",
                description: NG.Utils.translateDescTxt("【主动技】[自]弃置X张[手]令[手]数为≤10（X≥1），[自]须跳过<弃>，[自][翻]。"),
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("h") > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var hCount = player.countCards("h");
                    var minCount = hCount >= 10 ? hCount - 10 : 1;
                    player.chooseToDiscard(minCount, "h");
                    "step 1";
                    if (result && result.bool) {
                        player.addTempSkill("zj_skip_PhaseDiscard");
                        player.turnOver(true);
                    }
                }
            };
            var skill4 = {
                name: "间反",
                description: NG.Utils.translateDescTxt("【阶段技】[自]展示一张[手]并交给[他]，其选择一项：(1)其展示所有[手]并弃置与此牌花色相同的所有牌；(2)其除去1点血量。"),
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("h") > 0;
                },
                selectCard: 1,
                filterCard: lib.filter.all,
                position: "h",
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return player != target;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.showCards(event.cards);
                    "step 1";
                    event.targets[0].gain(event.cards, player, "gain2");
                    "step 2";
                    var next = event.targets[0].chooseControlList([
                        "展示所有手牌并弃置与此牌花色相同的所有牌",
                        "除去1点血量"
                    ], true);
                    "step 3";
                    if (result.index == 0) {
                        event.targets[0].showHandcards(result.control);
                    }
                    else if (result.index == 1) {
                        event.targets[0].loseHp();
                        event.finish();
                    }
                    "step 4";
                    var basecard = { suit: get.suit(event.cards) };
                    var _cards = event.targets[0].getCards("h", basecard);
                    event.target.discard(_cards);
                }
            };
            var skill5 = {
                name: "汉伦",
                description: NG.Utils.translateDescTxt("【被动技】[自]非[他]({武}没牌时)使用的《杀》/《大对决术》/《奥义秘术》的目标。"),
                mod: {
                    targetEnabled: function (card, player, target) {
                        var cardName = ["sha", "juedou", "aoyi"];
                        if (!target.hasCard(function (card) {
                            return get.subtype(card) == "equip1";
                        }, "e") && cardName.contains(get.name(card)))
                            return false;
                    },
                }
            };
            var output = {
                zj_huafu2: skill2,
                zj_jianfan: skill4,
                zj_hanlun: skill5,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组3", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "自闭",
                description: NG.Utils.translateDescTxt("【阶段技】[自]可将一张方块牌当【圣水牢术】对[自]使用，然后[自]血量+1。"),
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("h", { suit: "diamond" }) > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.chooseCard({ suit: "diamond" }, "\u9009\u62E9\u4E00\u5F20\u65B9\u5757\u724C\u5F53\u300A" + lib.translate["lebu"] + "\u300B\u5BF9\u81EA\u5DF1\u4F7F\u7528");
                    "step 1";
                    if (result && result.bool && result.cards) {
                        player.useCard({ name: "lebu" }, result.cards, player, "noai");
                        player.recover();
                    }
                }
            };
            var skill2 = {
                name: "财康",
                description: NG.Utils.translateDescTxt("【被动技】[自]判定区里有牌：(1)受到伤害前，该伤害-1；(2)不会被翻面；(3)对攻击范围内的角色使用牌无限次数。"),
                trigger: {
                    player: [
                        "useCard" + "Begin",
                        "damageBegin3",
                        "turnOver" + "Begin",
                    ],
                },
                forced: true,
                filter: function (event, player) {
                    return player.countCards("j") > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var triggerName = event.triggername;
                    if (triggerName == "damageBegin3") {
                        trigger.num--;
                        player.popup("伤害-1");
                    }
                    else if (triggerName == "turnOver" + "Begin") {
                        trigger.cancel();
                        player.popup("不会被翻面");
                    }
                    else {
                    }
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (player.countCards("j") > 0) {
                            return true;
                        }
                    },
                },
            };
            var output = {
                zj_zibi: skill1,
                zj_caikang: skill2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组4", 0, function (lib, game, ui, get, ai, _status) {
            var skill2 = {
                trigger: {
                    player: "shaMiss",
                },
                filter: function (event, player) {
                    if (event.target.countCards("he"))
                        return true;
                    return event.responded && event.responded.cards && event.responded.cards.length > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.cards = event.responded.cards;
                    if (event.responded && event.responded.cards && event.responded.cards.length > 0) {
                        player.chooseTarget(1, "\u5C06\u8BE5\u300A" + get.translation("shan") + "\u300B\u4EA4\u7ED9\u4EFB\u4E00\u73A9\u5BB6", true);
                    }
                    else {
                        event.goto(2);
                    }
                    "step 1";
                    if (result.bool) {
                        player.give(event.cards, result.targets[0]);
                    }
                    "step 2";
                    if (trigger.target.countCards("he")) {
                        player.discardPlayerCard(trigger.target, 1);
                    }
                },
            };
            var output = {};
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组5", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "剑制",
                description: NG.Utils.translateDescTxt("【主动技】[自]<准>，[捡]2，[自]获得武器牌和《杀》，回合内，[自]使用的《杀》的伤害值+1且受到此伤害的角色进入[重伤]。 "),
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var cards = get.cards(2);
                    game.cardsGotoOrdering(cards);
                    player.showCards(cards, "\u3010" + get.translation(player) + "\u3011\u83B7\u5F97\u6B66\u5668\u724C\u548C\u300A\u6740\u300B");
                    var cardsx = [];
                    var discardsx = [];
                    for (var i = 0; i < cards.length; i++) {
                        if (get.name(cards[i]) == "sha" ||
                            get.subtype(cards[i]) == "equip1") {
                            cardsx.push(cards[i]);
                        }
                        else {
                            discardsx.push(cards[i]);
                        }
                    }
                    event.cards = cardsx;
                    event.oCards = discardsx;
                    "step 1";
                    if (event.cards.length) {
                        player.gain(event.cards, "gain2");
                        player.discard(event.oCards);
                    }
                    player.storage.shaDamageAdd = 1;
                    player.addTempSkill("shaDamageAdd");
                    player.addTempSkill('addZhongshangState');
                }
            };
            var addZhongshangState = {
                name: "重伤",
                description: "【附加重伤】：你可以附加【重伤状态】（回合内，重伤状态的角色不能成为《血》的目标。）",
                trigger: {
                    source: "damageBegin1",
                },
                silent: true,
                locked: true,
                global: "zhongshangState2",
                mark: true,
                marktext: "重",
                intro: {
                    content: "players",
                },
                filter: function (event, player) {
                    if (event.source != player)
                        return false;
                    if (event.card && get.name(event.card) == "sha")
                        return true;
                },
                init: function (player) {
                    player.storage.addZhongshangState = [];
                },
                onremove: function (player, skill) {
                    player.storage.addZhongshangState.forEach(function (player) {
                        player.removeSkill("zhongshangState");
                    });
                    delete player.storage.addZhongshangState;
                },
                content: function (event, player, trigger, result) {
                    if (!player.storage.addZhongshangState.contains(trigger.player)) {
                        player.storage.addZhongshangState.push(trigger.player);
                        trigger.player.storage.zhongshangState = player;
                        trigger.player.addTempSkill("zhongshangState");
                        player.markSkill('addZhongshangState');
                        player.syncStorage('addZhongshangState');
                    }
                },
            };
            var zhongshangState = {
                name: "重伤状态",
                description: "【重伤状态】",
                mark: "character",
                marktext: "重",
                intro: {
                    content: "\u56DE\u5408\u5185\uFF0C\u91CD\u4F24\u72B6\u6001\u7684\u89D2\u8272\u4E0D\u80FD\u6210\u4E3A\u300A\u8840\u300B\u7684\u76EE\u6807\u3002",
                },
                onremove: true,
                ai: {
                    zhongshangState: true,
                },
            };
            var zhongshangState2 = {
                mod: {
                    cardSavable: function (card, player) {
                        if (!_status.currentPhase)
                            return;
                        if (!_status.event.dying)
                            return;
                        if (_status.currentPhase.isAlive() &&
                            _status.currentPhase.hasSkill('addZhongshangState') &&
                            _status.currentPhase.storage.addZhongshangState.contains(_status.event.dying)) {
                            if (get.name(card, player) == "tao")
                                return false;
                        }
                    },
                    cardEnabled: function (card, player) {
                        if (!_status.currentPhase)
                            return;
                        if (!_status.event.dying)
                            return;
                        if (_status.currentPhase.isAlive() &&
                            _status.currentPhase.hasSkill('addZhongshangState') &&
                            _status.currentPhase.storage.addZhongshangState.contains(_status.event.dying)) {
                            if (get.name(card, player) == "tao")
                                return false;
                        }
                    }
                }
            };
            var output = {
                zj_jianzhi: skill1,
                addZhongshangState: addZhongshangState,
                zhongshangState: zhongshangState,
                zhongshangState2: zhongshangState2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组6", 3, function (lib, game, ui, get, ai, _status) {
            var zj_longhun = {
                name: "龙魂",
                description: NG.Utils.translateDescTxt("【被动技】[自]<准备>，[自][捡]1，若为黑色，将其[置]“龙”。"),
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                frequent: true,
                filter: lib.filter.all,
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.cards = get.cards(1);
                    player.showCards(event.cards);
                    event.bool = get.color(event.cards[0]) == "black";
                    "step 1";
                    if (event.bool) {
                        player.markAutoBySpecial('zj_longhun', event.cards);
                    }
                    else {
                        game.cardsDiscard(event.cards);
                    }
                },
                marktext: "龙",
                intro: {
                    content: "cards",
                    onunmark: "throw"
                },
                check: lib.filter.all
            };
            var skill2 = {
                name: "龙力",
                description: NG.Utils.translateDescTxt("【主动技】[自]弃置一张“龙”和《杀》令[他]除去1点血量。"),
                enable: "phaseUse",
                filter: function (event, player) {
                    if (player.getStorage('zj_longhun').length && player.hasSha())
                        return true;
                },
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return player != target;
                },
                selectCard: 1,
                filterCard: { name: "sha" },
                content: function (event, player, trigger, result) {
                    player.unmarkAutoBySpecial('zj_longhun', player.getStorage('zj_longhun').randomGets(1));
                    player.discard(event.cards);
                    event.target.loseHp(1);
                }
            };
            var skill3 = {
                name: "龙甲",
                description: NG.Utils.translateDescTxt("【被动技】[自]受到魔法牌以外的伤害前，[自]若有“龙”，该伤害-1。"),
                trigger: {
                    player: "damageBegin3",
                },
                forced: true,
                frequent: true,
                popup: "龙甲",
                filter: function (event, player) {
                    if (!event.card || get.type2(event.card) == "trick")
                        return false;
                    if (player.getStorage('zj_longhun').length)
                        return true;
                },
                content: function (event, player, trigger, result) {
                    trigger.num--;
                }
            };
            var output = {
                zj_longhun: zj_longhun,
                zj_longli: skill2,
                zj_longjia: skill3,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组7", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "邪心",
                description: NG.Utils.translateDescTxt("【回合技】[自]使用一张《杀》造成伤害时，此《杀》的伤害值+X (X=[自]失血值，至少为1)。"),
                trigger: {
                    source: "damageBegin1",
                },
                usable: 1,
                filter: function (event, player) {
                    return event.card && get.name(event.card) == "sha";
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.num += Math.max(1, (player.maxHp - player.hp));
                }
            };
            var skill2 = {
                name: "繁花",
                description: NG.Utils.translateDescTxt("【主动技】[自]使用《杀》指定[他]为目标后，[自][判]，[结]红色牌（其不能使用《闪》）；黑色牌（[自][摸]1）。"),
                trigger: {
                    player: "useCardToPlayered",
                },
                filter: function (event, player) {
                    return get.name(event.card, player) == "sha";
                },
                logTarget: "target",
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.judge(function (jResult) {
                        return 1;
                    });
                    "step 1";
                    if (result.bool) {
                        if (result.color == "red") {
                            trigger.getParent().directHit.add(trigger.target);
                        }
                        else {
                            player.draw();
                        }
                    }
                }
            };
            var output = {
                zj_xiexin: skill1,
                zj_fanhua: skill2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组8", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "圣锤",
                description: NG.Utils.translateDescTxt("【主动技】[自]使用的《杀》被《闪》抵消时，[自]将该《闪》交给[任一]，且弃置其一张牌。"),
                trigger: {
                    source: "shaMiss",
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    if (event._trigger.responded && get.itemtype(event.responded.cards) == "cards") {
                        player.chooseTarget(1, "\u5C06" + get.translation(trigger.responded.cards) + "\u4EA4\u7ED9\u4E00\u540D\u89D2\u8272", true);
                    }
                    else {
                        event.goto(2);
                    }
                    "step 1";
                    if (result && result.targets) {
                        result.targets[0].gain(event.responded.cards);
                    }
                    "step 2";
                    player.discardPlayerCard(trigger.player, 1, "he", "gain2");
                }
            };
            var skill12 = {
                name: "圣锤",
                description: NG.Utils.translateDescTxt("【主动技】[自]使用的《杀》被《闪》抵消时，且[自]弃置其[区]一张牌。"),
                trigger: {
                    player: "shaMiss",
                },
                content: function (event, player, trigger, result) {
                    player.discardPlayerCard(trigger.target, 1, "he");
                }
            };
            var skill2 = {
                name: "启盛",
                description: NG.Utils.translateDescTxt("【回合技】[自]<摸>时，摸牌-1，[自]视为对[他]额外使用一张《杀》，此《杀》的伤害值+1。"),
                trigger: {
                    player: "phaseDraw" + "Begin",
                },
                usable: 1,
                filter: function (event, player) {
                    return !event.numFixed && event.num > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.num--;
                    player.chooseTarget(1, function (card, player, target) {
                        return player != target;
                    }, true);
                    "step 1";
                    if (result.bool && result.targets) {
                        var next = player.useCard({ name: "sha", isCard: true, isQisheng: true }, result.targets[0], false);
                        player.storage.shaDamageAdd = 1;
                        player.addTempSkill("shaDamageAdd", "sha" + "After");
                    }
                }
            };
            var shaDamageAdd = {
                name: "加伤",
                description: "《杀》造成的伤害增加",
                trigger: {
                    player: "sha" + "Begin",
                },
                silent: true,
                filter: function (event, player) {
                    return player.storage.shaDamageAdd;
                },
                onremove: true,
                content: function (event, player, trigger, result) {
                    trigger.extraDamage = player.storage.shaDamageAdd;
                },
                mark: true,
                marktext: "伤",
                intro: {
                    content: "《杀》造成的伤害+#",
                },
            };
            var output = {
                zj_shenchui: skill12,
                zj_qisheng: skill2,
                shaDamageAdd: shaDamageAdd,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组9", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "妖术",
                description: NG.Utils.translateDescTxt("【主动技】[自]将任意两张点数之差≤X[手] (X=[自]失血量) 当任一通常魔法牌使用。"),
                enable: "phaseUse",
                filter: function (event, player) {
                    var cards = player.getCards("h");
                    for (var i = 0; i < cards.length; i++) {
                        for (var j = i + 1; j < cards.length; j++) {
                            var card1 = cards[i];
                            var card2 = cards[j];
                            if (Math.abs(get.number(card1) - get.number(card2)) <= player.curLoseHp()) {
                                return true;
                            }
                        }
                    }
                },
                selectCard: 2,
                position: "h",
                filterCard: function (card, player) {
                    if (ui.selected.cards.length) {
                        for (var i = 0; i < ui.selected.cards.length; i++) {
                            var _card = ui.selected.cards[i];
                            console.log("每次选牌的结果===》", Math.abs(get.number(card) - get.number(_card)), player.curLoseHp());
                            if (Math.abs(get.number(card) - get.number(_card)) <= player.curLoseHp()) {
                                return true;
                            }
                        }
                    }
                    else {
                        return true;
                    }
                },
                complexCard: true,
                content: function (event, player, trigger, result) {
                    "step 0";
                    var list = get.inpile("trick");
                    var _loop_1 = function (i) {
                        var skill = list[i];
                        var info = get.info({ name: skill });
                        if (info && info.notarget) {
                            list.splice(i, 1);
                        }
                        else if (!info) {
                            list.splice(i, 1);
                        }
                        else if (!game.countPlayer(function (current) {
                            return player.canUse(skill, current);
                        })) {
                            list.splice(i, 1);
                        }
                    };
                    for (var i = list.length - 1; i >= 0; i--) {
                        _loop_1(i);
                    }
                    player.chooseVCardButton(list, 1, "视为一张通常魔法使用", true);
                    "step 1";
                    if (result.bool) {
                        player.chooseUseTarget({ name: result.links[0][2] }, event.cards, true);
                    }
                }
            };
            var skill2 = {
                name: "妖爆",
                description: NG.Utils.translateDescTxt("【限定技】[自]<出>，[自]选择一项：(1)[自]对1-3名角色各造成1点伤害；(2)[自]弃置[手]四种花色各1张，[自]对[任]造成3点伤害。"),
                frequent: true,
                limited: true,
                unique: true,
                forceDie: true,
                animationColor: "metal",
                skillAnimation: "legend",
                enable: "phaseUse",
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.awakenSkill('zj_yaobao');
                    var _list = ["对1-3名角色各造成1点伤害"];
                    var suitLists = [];
                    var cards = player.getCards("h", function (card) {
                        var suit = get.suit(card);
                        if (!suitLists.contains(suit)) {
                            suitLists.push(suit);
                            return true;
                        }
                        return false;
                    });
                    if (cards.length >= 4)
                        _list.push("弃置四种花色的手牌各1张，对任意一名角色造成3点伤害");
                    var next = player.chooseControlList(_list, true);
                    "step 1";
                    event.index = result.index;
                    if (result.index === 0) {
                        player.chooseTarget([1, 3]);
                    }
                    else if (result.index === 1) {
                        player.chooseTarget();
                    }
                    else {
                        event.finish();
                    }
                    "step 2";
                    if (result.targets) {
                        event.targets = result.targets;
                        if (event.index === 0) {
                            result.targets.forEach(function (current) {
                                current.damage(1, "nocard", player);
                            });
                            event.finish();
                        }
                        else if (event.index === 1) {
                            player.chooseToDiscard(4, "弃置四种花色的手牌各1张", function (card, player) {
                                var suit = get.suit(card);
                                for (var i = 0; i < ui.selected.cards.length; i++) {
                                    if (get.suit(ui.selected.cards[i]) == suit)
                                        return false;
                                }
                                return true;
                            }).set("complexCard", true);
                        }
                        else {
                            event.finish();
                        }
                    }
                    "step 3";
                    if (result.bool && event.index == 1) {
                        event.targets.forEach(function (current) {
                            current.damage(3, "nocard", player);
                        });
                    }
                }
            };
            var output = {
                zj_yaoshu: skill1,
                zj_yaobao: skill2
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组10", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "烂摊",
                description: NG.Utils.translateDescTxt("【被动技】[自]血量X，视为拥有技能：“杀手”(X为≤6)、“神勇”(X为≤4)、“无限”(X为≤2)。"),
                trigger: {
                    global: "gameDraw" + "Before",
                    player: ["changeHp"],
                },
                forced: true,
                popup: false,
                derivation: ["zj_shili_shashou", "zj_sub_wudi", "zj_sub_shenyong"],
                content: function (event, player, trigger, result) {
                    player.removeAdditionalSkill("zj_lantang");
                    var list = [];
                    if (player.hp <= 6) {
                        if (trigger.num != undefined && trigger.num < 0 && player.hp - trigger.num > 1)
                            player.logSkill("zj_lantang");
                        list.push("zj_shili_shashou");
                    }
                    if (player.hp <= 4) {
                        list.push("zj_sub_shenyong");
                    }
                    if (player.hp <= 2) {
                        list.push("zj_sub_wudi");
                    }
                    if (list.length) {
                        player.addAdditionalSkill("zj_lantang", list);
                    }
                },
                ai: {
                    maixie: true,
                }
            };
            var zj_sub_wudi = {
                name: "无限",
                description: NG.Utils.translateDescTxt("【被动技】[自]计算与[他]距离时-X（X=[自]失血量且至少为1）；[自]始终无视其他角色的防具； [自]使用∞张《杀》。"),
                mod: {
                    globalFrom: function (from, to, distance) {
                        var count = 1;
                        if (from.curLoseHp())
                            count = from.curLoseHp();
                        return distance - count;
                    },
                    cardUsable: function (card, player, num) {
                        if (card.name == "sha")
                            return Infinity;
                    },
                },
                ai: {
                    unequip: true,
                }
            };
            var zj_sub_shenyong = {
                name: "神勇",
                description: NG.Utils.translateDescTxt("【主动技】[自]<准>，[自]每选择一项：(1)跳过<摸>、<弃>；(2)跳过<判>、<出>。[自]视为对[他]额外使用一张《杀》。"),
                trigger: {
                    player: ["judge" + "Before", "phaseDraw" + "Before"],
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var prompt2 = "";
                    if (trigger.name == "judge") {
                        prompt2 = NG.Utils.translateDescTxt("跳过<判定><出牌>,") + NG.Utils.translateDescTxt("[自]视为对[他]额外使用一张《杀》");
                    }
                    else {
                        prompt2 = NG.Utils.translateDescTxt("跳过<摸牌><弃牌>,") + NG.Utils.translateDescTxt("[自]视为对[他]额外使用一张《杀》");
                    }
                    player.chooseTarget(1, get.prompt(event.name), prompt2, function (card, player, target) {
                        return player != target && player.canUse({ name: "sha" }, target, false);
                    });
                    "step 1";
                    if (result.bool) {
                        player.useCard({ name: "sha", isCard: true }, result.targets[0], false);
                        trigger.cancel();
                        if (trigger.name == "judge") {
                            player.skip("phaseUse");
                        }
                        else {
                            player.skip("phaseDiscard");
                        }
                    }
                },
            };
            var output = {
                zj_lantang: skill1,
                zj_sub_wudi: zj_sub_wudi,
                zj_sub_shenyong: zj_sub_shenyong,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组11", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "抚恤",
                description: NG.Utils.translateDescTxt("【回合技】[任]血量减少1次后，其[判]，[结]红色（[自]可弃置一张红桃牌，令其血量+1）。"),
                trigger: {
                    global: "changeHp",
                },
                usable: 1,
                filter: function (event, player) {
                    if (event.num < 0)
                        return true;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.player.judge(function (jResult) {
                        return jResult.color == "red";
                    });
                    "step 1";
                    event.bool = result.bool;
                    "step 2";
                    if (event.bool) {
                        player.chooseToDiscard(1, { color: "red" }, "你可弃置一张红桃牌，令其血量+1");
                    }
                    "step 3";
                    if (result.bool) {
                        trigger.player.recover(player, "nocard");
                    }
                }
            };
            var skill12 = {
                name: "抚恤",
                description: NG.Utils.translateDescTxt("【回合技】[任]血量减少1次后，其[判]，[结]红色牌（[自]可弃置一张红色牌，令其血量+1）；黑色牌（[自]可弃置一张黑色牌，令其[摸]1）。"),
                trigger: {
                    global: "changeHp",
                },
                usable: 1,
                filter: function (event, player) {
                    if (event.num < 0)
                        return true;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.player.judge(function (jResult) {
                        return 1;
                    });
                    "step 1";
                    event.color = result.color;
                    "step 2";
                    if (event.color == "red") {
                        player.chooseToDiscard(1, { color: "red" }, "你可弃置一张红色牌，令其血量+1");
                    }
                    else if (event.color == "black") {
                        player.chooseToDiscard(1, { color: "black" }, "你可弃置一张黑色牌，令其摸一张牌");
                    }
                    "step 3";
                    if (event.color == "red") {
                        trigger.player.recover(player, "nocard");
                    }
                    else if (event.color == "black") {
                        trigger.player.draw();
                    }
                }
            };
            var skill2 = {
                name: "土豪",
                description: NG.Utils.translateDescTxt("[自]<准备>,<摸牌>可跳过，[自]将手牌补至其血槽值；<出牌>可跳过，将任意手牌交给[他]。"),
                trigger: {
                    player: ["phaseDraw" + "Before", "phaseUse" + "Before"],
                },
                usable: 1,
                content: function (event, player, trigger, result) {
                    "step 0";
                    var _triggerName = "";
                    if (trigger.name == "phaseDraw") {
                        _triggerName = get.translation("phaseDraw");
                        _triggerName += ":将手牌补至其血槽值";
                    }
                    else {
                        _triggerName = get.translation("phaseUse");
                        _triggerName += ":将任意手牌交给一名角色";
                    }
                    player.chooseBool("\u53EF\u8DF3\u8FC7" + _triggerName);
                    "step 1";
                    if (!result.bool) {
                        event.finish();
                        return;
                    }
                    if (trigger.name == "phaseDraw") {
                        var count = player.maxHp - player.countCards("h");
                        if (count > 0) {
                            player.draw(count);
                        }
                    }
                    else {
                        var chooseData = {
                            selectCard: [1, Infinity],
                            position: "h",
                            selectTarget: 1,
                            filterTarget: function (card, player, target) {
                                return player != target;
                            },
                            prompt: "将任意手牌交给其他一名角色",
                        };
                        player.chooseCardTarget(chooseData);
                    }
                    "step 1";
                    trigger.cancel();
                }
            };
            var skill22 = {
                name: "土豪",
                description: NG.Utils.translateDescTxt("【主动技】[自]<出>，[自]可跳过，[自]将≥1张[手]交给[他]。"),
                trigger: {
                    player: ["phaseUse" + "Before"],
                },
                usable: 1,
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.cancel();
                    var chooseData = {
                        selectCard: [1, Infinity],
                        filterCard: lib.filter.all,
                        position: "h",
                        selectTarget: 1,
                        filterTarget: function (card, player, target) {
                            return player != target;
                        },
                        prompt: "将任意手牌交给其他一名角色",
                        forced: true,
                    };
                    player.chooseCardTarget(chooseData);
                    "step 1";
                    if (result.bool && result.cards.length && result.targets.length) {
                        player.give(result.cards, result.targets[0]);
                    }
                }
            };
            var output = {
                zj_fuxu: skill12,
                zj_tuhao: skill22
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组12", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                group: ["炼狱"]
            };
            var skill2 = {
                name: "神伟",
                description: NG.Utils.translateDescTxt("【改判技】[自]获得该判定牌并令其重新进行一次判定。"),
                trigger: {
                    global: "judge",
                },
                filter: function (event, player) {
                    var trigger = event._trigger;
                    if (!player.storage.shenwei ||
                        (player.storage.shenwei.player != trigger.player &&
                            player.storage.shenwei.skill != trigger.skill)) {
                        return true;
                    }
                },
                content: function (event, player, trigger, result) {
                    delete player.storage.shenwei;
                    player.gain(trigger.player.judging[0]);
                    trigger.untrigger(true);
                    trigger._triggered = 2;
                    trigger.step = 0;
                    player.storage.shenwei = {
                        player: trigger.player,
                        skill: trigger.skill
                    };
                    player.addTempSkill('cancelReplaceJudge', "judge" + "After");
                }
            };
            var cancelReplaceJudge = {
                forced: true,
                silent: true,
                filter: function (event, player) {
                    var trigger = event._trigger;
                    if (player.storage.shenwei &&
                        player.storage.shenwei.player == trigger.player &&
                        player.storage.shenwei.skill == trigger.skill) {
                        return true;
                    }
                },
                trigger: {
                    global: "judge" + "End"
                },
                content: function (event, player, trigger, result) {
                    delete player.storage.shenwei;
                    player.removeSkill('cancelReplaceJudge');
                }
            };
            var skill22 = {
                name: "神伟",
                description: NG.Utils.translateDescTxt("【改判技】[自]获得该判定牌并令其展示牌堆顶的一张牌代替之。"),
                trigger: {
                    global: "judge",
                },
                content: function (event, player, trigger, result) {
                    player.replaceJudge({
                        card: get.cards()[0],
                        chooseType: "card",
                        exchange: true,
                    });
                }
            };
            var skill3 = {
                name: "伟荣",
                description: NG.Utils.translateDescTxt("【主动技】[自]受到1点伤害后，[自][判定]黑色，伤害来源角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面；红色牌（[自][摸]1)。"),
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return event.source && event.source.isAlive() && event.num > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.num = trigger.num;
                    "step 1";
                    player.judge(function (jResult) {
                        return jResult.color == "black" ? 1 : 0;
                    });
                    "step 2";
                    if (result.bool) {
                        var prompt_1 = "伤害来源角色需连续打出两张《闪》响应，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。";
                        trigger.source.chooseToRespond(2, { name: "shan" }, "h", prompt_1);
                    }
                    else {
                        event.goto(4);
                    }
                    "step 3";
                    if (result.bool) {
                        player.turnOver(!player.isTurnedOver());
                    }
                    else {
                        trigger.source.damage();
                    }
                    "step 4";
                    event.num--;
                    if (event.num > 0) {
                        event.goto(1);
                    }
                },
            };
            var skill32 = {
                name: "伟荣",
                description: NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌，伤害来源角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面；红色牌（[自][摸]1)。"),
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return event.source && event.source.isAlive() && event.num > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.num = trigger.num;
                    "step 1";
                    player.judge(function (jResult) {
                        return 1;
                    });
                    "step 2";
                    if (result.bool) {
                        if (result.color == "black") {
                            var prompt_2 = "伤害来源角色需连续打出两张《闪》响应，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。";
                            trigger.source.chooseToRespond(2, { name: "shan" }, "h", prompt_2);
                        }
                        else {
                            player.draw();
                            event.goto(4);
                        }
                    }
                    else {
                        event.goto(4);
                    }
                    "step 3";
                    if (result.bool) {
                        player.turnOver(!player.isTurnedOver());
                    }
                    else {
                        trigger.source.damage();
                    }
                    "step 4";
                    event.num--;
                    if (event.num > 0) {
                        event.goto(1);
                    }
                },
            };
            var output = {
                zj_shenwei: skill22,
                zj_weirong: skill3,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组13", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "仙力",
                description: NG.Utils.translateDescTxt("【主动技】[自]成为《杀》/通常魔法牌的目标时，[自][判],[结]红桃（此牌对[自]无效）。"),
                trigger: {
                    target: "useCardTo" + "Begin",
                },
                filter: function (event) {
                    if (event.card && (get.name(event.card) == "sha" || get.type(event.card) == "trick")) {
                        return true;
                    }
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.judge(function (jResult) {
                        return jResult.suit == "heart";
                    });
                    "step 1";
                    if (result.bool) {
                        player.popup("无效");
                        trigger.cancel();
                    }
                }
            };
            var skill2 = {
                name: "仙气",
                description: NG.Utils.translateDescTxt("【主动技】[自]判定牌生效后，若[自]手牌值少于[自]血槽值，[自][摸]1。"),
                trigger: {
                    player: "judge" + "End"
                },
                filter: function (event, player) {
                    return player.countCards("h") < player.maxHp;
                },
                frequent: true,
                content: function (event, player, trigger, result) {
                    player.draw();
                }
            };
            var output = {
                zj_xianli: skill1,
                zj_xianqi: skill2
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组14", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "魔志",
                description: NG.Utils.translateDescTxt("【回合技】[任]<结束>，[自]令其一张暗置手牌明置，称为“魔”；“魔”视为《魔》使用。"),
                trigger: {
                    global: "phaseJieshuBegin",
                },
                usable: 1,
                filter: function (event, player) {
                    return event.player.countCards("h", function (card) {
                        return !lib.filter.filterMingzhiCard(event.player, card);
                    }) > 0;
                },
                global: ["mingzhi_mo", "mingzhi_mo_lose"],
                content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                    "step 0";
                    player.choosePlayerCard(1, trigger.player, "h").set("filterButton", function (button, current) {
                        var target = _status.event.target;
                        var card = button.link;
                        return !lib.filter.filterMingzhiCard(target, card);
                    });
                    "step 1";
                    if (result.bool && result.buttons) {
                        var cards_1 = result.links;
                        trigger.player.mingzhiCard(cards_1);
                    }
                    "step 2";
                    if (result.bool && result.cards) {
                        trigger.player.addMark("mingzhi_mo", result.cards.length);
                    }
                }
            };
            var mingzhi_mo = {
                name: "魔志",
                enable: ["chooseToUse", "chooseToRespond"],
                filter: function (event, player) {
                    return player.storage.mingzhi_mo;
                },
                filterCard: function (card, player) {
                    return player.storage.mingzhi && player.storage.mingzhi.contains(card);
                },
                prompt: "“魔”视为《魔》使用",
                viewAs: { name: "jiu" },
                viewAsFilter: function (player) {
                    return player.storage.mingzhi_mo;
                },
                mark: "mingzhi_mo",
                marktext: "魔",
                intro: {
                    content: "mark",
                },
                subSkill: {
                    lose: {
                        trigger: {
                            player: "loseMingzhi",
                        },
                        silent: true,
                        filter: function (event, player) {
                            return player.storage.mingzhi_mo && event.source == player;
                        },
                        content: function (event, player, trigger, result) {
                            player.removeMark("mingzhi_mo", trigger.oCards.length);
                        }
                    }
                },
                ai: {
                    save: true,
                }
            };
            var skill2 = {
                name: "魔海",
                description: NG.Utils.translateDescTxt("【流血技】[自]弃置[任]“魔”，令其[摸]2并将角色牌翻面。"),
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return game.countPlayer(function (player) {
                        if (player.storage.mingzhi_mo) {
                            return true;
                        }
                    }) > 0 && event.num > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.chooseTarget(function (card, player, target) {
                        if (target.storage.mingzhi_mo) {
                            return true;
                        }
                    });
                    "step 1";
                    if (result.bool && result.targets.length) {
                        var target = event.target = result.targets[0];
                        player.chooseCardButton(target.storage.mingzhi);
                    }
                    "step 2";
                    if (result.bool && result.links.length) {
                        event.target.discard(result.links, player, true);
                        event.target.draw(2);
                        event.target.turnOver(!event.target.isTurnedOver());
                    }
                },
                ai: {
                    maixie_hp: true,
                },
            };
            var output = {
                zj_mozhi: skill1,
                zj_mohai: skill2,
                mingzhi_mo: mingzhi_mo,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组15", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "法师",
                trigger: {
                    player: "useCard",
                },
                filter: function (event, player) {
                    if (get.type(event.card, "toStorage") == "trick") {
                        return true;
                    }
                },
                forced: true,
                content: function (event, player, trigger, result) {
                    "step 0";
                    event.cards = get.cards(1);
                    player.showCards(event.cards);
                    "step 1";
                    if (event.cards && get.type(event.cards[0], "trick") == "trick") {
                        player.gain(event.cards);
                    }
                    else {
                        game.cardsDiscard(event.cards);
                    }
                }
            };
            var skill2 = {
                name: "博览",
                description: NG.Utils.translateDescTxt("【被动技】[他]使用的通常魔法牌（《干扰魔术》/《二重魔术》和转化牌除外）在结算后置入弃牌堆时，将其[置]“法”。"),
                trigger: {
                    global: "useCard" + "After",
                },
                frequent: true,
                filter: function (event, player) {
                    var inclueldCard = ["wuxie"];
                    return event.cards &&
                        player != event.player &&
                        event.card.isCard &&
                        get.type2(event.card) == "trick" &&
                        !inclueldCard.contains(event.card.name) &&
                        get.itemtype(event.cards) == "cards" &&
                        get.position(event.cards[0], true) == "o";
                },
                init: function (player) {
                    if (!player.storage.zj_bolang)
                        player.storage.zj_bolang = [];
                },
                marktext: "法",
                intro: {
                    content: "cards",
                    onunmark: "throw",
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.markAutoBySpecial('zj_bolang', trigger.cards);
                }
            };
            var skill3 = {
                name: "神法",
                description: NG.Utils.translateDescTxt("【主动技】[任]<结>，[自]可将[自]所有[D]加入手牌，[自]将手牌的张数弃置至现存角色数。"),
                trigger: {
                    global: "phaseJieshuBegin",
                },
                filter: function (event, player) {
                    return player.storage.zj_bolang && player.storage.zj_bolang.length > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.gain(player.storage.zj_bolang, "fromStorage");
                    player.unmarkAuto('zj_bolang', player.storage.zj_bolang);
                    "step 1";
                    var count = get.players().length;
                    var num = Math.max(0, player.countCards("h") - count);
                    if (num > 0)
                        player.chooseToDiscard(num, "将手牌的张数弃置至现存角色数", true);
                }
            };
            var skill4 = {
                name: "圣法",
                description: NG.Utils.translateDescTxt("【主动技】[自]两张“法”可以当任一通常魔法牌使用。"),
                group: ["zj_shenfa2_trick", "zj_shenfa2_wuxie"],
                subSkill: {
                    trick: {
                        enable: "phaseUse",
                        filter: function (event, player) {
                            var list = get.inpile("trick");
                            var _loop_2 = function (i) {
                                var skill = list[i];
                                var info = get.info({ name: skill });
                                if (info && info.notarget) {
                                    list.splice(i, 1);
                                }
                                else if (!info) {
                                    list.splice(i, 1);
                                }
                                else if (!game.countPlayer(function (current) {
                                    return player.canUse(skill, current);
                                })) {
                                    list.splice(i, 1);
                                }
                            };
                            for (var i = list.length - 1; i >= 0; i--) {
                                _loop_2(i);
                            }
                            return player.getStorage("zj_bolang").length >= 2 && list.length > 0;
                        },
                        content: function (event, player, trigger, result) {
                            "step 0";
                            player.chooseCardButton(2, player.storage.zj_bolang, "选择两张置于武将牌上的‘法’");
                            "step 1";
                            if (result.bool && result.links && result.links.length >= 2) {
                                event.cards = result.links;
                                var list = get.inpile("trick");
                                var _loop_3 = function (i) {
                                    var skill = list[i];
                                    var info = get.info({ name: skill });
                                    if (info && info.notarget) {
                                        list.splice(i, 1);
                                    }
                                    else if (!info) {
                                        list.splice(i, 1);
                                    }
                                    else if (!game.countPlayer(function (current) {
                                        return player.canUse(skill, current);
                                    })) {
                                        list.splice(i, 1);
                                    }
                                };
                                for (var i = list.length - 1; i >= 0; i--) {
                                    _loop_3(i);
                                }
                                if (list.length) {
                                    player.chooseVCardButton(list, true, "选择视为使用的通常魔法卡：").filterButton = function (button, player) {
                                        var link = button.link;
                                        return link && lib.filter.filterCard({ name: link[2] }, player);
                                    };
                                    return;
                                }
                            }
                            event.finish();
                            "step 2";
                            if (result && result.bool && result.links) {
                                var vcard = { name: result.links[0][2] };
                                player.chooseUseTarget({ name: result.links[0][2] }, event.cards, true);
                                player.unmarkAutoBySpecial("zj_bolang", event.cards, "o");
                            }
                        },
                    },
                    wuxie: {
                        enable: ["chooseToUse"],
                        filter: function (event, player) {
                            return player.getStorage("zj_bolang").length >= 2 && event.type == "wuxie";
                        },
                        chooseButton: {
                            dialog: function (event, player) {
                                return ui.create.dialog("\u5723\u6CD5:\u9009\u62E9\u7F6E\u4E8E\u6B66\u5C06\u724C\u4E0A\u7684\u2018\u6CD5\u2019\u5F53\u4F5C\u3010" + get.translation("wuxie") + "\u3011\u4F7F\u7528", player.storage.zj_bolang, 'hidden');
                            },
                            select: 2,
                            prompt: function (links, player) {
                                return "\u5F53\u4F5C\u3010" + get.translation("wuxie") + "\u3011\u4F7F\u7528";
                            },
                            backup: function (links, player) {
                                return {
                                    viewAs: { name: "wuxie", cards: links },
                                    selectCard: 0,
                                    onuse: function (result, player) {
                                        player.unmarkAutoBySpecial("zj_bolang", result.card.cards, "o");
                                    },
                                };
                            },
                        },
                        hiddenCard: function (player, name) {
                            return player.getStorage("zj_bolang").length >= 2 && name == "wuxie";
                        }
                    },
                },
            };
            var output = {
                zj_bolang: skill2,
                zj_shenfa: skill3,
                zj_shenfa2: skill4,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-1", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "命运",
                description: NG.Utils.translateDescTxt("【改判技】[自]可打出一张牌替换判定牌。"),
                trigger: {
                    global: "judge"
                },
                content: function (event, player, trigger, result) {
                    var rparams = {
                        chooseType: "exchange",
                        position: "he",
                    };
                    player.replaceJudge(rparams);
                },
                ai: {
                    rejudge: true,
                },
            };
            var skill2 = {
                name: "银夜",
                description: NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌。"),
                group: ["zj_yinye_1", "zj_yinye_2"],
                subSkill: {
                    1: {
                        description: NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌"),
                        trigger: {
                            player: "damage"
                        },
                        priority: 10,
                        filter: function (event, player) {
                            return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
                        },
                        content: function (event, player, trigger, result) {
                            player.gain(trigger.cards, "gain2");
                        }
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("[自]可获得伤害来源的一张牌"),
                        trigger: {
                            player: "damage"
                        },
                        filter: function (event, player) {
                            return event.source && event.num > 0 && event.source.countGainableCards(player, "he") > 0;
                        },
                        content: function (event, player, trigger, result) {
                            player.gainPlayerCard(trigger.source, trigger.num, "visibleMove");
                        }
                    },
                },
                ai: {
                    maixie: true,
                    maixie_hp: true,
                },
            };
            var skill22 = {
                name: "银夜",
                description: NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌,[自][摸]1。"),
                group: ["zj_yinye_1", "zj_yinye_2"],
                subSkill: {
                    1: {
                        description: NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌"),
                        trigger: {
                            player: "damage" + "End",
                        },
                        priority: 10,
                        filter: function (event, player) {
                            return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
                        },
                        content: function (event, player, trigger, result) {
                            player.gain(trigger.cards, "gain2");
                        }
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("[自]可获得伤害来源的一张牌,[自][摸]1"),
                        trigger: {
                            player: "damage" + "End",
                        },
                        filter: function (event, player) {
                            return event.source && event.num > 0 && event.source.countGainableCards(player, "he") > 0;
                        },
                        content: function (event, player, trigger, result) {
                            "step 0";
                            player.gainPlayerCard(trigger.source, trigger.num, "visibleMove");
                            "step 1";
                            player.draw();
                        }
                    },
                },
                ai: {
                    maixie: true,
                    maixie_hp: true,
                },
            };
            var output = {
                zj_mingyun: skill1,
                zj_yinye: skill22
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-2", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "御法",
                description: NG.Utils.translateDescTxt("【阶段技】[自]将任一魔法牌视为任一普通魔法牌使用。"),
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    var list = get.inpile("trick");
                    var _loop_4 = function (i) {
                        var skill = list[i];
                        var info = get.info({ name: skill });
                        if (info && info.notarget) {
                            list.splice(i, 1);
                        }
                        else if (!info) {
                            list.splice(i, 1);
                        }
                        else if (!game.countPlayer(function (current) {
                            return player.canUse(skill, current);
                        })) {
                            list.splice(i, 1);
                        }
                    };
                    for (var i = list.length - 1; i >= 0; i--) {
                        _loop_4(i);
                    }
                    return player.countCards("h", function (card) {
                        return get.type2(card) == "trick";
                    }) > 0 && list.length > 0;
                },
                selectCard: 1,
                filterCard: function (card, player) {
                    return get.type2(card) == "trick";
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var list = get.inpile("trick");
                    var _loop_5 = function (i) {
                        var skill = list[i];
                        var info = get.info({ name: skill });
                        if (info && info.notarget) {
                            list.splice(i, 1);
                        }
                        else if (!info) {
                            list.splice(i, 1);
                        }
                        else if (!game.countPlayer(function (current) {
                            return player.canUse(skill, current);
                        })) {
                            list.splice(i, 1);
                        }
                    };
                    for (var i = list.length - 1; i >= 0; i--) {
                        _loop_5(i);
                    }
                    player.chooseVCardButton(list, true, "选择视为使用的通常魔法卡：");
                    "step 1";
                    if (result && result.bool && result.links) {
                        var vcard = { name: result.links[0][2] };
                        player.chooseUseTarget(vcard, event.cards, true);
                    }
                },
            };
            var skill2 = {
                name: "赚法",
                description: NG.Utils.translateDescTxt("【被动技】[自]使用一张普通魔法牌时，[自][摸]1。"),
                trigger: {
                    player: "useCard",
                },
                frequent: true,
                priority: 5,
                filter: function (event, player) {
                    return get.type(event.card, null, player) == "trick";
                },
                content: function (event, player, trigger, result) {
                    player.draw();
                }
            };
            var skill3 = {
                name: "炎狮",
                description: NG.Utils.translateDescTxt("【被动技】[自]使用的《杀》需两张《闪》才能抵消；与[自]进行《大对决术》的角色每次需打出两张《杀》；[自]使用《杀》造成伤害时，则视为对其使用一张《大对决术》（不能被魔法牌响应）。"),
                group: ["zj_yanshi_1", "zj_yanshi_2", "zj_yanshi_3"],
                subSkill: {
                    1: {
                        description: NG.Utils.translateDescTxt("[自]使用的《杀》需两张《闪》才能抵消"),
                        trigger: {
                            player: "sha" + "Begin",
                        },
                        forced: true,
                        content: function (event, player, trigger, result) {
                            if (trigger.shanRequired) {
                                trigger.shanRequired++;
                            }
                            else {
                                trigger.shanRequired = 2;
                            }
                        }
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("与[自]进行《大对决术》的角色每次需打出两张《杀》"),
                        trigger: {
                            player: "useCardToPlayered",
                            target: "useCardToPlayered",
                        },
                        filter: function (event, player) {
                            return get.name(event.card, player) == "juedou";
                        },
                        forced: true,
                        logTarget: function (trigger, player) {
                            return player == trigger.player ? trigger.target : trigger.player;
                        },
                        content: function (event, player, trigger, result) {
                            var id = (player == trigger.player ? trigger.target : trigger.player)['playerid'];
                            var idt = trigger.target.playerid;
                            var map = trigger.getParent().customArgs;
                            if (!map[idt])
                                map[idt] = {};
                            if (!map[idt].shaReq)
                                map[idt].shaReq = {};
                            if (!map[idt].shaReq[id])
                                map[idt].shaReq[id] = 1;
                            map[idt].shaReq[id]++;
                        }
                    },
                    3: {
                        description: NG.Utils.translateDescTxt("[自]使用《杀》造成伤害后，则视为对其使用一张《大对决术》（不能被魔法牌响应）"),
                        trigger: {
                            source: "damage" + "End",
                        },
                        filter: function (event, player) {
                            return get.name(event.card) == "sha" && event.num > 0;
                        },
                        content: function (event, player, trigger, result) {
                            player.useCard({ name: "juedou" }, trigger.player, "nowuxie");
                        }
                    },
                },
            };
            var output = {
                zj_yufa: skill1,
                zj_zuanfa: skill2,
                zj_yanshi: skill3,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-3", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "龙徒",
                description: NG.Utils.translateDescTxt("【回合技】[自]可将一张红桃牌当《血》使用。"),
                enable: "chooseToUse",
                usable: 1,
                selectCard: 1,
                filterCard: function (card, player) {
                    return get.suit(card, player) == "heart";
                },
                viewAs: { name: "tao" },
                viewAsFilter: function (player) {
                    return player.countCards("he", { suit: "heart" }) > 0;
                },
            };
            var skill2 = {
                name: "不灭",
                description: NG.Utils.translateDescTxt("【被动技】[自]血量为0时，不进入濒死状态，[自][判]，[结]红桃（获得判定牌，血量+1；否则，血槽-1并回复血量至血槽值）。"),
                trigger: {
                    player: "dying" + "Begin",
                },
                filter: function (event, player) {
                    return player.hp <= 0 && player.maxHp > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    trigger.cancel(true);
                    player.judge(function (jResult) {
                        return jResult.color == "heart";
                    });
                    "step 1";
                    if (result.bool) {
                        player.gain(result.card);
                        player.recover();
                    }
                    else {
                        player.loseMaxHp();
                        player.recover(player.maxHp);
                    }
                },
                check: lib.filter.all,
            };
            var skill22 = {
                name: "不灭",
                description: NG.Utils.translateDescTxt("【被动技】[自]方块牌均视为红桃牌；[自]血量为0时，不进入濒死状态，[自][判]，[结]红桃牌（获得判定牌，血量+1）；黑色牌（血槽-1并回复血量至血槽值）。"),
                trigger: {
                    player: "dying" + "Begin",
                },
                silent: true,
                filter: function (event, player) {
                    return player.hp <= 0 && player.maxHp > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.popup("不灭");
                    trigger.cancel(true);
                    player.judge(function (jResult) {
                        return jResult.color == "heart";
                    });
                    "step 1";
                    if (result.bool) {
                        player.gain(result.card);
                        player.recover();
                    }
                    else {
                        player.loseMaxHp();
                        player.recover(player.maxHp);
                    }
                },
                check: lib.filter.all,
                mod: {
                    suit: function (card, suit) {
                        if (suit == "diamond") {
                            return "heart";
                        }
                    }
                },
            };
            var skill3 = {
                name: "龙兔",
                description: NG.Utils.translateDescTxt("【被动技】[自]方块牌均视为红桃牌。"),
                mod: {
                    suit: function (card, suit) {
                        if (suit == "diamond") {
                            return "heart";
                        }
                    }
                },
            };
            var skill4 = {
                name: "偷窃",
                description: NG.Utils.translateDescTxt("【主动技】[自]将任一梅花牌当《偷窃邪术》使用。"),
                enable: "chooseToUse",
                viewAs: { name: "shunshou", suit: "club" },
                viewAsFilter: function (player) {
                    return player.countCards("h", { suit: "club" }) > 0;
                },
                filterCard: function (card, player) {
                    return get.suit(card, player) == "club";
                },
            };
            var skill5 = {
                name: "神偷",
                description: NG.Utils.translateDescTxt("【被动技】[自]《偷窃邪术》距离∞；[自]非《偷窃邪术》的目标；[自]使用《偷窃邪术》时，[自]摸一张牌。"),
                trigger: {
                    player: "shunshou" + "Begin",
                },
                frequent: true,
                content: function (event, player, trigger, result) {
                    player.draw();
                },
                mod: {
                    targetInRange: function (card, player, target) {
                        if (get.name(card, player) == "shunshou") {
                            return -Infinity;
                        }
                    },
                    targetEnabled: function (card, player, target) {
                        if (get.name(card, player) == "shunshou") {
                            return false;
                        }
                    },
                },
            };
            var skill52 = {
                name: "神偷",
                description: NG.Utils.translateDescTxt("【被动技】[自]《偷窃邪术》距离∞；[自]非《偷窃邪术》的目标。"),
                mod: {
                    targetInRange: function (card, player, target) {
                        if (get.name(card, player) == "shunshou") {
                            return -Infinity;
                        }
                    },
                    targetEnabled: function (card, player, target) {
                        if (get.name(card, player) == "shunshou") {
                            return false;
                        }
                    },
                },
            };
            var output = {
                zj_longtu: skill1,
                zj_bumie: skill22,
                zj_touqie: skill4,
                zj_shentou: skill52,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-4", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "演员",
                description: NG.Utils.translateDescTxt("【主动技】[自]<结>，[自][摸]X+2，[自][翻]（X=现存属性数）。 "),
                trigger: {
                    player: "phaseJieshuBegin",
                },
                content: function (event, player, trigger, result) {
                    event.num = game.countGroup();
                    player.draw(event.num + 2);
                    player.turnOver(!player.isTurnedOver());
                },
            };
            var skill2 = {
                trigger: {
                    player: "damage" + "End",
                },
                filter: function (event, player) {
                    return player.isTurnedOver();
                },
                content: function (event, player, trigger, result) {
                    player.turnOver(false);
                },
            };
            var skill22 = {
                name: "影帝",
                description: NG.Utils.translateDescTxt("【流血技】[自][翻]。"),
                trigger: {
                    player: "damage" + "End",
                },
                content: function (event, player, trigger, result) {
                    player.turnOver(!player.isTurnedOver());
                },
            };
            var skill3 = {
                name: "基情",
                description: NG.Utils.translateDescTxt("【主动技】[任](男)<准>，若其[受伤]，[自]弃置一张基本牌，其血量+1。"),
                trigger: {
                    global: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return event.player.sex == "male" && event.player.isDamaged();
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.chooseToDiscard(1, { type: "basic" }, "弃置一张基本牌");
                    "step 1";
                    if (result.bool && result.cards.length) {
                        trigger.player.recover();
                    }
                },
            };
            var skill4 = {
                name: "老野",
                description: NG.Utils.translateDescTxt("【受伤技】[自][判]，[结]红桃（[自]血量+1）。"),
                trigger: {
                    player: "changeHp",
                },
                filter: function (event, player) {
                    return player.isDamaged() && event.num < 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.judge(function (jResult) {
                        return jResult.suit == "heart";
                    });
                    "step 1";
                    if (result.bool) {
                        player.recover();
                    }
                },
            };
            var skill42 = {
                name: "老野",
                description: NG.Utils.translateDescTxt("【受伤技】[自][判]，[结]红色牌（[任]血量+1）；黑色牌（[任][摸]1）。"),
                trigger: {
                    player: "changeHp",
                },
                filter: function (event, player) {
                    return event.num < 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.judge(function (jResult) {
                        return true;
                    });
                    "step 1";
                    event.judgeResult = result;
                    if (result.color == "red") {
                        player.chooseTarget(function (card, player, target) {
                            return target.isDamaged();
                        }, true, "任一角色血量+1");
                    }
                    else {
                        player.chooseTarget(true, "任一角色摸一张牌");
                    }
                    "step 2";
                    if (result.bool) {
                        var target = result.targets[0];
                        if (event.judgeResult.color == "red") {
                            target.recover();
                        }
                        else {
                            target.draw();
                        }
                    }
                },
            };
            var skill5 = {
                name: "触手",
                description: NG.Utils.translateDescTxt("【主动技】[自]将任一梅花牌当《连环锁术》使用或重铸。"),
                enable: ["chooseToUse", "phaseUse"],
                selectCard: 1,
                filterCard: function (card, player) {
                    return get.suit(card, player) == "club";
                },
                viewAs: { name: "tiesuo", suit: "club" },
                viewAsFilter: function (player) {
                    return player.countCards("he", { suit: "club" }) > 0;
                },
            };
            var skill6 = {
                name: "触摸",
                description: NG.Utils.translateDescTxt("【被动技】[任]被横置/重置时，[自]弃置其[手]一张。"),
                trigger: {
                    global: "link" + "Begin",
                },
                content: function (event, player, trigger, result) {
                    player.discardPlayerCard(trigger.player, "h");
                },
            };
            var skill7 = {
                name: "基绊",
                description: NG.Utils.translateDescTxt("【阶段技】[自]指定[他](男)，其选择一项：(1)其除去1点血量；(2)其交给[自]一张装备牌，其[摸]1。"),
                enable: "phaseUse",
                usable: 1,
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return player != target && target.sex == "male";
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var controlList = [];
                    event.target = event.targets[0];
                    controlList.push("\u81EA\u5DF1\u9664\u53BB1\u70B9\u8840\u91CF");
                    if (event.target.countCards("he", { type: "equip" })) {
                        controlList.push("\u4EA4\u7ED9\u3010" + get.translation(player) + "\u3011\u4E00\u5F20\u88C5\u5907\u724C\uFF0C\u5176\u81EA\u5DF1\u64781\u5F20\u724C");
                    }
                    event.target.chooseControlList(controlList, true);
                    "step 1";
                    event.num = result.index;
                    if (result.index === 0) {
                        event.target.loseHp();
                        event.finish();
                    }
                    else if (result.index === 1) {
                        event.target.chooseCard("he", { type: "equip" }, true), result.links[result.index];
                    }
                    else {
                        event.finish();
                    }
                    "step 2";
                    if (event.num == 1 && result.bool && result.cards.length) {
                        event.target.give(result.cards, player);
                        event.target.draw();
                    }
                },
            };
            var skill8 = {
                name: "基力",
                description: NG.Utils.translateDescTxt("【主动技】[自]将[自]一张装备牌当《闪》使用/打出。"),
                enable: ["chooseToUse", "chooseToRespond"],
                selectCard: 1,
                position: "he",
                filterCard: function (card, player) {
                    return get.type(card) == "equip";
                },
                viewAs: { name: "shan" },
                viewAsFilter: function (player) {
                    return player.countCards("he", { type: "equip" }) > 0;
                },
                ai: {
                    respondShan: true,
                }
            };
            var output = {
                zj_yanyuan: skill1,
                zj_yingdi: skill22,
                zj_jiqing: skill3,
                zj_laoye: skill42,
                zj_chushou: skill5,
                zj_chumo: skill6,
                zj_jiban: skill7,
                zj_jili: skill8,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "一些单技能组1", 3, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                name: "子龙",
                description: NG.Utils.translateDescTxt("【回合技】[自]<准备>，[自]弃置[自][区]任意数量的装备牌/魔法牌。每以此法弃置一张牌，视为对[他]使用一张《杀》(此《杀》不计入使用次数)。"),
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                usable: 1,
                filter: function (event, player) {
                    return player.countCards("hej", function (card) {
                        return get.type(card) == "equip" || get.type(card, "trick") == "trick";
                    }) > 0 && game.countPlayer(function (current) {
                        return player != current && player.canUse({ name: "sha" }, current);
                    }) > 0;
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    player.choosePlayerCard([1, Infinity], "hej", player).set("filterButton", function (button, player) {
                        var card = button.link;
                        return get.type(card) == "equip" || get.type(card, "trick") == "trick";
                    });
                    "step 1";
                    if (result.bool && result.links.length) {
                        event.num = 0;
                        event.cards = result.links;
                        if (event.cards.length) {
                            event.num = event.cards.length;
                            player.discard(event.cards, ui.ordering, player);
                        }
                        if (event.num == 0) {
                            event.finish();
                        }
                    }
                    else {
                        event.finish();
                    }
                    "step 2";
                    player.chooseUseTarget({ name: "sha" }, false, true);
                    "step 3";
                    if (result.bool && result.targets) {
                        event.num--;
                        if (event.num > 0) {
                            event.goto(2);
                        }
                    }
                }
            };
            var skill2 = {
                name: "健鹏",
                description: NG.Utils.translateDescTxt("【主动技】[自]使用《杀》指定角色为目标后，其不能使用《闪》；[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1。"),
                group: ["zj_jianpeng_1", "zj_jianpeng_2"],
                subSkill: {
                    1: {
                        description: NG.Utils.translateDescTxt("[自]使用《杀》指定角色为目标后，其不能使用《闪》"),
                        trigger: {
                            player: "useCardToPlayered",
                        },
                        filter: function (event, player) {
                            return get.name(event.card, player) == "sha";
                        },
                        forced: true,
                        content: function (event, player, trigger, result) {
                            trigger.getParent().directHit.add(trigger.target);
                        },
                    },
                    2: {
                        description: NG.Utils.translateDescTxt("[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1"),
                        trigger: {
                            player: "shaDamage",
                        },
                        content: function (event, player, trigger, result) {
                            "step 0";
                            player.judge(function (jResult) {
                                return jResult.color == "red" ? 1 : 0;
                            });
                            "step 1";
                            if (result.bool) {
                                trigger.target.loseMaxHp();
                            }
                        }
                    }
                },
            };
            var output = {
                zj_zilong: skill1,
                zj_jianpeng: skill2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试模式技能组3", 3, function (lib, game, ui, get, ai, _status) {
            var _hpMaxChange = {
                trigger: {
                    global: "gameStart",
                },
                content: function () {
                    "step 0";
                    for (var i = 0; i < game.players.length; i++) {
                        var player = game.players[i];
                        if (player.isAlive()) {
                            var info = get.character(player.name);
                            if (info && info[4].indexOf("ZJNGEx") > -1) {
                                var _info = info[5];
                                player.maxHp += _info[1];
                                player.update();
                            }
                        }
                    }
                }
            };
            var _bossGetSkills = {
                trigger: {
                    global: "gameStart",
                },
                silent: true,
                ruleSkill: true,
                filter: function (event, player) {
                    var mode = get.mode();
                    var canModes = ["identity", "chess"];
                    if (canModes.indexOf(mode) > -1) {
                        var flag = get.config('start_wuxingSkill');
                        var zhu = player;
                        var info = get.character(zhu.name);
                        if (player.isZhu && info && info[4].indexOf("ZJNGEx") > -1 && flag !== false) {
                            return true;
                        }
                    }
                },
                content: function (event, player, trigger, result) {
                    "step 0";
                    var mode = get.mode();
                    var canModes = ["identity"];
                    if (canModes.indexOf(mode) > -1) {
                        var zhu = player;
                        var info = get.character(zhu.name);
                        if (player.isZhu && info && info[4].indexOf("ZJNGEx") > -1) {
                            var shuxing = zhu.group;
                            var skills = [];
                            switch (shuxing) {
                                case "shu":
                                    skills = ["zj_shuxing_huohun", "zj_shuxing_huoling"];
                                    break;
                                case "shen":
                                    skills = ["zj_shuxing_jinghun", "zj_shuxing_fahua"];
                                    break;
                                case "qun":
                                    skills = ["zj_shuxing_xueyu", "zj_shuxing_huwei"];
                                    break;
                                case "wei":
                                    skills = ["zj_shuxing_shuiyuan", "zj_shuxing_xingshuai"];
                                    break;
                                case "wu":
                                    skills = ["zj_shuxing_jiuhu", "zj_shuxing_muyuan"];
                                    break;
                                case "western":
                                default:
                                    skills = ["zj_shuxing_wuyu", "zj_shuxing_wuyu2"];
                                    break;
                            }
                            for (var i = 0; i < skills.length; i++) {
                                var skill = skills[i];
                                var info_1 = get.info(skill);
                                if (info_1) {
                                    if (info_1.isAddGlobalSkill) {
                                        game.addGlobalSkill(skill, zhu);
                                    }
                                }
                            }
                            zhu.addSkill(skills);
                            game.log(zhu, "\u83B7\u5F97" + get.translation(shuxing) + "\u5C5E\u6027\u6280\u80FD\uFF1A", skills);
                        }
                        else if (!zhu) {
                            console.warn("竟然没有主公？");
                        }
                        else {
                            console.warn("不是【联盟杀】角色");
                        }
                    }
                }
            };
            var _yanzheng = {
                name: "炎阵",
                description: NG.Utils.translateDescTxt("【被动技】[他]与[自]距离为1的角色视为在[他](火)的攻击范围内。"),
                isAddGlobalSkill: true,
                unique: true,
                mod: {
                    attackFrom: function (from, to, range) {
                        if (from.group == "shu" && game.zhu.distanceFrom(to) <= 1 && from != game.zhu) {
                            return -Infinity;
                        }
                    }
                },
            };
            var new_huoling = {
                name: "火灵",
                description: NG.Utils.translateDescTxt("【主动技】[自]需要使用或打出一张【杀】时，[自]可以令[他](火)打出一张【杀】(视为由[自]使用或打出)。"),
                unique: true,
                group: ['zj_shuxing_huoling_1', 'zj_shuxing_huoling_2'],
                zhuSkill: true,
                subSkill: {
                    1: {
                        trigger: { player: 'chooseToRespondBegin' },
                        check: function (event) {
                            if (event.jijiang)
                                return false;
                            return true;
                        },
                        filter: function (event, player) {
                            if (event.responded)
                                return false;
                            if (player.storage.jijianging)
                                return false;
                            if (!player.hasZhuSkill('zj_shuxing_huoling'))
                                return false;
                            if (!event.filterCard({ name: 'sha' }, player, event))
                                return false;
                            return game.hasPlayer(function (current) {
                                return current != player && current.group == "shu";
                            });
                        },
                        content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                            "step 0";
                            if (event.current == undefined)
                                event.current = player.next;
                            if (event.current == player) {
                                event.finish();
                            }
                            else if (event.current.group == "shu") {
                                player.storage.jijianging = true;
                                var next = event.current.chooseToRespond('是否替' + get.translation(player) + '打出一张杀？', { name: 'sha' });
                                next.set('ai', function () {
                                    var event = _status.event;
                                    return (get.attitude(event.player, event.source) - 2);
                                });
                                next.set('source', player);
                                next.set('jijiang', true);
                                next.set('skillwarn', '替' + get.translation(player) + '打出一张杀');
                                next.noOrdering = true;
                                next.autochoose = lib.filter.autoRespondSha;
                            }
                            else {
                                event.current = event.current.next;
                                event.redo();
                            }
                            "step 1";
                            player.storage.jijianging = false;
                            if (result.bool) {
                                event.finish();
                                trigger.result = result;
                                trigger.responded = true;
                                trigger.animate = false;
                                if (typeof event.current.ai.shown == 'number' && event.current.ai.shown < 0.95) {
                                    event.current.ai.shown += 0.3;
                                    if (event.current.ai.shown > 0.95)
                                        event.current.ai.shown = 0.95;
                                }
                            }
                            else {
                                event.current = event.current.next;
                                event.goto(0);
                            }
                        }
                    },
                    2: {
                        enable: 'chooseToUse',
                        prompt: '选择一名目标角色。若有其他火属性角色打出【杀】响应，则视为你对其使用此【杀】。',
                        filter: function (event, player) {
                            if (event.filterCard && !event.filterCard({ name: 'sha' }, player, event))
                                return false;
                            if (!player.hasZhuSkill('zj_shuxing_huoling'))
                                return false;
                            if (player.hasSkill('zj_shuxing_huoling_3'))
                                return false;
                            if (!lib.filter.cardUsable({ name: 'sha' }, player))
                                return false;
                            return game.hasPlayer(function (current) {
                                return current != player && current.group == "shu";
                            });
                        },
                        filterTarget: function (card, player, target) {
                            if (_status.event._backup &&
                                typeof _status.event._backup.filterTarget == 'function' &&
                                !_status.event._backup.filterTarget({ name: 'sha' }, player, target)) {
                                return false;
                            }
                            return player.canUse({ name: 'sha' }, target);
                        },
                        content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                            "step 0";
                            if (event.current == undefined)
                                event.current = player.next;
                            if (event.current == player) {
                                player.addSkill('zj_shuxing_huoling_3');
                                event.getParent(2).step = 0;
                                event.finish();
                            }
                            else if (event.current.group == "shu") {
                                var next = event.current.chooseToRespond('是否替' + get.translation(player) + '对' + get.translation(target) + '使用一张杀', function (card, player, event) {
                                    event = event || _status.event;
                                    return card.name == 'sha' && event.source.canUse(card, event.target);
                                });
                                next.set('ai', function (card) {
                                    var event = _status.event;
                                    return get.effect(event.target, card, event.source, event.player);
                                });
                                next.set('source', player);
                                next.set('target', target);
                                next.set('jijiang', true);
                                next.set('skillwarn', '替' + get.translation(player) + '打出一张杀');
                                next.noOrdering = true;
                                next.autochoose = lib.filter.autoRespondSha;
                            }
                            else {
                                event.current = event.current.next;
                                event.redo();
                            }
                            "step 1";
                            if (result.bool) {
                                event.finish();
                                if (result.cards && result.cards.length) {
                                    player.useCard({ name: 'sha', isCard: true }, result.cards, target).animate = false;
                                }
                                else {
                                    player.useCard({ name: 'sha', isCard: true }, target).animate = false;
                                }
                                if (typeof event.current.ai.shown == 'number' && event.current.ai.shown < 0.95) {
                                    event.current.ai.shown += 0.3;
                                    if (event.current.ai.shown > 0.95)
                                        event.current.ai.shown = 0.95;
                                }
                            }
                            else {
                                event.current = event.current.next;
                                event.goto(0);
                            }
                        },
                        ai: {
                            respondSha: true,
                            skillTagFilter: function (player) {
                                if (!player.hasZhuSkill('zj_shuxing_huoling'))
                                    return false;
                                return game.hasPlayer(function (current) {
                                    return current != player && current.group == "shu";
                                });
                            },
                            result: {
                                target: function (player, target) {
                                    if (player.hasSkill('zj_shuxing_huoling_3'))
                                        return 0;
                                    return get.effect(target, { name: 'sha' }, player, target);
                                }
                            },
                            order: function () {
                                return get.order({ name: 'sha' }) - 0.1;
                            },
                        }
                    },
                    3: {
                        trigger: { global: ['useCardAfter', 'useSkillAfter', 'phaseAfter'] },
                        silent: true,
                        filter: function (event) {
                            return event.skill != 'zj_shuxing_huoling_2' && event.skill != 'qinwang2';
                        },
                        content: function (event, step, source, player, target, targets, card, cards, skill, forced, num, trigger, result) {
                            player.removeSkill('zj_shuxing_huoling_3');
                        }
                    }
                }
            };
            var _yanhuo = {
                name: "炎火",
                description: NG.Utils.translateDescTxt("【主动技】[他](火)使用【杀】结算完毕时，其可将之交给[自]，然后[自]可令其摸一张牌。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "useCard" + "After",
                },
                prompt: function (event) {
                    return "\u5F53\u524D" + get.translation("sha") + "\u7ED3\u7B97\u5B8C\u6BD5\uFF0C\u4F60\u662F\u5426\u8981\u5C06\u5176\u4EA4\u7ED9\u3010" + get.translation(game.zhu) + "\u3011\uFF0C\u3010" + get.translation(game.zhu) + "\u3011\u53EF\u4EE4\u4F60\u6478\u4E00\u5F20\u724C\uFF1F";
                },
                filter: function (event, player) {
                    return player != game.zhu &&
                        get.itemtype(event.cards) == "cards" &&
                        get.position(event.cards[0], true) == "o" &&
                        get.name(event.card, player) == "sha" &&
                        player.group == "shu";
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    trigger.orderingCards.removeArray(trigger.cards);
                    player.give(trigger.cards, game.zhu);
                    "step 1";
                    game.zhu.chooseBool("\u662F\u5426\u4EE4" + get.translation(player) + "\u5176\u62BD\u4E00\u5F20\u724C\uFF1F");
                    "step 2";
                    if (result.bool) {
                        player.draw();
                    }
                }
            };
            var huohun = {
                name: "火魂",
                description: NG.Utils.translateDescTxt("【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“火源”。"),
                skillAnimation: true,
                animationColor: "fire",
                unique: true,
                juexingji: true,
                keepSkill: true,
                forced: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return player.isMinHp(true);
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.gainMaxHp();
                    "step 1";
                    player.recover();
                    game.log(player, '获得了技能', '#g【火魂】');
                    player.addAdditionalSkill('zj_shuxing_huohun', 'zj_awaken_huohun');
                    player.awakenSkill("zj_shuxing_huohun");
                },
            };
            var _awaken_huohun = {
                name: "火源",
                description: NG.Utils.translateDescTxt("【主动技】[他](火)造成1点伤害后，可令[自]摸一张牌。"),
                unique: true,
                trigger: {
                    source: ["damage" + "End"],
                },
                global: "zj_global_huohun",
            };
            var zj_global_huohun = {
                name: "火源",
                description: NG.Utils.translateDescTxt("【主动技】(火)造成1点伤害后，可令[自]摸一张牌。"),
                derivation: "zj_awaken_huohun",
                filter: function (event, player) {
                    return player != game.zhu && player.group == "shu" && event.num > 0 &&
                        get.itemtype(event.cards) == "cards" &&
                        get.name(event.card, player) == "sha";
                },
                prompt: function (event) {
                    return "\u662F\u5426\u4EE4\u3010" + get.translation(game.zhu) + "\u3011\u5176\u62BD" + event.num + "\u5F20\u724C\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    game.zhu.draw(trigger.num);
                },
            };
            var _shuiyuan = {
                name: "水源",
                description: NG.Utils.translateDescTxt("【主动技】[他](水)的判定牌为黑色且生效后，该角色可以令[自]摸一张牌。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "judge" + "End",
                },
                filter: function (event, player) {
                    var result = event.result;
                    var isBlack = result && result.bool && result.color == "black";
                    return player != game.zhu && player.group == "wei" && isBlack;
                },
                prompt: function (event) {
                    return "\u662F\u5426\u4EE4\u3010" + get.translation(game.zhu) + "\u3011\u5176\u62BD\u4E00\u5F20\u724C\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    game.zhu.draw();
                }
            };
            var _shuiling = {
                name: "水灵",
                description: NG.Utils.translateDescTxt("【改判技】[自]可令[他们](水)选择是否打出黑色代替之。"),
                trigger: {
                    player: "judge",
                },
                filter: function (event, player) {
                    var count = game.countPlayer(function (player) {
                        return player != game.zhu && player.group == "wei";
                    });
                    return count && player != game.zhu;
                },
                content: function (event, source, player, target, trigger, result) {
                    player.chooseToRespondByAll({
                        filterPlayer: function (player) {
                            return player.group == "wei" && player != game.zhu;
                        },
                        prompt: "\u5224\u5B9A\u5373\u5C06\u751F\u6548\uFF0C\u4F60\u662F\u5426\u4E3A\u3010" + get.translation(player) + "\u3011\u6253\u51FA\u9ED1\u8272\u724C\u4EE3\u66FF\u4E4B\uFF1F]",
                        respondFun: function (event, trigger, player, current, prompt) {
                            current.chooseBool(prompt);
                        },
                        respondResultFun: function (event, trigger, result, player, current) {
                            current.replaceJudge({
                                jTrigger: trigger,
                                position: "he",
                            });
                        },
                    });
                }
            };
            var _shuizong = {
                name: "水冢",
                description: NG.Utils.translateDescTxt("【主动技】[他](水)造成1点伤害后，该角色可判定，当红色判定牌生效后，[自]获得之。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    source: ["damage" + "End"],
                },
                filter: function (event, player) {
                    return player != game.zhu && player.group == "wei" && event.num > 0;
                },
                prompt: function (event) {
                    return "\u662F\u5426\u8FDB\u884C\u5224\u5B9A\uFF0C\u5F53\u7EA2\u8272\u5224\u5B9A\u724C\u751F\u6548\u540E\uFF0C\u3010" + get.translation(game.zhu) + "\u3011\u83B7\u5F97\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.judge(function (jResult) {
                        return jResult.color == "red" ? 1 : 0;
                    });
                    "step 1";
                    if (result.bool) {
                        game.zhu.gain(result.card);
                    }
                },
            };
            var _xingshuai = {
                name: "水圣",
                description: NG.Utils.translateDescTxt("【限定技】[自]进入濒死状态前，[自]可令[他们](水)选择：1.[自]血量+1；2.其受到1点伤害。"),
                limited: true,
                trigger: {
                    player: "dying" + "Before",
                },
                filter: function (event, player) {
                    var count = game.countPlayer(function (player) {
                        return player != game.zhu && player.group == "wei";
                    });
                    return count && player.isZhu;
                },
                content: function (event, source, player, target, trigger, result) {
                    player.awakenSkill("zj_shuxing_xingshuai");
                    player.chooseToRespondByAll({
                        filterPlayer: function (player) {
                            return player.group == "wei" && player != game.zhu;
                        },
                        respondFun: function (event, trigger, player, current, prompt) {
                            current.chooseControlList([
                                "\u4F7F\u3010" + get.translation(player) + "\u3011\u8840\u91CF+1",
                                "\u4F60\u53D7\u52301\u70B9\u4F24\u5BB3"
                            ], true);
                        },
                        respondResultFun: function (event, trigger, result, player, current) {
                            if (result.index === 0) {
                                player.recover();
                            }
                            else if (result.index === 1) {
                                current.damage();
                            }
                        },
                    });
                }
            };
            var _huwei = {
                name: "护卫",
                description: NG.Utils.translateDescTxt("【主动技】[自]需要使用或打出一张【闪】时，[自]可以令[他](土)打出一张【闪】(视为由[自]使用或打出)。"),
                unique: true,
                zhuSkill: true,
                trigger: {
                    player: ['chooseToRespondBefore', 'chooseToUseBefore']
                },
                filter: function (event, player) {
                    if (event.responded)
                        return false;
                    if (player.storage.zj_shuxing_huwei)
                        return false;
                    if (!event.filterCard({ name: 'shan' }, player, event))
                        return false;
                    return game.hasPlayer(function (current) {
                        return current != player && current.group == "qun";
                    });
                },
                check: function (event, player) {
                    if (get.damageEffect(player, event.player, player) >= 0)
                        return false;
                    return true;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    if (event.current == undefined)
                        event.current = player.next;
                    if (event.current == player) {
                        event.finish();
                    }
                    else if (event.current.group == "qun") {
                        if ((event.current == game.me && !_status.auto) || (get.attitude(event.current, player) > 2) ||
                            event.current.isOnline()) {
                            player.storage.zj_shuxing_huwei = true;
                            var next = event.current.chooseToRespond('是否替' + get.translation(player) + '打出一张闪？', { name: 'shan' });
                            next.set('ai', function () {
                                var event = _status.event;
                                return (get.attitude(event.player, event.source) - 2);
                            });
                            next.set('skillwarn', '替' + get.translation(player) + '打出一张闪');
                            next.autochoose = lib.filter.autoRespondShan;
                            next.set('source', player);
                        }
                    }
                    "step 1";
                    player.storage.zj_shuxing_huwei = false;
                    if (result.bool) {
                        event.finish();
                        trigger.result = { bool: true, card: { name: 'shan', isCard: true } };
                        trigger.responded = true;
                        trigger.animate = false;
                        if (typeof event.current.ai.shown == 'number' && event.current.ai.shown < 0.95) {
                            event.current.ai.shown += 0.3;
                            if (event.current.ai.shown > 0.95)
                                event.current.ai.shown = 0.95;
                        }
                    }
                    else {
                        event.current = event.current.next;
                        event.goto(0);
                    }
                },
                ai: {
                    respondShan: true,
                    skillTagFilter: function (player) {
                        if (player.storage.zj_shuxing_huwei)
                            return false;
                        return game.hasPlayer(function (current) {
                            return current != player && current.group == "qun";
                        });
                    },
                },
            };
            var _xueyu = {
                name: "血裔",
                description: NG.Utils.translateDescTxt("【被动技】[自]手牌上限+X（X=[他](土)角色数）。"),
                unique: true,
                mod: {
                    maxHandcard: function (player, num) {
                        var count = game.countPlayer(function (current) {
                            return current.group == "qun" && current != player;
                        });
                        return (num + count) * 2;
                    },
                },
            };
            var _huwei2 = {
                name: "守护",
                description: NG.Utils.translateDescTxt("【回合技】[他](土)<准备>，[他]可将一张非武器牌的装备牌置于[自]装备区里，[自]可令其摸一张牌。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    var count = game.countPlayer(function (player) {
                        return player != game.zhu && player.group == "qun";
                    });
                    var cardCount = player.countCards("he", function (card) {
                        return get.subtype(card) != "equip1" && get.type(card) == "equip";
                    });
                    return count && cardCount && player != game.zhu;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.chooseCard(function (card, player) {
                        return get.subtype(card) != "equip1" && get.type(card) == "equip";
                    }, "he");
                    "step 1";
                    if (result.bool) {
                        event.target = game.zhu;
                        player.$give(result.cards, event.target);
                        event.target.equip(result.cards[0]);
                    }
                    else {
                        event.finish();
                    }
                    "step 2";
                    game.zhu.chooseBool("\u662F\u5426\u8BA9\u3010" + get.translation(player) + "\u3011\u64781\u5F20\u724C");
                    "step 3";
                    if (result.bool) {
                        player.draw();
                    }
                },
            };
            var _sichou = {
                name: "誓仇",
                description: NG.Utils.translateDescTxt("【限定技】[自]<准备>，[自]将两张牌交给[他](土)直到其下次进入濒死状态前：[自]受到一次伤害前，[他]可将此伤害转移给其，若此，若其因此而受到伤害进行的伤害结算结束时，其摸X张牌。（X=伤害值）"),
                limited: true,
                unique: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return player.countCards("h") >= 2 &&
                        game.countPlayer(function (current) {
                            return player != current && current.group == "qun";
                        }) > 0;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.awakenSkill("zj_shuxing_sichou");
                    player.chooseCardTarget({
                        selectCard: 2,
                        filterCard: lib.filter.all,
                        position: "he",
                        selectTarget: 1,
                        filterTarget: function (card, player, target) {
                            return player != target && target.group == "qun";
                        },
                    });
                    "step 1";
                    if (result.bool) {
                        event.target = result.targets[0];
                        player.give(result.cards, event.target);
                        event.target.addTempSkill("zj_shuxing_sichou_state", "dying" + "Before");
                    }
                },
                subSkill: {
                    state: {
                        trigger: {
                            global: "damageBegin3",
                        },
                        filter: function (event, player) {
                            return event.num > 0 && event.player == game.zhu;
                        },
                        content: function (event, source, player, target, trigger, result) {
                            trigger.player = player;
                            trigger.source && trigger.source.line(player, "fire");
                            player.addTempSkill("zj_shuxing_sichou_damage", "damage" + "After");
                        },
                        mark: true,
                        marktext: "誓",
                        intro: {
                            content: function (storage, player, skill) {
                                return "\u76F4\u5230\u4F60\u4E0B\u6B21\u8FDB\u5165\u6FD2\u6B7B\u72B6\u6001\u524D\uFF1A\u3010" + get.translation(game.zhu) + "\u3011\u53D7\u5230\u4E00\u6B21\u4F24\u5BB3\u524D\uFF0C\u4F60\u53EF\u5C06\u6B64\u4F24\u5BB3\u8F6C\u79FB\u7ED9\u4F60\uFF0C\u82E5\u6B64\uFF0C\u82E5\u5176\u56E0\u6B64\u800C\u53D7\u5230\u4F24\u5BB3\u8FDB\u884C\u7684\u4F24\u5BB3\u7ED3\u7B97\u7ED3\u675F\u65F6\uFF0C\u4F60\u6478X\u5F20\u724C\u3002\uFF08X=\u4F24\u5BB3\u503C\uFF09";
                            },
                        },
                    },
                    damage: {
                        trigger: {
                            player: "damage" + "End",
                        },
                        filter: function (event, player) {
                            return event.num > 0;
                        },
                        silent: true,
                        content: function (event, source, player, target, trigger, result) {
                            player.draw(trigger.num);
                        },
                    }
                }
            };
            var jiuhu = {
                name: "救护",
                description: NG.Utils.translateDescTxt("【被动技】[他](木)对处于濒死状态的[自]使用【血】的血量回复值+1。"),
                unique: true,
                trigger: {
                    target: "tao" + "Begin"
                },
                forced: true,
                filter: function (event, player) {
                    if (event.player == player)
                        return false;
                    if (event.player.group != "wu")
                        return false;
                    return true;
                },
                content: function (event, source, player, target, trigger, result) {
                    trigger.baseDamage++;
                },
            };
            var muyuan = {
                name: "木源",
                description: NG.Utils.translateDescTxt("【主动技】[他](木)回复血量后，该角色可令[自]摸一张牌。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "recover" + "End",
                },
                filter: function (event, player) {
                    return player != game.zhu && event.num > 0 && event.player.group == "wu";
                },
                prompt: function (event) {
                    return "\u4F60\u56DE\u590D\u8840\u91CF\u540E\uFF0C\u53EF\u4EE4\u3010" + get.translation(game.zhu) + "\u3011\u64781\u5F20\u724C\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    game.zhu.draw();
                },
            };
            var mudi = {
                name: "木帝",
                description: NG.Utils.translateDescTxt("【主动技】[自]的牌于<弃牌>因弃置而置入弃牌堆时，[自]可交给至少一名[他](木)各一张其中的牌。"),
                unique: true,
                trigger: {
                    player: "phaseDiscard" + "End",
                },
                filter: function (event, player) {
                    return event.cards && event.cards.length > 0 && game.countPlayer(function (current) {
                        return current != player && current.group == "wu";
                    }) > 0;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    event.num = 0;
                    event.targets = get.players(function (current) {
                        return current != player && current.group == "wu";
                    });
                    "step 1";
                    if (event.num < event.targets.length && event.targets[event.num] && trigger.cards.length) {
                        event.target = event.targets[event.num];
                        player.chooseCardButton(1, trigger.cards, "\u4EA4\u7ED91\u5F20\u724C\u7ED9\u3010" + get.translation(event.target) + "\u3011");
                    }
                    else {
                        event.finish();
                    }
                    "step 2";
                    if (result.bool) {
                        event.num++;
                        player.give(result.links, event.target, true);
                        trigger.cards.removeArray(result.links);
                        if (trigger.cards && trigger.cards.length) {
                            event.goto(1);
                        }
                    }
                    else {
                        event.num++;
                        event.goto(1);
                    }
                },
            };
            var zuqu = {
                name: "竹取",
                description: NG.Utils.translateDescTxt("【主动技】[他](木)的红桃判定牌生效后，其可令[自]血量+1。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "judge" + "End",
                },
                filter: function (event, player) {
                    var result = event.result;
                    return player != event.player && player.group == "wu" && result.bool && result.suit == "heart";
                },
                prompt: function (event) {
                    var result = event.result;
                    return "\u4F60\u7684\u5224\u5B9A" + (event.judgestr || '') + "\u7684\u5224\u5B9A\u4E3A" + get.translation(result.card) + "\u4E3A\u7EA2\u8272\u751F\u6548\uFF0C\u662F\u5426\u4EE4\u3010" + get.translation(game.zhu) + "\u3011\u8840\u91CF+1";
                },
                content: function (event, source, player, target, trigger, result) {
                    game.zhu.recover();
                },
            };
            var fahua = {
                name: "法华",
                description: NG.Utils.translateDescTxt("【主动技】[自]成为[他]使用的魔法牌的目标时，[自]可令[他们](金)选择是否代替[自]成为此牌的目标。"),
                trigger: {
                    target: "useCardToTarget",
                },
                filter: function (event, player) {
                    if (event.player == player)
                        return false;
                    if (event.multitarget) {
                        if (!event.targets || !event.targets.contains(player))
                            return false;
                    }
                    var type = get.type2(event.card, player);
                    if (type != "trick")
                        return false;
                    if (game.countPlayer(function (current) {
                        return current.group == "shen" && current != player;
                    }) <= 0)
                        return false;
                    return true;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.chooseToRespondByAll({
                        filterPlayer: function (player) {
                            return player.group == "shen" && player != game.zhu;
                        },
                        prompt: "\u4F60\u662F\u5426\u4E3A\u3010" + get.translation(player) + "\u3011\u4EE3\u66FF\u6210\u4E3A[" + get.translation(trigger.card) + "\u7684\u76EE\u6807\uFF1F]",
                        respondFun: function (event, trigger, player, current, prompt) {
                            current.chooseBool(prompt);
                        },
                        respondResultFun: function (event, trigger, result, player, current) {
                            if (result.bool) {
                                if (trigger.multitarget) {
                                    trigger.targets.remove(game.zhu);
                                    trigger.targets.add(current);
                                    trigger.player.line(current, "green");
                                }
                                else {
                                    trigger.target = current;
                                    trigger.player.line(current, "green");
                                }
                            }
                        },
                    });
                },
            };
            var zhiyuan = {
                name: "支援",
                description: NG.Utils.translateDescTxt("【主动技】[自]失去最后的手牌时，[他](金)可交给你一张手牌。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "lose" + "After",
                },
                filter: function (event, player) {
                    if (player.countCards("h"))
                        return false;
                    return event.hs && event.hs.length > 0 && player.group == "shen" &&
                        event.player == game.zhu &&
                        event.player.countCards("h") == 0 &&
                        player != game.zhu;
                },
                prompt: function (event) {
                    return "\u3010" + get.translation(game.zhu) + "\u3011\u5931\u53BB\u6700\u540E\u7684\u624B\u724C\uFF0C\u4F60\u53EF\u4EE5\u4EA4\u7ED9\u3010" + get.translation(game.zhu) + "\u30111\u5F20\u624B\u724C";
                },
                selectCard: 1,
                position: "h",
                content: function (event, source, player, target, trigger, result) {
                    event.target = game.zhu;
                    player.give(event.cards, event.target);
                },
            };
            var jingling = {
                name: "金灵",
                description: NG.Utils.translateDescTxt("【被动技】[自]死亡时，[自]可令[他](金)身份牌暗置的角色将其身份牌明置，若为忠臣，其成为主公。"),
                unique: true,
                trigger: {
                    player: "die" + "Begin",
                },
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        return current.group == "shen" && !current.identityShown && current != player;
                    }) > 0;
                },
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return target.group == "shen" && !target.identityShown && player != target;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    event.target = event.targets[0];
                    game.broadcastAll(function (source) {
                        source.setIdentity();
                    }, event.target);
                    game.addVideo('setIdentity', event.target);
                    "step 1";
                    if (event.target.identity == "zhong") {
                        game.broadcastAll(function (player, target) {
                            var pidentity = player.identity;
                            var tidentity = target.identity;
                            player.setIdentity(tidentity);
                            target.setIdentity(pidentity);
                        }, player, event.target);
                        player.line(event.target, "green");
                    }
                },
            };
            var jinghun = {
                name: "金魂",
                description: NG.Utils.translateDescTxt("【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“金源”。"),
                skillAnimation: true,
                animationColor: "metal",
                unique: true,
                juexingji: true,
                keepSkill: true,
                forced: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                filter: function (event, player) {
                    return player.isMinHp(true);
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.gainMaxHp();
                    "step 1";
                    player.recover();
                    game.log(player, '获得了技能', '#g【金源】');
                    player.addAdditionalSkill('zj_shuxing_jinghun', 'zj_awaken_jingyuan');
                    player.awakenSkill("zj_awaken_jingyuan");
                },
            };
            var jingyuan = {
                name: "金源",
                description: NG.Utils.translateDescTxt("【主动技】[他](金)<出牌>，其可将一张魔法牌交给你[自]。"),
                unique: true,
                global: "zj_awaken_jingyuan_global",
                subSkill: {
                    global: {
                        derivation: "zj_awaken_jingyuan",
                        enable: "phaseUse",
                        filter: function (event, player) {
                            return player.countCards("he", function (card) {
                                return get.type2(card, player) == "trick";
                            }) && player.group == "shen" && player != game.zhu;
                        },
                        selectCard: 1,
                        filterCard: function (card, player) {
                            return get.type2(card, player) == "trick";
                        },
                        prompt: function (event) {
                            return "\u53EF\u5C06\u4E00\u5F20\u9B54\u6CD5\u724C\u4EA4\u7ED9\u3010" + get.translation(game.zhu) + "\u3011";
                        },
                        content: function (event, source, player, target, trigger, result) {
                            player.give(event.cards, game.zhu);
                        },
                    },
                }
            };
            var wuyu = {
                name: "物语",
                description: NG.Utils.translateDescTxt("【被动技】[他](非无)死亡时，视为由[自]杀死。"),
                unique: true,
                trigger: {
                    global: "die" + "Begin",
                },
                forced: true,
                priority: 20,
                filter: function (event, player) {
                    return event.player && event.player.group != "western" &&
                        player != event.player && player != event.source;
                },
                content: function (event, source, player, target, trigger, result) {
                    trigger.source = player;
                },
            };
            var wuyi = {
                name: "无义",
                description: NG.Utils.translateDescTxt("【回合技】[他](无)<准备>，[他]可与[自]交换手牌（[自]可拒绝此交换）。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                usable: 1,
                filter: function (event, player) {
                    return player.group == "western" && player != game.zhu;
                },
                prompt: function (event) {
                    return "\u4F60\u53EF\u4E0E\u3010" + get.translation(game.zhu) + "\u3011\u4EA4\u6362\u624B\u724C\uFF08\u3010" + get.translation(event.player) + "\u3011\u53EF\u62D2\u7EDD\u6B64\u4EA4\u6362\uFF09\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    event.target = game.zhu;
                    game.zhu.chooseBool("\u4F60\u662F\u5426\u8981\u548C" + get.translation(player) + "\u4EA4\u6362\u624B\u724C\uFF1F");
                    "step 1";
                    if (result.bool) {
                        player.swapHandcards(event.target);
                    }
                },
            };
            var wuyi2 = {
                name: "wuyi2",
                description: NG.Utils.translateDescTxt("【回合技】[他](无)<准备>，[他]可跳过其的<摸牌>，令[自]在下回合的<摸牌>摸牌+2。"),
                isAddGlobalSkill: true,
                unique: true,
                trigger: {
                    player: "phaseZhunbeiBegin",
                },
                usable: 1,
                filter: function (event, player) {
                    return player.group == "western" && player != game.zhu;
                },
                prompt: function (event) {
                    return "\u4F60\u8981\u8DF3\u8FC7\u81EA\u5DF1\u7684\u6478\u724C\u9636\u6BB5\uFF0C\u4EE4\u3010" + get.translation(game.zhu) + "\u3011\u5728\u4E0B\u56DE\u5408\u7684\u6478\u724C\u9636\u6BB5\u6478\u724C\u6570+2\uFF1F";
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    event.target = game.zhu;
                    trigger.cancel();
                    event.target.storage.drawPhaseDrawAdd = 2;
                    event.target.addTempSkill("drawPhaseDrawAdd", "phaseDraw" + "End");
                },
            };
            var drawPhaseDrawAdd = {
                name: "追加摸牌",
                description: "摸牌阶段摸牌数增加",
                trigger: {
                    player: "phaseDraw" + "Begin",
                },
                silent: true,
                mark: true,
                marktext: "摸",
                intro: {
                    content: "下回合的摸牌阶段摸牌数+#",
                },
                filter: function (event, player) {
                    return player.storage.drawPhaseDrawAdd;
                },
                content: function (event, source, player, target, trigger, result) {
                    trigger.num += player.storage.drawPhaseDrawAdd;
                }
            };
            var wuyu2 = {
                name: "无域",
                description: NG.Utils.translateDescTxt("【限定技】[自]<出牌>，[自]可令[他](非无)身份牌暗置的角色将其身份牌明置：若为忠臣，[自]弃置所有牌；若为反贼，[自]摸三张牌。"),
                unique: true,
                enable: "phaseUse",
                limited: true,
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        return !current.identityShown && current.group != "western" && current != game.zhu;
                    }) > 0 && player.isZhu;
                },
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return !target.identityShown && target.group != "western" && target != game.zhu;
                },
                content: function (event, source, player, target, trigger, result) {
                    "step 0";
                    player.awakenSkill("zj_shuxing_wuyu2");
                    event.target = event.targets[0];
                    game.broadcastAll(function (source) {
                        source.setIdentity();
                    }, event.target);
                    game.addVideo('setIdentity', event.target);
                    "step 1";
                    if (event.target.identity == "zhong") {
                        player.discard(player.getCards("he"));
                    }
                    else if (event.target.identity == "fan") {
                        player.draw(3);
                    }
                },
            };
            var output = {
                _bossGetSkills: _bossGetSkills,
                zj_shuxing_yanzheng: _yanzheng,
                zj_shuxing_yanhuo: _yanhuo,
                zj_shuxing_huohun: huohun,
                zj_awaken_huohun: _awaken_huohun,
                zj_global_huohun: zj_global_huohun,
                zj_shuxing_huoling: new_huoling,
                zj_shuxing_shuiyuan: _shuiyuan,
                zj_shuxing_shuizong: _shuizong,
                zj_shuxing_shuiling: _shuiling,
                zj_shuxing_xingshuai: _xingshuai,
                zj_shuxing_xueyu: _xueyu,
                zj_shuxing_huwei2: _huwei2,
                zj_shuxing_sichou: _sichou,
                zj_shuxing_huwei: _huwei,
                zj_shuxing_jiuhu: jiuhu,
                zj_shuxing_muyuan: muyuan,
                zj_shuxing_mudi: mudi,
                zj_shuxing_zuqu: zuqu,
                zj_shuxing_zhiyuan: zhiyuan,
                zj_shuxing_jingling: jingling,
                zj_shuxing_jinghun: jinghun,
                zj_awaken_jingyuan: jingyuan,
                zj_shuxing_fahua: fahua,
                zj_shuxing_wuyu: wuyu,
                zj_shuxing_wuyi: wuyi,
                zj_shuxing_wuyi2: wuyi2,
                drawPhaseDrawAdd: drawPhaseDrawAdd,
                zj_shuxing_wuyu2: wuyu2,
            };
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    ZJNGEx.type = "extension";
    function extensionFun(lib, game, ui, get, ai, _status) {
        NG.initContent(lib, _status, game, ui, get, ai);
        var heros = {
            name: "ZJ联盟杀hero",
            connect: true,
            characterSort: {},
            character: {},
            characterTitle: {},
            characterIntro: {},
            skill: {},
            translate: {}
        };
        var skills = {
            skill: {},
            translate: {}
        };
        var cards = {
            connect: true,
            card: {},
            skill: {},
            list: [],
            translate: {}
        };
        var extensionData = {
            name: "ZJ联盟杀",
            key: "ZJSha",
            editable: true,
            config: {
                start_wuxing: {
                    name: "启用五行属性",
                    init: true,
                    connect: true,
                    intro: "将”魏蜀吴群神“变为”水火木土金“",
                    frequent: true,
                    onclick: function (item) {
                        updateWuxingName(item);
                        game.saveConfig("start_wuxing", item);
                    }
                },
                start_wuxingSkill: {
                    name: "启用五行属性主公技",
                    init: true,
                    connect: true,
                    intro: "在身份局中，不同属性的身份会拥有不同的主公技",
                    frequent: true,
                    onclick: function (item) {
                        updateWuxingSkill(item);
                        game.saveConfig('start_wuxingSkill', item);
                    }
                },
                start_ZjshaCardName: {
                    name: "启用联盟杀卡牌",
                    init: true,
                    connect: true,
                    intro: "三国杀标准，军争包的卡牌名字替换成联盟杀用卡名",
                    frequent: true,
                    onclick: function (item) {
                        updataZjshaCardName(item);
                        game.saveConfig('start_ZjshaCardName', item);
                    }
                },
            },
            precontent: function (data) {
                lib.functionUtil = NG.FunctionUtil;
                NG.Utils.loadDevData(window.ZJNGEx, extensionData, lib, game, ui, get, ai, _status);
                extensionData.package.character = {};
                extensionData.package.skill = {};
                extensionData.package.card = {};
                if (data.enable) {
                    game.import("character", function () {
                        for (var i in heros.character) {
                            heros.character[i][4].push('ext:ZJ联盟杀/' + i + '.jpg');
                        }
                        if (skills.skill) {
                            for (var key in skills.skill) {
                                var element = skills.skill[key];
                                heros.skill[key] = element;
                                if (element.global && element.forceaudio === undefined) {
                                    element.forceaudio = true;
                                }
                                if (!element.audio) {
                                    element.audio = "ext:ZJ联盟杀:true";
                                }
                                else if (typeof element.audio == 'number') {
                                    element.audio = "ext:ZJ联盟杀:" + element.audio;
                                }
                            }
                        }
                        if (skills.translate) {
                            for (var key in skills.translate) {
                                var element = skills.translate[key];
                                heros.translate[key] = element;
                            }
                        }
                        var packName = heros.name;
                        heros.characterSort[packName] = {};
                        var needSplite = ["ZJSha_XSZJ"];
                        for (var key in heros.character) {
                            var bianhao = key.split("-")[0];
                            var id = Math.ceil(key.split("-")[1] / 10);
                            var sortpack = packName + "_" + bianhao;
                            if (!needSplite.contains(bianhao)) {
                                id = "";
                            }
                            if (!heros.characterSort[packName]["" + sortpack + id]) {
                                heros.characterSort[packName]["" + sortpack + id] = [];
                            }
                            heros.characterSort[packName]["" + sortpack + id].push(key);
                        }
                        heros.translate[packName + "_ZJSha_XSSP"] = "联盟杀-sp包";
                        heros.translate[packName + "_ZJSha_XSZJ1"] = "联盟杀-ZJ联盟包1";
                        heros.translate[packName + "_ZJSha_XSZJ2"] = "联盟杀-ZJ联盟包2";
                        return heros;
                    });
                    if (Array.isArray(lib.config.all.characters)) {
                        lib.config.all.characters = [];
                    }
                    if (Array.isArray(lib.config.all.cards)) {
                        lib.config.all.cards = ['standard', 'extra', 'guozhan', 'sp'];
                    }
                    if (Array.isArray(lib.config.all.mode)) {
                        lib.config.all.mode = ['connect', 'identity', 'guozhan', 'versus', 'single'];
                    }
                    lib.config.all.characters.push('ZJ联盟杀hero');
                    lib.config.characters.push('ZJ联盟杀hero');
                    lib.translate['ZJ联盟杀hero_character_config'] = 'ZJ联盟杀';
                    lib.mode.identity.config.choose_group.init = false;
                    game.saveConfig('choose_group', false, true);
                    if (data.start_wuxing) {
                        updateWuxingName(true);
                    }
                    if (data.start_ZjshaCardName) {
                        updataZjshaCardName(true);
                    }
                    var flag = get.config('start_wuxingSkill');
                    if (flag === undefined) {
                        game.saveConfig('start_wuxingSkill', data.start_wuxingSkill);
                    }
                }
            },
            content: function (config, pack) {
            },
            onremove: function () {
            },
            package: {
                author: "神雷zero",
                intro: "ZJ联盟杀",
                version: "1.0.0",
                character: heros,
                skill: skills,
                card: cards,
            },
            translate: {
                ZJSha: "ZJ联盟杀",
            },
            help: {
                ZJ联盟杀: NG.Utils.createHelp([
                    "先测试下1",
                    "先测试下2",
                    ["先测试下2.1", "先测试下2.2"],
                    "先测试下3",
                    "先测试下4",
                    ["先测试下4.1", "先测试下4.2"]
                ])
            },
        };
        function updateWuxingName(bool) {
            if (bool) {
                lib.translate.wei = "水";
                lib.translate.shu = "火";
                lib.translate.wu = "木";
                lib.translate.qun = "土";
                lib.translate.shen = "金";
            }
            else {
                lib.translate.wei = "魏";
                lib.translate.shu = "蜀";
                lib.translate.wu = "吴";
                lib.translate.qun = "群";
                lib.translate.shen = "神";
            }
        }
        function updateWuxingSkill(bool) {
        }
        function updataZjshaCardName(bool) {
            if (bool) {
                lib.translate.tao = "血";
                lib.translate.jiu = "魔";
                lib.translate.wugu = "神赐光术";
                lib.translate.juedou = "大对決术";
                lib.translate.guohe = "大破坏术";
                lib.translate.huogong = "大灾炎术";
                lib.translate.nanman = "地狱侵术";
                lib.translate.wuxie = "干扰魔术";
                lib.translate.tiesuo = "连环锁术";
                lib.translate.wanjian = "流星坠术";
                lib.translate.taoyuan = "圣治愈术";
                lib.translate.wuzhong = "天降金术";
                lib.translate.shunshou = "偷窃邪术";
                lib.translate.jiedao = "御剑杀术";
                lib.translate.lebu = "圣水牢术";
                lib.translate.shandian = "闪电雷术";
                lib.translate.bingliang = "封魔雷术";
            }
            else {
                lib.translate.tao = "桃";
                lib.translate.jiu = "酒";
                lib.translate.wugu = "五谷丰登";
                lib.translate.juedou = "决斗";
                lib.translate.guohe = "过河拆桥";
                lib.translate.huogong = "火攻";
                lib.translate.nanman = "南蛮入侵";
                lib.translate.wuxie = "无懈可击";
                lib.translate.tiesuo = "铁索连环";
                lib.translate.wanjian = "万箭齐发";
                lib.translate.taoyuan = "桃园结义";
                lib.translate.wuzhong = "无中生有";
                lib.translate.shunshou = "顺手牵羊";
                lib.translate.jiedao = "借刀杀人";
                lib.translate.lebu = "乐不思蜀";
                lib.translate.shandian = "闪电";
                lib.translate.bingliang = "兵粮寸断";
            }
        }
        return extensionData;
    }
    ZJNGEx.extensionFun = extensionFun;
})(ZJNGEx || (ZJNGEx = {}));
game.import(ZJNGEx.type, ZJNGEx.extensionFun);
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "动态添加删除十周UI扩展", 0, function (lib, game, ui, get, ai, _status) {
            if (lib.device || typeof window.require == 'function') {
                if (!lib.extensionMenu["extension_十周年UI"]) {
                    lib.init.js(lib.assetURL + "extension/" + "十周年UI", "extension", function () {
                    }, function () {
                        console.log("加载'十周年UI'失败！");
                    });
                }
            }
            else {
                if (lib.extensionMenu["extension_十周年UI"]) {
                    delete lib.extensionMenu["extension_十周年UI"];
                    alert("删除'十周年UI'重启！");
                    game.reload();
                }
            }
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "乱世天下的方法", 0, function (lib, game, ui, get, ai, _status) {
            game.playGz = function (fn, dir, sex) {
                if (lib.config.background_speak) {
                    if (dir && sex)
                        game.playAudio(dir, sex, fn);
                    else if (dir)
                        game.playAudio(dir, fn);
                    else
                        game.playAudio('..', 'extension', '乱世天下', fn);
                }
            };
            lib.skill._zhenwangpeiyin_gz = {
                trigger: {
                    player: 'dieBegin',
                },
                priority: 2,
                forced: true,
                unique: true,
                frequent: true,
                charlotte: true,
                content: function () {
                    game.playAudio('..', 'extension', '乱世天下', player.name);
                },
            };
            if (config.Gz_jishatexiao) {
                lib.skill._jishatexiao_gz = {
                    marktext: "杀",
                    intro: {
                        content: function (storage) {
                            var num = layer.storage.jisharenshu_gz;
                            return '你已击杀' + num + '名角色';
                        },
                    },
                    trigger: {
                        global: "dieBegin",
                    },
                    direct: true,
                    forced: true,
                    charlotte: true,
                    unique: true,
                    firstDo: true,
                    filter: function (event, player) {
                        return event.source == player;
                    },
                    content: function () {
                        'step 0';
                        if (!player.storage.jisharenshu_gz)
                            player.storage.jisharenshu_gz = 0;
                        player.storage.jisharenshu_gz++;
                        'step 1';
                        if (player.storage.jisharenshu_gz == 1) {
                            player.$fullscreenpop('一血·卧龙出山', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha1');
                        }
                        if (player.storage.jisharenshu_gz == 2) {
                            player.$fullscreenpop('双杀·一战成名', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha2');
                        }
                        if (player.storage.jisharenshu_gz == 3) {
                            player.$fullscreenpop('三杀·举世皆惊', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha3');
                        }
                        if (player.storage.jisharenshu_gz == 4) {
                            player.$fullscreenpop('四杀·天下无敌', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha4');
                        }
                        if (player.storage.jisharenshu_gz == 5) {
                            player.$fullscreenpop('五杀·诛天灭地', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha5');
                        }
                        if (player.storage.jisharenshu_gz == 6) {
                            player.$fullscreenpop('六杀·癫狂杀戮', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha6');
                        }
                        if (player.storage.jisharenshu_gz >= 7) {
                            player.$fullscreenpop('无双·万军取首', 'fire');
                            game.playAudio('..', 'extension', '乱世天下', 'luan_jisha7');
                        }
                    },
                };
            }
            game.washCardGz = function () {
                var cards = get.cards(ui.cardPile.childElementCount + 1);
                for (var i = 0; i < cards.length; i++) {
                    ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
                }
                game.updateRoundNumber();
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "简易联机框架方法", 0, function (lib, game, ui, get, ai, _status) {
            game.导入character = function (英文名, 翻译名, obj, 扩展包名) {
                var oobj = get.copy(obj);
                oobj.name = 英文名;
                oobj.character = obj.character.character;
                oobj.skill = obj.skill.skill;
                oobj.translate = Object.assign({}, obj.character.translate, obj.skill.translate);
                game.import('character', function () {
                    for (var i in oobj.character) {
                        oobj.character[i][4].push('ext:' + 扩展包名 + '/' + i + '.jpg');
                    }
                    return oobj;
                });
                lib.config.all.characters.push(英文名);
                if (!lib.config.characters.contains(英文名)) {
                    lib.config.characters.push(英文名);
                }
                lib.translate[英文名 + '_character_config'] = 翻译名;
            };
            game.导入card = function (英文名, 翻译名, obj) {
                var oobj = get.copy(obj);
                oobj.list = obj.card.list;
                oobj.card = obj.card.card;
                oobj.skill = obj.skill.skill;
                oobj.translate = Object.assign({}, obj.card.translate, obj.skill.translate);
                game.import('card', function () {
                    return oobj;
                });
                lib.config.all.cards.push(英文名);
                if (!lib.config.cards.contains(英文名))
                    lib.config.cards.push(英文名);
                lib.translate[英文名 + '_card_config'] = 翻译名;
            };
            game.新增势力 = function (名字, 映射, 渐变) {
                var n, t;
                if (!名字)
                    return;
                if (typeof 名字 == "string") {
                    n = 名字;
                    t = 名字;
                }
                else if (Array.isArray(名字) && 名字.length == 2 && typeof 名字[0] == "string") {
                    n = 名字[0];
                    t = 名字[1];
                }
                else
                    return;
                if (!映射 || !Array.isArray(映射) || 映射.length != 3)
                    映射 = [199, 21, 133];
                var y = "(" + 映射[0] + "," + 映射[1] + "," + 映射[2];
                var y1 = y + ",1)", y2 = y + ")";
                var s = document.createElement('style');
                var l;
                l = ".player .identity[data-color='diy" + n + "'],";
                l += "div[data-nature='diy" + n + "'],";
                l += "span[data-nature='diy" + n + "'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 10px,rgba" + y1 + " 0 0 10px}";
                l += "div[data-nature='diy" + n + "m'],";
                l += "span[data-nature='diy" + n + "m'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,black 0 0 1px;}";
                l += "div[data-nature='diy" + n + "mm'],";
                l += "span[data-nature='diy" + n + "mm'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,black 0 0 1px;}";
                s.innerHTML = l;
                document.head.appendChild(s);
                if (渐变 && Array.isArray(渐变) && Array.isArray(渐变[0]) && 渐变[0].length == 3) {
                    var str = "", st2 = [];
                    for (var i = 0; i < 渐变.length; i++) {
                        str += ",rgb(" + 渐变[i][0] + "," + 渐变[i][1] + "," + 渐变[i][2] + ")";
                        if (i < 2)
                            st2[i] = "rgb(" + 渐变[i][0] + "," + 渐变[i][1] + "," + 渐变[i][2] + ")";
                    }
                    var tenUi = document.createElement('style');
                    tenUi.innerHTML = ".player>.camp-zone[data-camp='" + n + "']>.camp-back {background: linear-gradient(to bottom" + str + ");}";
                    tenUi.innerHTML += ".player>.camp-zone[data-camp='" + n + "']>.camp-name {text-shadow: 0 0 5px " + st2[0] + ", 0 0 10px " + st2[1] + ";}";
                    document.head.appendChild(tenUi);
                }
                lib.group.add(n);
                lib.translate[n] = t;
                lib.groupnature[n] = "diy" + n;
            };
            game.loadForbidai = function (英文名) {
                if (config[英文名]) {
                    for (var i in lib.characterPack[英文名]) {
                        if (lib.character[i][4].indexOf("forbidai") < 0)
                            lib.character[i][4].push("forbidai");
                    }
                }
            };
            return null;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
var ZJNGEx;
(function (ZJNGEx) {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组14", 0, function (lib, game, ui, get, ai, _status) {
            var skill1 = {
                mod: {
                    globalFrom: function () {
                        return -Infinity;
                    }
                },
            };
            var skill2 = {
                maxHandcard: function (player, num) {
                    return num + get.getZJShaShiliCount(get.getZJShaShili(player));
                },
            };
            var skill3 = {};
            var output = {};
            return output;
        });
    })();
})(ZJNGEx || (ZJNGEx = {}));
//# sourceMappingURL=extension.js.map