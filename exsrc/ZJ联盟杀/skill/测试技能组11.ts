module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组11", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //抚恤:  【回合技】  [任一]血量减少1次后，其[判定]，[结果]红色（[自]摸1张牌且[自]可弃置一张红桃牌，令其血量+1）。  
                let skill1: ExSkillData = {
                    name:"抚恤",
                    description:NG.Utils.translateDescTxt("【回合技】[任]血量减少1次后，其[判]，[结]红色（[自]可弃置一张红桃牌，令其血量+1）。"),
                    trigger:{
                        global:NG.StateTrigger.changeHp,
                    },
                    usable:1,
                    // prompt:function(event){
                    //     return `任一角色血量减少1次后，其进行一次判断，若结果为红色（${get.translation(event.player)}可弃置一张红桃牌，令其血量+1）`;
                    // },
                    filter:function(event,player){
                        if(event.num<0) return true;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        trigger.player.judge(function(jResult: JudgeResultData){
                            return jResult.color == NG.CardColor.Red;
                        });
                        "step 1"
                        event.bool = result.bool;
                        // 新版没有
                        // if(result.bool) {
                        //     player.draw();
                        // }
                        "step 2"
                        if(event.bool){
                            player.chooseToDiscard(1,{color:NG.CardColor.Red},"你可弃置一张红桃牌，令其血量+1");
                        }
                        "step 3"
                        if(result.bool){
                            trigger.player.recover(player,NG.StringTypeConst.nocard);
                        }
                    }
                };
                //新版：【回合技】[任]血量减少1次后，其[判]，[结]红色牌（[自]可弃置一张红色牌，令其血量+1）；黑色牌（[自]可弃置一张黑色牌，令其[摸]1）。
                let skill12: ExSkillData = {
                    name:"抚恤",
                    description:NG.Utils.translateDescTxt("【回合技】[任]血量减少1次后，其[判]，[结]红色牌（[自]可弃置一张红色牌，令其血量+1）；黑色牌（[自]可弃置一张黑色牌，令其[摸]1）。"),
                    trigger:{
                        global:NG.StateTrigger.changeHp,
                    },
                    usable:1,
                    filter:function(event,player){
                        if(event.num<0) return true;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        trigger.player.judge(function(jResult: JudgeResultData){
                            return 1;
                        });
                        "step 1"
                        event.color = result.color;
                        "step 2"
                        if(event.color == NG.CardColor.Red){
                            player.chooseToDiscard(1,{color:NG.CardColor.Red},"你可弃置一张红色牌，令其血量+1");
                        } else if(event.color == NG.CardColor.Black) {
                            player.chooseToDiscard(1,{color:NG.CardColor.Black},"你可弃置一张黑色牌，令其摸一张牌");
                        }
                        "step 3"
                        if(event.color == NG.CardColor.Red){
                            trigger.player.recover(player,NG.StringTypeConst.nocard);
                        } else if(event.color == NG.CardColor.Black) {
                            trigger.player.draw();
                        }
                    }
                };

                //土豪   【回合技】  [自]<准备>,<摸牌>可跳过，[自]将手牌补至其血槽值；<出牌>可跳过，将任意手牌交给[他]。
                let skill2: ExSkillData = {
                    name:"土豪",
                    description:NG.Utils.translateDescTxt("[自]<准备>,<摸牌>可跳过，[自]将手牌补至其血槽值；<出牌>可跳过，将任意手牌交给[他]。"),
                    trigger:{
                        //简化技能的操作
                        // player:[NG.PhaseTrigger.phase+NG.TriggerEnum.Before],
                        player:[NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.Before,NG.PhaseTrigger.phaseUse+NG.TriggerEnum.Before],
                    },
                    usable:1,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        let _triggerName = "";
                        if(trigger.name == NG.PhaseTrigger.phaseDraw) {
                            _triggerName = get.translation(NG.PhaseTrigger.phaseDraw);
                            _triggerName += ":将手牌补至其血槽值";
                        } else {
                            _triggerName = get.translation(NG.PhaseTrigger.phaseUse);
                            _triggerName += ":将任意手牌交给一名角色";
                        }
                        player.chooseBool(`可跳过${_triggerName}`);
                        "step 1"
                        if(!result.bool) {
                            event.finish();
                            return;
                        }
                        if(trigger.name == NG.PhaseTrigger.phaseDraw) {
                            //跳过摸牌阶段
                            let count = player.maxHp-player.countCards(NG.PositionType.Handcard);
                            if(count>0) {
                                player.draw(count);
                            }
                            // player.skip(NG.PhaseTrigger.phaseUse);
                        } else {
                            //跳过出牌阶段
                            let chooseData:CheckEventData = {
                                selectCard:[1,Infinity],
                                position:NG.PositionType.Handcard,
                                selectTarget:1,
                                filterTarget:function(card,player,target){
                                    return player!=target;
                                },
                                prompt:"将任意手牌交给其他一名角色",
                            };
                            player.chooseCardTarget(chooseData);
                            // player.skip(NG.PhaseTrigger.phaseUse);
                        }
                        "step 1"
                        trigger.cancel();
                    }

                };

                //新版：土豪   【主动技】[自]<出>，[自]可跳过，[自]将≥1张[手]交给[他]。
                let skill22: ExSkillData = {
                    name:"土豪",
                    description:NG.Utils.translateDescTxt("【主动技】[自]<出>，[自]可跳过，[自]将≥1张[手]交给[他]。"),
                    trigger:{
                        //简化技能的操作
                        // player:[NG.PhaseTrigger.phase+NG.TriggerEnum.Before],
                        player:[NG.PhaseTrigger.phaseUse+NG.TriggerEnum.Before],
                    },
                    usable:1,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        trigger.cancel();//直接提前跳过阶段
                        //跳过出牌阶段
                        let chooseData:CheckEventData = {
                            selectCard:[1,Infinity],
                            filterCard:lib.filter.all,
                            position:NG.PositionType.Handcard,
                            selectTarget:1,
                            filterTarget:function(card,player,target){
                                return player!=target;
                            },
                            prompt:"将任意手牌交给其他一名角色",
                            forced:true,
                        };
                        player.chooseCardTarget(chooseData);
                        "step 1"
                        // console.log("土豪====>",result);
                        if(result.bool && result.cards.length && result.targets.length) {
                            player.give(result.cards,result.targets[0]);
                        }                        
                    }

                };

                let output = {
                    zj_fuxu:skill12,
                    zj_tuhao:skill22
                }

                return output;
            });
    })();
}