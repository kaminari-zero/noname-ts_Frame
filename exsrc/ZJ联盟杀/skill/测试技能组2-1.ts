module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-1", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //命运  【改判技】  [自]可打出一张牌替换判定牌。
                let skill1: ExSkillData = {
                    name:"命运",
                    description:NG.Utils.translateDescTxt("【改判技】[自]可打出一张牌替换判定牌。"),
                    trigger:{
                        global:NG.PhaseTrigger.judge
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        let rparams:ReplaceJudgeParams = {
                            chooseType:NG.ReplaceJudgeType.exchange,
                            position:NG.PositionType.Use,
                        };
                        player.replaceJudge(rparams);
                    },
                    ai:{
                        rejudge:true,
                    },
                };

                //银夜  【流血技】  [自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌。
                //分成两个技能较好
                let skill2: ExSkillData = {
                    name:"银夜",
                    description:NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌。"),
                    group:["zj_yinye_1","zj_yinye_2"],
                    subSkill:{
                        1:{
                            description:NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌"),
                            trigger:{
                                //在有触发的情况下，才会发出damge时机，该时机，已经处理了扣血
                                player:NG.StateTrigger.damage
                            },
                            priority:10,
                            filter:function(event,player){
                                return get.itemtype(event.cards)==NG.ItemType.CARDS&&get.position(event.cards[0],true)==NG.PositionType.Ordering;
                            },
                            //奸雄的参考条件：
                            //get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o';
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.gain(trigger.cards,NG.AniNmaeConst.gain2);
                            }
                        },
                        2:{
                            description:NG.Utils.translateDescTxt("[自]可获得伤害来源的一张牌"),
                            trigger:{
                                player:NG.StateTrigger.damage
                            },
                            filter:function(event,player){
                                return event.source && event.num > 0 && event.source.countGainableCards(player,NG.PositionType.Use)>0;
                            },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.gainPlayerCard(trigger.source,trigger.num,NG.StringTypeConst.visibleMove);
                            }
                        },
                    },
                    ai:{
                        maixie:true,
                        maixie_hp:true,
                    },
                };

                //银夜  【流血技】  [自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌。
                let skill22: ExSkillData = {
                    name:"银夜",
                    description:NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌，[自]可获得伤害来源的一张牌,[自][摸]1。"),
                    group:["zj_yinye_1","zj_yinye_2"],
                    subSkill:{
                        1:{
                            description:NG.Utils.translateDescTxt("[自]立刻获得对[自]造成伤害的牌"),
                            trigger:{
                                //在有触发的情况下，才会发出damge时机，该时机，已经处理了扣血
                                player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                            },
                            priority:10,
                            filter:function(event,player){
                                return get.itemtype(event.cards)==NG.ItemType.CARDS&&get.position(event.cards[0],true)==NG.PositionType.Ordering;
                            },
                            //奸雄的参考条件：
                            //get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o';
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.gain(trigger.cards,NG.AniNmaeConst.gain2);
                            }
                        },
                        2:{
                            description:NG.Utils.translateDescTxt("[自]可获得伤害来源的一张牌,[自][摸]1"),
                            trigger:{
                                player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                            },
                            filter:function(event,player){
                                return event.source && event.num > 0 && event.source.countGainableCards(player,NG.PositionType.Use)>0;
                            },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                "step 0"
                                player.gainPlayerCard(trigger.source,trigger.num,NG.StringTypeConst.visibleMove);
                                "step 1"
                                player.draw();
                            }
                        },
                    },
                    ai:{
                        maixie:true,
                        maixie_hp:true,
                    },
                };


                let output = {
                    zj_mingyun:skill1,
                    zj_yinye:skill22
                }

                return output;
            });
    })();
}