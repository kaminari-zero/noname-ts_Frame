// @ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "添加ZJ联盟杀用的身份局模式2", NG.ImportFumType.none,

            //目的：重新根据原版身份局，不独立增加新玩法，而是增加选项，可以通过切换开关，将当前身份局，变为“zjsha身份局”：
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //使用game.addMode，来在precontent，动态导入：
                let newModeName = "ZJSha_identity";
                let modeTranslate = 'ZJ杀身份';
                let extName = "ZJ联盟杀";

                let realFun = game.import;

                let tempFun = function (type, content) {
                    //严格化改造：
                    //模式玩法，是在点击时候加载，或有默认玩法时加载；
                    let tempMode:ExModeConfigData = content(lib, game, ui, get, ai, _status);//直接把内容返回来
                    // let flag = game.getExtensionConfig('start_ZjshaIdentityMode',NG.StringTypeConst.ZJShaConst);
                    let flag = lib.config[`extension_${NG.StringTypeConst.ZJShaConst}_start_ZjshaIdentityMode`]; //game.getExtensionConfig方法保存的配置格式不一致，项目内没使用
                    if (type == "mode" && tempMode && tempMode.name == "identity" && flag) { //只针对身份局进行操作 增加设置缓存：设置是否要进入该模式
                        //这里针对我要修改的身份局模式设定：
                        if (tempMode) {
                            //修改mode本身的配置：
                            // tempMode.name = newModeName; //不修改name，统一视为“identity”
                            let selfGroup = [NG.Group.FIRE,NG.Group.GOLD,NG.Group.SOIL,NG.Group.WATER,NG.Group.WOOD,NG.Group.NONE];
                            let natures = [];
                            let groupStr = "";
                            let naturesStr = "";
                            let length = selfGroup.length;
                            for (let i = 0; i < length; i++) {
                                const element = selfGroup[i];
                                tempMode.card[`group_${element}`] = {fullskin: true};
                                natures.push(lib.groupnature[element]);
                                groupStr += `\'${element}\'`;
                                naturesStr += `\'${lib.groupnature[element]}\'`;
                                if(i != length-1) {
                                    groupStr += ",";
                                    naturesStr += ",";
                                }
                            }
                            
                            //lib.filter.characterDisabled  这个是核心过滤武将的方法
                            //排除武将方法采用zjsha版本
                            lib.filter.characterDisabled = lib.filter.characterDisabledByZJSha;
                            lib.filter.characterDisabled2 = lib.filter.characterDisabledByZJSha2;
                            
                            //玩法特殊，需要去掉加血这个选项：
                            lib.app.reWriteFunctionX(ui.create,{
                                characterDialog:[
                                    [
                                        "var groups=['wei','shu','wu','qun'];", //可选的类型
                                        `
                                        var groups=[${groupStr}];
                                        `
                                    ],
                                    [
                                        "var natures=['water','soil','wood','metal'];", //对应的颜色
                                        `
                                        var natures=[${naturesStr}];
                                        `
                                    ],
                                    [
                                        "if(!lib.config.all.characters.contains(i)){", //排除掉能选中其他包，就是用尽全力，排除一切非指定包：
                                        `
                                        break;
                                        `,
                                        NG.ReWriteFunctionType.insert
                                    ]
                                ]
                            });

                            lib.app.reWriteFunctionX(tempMode.game,{
                                chooseCharacter:[
                                    "if(game.players.length>4){",
                                    `if(false&&game.players.length>4){`
                                ],
                                chooseCharacterOL:[
                                    "if(game.players.length>4){",
                                    `if(false&&game.players.length>4){`
                                ],
                            });

                            //ui.create.characterDialog
                            //ib.config.all.characters
                            // function resetZJShaFunByIdentity() {
                            // }
                            //将game.import部分方法移植到这里
                            if(!lib.imported[type]){
                                lib.imported[type]={};
                            }
                            var content2=tempMode;
                            if(content2.name){
                                lib.imported[type][content2.name]=content2;
                                delete content2.name;
                            }
                        }
                        // game.import = realFun; //建议不还原，例如调用game.switchMode之类的又回去读该文件
                    } else {
                        realFun(type, content);
                    }
                };
                game.import = tempFun;

                return null;
            });
    })();
}