// @ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "添加ZJ联盟杀用的身份局模式", NG.ImportFumType.none,

            //目的：重新根据原版身份局，独立增加一个身份局：
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //使用game.addMode，来在precontent，动态导入：
                //目前只能暴力复制一份过来改：
                //...........不希望这样子，但不知道怎么搞：
                let realFun = game.import;
                // eval('target.' + name + ' = ' + funcStr);

                let tempMode:ExModeConfigData;//定义一个接受到mode的
                let tempLoadFlag = 0;
                let tempFun = function (type, content) {
                    //严格化改造：
                    tempMode = content(lib, game, ui, get, ai, _status);//直接把内容返回来
                    if (type == "mode" && tempMode && tempMode.name == "identity" && !tempLoadFlag) { //只针对身份局进行1次操作，尽量减少影响
                        tempLoadFlag++;//直接用标记，防止后续影响
                        return;
                    } else {
                        realFun(type, content);
                    }
                };


                let newModeName = "ZJSha_identity";
                let modeTranslate = 'ZJ杀身份';
                let extName = "ZJ联盟杀";
                game.import = tempFun;
                lib.init.js(lib.assetURL + 'mode', "identity", () => {
                    
                    if (tempMode) {
                        //修改mode本身的配置：
                        tempMode.name = newModeName;
                        // tempMode.card
                        let test = lib.group;
                        let selfGroup = [NG.Group.FIRE,NG.Group.GOLD,NG.Group.NONE,NG.Group.SOIL,NG.Group.WATER,NG.Group.WOOD];
                        for (let i = 0; i < selfGroup.length; i++) {
                            const element = selfGroup[i];
                            tempMode.card[`group_${element}`] = {fullskin: true};
                        }

                        //lib.filter.characterDisabled  这个是核心过滤武将的方法
                        //排除武将方法采用zjsha版本
                        lib.filter.characterDisabled = lib.filter.characterDisabledByZJSha;
                        lib.filter.characterDisabled2 = lib.filter.characterDisabledByZJSha2;

                        //玩法特殊，需要去掉加血这个选项：


                        //自己定义的扩展的：
                        //也可以考虑复制身份局选项配置改：（都在game.js源码中）
                        // let sourceConfig = get.copy(lib.mode.identity.config);//这样的话，没保存到联机配置：
                        let sourceConfig = get.copy(lib.mode.identity);//下面为了能加载到联机部分进行修改；
                        let newConfig:SMap<SelectConfigData> = sourceConfig;
                        let configInfo:ExtensionInfoConfigData = {
                            translate: modeTranslate,
                            config: newConfig,
                            // onremove:function(){ //还是不删除
                            //     game.clearModeConfig('ZJSha_identity');
                            // }
                            extension:extName,
                        };

                        //有的话，先移除，避免两个：（因为在扩展中已经提前添加表示会有该玩法，正式再加载可能会多添加一个，避免可能出现错误，先删除）
                        if((<any[]>lib.config.all.mode).contains('ZJSha_identity')){ 
                            (<any[]>lib.config.all.mode).remove('ZJSha_identity');
                        }

                        //ui.create.characterDialog
                        //ib.config.all.characters

                        //添加一个方法在执行该玩法的start时执行，目的是只在执行该玩法才对方法进行修改：
                        //特别是对game.js所有原生对mode为'identity'判断的方法修改：
                        //目前有一种方案：是否可以修改get.mode方法，将ZJSha_identity视为identity输出；
                        //随着观察代码，如果要完美兼容"identity"，似乎难度有点大，这里还有game.switchMode，影响联机创建房间；
                        //读取，lib.init.js(lib.assetURL+'mode'... ... 和我这种魔改流程不沾边；
                        //因为，"identity"模式部分代码是镶嵌在game.js源码里，导致该流程难以分离，也不好修改；
                        

                        //为了能添加联机用的配置，动态在这里修改一下game.addMode方法：
                        let realAllModeFun = game.addMode;
                        lib.app.reWriteFunctionX(game,{
                            addMode:[
                                'config:info2.config,',
                                `
                                config:info2.config.config,
                                connect:info2.config.connect,
                                `
                            ]
                        });
                        game.addMode(newModeName,tempMode,configInfo);
                        //执行完后，立刻还原：(测试成功，后续可以进行身份局的改造了)
                        game.addMode = realAllModeFun;

                    }
                    
                    game.import = realFun;
                    //    console.log("解析完成了.......");
                });
                
                //............  因为延迟加载了，导致很多流程都出问题，基本这种做法，在这个框架有点难实现；
                //尝试下，双重加载：【测试成功，利用前置加载，先让玩法模式选项加载出来，后续js读取加载成功，覆盖全新的mode配置】
                //未来可能出现的问题：加载延迟，点击过快，在刚出选项，立刻点击加载该玩法模式，有可能报错，目前未出现这种情况，也不清楚后续是否会出现？
                game.addMode(newModeName,{
                    name = newModeName,
                },{
                    translate: modeTranslate,
                    config:{},
                    extension:extName,
                });


                // console.log(tempMode);
                // lock = false; //解析js成功，获取到所需要的数据，解锁，还原game.import；

                 //实现js代码由异步变成同步机制：https://blog.csdn.net/weixin_30478757/article/details/95279673
                //基于js的EventLoop,自旋锁:
                /*
                var lock = true
                setTimeout(function () {
                    lock = false
                    console.log('unlock')
                }, 5000)
                function sleep() {
                    var i = 5000
                    while (i--);
                }
                var foo = () => setTimeout(function () {
                    sleep()
                    lock && foo()
                })
                foo()
                */
                //    console.log("开始测试.......");
                // var lock = true;//添加锁

                //测试：
                // setTimeout(
                //     function(){
                //         lock = false;
                //         console.log("解析完成了.......");
                //     },5000
                // );
                //由于lib.init.js是监听事件回调的，如果处理多个方法时，很有可能出问题......
                //解决方案：自旋锁；
                //用于线程休眠：
                // function sleep() {
                //     var i = 10000;
                //     while (i--);
                //     lock && sleep()
                // }
                // var foo = () => setTimeout(function () {
                //     sleep()
                //     lock && foo()
                // });
                // console.log("测试是否成功.......");
                //............实验失败..........做不了真正的自旋锁
                //方法二：方法就是修改整体加载机制，修改太大了；
                //方法三：全局标记？但是，如果加载过慢，还是会影响后续加载；
                //方法四：独立一个新的解析方式：mode，mode在解析时，返回一个方法，自身传入方法回调下一个继续执行？？？？
                //方法五：简单暴力，全部放在一个文件里，但是还是面临一个问题多个加载回调速度必然会慢，联机时很有可能有问题，这样的话game.import会异常；
                //方法六：.......但是想着，当前是加载完其他文件再加载这个，好像勉强还可以接受，就怕，快速进入玩法界面，一点玩法就炸了；
                //可能，也就这个身份局比较特殊，需要复制之前的版本，后续的模式，应该都是独立实现的；
                //不过，可能也就这个特殊点，放在最后加载好了，其余，后面都是独立模式编写；


                return null;
            });
    })();
}