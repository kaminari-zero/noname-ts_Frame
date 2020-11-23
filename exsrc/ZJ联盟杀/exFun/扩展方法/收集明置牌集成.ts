//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "集成明置牌", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //明置相关，算是一个大系统：
                //content:
                //明置特供方法
                // lib.element.content.choosePlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                //     "step 0"
                //     if (!event.dialog) event.dialog = ui.create.dialog('hidden');
                //     else if (!event.isMine) {
                //         event.dialog.style.display = 'none';
                //     }
                //     if (event.prompt) {
                //         event.dialog.add(event.prompt);
                //     }
                //     else {
                //         event.dialog.add('选择' + get.translation(target) + '的一张牌');
                //     }
                //     if (event.prompt2) {
                //         event.dialog.addText(event.prompt2);
                //     }
                //     var directh = true;
                //     for (var i = 0; i < event.position.length; i++) {
                //         if (event.position[i] == 'h') {
                //             var hs = target.getCards('h');
                //             if (hs.length) {
                //                 event.dialog.addText('手牌区');
                //                 hs.randomSort();
                //                 if (event.visible || target.isUnderControl(true)) {
                //                     event.dialog.add(hs);
                //                     directh = false;
                //                 }
                //                 else {
                //                     // console.log("choosePlayerCardByMingzhi===>",target.storage.mingzhi,hs);
                //                     if (target.storage.mingzhi) {//明置手牌
                //                         for (var j = 0; j < hs.length; j++) {
                //                             if (target.storage.mingzhi.contains(hs[j])) {
                //                                 event.dialog.add([hs[j]]);
                //                             } else {
                //                                 event.dialog.add([[hs[j]], 'blank']);
                //                             }
                //                         }
                //                         directh = false;
                //                     } else {
                //                         event.dialog.add([hs, 'blank']);
                //                     }
                //                 }
                //             }
                //         }
                //         else if (event.position[i] == 'e') {
                //             var es = target.getCards('e');
                //             if (es.length) {
                //                 event.dialog.addText('装备区');
                //                 event.dialog.add(es);
                //                 directh = false;
                //             }
                //         }
                //         else if (event.position[i] == 'j') {
                //             var js = target.getCards('j');
                //             if (js.length) {
                //                 event.dialog.addText('判定区');
                //                 event.dialog.add(js);
                //                 directh = false;
                //             }
                //         }
                //     }
                //     if (event.dialog.buttons.length == 0) {
                //         event.finish();
                //         return;
                //     }
                //     var cs = target.getCards(event.position);
                //     var select = get.select(event.selectButton);
                //     if (event.forced && select[0] >= cs.length) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons,
                //             links: cs
                //         }
                //     }
                //     else if (event.forced && directh && select[0] == select[1]) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons.randomGets(select[0]),
                //             links: []
                //         }
                //         for (var i = 0; i < event.result.buttons.length; i++) {
                //             event.result.links[i] = event.result.buttons[i].link;
                //         }
                //     }
                //     else {
                //         if (event.isMine()) {
                //             event.dialog.open();
                //             game.check();
                //             game.pause();
                //         }
                //         else if (event.isOnline()) {
                //             event.send();
                //         }
                //         else {
                //             event.result = 'ai';
                //         }
                //     }
                //     "step 1"
                //     if (event.result == 'ai') {
                //         game.check();
                //         if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
                //         else ui.click.cancel();
                //     }
                //     event.dialog.close();
                //     if (event.result.links) {
                //         event.result.cards = event.result.links.slice(0);
                //     }
                //     event.resume();
                // }

                // lib.element.content.discardPlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                //     "step 0"
                //     if (event.directresult) {
                //         event.result = {
                //             buttons: [],
                //             cards: event.directresult.slice(0),
                //             links: event.directresult.slice(0),
                //             targets: [],
                //             confirm: 'ok',
                //             bool: true
                //         };
                //         event.cards = event.directresult.slice(0);
                //         event.goto(2);
                //         return;
                //     }
                //     if (!event.dialog) event.dialog = ui.create.dialog('hidden');
                //     else if (!event.isMine) {
                //         event.dialog.style.display = 'none';
                //     }
                //     if (event.prompt == undefined) {
                //         var str = '弃置' + get.translation(target);
                //         var range = get.select(event.selectButton);
                //         if (range[0] == range[1]) str += get.cnNumber(range[0]);
                //         else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                //         else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                //         str += '张';
                //         if (event.position == 'h' || event.position == undefined) str += '手';
                //         if (event.position == 'e') str += '装备';
                //         str += '牌';
                //         event.prompt = str;
                //     }
                //     if (event.prompt) {
                //         event.dialog.add(event.prompt);
                //     }
                //     if (event.prompt2) {
                //         event.dialog.addText(event.prompt2);
                //     }
                //     var directh = true;
                //     for (var i = 0; i < event.position.length; i++) {
                //         if (event.position[i] == 'h') {
                //             var hs = target.getDiscardableCards(player, 'h');
                //             if (hs.length) {
                //                 event.dialog.addText('手牌区');
                //                 hs.randomSort();
                //                 if (event.visible || target.isUnderControl(true)) {
                //                     event.dialog.add(hs);
                //                     directh = false;
                //                 }
                //                 else {
                //                     if (target.storage.mingzhi) {//明置手牌
                //                         for (var j = 0; j < hs.length; j++) {
                //                             if (target.storage.mingzhi.contains(hs[j])) {
                //                                 event.dialog.add([hs[j]]);
                //                             } else {
                //                                 event.dialog.add([[hs[j]], 'blank']);
                //                             }
                //                         }
                //                         directh = false;
                //                     } else {
                //                         event.dialog.add([hs, 'blank']);
                //                     }
                //                 }
                //             }
                //         }
                //         else if (event.position[i] == 'e') {
                //             var es = target.getDiscardableCards(player, 'e');
                //             if (es.length) {
                //                 event.dialog.addText('装备区');
                //                 event.dialog.add(es);
                //                 directh = false;
                //             }
                //         }
                //         else if (event.position[i] == 'j') {
                //             var js = target.getDiscardableCards(player, 'j');
                //             if (js.length) {
                //                 event.dialog.addText('判定区');
                //                 event.dialog.add(js);
                //                 directh = false;
                //             }
                //         }
                //     }
                //     if (event.dialog.buttons.length == 0) {
                //         event.finish();
                //         return;
                //     }
                //     var cs = target.getCards(event.position);
                //     var select = get.select(event.selectButton);
                //     if (event.forced && select[0] >= cs.length) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons,
                //             links: cs
                //         }
                //     }
                //     else if (event.forced && directh && select[0] == select[1]) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons.randomGets(select[0]),
                //             links: []
                //         }
                //         for (var i = 0; i < event.result.buttons.length; i++) {
                //             event.result.links[i] = event.result.buttons[i].link;
                //         }
                //     }
                //     else {
                //         if (event.isMine()) {
                //             event.dialog.open();
                //             game.check();
                //             game.pause();
                //         }
                //         else if (event.isOnline()) {
                //             event.send();
                //         }
                //         else {
                //             event.result = 'ai';
                //         }
                //     }
                //     "step 1"
                //     if (event.result == 'ai') {
                //         game.check();
                //         if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
                //         else ui.click.cancel();
                //     }
                //     event.dialog.close();
                //     "step 2"
                //     event.resume();
                //     if (event.result.bool && event.result.links && !game.online) {
                //         if (event.logSkill) {
                //             if (typeof event.logSkill == 'string') {
                //                 player.logSkill(event.logSkill);
                //             }
                //             else if (Array.isArray(event.logSkill)) {
                //                 player.logSkill.apply(player, event.logSkill);
                //             }
                //         }
                //         var cards = [];
                //         for (var i = 0; i < event.result.links.length; i++) {
                //             cards.push(event.result.links[i]);
                //         }
                //         event.result.cards = event.result.links.slice(0);
                //         event.cards = cards;
                //         event.trigger("rewriteDiscardResult");
                //     }
                //     "step 3"
                //     if (event.boolline) {
                //         player.line(target, 'green');
                //     }
                //     if (!event.chooseonly) {
                //         var next = target.discard(event.cards, 'notBySelf');
                //         if (event.delay === false) {
                //             next.set('delay', false);
                //         }
                //     }
                // }

                // lib.element.content.gainPlayerCardByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                //     "step 0"
                //     if (event.directresult) {
                //         event.result = {
                //             buttons: [],
                //             cards: event.directresult.slice(0),
                //             links: event.directresult.slice(0),
                //             targets: [],
                //             confirm: 'ok',
                //             bool: true
                //         };
                //         event.cards = event.directresult.slice(0);
                //         event.goto(2);
                //         return;
                //     }
                //     if (!event.dialog) event.dialog = ui.create.dialog('hidden');
                //     else if (!event.isMine) {
                //         event.dialog.style.display = 'none';
                //     }
                //     if (event.prompt == undefined) {
                //         var str = '获得' + get.translation(target);
                //         var range = get.select(event.selectButton);
                //         if (range[0] == range[1]) str += get.cnNumber(range[0]);
                //         else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                //         else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                //         str += '张';
                //         if (event.position == 'h' || event.position == undefined) str += '手';
                //         if (event.position == 'e') str += '装备';
                //         str += '牌';
                //         event.prompt = str;
                //     }
                //     if (event.prompt) {
                //         event.dialog.add(event.prompt);
                //     }
                //     if (event.prompt2) {
                //         event.dialog.addText(event.prompt2);
                //     }
                //     var directh = true;
                //     for (var i = 0; i < event.position.length; i++) {
                //         if (event.position[i] == 'h') {
                //             var hs = target.getGainableCards(player, 'h');
                //             if (hs.length) {
                //                 event.dialog.addText('手牌区');
                //                 hs.randomSort();
                //                 if (event.visible || target.isUnderControl(true)) {
                //                     event.dialog.add(hs);
                //                     directh = false;
                //                 }
                //                 else {
                //                     if (target.storage.mingzhi) {//明置手牌
                //                         for (var j = 0; j < hs.length; j++) {
                //                             if (target.storage.mingzhi.contains(hs[j])) {
                //                                 event.dialog.add([hs[j]]);
                //                             } else {
                //                                 event.dialog.add([[hs[j]], 'blank']);
                //                             }
                //                         }
                //                         directh = false;
                //                     } else {
                //                         event.dialog.add([hs, 'blank']);
                //                     }
                //                 }
                //             }
                //         }
                //         else if (event.position[i] == 'e') {
                //             var es = target.getGainableCards(player, 'e');
                //             if (es.length) {
                //                 event.dialog.addText('装备区');
                //                 event.dialog.add(es);
                //                 directh = false;
                //             }
                //         }
                //         else if (event.position[i] == 'j') {
                //             var js = target.getGainableCards(player, 'j');
                //             if (js.length) {
                //                 event.dialog.addText('判定区');
                //                 event.dialog.add(js);
                //                 directh = false;
                //             }
                //         }
                //     }
                //     if (event.dialog.buttons.length == 0) {
                //         event.dialog.close();
                //         event.finish();
                //         return;
                //     }
                //     var cs = target.getCards(event.position);
                //     var select = get.select(event.selectButton);
                //     if (event.forced && select[0] >= cs.length) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons,
                //             links: cs
                //         }
                //     }
                //     else if (event.forced && directh && select[0] == select[1] && !target.storage.mingzhi) {
                //         event.result = {
                //             bool: true,
                //             buttons: event.dialog.buttons.randomGets(select[0]),
                //             links: []
                //         }
                //         for (var i = 0; i < event.result.buttons.length; i++) {
                //             event.result.links[i] = event.result.buttons[i].link;
                //         }
                //     }
                //     else {
                //         if (event.isMine()) {
                //             event.dialog.open();
                //             game.check();
                //             game.pause();
                //         }
                //         else if (event.isOnline()) {
                //             event.send();
                //         }
                //         else {
                //             event.result = 'ai';
                //         }
                //     }
                //     "step 1"
                //     if (event.result == 'ai') {
                //         game.check();
                //         if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
                //         else ui.click.cancel();
                //     }
                //     event.dialog.close();
                //     "step 2"
                //     event.resume();
                //     if (game.online || !event.result.bool) {
                //         event.finish();
                //     }
                //     "step 3"
                //     if (event.logSkill && event.result.bool && !game.online) {
                //         if (typeof event.logSkill == 'string') {
                //             player.logSkill(event.logSkill);
                //         }
                //         else if (Array.isArray(event.logSkill)) {
                //             player.logSkill.apply(player, event.logSkill);
                //         }
                //     }
                //     var cards = [];
                //     for (var i = 0; i < event.result.links.length; i++) {
                //         cards.push(event.result.links[i]);
                //     }
                //     event.result.cards = event.result.links.slice(0);
                //     event.cards = cards;
                //     event.trigger("rewriteGainResult");
                //     "step 4"
                //     if (event.boolline) {
                //         player.line(target, 'green');
                //     }
                //     if (!event.chooseonly) {
                //         var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
                //         if (event.delay === false) {
                //             next.set('delay', false);
                //         }
                //     }
                //     else target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
                // }

                // lib.element.content.loseByMingzhi = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                //     "step 0"
                //     var hs = [], es = [], js = [];
                //     var hej = player.getCards('hej');
                //     event.stockcards = cards.slice(0);
                //     for (var i = 0; i < cards.length; i++) {
                //         cards[i].style.transform += ' scale(0.2)';
                //         cards[i].classList.remove('glow');
                //         cards[i].recheck();
                //         var info = lib.card[cards[i].name];
                //         if (info.destroy || cards[i]._destroy) {
                //             cards[i].delete();
                //             cards[i].destroyed = info.destroy || cards[i]._destroy;
                //         }
                //         else if (event.position) {
                //             if (_status.discarded) {
                //                 if (event.position == ui.discardPile) {
                //                     _status.discarded.add(cards[i]);
                //                 }
                //                 else {
                //                     _status.discarded.remove(cards[i]);
                //                 }
                //             }
                //             cards[i].goto(event.position);
                //         }
                //         else {
                //             cards[i].delete();
                //         }
                //         // 明置的话就去除标记
                //         if (player.storage.mingzhi && player.storage.mingzhi.contains(cards[i])) {
                //             if (player.storage.mingzhi.length == 1) {
                //                 delete player.storage.mingzhi;
                //                 player.unmarkSkill('mingzhi');
                //             } else {
                //                 player.storage.mingzhi.remove(cards[i]);
                //                 player.syncStorage('mingzhi');
                //             }
                //         }
                //         if (!hej.contains(cards[i])) {
                //             cards.splice(i--, 1);
                //         }
                //         else if (cards[i].parentNode) {
                //             if (cards[i].parentNode.classList.contains('equips')) {
                //                 cards[i].original = 'e';
                //                 es.push(cards[i]);
                //             }
                //             else if (cards[i].parentNode.classList.contains('judges')) {
                //                 cards[i].original = 'j';
                //                 js.push(cards[i]);
                //             }
                //             else if (cards[i].parentNode.classList.contains('handcards')) {
                //                 cards[i].original = 'h';
                //                 hs.push(cards[i]);
                //             }
                //             else {
                //                 cards[i].original = null;
                //             }
                //         }
                //     }
                //     if (player == game.me) ui.updatehl();
                //     ui.updatej(player);
                //     game.broadcast(function (player, cards, num) {
                //         for (var i = 0; i < cards.length; i++) {
                //             cards[i].classList.remove('glow');
                //             cards[i].delete();
                //         }
                //         if (player == game.me) {
                //             ui.updatehl();
                //         }
                //         ui.updatej(player);
                //         _status.cardPileNum = num;
                //     }, player, cards, ui.cardPile.childNodes.length);
                //     game.addVideo('lose', player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js)]);
                //     player.update();
                //     game.addVideo('loseAfter', player);
                //     event.num = 0;
                //     "step 1"
                //     if (num < cards.length) {
                //         if (cards[num].original == 'e') {
                //             event.loseEquip = true;
                //             player.removeEquipTrigger(cards[num]);
                //             var info = get.info(cards[num]);
                //             if (info.onLose && (!info.filterLose || info.filterLose(cards[num], player))) {
                //                 event.goto(2);
                //                 return;
                //             }
                //         }
                //         event.num++;
                //         event.redo();
                //     }
                //     else {
                //         if (event.loseEquip) {
                //             player.addEquipTrigger();
                //         }
                //         event.finish();
                //     }
                //     "step 2"
                //     var info = get.info(cards[num]);
                //     if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
                //         player.popup(cards[num].name);
                //         game.delayx();
                //     }
                //     if (Array.isArray(info.onLose)) {
                //         for (var i = 0; i < info.onLose.length; i++) {
                //             var next = game.createEvent('lose_' + cards[num].name);
                //             next.setContent(info.onLose[i]);
                //             if (info.forceDie) next.forceDie = true;
                //             next.player = player;
                //             next.card = cards[num];
                //         }
                //     }
                //     else {
                //         var next = game.createEvent('lose_' + cards[num].name);
                //         next.setContent(info.onLose);
                //         next.player = player;
                //         if (info.forceDie) next.forceDie = true;
                //         next.card = cards[num];
                //     }
                //     event.num++;
                //     event.goto(1);
                // }

                //使用替换方法，替换方法内部：
                lib.element.content.choosePlayerCardByMingzhi = lib.element.content.choosePlayerCard;
                lib.element.content.discardPlayerCardByMingzhi = lib.element.content.discardPlayerCard;
                lib.element.content.gainPlayerCardByMingzhi = lib.element.content.gainPlayerCard;
                lib.element.content.loseByMingzhi = lib.element.content.lose;
                lib.app.reWriteFunctionX(lib.element.content,{
                    choosePlayerCardByMingzhi:[
                        "event.dialog.add([hs,'blank']);",
                        `
                        if (target.storage.mingzhi) {//明置手牌
                            for (var j = 0; j < hs.length; j++) {
                                if (target.storage.mingzhi.contains(hs[j])) {
                                    event.dialog.add([hs[j]]);
                                } else {
                                    event.dialog.add([[hs[j]], 'blank']);
                                }
                            }
                            directh = false;
                        } else {
                            event.dialog.add([hs, 'blank']);
                        }
                        `
                    ],
                    discardPlayerCardByMingzhi:[
                        "event.dialog.add([hs,'blank']);",
                        `
                        if (target.storage.mingzhi) {//明置手牌
                            for (var j = 0; j < hs.length; j++) {
                                if (target.storage.mingzhi.contains(hs[j])) {
                                    event.dialog.add([hs[j]]);
                                } else {
                                    event.dialog.add([[hs[j]], 'blank']);
                                }
                            }
                            directh = false;
                        } else {
                            event.dialog.add([hs, 'blank']);
                        }
                        `
                    ],
                    gainPlayerCardByMingzhi:[
                        [
                            "event.dialog.add([hs,'blank']);",
                            `
                            if (target.storage.mingzhi) {//明置手牌
                                for (var j = 0; j < hs.length; j++) {
                                    if (target.storage.mingzhi.contains(hs[j])) {
                                        event.dialog.add([hs[j]]);
                                    } else {
                                        event.dialog.add([[hs[j]], 'blank']);
                                    }
                                }
                                directh = false;
                            } else {
                                event.dialog.add([hs, 'blank']);
                            }
                            `
                        ],
                        [
                            "else if(event.forced&&directh&&!event.isOnline()&&select[0]==select[1]",
                            "&& !target.storage.mingzhi",
                            NG.ReWriteFunctionType.append
                        ]
                    ],
                    loseByMingzhi:[
                        "if(!hej.contains(cards[i])){",
                        `
                        // 明置的话就去除标记
                        if (player.storage.mingzhi && player.storage.mingzhi.contains(cards[i])) {
                            if (player.storage.mingzhi.length == 1) {
                                delete player.storage.mingzhi;
                                player.unmarkSkill('mingzhi');
                            } else {
                                player.storage.mingzhi.remove(cards[i]);
                                player.syncStorage('mingzhi');
                            }
                        }
                        `,
                        NG.ReWriteFunctionType.insert
                    ],
                });
                // else if (event.forced && directh && select[0] == select[1] && !target.storage.mingzhi) {
                //目前一个方法要修改多个地方，先一个个列出来分别替换：(新增整合在一起处理)
                // lib.app.reWriteFunctionX(lib.element.content,{
                //     gainPlayerCardByMingzhi:[
                //         "else if(event.forced&&directh&&!event.isOnline()&&select[0]==select[1]",
                //         "&& !target.storage.mingzhi",
                //         "append"
                //     ],
                // });


                //明置相关操作方法
                lib.element.content.mingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                    "step 0"
                    event.result = {};
                    if (get.itemtype(cards) != 'cards') {
                        event.result.bool = false;
                        event.finish();
                        return;
                    }
                    if (!event.str) {
                        event.str = get.translation(player.name) + '明置了手牌';
                    }
                    event.dialog = ui.create.dialog(event.str, cards);
                    event.dialogid = lib.status.videoId++;
                    event.dialog.videoId = event.dialogid;

                    if (event.hiddencards) {
                        for (var i = 0; i < event.dialog.buttons.length; i++) {
                            if (event.hiddencards.contains(event.dialog.buttons[i].link)) {
                                event.dialog.buttons[i].className = 'button card';
                                event.dialog.buttons[i].innerHTML = '';
                            }
                        }
                    }
                    game.broadcast(function (str, cards, cards2, id) {
                        var dialog = ui.create.dialog(str, cards);
                        dialog.videoId = id;
                        if (cards2) {
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (cards2.contains(dialog.buttons[i].link)) {
                                    dialog.buttons[i].className = 'button card';
                                    dialog.buttons[i].innerHTML = '';
                                }
                            }
                        }
                    }, event.str, cards, event.hiddencards, event.dialogid);
                    if (event.hiddencards) {
                        var cards2 = cards.slice(0);
                        for (var i = 0; i < event.hiddencards.length; i++) {
                            cards2.remove(event.hiddencards[i]);
                        }
                        game.log(player, '明置了', cards2);
                    }
                    else {
                        game.log(player, '明置了', cards);
                    }
                    game.delayx(2);
                    game.addVideo('showCards', player, [event.str, get.cardsInfo(cards)]);
                    "step 1"
                    game.broadcast('closeDialog', event.dialogid);
                    event.dialog.close();
                    if (!player.storage.mingzhi) player.storage.mingzhi = cards;
                    else player.storage.mingzhi = player.storage.mingzhi.concat(cards);
                    player.markSkill('mingzhi');
                    event.result.bool = true;
                    event.result.cards = cards;
                }

                lib.element.content.chooseMingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
                    "step 0"
                    if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                        event.finish();
                        return;
                    }
                    // player.chooseCard.applay(player,event._args);
                    player.choosePlayerCard.applay(player, [
                        event.selectButton, event.forced, event.prompt, NG.PositionType.Handcard, event.ai
                    ]);
                    next.set("filterButton", event.filterButton);
                    "step 1"
                    if (result && result.bool && result.cards) {
                        let str = event.str ? event.str : "";
                        player.mingzhiCard(result.cards, str);
                    }
                    //把当前操作结果返回
                    event.result = result;
                }

                lib.element.content.removeMingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
                    event.result = {};
                    if (get.itemtype(cards) != 'cards') {
                        event.finish();
                        event.result.bool = false;
                        return;
                    }
                    if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                        event.result.bool = false;
                        event.finish();
                        return;
                    }
                    game.log(player, '取消明置了', cards);
                    (<Card[]>player.storage.mingzhi).removeArray(event.cards);
                    if (player.storage.mingzhi.length) {
                        player.syncStorage("mingzhi");
                        player.markSkill('mingzhi');
                    } else {
                        delete player.storage.mingzhi;
                        player.unmarkSkill('mingzhi');
                    }
                    event.result.bool = true;
                    event.result.cards = event.cards;
                }

                lib.element.content.chooseRemoveMingzhiCard = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
                    "step 0"
                    if (!player.storage.mingzhi || !player.storage.mingzhi.length) {
                        event.finish();
                        return;
                    }
                    var next = player.choosePlayerCard.applay(player, [
                        event.target, event.selectButton, event.forced, event.prompt, NG.PositionType.Handcard, event.ai
                    ]);
                    next.set("filterButton", event.filterButton);
                    "step 1"
                    if (result && result.bool && result.links) {
                        player.removeMingzhiCard(result.links);
                    }
                    //把当前操作结果返回
                    result.cards = result.links;
                    event._result = result;
                }

                //player:
                //明置卡牌
                lib.element.player.mingzhiCard = function (cards, str) {
                    var next = game.createEvent('mingzhiCard');
                    next.player = this;
                    next.str = str;
                    // 如果cards是str（如果写反了，调换str和cards）
                    if (typeof cards == 'string') {
                        str = cards;
                        cards = next.str;
                        next.str = str;
                    }
                    //提前检测下是否有明牌
                    if (get.itemtype(cards) == 'card') next.cards = [cards];
                    else if (get.itemtype(cards) == 'cards') next.cards = cards;
                    // else _status.event.next.remove(next);
                    //过滤:
                    let mingzhiCards = this.getMingzhiCard();
                    for (let i = next.cards.length - 1; i >= 0; i--) {
                        const element = next.cards[i];
                        if (mingzhiCards.contains(element)) {
                            next.cards.splice(i, 1);
                        }
                    }
                    next.setContent('mingzhiCard');
                    if (!Array.isArray(next.cards) || !next.cards.length) {
                        _status.event.next.remove(next);
                    }
                    next._args = Array.from(arguments);
                    return next;
                }

                //选择明置的卡牌
                lib.element.player.chooseMingzhiCard = function () {
                    var next = game.createEvent('chooseMingzhiCard');
                    next.player = this;
                    for (var i = 0; i < arguments.length; i++) {
                        if (get.itemtype(arguments[i]) == 'player') {
                            next.target = arguments[i];
                        }
                        else if (typeof arguments[i] == 'number') {
                            next.selectButton = [arguments[i], arguments[i]];
                        }
                        else if (get.itemtype(arguments[i]) == 'select') {
                            next.selectButton = arguments[i];
                        }
                        else if (typeof arguments[i] == 'boolean') {
                            next.forced = arguments[i];
                        }
                        else if (typeof arguments[i] == 'function') {
                            next.ai = arguments[i];
                        }
                        else if (typeof arguments[i] == 'string') {
                            if (next.prompt) {
                                next.str = arguments[i];
                            } else {
                                next.prompt = arguments[i];
                            }
                        }
                    }
                    next.filterButton = function (button: Button, player: Player) {
                        return !lib.filter.filterMingzhiCard(player, button.link);
                    };
                    if (next.target == undefined) next.target = this;
                    if (next.selectButton == undefined) next.selectButton = [1, 1];
                    if (next.ai == undefined) next.ai = function (button) {
                        var val = get.buttonValue(button);
                        if (get.attitude(_status.event.player, get.owner(button.link)) > 0) return -val;
                        return val;
                    };
                    next.setContent('chooseMingzhiCard');
                    next._args = Array.from(arguments);
                    if (next.player.countCards(NG.PositionType.Handcard, function (card) {
                        return !lib.filter.filterMingzhiCard(next.player, card);
                    })) {
                        _status.event.next.remove(next);
                    }
                    return next;
                }

                //移除明置卡牌
                lib.element.player.removeMingzhiCard = function (cards) {
                    var next = game.createEvent('removeMingzhiCard');
                    next.player = this;
                    if (get.itemtype(cards) == 'card') next.cards = [cards];
                    else if (get.itemtype(cards) == 'cards') next.cards = cards;
                    // else _status.event.next.remove(next);
                    //过滤:
                    let mingzhiCards = this.getMingzhiCard();
                    for (let i = next.cards.length - 1; i >= 0; i--) {
                        const element = next.cards[i];
                        if (!mingzhiCards.contains(element)) {
                            next.cards.splice(i, 1);
                        }
                    }
                    next.setContent('removeMingzhiCard');
                    if (!Array.isArray(next.cards) || !next.cards.length) {
                        _status.event.next.remove(next);
                    }
                    next._args = Array.from(arguments);
                    return next;
                }

                //选择移除明置卡牌
                lib.element.player.chooseRemoveMingzhiCard = function () {
                    var next = game.createEvent('chooseRemoveMingzhiCard');
                    next.player = this;
                    for (var i = 0; i < arguments.length; i++) {
                        if (get.itemtype(arguments[i]) == 'player') {
                            next.target = arguments[i];
                        }
                        else if (typeof arguments[i] == 'number') {
                            next.selectButton = [arguments[i], arguments[i]];
                        }
                        else if (get.itemtype(arguments[i]) == 'select') {
                            next.selectButton = arguments[i];
                        }
                        else if (typeof arguments[i] == 'boolean') {
                            next.forced = arguments[i];
                        }
                        else if (typeof arguments[i] == 'function') {
                            if (next.ai) next.filterButton = arguments[i];
                            else next.ai = arguments[i];
                        }
                        else if (typeof arguments[i] == 'object' && arguments[i]) {
                            next.filterButton = function (button: Button, player: Player) {
                                return get.filter(arguments[i])(button.link);
                            };
                        }
                        else if (typeof arguments[i] == 'string') {
                            next.prompt = arguments[i];
                        }
                    }
                    if (next.filterButton == undefined) next.filterButton = lib.filter.all;
                    //整合明牌的过滤条件：
                    next.filterButton = NG.FunctionUtil.getConditon(NG.ConditionType.and, [
                        next.filterButton,
                        function (button: Button, player: Player) {
                            return lib.filter.filterMingzhiCard(player, button.link);
                        }
                    ]);
                    if (next.target == undefined) next.target = this;
                    if (next.selectButton == undefined) next.selectButton = [1, 1];
                    if (next.ai == undefined) next.ai = function (button) {
                        var val = get.buttonValue(button);
                        if (get.attitude(_status.event.player, get.owner(button.link)) > 0) return -val;
                        return val;
                    };
                    next.setContent('chooseRemoveMingzhiCard');
                    next._args = Array.from(arguments);
                    if (next.player.countCards(NG.PositionType.Handcard, function (card) {
                        return lib.filter.filterMingzhiCard(next.player, card);
                    })) {
                        _status.event.next.remove(next);
                    }
                    return next;
                }

                //获取玩家明置的卡牌
                lib.element.player.getMingzhiCard = function () {
                    let getCards = [];
                    if (this.storage.mingzhi && this.storage.mingzhi.length) {
                        getCards = this.storage.mingzhi.concat();
                    }
                    return getCards;
                }

                //设置全局技能：
                //尝试使用全局技能来修改使用明置牌方法得content：
                // lib.skill._replaceMingzhiContent = {
                //     trigger: {
                //         player: ["choosePlayerCardBefore", "discardPlayerCardBefore", "gainPlayerCardBefore","shunshouBefore"],//"choosePlayerCardBefore", 
                //     },
                //     forced: true,
                //     priority: 100,
                //     popup: false,
                //     forceDie: true,
                //     firstDo:true,
                //     filter: function (event, player) {
                //         // console.log("_replaceMingzhiContent--filter===>",event.target,event.target.storage.mingzhi);
                //         if (event.target && event.target.storage.mingzhi && event.target.storage.mingzhi.length) {
                //             return true;
                //         }
                //     },
                //     content: function () {
                //         //预先判定是否有明置牌：
                //         //重新设置content:
                //         //config.mingzhiBool
                //         // console.log("_replaceMingzhiContent===>",event,trigger);
                //         // console.log("_replaceMingzhiContent1===>",lib.element.content[trigger.name + 'ByMingzhi']);
                //         //只有主机重设了函数，没有通知出去：
                //         // game.broadcastAll(function(trigger){
                //         //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard","shunshou"];//"choosePlayerCard",
                //         //     if (trigger.target.storage.mingzhi) {
                //         //         if (eventNames.indexOf(trigger.name) > -1) {
                //         //             trigger.setContent(trigger.name + 'ByMingzhi');
                //         //             console.log("_replaceMingzhiContent2===>",trigger);
                //         //         }
                //         //     }
                //         // },trigger);
                //         //即使广播了，但是还是不能即时收到
                //         // if(event.isMine()){
                //         //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"];//"choosePlayerCard",
                //         //     if (trigger.target.storage.mingzhi) {
                //         //         if (eventNames.indexOf(trigger.name) > -1) {
                //         //             game.broadcastAll(function(triggerEvt:GameEvent){
                //         //                 triggerEvt.setContent(triggerEvt.name + 'ByMingzhi');
                //         //             },trigger);
                //         //         }
                //         //     }
                //         // } else if(event.isOnline()){
                // 		// 	event.send();
                // 		// }
                //         //注：
                //         //非联机的时候，没问题，可以正常看到别人手牌标记“明置”的牌，
                //         //联机的情况下，直接修改原来的content就可以，但是用这种动态替换就是不行，
                //         //但是奇怪的是，打印了出来的数据，content确实被替换了，就是显示出来明置，
                //         //而且，直接在控制台，输出当前事件，查看content，也确实被替换了；
                //         //试用事件的方式：
                //         player.replaceMingzhiContent(trigger);
                //     },
                // };
                // //改成替换“明置事件”：
                // lib.element.player.replaceMingzhiContent = function(trigger:GameEvent) {
                //     var next = game.createEvent('replaceMingzhiContent');
                //     next.player = this;
                //     next._trigger = trigger;
                //     next.setContent('replaceMingzhiContent');
                //     var eventNames = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"];
                //     if(!trigger.target || eventNames.indexOf(trigger.name) == -1) {
                //         _status.event.next.remove(next);
                //     }
                //     next._args = Array.from(arguments);
                //     return next;
                // }
                // lib.element.content.replaceMingzhiContent = function(){
                //     // game.broadcastAll(function(trigger){
                //     //     console.log("replaceMingzhiContent===>",trigger);
                //     //     trigger && trigger.setContent(trigger.name + 'ByMingzhi');
                //     // },trigger);
                //     "step 0"
                //     if(event.isMine()){
                //         console.log("replaceMingzhiContent===>",trigger);
                //         trigger && trigger.setContent(trigger.name + 'ByMingzhi');
                //     } else if(event.isOnline()){
                //         event.send();
                //     }
                //     "step 1"
                // }

                //注：经过多种，测试，目前不知什么方法可以实时替换content,只能退而求其次，修改player方法，在符合条件时使用mingzhi系列的content方法：
                //注：目前已经获取，可以实时修改函数的方式，后续跟进迭代：
                let tempchoosePlayerCard = lib.element.player.choosePlayerCard;
                lib.element.player.choosePlayerCard = function (...args) {
                    let next: GameEvent = this.choosePlayerCard.source.apply(this, args);
                    if (this.getMingzhiCard().length) {
                        next.setContent("choosePlayerCardByMingzhi");
                    }
                    return next;
                }
                lib.element.player.choosePlayerCard.source = tempchoosePlayerCard;
                let tempdiscardPlayerCard = lib.element.player.discardPlayerCard;
                lib.element.player.discardPlayerCard = function (...args) {
                    let next: GameEvent = this.discardPlayerCard.source.apply(this, args);
                    if (this.getMingzhiCard().length) {
                        next.setContent("discardPlayerCardByMingzhi");
                    }
                    return next;
                }
                lib.element.player.discardPlayerCard.source = tempdiscardPlayerCard;
                let tempgainPlayerCard = lib.element.player.gainPlayerCard;
                lib.element.player.gainPlayerCard = function (...args) {
                    let next: GameEvent = this.gainPlayerCard.source.apply(this, args);
                    if (this.getMingzhiCard().length) {
                        next.setContent("gainPlayerCardByMingzhi");
                    }
                    return next;
                }
                lib.element.player.gainPlayerCard.source = tempgainPlayerCard;
                // lib.element.player.lose
                // lib.element.content.shunshou
                // lib.skill.shunshou.content = function(){
                //     var position=get.is.single()?'he':'hej';
                //     if(target.countGainableCards(player,position)){
                //         player.gainPlayerCard(position,target,true);
                //     }
                // }

                //失去明置牌时，去除玩家得该明置牌标记
                lib.skill._loseMingzhi = {
                    trigger: {
                        global: "loseEnd"
                    },
                    forced: true,
                    priority: 101,
                    popup: false,
                    forceDie: true,
                    filter: function (event, player) {
                        if (player.storage.mingzhi && player.storage.mingzhi.length) {
                            return true;
                        }
                    },
                    content: function () {
                        event.cards = trigger.cards;
                        let mingzhiCard = [];
                        // console.log("_loseMingzhi===>",event.cards,player.storage,event);
                        // 明置的话就去除标记
                        for (var i = 0; i < event.cards.length; i++) {
                            if (player.storage.mingzhi && player.storage.mingzhi.contains(event.cards[i])) {
                                if (player.storage.mingzhi.length == 1) {
                                    delete player.storage.mingzhi;
                                    player.unmarkSkill('mingzhi');
                                } else {
                                    player.storage.mingzhi.remove(event.cards[i]);
                                    player.syncStorage('mingzhi');
                                }
                                mingzhiCard.push(event.cards[i]);
                            }
                        }
                        event.oCards = mingzhiCard;
                        if (event.oCards.length) {
                            event.source = trigger.player;
                            event.trigger("loseMingzhi");
                        }
                    },
                };
                //明置标记
                lib.skill.mingzhi = {
                    intro: {
                        content: 'cards',
                    },
                };
                lib.translate.mingzhi = '明置';

                lib.filter.filterMingzhiCard = function (player, card) {
                    return player.storage.mingzhi && (<Card[]>player.storage.mingzhi).contains(card);
                }


                return null;
            });
    })();
}