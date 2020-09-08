module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-3", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //龙徒  【回合技】  [自]可将一张红桃牌当《血》使用。 
                let skill1: ExSkillData = {
                    name:"龙徒",
                    description:NG.Utils.translateDescTxt("【回合技】[自]可将一张红桃牌当《血》使用。"),
                    enable:NG.EnableTrigger.chooseToUse,
                    usable:1,
                    selectCard:1,
                    filterCard:function(card,player){
                        return get.suit(card,player) == NG.CardColor.Heart;
                    },
                    viewAs:{name:NG.CardNameConst.tao},
                    viewAsFilter:function(player){
                        return player.countCards(NG.PositionType.Use,{suit:NG.CardColor.Heart})>0;
                    },
                };

                //不灭  【被动技】  [自]血量为0时，不进入濒死状态，[判定]红桃，则获得判定牌，血量+1；否则，血槽-1并回复血量至血槽值。
                let skill2: ExSkillData = {
                    name:"不灭",
                    description:NG.Utils.translateDescTxt("【被动技】[自]血量为0时，不进入濒死状态，[自][判]，[结]红桃（获得判定牌，血量+1；否则，血槽-1并回复血量至血槽值）。"),
                    trigger:{
                        player:NG.StateTrigger.dying + NG.TriggerEnum.Begin,
                    },
                    filter:function(event,player){
                        return player.hp<=0 && player.maxHp>0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        trigger.cancel(true);
                        player.judge(function(jResult: JudgeResultData){
                            return jResult.color == NG.CardColor.Heart;
                        });
                        "step 1"
                        if(result.bool) {
                            player.gain(result.card);
                            player.recover();
                        } else {
                            player.loseMaxHp();
                            player.recover(player.maxHp);
                        }
                    },
                    check:lib.filter.all,
                };
                //新版：把之前的龙兔加在不灭度，删除龙兔
                //不灭 【被动技】[自]方块牌均视为红桃牌；[自]血量为0时，不进入濒死状态，[自][判]，[结]红桃牌（获得判定牌，血量+1）；黑色牌（血槽-1并回复血量至血槽值）。
                let skill22: ExSkillData = {
                    name:"不灭",
                    description:NG.Utils.translateDescTxt("【被动技】[自]方块牌均视为红桃牌；[自]血量为0时，不进入濒死状态，[自][判]，[结]红桃牌（获得判定牌，血量+1）；黑色牌（血槽-1并回复血量至血槽值）。"),
                    trigger:{
                        player:NG.StateTrigger.dying + NG.TriggerEnum.Begin,
                    },
                    silent:true,
                    filter:function(event,player){
                        return player.hp<=0 && player.maxHp>0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        player.popup("不灭");
                        trigger.cancel(true);
                        player.judge(function(jResult: JudgeResultData){
                            return jResult.color == NG.CardColor.Heart;
                        });
                        "step 1"
                        if(result.bool) {
                            player.gain(result.card);
                            player.recover();
                        } else {
                            player.loseMaxHp();
                            player.recover(player.maxHp);
                        }
                    },
                    check:lib.filter.all,
                    //把龙兔合并过来
                    mod:{
                        suit:function(card,suit) {
                            if(suit == NG.CardColor.Diamond) {
                                return NG.CardColor.Heart;
                            }
                        }
                    },
                };

                //龙兔  【被动技】  [自]方块牌均视为红桃牌。
                let skill3: ExSkillData = {
                    name:"龙兔",
                    description:NG.Utils.translateDescTxt("【被动技】[自]方块牌均视为红桃牌。"),
                    mod:{
                        suit:function(card,suit) {
                            if(suit == NG.CardColor.Diamond) {
                                return NG.CardColor.Heart;
                            }
                        }
                    },
                };


                //偷窃  【主动技】  [自]将任一梅花牌当《偷窃邪术》使用。
                let skill4: ExSkillData = {
                    name:"偷窃",
                    description:NG.Utils.translateDescTxt("【主动技】[自]将任一梅花牌当《偷窃邪术》使用。"),
                    enable:NG.EnableTrigger.chooseToUse,
                    viewAs:{name:NG.CardNameConst.shunshou,suit:NG.CardColor.Club},
                    viewAsFilter:function(player){
                        return player.countCards(NG.PositionType.Handcard,{suit:NG.CardColor.Club})>0;
                    },
                    filterCard:function(card,player){
                        return get.suit(card,player) == NG.CardColor.Club;
                    },
                };

                //神偷  【被动技】  [自]《偷窃邪术》无距离使用；[自]非《偷窃邪术》的目标；[自]使用《偷窃邪术》时，摸一张牌。
                let skill5: ExSkillData = {
                    name:"神偷",
                    description:NG.Utils.translateDescTxt("【被动技】[自]《偷窃邪术》距离∞；[自]非《偷窃邪术》的目标；[自]使用《偷窃邪术》时，[自]摸一张牌。"),
                    trigger:{
                         player:NG.CardNameConst.shunshou+NG.TriggerEnum.Begin,
                    },
                    frequent:true,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        player.draw();
                    },
                    mod:{
                        //[自]《偷窃邪术》无距离使用；
                        targetInRange:function(card,player,target){
                            if(get.name(card,player) == NG.CardNameConst.shunshou) {
                                return -Infinity;
                            }
                        },
                        //[自]非《偷窃邪术》的目标；
                        targetEnabled:function(card,player,target) {
                            if(get.name(card,player) == NG.CardNameConst.shunshou) {
                                return false;
                            }
                        },
                    },
                };
                //新版：神偷 【被动技】[自]《偷窃邪术》距离∞；[自]非《偷窃邪术》的目标。
                let skill52: ExSkillData = {
                    name:"神偷",
                    description:NG.Utils.translateDescTxt("【被动技】[自]《偷窃邪术》距离∞；[自]非《偷窃邪术》的目标。"),
                    mod:{
                        //[自]《偷窃邪术》无距离使用；
                        targetInRange:function(card,player,target){
                            if(get.name(card,player) == NG.CardNameConst.shunshou) {
                                return -Infinity;
                            }
                        },
                        //[自]非《偷窃邪术》的目标；
                        targetEnabled:function(card,player,target) {
                            if(get.name(card,player) == NG.CardNameConst.shunshou) {
                                return false;
                            }
                        },
                    },
                };

                let output = {
                    zj_longtu:skill1,
                    zj_bumie:skill22,
                    // zj_longtu2:skill3,

                    zj_touqie:skill4,
                    zj_shentou:skill52,
                }

                return output;
            });
    })();
}