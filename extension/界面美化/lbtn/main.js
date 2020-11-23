app.import(function (lib, game, ui, get, ai, _status, app) {
  var plugin = {
    name: 'lbtn',
    filter: function () {
      return !['chess', 'tafang', 'stone', 'connect'].contains(get.mode());
    },
    content: function (next) {
      app.waitAllFunction([
        function(next) {
          game.saveConfig('auto_confirm', false);
          game.saveConfig('custom_button', false);
          next();
        },
        function (next) {
          lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main', next);
        },
      ], next);
    },
    precontent: function () {
      app.reWriteFunction(ui.create, {
        me: [function() {
          plugin.create.control();
        }, null],

        control: [function() {
          if (arguments[1] !== '结束回合') return;
          return ui.create.control(function () {
            if (_status.event.skill) {
              ui.click.cancel();
            }
            ui.click.cancel();
            if (ui.confirm) {
              ui.confirm.close();
            }
          });
        }],

        arena: [null, function() {
          if (ui.time3) ui.time3.delete();
          if (ui.cardPileNumber) ui.cardPileNumber.delete();
          ui.cardRoundTime = plugin.create.cardRoundTime();
        }],

        cards: [null, function() {
          if (ui.cardRoundTime) {
            ui.cardRoundTime.updateRoundCard();
          }
        }],
      });
      app.reWriteFunction(lib.configMenu.general.config, {
        update: [null, function(res, config, map) {
          map.auto_confirm.hide();
        }],
      });
      app.reWriteFunction(game, {
        check: [null, function() {
          if (ui.confirm) {
            var node = ui.confirm.node.cancel;
            if (node.classList.contains('disabled') && 
              !_status.event.skill &&
              _status.event.type === 'phase') {
              node.innerHTML = '结束出牌';
              node.dataset.type = 'endButton';
            } else {
              node.innerHTML = '取消';
              delete node.dataset.type;
            }
            ui.updatec();
          }
        }],
        updateRoundNumber: [function() {
          if (ui.cardRoundTime) {
            ui.cardRoundTime.updateRoundCard();
          }
          return true;
        }],
      });
      app.reWriteFunction(lib.configMenu.appearence.config, {
        update: [null, function(res, config, map) {
          map.control_style.hide();
          map.custom_button.hide();
          map.custom_button_system_top.hide();
          map.custom_button_system_bottom.hide();
          map.custom_button_control_top.hide();
          map.custom_button_control_bottom.hide();
          map.radius_size.hide();
        }],
      });

      ui.create.confirm = function(str, func) {
        var confirm = ui.confirm;
        if (!confirm) {
          confirm = ui.confirm = plugin.create.confirm();
        }
        confirm.node.ok.classList.add('disabled');
        confirm.node.cancel.classList.add('disabled');
        if (str) {
          if (str.indexOf('o') !== -1) {
            confirm.node.ok.classList.remove('disabled');
          }
          if (str.indexOf('c') !== -1) {
            confirm.node.cancel.classList.remove('disabled');
          }
          confirm.str = str;
        }

        if (func) {
          confirm.custom = func;
        }
        ui.updatec();
        confirm.update();
      };

      Object.assign(game.videoContent, {
        createCardRoundTime: function() {
          ui.cardRoundTime = plugin.create.cardRoundTime();
        },
        updateCardRoundTime: function(opts) {
          if (!ui.cardRoundTime) return;
          ui.cardRoundTime.node.roundNumber.innerHTML = '<span>第' + opts.roundNumber + '轮</span>';
          ui.cardRoundTime.setNumberAnimation(opts.cardNumber);
        },
      });
    },
    create: {
      control: function() {
        var node = ui.create.div('.lbtn-controls', ui.arena);
        ui.create.div('.lbtn-control', node, '牌序', plugin.click.paixu);
        ui.create.div('.lbtn-control', node, '记录', ui.click.pause);
      },
      confirm: function () {
        var confirm = ui.create.control('<span>确定</span>', 'cancel');
        confirm.classList.add('lbtn-confirm');
        confirm.node = {
          ok: confirm.firstChild,
          cancel: confirm.lastChild,
        };
        confirm.node.ok.link = 'ok';
        confirm.node.ok.classList.add('primary');
        confirm.custom = plugin.click.confirm;
        app.reWriteFunction(confirm, {
          close: [function() {
            this.classList.add('closing');
          }],
        });
        for (var k in confirm.node) {
          confirm.node[k].classList.add('disabled');
          confirm.node[k].removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control);
          confirm.node[k].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('disabled')) {
              if (this.link === 'cancel' && this.dataset.type === 'endButton' && _status.event.endButton) {
                _status.event.endButton.custom();
              }
              return;
            }
            if (this.parentNode.custom) {
              this.parentNode.custom(this.link, this);
            }
          });
        }

        if (ui.skills2 && ui.skills2.skills.length) {
          var skills = ui.skills2.skills;
          confirm.skills2 = [];
          for (var i = 0; i < skills.length; i++) {
            var item = document.createElement('div');
            item.link = skills[i];
            item.innerHTML = get.translation(skills[i]);
            item.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function(e) {
              e.stopPropagation();
              ui.click.skill(this.link);
            });
            confirm.skills2.add(item);
            item.dataset.type = 'skill2';
            confirm.insertBefore(item, confirm.firstChild);
          }
        }

        confirm.update = function() {
          if (confirm.skills2) {
            if (_status.event.skill && _status.event.skill !== confirm.dataset.skill) {
              confirm.dataset.skill = _status.event.skill;
              confirm.skills2.forEach(function (item) {
                item.remove();
              });
              ui.updatec();
            } else if (!_status.event.skill && confirm.dataset.skill) {
              delete confirm.dataset.skill;
              confirm.skills2.forEach(function (item) {
                confirm.insertBefore(item, confirm.firstChild);
              });
              ui.updatec();
            }
          }
        };
        return confirm;
      },
      cardRoundTime: function() {
        var node = ui.create.div('.cardRoundNumber', ui.arena).hide();
        node.node = {
          cardPileNumber: ui.create.div('.cardPileNumber', node),
          roundNumber: ui.create.div('.roundNumber', node),
          time: ui.create.div('.time', node),
        };

        node.updateRoundCard = function() {
          var cardNumber = ui.cardPile.childNodes.length || 0;
          var roundNumber = game.roundNumber || 0;
          this.node.roundNumber.innerHTML = '<span>第' + roundNumber + '轮</span>';
          this.setNumberAnimation(cardNumber);
          this.show();
          game.addVideo('updateCardRoundTime', null, {
            cardNumber: cardNumber,
            roundNumber: roundNumber,
          });
        };

        node.setNumberAnimation = function(num, step) {
          var item = this.node.cardPileNumber;
          clearTimeout(item.interval);
          if (!item._num) {
            item.innerHTML = '<span>' + num + '</span>';
            item._num = num;
          } else {
            if (item._num !== num) {
              if (!step) step = 500 / Math.abs(item._num - num);
              if (item._num > num) item._num--;
              else item._num++;
              item.innerHTML = '<span>' + item._num + '</span>';
              if (item._num !== num) {
                item.interval = setTimeout(function () {
                  node.setNumberAnimation(num, step);
                }, step);
              }
            }
          }
        };

        ui.time3 = node.node.time;
        ui.time3.sec = 0;
        ui.time3.interval = setInterval(function() {
          var min = Math.floor(ui.time3.sec / 60);
          var sec = ui.time3.sec % 60;
          if (min < 10) min = '0' + min;
          if (sec < 10) sec = '0' + sec;
          ui.time3.innerHTML = '<span>' + min + ':' + sec + '</span>';
          ui.time3.sec++;
        }, 1000);
        game.addVideo('createCardRoundTime');
        return node;
      },
    },
    click: {
      paixu: function() {
        if (!game.me) return;
        var cards = game.me.getCards('h').reverse();
        if (!cards.length) return;


        var same;
        if (plugin._paixu && plugin._paixu.length) {
          same = true;
          if (plugin._paixu.length !== cards.length) {
            same = false;
          } else {
            for (var i = 0; i < plugin._paixu.length; i++) {
              if (cards[i] !== plugin._paixu[i]) {
                console.info(cards[i], plugin._paixu[i], i);
                same = false;
                break;
              }
            }
          }
        }

        if (same) {
          cards = cards.reverse();
        } else {
          var compares = ['type', 'name', 'nature', 'suit', 'number'];
          cards.sort(function (a, b) {
            for (var i = 0; i < compares.length; i++) {
              var value1 = get[compares[i]](a);
              var value2 = get[compares[i]](b);
              if (value2 !== value1) {
                return plugin.compare[compares[i]](value2, value1);
              }
            }
            return 0;
          });
        }

        cards.forEach(function(item) {
          item.goto(ui.special);
        });
        game.me.directgain(cards, false);
        ui.updatehl();
        plugin._paixu = cards;
      },
      confirm: function(link, target) {
        if (link === 'ok') {
          ui.click.ok(target);
        } else if (link === 'cancel') {
          ui.click.cancel(target);
        } else if (target.custom) {
          target.custom(link);
        }
      },
    },
    compare: {
      type: function(a, b) {
        if (a === b) return 0;
        var types = ['basic', 'trick', 'delay', 'equip'].addArray([a, b]);
        return types.indexOf(a) - types.indexOf(b);
      },
      name: function(a, b) {
        if (a === b) return 0;
        return a > b ? 1 : -1;
      },
      nature: function(a, b) {
        if (a === b) return 0;
        var nature = [undefined, 'fire', 'thunder'].addArray([a, b]);
        return nature.indexOf(a) - nature.indexOf(b);
      },
      suit: function(a, b) {
        if (a === b) return 0;
        var suit = ['diamond', 'heart', 'club', 'spade'].addArray([a, b]);
        return suit.indexOf(a) - suit.indexOf(b);
      },
      number: function(a, b) {
        return a - b;
      },
    },
  };
  return plugin;
});
