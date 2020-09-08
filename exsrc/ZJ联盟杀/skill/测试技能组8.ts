module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组8", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //圣锤  【主动技】  [自]使用的《杀》被《闪》抵消时，[自]将该《闪》交给[任一]，且弃置其一张牌。
                let skill1: ExSkillData = {
                    name:"圣锤",
                    description:NG.Utils.translateDescTxt("【主动技】[自]使用的《杀》被《闪》抵消时，[自]将该《闪》交给[任一]，且弃置其一张牌。"),
                    trigger:{
                        source:NG.CardTrigger.shaMiss,
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        //当前响应的是卡牌时：
                        if(event._trigger.responded && get.itemtype(event.responded.cards) == NG.ItemType.CARDS) {
                            player.chooseTarget(1,`将${get.translation(trigger.responded.cards)}交给一名角色`,true);
                        } else {
                            event.goto(2);
                        }
                        "step 1"
                        if(result && result.targets) {
                            result.targets[0].gain(event.responded.cards);
                        }
                        "step 2"
                        //弃置被闪目标一张牌
                        player.discardPlayerCard(trigger.player,1,NG.PositionType.Use,NG.AniNmaeConst.gain2);
                    }
                };

                //新版：圣锤 【主动技】[自]使用的《杀》被《闪》抵消时，[自]弃置其一张[手]。
                let skill12: ExSkillData = {
                    name:"圣锤",
                    description:NG.Utils.translateDescTxt("【主动技】[自]使用的《杀》被《闪》抵消时，且[自]弃置其[区]一张牌。"),
                    trigger:{
                        player:NG.CardTrigger.shaMiss,
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        //弃置被闪目标一张牌
                        player.discardPlayerCard(trigger.target,1,NG.PositionType.Use);
                    }
                };

                // 启盛  【回合技】[自]<摸>时，摸牌-1，[自]视为对[他]额外使用一张《杀》，此《杀》的伤害值+1。
                let skill2: ExSkillData = {
                    name:"启盛",
                    description:NG.Utils.translateDescTxt("【回合技】[自]<摸>时，摸牌-1，[自]视为对[他]额外使用一张《杀》，此《杀》的伤害值+1。"),
                    trigger:{
                        player:NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.Begin,
                    },
                    usable:1,
                    filter:function(event,player) {
                        //判断当前摸牌阶段是否有放弃摸牌，摸牌数小于0
                        return !event.numFixed && event.num>0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        trigger.num--;
                        player.chooseTarget(1,function(card,player,target){
                            return player != target;
                        },true);//,get.prompt(event.name)
                        "step 1"
                        if(result.bool && result.targets) {
                            //视为额外使用一张杀
                            let next = player.useCard({name:NG.CardNameConst.sha,isCard:true,isQisheng:true},result.targets[0],false); 
                            //添加额外技能加伤
                            //似乎无法直接设置customArgs，因为，在步骤0时，默认初始化一个event.customArgs={default:{}};
                            player.storage.shaDamageAdd = 1;
                            // player.addSkillTrigger("damageAdd",false,true);
                            player.addTempSkill("shaDamageAdd",NG.CardNameConst.sha+NG.TriggerEnum.After);//默认回合结束就取消
                        }    
                    }
                };

                //杀造成的伤害+x
                let shaDamageAdd:ExSkillData = {
                    name:"加伤",
                    description:"《杀》造成的伤害增加",
                    trigger:{
                        // player:NG.CardTrigger.useCardToPlayered
                        // player:NG.StateTrigger.damageBegin1,
                        player:NG.CardNameConst.sha+NG.TriggerEnum.Begin,
                    },
                    silent:true,
                    filter:function(event,player) {
                        return player.storage.shaDamageAdd;
                    },
                    // init //交给外部赋值
                    // onremove:function(player){
                    //     delete player.storage.shaDamageAdd;
                    //     player.removeSkillTrigger("shaDamageAdd");
                    // },
                    onremove:true,
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        //方法一：
                        //令伤害+1的源代码：摘自"hmxili"，需要在“useCardToPlayer”，“useCardToTarget”，“useCardToPlayered”，“useCardToTargeted”中触发：
                        // var id=trigger.target.playerid;
                        // var map=trigger.customArgs;
                        // if(!map[id]) map[id]={};
                        // if(!map[id].extraDamage) map[id].extraDamage=0;
                        // map[id].extraDamage++;

                        //方法2：
                        // trigger.num++;

                        //方法3：
                        trigger.extraDamage = player.storage.shaDamageAdd;
                        //触发了一次就取消技能（还是交给addTempSkill设置结束时机）
                        // delete player.storage.shaDamageAdd;
                        // player.removeSkillTrigger("shaDamageAdd");
                    },
                    //显示标记更方便：
                    mark:true,
                    marktext:"伤",
                    intro:{
                        content:"《杀》造成的伤害+#",
                        
                    },
                };


                let output = {
                    zj_shenchui:skill12,
                    zj_qisheng:skill2,
                    shaDamageAdd:shaDamageAdd,
                }

                return output;
            });
    })();
}