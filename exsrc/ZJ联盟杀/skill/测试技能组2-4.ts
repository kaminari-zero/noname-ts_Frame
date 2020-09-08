module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-4", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //演员  【主动技】  [自]<结束>摸X+2张牌，[自][翻面]（X=势力数）。
                //新版：（X=势力数） 改为 （X=现存属性数）
                let skill1: ExSkillData = {
                    name:"演员",
                    description:NG.Utils.translateDescTxt("【主动技】[自]<结>，[自][摸]X+2，[自][翻]（X=现存属性数）。 "),
                    trigger:{
                        player:NG.PhaseTrigger.phaseJieshuBegin,
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        // event.num = get.getZJShaShiliCount();//旧版：势力数
                        event.num = game.countGroup();//新版：现存属性数【属性，即为原三国杀的势力】
                        player.draw(event.num + 2);
                        player.turnOver(!player.isTurnedOver());
                    },
                    
                };

                //影帝  【流血技】  [自][反面]，[自][翻面]。
                let skill2: ExSkillData = {
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        return player.isTurnedOver();
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        player.turnOver(false);
                    },
                };

                //新版：影帝 【流血技】[自][翻]。
                let skill22: ExSkillData = {
                    name:"影帝",
                    description:NG.Utils.translateDescTxt("【流血技】[自][翻]。"),
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    // filter:function(event,player){
                    //     return player.isTurnedOver();
                    // },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        player.turnOver(!player.isTurnedOver());
                    },
                };

                //基情  【主动技】  [任一](男)<准备>，若其[受伤]，[自]弃置一张基本牌，其血量+1。
                let skill3: ExSkillData = {
                    name:"基情",
                    description:NG.Utils.translateDescTxt("【主动技】[任](男)<准>，若其[受伤]，[自]弃置一张基本牌，其血量+1。"),
                    trigger:{
                        global:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    filter:function(event,player){
                        return event.player.sex == NG.Sex.MALE && event.player.isDamaged() ;
                    },
                    // selectCard:1,
                    // filterCard:{type:NG.CardType.Basic},
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        player.chooseToDiscard(1,{type:NG.CardType.Basic},"弃置一张基本牌");
                        "step 1"
                        if(result.bool && result.cards.length) {
                            trigger.player.recover();
                        }
                    },
                };

                //老野  【受伤技】  [自][判定]红桃（[自]血量+1）。
                let skill4: ExSkillData = {
                    name:"老野",
                    description:NG.Utils.translateDescTxt("【受伤技】[自][判]，[结]红桃（[自]血量+1）。"),
                    trigger:{
                        player:NG.StateTrigger.changeHp,
                    },
                    filter:function(event,player){
                        // debugger;
                        return player.isDamaged() && event.num<0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        player.judge(function(jResult: JudgeResultData){
                            return jResult.suit == NG.CardColor.Heart;
                        });
                        "step 1"
                        if(result.bool) {
                            player.recover();
                        }
                    },
                };

                //新版：老野 【受伤技】[自][判]，[结]红色牌（[任]血量+1）；黑色牌（[任][摸]1）。
                let skill42: ExSkillData = {
                    name:"老野",
                    description:NG.Utils.translateDescTxt("【受伤技】[自][判]，[结]红色牌（[任]血量+1）；黑色牌（[任][摸]1）。"),
                    trigger:{
                        player:NG.StateTrigger.changeHp,
                    },
                    filter:function(event,player){
                        return event.num<0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        player.judge(function(jResult: JudgeResultData){
                            return true;
                        });
                        "step 1"
                        event.judgeResult = result;
                        if(result.color == NG.CardColor.Red) {
                            player.chooseTarget(function(card:Card,player:Player,target:Target){
                                return target.isDamaged();
                            },true,"任一角色血量+1");
                        } else {
                            player.chooseTarget(true,"任一角色摸一张牌");
                        }
                        "step 2"
                        if(result.bool) {
                            let target = (<BaseCommonResultData><unknown>result).targets[0];
                            if(event.judgeResult.color == NG.CardColor.Red) {
                                target.recover();
                            } else {
                                target.draw();
                            }
                        }
                    },
                };

                //触手   【主动技】  [自]将任一梅花牌当《连环锁术》使用或重铸。
                let skill5: ExSkillData = {
                    name:"触手",
                    description:NG.Utils.translateDescTxt("【主动技】[自]将任一梅花牌当《连环锁术》使用或重铸。"),
                    enable:[NG.EnableTrigger.chooseToUse,NG.EnableTrigger.phaseUse],
                    // filter:function(event,player){
                    //     return player.countCards(NG.PositionType.Handcard,{suit:NG.CardColor.Club})>0;
                    // },
                    selectCard:1,
                    filterCard:function(card,player){
                        return get.suit(card,player) == NG.CardColor.Club;
                    },
                    viewAs:{name:NG.CardNameConst.tiesuo,suit:NG.CardColor.Club},
                    viewAsFilter:function(player){
                        return player.countCards(NG.PositionType.Use,{suit:NG.CardColor.Club})>0;
                    },
                }

                //触摸   【被动技】  [任一]被横置/重置时，[自]弃置其一张牌。
                //新版：触摸  【被动技】[任]被横置/重置时，[自]弃置其[手]一张。
                let skill6: ExSkillData = {
                    name:"触摸",
                    description:NG.Utils.translateDescTxt("【被动技】[任]被横置/重置时，[自]弃置其[手]一张。"),
                    trigger:{
                        //如果是收到伤害接触连锁，暂时还没解决
                        global:NG.StateTrigger.link+NG.TriggerEnum.Begin,
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        player.discardPlayerCard(trigger.player,NG.PositionType.Handcard);
                    },
                }

                //基绊  【阶段技】  [自]指定[其他](男)，其选择一项：(1)其除去1点血量；(2)交给[自]一张装备牌，其摸1张牌。 
                let skill7: ExSkillData = {
                    name:"基绊",
                    description:NG.Utils.translateDescTxt("【阶段技】[自]指定[他](男)，其选择一项：(1)其除去1点血量；(2)其交给[自]一张装备牌，其[摸]1。"),
                    enable: NG.EnableTrigger.phaseUse,
                    usable: 1,
                    selectTarget: 1,
                    filterTarget: function (card, player, target) {
                        return player != target && target.sex == NG.Sex.MALE;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        let controlList = [];
                        event.target = event.targets[0];
                        controlList.push(`自己除去1点血量`);
                        if(event.target.countCards(NG.PositionType.Use,{type:NG.CardType.Equip})) {
                            controlList.push(`交给【${get.translation(player)}】一张装备牌，其自己摸1张牌`);
                        }
                        event.target.chooseControlList(controlList, true);
                        "step 1"
                        event.num = result.index;
                        if(result.index === 0) {
                            event.target.loseHp();
                            event.finish();
                        } else if(result.index === 1) {
                            event.target.chooseCard(NG.PositionType.Use,{type:NG.CardType.Equip},true),result.links[result.index];
                        } else {
                            event.finish();
                        }
                        "step 2"
                        if(event.num == 1 && result.bool && result.cards.length) {
                            event.target.give(result.cards,player);
                            event.target.draw();
                        }
                    },
                }

                //基力  【主动技】  [自]将[自]任一装备牌当《闪》使用或打出。
                let skill8: ExSkillData = {
                    name:"基力",
                    description:NG.Utils.translateDescTxt("【主动技】[自]将[自]一张装备牌当《闪》使用/打出。"),
                    enable:[NG.EnableTrigger.chooseToUse,NG.EnableTrigger.chooseToRespond],
                    selectCard:1,
                    position:NG.PositionType.Use,
                    filterCard:function(card,player){
                        return get.type(card) == NG.CardType.Equip;
                    },
                    viewAs:{name:NG.CardNameConst.shan},
                    viewAsFilter:function(player){
                        return player.countCards(NG.PositionType.Use,{type:NG.CardType.Equip})>0;
                    },
                    ai:{
                        respondShan:true,
                    }
                }


                let output = {
                    zj_yanyuan:skill1,
                    zj_yingdi:skill22,

                    zj_jiqing:skill3,
                    zj_laoye:skill42,

                    zj_chushou:skill5,
                    zj_chumo:skill6,

                    zj_jiban:skill7,
                    zj_jili:skill8,
                }

                return output;
            });
    })();
}