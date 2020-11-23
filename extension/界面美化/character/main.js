app.import(function(lib, game, ui, get, ai, _status, app) {
  var plugin = {
    name: 'character',
    filter: function() {
      return !['chess', 'tafang', 'stone', 'connect'].contains(get.mode());
    },
    content: function (next) {
      app.waitAllFunction([
        function(next) {
          game.saveConfig('layout', 'long2');
          game.saveConfig('die_move', 'off');
          game.saveConfig('player_height', 'custom');
          next();
        },
        function(next) {
          var mode = get.mode();
          var isDouble = mode === 'guozhan' || get.config('double_character', mode);
          ui.css.hp_style = lib.init.css(lib.assetURL + 'theme/style/hp', isDouble ? 'round' : 'glass', next);
        },
        function(next) {
          lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main', next);
        },
      ], next);
    },
    precontent: function() {
      app.reWriteFunction(ui.create, {
        button: ['case \'character\':', 'case \'character\':node = plugins.character.createCharacterButton(item,type,position,noclick,node);break;'],
        player: [function(args) {
          args[1] = true;
        }, function (node, position, noclick) {
          node.classList.add('xplayer');
          node.node.group = ui.create.div('.group', node);
          node.node.xJudges = ui.create.div('.xjudge', node);
          node.node.judges.style.display = 'none';
          node.node.marks.classList.add('unshow');
          node.node.equips.addEventListener('DOMSubtreeModified', function(e) {
            plugin.updatee(node);
          });
          
          ui.create.div('.guess', '?', node.node.identity);

          if (!noclick) {
            var event = lib.config.touchscreen ? 'touchend' : 'click';
            node.addEventListener(event, ui.click.target);
            node.node.identity.addEventListener(event, plugin.click.identity);
            if (lib.config.touchscreen) {
              node.addEventListener('touchstart', ui.click.playertouchstart);
            }
          }

          Object.defineProperty(node, 'identity', {
            get: function () {
              return node.dataset.identity;
            },
            set: function (identity) {
              if (get.mode() === 'guozhan') {
                node.group = identity;
              }
              return node.dataset.identity = identity;
            },
            configurable: true,
          });
        }],
      });

      app.reWriteFunction(lib.configMenu.appearence.config, {
        update: [null, function (args, config, map) {
          map.layout.hide();
          map.player_height.hide();
          map.player_height_nova.hide();
          map.hp_style.hide();
          map.die_move.hide();
        }],
      });

      app.reWriteFunction(lib.element.player, {
        init: [function () {
          var node = this;
          delete node.group;
          Object.defineProperty(node, 'group', {
            configurable: true,
            get: function () {
              return node.dataset.group;
            },
            set: function (group) {
              node.node.group.css({ innerHTML: get.translation(group) }).show();
              node.node.name.removeAttribute('data-nature');
              return node.dataset.group = group;
            },
          });
          ui.updatej(node);
        }],

        uninit: [null, function () {
          this.removeAttribute('data-group');
          this.node.group.hide();
          if (ui.updateSkillControl) {
            ui.updateSkillControl(this, true);
          }
        }],

        update: ['this.maxHp>9||', 'this.maxHp>9||this.classList.contains("xplayer") && this.maxHp > 5||'],
      });

      app.reWriteFunction(game, {
        switchMode: [null, function (res, name) {
          ui.arena.dataset.mode = name;
        }],
      });

      app.reWriteFunction(lib, {
        setIntro: [function (args, node) {
          if (get.itemtype(node) === 'player') {
            if (lib.config.touchscreen) {
              lib.setLongPress(node, plugin.click.playerIntro);
            } else {
              if (lib.config.right_info) {
                node.oncontextmenu = plugin.click.playerIntro;
              }
            }
            return node;
          }
        }],
      });

      app.once('createArenaAfter', function () {
        ui.arena.classList.remove('lslim_player');
        ui.arena.classList.add('cxy-new-ui');
        ui.arena.dataset.mode = get.mode();
        if (get.config('double_character', get.mode())) {
          ui.arena.dataset.doubleCharacter = true;
        }
      });
    },
    createHp: function(str, node, isDouble) {
      var hp = 0, maxHp = 0;
      if (typeof str === 'number') {
        hp = str;
        maxHp = str;
      } else {
        hp = get.infoHp(str);
        maxHp = get.infoMaxHp(str);
      }

      if (maxHp > 5 && !isDouble || isDouble && maxHp > 10) {
        node.innerHTML = (hp === maxHp ? ['×', hp] : [hp, '\\', maxHp]).map(function(item) {
          return '<span data-type="' + item + '">' + item + '</span>'
        }).join('');
        node.insertBefore(ui.create.div('.hp-icon.half'), node.firstChild);
        return node;
      }

      if (isDouble) {
        for (var i = 1; i <= Math.ceil(maxHp / 2); i++) {
          var icon = ui.create.div('.hp-icon');
          if (i * 2 > hp) {
            icon.classList.add(i * 2 - hp === 1 ? 'half' : 'losed');
          }
          node.insertBefore(icon, node.firstChild);
        }
      } else {
        for (var i = maxHp; i > 0; i--) {
          var icon = ui.create.div('.hp-icon', node);
          if (i > hp) icon.classList.add('losed');
        }
      }
    },
    createCharacterButton: function(item, type, position, noclick, node) {
      if (node) {
        node.classList.add('button');
        node.classList.add('character');
        node.style.display = '';
      } else {
        node = ui.create.div('.button.character', position);
      }

      node.link = item;

      node.node = {
        avatar: ui.create.div('.avatar', node).setBackground(item, 'character'),
        name: ui.create.div('.name', node),
        hp: ui.create.div('.hp', node),
        intro: ui.create.div('.intro', node),
        group: ui.create.div('.group', node),
      };

      var isDoubleCharacter = get.mode() === 'guozhan' || get.config('double_character', get.mode());
      if (isDoubleCharacter) {
        node.dataset.isDouble = true;
      }
      var infoitem = lib.character[item];
      if (!infoitem) {
        for (var itemx in lib.characterPack) {
          if (lib.characterPack[itemx][item]) {
            infoitem = lib.characterPack[itemx][item]; break;
          }
        }
      }

      node.node.name.innerHTML = get.slimName(item);
      node.node.intro.innerHTML = lib.config.intro;
      plugin.createHp(infoitem[2], node.node.hp, isDoubleCharacter);

      if (!noclick) {
        lib.setIntro(node);
      }

      if (infoitem[1]) {
        node.node.group.innerHTML = get.translation(infoitem[1]);
        node.dataset.group = infoitem[1];
      } else {
        node.node.group.style.display = 'none';
      }
      return node;
    },
    click: {
      identity: function(e) {
        e.stopPropagation();
        var player = this.parentNode;
        if (!game.getIdentityList) return;
        if (player.node.guessDialog) {
          player.node.guessDialog.classList.toggle('hidden');
        } else {
          var list = game.getIdentityList(player);
          if (!list) return;
          var guessDialog = ui.create.div('.guessDialog', player);
          var container = ui.create.div(guessDialog);
          for (var k in list) {
            var node = ui.create.div('.guessId', '<div>' + get.translation(k) + '</div>', container, function() {
              var idnode = player.node.identity;
              idnode.dataset.color = this.dataset.color;
              idnode.firstChild.innerHTML = get.translation(this.dataset.color);

              if (this.dataset.color === 'cai' || this.dataset.color === 'unknown') {
                idnode.classList.add('guessing');
              } else {
                idnode.classList.remove('guessing');
              }
              player.node.guessDialog.classList.add('hidden');
            });
            node.dataset.color = k;
            if (k === 'cai' || k === 'unknown') {
              node.innerHTML = '<div>?</div>';
            }
          }
          lib.setScroll(guessDialog);
          player.node.guessDialog = guessDialog;
        }
      },
      playerIntro: function(e) {
        e.stopPropagation();

        if (plugin.playerDialog) {
          return plugin.playerDialog.show(this);
        }

        var container = ui.create.div('.popup-container.hidden', ui.window, function (e) {
          if (e.target === container) {
            container.hide();
            game.resume2();
          }
        });
        var dialog = ui.create.div('.character-dialog.popped', container);
        var leftPane = ui.create.div('.left', dialog);
        var rightPane = ui.create.div('.right', dialog);

        var createButton = function(name, parent) {
          if (!name) return;
          if (!lib.character[name]) return;
          var button = ui.create.button(name, 'character', parent, true);
        };

        container.show = function(player) {
          var name = player.name1 || player.name;
          var name2 = player.name2;
          if (player.classList.contains('unseen') && player !== game.me) {
            name = 'unknown';
          }
          if (player.classList.contains('unseen2') && player !== game.me) {
            name2 = 'unknown';
          }

          leftPane.innerHTML = '<div></div>';
          createButton(name, leftPane.firstChild);
          createButton(name2, leftPane.firstChild);
          if (name && name2) {
            dialog.classList.remove('single');
          } else {
            dialog.classList.add('single');
          }

          rightPane.innerHTML = '<div></div>';
          lib.setScroll(rightPane.firstChild);
          var eSkills = player.getCards('e');
          var oSkills = app.get.playerSkills(player, false, false);
          var judges = player.getCards('j');

          if (oSkills.length) {
            ui.create.div('.xcaption', '武将技能', rightPane.firstChild);
            oSkills.forEach(function(name) {
              var obj = app.get.skillInfo(name, player);
              ui.create.div('.xskill', '<div data-color>【' + obj.nameSimple + '】</div>' +
                '<div>' + obj.translation + '</div>', rightPane.firstChild);
            });
          }

          if (judges.length) {
            ui.create.div('.xcaption', '判定区域', rightPane.firstChild);
            judges.forEach(function(card) {
              ui.create.div('.xskill', '<div data-color>【' + get.translation(card.name) + '】</div><div>' + get.translation((card.viewAs || card.name) + '_info') + '</div>', rightPane.firstChild);
            });
          }

          if (eSkills.length) {
            ui.create.div('.xcaption', '装备区域', rightPane.firstChild);
            eSkills.forEach(function (item) {
              ui.create.div('.xskill', '<div data-color>【' + get.translation(item.name) + '】</div><div>' + get.translation(item.name + '_info') + '</div>', rightPane.firstChild);
            });
          }
          container.classList.remove('hidden');
          game.pause2();
        };
        plugin.characterDialog = container;
        container.show(this);
      },
    },
    updatee: function(player) {
      app.nextTick(function() {
        var node = player.node.equips;
        var bottom = Math.max(0, (4 - node.childNodes.length) * 22) * 0.8;
        node.style.bottom = bottom + 'px';
        app.emit('playerUpdateE', player);
      });
    },
  };
  return plugin;
});
