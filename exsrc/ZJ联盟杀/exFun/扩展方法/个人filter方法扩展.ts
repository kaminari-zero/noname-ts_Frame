module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人filter方法扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //filter
                //额外增加一些游戏内的常用检索
                //卡牌是否响应打出（包括技能的响应）[需要执行]
                lib.filter.cardEnableRespondable = function (card: Card, player: Player) {
                    var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                    if (mod2 != 'unchanged') return mod2;
                    var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                    if (mod != 'unchanged') return mod;
                    return true;
                }

                //是否有“无视防具”效果的技能标签
                lib.filter.unequip = function (event: GameEvent, player: Player, isNotUnequip2: boolean) {
                    if (!isNotUnequip2 && player.hasSkillTag('unequip2')) return true;
                    if (event.source && event.source.hasSkillTag('unequip', false, {
                        name: event.card ? event.card.name : null,
                        target: player,
                        card: event.card
                    })) return true;
                    return false;
                }
                //是否不包括自己
                lib.filter.isNotSelf = function (player: Player, target: Player) {
                    return player != target;
                }

                

                return null;
            });
    })();
}