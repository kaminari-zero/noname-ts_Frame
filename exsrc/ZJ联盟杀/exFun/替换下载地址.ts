module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "替换下载地址", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //修改该游戏下载地址相关部分，有过于庞大复杂的就放弃
                lib.configMenu.general.config.update_link = {
                    name: '更新地址',
                    init: 'coding',
                    unfrequent: true,
                    item: {
                        coding: 'GitLab',
                        github: 'GitHub',
                        codingR: 'Coding' //真实的coding地址
                    },
                    onclick: function (item:string) {
                        game.saveConfig('update_link', item);
                        //即一开始没有，则默认coding源（后面也是这么操作的）
                        lib.updateURL = lib.updateURLS[item] || lib.updateURLS.coding;
                    },
                };

                //更新地址:
                lib.updateURLS = {
                    //请自行替换地址
                    //鹏飞大佬的gitlab地址
                    coding: 'https://gitee.com/null_778/noname_source/raw',
                    github: 'https://raw.githubusercontent.com/libccy/noname',
                    //真实coding地址
                    codingR: 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw'
                };
                //默认镜像
                lib.updateURL = 'https://gitee.com/null_778/noname_source/raw';
                //备用镜像
                lib.mirrorURL = 'https://nakamurayuri.coding.net/p/noname/d/noname/git/raw';
                lib.hallURL = '192.168.1.192';


                //.........好像不太行，其中这部分是当前项目最大的方法块：ui.click.menu，不太想动
                // 第二部分：修改更新地址显示，使显示更直白（这部分手动替换，不过只是显示而已，不影响功能）
                // if(str==lib.updateURLS.github){
                //     return 'GitHub';
                // }
                // if(str==lib.updateURLS.coding){
                //     return 'GitLab';
                // }
                // if(str==lib.updateURLS.codingR){
                //     return 'Coding';
                // }
                // ....
                // li3.innerHTML='更新地址：<span>'.......

                return null;
            });
    })();
}