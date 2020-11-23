/// <reference path="../Utils/Utils.ts" />
/// <reference path="../Utils/GameUtil.ts" />
/// <reference path="./skillRef.ts" />
/// <reference path="./characterRef.ts" />
/// <reference path="./cardRef.ts" />
/// <reference path="./ExFunRef.ts" />
// / <reference path="./outputTranslate.ts" />


/**
 * ZJ联盟杀
 */
// @ts-nocheck 不需要严格得语法检查错误
module ZJNGEx {
    export let type = NG.ImportType.Extension;
    export function extensionFun(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status): ExtensionInfoConfigData {
        //每次都预备初始化一下环境
        NG.initContent(lib, _status, game, ui, get, ai);

        //武将
        //zjm01
        let heros: CharacterConfigData = {
            name: "ZJ联盟杀hero",
            connect: true,
            characterSort:{
            },
            character: {
            },
            characterTitle: {
            },
            characterIntro: {
            },
            skill: {
            },
            translate: {

            }
        };

        //技能
        let skills: ExSkillConifgData = {
            // name: "ZJShaSkill",
            skill: {

            },
            translate: {

            }
        };
        //卡牌
        let cards: CardHolderConfigData = {
            // name: "ZJShaCard",
            connect: true,
            card: {

            },
            skill: {

            },
            list: [],
            translate: {

            }
        };

        //extension扩展数据
        let extensionData: ExtensionInfoConfigData = {
            name: "ZJ联盟杀",
            key: "ZJSha",
            editable: true,
            //选项
            config: {
                /*
                //独立扩展属性，屏蔽该选项：
                start_wuxing: {
                    name: "启用五行属性",
                    init: true,
                    connect:true,
                    intro: "将”魏蜀吴群神“变为”水火木土金“",
                    frequent: true,
                    // onclick:(item)=>{
                    //     console.log("点击后输出的结果为：",item);
                    // }
                    onclick: (item)=> {
                        updateWuxingName(item);
                        game.saveConfig("start_wuxing",item);
                    }
                },*/
                start_wuxingSkill: {
                    name: "启用五行属性主公技",
                    init: true,
                    connect:true,
                    intro: "在身份局中，不同属性的身份会拥有不同的主公技",
                    frequent: true,
                    onclick: (item) => {
                        // console.log("点击后输出的结果为111：", item);
                        updateWuxingSkill(item);
                        game.saveConfig('start_wuxingSkill',item);
                    }
                },
                //实质上现在是强制使用这个的，因为十周年里的卡牌，势力标记UI是通过强制替换的（目前先简单点实现）；
                //待解决方案：1.后续再研究怎么外部修改读取图片的路径的方式；2.重新做一套卡牌，在使用zj联盟杀武将时，使用该套卡牌（且对应卡牌，会视为原卡牌）；
                start_ZjshaCardName: {
                    name: "启用联盟杀卡牌",
                    init: true,
                    connect:true,
                    intro: "三国杀标准，军争包的卡牌名字替换成联盟杀用卡名",
                    frequent: true,
                    onclick: (item) => {
                        updataZjshaCardName(item);
                        game.saveConfig('start_ZjshaCardName',item);
                    }
                },
                start_ZjshaIdentityMode: {
                    name: "ZJ联盟杀身份局",
                    init: true,
                    // connect:true,
                    intro: "将三国杀标准的身份局的部分操作改变成ZJ联盟杀专用模式，请手动重启是配置生效",
                    frequent: true,
                    onclick: (item) => {
                        //这种扩展方式下，可能要下一次登录才能触发
                        game.saveConfig('start_ZjshaIdentityMode',item);
                    },
                    update:(config: SMap<any>, map: SMap<HTMLDivElement>)=>{
                        // console.log("输出配置：",config);
                        // return
                    },
                    restart:true
                },
                // 暂时不使用开关
                // mingzhiBool: {
                //     name: "卡牌明置",
                //     init: true,
                //     intro: `开启后可以实现卡牌明置效果，替换了以下函数：<br>` +
                //         `choosePlayerCard,<br>` +
                //         `discardPlayerCard，<br>` +
                //         `gainPlayerCard，<br>` +
                //         `添加全局修改技能_replaceMingzhiContent,` +
                //         `_loseMingzhi,<br>` +
                //         `添加明置标记"mingzhi",明置方法:player.mingzhiCard<br>。`,
                //     unfrequent: true
                // },
                // content: function (config: SMap<any>, pack: PackageData) {
                // },
            },
            precontent: function (data: SMap<any>) {
                //将一些工具方法扩展项目内，保证作用域
                lib.functionUtil = NG.FunctionUtil;

                //todo：尝试，将扩展包加载延迟到precontent中，能不能更好模拟覆盖别得扩展得方法
                // 目前无法覆盖“未来科技”的方法，原因：本扩展，核心内容都是precontent时就加载，它则是在content时才加载的
                NG.Utils.loadDevData(window.ZJNGEx, extensionData, lib, game, ui, get, ai, _status);
                //由于现在采用共享联机的方式，所有，放弃package的导入方式：
                extensionData.package.character = {};
                extensionData.package.skill = {};
                extensionData.package.card = {};

                //后续将全部分离：
                //若需要联机，请将下面package的扩展，移动到这里，在源码中加入
                //（因为非联机导入时，需要!_status.connectMode结果为true时，才能导入该扩展，联机时不加载扩展具体内容，但会执行precontent）
                if (data.enable) { //表示该扩展是否开启
                    //后面重新在这里分包：ZJLM01--XSZJ(1-9)，ZJLM02--XSZJ(10-18)，SP特典包--XSSP（1-9）
                    //在这里加载武将
                    game.import(NG.ImportType.Character, function () {

                        //由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径
                        // if(lib.device||lib.node){
                        //     for(var iin 武将包名英文.character){
                        //         武将包名英文.character[i][4].push('ext:扩展名/'+i+'.jpg');}
                        // }else{
                        //     for(var iin 武将包名英文.character){
                        //         武将包名英文.character[i][4].push('db:extension-扩展名:'+i+'.jpg');}
                        // }
                        // 预设图片信息
                        // if (lib.device || lib.node) {
                        //     for (var i in heros.character) { heros.character[i][4].push('ext:ZJ联盟杀/' + i + '.jpg'); }
                        // } else {
                        //     for (var i in heros.character) { heros.character[i][4].push('db:extension-ZJ联盟杀:' + i + '.jpg'); }
                        // }
                        // todo：为了网页版也能显示统一用直接加载扩展文件夹里的文件方式加载（第二种方式貌似要缓存中又才能加载）
                        for (var i in heros.character) { heros.character[i][4].push('ext:ZJ联盟杀/' + i + '.jpg'); }

                        //武将技能可能需要在这里处理
                        if(skills.skill) {
                            for (const key in skills.skill) {
                                let element = skills.skill[key];
                                heros.skill[key] = element;
                                //顺便统一处理技能声音：
                                if(element.global && element.forceaudio===undefined) {
                                    element.forceaudio = true;
                                }
                                if(!element.audio) {
                                    element.audio = "ext:ZJ联盟杀:true";
                                } else if(typeof element.audio=='number') {
                                    element.audio = "ext:ZJ联盟杀:"+element.audio;
                                }
                                //后续再扩展一个技能多人的不同播放
                            }
                        }
                        if(skills.translate) {
                            for (const key in skills.translate) {
                                const element = skills.translate[key];
                                heros.translate[key] = element;
                            }
                        }
                        
                        //分包：
                        let packName = heros.name;
                        heros.characterSort[packName] = {};
                        let needSplite = ["ZJSha_XSZJ"];//当前线标记一些需要分包，9个一包来处理
                        for (const key in heros.character) {
                            // const element = heros.character[key];
                            let bianhao = key.split("-")[0];
                            let id =Math.ceil(key.split("-")[1]/10);
                            let sortpack = `${packName}_${bianhao}`;
                            if(!needSplite.contains(bianhao)) {
                                id = "";
                            }
                            if(!heros.characterSort[packName][`${sortpack}${id}`]) {
                                heros.characterSort[packName][`${sortpack}${id}`] = [];
                            }
                            heros.characterSort[packName][`${sortpack}${id}`].push(key);
                        }

                        heros.translate[`${packName}_ZJSha_XSSP`] = "联盟杀-sp包";
                        heros.translate[`${packName}_ZJSha_XSZJ1`] = "联盟杀-ZJ联盟包1";
                        heros.translate[`${packName}_ZJSha_XSZJ2`] = "联盟杀-ZJ联盟包2";

                        return heros;
                    });

                    
                    // cards:['standard','ex','extra','sp','classic','basic'],
                    // characters:['standard','shenhua','sp','yijiang','refresh','xinghuoliaoyuan','mobile','extra'],
                    // 目前只要“联盟杀”，主动隐藏其他包：
                    // 注：该方法去除，会在ui.create.menu-->createModeConfig,非联机模式时重新添加删除（既如果不是直接进联机模式下会被重置）
                    // if(Array.isArray(lib.config.hiddenCharacterPack)) {
                    //     lib.config.hiddenCharacterPack.addArray(lib.config.all.characters);
                    // }
                    // if(Array.isArray(lib.config.hiddenCardPack)) {
                    //     for (let i = 0; i < lib.config.all.cards.length; i++) {
                    //         const element = lib.config.all.cards[i];
                    //         if(!lib.config.all.sgscards.contains(element)) {
                    //             lib.config.hiddenCardPack.push(element);
                    //         }
                    //     }
                    // }
                    // 方法二：
                    //清除武将包
                    if(Array.isArray(lib.config.all.characters)) {
                        lib.config.all.characters = [];
                    }
                    //清除卡牌包
                    if(Array.isArray(lib.config.all.cards)) {
                        // lib.config.all.cards = lib.config.all.sgscards.concat();
                        lib.config.all.cards = ['standard','extra','guozhan','sp'];
                    }
                    //清除模式
                    // lib.config.all.stockmode 影响外面得菜单
                    // lib.config.all.mode
                    if(Array.isArray(lib.config.all.mode)) { 
                        // lib.config.all.mode = lib.config.all.sgsmodes.concat();
                        lib.config.all.mode = ['connect','identity','guozhan','versus','single'];
                        // lib.config.all.mode.push('ZJSha_identity'); //暂时采用替换原“identity”mode的部分方法实现；
                    }
                    //目前addMode,有lib.config.all.stockmode的限制，独立添加玩法模式进去
                    // if(Array.isArray(lib.config.all.stockmode)) {
                    //     lib.config.all.stockmode.push('ZJSha_identity');
                    // }

                    //手动添加lib.config.all.characters中：
                    // 注：不直接用“mode_extension_”命名，否则
                    // if (!lib.config.all.characters.contains('mode_extension_ZJ联盟杀'))
                    // lib.config.all.characters.push('mode_extension_ZJ联盟杀');
                    // if (!lib.config.characters.contains('mode_extension_ZJ联盟杀')) lib.config.characters.remove('mode_extension_ZJ联盟杀');
                    // lib.translate['mode_extension_ZJ联盟杀_character_config'] = 'ZJ联盟杀';
                    // 改名：ZJ联盟杀hero
                    lib.config.all.characters.push('ZJ联盟杀hero');
                    // 设置这个，就可以使这个包默认开启
                    lib.config.characters.push('ZJ联盟杀hero');
                    // if (!lib.config.characters.contains('ZJ联盟杀hero')) lib.config.characters.remove('ZJ联盟杀hero');
                    lib.translate['ZJ联盟杀hero_character_config'] = 'ZJ联盟杀';// 包名翻译（特殊）

                    //加载卡牌(暂无)
                    // game.import(NG.ImportType.Card, function () {
                    //     return cards;
                    // });
                    //
                    // lib.translate['卡包名英文_card_config']='卡包名';
                    // lib.config.all.cards.push('卡包名英文');
                    // if(!lib.config.cards.contains('卡包名英文')) lib.config.cards.push('卡包名英文');//包名翻译

                    //默认关闭“神武将选择势力”：
                    //注：目前需要修改identity.js 增加一个get.config('choose_group') &&的判断过滤掉，搜索：'请选择神武将的势力'；
                    // 新版：以进行独立属性处理，不再对神选势力进行干涉
                    // lib.mode.identity.config.choose_group.init = false;
                    // game.saveConfig('choose_group',false,true);
                    // 后续修改：将所有新势力，独立创建；
                    
                    // 默认提前执行一些该扩展的内容
                    // 2020-9-19全新修改：属性名独立，只要使用该配置就加载该属性名，不再覆盖无名杀其他属性名；
                    // if (data.start_wuxing) {
                    //     updateWuxingName(true);
                    // }
                    // 使用例子：
                    // game.新增势力(["ysqin","秦"],[199,21,133],[[250,123,183],[101,5,49]]);//新增势力秦，英文名为ysqin，颜色为rgb(199,21,133)，十周年渐变为rgb(250,123,183)  rgb(101,5,49)
                    game.新增势力(["GOLD","金"],[254,161,0]);
                    game.新增势力(["WOOD","木"],[34,169,41]);
                    game.新增势力(["WATER","水"],[0,18,255]);
                    game.新增势力(["FIRE","火"],[255,0,6]);
                    game.新增势力(["SOIL","土"],[130,130,130]);
                    game.新增势力(["NONE","无"],[1,0,0]);
                    //后续问题：就是选将的时候，不能根据属性选将了，这个以后研究下，可能会做下优化；
                    //目前尽量每次只要修改原版代码的：config.js，update.js，source.js，和 game.js 的  额外加载文件部分（尽量只修改这部分）；

                    if (data.start_ZjshaCardName) {
                        updataZjshaCardName(true);
                    }
                    //zjsha属性技能
                    // let flag = game.getExtensionConfig('start_wuxingSkill',extensionData.name);
                    let flag = lib.config[`${extensionData.name}_start_wuxingSkill`];
                    if(flag === undefined) { //目前暂时除了点问题，扩展的选项没有记忆下来，下次重启又默认激活；
                        game.saveConfig('start_wuxingSkill',data.start_wuxingSkill);
                    }
                    //开启zjsha身份局模式
                    // flag = game.getExtensionConfig('start_ZjshaIdentityMode',extensionData.name);
                    flag = lib.config[`${extensionData.name}_start_ZjshaIdentityMode`];
                    if(flag === undefined) { 
                        game.saveConfig('start_ZjshaIdentityMode',data.start_ZjshaIdentityMode);
                    }
                    
                    //特殊全局技，暂不提供开关
                    //独立载入扩展的方式：参考“东方project”扩展--“未来科技”扩展的导入方式；
                    //目前个人使用的方法，需要修改源码的扩展读取方式（额外增加读取扩展）；

                    //是否所有操作都要提前到这里？
                    // loadExFun(lib, game, ui, get, ai, _status);
                    // updateMingzhiExFun(lib, game, ui, get, ai, _status);
                    // updateSourceFun(lib, game, ui, get, ai, _status);
                    // todo:改成动态模块扩展
                }
            },
            content: function (config: SMap<any>, pack: PackageData) {
                // console.log("ZJ联盟杀检测默认选项：",config,pack);
                // if (config.start_wuxing) {
                //     updateWuxingName(true);
                // }
                // loadExFun(lib, game, ui, get, ai, _status);
                // updateMingzhiExFun(lib, game, ui, get, ai, _status);
            },
            //删除扩展时
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

        //选项得方法实现
        /**
         * 将”魏蜀吴群神“变为”水火木土金“
         * @param bool 
         */
        function updateWuxingName(bool: boolean) {
            //目前还暂时做不到独立显示，独立该包才显示得势力，需要自己独立造势力，或者修改源代码；
            //独立造势力，也要修改源代码，ui相关的，具体后面详细了解ui后再看看
            //目前已知新造势力的方式，后续版本跟进，修改势力；
            if (bool) {
                lib.translate.wei = "水";
                lib.translate.shu = "火";
                lib.translate.wu = "木";
                lib.translate.qun = "土";
                lib.translate.shen = "金";
            } else {
                lib.translate.wei = "魏";
                lib.translate.shu = "蜀";
                lib.translate.wu = "吴";
                lib.translate.qun = "群";
                lib.translate.shen = "神";
            }
            // game.saveConfig("start_wuxing",bool);
        }

        /**
         * 在身份局中，不同属性的身份会拥有不同的主公技
         * 
         * 启用后，会添加一个对应主公属性的全局技能，再选主公后，或者游戏开始后生效
         * @param bool 
         */
        function updateWuxingSkill(bool: boolean) {
        }

        function updataZjshaCardName(bool:boolean) {
            //后续，想办法独立一套卡牌，并且，想办法，可视为原牌，但不是作为视为牌的方式；
            if(bool){
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
            } else {
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

        // //重新统筹一下，[自]xxxx时，[他]可xxxxxx，这种全局技的书写：
        // //重新统筹一下，[自]xxxx时，[自]可令[他们]选择是否代替[自]xxxxxx，这种全局响应技的书写：
        // //重新统筹一下，【改判技】[自]选择是否xxxx代替之，这种改判技的书写：
        // /**
        //  * 扩展功能，导入扩展，貌似不会追加6大对象的解析：
        //  * 
        //  * 在这里加入扩展功能
        //  */
        // function loadExFun(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
        // };
        // /** 逼于无奈,重写一下游戏内的一些方法(暂时先不重写) */
        // function updateSourceFun(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status){
        // }

        //添加别人实现的"改变回合内阶段顺序"

        //解析加载数据：
        // NG.Utils.loadDevData(extensionData,loadHeroDatas,loadCardDatas,skillDatas);
        // this.ZJNGEx,此处得this，即windows
        // todo:修改一下加载顺序，推迟一下加载，将其放入precontent中，开始加载扩展才加载
        // NG.Utils.loadDevData(this.ZJNGEx, extensionData, lib, game, ui, get, ai, _status);
        // //由于现在采用共享联机的方式，所有，放弃package的导入方式：
        // extensionData.package.character = {};
        // extensionData.package.skill = {};
        // extensionData.package.card = {};

        return extensionData;
    }


}

//执行导入扩展
game.import(ZJNGEx.type, ZJNGEx.extensionFun);

//后续增加玩法导入：
// 玩法采用扩展模块的方式；