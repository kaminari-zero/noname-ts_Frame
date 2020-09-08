module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人player方法扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //将牌放回牌堆：
                lib.element.player.putCardsToCardPile = function (cards: Card | Card[], isBottom?: boolean) {
                    if (Array.isArray(cards)) {
                        while (cards.length) {
                            if (isBottom) {
                                ui.cardPile.insertBefore(cards.shift(), ui.cardPile.lastChild);
                            } else {
                                ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
                            }
                        }
                    } else {
                        if (isBottom) {
                            ui.cardPile.insertBefore(cards, ui.cardPile.lastChild);
                        } else {
                            ui.cardPile.insertBefore(cards, ui.cardPile.firstChild);
                        }
                    }
                    game.updateRoundNumber();//更新显示与最上面一张牌的引用
                    return this;
                }

                //当前失去的体力
                lib.element.player.curLoseHp = function () {
                    //后续增加操作
                    return this.maxHp - this.hp;
                }


                return null;
            });
    })();
}