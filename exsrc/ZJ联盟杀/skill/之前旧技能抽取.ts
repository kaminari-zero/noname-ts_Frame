module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "之前旧技能抽取", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {


                //黄华富旧技能
                let zj_ganglie = {
                    name:"肛裂",
                    // description:"当你受到1点伤害后，你可以进行一次判定，若判定结果为黑色牌，你选择一项：(1)令其弃置两张手牌；(2)你对其造成的1点伤害。",
                    description:NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌（[自]令[他]选一项：1.其弃置两张[手]；2.其受到1点伤害)。 "),
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    filter: function (event: Trigger, player: Player){
                        //必须要有伤害来源，必须产生大于1点的伤害
                        return event.source && event.num>0;
                    },
                    logTarget:"source",//骚后仔细研究该作用
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                        "step 0"
                        //第一步，初始化好需要使用的变量
                        event.num = trigger.num; //如果是技能执行过程中需要某些临时变量，在执行完就不用了，可以直接设置在content中的event上
                        "step 1"
                        //当你受到1点伤害后，你可以进行一次判定
                        player.judge((jResult:JudgeResultData)=>{
                            // window.gameTestLog("肛裂判定结果",jResult);
                            //判定结果为黑色牌通过
                            return jResult.color == NG.CardColor.Black?1:0;
                        });
                        "step 2"
                        // let jResult = <JudgeResultData>result;
                        //若判定结果为黑色牌，你选择一项：(1)令其弃置两张手牌；(2)你对其造成的1点伤害。
                        if(result.bool){
                            player.chooseControlList(
                                [
                                    "(1)令其弃置两张手牌",
                                    "(2)你对其造成的1点伤害"
                                ],
                                true
                            );
                        } else {
                            event.goto(4);
                        }
                        "step 3"
                        //触发所选效果
                        if(result.index == 0){
                            trigger.source.chooseToDiscard(2,NG.PositionType.Handcard);
                        } else {
                            trigger.source.damage(1);
                        }
                        "step 4"
                        event.num--;
                        if(event.num>0) {
                            //询问继续肛裂不
                            player.chooseBool(get.prompt2("zj_ganglie"));
                        } else {
                            event.finish();
                        }
                        "step 5"
                        if(result.bool){
                            event.goto(1);//继续
                        }
                    }
                };
                //新版：肛裂  【流血技】[自][判]，[结]黑色牌（其受到1点伤害)；红色牌（其弃置[手]两张）。
                let zj_ganglie2 = {
                    name:"肛裂",
                    description:NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌（其受到1点伤害)；红色牌（其弃置[手]两张）。"),
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    filter: function (event: Trigger, player: Player){
                        return event.source && event.num>0;
                    },
                    // logTarget:"source",
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData){
                        "step 0"
                        event.num = trigger.num;
                        "step 1"
                        player.judge((jResult:JudgeResultData)=>{
                            return 1;
                        });
                        "step 2"
                        if(result.bool){
                            if(result.color == NG.CardColor.Black) {
                                trigger.source.damage(1);
                            } else {
                                trigger.source.chooseToDiscard(2,NG.PositionType.Handcard);
                            }
                        } else {
                            event.goto(3);
                        }
                        "step 3"
                        event.num--;
                        if(event.num>0) {
                            //询问继续肛裂不
                            player.chooseBool(get.prompt2("zj_ganglie"));
                        } else {
                            event.finish();
                        }
                        "step 4"
                        if(result.bool){
                            event.goto(1);//继续
                        }
                    }
                };
                //华富  【主动技】 [自]弃置X张[手]令[手]数为≤10（X≥1），[自]须跳过<弃>，[自][翻]。
                // let zj_huafu = {
                //     name:"华富",
                //     description:NG.Utils.translateDescTxt("【主动技】[自]弃置X张[手]令[手]数为≤10（X≥1），[自]须跳过<弃>，[自][翻]。"),
                //     enable:NG.EnableTrigger.phaseUse,
                //     // subSkill:{
                //     //     famian: { //当你的角色牌被翻面时，你可以摸等同于你已损失的血量的牌(至少1张)。
                //     //     }
                //     // }
                //     filter: function (event: Trigger, player: Player){
                //         return player.hasCard(lib.filter.all,NG.PositionType.Shoupai);
                //     },
                //     content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                //         "step 0"
                //         //计算手牌数：
                //         let shoupaiCount = player.countCards(NG.PositionType.Handcard);
                //         let discardCount = 1;
                //         if(shoupaiCount>=10){
                //             discardCount = shoupaiCount-10;
                //         }
                        
                //     },
                //     //通过主动技跳过弃牌阶段的解决方案：
                //     //1.在使用技能时，增加一个标记在玩家身上，在弃牌阶段之前触发一个子技能，根据标记跳过trigger.cancel();
                //     //2.动态添加一个跳过阶段的技能
                // };

                //杨爵波旧技能
                let zj_laobo={
                    name:"捞波",
                    description:"阶段技，你可以将任意数量的手牌交给任意角色(至少1张)，你摸X张牌且血量+1，若其获得你给出的牌张数不小于2，你可以视为对你使用一张【血】或【魔】(X为你已损失的血量)。",
                    enable: NG.EnableTrigger.phaseUse,
                    usable:1,
                    // selectCard:[1,Infinity],
                    // discard:false,
                    // prepare:NG.PrepareConst.Give,
                    // filterTarget: (card: Card, player: Player, target: Target)=>{
                    //     return player!=target; //目标不能是自己
                    // },
                    precontent: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData){
                        //初始化标记（扩展一个全局性质的变量）
                        player.storage.zj_laobo_targets = [];//对哪些目标使用
                        player.storage.zj_laobo_num = 0;//总共给出的牌数
                    },
                    content: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData){
                        let storageTargets:Player[] = player.storage.zj_laobo_targets;
                        let storageNum:number = player.storage.zj_laobo_num;
                        let haveHandCard = player.countCards(NG.PositionType.Shoupai) > 0;
                        'step 0'
                        if (NG.ObjectUtil.isUndefined(storageTargets) || NG.ObjectUtil.isUndefined(storageNum)){
                            console.error("不明原因，zj_laobo的标记变量没有生成！");
                            event.finish();
                            return;
                        }
                        'step 1'
                        //将任意数量的手牌交给任意角色(至少1张)
                        //选择角色和交给的牌
                        if(haveHandCard){
                            player.chooseCardTarget({
                                filterCard:true,
                                selectCard:[1,Infinity],
                                filterTarget: (card: Card, player: Player, target: Target) => {
                                    return player != target; //目标不能是自己
                                },
                                prompt:"选择要交给牌与玩家",
                                forced:true
                            });
                        } else {
                            // event.finish();
                            event.goto(4);
                        }
                        'step 2'
                        if(result.bool){
                            storageTargets.push(target);
                            // target.gain(cards,player);
                            result.targets[0].gain(result.cards, player,"gain");
                            player.storage.zj_laobo_num += result.cards.length;
                        }
                        'step 3'
                        if (haveHandCard){ //为了能及时刷新手牌数另开一个步骤
                            // event.goto(1);
                            // console.log("当前的skill:",skill)
                            player.chooseBool(`是否继续使用【${lib.translate["zj_laobo"]}】？`);
                        }
                        'step 4'
                        if(result.bool) {
                            event.goto(1);
                        }
                        'step 5'
                        //你摸X张牌且血量+1(X为你已损失的血量)
                        let loseHp = player.maxHp - player.hp;
                        player.draw(loseHp);
                        player.recover(1);
                        //若其获得你给出的牌张数不小于2
                        if(storageNum >=2){
                            let list = [];
                            if(player.canUse({name:"tao"},player)){ //是否能用血
                                list.push("tao");
                            }
                            if(player.canUse({name:"jiu"},player)){ //是否能用魔
                                list.push("jiu");
                            }
                            if(list.length){
                                player.chooseButton([
                                    "是否视为视为对你使用一张【血】或【魔】？",
                                    [list,NG.ButtonType.VCARD]
                                ]);
                            } else {
                                event.finish();
                            }
                        } 
                        'step 6'
                        //你可以视为对你使用一张【血】或【魔】
                        if (result && result.bool && result.links[0]) {
                            let vard = { name: result.links[0][2], nature: result.links[0][3] };
                            player.chooseUseTarget(vard, true);
                        }
                    },
                    contentAfter: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                        //移除标记
                        delete player.storage.zj_laobo_targets;
                        delete player.storage.zj_laobo_num;
                    }
                };

                //杨爵波 新技能
                let new_zj_laobo={
                    name:"捞波",
                    description:NG.Utils.translateDescTxt("【阶段技】 [自]将≥1张[手]交给[他]，[自][摸]X (X=[自]失血值)，其获得给出的牌张数≥2，[自]视为对[任]使用一张《血》。"),
                    enable: NG.EnableTrigger.phaseUse,
                    usable:1,
                    // selectCard:[1,Infinity],
                    // discard:false,
                    // prepare:NG.PrepareConst.Give,
                    // filterTarget: (card: Card, player: Player, target: Target)=>{
                    //     return player!=target; //目标不能是自己
                    // },
                    precontent: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData){
                        //初始化标记（扩展一个全局性质的变量）
                        player.storage.zj_laobo_targets = [];//对哪些目标使用
                        player.storage.zj_laobo_num = 0;//总共给出的牌数
                    },
                    content: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData){
                        let storageTargets:Player[] = player.storage.zj_laobo_targets;
                        let storageNum:number = player.storage.zj_laobo_num;
                        let haveHandCard = player.countCards(NG.PositionType.Shoupai) > 0;
                        'step 0'
                        if (NG.ObjectUtil.isUndefined(storageTargets) || NG.ObjectUtil.isUndefined(storageNum)){
                            console.error("不明原因，zj_laobo的标记变量没有生成！");
                            event.finish();
                            return;
                        }
                        'step 1'
                        //将任意数量的手牌交给任意角色(至少1张)
                        //选择角色和交给的牌
                        if(haveHandCard){
                            player.chooseCardTarget({
                                filterCard:true,
                                selectCard:[1,Infinity],
                                filterTarget: (card: Card, player: Player, target: Target) => {
                                    return player != target; //目标不能是自己
                                },
                                prompt:"选择要交给牌与玩家",
                                forced:true
                            });
                        } else {
                            // event.finish();
                            event.goto(4);
                        }
                        'step 2'
                        if(result.bool){
                            storageTargets.push(target);
                            // target.gain(cards,player);
                            result.targets[0].gain(result.cards, player,"gain");
                            player.storage.zj_laobo_num += result.cards.length;
                        }
                        'step 3'
                        if (haveHandCard){ //为了能及时刷新手牌数另开一个步骤
                            // event.goto(1);
                            // console.log("当前的skill:",skill)
                            player.chooseBool(`是否继续使用【${lib.translate["zj_laobo"]}】？`);
                        } else {
                            result.bool = false;
                        }
                        'step 4'
                        if(result.bool) {
                            event.goto(1);
                        }
                        'step 5'
                        //你摸X张牌(X为你已损失的血量)
                        let loseHp = player.maxHp - player.hp;
                        player.draw(loseHp);
                        // player.recover(1);
                        //若其获得你给出的牌张数不小于2
                        if(storageNum >=2){
                            player.chooseTarget(`可以视为对任一玩家使用一张【${get.translation(NG.CardNameConst.tao)}】`,function(card: Card, player: Player, target: Target){
                                return target.isDamaged();//player.canUse({name:NG.CardNameConst.tao},target) && 
                            });
                        } else {
                            event.finish();
                        }
                        'step 6'
                        if (result && result.bool && result.targets) {
                            let vcard = { name: NG.CardNameConst.tao };
                            player.useCard(vcard,result.targets,false);
                        }
                    },
                    contentAfter: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                        //移除标记
                        delete player.storage.zj_laobo_targets;
                        delete player.storage.zj_laobo_num;
                    }
                };

                //郑博森旧技能
                //博森【被动技】 [自]除去1点血量后，[任][摸]3；[自]死亡时，[自]所有[区]交给[他]，然后令其血量+1。
                let zj_bosen:ExSkillData={
                    name: "博森",
                    description:NG.Utils.translateDescTxt("【被动技】[自]除去1点血量后，[任][摸]3；[自]死亡时，[自]所有[区]交给[他]，然后令其血量+1。"),
                    group: ["zj_bosen_1", "zj_bosen_2"],
                    subSkill:{
                        1:{
                            trigger:{
                                player:[
                                    NG.StateTrigger.loseHp + NG.TriggerEnum.End,
                                    // NG.StateTrigger.damage + NG.TriggerEnum.End,
                                ]
                            },
                            filter: function (event: Trigger, player: Player) {
                                // window.gameTestLog("filter触发",event);
                                return event.num>0;
                            },
                            //设置强制触发的话，不受条件影响
                            forced:true,
                            content: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData){
                                "step 0"
                                player.storage.zj_bosen_1_flag = trigger.num;
                                "step 1"
                                //不能同时选择同一个玩家
                                // player.chooseTarget(
                                //     trigger.num,
                                //     `请选择${trigger.num}位玩家`
                                // );
                                // player.chooseTarget(lib.translate.zj_bosen_zj_bosen_1_info);
                                player.chooseTarget(lib.skill.zj_bosen_1.description);
                                "step 2"
                                // window.gameTestLog("当前还剩次数", player.storage.zj_bosen_1_flag);
                                //指定失去得体力数得玩家抽牌
                                if(result.bool && result.targets.length>0){
                                    result.targets[0].draw(3);
                                }
                                player.storage.zj_bosen_1_flag--;
                                if (player.storage.zj_bosen_1_flag > 0) {
                                    event.goto(1);
                                }
                                // window.gameTestLog("zj_bosen_zj_bosen_1触发时：", _status.event);
                                "step 3"
                                delete player.storage.zj_bosen_1_flag;
                            },
                            contentAfter:function(player){
                                delete player.storage.zj_bosen_1_flag;
                            },
                            description:"当你除去1点血量后，你令任一角色摸三张牌"
                        },
                        2:{
                            trigger:{
                                player:NG.StateTrigger.die+NG.TriggerEnum.Begin
                            },
                            content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                                "step 0"
                                player.chooseTarget(
                                    lib.translate.zj_bosen_2_info,
                                    function(card,player,target){
                                        return player != target;
                                    },
                                );
                                "step 1"
                                if(result.bool && result.targets.length>0){
                                    //获取玩家所有的牌：
                                    result.targets[0].gain(player.getCards(NG.PositionType.All),player,NG.AniNmaeConst.gain2);
                                    // result.targets[0].gainMaxHp(1);
                                    result.targets[0].recover();
                                }
                            },
                            description:"当你死亡时，你可以将你的所有牌交给任一其他角色，然后令其血量+1",
                        }
                    }
                };


                let output = {
                    zj_laobo:new_zj_laobo,
                    zj_bosen:zj_bosen,

                    zj_ganglie:zj_ganglie2,
                }

                return output;
            });
    })();
}