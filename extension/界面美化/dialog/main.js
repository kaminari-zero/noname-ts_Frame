app.import(function(lib, game, ui, get, ai, _status, app) {
  var plugin = {
    name: 'dialog',
    content: function(next) {
      app.waitAllFunction([
        function(next) {
          game.saveConfig('button_press', false);
          next();
        },
        function(next) {
          lib.init.css(lib.assetURL + 'extension/' + app.name +
            '/' + plugin.name, 'main', next);
        },
      ], next);
    },
    precontent: function() {
      app.reWriteFunction(ui.create, {
        dialog: [null, function(dialog) {
          dialog.classList.add('xdialog');
          app.reWriteFunction(dialog, {
            hide: [null, function() {
              app.emit('dialog:change', dialog);
            }],
          });
        }],
      });

      app.reWriteFunction(lib.element.dialog, {
        open: [null, function() {
          app.emit('dialog:change', this);
        }],
        close: [null, function() {
          app.emit('dialog:change', this);
        }],
      });

      app.reWriteFunction(lib.element.player, {
        mark: [function(args, name, info, skill) {
          if (get.itemtype(name) === 'cards') {
            var player = this;
            return name.map(function(item) {
              return player.mark(item, info, skill);
            });
          }
          var node = ui.create.div('.markitem.card');
          node.node = {
            name: ui.create.div('.markitemname', node),
            count: ui.create.div('.markitemcount', node),
            extra: ui.create.div('.markitemextra', node),
          };
          Object.assign(node, plugin.element.mark);
          if (get.itemtype(name) === 'card') {
            node.card = name;
            node.name = skill || name.name;
          } else {
            node.name = name;
          }
          node.info = info;
          node.skill = skill || name;
          node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', plugin.click.mark);
          node.setName(node.name);

          node.node.name.remove = function() {};

          this.node.marks.insertBefore(node, this.node.marks.childNodes[1]);
          this.updateMarks();
          ui.updatem(this);
          return node;
        }],
        unmark: [function(args, name, info) {
          if (get.itemtype(name) === 'cards') {
            var player = this;
            return name.map(function (item) {
              return player.unmark(item, info);
            });
          }
          if (get.itemtype(name) === 'card') {
            return this.unmark(name.name, info);
          }
          var player = this;
          var marks = Array.from(this.node.marks.childNodes);
          for (var i = 0; i < marks.length; i++) {
            if (item.name !== name) continue;
            if (info && info !== item.info) continue;
            item.delete();
            ui.updatem(player);
            break;
          }
          return this;
        }],
        updateMark: [function(args, name, storage) {
          if (!this.marks[name]) {
            if (lib.skill[i] &&
              lib.skill[i].intro &&
              (this.storage[i] || lib.skill[i].intro.markcount)) {
              this.markSkill(i);
              if (!this.marks[i]) return this;
            } else {
              return this;
            }
          }

          if (storage && this.storage[name]) {
            this.syncStorage(name);
          }

          var num;
          var extra;

          var info = lib.skill[name];
          if (info && info.intro && info.intro.markcount) {
            num = info.intro.markcount(this.storage[name], this);
          } else if (info && info.intro && info.intro.nocount) {
            num = false;
          } else if (typeof this.storage[name + '_markcount'] === 'number') {
            num = this.storage[name + '_markcount'];
          } else if (typeof this.storage[name] === 'number') {
            num = this.storage[name];
          } else if (Array.isArray(this.storage[name])) {
            num = this.storage[name].length;
          } else if (name === 'ghujia') {
            num = this.hujia;
          }

          if (info && info.intro && info.intro.markExtra) {
            extra = info.intro.markExtra;
            if (typeof extra === 'function') {
              extra = extra(this.storage[name], this);
            }
          }

          this.marks[name].setCount(num);
          this.marks[name].setExtra(extra);

          if (!num && info && info.mark === 'auto') {
            this.unmarkSkill(name);
          }
          return this;
        }],
        markSkill: [function(args, name) {
          var info = lib.skill[name];
          if (!info) return;
          if (info.limited) return this;
          if (info.intro && info.intro.content === 'limited') return this;
        }],
      });

      app.on('dialog:change', function (dialog) {
        app.nextTick([
          function() {
            if (dialog) {
              if (dialog.content.childNodes.length === 1 &&
                dialog.content.firstChild.classList.contains('caption')) {
                dialog.classList.add('onlycaption');
              } else {
                dialog.classList.remove('onlycaption');
              }
            }
          },
          function() {
            if (!ui.arena) return;
            if (ui.arena.querySelector('.xdialog.onlycaption:not(.hidden):not(.removing)')) {
              ui.arena.classList.add('onlycapitondialog');
            } else {
              ui.arena.classList.remove('onlycapitondialog');
            }
          },
        ]);
      });

      app.reWriteFunction(ui, {
        updatec: [null, function() {
          var nodes = Array.from(
            ui.control.querySelectorAll('.control:not(.removing):not(:empty)')
          ).addArray(Array.from(
            ui.control.querySelectorAll('.lbtn-confirm:not(.closing).removing')
          ));
          var allWidth = nodes.reduce(function(num, item) {
            if (item.classList.contains('stayleft')) return num;
            if (num !== 0) num += 15;
            return num + item.offsetWidth;
          }, 0);
          var startX = -allWidth / 2;
          var startX2 = 0;
          nodes.forEach(function (item) {
            if (item.classList.contains('stayleft')) {
              item.style.left = startX2 + 'px';
              item.style.transform = 'translateX(0px)';
              startX2 += (15 + item.offsetWidth);
            } else {
              item.style.left = '50%';
              item.style.transform = 'translateX(' + startX + 'px)';
              startX += (15 + item.offsetWidth);
            }
          });
        }],
        updatejm: [function(args, player, nodes, start, inv) {
          if (player.node.marks.querySelector('.markitem:not(.unshow)')) {
            player.node.marks.classList.remove('unshow');
          } else {
            player.node.marks.classList.add('unshow');
          }

          plugin.updateMark(player);
          app.emit('updatejm', player, nodes, start, inv);
          return true;
        }],
      });

      app.reWriteFunction(lib.configMenu.appearence.config, {
        update: [null, function(res, config, map) {
          map.button_press.hide();
        }],
      });

      app.on('playerUpdateE', function(player) {
        plugin.updateMark(player);
      });
    },
    element: {
      mark: {
        delete: function() {
          this.remove();
        },
        setName: function(name) {
          name = get.translation(name) || name;
          if (!name || !name.trim()) {
            this.classList.add('unshow');
            this.node.name.innerHTML = '';
          } else {
            this.classList.remove('unshow');
            this.node.name.innerHTML = get.translation(name) || name;
          }
          return this;
        },
        setCount: function(count) {
          if (typeof count === 'number') {
            this.node.count.innerHTML = count;
            this.node.count.classList.remove('unshow');
          } else {
            this.node.count.innerHTML = '';
            this.node.count.classList.add('unshow');
          }
          return this;
        },
        setExtra: function(extra) {
          var str = '';

          if (!Array.isArray(extra)) extra = [extra]
          extra.forEach(function(item) {
            if (!item || typeof item !== 'string') return this;
            if (item.indexOf('#') === 0) {
              item = item.substr(1);
              str += '<br>';
            }
            str += '<div>' + item + '</div>';
          });

          if (str) {
            this.node.extra.classList.remove('unshow');
            this.node.extra.innerHTML = str;
          } else if (!this._characterMark) {
            this.node.extra.innerHTML = '';
            this.node.extra.classList.add('unshow');
          }
          return this;
        },
        setBackground: function(name, type) {
          var skill = lib.skill[this.name];
          if (skill && skill.intro && skill.intro.markExtra) return this;
          if (type === 'character') {
            name = get.translation(name) || name;
            this._characterMark = true;
            return this.setExtra(name);
          }
          return this;
        },
        _customintro: function(uiintro) {
          var node = this;
          var info = node.info;
          var player = node.parentNode.parentNode;
          if (info.name) {
            if (typeof info.name == 'function') {
              var named = info.name(player.storage[node.skill], player);
              if (named) {
                uiintro.add(named);
              }
            } else {
              uiintro.add(info.name);
            }
          } else if (info.name !== false) {
            uiintro.add(get.translation(node.skill));
          }

          if (typeof info.mark == 'function') {
            var stint = info.mark(uiintro, player.storage[node.skill], player);
            if (stint) {
              var placetext = uiintro.add('<div class="text" style="display:inline">' + stint + '</div>');
              if (stint.indexOf('<div class="skill"') != 0) {
                uiintro._place_text = placetext;
              }
            }
          } else {
            var stint = get.storageintro(info.content, player.storage[node.skill],
              player, uiintro, node.skill);
            if (stint) {
              if (stint[0] == '@') {
                uiintro.add('<div class="caption">' + stint.slice(1) + '</div>');
              } else {
                var placetext = uiintro.add('<div class="text" style="display:inline">' + stint + '</div>');
                if (stint.indexOf('<div class="skill"') != 0) {
                  uiintro._place_text = placetext;
                }
              }
            }
          }
          uiintro.add(ui.create.div('.placeholder.slim'));
        },
      },
    },
    click: {
      mark: function(e) {
        e.stopPropagation();
        delete this._waitingfordrag;
        if (_status.dragged) return;
        if (_status.clicked) return;
        if (ui.intro) return;
        var rect = this.getBoundingClientRect();
        ui.click.touchpop();
        ui.click.intro.call(this, {
          clientX: rect.left + 18,
          clientY: rect.top + 12
        });
        _status.clicked = false;
      },
    },
    updateMark: function(player) {
      var eh = player.node.equips.childNodes.length * 22;
      var bv = Math.max(88, eh) * 0.8 + 1.6;
      player.node.marks.style.bottom = bv + 'px';
    },
  };

  return plugin;
});
