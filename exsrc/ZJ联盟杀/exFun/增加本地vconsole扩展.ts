// @ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "增加本地vconsole扩展", NG.ImportFumType.none,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //h5 显示 console面板，还没测试在电脑和手机，后续，改成启动游戏后动态加载进去，目前因为和layout.css div样式有冲突，
                //故手动改了下源码样式，目前必须使用我这版才能正常显示，目前只考虑用于测试，不整合进游戏流程里

                //原本放在index.html上，现在改为动态加载js文件后创建：
                //如有特殊需求，将直接在index.html启动调试；

                lib.init.js("extension/lib","vconsole",function(){
                    //测试时再使用了，有点卡这个，所有得日志输出，都会转换成有vconsole.js自己得日志输出：
                    // 初始化
                    var vConsole = new VConsole();
                    console.log('Hello world 欢迎启动vConsole');
                });


                return null;
            });
    })();
}