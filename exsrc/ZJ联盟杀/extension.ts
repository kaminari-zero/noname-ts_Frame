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
                },
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
                    }

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
                    lib.mode.identity.config.choose_group.init = false;
                    game.saveConfig('choose_group',false,true);
                    // lib.config.mode_config.identity.choose_group = false;
                    // get.config('choose_group')
                    // 后续修改：将所有新势力，独立创建；
                    
                    // 默认提前执行一些该扩展的内容
                    if (data.start_wuxing) {
                        updateWuxingName(true);
                    }
                    if (data.start_ZjshaCardName) {
                        updataZjshaCardName(true);
                    }
                    let flag = get.config('start_wuxingSkill');
                    if(flag === undefined) { //目前暂时除了点问题，扩展的选项没有记忆下来，下次重启又默认激活；
                        game.saveConfig('start_wuxingSkill',data.start_wuxingSkill);
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
        //     //get
        //     /** 检索场上拥有当前模式的指定势力标记 */
        //     get.getZJShaShiliCount = function (flag: string) {
        //         let countArray:string[] = [];
        //         let count = game.countPlayer(function (current) {
        //             let info = get.character(current.name) as HeroData;
        //             if (info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) {
        //                 let _info = info[HeroDataFields.zjshaInfo];
        //                 if (_info) {
        //                     if(flag) {
        //                         if( _info[0] == flag) {
        //                             return true;
        //                         }
        //                     } else { //没有则统计势力数
        //                         if(!countArray.contains(_info[0])){
        //                             countArray.push(_info[0]);
        //                             return true;
        //                         }
        //                     }
        //                     // return true;
        //                 }
        //             }
        //         });
        //         return count;
        //     }
        //     //获得当前玩家
        //     get.getZJShaShili = function (player:Player) {
        //         let info = get.character(player.name) as HeroData;
        //         if (info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) {
        //             return info[HeroDataFields.zjshaInfo]?info[HeroDataFields.zjshaInfo][0]:"";
        //         }
        //         return "";
        //     }
        //     //获得当前处理中得按钮得下标
        //     get.buttonIndex = function(button:Button,dialog?:Dialog) {
        //         if(!dialog) dialog = _status.event.dialog;
        //         let buttons = dialog?dialog.buttons:[];
        //         return buttons.indexOf(button);
        //     }
            
        //     //filter
        //     //额外增加一些游戏内的常用检索
        //     //卡牌是否响应打出（包括技能的响应）[需要执行]
        //     lib.filter.cardEnableRespondable = function (card: Card, player: Player) {
        //         var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
        //         if (mod2 != 'unchanged') return mod2;
        //         var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
        //         if (mod != 'unchanged') return mod;
        //         return true;
        //     }

        //     //可以额外增加一个对卡牌类型判定的，卡牌是否响应打出的方法，多用于响应技能发动时
        //     get.cardEnableRespondableFilter= function(exCard?:TwoParmFun<Card,Player,boolean>|CardBaseUIData):TwoParmFun<Card,Player,boolean>{
        //         let _exCard;
        //         if(typeof exCard == "function") {
        //         } else if(get.objtype(exCard)  == NG.ObjType.Object) {
        //             _exCard = get.filter(exCard);
        //         } else {
        //             _exCard = exCard;
        //         }
        //         let conditionFuns = [lib.filter.cardEnableRespondable];
        //         if(_exCard) conditionFuns.push(_exCard);
                
        //         return lib.functionUtil.getConditon(NG.ConditionType.or,conditionFuns);
        //     }
        //     //是否有“无视防具”效果的技能标签
        //     lib.filter.unequip = function(event:GameEvent,player:Player,isNotUnequip2:boolean) {
        //         if(!isNotUnequip2 && player.hasSkillTag('unequip2')) return true;
        //         if(event.source&&event.source.hasSkillTag('unequip',false,{
        //             name:event.card?event.card.name:null,
        //             target:player,
        //             card:event.card
        //         })) return true;
        //         return false;
        //     }
        //     //是否不包括自己
        //     lib.filter.isNotSelf = function(player:Player,target:Player){
        //         return player != target;
        //     }

        //     //额外增加玩家操作方法
        //     //循环响应：
        //     lib.element.content.chooseToRespondByAll = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         if(!event.sourceTrigger) event.sourceTrigger = event.getParent()._trigger;
        //         event.respondPlayer = game.filterPlayer(event.filterPlayer).sort(lib.sort.seat);
        //         event.respondTargets = [];//记录响应目标
        //         event.noRespondTargets = [];//记录不响应目标
        //         event.allPlayers = event.respondPlayer.concat();
        //         event.num = 0;
        //         "step 1"
        //         if (event.respondPlayer && event.respondPlayer.length) { //响应
        //             let current = event.respondPlayer.shift();
        //             if (current) event.current = current;
        //             else event.redo();
        //         } else {
        //             // event.finish();
        //             event.goto(4);
        //         }
        //         "step 2"
        //         let _prompt;
        //         if (typeof event.prompt == "function") {
        //             _prompt = event.prompt.apply(null, [event.sourceTrigger, player, event.current]);
        //         } else {
        //             _prompt = event.prompt;
        //         }
        //         //'是否替' + get.translation(player) + '对' + get.translation(target) + '使用一张'+ get.translation(NG.CardNameConst.sha)
        //         // let _respondFun = event.respondFun;
        //         //重新规划参数，传参，采用执行回调的方式，在回调里执行事件：
        //         // let _respondFunParms = event.respondFunParms as Array<any>;
        //         // if (_respondFunParms && get.objtype(_respondFunParms) == NG.ObjType.Array) {
        //         //     //触发的技能事件
        //         //     _respondFunParms.unshift(...[trigger, player, event.current, _prompt]);
        //         // } else {
        //         //     _respondFunParms = [event, event.sourceTrigger, player, event.current,_prompt];
        //         // }
        //         let _respondFunParms = [event, event.sourceTrigger, player, event.current,_prompt];
        //         // var next = event.respondFun.apply(null, _respondFunParms);//执行响应的方法1
        //         event.respondFun.apply(null, _respondFunParms);//回调执行响应
        //         "step 3"
        //         let resultBool = event.resultFun(result, player, event.current);
        //         if (resultBool) { //是否所有人都需要响应
        //             let _respondResultParms = [event, event.sourceTrigger,result, player, event.current];
        //             //响应结果
        //             event.respondResultFun.apply(null, _respondResultParms);//处理响应的结果方法1
        //             if (event.isContinue) {
        //                 event.goto(1);
        //             }
        //             //记录响应的玩家：
        //             event.respondTargets.push(event.current);
        //         } else {
        //             event.goto(1);//若不响应，则询问下一个
        //             event.noRespondTargets.push(event.current);
        //         }
        //         "step 4"
        //         if (!event._result) {
        //             event._result = {
        //                 bool: event.respondTargets.length > 0,
        //                 noTargets: event.noRespondTargets,//不响应
        //                 targets: event.respondTargets,//响应
        //                 notTargets: event.respondPlayer,//未响应
        //                 players: event.allPlayers,//当前参与响应的玩家
        //             };
        //         }
        //     }
        //     lib.element.player.chooseToRespondByAll = function (parames: {
        //         filterPlayer?: (event: GameEvent, player: Player) => boolean,
        //         isContinue?: boolean,
        //         prompt?: string | FourParmFun<GameEvent, Trigger, Player, Current, string>,
        //         // respondFunParms?: any[],
        //         respondFun?: (event: GameEvent, trigger: GameEvent, player: Player, current: Player, ..._args) => void,
        //         resultFun?:(result:BaseResultData, player: Player, current: Player) => boolean;
        //         respondResultFun?: (event: GameEvent, trigger: GameEvent, player: Player, current: Player) => void
        //     }) {
        //         var next = game.createEvent('chooseToRespondByAll');
        //         next.player = this;
        //         // if (parames.filterPlayer) {
        //         //     next.filterPlayer = parames.filterPlayer;
        //         // } else {
        //         //     next.filterPlayer = lib.filter.all;
        //         // } 
        //         // if (parames.respondFunParms) {
        //         //     next.respondFunParms = parames.respondFunParms;
        //         // } else {
        //         //     next.respondFunParms = [];
        //         // }
        //         // if (parames.prompt) 
        //         // next.prompt = event.prompt;
        //         // next.respondFun = parames.respondFun;
        //         // next.respondResultFun = parames.respondResultFun;
        //         // if(next.ai1==undefined) next.ai1=get.unuseful2;
        //         // if(next.ai2==undefined) next.ai2=get.attitude2;
        //         for (const key in parames) {
        //             const element = parames[key];
        //             next[key] = element;
        //         }
        //         if (!next.filterPlayer) {
        //             next.filterPlayer = lib.filter.all;
        //         }
        //         if(!next.resultFun) {
        //             next.resultFun = function(result:BaseResultData, player: Player, current: Player){
        //                 return result.bool;
        //             }
        //         }
        //         // next.isContinue = !!parames.isContinue;
        //         next.setContent('chooseToRespondByAll');
        //         next._args = Array.from(arguments);
        //         return next;
        //     };

        //     //选择一张牌替代判定
        //     lib.element.content.replaceJudge = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: JudgeResultData) {
        //         "step 0"
        //         let next:GameEvent;
        //         //当前trigger已经默认为jTrigger
        //         //设置当前触发事件为指定的判定事件（默认的触发事件应该是调用它的那个技能的事件）
        //         // if(event.jTrigger) {
        //         //     trigger = event.jTrigger;
        //         // }
        //         // let prompt = `${get.translation(trigger.player)}的${(trigger.judgestr || '')}的判定为${get.translation(trigger.player.judging[0])},${event.prompt}`;
        //         let prompt = get.judegeTipPrompt(event.prompt,trigger);
        //         if(event.chooseType == "card") { //用牌改判，选牌的操作放到外面
        //             //这种情况下，如何显示改判时的提示？
        //             event._result = {
        //                 bool:true,
        //                 cards:[event.card],
        //             };
        //         }
        //         else if(event.chooseType == "cards") { //选择其中一张牌来改判
        //             next = player.chooseButton([prompt,event.cards,'hidden']);
        //             next.ai = function(button:Button){ 
        //                 var card=button.link; 
        //                 var trigger=_status.event.getTrigger(); 
        //                 var player=_status.event.player; 
        //                 var judging=_status.event.judging; 
        //                 var result=trigger.judge(card)-trigger.judge(judging); 
        //                 var attitude=get.attitude(player,trigger.player); 
        //                 return result*attitude; 
        //             };
        //             next.set('judging', trigger.player.judging[0]); //设置给ai的
        //             if(event.filterButton) {
        //                 if(event.filterCardObj) {
        //                     next.filterButton = get.cardEnableRespondableFilter(event.filterCardObj);
        //                 } else {
        //                     next.filterButton = event.filterButton;
        //                 }
        //             } else {
        //                 next.filterButton = function(button){ 
        //                     var player=_status.event.player; 
        //                     var card=button.link; 
        //                     return lib.filter.cardEnableRespondable(card,player);
        //                 };
        //             }
        //         }
        //         else { //”self“选择一张区域的牌来改判（默认就是这个）
        //             next = player.chooseCard(prompt,event.filterCard,event.position);
        //             next.ai = function (card: Card) {
        //                 var trigger = _status.event.getTrigger();
        //                 var player = _status.event.player;
        //                 var judging = _status.event.judging;
        //                 var result = trigger.judge(card) - trigger.judge(judging);
        //                 var attitude = get.attitude(player, trigger.player);
        //                 if (attitude == 0 || result == 0) return 0;
        //                 if (attitude > 0) {
        //                     return result - get.value(card) / 2;
        //                 }
        //                 else {
        //                     return -result - get.value(card) / 2;
        //                 }
        //             };
        //             next.set('judging', trigger.player.judging[0]); //设置给ai的
        //         }
        //         "step 1"
        //         // console.log("replaceJudge======>","开始响应判定牌:",event);
        //         if(result.bool){ 
        //             //若是
        //             if(event.chooseType == "cards") {
        //                 result.cards=[result.buttons[0].link];
        //             }
        //             // game.cardsGotoOrdering(result.cards).relatedEvent=trigger;//放入处理区并响应
        //             player.respond(result.cards,'highlight','noOrdering'); 
        //         } 
        //         else{ 
        //             event.finish();
        //         } 
        //         "step 2"
        //         // console.log("replaceJudge======>","开始替换判定牌:",event);
        //         if(result.bool) {
        //             //替代判定牌：(后期需要封装，我觉得所有这种对UI复杂操作，重复利用应该封装起来)
        //             //替代的流程：打出一张指定牌；将当前牌作为判定牌，原判定牌置入弃牌堆，且该置入弃牌堆的不触发牌的移动事件
        //             if(trigger.player.judging[0].clone){ 
        //                 trigger.player.judging[0].clone.classList.remove('thrownhighlight'); 
        //                 game.broadcast(function(card){ 
        //                     // player.$throw(card);
        //                     if(card.clone){ 
        //                         card.clone.classList.remove('thrownhighlight'); 
        //                     } 
        //                 },trigger.player.judging[0]); 
        //                 game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[0].clone])); 
        //             } 
        //             event.judged = trigger.player.judging[0];
        //             trigger.player.judging[0]=result.cards[0]; 
        //             trigger.orderingCards.addArray(result.cards);//添加到处理区中
        //             if(event.chooseType == "exchange" || event.exchange) { //默认是代替"replace"，打出响应；替代"exchange"：可以交换获得那个判定牌
        //                 player.gain(event.judged,NG.AniNmaeConst.gain2);
        //                 trigger.orderingCards.remove(event.judged);
        //             } else {
        //                 game.cardsDiscard(trigger.player.judging[0]);
        //                 trigger.orderingCards.remove(event.judged);
        //             }
        //             game.log(trigger.player,'的判定牌改为',result.cards[0]); 
        //             game.delay(2);
        //         } else {
        //             event.finish();
        //         }
        //         "step 3"
        //         player.changeJudge(event.judged,trigger);
        //     }
        //     lib.element.player.replaceJudge = function (params:SMap<any>,...args) {
        //         var next = game.createEvent('replaceJudge');
        //         next.player = this;
        //         // next.trigger = _status.event.trigger;
        //         if(arguments.length == 1) {
        //             for (const key in arguments[0]) {
        //                 // if(params[key]) {//可能也不需要
        //                 // }
        //                 next[key] = params[key];
        //             }
        //         } else {
        //             for (var i = 0; i < arguments.length; i++) {
        //                 if (get.itemtype(arguments[i]) == 'player') {
        //                     next.source = arguments[i];//当前被改判的目标
        //                 }
        //                 else if (get.itemtype(arguments[i]) == 'cards') {
        //                     next.cards = arguments[i];
        //                 }
        //                 else if (get.itemtype(arguments[i]) == 'card') {
        //                     next.cards = arguments[i];
        //                 }
        //                 else if (get.itemtype(arguments[i]) == 'position') {
        //                     next.position = arguments[i];
        //                 }
        //                 else if(typeof arguments[i]=='function'){
        //                     next.filterCard=arguments[i];
        //                 }
        //                 else if(typeof arguments[i]=='object'&&arguments[i]){
        //                     if(arguments[i].name == "judge") {
        //                         next._trigger = arguments[i];
        //                     } else {
        //                         next.filterCard=get.cardEnableRespondableFilter(arguments[i]);
        //                     }
        //                 }
        //                 else if(typeof arguments[i]=='string'){
        //                     if(["card","cards"].indexOf(arguments[i]) > -1) {
        //                         next.chooseType = arguments[i];
        //                     } 
        //                     else if(arguments[i] == "exchange") {
        //                         next.exchange = true;
        //                     }
        //                     else next.prompt=arguments[i];
        //                 }
        //             }
        //         }
        //         if(!next.source) next.source = _status.event._trigger.player;
        //         if(!next.prompt) next.prompt = get.prompt(_status.event.name);//默认当前处理的技能
        //         if(!next.chooseType) {
        //             if(next.card) {
        //                 next.chooseType = "card";
        //                 // next.cards = [next.card];
        //             } else if(next.cards) {
        //                 next.chooseType = "cards";
        //             } else {
        //                 next.chooseType = "replace";
        //             }
        //         }
        //         if(next.chooseType == "replace") { //此时为默认chooseCard
        //             if(!next.position) next.position = NG.PositionType.Use;
        //             if(next.filterCard == undefined) next.filterCard = lib.filter.cardEnableRespondable;
        //             if(!params.filterCard && params.filterCardObj) next.filterCard=get.cardEnableRespondableFilter(arguments[i]);
        //         }
        //         if(next.chooseType && 
        //             next.chooseType == "cards" && 
        //             next.cards == undefined) {
        //                 _status.event.next.remove(next);
        //             }
        //         else if(next.chooseType && 
        //             next.chooseType == "card" && 
        //             next.card == undefined) {
        //                 _status.event.next.remove(next);
        //             }
        //         if(!next.jTrigger) next.jTrigger = _status.event._trigger;//一般在技能里使用，即当前trigger为当前触发技能的事件
        //         next._trigger = next.jTrigger;
        //         next.setContent('replaceJudge');
        //         next._args = Array.from(arguments);
        //         return next;
        //     }
        //     lib.element.player.changeJudge = function(card:Card,trigger?:GameEvent) {
        //         var next = game.createEvent('changeJudge');
        //         next.player = this;
        //         next.cards = cards;
        //         // next.trigger = trigger;//当前判断牌触发事件
        //         if (next.cards == undefined || next.cards.length) _status.event.next.remove(next);
        //         // next.setContent(lib.element.content.emptyEvent);//默认就会发起一个当前事件名的触发
        //         next.setContent(function(event:GameEvent){
        //             event.trigger("changeJudge");//后期继续补充
        //         });
        //         next._args = Array.from(arguments);
        //         return next;
        //     }
        //     get.judegeTipPrompt = function(str:string,trigger:GameEvent) {
        //         if(lib.skill[str]) { 
        //             str = get.prompt(str);
        //         }
        //         return `${get.translation(trigger.player)}的${(trigger.judgestr || '')}的判定为${get.translation(trigger.player.judging[0])},${str}`;
        //     }

        //     //将牌放回牌堆：
        //     lib.element.player.putCardsToCardPile = function(cards:Card|Card[],isBottom?:boolean) {
        //         if(Array.isArray(cards)) {
        //             while(cards.length){ 
        //                 if(isBottom) {
        //                     ui.cardPile.insertBefore(cards.shift(),ui.cardPile.lastChild); 
        //                 } else {
        //                     ui.cardPile.insertBefore(cards.pop(),ui.cardPile.firstChild);
        //                 }
        //             } 
        //         } else {
        //             if(isBottom) {
        //                 ui.cardPile.insertBefore(cards,ui.cardPile.lastChild); 
        //             } else {
        //                 ui.cardPile.insertBefore(cards,ui.cardPile.firstChild);
        //             }
        //         }
        //         return this;
        //     }

        //     //收集别人的操作方法：
        //     //"重铸"行为，非原逻辑的"_chongzhu"
        //     lib.element.content.recast = function () {
        //         "step 0"
        //         game.log(player, '重铸了', cards);
        //         player.lose(cards, event.position);
        //         if (event.animate != false) {
        //             event.discardid = lib.status.videoId++;
        //             game.broadcastAll(function (player, cards, id) {
        //                 player.$throw(cards, null, 'nobroadcast');
        //                 var cardnodes = [];
        //                 cardnodes._discardtime = get.time();
        //                 for (var i = 0; i < cards.length; i++) {
        //                     if (cards[i].clone) {
        //                         cardnodes.push(cards[i].clone);
        //                     }
        //                 }
        //                 ui.todiscard[id] = cardnodes;
        //             }, player, cards, event.discardid);
        //             if (lib.config.sync_speed && cards[0] && cards[0].clone) {
        //                 if (event.delay != false) {
        //                     var waitingForTransition = get.time();
        //                     event.waitingForTransition = waitingForTransition;
        //                     cards[0].clone.listenTransition(function () {
        //                         if (_status.waitingForTransition == waitingForTransition && _status.paused) {
        //                             game.resume();
        //                         }
        //                         delete event.waitingForTransition;
        //                     });
        //                 }
        //                 else if (event.getParent().discardTransition) {
        //                     delete event.getParent().discardTransition;
        //                     var waitingForTransition = get.time();
        //                     event.getParent().waitingForTransition = waitingForTransition;
        //                     cards[0].clone.listenTransition(function () {
        //                         if (_status.waitingForTransition == waitingForTransition && _status.paused) {
        //                             game.resume();
        //                         }
        //                         delete event.getParent().waitingForTransition;
        //                     });
        //                 }
        //             }
        //         }
        //         event.trigger('recast');
        //         "step 1"
        //         if (event.delay != false) {
        //             if (event.waitingForTransition) {
        //                 _status.waitingForTransition = event.waitingForTransition;
        //                 game.pause();
        //             }
        //             else {
        //                 game.delayx();
        //             }
        //         }
        //         "step 2"
        //         var num = 0;
        //         for (var i = 0; i < cards.length; i++) {
        //             num++;
        //         }
        //         if (num > 0) player.draw(num);
        //     }   
        //     lib.element.player.recast = function () {
        //         var next = game.createEvent('recast');
        //         next.player = this;
        //         next.num = 0;
        //         for (var i = 0; i < arguments.length; i++) {
        //             if (get.itemtype(arguments[i]) == 'player') {
        //                 next.source = arguments[i];
        //             }
        //             else if (get.itemtype(arguments[i]) == 'cards') {
        //                 next.cards = arguments[i];
        //             }
        //             else if (get.itemtype(arguments[i]) == 'card') {
        //                 next.cards = [arguments[i]];
        //             }
        //             else if (typeof arguments[i] == 'boolean') {
        //                 next.animate = arguments[i];
        //             }
        //             else if (get.objtype(arguments[i]) == 'div') {
        //                 next.position = arguments[i];
        //             }
        //         }
        //         if(next.cards) {
        //             var _targets = [];
        //             // next.source = get.owner(next.cards[0]);
        //             next.cards.forEach((card)=>{
        //                 var _target = get.owner(card);
        //                 if(_targets.indexOf(_targets) == -1 ) _targets.push(_target);
        //             });
        //             next.targets = _targets;//所有的重铸的目标
        //             // if(next.targets.length) next.multiTargets = true;
        //         }
        //         if(!next.source) next.source = next.player;//默认来源是自己
        //         if(!next.position) next.position = ui.discardPile;
        //         if (next.cards == undefined) _status.event.next.remove(next);
        //         next.setContent('recast');
        //         next._args = Array.from(arguments);
        //         return next;
        //     }

        //     //改变回合阶段
        //     lib.element.player.changePhase = function (...name) {
        //         if (!name.length) return;
        //         if (!this.name && !this.name) return;
        //         if (name.contains(true)) {
        //             this.changePhaseAllthetime = true;
        //             name.remove(true);
        //         }
        //         if (!this.truephase) this.truephase = this.phase;
        //         this.phase = function (skill) {
        //             var next = game.createEvent('phase');
        //             next.player = this;
        //             this.changePhaseorder = name;
        //             this.changePhaseordermarks = name.slice(0);
        //             this.markSkill('_changePhase');
        //             if (get.mode() == "guozhan") next.setContent(this.name1 + 'changePhase');
        //             else next.setContent(this.name + 'changePhase');
        //             if (!_status.roundStart) {
        //                 _status.roundStart = this;
        //             }
        //             if (skill) {
        //                 next.skill = skill;
        //             }
        //             return next;
        //         }
        //         if (get.mode() == "guozhan") var b = this.name1;
        //         else var b = this.name;
        //         lib.element.content[b + 'changePhase'] = function () {
        //             "step 0"
        //             var name = player.changePhaseorder[0];
        //             if (!player[name]) event.goto(2);
        //             player[name]();
        //             "step 1"
        //             if (player.changePhaseorder[0] == "phaseDraw") {
        //                 if (!player.noPhaseDelay) {
        //                     if (player == game.me) {
        //                         game.delay();
        //                     }
        //                     else {
        //                         game.delayx();
        //                     }
        //                 }
        //             }
        //             if (player.changePhaseorder[0] == "phaseUse") {
        //                 game.broadcastAll(function () {
        //                     if (ui.tempnowuxie) {
        //                         ui.tempnowuxie.close();
        //                         delete ui.tempnowuxie;
        //                     }
        //                 });
        //             }
        //             if (player.changePhaseorder[0] == "phaseDiscard") {
        //                 if (!player.noPhaseDelay) game.delayx();
        //             }
        //             "step 2"
        //             player.changePhaseorder.splice(0, 1);
        //             if (player.changePhaseorder.length <= 0) {
        //                 delete player.using;
        //                 delete player._noSkill;
        //                 if (!player.changePhaseAllthetime) {
        //                     player.phase = player.truephase;
        //                     player.unmarkSkill('_changePhase');
        //                 }
        //                 return;
        //             }
        //             else event.goto(0);
        //         }
        //         return this;
        //     }            
        //     lib.skill._changePhase = {
        //         mark: true,
        //         popup: false,
        //         forced: true,
        //         nobracket: true,
        //         superCharlotte: true,
        //         unique: true,
        //         intro: {
        //             content: function (content, player) {
        //                 var str = '';
        //                 //if(player.changePhaseordermarks) str="你现在的回合内阶段顺序分别为：<br>"+player.changePhaseordermarks;
        //                 if (player.changePhaseordermarks) {
        //                     str = '你现在的回合内阶段顺序分别为：<br>' + get.translation(player.changePhaseordermarks[0]);
        //                     for (var i = 1; i < player.changePhaseordermarks.length; i++) {
        //                         str += '、' + get.translation(player.changePhaseordermarks[i]);
        //                     }
        //                 }
        //                 return str;
        //             },
        //         },
        //     }
        //     //配合回合顺序变换的全局技能
        //     lib.translate.phaseZhunbei = "准备阶段";
        //     lib.translate.phaseJudge = "判定阶段";
        //     lib.translate.phaseDraw = "摸牌阶段";
        //     lib.translate.phaseUse = "出牌阶段";
        //     lib.translate.phaseDiscard = "弃牌阶段";
        //     lib.translate.phaseJieshu = "结束阶段";
        //     lib.translate._changePhase = '回合顺序';
        //     //主动重置回合顺序：
        //     lib.element.player.resetChangePhase = function() {
        //         if(this.hasMark("_changePhase")) {
        //             delete this.changePhaseAllthetime;
        //             this.phase=this.truephase;
        //             this.unmarkSkill('_changePhase');
        //         }
        //         return this;
        //     }

        //     //玩家是否时当前什么属性最大的
        //     lib.element.player.ismax = function (shushing, ...arg) {
        //         if (!shushing) return;
        //         if (this[shushing] == undefined) return;
        //         if (arg.contains(true)) {
        //             var bool = true;
        //             arg.remove(true);
            
        //         }
        //         if (arg && arg.length) {
        //             if (this[shushing](arg) == undefined) return;
        //             for (var i = 0; i < game.players.length; i++) {
        //                 if (game.players[i].isOut() || game.players[i] == this) continue;
        //                 if (bool == true) {
        //                     if (game.players[i][shushing](arg) >= this[shushing](arg)) return false;
        //                 }
        //                 else {
        //                     if (game.players[i][shushing](arg) > this[shushing](arg)) return false;
        //                 }
        //             }
        //         }
        //         else {
        //             for (var i = 0; i < game.players.length; i++) {
        //                 if (game.players[i].isOut() || game.players[i] == this) continue;
        //                 if (bool == true) {
        //                     if (game.players[i][shushing] >= this[shushing]) return false;
        //                 }
        //                 else {
        //                     if (game.players[i][shushing] > this[shushing]) return false;
        //                 }
        //             }
        //         }
        //         return true;
        //     }
        //     //玩家是否时当前什么属性最小的
        //     lib.element.player.ismin = function (shushing, ...arg) {
        //         if (!shushing) return;
        //         if (this[shushing] == undefined) return;
        //         if (arg.contains(true)) {
        //             var bool = true;
        //             arg.remove(true);
            
        //         }
        //         if (arg && arg.length) {
        //             if (this[shushing](arg) == undefined) return;
        //             for (var i = 0; i < game.players.length; i++) {
        //                 if (game.players[i].isOut() || game.players[i] == this) continue;
        //                 if (bool == true) {
        //                     if (game.players[i][shushing](arg) <= this[shushing](arg)) return false;
        //                 }
        //                 else {
        //                     if (game.players[i][shushing](arg) < this[shushing](arg)) return false;
        //                 }
        //             }
        //         }
        //         else {
        //             for (var i = 0; i < game.players.length; i++) {
        //                 if (game.players[i].isOut() || game.players[i] == this) continue;
        //                 if (bool == true) {
        //                     if (game.players[i][shushing] <= this[shushing]) return false;
        //                 }
        //                 else {
        //                     if (game.players[i][shushing] < this[shushing]) return false;
        //                 }
        //             }
        //         }
        //         return true;
        //     }

        //     //交换的判定区主函数（搬自耀世三国②，自己保留）
        //     lib.element.content.swapJudge = function () {
        //         "step 0"
        //         game.log(player, '和', target, '交换了判定区中的牌')
        //         var j1 = player.getCards('j');
        //         if (target.storage._disableJudge) {
        //             if (j1) player.discard(j1);
        //         }
        //         var j2 = target.getCards('j');
        //         if (player.storage._disableJudge) {
        //             if (j2) target.discard(j2);
        //         }
        //         "step 1"
        //         event.cards = [player.getCards('j'), target.getCards('j')];
        //         player.lose(event.cards[0], ui.ordering, 'visible');
        //         target.lose(event.cards[1], ui.ordering, 'visible');
        //         if (event.cards[0].length) player.$give(event.cards[0], target);
        //         if (event.cards[1].length) target.$give(event.cards[1], player);
        //         "step 2"
        //         for (var i = 0; i < event.cards[1].length; i++) {
        //             if (event.cards[1][i].viewAs) player.addJudge({ name: event.cards[1][i].viewAs }, [event.cards[1][i]]);
        //             else player.addJudge(event.cards[1][i]);
        //         }
        //         for (var i = 0; i < event.cards[0].length; i++) {
        //             if (event.cards[0][i].viewAs) target.addJudge({ name: event.cards[0][i].viewAs }, [event.cards[0][i]]);
        //             else target.addJudge(event.cards[0][i]);
        //         }
        //     };
        //     lib.element.player.swapJudge = function (target) {
        //         var next = game.createEvent('swapJudge');
        //         next.player = this;
        //         next.target = target;
        //         next.setContent('swapJudge');
        //         return next;
        //     };
            
        //     //当前失去的体力
        //     lib.element.player.curLoseHp = function() {
        //         //后续增加操作
        //         return this.maxHp - this.hp;
        //     }

        //     //自动添加标记，同时也会自动添加到武将牌下（ui.special）
        //     lib.element.player.markAutoBySpecial = function(name:string,datas:any[],noToSpecial?:boolean,nolog?:boolean){
        //         if(get.itemtype(datas)==NG.ItemType.CARDS && noToSpecial!==false) {
        //             let areaList = [];
        //             let orderingList = [];
        //             let specialList = [];
        //             for (let i = 0; i  < datas.length; i++) {
        //                 const element = datas[i];
        //                 let type = get.position(element,true);
        //                 switch(type) {
        //                     case NG.PositionType.Handcard:
        //                     case NG.PositionType.Judge:
        //                     case NG.PositionType.Equip:
        //                         //场上的卡牌
        //                         areaList.push(element);
        //                         break;
        //                     case NG.PositionType.Ordering:
        //                         //处理区
        //                         orderingList.push(element);
        //                         break;
        //                     default:
        //                         //牌堆，弃牌，场外区，不存在区域
        //                         specialList.push(element);
        //                         break;
        //                 }
        //             }
        //             if(areaList.length) {
        //                 this.lose(areaList,ui.special,NG.StringTypeConst.visible,NG.StringTypeConst.toStorage);
        //             }
        //             if(orderingList.length) {
        //                 //使用该方法都是触发的技能，
        //                 let evt = _status.event._trigger||_status.event.getParent();
        //                 if(evt && evt.orderingCards) {
        //                     evt.orderingCards.removeArray(orderingList);
        //                 }
        //                 game.cardsGotoSpecial(orderingList);
        //                 // game.broadcastAll(function(cards){
        //                 // },orderingList);
        //             }
        //             if(specialList.length) {
        //                 game.cardsGotoSpecial(specialList);
        //                 // game.broadcastAll(function(cards){
        //                 // },specialList);
        //             }
        //         }
        //         if(nolog!==false){
        //             var str=false;
        //             var info=get.info(name);
        //             if(info&&info.marktext) str = info.marktext;
        //             else if(info&&info.intro&&(info.intro.name||info.intro.name2)) str=info.intro.name2||info.intro.name;
        //             else str=lib.translate[name];
        //             if(str) game.log(this,'将',datas,'置于武将牌下,获得了','#g【'+str+'】');
        //         }
        //         this.$gain2(datas);
        //         this.markAuto(name,datas);
        //         this.syncStorage(name);
        //         //手动刷新标记，不知为何syncStorage失效了【添加貌似没事】
        //         // game.broadcast(function(player,storage,skill){
        //         //     player.storage[skill]=storage;
        //         //     player.updateMarks();
        //         // },this,this.storage[name],name);
        //     }
        //     //自动移除标记，移除武将牌下的牌丢弃
        //     lib.element.player.unmarkAutoBySpecial=function(name:string,datas:any[],onLose?:string,nolog?:boolean){
        //         var storage=this.getStorage(name);
        //         if(get.itemtype(datas)==NG.ItemType.CARDS && Array.isArray(storage)) {
        //             let _datas = datas.slice(0);//必须操作属于当前标记的牌
        //             for (let i = _datas.length-1; i >= 0 ; i--) {
        //                 if(!storage.contains(_datas[i])) _datas.splice(i,1);
        //             }
        //             var info=lib.skill[name];
        //             if(info&&info.intro&&info.intro.onunmark && !onLose){ //技能有配置的话，优先技能的操作
        //                 if(info.intro.onunmark=='throw'){
        //                     this.$throw(_datas,1000);
        //                     game.cardsDiscard(_datas);
        //                     if(nolog!==false) game.log('置于武将牌下的',_datas,'，进入了弃牌堆');
        //                     // this.storage[name].removeArray(_datas);
        //                 }
        //                 else if(typeof info.intro.onunmark=='function'){ //自定义操作（需要直接获得在这里操作，注意isLose不是true）
        //                     info.intro.onunmark(_datas,this); //只处理弃置的牌
        //                 }
        //             } else if(onLose) {
        //                 switch(onLose) {
        //                     case NG.PositionType.Handcard://玩家获得到手上
        //                         this.gain(_datas,NG.StringTypeConst.fromStorage,this,NG.StringTypeConst.bySelf,NG.AniNmaeConst.gain2);
        //                         break;
        //                     case NG.PositionType.Ordering:
        //                         let evt = _status.event._trigger||_status.event.getParent();//不确定，一般主动使用去除标记，都是在触发技能中
        //                         // if(evt && evt.orderingCards) {
        //                         //     evt.orderingCards.addArray(orderingList);
        //                         // }
        //                         this.$throw(_datas,1000);
        //                         game.cardsGotoOrdering(_datas).relatedEvent = evt;
        //                         if(nolog!==false) game.log('置于武将牌下的',_datas,'，进入了处理区');
        //                         break;
        //                     case NG.PositionType.CardPlie://日后考虑扩展到牌堆
        //                     default:
        //                         this.$throw(_datas,1000);
        //                         if(nolog!==false) game.log('置于武将牌下的',_datas,'，进入了弃牌堆');
        //                         game.cardsDiscard(_datas);
        //                         break;
        //                 }
        //             }
        //             else { //默认失去到弃牌堆中
        //                 this.$throw(_datas,1000);
        //                 // if(onLose) {
        //                 //     if(nolog!==false) game.log('失去置于武将牌下的',_datas,'，进入了弃牌堆');
        //                 //     //lose处理不了hej以外的区域
        //                 //     this.lose(areaList,NG.StringTypeConst.visible);//默认失去到弃牌堆中
        //                 // } else {
        //                 //     game.log('置于武将牌下的',_datas,'，进入了弃牌堆');
        //                 //     if(nolog!==false) game.cardsDiscard(_datas);
        //                 // }
        //                 if(nolog!==false) game.log('置于武将牌下的',_datas,'，进入了弃牌堆');
        //                 game.cardsDiscard(_datas);
        //             }
        //             //移除，同步标记
        //             // this.storage[name].removeArray(_datas);
        //             // console.log("game.broadcast--update==>",name,datas,_datas);
        //             //手动刷新标记，不知为何syncStorage失效了
        //             // this.unmarkAuto(name,_datas);
        //             // game.broadcast(function(player,storage,skill){
        //             //     // console.log("game.broadcast==>",player,storage,skill);
        //             //     let _player:Player = get.parsedResult(player);
        //             //     let _storage:SMap<any> = get.parsedResult(storage);
        //             //     _player.storage[skill]=_storage;
        //             //     _player.updateMarks();
        //             // },get.stringifiedResult(this),get.stringifiedResult(this.storage[name]),name);
                    
        //             // else if(event.isMine()){
        //             //     func(this,storage,name);
        //             // }
        //             // this.markAuto(name);
        //             // this.syncStorage(name);//缺少storage的同步 问题：如果清空标记的情况好像有问题
                    
        //             this.unmarkAuto(name,_datas);
        //             // game.broadcast(function(player,storage,skill){
        //             //     // console.log("unmarkAutoBySpecial--broadcast==>",player,storage,skill);
        //             //     player.storage[skill]=storage;
        //             //     player.markAuto(skill);
        //             // },this,this.storage[name],name);
        //             // this.updateMarks(name);
        //             // console.log("unmarkAutoBySpecial--start==>",this,this.storage[name],name,game.me.storage);
        //             // this.send(function(player,storage,skill){
        //             //     console.log("unmarkAutoBySpecial--send==>",player,storage,skill);
        //             //     player.storage[skill]=storage;
        //             //     player.markAuto(skill);
        //             // },this,this.storage[name],name,"test:unmarkAutoBySpecial");
                    
        //             // if(this.isOnline2()){
        //             // } 
        //             // else if(this == game.me) {
        //             // }
        //         } else {
        //             // console.log("game.broadcast--update2==>",name,datas);
        //             this.unmarkAuto(name,datas);
        //         }            
        //     }

        //     //添加播放死亡语音：（后续有语言先开放）
        //     // lib.skill._playerAudioByDie = {
        //     //     trigger: {
        //     //         player: 'dieBegin',
        //     //     },
        //     //     priority: -Infinity,
        //     //     silent:true,
        //     //     ruleSkill:true,
        //     //     unique: true,
        //     //     content: function () {
        //     //         "step 0"
        //     //         //当前只针对“zj联盟杀”，先默认扩展名为“ZJ联盟杀”
        //     //         var exName = "ZJ联盟杀/aduio/die";
        //     //         var name = "";
        //     //         if (get.mode() == "guozhan") name = player.name1;
		// 	// 		else player.name;
        //     //         var name2 = player.name2;
        //     //         var tags = lib.character[name][4];
        //     //         if (name2) var tags2 = lib.character[name2][4];
        //     //         var audioList = [];
        //     //         if (tags && tags.length) {
        //     //             for (var i = 0; i < tags.length; i++) {
        //     //                 if (tags[i].indexOf('dieAudio:') == 0) {
        //     //                     audioList.push(tags[i].slice(9));
        //     //                 }
        //     //             }
        //     //         }
        //     //         var audionum = audioList.length;
        //     //         if (audionum) { //复数死亡语音：“ZJ联盟杀/aduio/die/随机[dieAudio:定义语音]”
        //     //             var num = get.rand(0, audionum-1);
        //     //             var audioname = audioList[num];
        //     //             game.playAudio('..', 'extension', exName, audioname);
        //     //         }
        //     //         else { //默认：“ZJ联盟杀/aduio/die/角色编号名_die.mp3”【注：自动默认补充.mp3】
        //     //             game.playAudio('..', 'extension', exName, name+"_die");
        //     //         }
        //     //         if (name2 && tags2 && tags2.length) {
        //     //             event.tags2 = tags2;
        //     //             event.name = name2;
        //     //         }
        //     //         else {
        //     //             event.finish();
        //     //         }
        //     //         "step 1"
        //     //         var exName = "ZJ联盟杀/aduio/die";
        //     //         var audioList = [];
        //     //         var tags2 = event.tags2;
        //     //         var name = event.name;
        //     //         for (var i = 0; i < tags2.length; i++) {
        //     //             if (tags2[i].indexOf('dieAudio:') == 0) {
        //     //                 audioList.push(tags2[i].slice(9));
        //     //             }
        //     //         }
        //     //         var audionum = audioList.length;
        //     //         if (audionum) { //复数死亡语音：“ZJ联盟杀/aduio/die/随机[dieAudio:定义语音]”
        //     //             var num = get.rand(0, audionum-1);
        //     //             var audioname = audioList[num];
        //     //             game.playAudio('..', 'extension', exName, audioname);
        //     //         }
        //     //         else { //默认：“ZJ联盟杀/aduio/die/角色编号名_die.mp3”【注：自动默认补充.mp3】
        //     //             game.playAudio('..', 'extension', exName, name+"_die");
        //     //         }
        //     //     },
        //     // }
        // };

        // //添加“明置”的机制，目前不采用开关
        // function updateMingzhiExFun(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
        //     //明置相关，算是一个大系统：
        //     //content:
        //     //明置特供方法
        //     lib.element.content.choosePlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         if (!event.dialog) event.dialog = ui.create.dialog('hidden');
        //         else if (!event.isMine) {
        //             event.dialog.style.display = 'none';
        //         }
        //         if (event.prompt) {
        //             event.dialog.add(event.prompt);
        //         }
        //         else {
        //             event.dialog.add('选择' + get.translation(target) + '的一张牌');
        //         }
        //         if (event.prompt2) {
        //             event.dialog.addText(event.prompt2);
        //         }
        //         var directh = true;
        //         for (var i = 0; i < event.position.length; i++) {
        //             if (event.position[i] == 'h') {
        //                 var hs = target.getCards('h');
        //                 if (hs.length) {
        //                     event.dialog.addText('手牌区');
        //                     hs.randomSort();
        //                     if (event.visible || target.isUnderControl(true)) {
        //                         event.dialog.add(hs);
        //                         directh = false;
        //                     }
        //                     else {
        //                         // console.log("choosePlayerCardByMingzhi===>",target.storage.mingzhi,hs);
        //                         if (target.storage.mingzhi) {//明置手牌
        //                             for (var j = 0; j < hs.length; j++) {
        //                                 if (target.storage.mingzhi.contains(hs[j])) {
        //                                     event.dialog.add([hs[j]]);
        //                                 } else {
        //                                     event.dialog.add([[hs[j]], 'blank']);
        //                                 }
        //                             }
        //                             directh = false;
        //                         } else {
        //                             event.dialog.add([hs, 'blank']);
        //                         }
        //                     }
        //                 }
        //             }
        //             else if (event.position[i] == 'e') {
        //                 var es = target.getCards('e');
        //                 if (es.length) {
        //                     event.dialog.addText('装备区');
        //                     event.dialog.add(es);
        //                     directh = false;
        //                 }
        //             }
        //             else if (event.position[i] == 'j') {
        //                 var js = target.getCards('j');
        //                 if (js.length) {
        //                     event.dialog.addText('判定区');
        //                     event.dialog.add(js);
        //                     directh = false;
        //                 }
        //             }
        //         }
        //         if (event.dialog.buttons.length == 0) {
        //             event.finish();
        //             return;
        //         }
        //         var cs = target.getCards(event.position);
        //         var select = get.select(event.selectButton);
        //         if (event.forced && select[0] >= cs.length) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons,
        //                 links: cs
        //             }
        //         }
        //         else if (event.forced && directh && select[0] == select[1]) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons.randomGets(select[0]),
        //                 links: []
        //             }
        //             for (var i = 0; i < event.result.buttons.length; i++) {
        //                 event.result.links[i] = event.result.buttons[i].link;
        //             }
        //         }
        //         else {
        //             if (event.isMine()) {
        //                 event.dialog.open();
        //                 game.check();
        //                 game.pause();
        //             }
        //             else if (event.isOnline()) {
        //                 event.send();
        //             }
        //             else {
        //                 event.result = 'ai';
        //             }
        //         }
        //         "step 1"
        //         if (event.result == 'ai') {
        //             game.check();
        //             if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
        //             else ui.click.cancel();
        //         }
        //         event.dialog.close();
        //         if (event.result.links) {
        //             event.result.cards = event.result.links.slice(0);
        //         }
        //         event.resume();
        //     }

        //     lib.element.content.discardPlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         if (event.directresult) {
        //             event.result = {
        //                 buttons: [],
        //                 cards: event.directresult.slice(0),
        //                 links: event.directresult.slice(0),
        //                 targets: [],
        //                 confirm: 'ok',
        //                 bool: true
        //             };
        //             event.cards = event.directresult.slice(0);
        //             event.goto(2);
        //             return;
        //         }
        //         if (!event.dialog) event.dialog = ui.create.dialog('hidden');
        //         else if (!event.isMine) {
        //             event.dialog.style.display = 'none';
        //         }
        //         if (event.prompt == undefined) {
        //             var str = '弃置' + get.translation(target);
        //             var range = get.select(event.selectButton);
        //             if (range[0] == range[1]) str += get.cnNumber(range[0]);
        //             else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
        //             else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
        //             str += '张';
        //             if (event.position == 'h' || event.position == undefined) str += '手';
        //             if (event.position == 'e') str += '装备';
        //             str += '牌';
        //             event.prompt = str;
        //         }
        //         if (event.prompt) {
        //             event.dialog.add(event.prompt);
        //         }
        //         if (event.prompt2) {
        //             event.dialog.addText(event.prompt2);
        //         }
        //         var directh = true;
        //         for (var i = 0; i < event.position.length; i++) {
        //             if (event.position[i] == 'h') {
        //                 var hs = target.getDiscardableCards(player, 'h');
        //                 if (hs.length) {
        //                     event.dialog.addText('手牌区');
        //                     hs.randomSort();
        //                     if (event.visible || target.isUnderControl(true)) {
        //                         event.dialog.add(hs);
        //                         directh = false;
        //                     }
        //                     else {
        //                         if (target.storage.mingzhi) {//明置手牌
        //                             for (var j = 0; j < hs.length; j++) {
        //                                 if (target.storage.mingzhi.contains(hs[j])) {
        //                                     event.dialog.add([hs[j]]);
        //                                 } else {
        //                                     event.dialog.add([[hs[j]], 'blank']);
        //                                 }
        //                             }
        //                             directh = false;
        //                         } else {
        //                             event.dialog.add([hs, 'blank']);
        //                         }
        //                     }
        //                 }
        //             }
        //             else if (event.position[i] == 'e') {
        //                 var es = target.getDiscardableCards(player, 'e');
        //                 if (es.length) {
        //                     event.dialog.addText('装备区');
        //                     event.dialog.add(es);
        //                     directh = false;
        //                 }
        //             }
        //             else if (event.position[i] == 'j') {
        //                 var js = target.getDiscardableCards(player, 'j');
        //                 if (js.length) {
        //                     event.dialog.addText('判定区');
        //                     event.dialog.add(js);
        //                     directh = false;
        //                 }
        //             }
        //         }
        //         if (event.dialog.buttons.length == 0) {
        //             event.finish();
        //             return;
        //         }
        //         var cs = target.getCards(event.position);
        //         var select = get.select(event.selectButton);
        //         if (event.forced && select[0] >= cs.length) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons,
        //                 links: cs
        //             }
        //         }
        //         else if (event.forced && directh && select[0] == select[1]) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons.randomGets(select[0]),
        //                 links: []
        //             }
        //             for (var i = 0; i < event.result.buttons.length; i++) {
        //                 event.result.links[i] = event.result.buttons[i].link;
        //             }
        //         }
        //         else {
        //             if (event.isMine()) {
        //                 event.dialog.open();
        //                 game.check();
        //                 game.pause();
        //             }
        //             else if (event.isOnline()) {
        //                 event.send();
        //             }
        //             else {
        //                 event.result = 'ai';
        //             }
        //         }
        //         "step 1"
        //         if (event.result == 'ai') {
        //             game.check();
        //             if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
        //             else ui.click.cancel();
        //         }
        //         event.dialog.close();
        //         "step 2"
        //         event.resume();
        //         if (event.result.bool && event.result.links && !game.online) {
        //             if (event.logSkill) {
        //                 if (typeof event.logSkill == 'string') {
        //                     player.logSkill(event.logSkill);
        //                 }
        //                 else if (Array.isArray(event.logSkill)) {
        //                     player.logSkill.apply(player, event.logSkill);
        //                 }
        //             }
        //             var cards = [];
        //             for (var i = 0; i < event.result.links.length; i++) {
        //                 cards.push(event.result.links[i]);
        //             }
        //             event.result.cards = event.result.links.slice(0);
        //             event.cards = cards;
        //             event.trigger("rewriteDiscardResult");
        //         }
        //         "step 3"
        //         if (event.boolline) {
        //             player.line(target, 'green');
        //         }
        //         if (!event.chooseonly) {
        //             var next = target.discard(event.cards, 'notBySelf');
        //             if (event.delay === false) {
        //                 next.set('delay', false);
        //             }
        //         }
        //     }

        //     lib.element.content.gainPlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         if (event.directresult) {
        //             event.result = {
        //                 buttons: [],
        //                 cards: event.directresult.slice(0),
        //                 links: event.directresult.slice(0),
        //                 targets: [],
        //                 confirm: 'ok',
        //                 bool: true
        //             };
        //             event.cards = event.directresult.slice(0);
        //             event.goto(2);
        //             return;
        //         }
        //         if (!event.dialog) event.dialog = ui.create.dialog('hidden');
        //         else if (!event.isMine) {
        //             event.dialog.style.display = 'none';
        //         }
        //         if (event.prompt == undefined) {
        //             var str = '获得' + get.translation(target);
        //             var range = get.select(event.selectButton);
        //             if (range[0] == range[1]) str += get.cnNumber(range[0]);
        //             else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
        //             else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
        //             str += '张';
        //             if (event.position == 'h' || event.position == undefined) str += '手';
        //             if (event.position == 'e') str += '装备';
        //             str += '牌';
        //             event.prompt = str;
        //         }
        //         if (event.prompt) {
        //             event.dialog.add(event.prompt);
        //         }
        //         if (event.prompt2) {
        //             event.dialog.addText(event.prompt2);
        //         }
        //         var directh = true;
        //         for (var i = 0; i < event.position.length; i++) {
        //             if (event.position[i] == 'h') {
        //                 var hs = target.getGainableCards(player, 'h');
        //                 if (hs.length) {
        //                     event.dialog.addText('手牌区');
        //                     hs.randomSort();
        //                     if (event.visible || target.isUnderControl(true)) {
        //                         event.dialog.add(hs);
        //                         directh = false;
        //                     }
        //                     else {
        //                         if (target.storage.mingzhi) {//明置手牌
        //                             for (var j = 0; j < hs.length; j++) {
        //                                 if (target.storage.mingzhi.contains(hs[j])) {
        //                                     event.dialog.add([hs[j]]);
        //                                 } else {
        //                                     event.dialog.add([[hs[j]], 'blank']);
        //                                 }
        //                             }
        //                             directh = false;
        //                         } else {
        //                             event.dialog.add([hs, 'blank']);
        //                         }
        //                     }
        //                 }
        //             }
        //             else if (event.position[i] == 'e') {
        //                 var es = target.getGainableCards(player, 'e');
        //                 if (es.length) {
        //                     event.dialog.addText('装备区');
        //                     event.dialog.add(es);
        //                     directh = false;
        //                 }
        //             }
        //             else if (event.position[i] == 'j') {
        //                 var js = target.getGainableCards(player, 'j');
        //                 if (js.length) {
        //                     event.dialog.addText('判定区');
        //                     event.dialog.add(js);
        //                     directh = false;
        //                 }
        //             }
        //         }
        //         if (event.dialog.buttons.length == 0) {
        //             event.dialog.close();
        //             event.finish();
        //             return;
        //         }
        //         var cs = target.getCards(event.position);
        //         var select = get.select(event.selectButton);
        //         if (event.forced && select[0] >= cs.length) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons,
        //                 links: cs
        //             }
        //         }
        //         else if (event.forced && directh && select[0] == select[1] && !target.storage.mingzhi) {
        //             event.result = {
        //                 bool: true,
        //                 buttons: event.dialog.buttons.randomGets(select[0]),
        //                 links: []
        //             }
        //             for (var i = 0; i < event.result.buttons.length; i++) {
        //                 event.result.links[i] = event.result.buttons[i].link;
        //             }
        //         }
        //         else {
        //             if (event.isMine()) {
        //                 event.dialog.open();
        //                 game.check();
        //                 game.pause();
        //             }
        //             else if (event.isOnline()) {
        //                 event.send();
        //             }
        //             else {
        //                 event.result = 'ai';
        //             }
        //         }
        //         "step 1"
        //         if (event.result == 'ai') {
        //             game.check();
        //             if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
        //             else ui.click.cancel();
        //         }
        //         event.dialog.close();
        //         "step 2"
        //         event.resume();
        //         if (game.online || !event.result.bool) {
        //             event.finish();
        //         }
        //         "step 3"
        //         if (event.logSkill && event.result.bool && !game.online) {
        //             if (typeof event.logSkill == 'string') {
        //                 player.logSkill(event.logSkill);
        //             }
        //             else if (Array.isArray(event.logSkill)) {
        //                 player.logSkill.apply(player, event.logSkill);
        //             }
        //         }
        //         var cards = [];
        //         for (var i = 0; i < event.result.links.length; i++) {
        //             cards.push(event.result.links[i]);
        //         }
        //         event.result.cards = event.result.links.slice(0);
        //         event.cards = cards;
        //         event.trigger("rewriteGainResult");
        //         "step 4"
        //         if (event.boolline) {
        //             player.line(target, 'green');
        //         }
        //         if (!event.chooseonly) {
        //             var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
        //             if (event.delay === false) {
        //                 next.set('delay', false);
        //             }
        //         }
        //         else target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
        //     }

        //     lib.element.content.loseByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         var hs = [], es = [], js = [];
        //         var hej = player.getCards('hej');
        //         event.stockcards = cards.slice(0);
        //         for (var i = 0; i < cards.length; i++) {
        //             cards[i].style.transform += ' scale(0.2)';
        //             cards[i].classList.remove('glow');
        //             cards[i].recheck();
        //             var info = lib.card[cards[i].name];
        //             if (info.destroy || cards[i]._destroy) {
        //                 cards[i].delete();
        //                 cards[i].destroyed = info.destroy || cards[i]._destroy;
        //             }
        //             else if (event.position) {
        //                 if (_status.discarded) {
        //                     if (event.position == ui.discardPile) {
        //                         _status.discarded.add(cards[i]);
        //                     }
        //                     else {
        //                         _status.discarded.remove(cards[i]);
        //                     }
        //                 }
        //                 cards[i].goto(event.position);
        //             }
        //             else {
        //                 cards[i].delete();
        //             }
        //             // 明置的话就去除标记
        //             if (player.storage.mingzhi && player.storage.mingzhi.contains(cards[i])) {
        //                 if (player.storage.mingzhi.length == 1) {
        //                     delete player.storage.mingzhi;
        //                     player.unmarkSkill('mingzhi');
        //                 } else {
        //                     player.storage.mingzhi.remove(cards[i]);
        //                     player.syncStorage('mingzhi');
        //                 }
        //             }
        //             if (!hej.contains(cards[i])) {
        //                 cards.splice(i--, 1);
        //             }
        //             else if (cards[i].parentNode) {
        //                 if (cards[i].parentNode.classList.contains('equips')) {
        //                     cards[i].original = 'e';
        //                     es.push(cards[i]);
        //                 }
        //                 else if (cards[i].parentNode.classList.contains('judges')) {
        //                     cards[i].original = 'j';
        //                     js.push(cards[i]);
        //                 }
        //                 else if (cards[i].parentNode.classList.contains('handcards')) {
        //                     cards[i].original = 'h';
        //                     hs.push(cards[i]);
        //                 }
        //                 else {
        //                     cards[i].original = null;
        //                 }
        //             }
        //         }
        //         if (player == game.me) ui.updatehl();
        //         ui.updatej(player);
        //         game.broadcast(function (player, cards, num) {
        //             for (var i = 0; i < cards.length; i++) {
        //                 cards[i].classList.remove('glow');
        //                 cards[i].delete();
        //             }
        //             if (player == game.me) {
        //                 ui.updatehl();
        //             }
        //             ui.updatej(player);
        //             _status.cardPileNum = num;
        //         }, player, cards, ui.cardPile.childNodes.length);
        //         game.addVideo('lose', player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js)]);
        //         player.update();
        //         game.addVideo('loseAfter', player);
        //         event.num = 0;
        //         "step 1"
        //         if (num < cards.length) {
        //             if (cards[num].original == 'e') {
        //                 event.loseEquip = true;
        //                 player.removeEquipTrigger(cards[num]);
        //                 var info = get.info(cards[num]);
        //                 if (info.onLose && (!info.filterLose || info.filterLose(cards[num], player))) {
        //                     event.goto(2);
        //                     return;
        //                 }
        //             }
        //             event.num++;
        //             event.redo();
        //         }
        //         else {
        //             if (event.loseEquip) {
        //                 player.addEquipTrigger();
        //             }
        //             event.finish();
        //         }
        //         "step 2"
        //         var info = get.info(cards[num]);
        //         if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
        //             player.popup(cards[num].name);
        //             game.delayx();
        //         }
        //         if (Array.isArray(info.onLose)) {
        //             for (var i = 0; i < info.onLose.length; i++) {
        //                 var next = game.createEvent('lose_' + cards[num].name);
        //                 next.setContent(info.onLose[i]);
        //                 if (info.forceDie) next.forceDie = true;
        //                 next.player = player;
        //                 next.card = cards[num];
        //             }
        //         }
        //         else {
        //             var next = game.createEvent('lose_' + cards[num].name);
        //             next.setContent(info.onLose);
        //             next.player = player;
        //             if (info.forceDie) next.forceDie = true;
        //             next.card = cards[num];
        //         }
        //         event.num++;
        //         event.goto(1);
        //     }

        //     //明置相关操作方法
        //     lib.element.content.mingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
        //         "step 0"
        //         event.result = {};
        //         if (get.itemtype(cards) != 'cards') {
        //             event.result.bool = false;
        //             event.finish();
        //             return;
        //         }
        //         if (!event.str) {
        //             event.str = get.translation(player.name) + '明置了手牌';
        //         }
        //         event.dialog = ui.create.dialog(event.str, cards);
        //         event.dialogid = lib.status.videoId++;
        //         event.dialog.videoId = event.dialogid;

        //         if (event.hiddencards) {
        //             for (var i = 0; i < event.dialog.buttons.length; i++) {
        //                 if (event.hiddencards.contains(event.dialog.buttons[i].link)) {
        //                     event.dialog.buttons[i].className = 'button card';
        //                     event.dialog.buttons[i].innerHTML = '';
        //                 }
        //             }
        //         }
        //         game.broadcast(function (str, cards, cards2, id) {
        //             var dialog = ui.create.dialog(str, cards);
        //             dialog.videoId = id;
        //             if (cards2) {
        //                 for (var i = 0; i < dialog.buttons.length; i++) {
        //                     if (cards2.contains(dialog.buttons[i].link)) {
        //                         dialog.buttons[i].className = 'button card';
        //                         dialog.buttons[i].innerHTML = '';
        //                     }
        //                 }
        //             }
        //         }, event.str, cards, event.hiddencards, event.dialogid);
        //         if (event.hiddencards) {
        //             var cards2 = cards.slice(0);
        //             for (var i = 0; i < event.hiddencards.length; i++) {
        //                 cards2.remove(event.hiddencards[i]);
        //             }
        //             game.log(player, '明置了', cards2);
        //         }
        //         else {
        //             game.log(player, '明置了', cards);
        //         }
        //         game.delayx(2);
        //         game.addVideo('showCards', player, [event.str, get.cardsInfo(cards)]);
        //         "step 1"
        //         game.broadcast('closeDialog', event.dialogid);
        //         event.dialog.close();
        //         if (!player.storage.mingzhi) player.storage.mingzhi = cards;
        //         else player.storage.mingzhi = player.storage.mingzhi.concat(cards);
        //         player.markSkill('mingzhi');
        //         event.result.bool = true;
        //         event.result.cards = cards;
        //     }

        //     lib.element.content.chooseMingzhiCard =  function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
        //         "step 0"
        //         if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
        //             event.finish();
        //             return;
        //         }
        //         // player.chooseCard.applay(player,event._args);
        //         player.choosePlayerCard.applay(player,[
        //             event.selectButton,event.forced,event.prompt,NG.PositionType.Handcard,event.ai
        //         ]);
        //         next.set("filterButton",event.filterButton);
        //         "step 1"
        //         if(result && result.bool && result.cards) {
        //             let str = event.str?event.str:"";
        //             player.mingzhiCard(result.cards,str);
        //         }
        //         //把当前操作结果返回
        //         event.result = result;
        //     }

        //     lib.element.content.removeMingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
        //         event.result = {};
        //         if (get.itemtype(cards) != 'cards') {
        //             event.finish();
        //             event.result.bool = false;
        //             return;
        //         }
        //         if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
        //             event.result.bool = false;
        //             event.finish();
        //             return;
        //         }
        //         game.log(player, '取消明置了', cards);
        //         (<Card[]>player.storage.mingzhi).removeArray(event.cards);
        //         if(player.storage.mingzhi.length) {
        //             player.syncStorage("mingzhi");
        //             player.markSkill('mingzhi');
        //         } else {
        //             delete player.storage.mingzhi;
        //             player.unmarkSkill('mingzhi');
        //         }
        //         event.result.bool = true;
        //         event.result.cards = event.cards;
        //     }

        //     lib.element.content.chooseRemoveMingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
        //         "step 0"
        //         if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
        //             event.finish();
        //             return;
        //         }
        //         var next = player.choosePlayerCard.applay(player,[
        //             event.target,event.selectButton,event.forced,event.prompt,NG.PositionType.Handcard,event.ai
        //         ]);
        //         next.set("filterButton",event.filterButton);
        //         "step 1"
        //         if(result && result.bool && result.links) {
        //             player.removeMingzhiCard(result.links);
        //         }
        //         //把当前操作结果返回
        //         result.cards = result.links;
        //         event._result = result;
        //     }

        //     //player:
        //     //明置卡牌
        //     lib.element.player.mingzhiCard = function (cards, str) {
        //         var next = game.createEvent('mingzhiCard');
        //         next.player = this;
        //         next.str = str;
        //         // 如果cards是str（如果写反了，调换str和cards）
        //         if (typeof cards == 'string') {
        //             str = cards;
        //             cards = next.str;
        //             next.str = str;
        //         }
        //         //提前检测下是否有明牌
        //         if (get.itemtype(cards) == 'card') next.cards = [cards];
        //         else if (get.itemtype(cards) == 'cards') next.cards = cards;
        //         // else _status.event.next.remove(next);
        //         //过滤:
        //         let mingzhiCards = this.getMingzhiCard();
        //         for (let i = next.cards.length-1; i >= 0 ; i--) {
        //             const element = next.cards[i];
        //             if(mingzhiCards.contains(element)) {
        //                 next.cards.splice(i,1);
        //             }
        //         }
        //         next.setContent('mingzhiCard');
        //         if(!Array.isArray(next.cards) || !next.cards.length) {
        //             _status.event.next.remove(next);
        //         }
        //         next._args = Array.from(arguments);
        //         return next;
        //     }

        //     //选择明置的卡牌
        //     lib.element.player.chooseMingzhiCard =  function () {
        //         var next = game.createEvent('chooseMingzhiCard');
        //         next.player = this;
        //         for(var i=0;i<arguments.length;i++){
        //             if(get.itemtype(arguments[i])=='player'){
        //                 next.target=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='number'){
        //                 next.selectButton=[arguments[i],arguments[i]];
        //             }
        //             else if(get.itemtype(arguments[i])=='select'){
        //                 next.selectButton=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='boolean'){
        //                 next.forced=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='function'){
        //                 next.ai=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='string'){
        //                 if(next.prompt) {
        //                     next.str = arguments[i];
        //                 } else {
        //                     next.prompt = arguments[i];
        //                 }
        //             }
        //         }
        //         next.filterButton = function(button:Button,player:Player){
        //             return !lib.filter.filterMingzhiCard(player,button.link);
        //         };
        //         if(next.target==undefined) next.target=this;
        //         if(next.selectButton==undefined) next.selectButton=[1,1];
        //         if(next.ai==undefined) next.ai=function(button){
        //             var val=get.buttonValue(button);
        //             if(get.attitude(_status.event.player,get.owner(button.link))>0) return -val;
        //             return val;
        //         };
        //         next.setContent('chooseMingzhiCard');
        //         next._args = Array.from(arguments);
        //         if(next.player.countCards(NG.PositionType.Handcard,function(card){
        //             return !lib.filter.filterMingzhiCard(next.player,card);
        //         })) {
        //             _status.event.next.remove(next);
        //         }
        //         return next;
        //     }

        //     //移除明置卡牌
        //     lib.element.player.removeMingzhiCard =  function (cards) {
        //         var next = game.createEvent('removeMingzhiCard');
        //         next.player = this;
        //         if (get.itemtype(cards) == 'card') next.cards = [cards];
        //         else if (get.itemtype(cards) == 'cards') next.cards = cards;
        //         // else _status.event.next.remove(next);
        //         //过滤:
        //         let mingzhiCards = this.getMingzhiCard();
        //         for (let i = next.cards.length-1; i >= 0 ; i--) {
        //             const element = next.cards[i];
        //             if(!mingzhiCards.contains(element)) {
        //                 next.cards.splice(i,1);
        //             }
        //         }
        //         next.setContent('removeMingzhiCard');
        //         if(!Array.isArray(next.cards) || !next.cards.length) {
        //             _status.event.next.remove(next);
        //         }
        //         next._args = Array.from(arguments);
        //         return next;
        //     }

        //     //选择移除明置卡牌
        //     lib.element.player.chooseRemoveMingzhiCard =  function () {
        //         var next = game.createEvent('chooseRemoveMingzhiCard');
        //         next.player = this;
        //         for(var i=0;i<arguments.length;i++){
        //             if(get.itemtype(arguments[i])=='player'){
        //                 next.target=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='number'){
        //                 next.selectButton=[arguments[i],arguments[i]];
        //             }
        //             else if(get.itemtype(arguments[i])=='select'){
        //                 next.selectButton=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='boolean'){
        //                 next.forced=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='function'){
        //                 if(next.ai) next.filterButton=arguments[i];
        //                 else next.ai=arguments[i];
        //             }
        //             else if(typeof arguments[i]=='object'&&arguments[i]){
        //                 next.filterButton=function(button:Button,player:Player) {
        //                     return get.filter(arguments[i])(button.link);
        //                 };
        //             }
        //             else if(typeof arguments[i]=='string'){
        //                 next.prompt = arguments[i];
        //             }
        //         }
        //         if(next.filterButton==undefined) next.filterButton=lib.filter.all;
        //         //整合明牌的过滤条件：
        //         next.filterButton = NG.FunctionUtil.getConditon(NG.ConditionType.and,[
        //             next.filterButton,
        //             function(button:Button,player:Player){
        //                 return lib.filter.filterMingzhiCard(player,button.link);
        //             }
        //         ]);
        //         if(next.target==undefined) next.target=this;
        //         if(next.selectButton==undefined) next.selectButton=[1,1];
        //         if(next.ai==undefined) next.ai=function(button){
        //             var val=get.buttonValue(button);
        //             if(get.attitude(_status.event.player,get.owner(button.link))>0) return -val;
        //             return val;
        //         };
        //         next.setContent('chooseRemoveMingzhiCard');
        //         next._args = Array.from(arguments);
        //         if(next.player.countCards(NG.PositionType.Handcard,function(card){
        //             return lib.filter.filterMingzhiCard(next.player,card);
        //         })) {
        //             _status.event.next.remove(next);
        //         }
        //         return next;
        //     }

        //     //获取玩家明置的卡牌
        //     lib.element.player.getMingzhiCard = function() {
        //         let getCards = [];
        //         if (this.storage.mingzhi && this.storage.mingzhi.length) {
        //             getCards = this.storage.mingzhi.concat();
        //         }
        //         return getCards;
        //     }

        //     //设置全局技能：
        //     //尝试使用全局技能来修改使用明置牌方法得content：
        //     // lib.skill._replaceMingzhiContent = {
        //     //     trigger: {
        //     //         player: ["choosePlayerCardBefore", "discardPlayerCardBefore", "gainPlayerCardBefore","shunshouBefore"],//"choosePlayerCardBefore", 
        //     //     },
        //     //     forced: true,
        //     //     priority: 100,
        //     //     popup: false,
        //     //     forceDie: true,
        //     //     firstDo:true,
        //     //     filter: function (event, player) {
        //     //         // console.log("_replaceMingzhiContent--filter===>",event.target,event.target.storage.mingzhi);
        //     //         if (event.target && event.target.storage.mingzhi && event.target.storage.mingzhi.length) {
        //     //             return true;
        //     //         }
        //     //     },
        //     //     content: function () {
        //     //         //预先判定是否有明置牌：
        //     //         //重新设置content:
        //     //         //config.mingzhiBool
        //     //         // console.log("_replaceMingzhiContent===>",event,trigger);
        //     //         // console.log("_replaceMingzhiContent1===>",lib.element.content[trigger.name + 'ByMingzhi']);
        //     //         //只有主机重设了函数，没有通知出去：
        //     //         // game.broadcastAll(function(trigger){
        //     //         //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard","shunshou"];//"choosePlayerCard",
        //     //         //     if (trigger.target.storage.mingzhi) {
        //     //         //         if (eventNames.indexOf(trigger.name) > -1) {
        //     //         //             trigger.setContent(trigger.name + 'ByMingzhi');
        //     //         //             console.log("_replaceMingzhiContent2===>",trigger);
        //     //         //         }
        //     //         //     }
        //     //         // },trigger);
        //     //         //即使广播了，但是还是不能即时收到
        //     //         // if(event.isMine()){
        //     //         //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"];//"choosePlayerCard",
        //     //         //     if (trigger.target.storage.mingzhi) {
        //     //         //         if (eventNames.indexOf(trigger.name) > -1) {
        //     //         //             game.broadcastAll(function(triggerEvt:GameEvent){
        //     //         //                 triggerEvt.setContent(triggerEvt.name + 'ByMingzhi');
        //     //         //             },trigger);
        //     //         //         }
        //     //         //     }
        //     //         // } else if(event.isOnline()){
		// 	// 		// 	event.send();
		// 	// 		// }
        //     //         //注：
        //     //         //非联机的时候，没问题，可以正常看到别人手牌标记“明置”的牌，
        //     //         //联机的情况下，直接修改原来的content就可以，但是用这种动态替换就是不行，
        //     //         //但是奇怪的是，打印了出来的数据，content确实被替换了，就是显示出来明置，
        //     //         //而且，直接在控制台，输出当前事件，查看content，也确实被替换了；
        //     //         //试用事件的方式：
        //     //         player.replaceMingzhiContent(trigger);
        //     //     },
        //     // };
        //     // //改成替换“明置事件”：
        //     // lib.element.player.replaceMingzhiContent = function(trigger:GameEvent) {
        //     //     var next = game.createEvent('replaceMingzhiContent');
        //     //     next.player = this;
        //     //     next._trigger = trigger;
        //     //     next.setContent('replaceMingzhiContent');
        //     //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"];
        //     //     if(!trigger.target || eventNames.indexOf(trigger.name) == -1) {
        //     //         _status.event.next.remove(next);
        //     //     }
        //     //     next._args = Array.from(arguments);
        //     //     return next;
        //     // }
        //     // lib.element.content.replaceMingzhiContent = function(){
        //     //     // game.broadcastAll(function(trigger){
        //     //     //     console.log("replaceMingzhiContent===>",trigger);
        //     //     //     trigger && trigger.setContent(trigger.name + 'ByMingzhi');
        //     //     // },trigger);
        //     //     "step 0"
        //     //     if(event.isMine()){
        //     //         console.log("replaceMingzhiContent===>",trigger);
        //     //         trigger && trigger.setContent(trigger.name + 'ByMingzhi');
        //     //     } else if(event.isOnline()){
        //     //         event.send();
        //     //     }
        //     //     "step 1"
        //     // }

        //     //注：经过多种，测试，目前不知什么方法可以实时替换content,只能退而求其次，修改player方法，在符合条件时使用mingzhi系列的content方法：
        //     let tempchoosePlayerCard = lib.element.player.choosePlayerCard;
        //     lib.element.player.choosePlayerCard = function(...args){
        //         let next:GameEvent = this.choosePlayerCard.source.apply(this,args);
        //         if(this.getMingzhiCard().length) {
        //             next.setContent("choosePlayerCardByMingzhi");
        //         }
        //         return next;
        //     }
        //     lib.element.player.choosePlayerCard.source = tempchoosePlayerCard;
        //     let tempdiscardPlayerCard = lib.element.player.discardPlayerCard;
        //     lib.element.player.discardPlayerCard = function(...args){
        //         let next:GameEvent = this.discardPlayerCard.source.apply(this,args);
        //         if(this.getMingzhiCard().length) {
        //             next.setContent("discardPlayerCardByMingzhi");
        //         }
        //         return next;
        //     }
        //     lib.element.player.discardPlayerCard.source = tempdiscardPlayerCard;
        //     let tempgainPlayerCard = lib.element.player.gainPlayerCard;
        //     lib.element.player.gainPlayerCard = function(...args){
        //         let next:GameEvent = this.gainPlayerCard.source.apply(this,args);
        //         if(this.getMingzhiCard().length) {
        //             next.setContent("gainPlayerCardByMingzhi");
        //         }
        //         return next;
        //     }
        //     lib.element.player.gainPlayerCard.source = tempgainPlayerCard;
        //     // lib.element.player.lose
        //     // lib.element.content.shunshou
        //     // lib.skill.shunshou.content = function(){
        //     //     var position=get.is.single()?'he':'hej';
        //     //     if(target.countGainableCards(player,position)){
        //     //         player.gainPlayerCard(position,target,true);
        //     //     }
        //     // }

        //     //失去明置牌时，去除玩家得该明置牌标记
        //     lib.skill._loseMingzhi = {
        //         trigger: {
        //             global: "loseEnd"
        //         },
        //         forced: true,
        //         priority: 101,
        //         popup: false,
        //         forceDie: true,
        //         filter: function (event, player) {
        //             if (player.storage.mingzhi && player.storage.mingzhi.length) {
        //                 return true;
        //             }
        //         },
        //         content: function () {
        //             event.cards = trigger.cards;
        //             let mingzhiCard = [];
        //             // console.log("_loseMingzhi===>",event.cards,player.storage,event);
        //             // 明置的话就去除标记
        //             for (var i = 0; i < event.cards.length; i++) {
        //                 if (player.storage.mingzhi && player.storage.mingzhi.contains(event.cards[i])) {
        //                     if (player.storage.mingzhi.length == 1) {
        //                         delete player.storage.mingzhi;
        //                         player.unmarkSkill('mingzhi');
        //                     } else {
        //                         player.storage.mingzhi.remove(event.cards[i]);
        //                         player.syncStorage('mingzhi');
        //                     }
        //                     mingzhiCard.push(event.cards[i]);
        //                 }
        //             }
        //             event.oCards = mingzhiCard;
        //             if(event.oCards.length) {
        //                 event.source = trigger.player;
        //                 event.trigger("loseMingzhi");
        //             }
        //         },
        //     };
        //     //明置标记
        //     lib.skill.mingzhi = {
        //         intro: {
        //             content: 'cards',
        //         },
        //     };
        //     lib.translate.mingzhi = '明置';

        //     lib.filter.filterMingzhiCard = function(player,card){
        //         return player.storage.mingzhi && (<Card[]>player.storage.mingzhi).contains(card);
        //     }
        // }

        // /** 逼于无奈,重写一下游戏内的一些方法(暂时先不重写) */
        // function updateSourceFun(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status){
        //     //重写getCards方法，增加获取“s”区域,"o"区域的牌
        //     // lib.element.player.getCards = function(arg1,arg2){
        //     //     if(typeof arg1!='string'){
        //     //         arg1='h';
        //     //     }
        //     //     var cards=[],cards1=[];
        //     //     var i,j;
        //     //     for(i=0;i<arg1.length;i++){
        //     //         if(arg1[i]=='h'){
        //     //             for(j=0;j<this.node.handcards1.childElementCount;j++){
        //     //                 if(!this.node.handcards1.childNodes[j].classList.contains('removing')){
        //     //                     cards.push(this.node.handcards1.childNodes[j]);
        //     //                 }
        //     //             }
        //     //             for(j=0;j<this.node.handcards2.childElementCount;j++){
        //     //                 if(!this.node.handcards2.childNodes[j].classList.contains('removing')){
        //     //                     cards.push(this.node.handcards2.childNodes[j]);
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(arg1[i]=='e'){
        //     //             for(j=0;j<this.node.equips.childElementCount;j++){
        //     //                 if(!this.node.equips.childNodes[j].classList.contains('removing')&&!this.node.equips.childNodes[j].classList.contains('feichu')){
        //     //                     cards.push(this.node.equips.childNodes[j]);
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(arg1[i]=='j'){
        //     //             for(j=0;j<this.node.judges.childElementCount;j++){
        //     //                 if(!this.node.judges.childNodes[j].classList.contains('removing')&&!this.node.judges.childNodes[j].classList.contains('feichu')){
        //     //                     cards.push(this.node.judges.childNodes[j]);
        //     //                     if(this.node.judges.childNodes[j].viewAs&&arguments.length>1){
        //     //                         this.node.judges.childNodes[j].tempJudge=this.node.judges.childNodes[j].name;
        //     //                         this.node.judges.childNodes[j].name=this.node.judges.childNodes[j].viewAs;
        //     //                         cards1.push(this.node.judges.childNodes[j]);
        //     //                     }
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(arg1[i]=='s'){
        //     //             for(j=0;j<this.node.special.childElementCount;j++){
        //     //                 if(!this.node.special.childNodes[j].classList.contains('removing')){
        //     //                     //后续必须使用条件过滤开来
        //     //                     cards.push(this.node.special.childNodes[j]);
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(arg1[i]=='o'){
        //     //             for(j=0;j<this.node.ordering.childElementCount;j++){
        //     //                 if(!this.node.ordering.childNodes[j].classList.contains('removing')){
        //     //                     //后续必须使用条件过滤开来
        //     //                     cards.push(this.node.ordering.childNodes[j]);
        //     //                 }
        //     //             }
        //     //         }
        //     //     }
        //     //     if(arguments.length==1){
        //     //         return cards;
        //     //     }
        //     //     if(arg2){
        //     //         if(typeof arg2=='string'){
        //     //             for(i=0;i<cards.length;i++){
        //     //                 if(get.name(cards[i])!=arg2){
        //     //                     cards.splice(i,1);i--;
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(typeof arg2=='object'){
        //     //             for(i=0;i<cards.length;i++){
        //     //                 for(j in arg2){
        //     //                     var value;
        //     //                     if(j=='type'||j=='subtype'||j=='color'||j=='suit'||j=='number'){
        //     //                         value=get[j](cards[i]);
        //     //                     }
        //     //                     else{
        //     //                         value=cards[i][j];
        //     //                     }
        //     //                     if((typeof arg2[j]=='string'&&value!=arg2[j])||
        //     //                         (Array.isArray(arg2[j])&&!arg2[j].contains(value))){
        //     //                         cards.splice(i--,1);break;
        //     //                     }
        //     //                 }
        //     //             }
        //     //         }
        //     //         else if(typeof arg2=='function'){
        //     //             for(i=0;i<cards.length;i++){
        //     //                 if(!arg2(cards[i],this)){
        //     //                     cards.splice(i--,1);
        //     //                 }
        //     //             }
        //     //         }
        //     //     }
        //     //     for(i=0;i<cards1.length;i++){
        //     //         if(cards1[i].tempJudge){
        //     //             cards1[i].name=cards1[i].tempJudge;
        //     //             delete cards1[i].tempJudge;
        //     //         }
        //     //     }
        //     //     return cards;
        //     // }

        //     //修改一下更新标记的方式
        //     //todo:因为使用updateMark,更新标记时，只有没标记时才会使用markSkill，有标记更新没有进行同步，
        //     //所以，采用更通用的同步刷新标记的方法markSkill，不过标记更新是个挺大的系统，不知会有什么影响，期待后续更新；
        //     lib.element.player.addMark = function(i,num,log){
        //         if(typeof num!='number'||!num) num=1;
        //         if(typeof this.storage[i]!='number') this.storage[i]=0;
        //         this.storage[i]+=num;
        //         if(log!==false){
        //             var str=false;
        //             var info=get.info(i);
        //             if(info&&info.intro&&(info.intro.name||info.intro.name2)) str=info.intro.name2||info.intro.name;
        //             else str=lib.translate[i];
        //             if(str) game.log(this,'获得了',get.cnNumber(num),'个','#g【'+str+'】');
        //         }
        //         this.syncStorage(i);
        //         // this.updateMark(i);
        //         this.markSkill(i);
        //     };

        //     //重构“重铸”流程
        //     lib.skill._chongzhu.filter = function(event,player){
        //         return player.hasCard(function(card){
        //             return lib.skill._chongzhu.filterCard(card,player,event);//入参给过滤使用
        //         });
        //     }
        //     lib.skill._chongzhu.filterCard = function(card,player,event){
        //         //入参有event,给过滤使用
        //         event = event?event:_status.event;
        //         player = player?player:event.player;
                
        //         var skills=player.getSkills(true).concat(lib.skill.global);
        //         game.expandSkills(skills);
        //         for(var i=0;i<skills.length;i++){
        //             var ifo=get.info(skills[i]);
        //             //有视为“teisuo”，或者有配置“chongzhu”
        //             if(ifo.viewAs&&ifo.viewAs.name==NG.CardNameConst.tiesuo){
        //                 if(!ifo.viewAsFilter||ifo.viewAsFilter(player)){
        //                     if(ifo.filterCard&&get.filter(ifo.filterCard)(card,player)) {
        //                         // return true;
        //                         if(get.objtype(ifo.viewAs) != NG.ObjType.Object) {
        //                             card = {name:ifo.viewAs};
        //                         } else {
        //                             card = ifo.viewAs;
        //                         }
        //                         break;
        //                     }
        //                 }
        //             }
        //             else{
        //                 var chongzhu=get.info(skills[i]).chongzhu;
        //                 if(typeof chongzhu=='function'&&chongzhu(card,event,player)){
        //                     return true;
        //                 } else if(chongzhu === true) {
        //                     return chongzhu;
        //                 }
        //             }
        //         }
        //         var info=get.info(card);
        //         if(typeof info.chongzhu=='function'){
        //             return info.chongzhu(event,player);
        //         }
        //         return info.chongzhu;
        //     }

        //     //扩展技能翻译的显示：
        //     //todo：暂时不需要，可使用prompt2来自定义二级显示；
        //     // let temptranslation = get.translation;
		// 	// get.translation=function(...args){
        //     //     let result:string = get.translation.source.apply(this,args);
        //     //     //扩展特殊的标记翻译
        //     //     if(result.indexOf("#zhu")>-1) {
        //     //         result = result.replace("#zhu",`<span class=bluetext>【${get.translation(game.zhu)}】</span>`);
        //     //     }
        //     //     return result;
        //     // }
        //     // get.translation.source = temptranslation;

        //     // let tempskillInfoTranslation = get.skillInfoTranslation;
		// 	// get.skillInfoTranslation=function(...args){
        //     //     let result:string = get.skillInfoTranslation.source.apply(this,args);
        //     //     result = get.translation(result);
        //     //     return result;
        //     // }
        //     // get.skillInfoTranslation.source = tempskillInfoTranslation;
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

