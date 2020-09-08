module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组4", NG.ImportFumType.none,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //圣锤  【主动技】  [自]使用的《杀》被《闪》抵消时，[自]将该《闪》交给[任一]，且弃置其一张牌。
                let skill2: ExSkillData = {
                    trigger:{
                        //推断执行顺序：
                        /*
                        useCard(shaCard)--》sha【step 1】(chooseToUse:useCard[shan])--》useCard(shanCard)--》
                         --》sha【step 2】（event.responded=result）:sha[shaMiss]
                        */
                        player:NG.CardTrigger.shaMiss,
                    },
                    filter:function(event,player){
                        if(event.target.countCards(NG.PositionType.Use)) return true;
                        return event.responded && event.responded.cards && event.responded.cards.length>0;
                    },
                    // selectTarget:1,
                    // prompt:`将该《${get.translation(NG.CardNameConst.shan)}》交给任一玩家`,
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                        "step 0"
                        //如何获取响应的牌？目前来看chooseToRespond，respond,应该在cards，不过此时触发shaMiss是在杀的事件时机中，响应事件应该是event.responded
                        event.cards = event.responded.cards;
                        // event.target = result.targets[0];
                        if(event.responded && event.responded.cards && event.responded.cards.length>0) {
                            player.chooseTarget(1,`将该《${get.translation(NG.CardNameConst.shan)}》交给任一玩家`,true);
                        } else {
                            event.goto(2);
                        }
                        "step 1"
                        if(result.bool) {
                            player.give(event.cards,result.targets[0]);
                        }
                        "step 2"
                        if(trigger.target.countCards(NG.PositionType.Use)) {
                            player.discardPlayerCard(trigger.target,1);
                        }
                    },
                };


                let output = {
                    
                }

                return output;
            });
    })();
}