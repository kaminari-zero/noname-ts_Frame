//@ts-nocheck
module ZJNGEx {

    //暂时先屏蔽，后续找到完美的方案可以考虑下，或者自己能实现
    //假想环境：微信，禁用了eval，new Function;

    (function(){
        NG.Utils.importCurContent(this.ZJNGEx,"扩展一个js解析器测试",NG.ImportFumType.none,
        
        // 貌似测试通过，可以考虑
        // 如果好用的话，未来可以移植使用，不过不像eval一样，可以返回结果；
        function(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
            //统合环境：
            (function (Object) {
                typeof globalThis2 !== 'object' && (this ?
                    get() :
                    (Object.defineProperty(Object.prototype, '_T_', {
                        configurable: true,
                        get: get
                    }), _T_));
                function get() {
                    this.globalThis2 = this;
                    delete Object.prototype._T_;
                }
            }(Object));
            
            //第一种方式：
            //目前globalThis本身就在环境存在，所以换个名字测试下：
            console.log("浏览器环境：",globalThis2 == window);
            // console.log("node环境：",globalThis == globalThis);
            
            //extension\lib
            // lib.init.js("extension/lib","acorn",function(){
            //     lib.init.js("extension/lib","HsunaJS",function(){

            //         //测试代码：
            //         let code = `
            //         (function (global, factory) {
            //             typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //             typeof define === 'function' && define.amd ? define(factory) :
            //             (global = global || self, global.SDK = factory());
            //         }(this, (function () { 'use strict';
            //             return function(a, b, c) {
            //                 return a + b + c;
            //             }
            //         })));
            //         `
                    
            //         let ast = acorn.parse(code)
            //         console.log(ast)
            //         HsunaJS.parse(ast, { this: globalThis2, define: { amd: undefined }, self: undefined })

            //         const SDK = globalThis2.SDK
            //         console.log("输出测试结果：",SDK(1, 2, 3))

            //         //测试代码2：
            //         let code2 = `
            //         function test() {
            //             var arg1 = Array.from(arguments);
            //             arg1.unshift("测试输出：");
            //             console.log.apply(console, arg1);
            //         }
            //         this.test = test;
            //         `;
            //         let code3 = `var xxx = 1;`; //这样没有结果
            //         let code4 = `this.xxx = 1;`; //这样就可以导入到环境
            //         let ast2 = acorn.parse(code2);
            //         let testfun = HsunaJS.parse(ast2, { this: globalThis2, define: { amd: undefined }, self: undefined })
            //         console.log("测试2：",testfun,globalThis2.test);

            //         let testfun2 = globalThis2.test;
            //         testfun2("测试输出1","测试输出2","测试输出3");//通过

            //         //测试代码3：
            //         // let code22 = `
            //         // class Person {
            //         //     //this._name = 2;
            //         //     //this._sex = "男";

            //         //     constructor(name,sex) {
            //         //         this._name = 2;
            //         //         this._sex = "男";
            //         //     }

            //         //     print() {
            //         //         console.log("年龄：",this._name,";性别：",this._sex);
            //         //     }
            //         // }

            //         // this.Person = Person;
            //         // `;
            //         // let ast3 = acorn.parse(code22);
            //         // HsunaJS.parse(ast3, { this: globalThis2, define: { amd: undefined }, self: undefined })
            //         // console.log("测试es6 class：",globalThis2.Person);
            //         // 没有实现class的翻译
            //     },function(){
            //         console.log("加载 HsunaJS 失败！");
            //     });


            // },function(){
            //     console.log("加载 acorn 失败！");
            // });

            //第二种方式：
            //测试另一个  替代 eval 的库：
            lib.init.js("extension/lib","Binding",function(){

                //测试代码：
                // 1. simple expr
                console.log(binding.eval("(1 + 2) * 4 / 2")); //console 6

                // 2. expr with var
                var v0 = 3;
                console.log(binding.eval("$0 * 4",[v0])); //console 12

                // 3. expr with var and function
                var v0 = 3;
                var v1 = 6;
                console.log(binding.eval("Math.sqrt($0 * 3 * $1 * 6)",[v0,v1])); //console 18

                // 4. expr with var and self-define function
                var v0 = 9;
                var addFunction = function(a,b) {
                    return a + b;
                }
                console.log(binding.eval("add(Math.sqrt($0), 2)",[v0],{add:addFunction})); //console 5

                // 5. 3 op expr
                console.log(binding.eval("3 > 2 ? true : false")); //console true

                //测试es6 的 class：
                let code = `
                (function (global, factory) {
                    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
                    typeof define === 'function' && define.amd ? define(factory) :
                    (global = global || self, global.SDK = factory());
                }(this, (function () { 'use strict';
                    return function(a, b, c) {
                        return a + b + c;
                    }
                })));
                `;
                let code22 = `
                class Person {
                    //this._name = 2;
                    //this._sex = "男";

                    constructor(name,sex) {
                        this._name = 2;
                        this._sex = "男";
                    }

                    print() {
                        console.log("年龄：",this._name,";性别：",this._sex);
                    }
                }
                `;
                let code3 = "lib.testFun = 1";
                let result = binding.eval(code3);
                console.log(result,typeof result);
                // 都不行，结论：貌似只能处理计算表达式：不能原生执行eval的操作，对象的引用，要外部置入

            },function(){
                console.log("加载 Binding 失败！");
            });


            //第三种方式：（不行，不能使用new Function）
            //计算表达式的值
            function evil(fn) {
                var Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
                return new Fn('return ' + fn)();
            }
            console.log("第三种方式：",evil("(1 + 2) * 4 / 2"));
            console.log("第三种方式：",evil("this.testFun = 3"));


            //第四种方式：目前最靠谱的方式：可以直接在JavaScript的运行环境中运行TypeScript代码
            //缺陷：无法无缝衔接当前项目的eval，new Function，需要替代的话，需要重构大量代码，所以，目前只是测试是否可行而已；
            /*
            以下为未实现（即将实现16、7、15、9、1、13）：
            1. lambda表达式方式的匿名函数，比如()=>{console.log(this)}
            2. await/async、yield
            3. 类型转换，比如```<Array>obj```，建议用as代替
            4. 泛型，比如```class A<T>{}```
            5. 正则（推荐用new RegExp）
            6. 在构造函数中super之前的定义，比如var a=2;super();
            7. 枚举、枚举自定义值
            8. 接口
            9. for of
            10. 装饰器-@
            11. 当父模块有多级时，获取父模块在runTIme.getContextValue中可能有问题，解决办法，尽量不用模块或者同模块内的调用写全，比如new test.Start()，而不是new Start()
            12. 变量前最多只支持两个非操作，即：var a = !!"123";（一般这种写法是强制转换到布尔类型，三个及以上的非基本是不需要的）
            13. 运行时的报错信息不正确
            14. 编译成字节码
            15. 用``（键盘1左边的那个）表示的字符串
            16. import {A} from './B.ts'
            */
            lib.init.js("extension/lib","qyscript",function(){
                //示例1：
                //如果把所有代码整合到一个文件中的话，则这个更加方便一点，如果代码文件碎片化，则用下面一种方式好一点
                qs.run(`
                    class Start{
                        public constructor() {
                            console.log('你好，世界！');
                        }
                    }
                `, 'Start', window);
                //另一种方式：
                var runTime = new qs.Runtime(window);//创建一个运行时对象
                runTime.regedit(`class Test{public constructor(){console.log('你好，世界test！')}}`);//注册Test类
                runTime.regedit(`class Start{public constructor(){new Test()}}`);//注册Start类
                new runTime.g.Start();//实例化Start类，部分情况下，直接new Start();也可以

                //示例2：
                let runTime2: qs.Runtime = new qs.Runtime(window);
                let code = `
                    class Test2 {
                        public constructor() {
                            window.testValue = 22222;
                            this.testFunction();

                        }
                        testFunction() {
                            window.testValue = 111111;
                        }
                    }
                `;
                runTime2.regedit(code);//注册代码

                function runScript(){
                    //以下是只更新某个方法的例子
                    // new this.runTime.g.UpdateFunction();//执行热更新中的UpdateFunction脚本的构造，构造里面会重新对本地代码中的方法进行替换
                    // this.addChild(new Game());//利用本地代码创建游戏场景
                    new runTime2.g.Test2();

                    //以下是只更新某个类的例子
                    //利用本地代码创建游戏场景，在创建之前，this.runTime.regedit这个操作之后，Game类会被热更新中的Game类替换

                    //以下是全部代码都启用热更新的例子
                    // new this.runTime.g.test.Start();//实例化test.Start这个脚本类，这个脚本类可以直接从全局中获取到

                    console.log("输出测试示例：",window["testValue"]);

                    //以下是更为性能测试的例子
                    qs.run(`
                        class Start2{
                            public constructor() {
                                var time = Date.now();
                                var count = 0;
                                var a = 3;
                                var b = 3434;
                                var c = 232323;
                                for (var i = 0; i < 100000; i++) {
                                    count = a * 4 + c * 444 + b / 3 + i;
                                }
                                console.log("qyscript耗时：" + (Date.now() - time) + "ms");
                            }
                        }
                    `, 'Start2', window);
                    var time = Date.now();
                    var count = 0;
                    var a = 3;
                    var b = 3434;
                    var c = 232323;
                    for (var i = 0; i < 100000; i++) {
                        count = a * 4 + c * 444 + b / 3 + i;
                    }
                    console.log("原生耗时：" + (Date.now() - time) + "ms");
                }

                runScript();

            });

            return null;
        });
    })();
}