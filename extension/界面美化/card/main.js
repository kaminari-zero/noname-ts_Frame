app.import(function(lib, game, ui, get, ai, _status, app) {

  var plugin = {
    name: 'card',
    replaceImages: [
      'sha', 'shan', 'jiu', 'tao',
      'shandian', 'lebu', 'bingliang',
      'wanjian', 'nanman', 'jiedao', 'taoyuan',
      'huogong', 'juedou', 'wuzhong', 'wugu',
      'shunshou', 'tiesuo', 'wuxie', 'guohe',
      'yuanjiao', 'zhibi', 'yiyi', 'lianjunshengyan',
      'shuiyanqijun', 'lulitongxin',
      'zhuque', 'zhuge', 'wuliu', 'yinyueqiang',
      'hanbing', 'cixiong', 'qinggang', 'qinglong',
      'zhangba', 'guanshi', 'fangtian', 'qilin',
      'qibaodao', 'guding', 'ly_piliche',
      'bagua', 'tengjia', 'baiyin', 'renwang',
      'rewrite_bagua', 'rewrite_zhuge', 'rewrite_tengjia',
      'rewrite_renwang', 'rewrite_baiyin', 'huxinjing',
      'chitu', 'hualiu', 'zhuahuang', 'dilu',
      'jueying', 'dawan', 'zixin', 'cixiong',
      'dinglanyemingzhu', 'wy_meirenji', 'wy_xiaolicangdao'
    ],
    cardNameImages: ['sha', 'shan', 'jiu', 'tao'],
    filter: function() {
      return !['chess', 'tafang', 'stone', 'connect'].contains(get.mode());
    },
    content: function(next) {
      return app.waitAllFunction([
        function (next) {
          game.saveConfig('phonelayout', true);
          game.saveConfig('cardshape', 'default');
          game.saveConfig('fold_card', true);
          next();
        },
        function(next) {
          lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main', next);
        },
      ], next);
    },
    precontent: function () {

      app.reWriteFunction(lib.configMenu.appearence.config, {
        update: [null, function(res, config, map) {
          map.cardshape.hide();
          map.card_style.hide();
          map.cardback_style.hide();
          map.phonelayout.hide();
          map.cardtext_font.hide();
          map.fold_card.hide();
        }],
      });

      app.reWriteFunction(ui, {
        updatehl: [/112/g, '91'],
      });
      app.reWriteFunction(ui, {
        updatehl: [null, function() {
          plugin.getViewCard(game.me.getCards(), game.me);
        }],
      });
      app.reWriteFunction(game, {
        loop: [function() {
          if (game.players && game.players.length) {
            game.players.forEach(function(player) {
              plugin.getViewCard(player.getCards(), player);
            });
          }
        }],
      });

      app.reWriteFunction(lib.element.card, {
        init: [null, function(card, info) {
          if (plugin.replaceImages.contains(info[2])) {
            card.node.image.style.backgroundImage = 'url(' + lib.assetURL + 'extension/' + app.name + '/' + plugin.name + '/images/card/' + info[2] + '.png)';
          }

          if (card.classList.contains('fullskin')) {
            var suit = get.suit(card);
            var number = get.number(card);
            card.node.suitNumber.innerHTML = '';
            if (number) {
              ui.create.div('.number', card.node.suitNumber).css({
                backgroundImage: 'url(' + app.path.ext(plugin.name + '/images/number/' + get.color(card) + '/' + number) + '.png)',
              });
            }
            if (suit) {
              ui.create.div('.suit', card.node.suitNumber).css({
                backgroundImage: 'url(' + app.path.ext(plugin.name + '/images/suit/' + suit) + '.png)',
              });
            }

            if (!number && !suit) {
              card.node.info.show();
            } else {
              card.node.info.hide();
            }

            if (!card.classList.contains('button')) {
              var type = get.type(card);
              if (['delay', 'trick'].contains(type)) {
                type = '锦囊';
              } else {
                type = get.translation(type);
              }
              card.node.cardType.innerText = type;
              card.node.cardType.dataset.type = type;
            }

            if (plugin.cardNameImages.contains(card.name)) {
              card.node.name.dataset.nameImage = card.name;
              if (card.nature) {
                card.node.name.dataset.cardNature = card.nature;
              }
            }
          } else {
            card.node.cardType.hide();
            card.node.suitNumber.hide();
          }
        }],
      });
      app.reWriteFunction(lib.element.player, {
        $throw: [function(args, cards) {
          if (Array.isArray(cards) && cards.length === 0) {
            var evt = _status.event;
            if (evt && evt.card && evt.cards === cards) {
              var card = ui.create.card().init([
                evt.card.suit,
                evt.card.number,
                evt.card.name,
                evt.card.nature,
              ]);
              card.dataset.virtualCard = true;
              args[0] = card;
            }
          }

          setTimeout(function() {
            var _cards = Array.isArray(cards) ? cards : [cards];
            _cards.forEach(function (item) {
              if (item._xitem) {
                item._xitem.delete();
                delete item._xitem;
              }
            });
          }, 0);
        }],
      });
      app.reWriteFunction(HTMLDivElement.prototype, {
        fix: [function() {
          if (get.itemtype(this) === 'card') {
            plugin.getViewCard(this);
          }
        }],
      });

      app.reWriteFunction(ui.create, {
        card: [null, function(node) {
          node.node.cardType = ui.create.div('.cardType', node);
          node.node.suitNumber = ui.create.div('.suitNumber', node);
          node.node.disBg = ui.create.div('.disbg', node);
          node.node.viewAs = ui.create.div('.viewAs', node);
          node.node.changeMark = ui.create.div('.changeMark', node);
          node.node.virtualMark = ui.create.div('.virtualMark', node);
          node.cardId = 'card-' + get.id();
          node.dataset.id = node.cardId;
        }],
      });

      lib.element.player.$throwordered2 = function(node, nosource) {
        node.classList.add('thrown');
        node.classList.add('center');
        node.hide();
        node.style.transitionProperty = 'left,top,opacity,transform';
        
        var evt = _status.event;
        if (evt.card && evt.card.cards) {
          for (var i = 0; i < evt.card.cards.length; i++) {
            if (evt.card.cards[i].clone === node) {
              plugin.cardChangeTo(node, [
                evt.card.suit,
                evt.card.number,
                evt.card.name,
                evt.card.nature,
              ]);
              break;
            }
          }
        }

        if (!nosource) {
          var nx = [50, -52];
          var ny = [50, -52];
          nx = nx[0] * ui.arena.offsetWidth / 100 + nx[1];
          ny = ny[0] * ui.arena.offsetHeight / 100 + ny[1];
          var dx = this.getLeft() + this.offsetWidth / 2 - 52 - nx;
          var dy = this.getTop() + this.offsetHeight / 2 - 52 - ny;
        }
        node.style.transform = ' translate(' + dx + 'px,' + dy + 'px)';
        ui.arena.appendChild(node);
        ui.refresh(node);
        for (var i = 0; i < ui.thrown.length; i++) {
          if (ui.thrown[i].parentNode != ui.arena ||
            ui.thrown[i].classList.contains('removing')) {
            ui.thrown.splice(i--, 1);
          }
        }
        ui.thrown.push(node);
        var center = (ui.thrown.length - 1) / 2;
        var offset = 90;
        if (ui.arena.offsetWidth < ui.thrown.length * 90) {
          offset = ui.arena.offsetWidth / ui.thrown.length;
        }

        ui.thrown.forEach(function (item, index) {
          var x = (index - center) * offset;
          item.style.transform = 'translate(' + x + 'px, 0)';
        });
        node.show();
        lib.listenEnd(node);
        return node;
      };

      app.on('updatejm', function(player) {
        plugin.updatej(player);
      });
    },
    getViewCard: function(card, player) {
      if (get.itemtype(card) === 'cards') {
        return card.map(function(item) {
          return plugin.getViewCard(item, player);
        });
      }
      if (get.itemtype(card) !== 'card') return;
      var viewName, viewNature, viewSuit;

      if (get.itemtype(player) === 'player') {
        var skills = player.getSkills(true, false).concat(lib.skill.global);
        game.expandSkills(skills);
        for (var i = 0; i < skills.length; i++) {
          var info = lib.skill[skills[i]];
          if (info.mod && info.mod.cardname) {
            viewName = info.mod.cardname(card, player, viewName);
          }
          if (info.mod && info.mod.cardnature) {
            viewNature = info.mod.cardnature(card, player, viewName);
          }
          if (info.mod && info.mod.suit) {
            viewSuit = info.mod.suit(card, viewSuit || get.suit(card));
          }
        }
      }

      var viewCard = [viewSuit, get.number(card), viewName, viewNature];
      if (viewCard[2]) {
        if (!card.dataset.viewAsCard) {
          card.node.viewAs.innerHTML = '<div>' + get.translation({
            name: viewCard[2],
            nature: viewCard[3],
          }) + '</div>';
          if (plugin.cardNameImages.contains(viewCard[2])) {
            card.node.viewAs.firstChild.dataset.nameImage = viewCard[2];
            card.node.viewAs.firstChild.dataset.cardNature = viewCard[3];
          }
          card.dataset.viewAsCard = true;
        }
      } else {
        card.node.viewAs.innerHTML = '';
        card.removeAttribute('data-view-as-card');
      }
      return viewCard;
    },
    cardChangeTo: function(card, changeTo) {
      if (Array.isArray(changeTo)) {
        changeTo = ui.create.card().init(changeTo);
      }
      if (get.itemtype(card) !== 'card') return;
      if (get.itemtype(changeTo) !== 'card') return;

      card.innerHTML = changeTo.innerHTML;
      card.node = {
        name: card.querySelector('.name'),
        info: card.querySelector('.info'),
        intro: card.querySelector('.intro'),
        background: card.querySelector('.background'),
        image: card.querySelector('.image'),
      };
      card.name = changeTo.name;
      card.suit = changeTo.suit;
      card.number = changeTo.number;

      for (var i in card.dataset) {
        delete card.dataset[i];
      }
      for (var i in changeTo.dataset) {
        card.dataset[i] = changeTo.dataset[i];
      }
      card.dataset.changeCard = true;
      return card;
    },
    updatej: function(player) {
      var node = player.node.xJudges;
      if (!node) return;
      if (!ui.arena) return;
      if (player === game.me && node.parentNode !== ui.arena) {
        node.goto(ui.arena);
      } else if (player !== game.me && node.parentNode !== player) {
        node.goto(player);
      }

      setTimeout(function() {
        Array.from(player.node.judges.childNodes).forEach(function (card) {
          var item = node.querySelector('[data-id="' + card.cardId + '"]');
          console.info(card.cardId, item);
          if (item) return;
          if (card.classList.contains('removing')) return;
          item = ui.create.div(node);
          item.dataset.id = card.cardId;
          item.name = card.viewAs || card.name;
          item.innerHTML = get.translation(item.name).slice(0, 1);
          item.delete = function() {
            item.classList.add('removing');
            item.listenTransition(function () {
              item.remove();
            });
          };
          card._xitem = item;
        });
      }, 0);
    },
  };

  return plugin;
});
