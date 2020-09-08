module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组10", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //烂摊  【被动技】  [自]血量X，视为拥有技能：“杀手”(X为≤6)、“无限”(X为≤4)、“神勇”(X为≤2)。
                let skill1: ExSkillData = {
                    name:"烂摊",
                    description:NG.Utils.translateDescTxt("【被动技】[自]血量X，视为拥有技能：“杀手”(X为≤6)、“神勇”(X为≤4)、“无限”(X为≤2)。"),
                    trigger:{
                        global:NG.PhaseTrigger.gameDraw+NG.TriggerEnum.Before,
                        player:[NG.StateTrigger.changeHp],
                    },
                    forced:true,
                    popup:false,
                    derivation:["zj_shili_shashou","zj_sub_wudi","zj_sub_shenyong"],
                    //尝试在游戏开始时，触发一下技能
                    // init:function(player){
                    // },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        player.removeAdditionalSkill("zj_lantang");
                        let list = [];
                        if(player.hp <= 6) {
                            ///提示技能要开始变化的日志
                            if(trigger.num!=undefined&&trigger.num<0&&player.hp-trigger.num>1) player.logSkill("zj_lantang");
                            list.push("zj_shili_shashou");
                        }
                        if(player.hp <= 4){
                            list.push("zj_sub_shenyong");
                        }
                        if(player.hp <= 2){
                            list.push("zj_sub_wudi");
                        }
                        if(list.length){ 
                            player.addAdditionalSkill("zj_lantang",list); 
                        }
                    },
                    ai:{
                        maixie:true,
                    }
                };

                //“杀手”  通用势力技能

                //“无限” 【被动技】  [自]计算与[他]距离时-X（X=[自]失血量且至少为1）；[自]始终无视其他角色的防具； [自]使用《杀》无数量限制。 
                //原型：“new_repaoxiao”
                let zj_sub_wudi: ExSkillData = { 
                    name:"无限",
                    description:NG.Utils.translateDescTxt("【被动技】[自]计算与[他]距离时-X（X=[自]失血量且至少为1）；[自]始终无视其他角色的防具； [自]使用∞张《杀》。"),
                    mod:{
                        //计算与[他]距离时-X（X=[自]失血量且至少为1）
                        globalFrom:function(from,to,distance){
                            let count = 1;
                            if(from.curLoseHp()) count = from.curLoseHp();
                            return distance - count;
                        },
                        //使用《杀》无数量限制
                        cardUsable:function(card,player,num){ 
                            if(card.name==NG.CardNameConst.sha) return Infinity; 
                        },
                    },
                    ai:{
                        //始终无视其他角色的防具
                        unequip:true,
                    }
                };

                //“神勇” 【主动技】  [自]<准备>，[自]每选择一项：(1)跳过<摸牌><弃牌>；(2)跳过<判定><出牌>。[自]视为对[他]额外使用一张《杀》。
                //原型：“shensu”
                let zj_sub_shenyong:ExSkillData = {
                    name:"神勇",
                    description:NG.Utils.translateDescTxt("【主动技】[自]<准>，[自]每选择一项：(1)跳过<摸>、<弃>；(2)跳过<判>、<出>。[自]视为对[他]额外使用一张《杀》。"),
                    trigger:{
                        player:[NG.PhaseTrigger.judge+NG.TriggerEnum.Before,NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.Before],
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        let prompt2 = "";
                        if(trigger.name == NG.PhaseTrigger.judge) {
                            prompt2 = NG.Utils.translateDescTxt("跳过<判定><出牌>,")+NG.Utils.translateDescTxt("[自]视为对[他]额外使用一张《杀》");
                        } else {
                            prompt2 = NG.Utils.translateDescTxt("跳过<摸牌><弃牌>,")+NG.Utils.translateDescTxt("[自]视为对[他]额外使用一张《杀》");
                        }
                        player.chooseTarget(1,get.prompt(event.name),prompt2,function(card:Card,player:Player,target:Target){
                            return player != target && player.canUse({name:NG.CardNameConst.sha},target,false);
                        });
                        "step 1"
                        if(result.bool) {
                            //额外使用一张杀
                            player.useCard({name:NG.CardNameConst.sha,isCard:true},result.targets[0],false);
                            trigger.cancel();
                            if(trigger.name == NG.PhaseTrigger.judge) {
                                // player.skip(NG.PhaseTrigger.judge);//不能重复，跳过，否则，就跳过了下回合的对应阶段
                                player.skip(NG.PhaseTrigger.phaseUse);
                            } else {
                                // player.skip(NG.PhaseTrigger.phaseDraw);
                                player.skip(NG.PhaseTrigger.phaseDiscard);
                            }
                        }
                    },
                };

                let output = {
                    zj_lantang:skill1,

                    zj_sub_wudi:zj_sub_wudi,
                    zj_sub_shenyong:zj_sub_shenyong,
                }

                return output;
            });
    })();
}