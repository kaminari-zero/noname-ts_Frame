module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组13", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //仙力   【主动技】  [自]成为《杀》/通常魔法牌的目标时，[自][判定],[结果]红桃（此牌对[自]无效）。
                let skill1: ExSkillData = {
                    name:"仙力",
                    description:NG.Utils.translateDescTxt("【主动技】[自]成为《杀》/通常魔法牌的目标时，[自][判],[结]红桃（此牌对[自]无效）。"),
                    trigger: {
                        target: NG.CardTrigger.useCardTo+NG.TriggerEnum.Begin,
                    },
                    filter:function(event){
                        if(event.card && (get.name(event.card) == NG.CardNameConst.sha || get.type(event.card) == NG.CardType.Trick)) {
                            return true;
                        }
                    },
                    //[自][判定],[结果]红桃（此牌对[自]无效）
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        player.judge((jResult: JudgeResultData)=>{
                            //削了他，改成红桃：
                            // return jResult.color == NG.CardColor.Red?1:0;
                            return jResult.suit == NG.CardColor.Heart;
                        });
                        "step 1"
                        if(result.bool) {
                            player.popup("无效");
                            trigger.cancel();//该触发无效
                        }
                    }
                };

                //仙气   【主动技】  [自]判定牌生效后，若手牌值少于[自]血槽值，[自]摸一张牌。
                let skill2: ExSkillData = {
                    name:"仙气",
                    description:NG.Utils.translateDescTxt("【主动技】[自]判定牌生效后，若[自]手牌值少于[自]血槽值，[自][摸]1。"),
                    trigger:{
                        player:NG.PhaseTrigger.judge+NG.TriggerEnum.End
                    },
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.Handcard) < player.maxHp;
                    },
                    frequent:true,
                    //若手牌值少于[自]血槽值，[自]摸一张牌。
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        player.draw();
                    }
                };


                let output = {
                    zj_xianli:skill1,
                    zj_xianqi:skill2
                }

                return output;
            });
    })();
}