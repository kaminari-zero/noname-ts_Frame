module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组7", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //邪心  【回合技】  [自]使用一张《杀》造成伤害时，[自]除去1点血量，此《杀》的伤害值+X (X=[自]失血值)。
                //新版：邪心 【回合技】[自]使用一张《杀》造成伤害时，此《杀》的伤害值+X (X=[自]失血值，至少为1)。
                let skill1: ExSkillData = {
                    name:"邪心",
                    description:NG.Utils.translateDescTxt("【回合技】[自]使用一张《杀》造成伤害时，此《杀》的伤害值+X (X=[自]失血值，至少为1)。"),
                    trigger:{
                        source:NG.StateTrigger.damageBegin1,
                    },
                    usable:1,
                    filter:function(event,player){
                        return event.card && get.name(event.card) == NG.CardNameConst.sha;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        // player.loseHp();
                        trigger.num += Math.max(1,(player.maxHp - player.hp));
                    }
                };

                //繁花  【主动技】  [自]使用《杀》指定[他]为目标后，[自][判定]，[结果]红色（其不能使用《闪》）。
                //新版：繁花 【主动技】[自]使用《杀》指定[他]为目标后，[自][判]，[结]红色牌（其不能使用《闪》）；黑色牌（[自][摸]1）。
                let skill2: ExSkillData = {
                    name:"繁花",
                    description:NG.Utils.translateDescTxt("【主动技】[自]使用《杀》指定[他]为目标后，[自][判]，[结]红色牌（其不能使用《闪》）；黑色牌（[自][摸]1）。"),
                    trigger:{
                        player:NG.CardTrigger.useCardToPlayered,
                    },
                    filter:function(event,player) {
                        // let userCardEvent = event._trigger.getParent();
                        // return get.name(userCardEvent.card,player) == NG.CardNameConst.sha;
                        return get.name(event.card,player) == NG.CardNameConst.sha;
                    },
                    logTarget:"target",
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        player.judge(function(jResult: JudgeResultData){
                            // return jResult.color == NG.CardColor.Red?1:0;
                            return 1;//黑红都有效果
                        });
                        "step 1"
                        if(result.bool) {
                            if(result.color == NG.CardColor.Red) {
                                //不能使用闪响应
                                (<Player[]>trigger.getParent().directHit).add(trigger.target);
                            } else {
                                player.draw();
                            }
                        }
                    }
                };


                let output = {
                    zj_xiexin:skill1,
                    zj_fanhua:skill2,
                }

                return output;
            });
    })();
}