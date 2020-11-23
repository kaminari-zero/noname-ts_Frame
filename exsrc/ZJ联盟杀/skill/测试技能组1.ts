module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组1", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //天使  【主动技】  [自]使用一张《血》时，[自]摸一张牌。
                // let skill1: ExSkillData = {
                //     //【主动技】 条件：[自]使用一张《血》时
                //     //使用...时
                //     trigger: {
                //         player: NG.CardTrigger.useCard,
                //     },
                //     //《血》
                //     filter: function (event: Trigger, player: Player) {
                //         return event.card.name == NG.CardNameConst.血;
                //     },
                //     //[自]摸一张牌
                //     content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                //         player.draw(1);
                //     }
                // };

                //老鬼  【阶段技】  [自]可除去[自]1点血量，[他]摸一张牌。
                let skill2: ExSkillData = {
                    name:"老鬼",
                    description:NG.Utils.translateDescTxt("【阶段技】[自]可除去[自]1点血量，[他]摸一张牌。"),
                    //【阶段技】
                    enable: NG.EnableTrigger.phaseUse,
                    usable:1,
                    //[自]可除去[自]1点血量，[他]摸一张牌。
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        //[自]可除去[自]1点血量
                        "step 0"
                        player.loseHp(1);
                        //[他]摸一张牌
                        "step 1"
                        player.chooseTarget(
                            1,
                            function (card: Card, player: Player, target: Target) {
                                return target != player;
                            },
                            true
                        );
                        "step 2"
                        if(result.bool && result.targets.length) {
                            result.targets[0].draw();
                        }
                    }
                };

                let output = {
                    zj_laogui:skill2,
                }

                return output;
            });
    })();
}