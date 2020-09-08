//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "收集player方法扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                
                //交换的判定区主函数（搬自耀世三国②，自己保留）
                lib.element.content.swapJudge = function () {
                    "step 0"
                    game.log(player, '和', target, '交换了判定区中的牌')
                    var j1 = player.getCards('j');
                    if (target.storage._disableJudge) {
                        if (j1) player.discard(j1);
                    }
                    var j2 = target.getCards('j');
                    if (player.storage._disableJudge) {
                        if (j2) target.discard(j2);
                    }
                    "step 1"
                    event.cards = [player.getCards('j'), target.getCards('j')];
                    player.lose(event.cards[0], ui.ordering, 'visible');
                    target.lose(event.cards[1], ui.ordering, 'visible');
                    if (event.cards[0].length) player.$give(event.cards[0], target);
                    if (event.cards[1].length) target.$give(event.cards[1], player);
                    "step 2"
                    for (var i = 0; i < event.cards[1].length; i++) {
                        if (event.cards[1][i].viewAs) player.addJudge({ name: event.cards[1][i].viewAs }, [event.cards[1][i]]);
                        else player.addJudge(event.cards[1][i]);
                    }
                    for (var i = 0; i < event.cards[0].length; i++) {
                        if (event.cards[0][i].viewAs) target.addJudge({ name: event.cards[0][i].viewAs }, [event.cards[0][i]]);
                        else target.addJudge(event.cards[0][i]);
                    }
                };
                lib.element.player.swapJudge = function (target) {
                    var next = game.createEvent('swapJudge');
                    next.player = this;
                    next.target = target;
                    next.setContent('swapJudge');
                    return next;
                };


                // //玩家是否时当前什么属性最大的
                // lib.element.player.ismax = function (shushing, ...arg) {
                //     if (!shushing) return;
                //     if (this[shushing] == undefined) return;
                //     if (arg.contains(true)) {
                //         var bool = true;
                //         arg.remove(true);

                //     }
                //     if (arg && arg.length) {
                //         if (this[shushing](arg) == undefined) return;
                //         for (var i = 0; i < game.players.length; i++) {
                //             if (game.players[i].isOut() || game.players[i] == this) continue;
                //             if (bool == true) {
                //                 if (game.players[i][shushing](arg) >= this[shushing](arg)) return false;
                //             }
                //             else {
                //                 if (game.players[i][shushing](arg) > this[shushing](arg)) return false;
                //             }
                //         }
                //     }
                //     else {
                //         for (var i = 0; i < game.players.length; i++) {
                //             if (game.players[i].isOut() || game.players[i] == this) continue;
                //             if (bool == true) {
                //                 if (game.players[i][shushing] >= this[shushing]) return false;
                //             }
                //             else {
                //                 if (game.players[i][shushing] > this[shushing]) return false;
                //             }
                //         }
                //     }
                //     return true;
                // }
                // //玩家是否时当前什么属性最小的
                // lib.element.player.ismin = function (shushing, ...arg) {
                //     if (!shushing) return;
                //     if (this[shushing] == undefined) return;
                //     if (arg.contains(true)) {
                //         var bool = true;
                //         arg.remove(true);

                //     }
                //     if (arg && arg.length) {
                //         if (this[shushing](arg) == undefined) return;
                //         for (var i = 0; i < game.players.length; i++) {
                //             if (game.players[i].isOut() || game.players[i] == this) continue;
                //             if (bool == true) {
                //                 if (game.players[i][shushing](arg) <= this[shushing](arg)) return false;
                //             }
                //             else {
                //                 if (game.players[i][shushing](arg) < this[shushing](arg)) return false;
                //             }
                //         }
                //     }
                //     else {
                //         for (var i = 0; i < game.players.length; i++) {
                //             if (game.players[i].isOut() || game.players[i] == this) continue;
                //             if (bool == true) {
                //                 if (game.players[i][shushing] <= this[shushing]) return false;
                //             }
                //             else {
                //                 if (game.players[i][shushing] < this[shushing]) return false;
                //             }
                //         }
                //     }
                //     return true;
                // }

                return null;
            });
    })();
}