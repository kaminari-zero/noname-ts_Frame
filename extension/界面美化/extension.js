game.import('extension', function(lib, game, ui, get, ai, _status) {

  var app = {
    name: '界面美化',
    each: function(obj, fn, node) {
      if (!obj) return node;
      if (typeof obj.length === 'number') {
        for (var i = 0; i < obj.length; i++) {
          if (fn.call(node, obj[i], i) === false) {
            break;
          }
        }
        return node;
      }
      for (var i in obj) {
        if (fn.call(node, obj[i], i) === false) {
          break;
        }
      }
      return node;
    },
    isFunction: function(fn) {
      return typeof fn === 'function';
    },
    event: {
      listens: {},
      on: function(name, listen, remove) {
        if (!this.listens[name]) {
          this.listens[name] = [];
        }
        this.listens[name].push({
          listen: listen,
          remove: remove,
        });
        return this;
      },
      off: function(name, listen) {
        return app.each(this.listens[name], function(item, index) {
          if (listen === item || listen === item.listen) {
            this.listens[name].splice(index, 1);
          }
        }, this);
      },
      emit: function(name) {
        var args = Array.from(arguments).slice(1);
        return app.each(this.listens[name], function(item) {
          item.listen.apply(null, args);
          item.remove && this.off(name, item);
        }, this);
      },
      once: function(name, listen) {
        return this.on(name, listen, true);
      },
    },
    create: {},
    listens: {},
    plugins: [],
    pluginsMap: {},
    path: {
      ext: function(path, ext) {
        ext = ext || app.name;
        return lib.assetURL + 'extension/' + ext + '/' + path;
      },
    },
    on: function(event, listen) {
      if (!app.listens[event]) {
        app.listens[event] = [];
      }
      app.listens[event].add(listen);
    },
    once: function(event, listen) {
      if (!app.listens[event]) {
        app.listens[event] = [];
      }
      app.listens[event].push({
        listen: listen,
        remove: true,
      });
    },
    off: function(event, listen) {
      var listens = app.listens[event] || [];
      var filters = listen ? listens.filter(function(item) {
        return item === listen || item.listen === listen;
      }) : listens.slice(0);
      filters.forEach(function(item) {
        listens.remove(item);
      });
    },
    emit: function(event) {
      var args = Array.from(arguments).slice(1);
      var listens = app.listens[event] || [];
      listens.forEach(function(item) {
        if (typeof item === 'function') {
          item.apply(null, args);
        } else if (typeof item.listen === 'function') {
          item.listen.apply(null, args);
          item.remove && listens.remove(item);
        }
      });
    },
    import: function(fn) {
      var obj = fn(lib, game, ui, get, ai, _status, app);
      if (obj) {
        if (obj.name) app.pluginsMap[obj.name] = obj;
        if (obj.precontent && (!obj.filter || obj.filter())) obj.precontent();
      }
      app.plugins.push(obj);
    },
    importPlugin: function(data, setText) {
      if (!window.JSZip) {
        var args = arguments;
        lib.init.js(lib.assetURL + 'game', 'jszip', function() {
          app.importPlugin.apply(app, args);
        });
        return;
      }
      setText = typeof setText === 'function' ? setText : function() {};
      var zip = new JSZip(data);
      var dirList = [], fileList = [];
      for (var i in zip.files) {
        if (/\/$/.test(i)) {
          dirList.push('extension/' + app.name + '/' + i);
        } else if(!/^extension\.(js|css)$/.test(i)) {
          fileList.push({
            id: i,
            path: 'extension/' + app.name + '/' + i.split('/').reverse().slice(1).reverse().join('/'),
            name: i.split('/').pop(),
            target: zip.files[i],
          });
        }
      }

      var total = dirList.length + fileList.length;
      var finish = 0;
      var isNode = lib.node && lib.node.fs;

      var writeFile = function () {
        var file = fileList.shift();
        if (file) {
          setText('正在导入(' + (++finish) + '/' + total + ')...')
          game.writeFile(isNode ? file.target.asNodeBuffer() : file.target.asArrayBuffer(), file.path, file.name, writeFile);
        } else {
          alert('导入完成');
          setText('导入插件');
        }
      };
      var ensureDir = function () {
        if (dirList.length) {
          setText('正在导入(' + (++finish) + '/' + total + ')...')
          game.ensureDirectory(dirList.shift(), ensureDir);
        } else {
          writeFile();
        }
      };
      ensureDir();
    },
    loadPlugins: function(callback) {
      game.getFileList('extension/' + app.name, function(floders) {
        var total = floders.length;
        var current = 0;
        if (total === current) {
          callback();
          return;
        }
        var loaded = function() {
          if (++current === total) {
            callback();
          }
        };
        floders.forEach(function(dir) {
          game.readFile('extension/' + app.name + '/' + dir + '/main.js', function(data) {
            var binarry = new Uint8Array(data);
            var blob = new Blob([binarry]);
            var reader = new FileReader();
            reader.readAsText(blob);
            reader.onload = function() {
              eval(reader.result);
              loaded();
            };
          }, function(e) {
            console.info(e);
            loaded();
          });
        });
      });
    },
    reWriteFunction: function(target, name, replace, str) {
      if (name && typeof name === 'object') {
        return app.each(name, function(item, index) {
          app.reWriteFunction(target, index, item[0], item[1]);
        }, target);
      }

      var plugins = app.pluginsMap;
      if ((typeof replace === 'string' || replace instanceof RegExp) &&
        (typeof str === 'string' || str instanceof RegExp)) {
        var funcStr = target[name].toString().replace(replace, str);
        eval('target.' + name + ' = ' + funcStr);
      } else {
        var func = target[name];
        target[name] = function() {
          var result, cancel;
          var args = Array.from(arguments);
          var args2 = Array.from(arguments);
          if (typeof replace === 'function') cancel = replace.apply(this, [args].concat(args));
          if (typeof func === 'function' && !cancel) result = func.apply(this, args);
          if (typeof str === 'function') str.apply(this, [result].concat(args2));
          return cancel || result;
        };
      }
      return target[name];
    },
    reWriteFunctionX: function (target, name, replace, str) {
      if (name && typeof name === 'object') {
        return app.each(name, function (item, index) {
          app.reWriteFunction(target, index, item);
        }, target);
      }

      if (Array.isArray(replace)) {
        var item1 = replace[0];
        var item2 = replace[1];
        var item3 = replace[2];
        if (item3 === 'append') {
          item2 = item1 + item2;
        } else if (item3 === 'insert') {
          item2 = item2 + item1;
        }
        if (typeof item1 === 'string') {
          item1 = RegExp(item1);
        }
        if (item1 instanceof RegExp && typeof item2 === 'string') {
          var funcStr = target[name].toString().replace(item1, item2);
          eval('target.' + name + ' = ' + funcStr);
        } else {
          var func = target[name];
          target[name] = function () {
            var arg1 = Array.from(arguments);
            var arg2 = Array.from(arguments);
            var result;
            if (app.isFunction(item1)) result = item1.apply(this, [arg1].concat(arg1));
            if (app.isFunction(func) && !result) result = func.apply(this, arg1);
            if (app.isFunction(item2)) item2.apply(this, [result].concat(arg2));
            return result;
          };
        }
      } else {
        console.info(arguments);
      }
      return target[name];
    },
    waitAllFunction: function(fnList, callback) {
      var list = fnList.slice(0);
      var runNext = function() {
        var item = list.shift();
        if (typeof item === 'function') {
          item(runNext);
        } else if (list.length === 0) {
          callback();
        } else {
          runNext();
        }
      };
      runNext();
    },
    element: {
      runNext: {
        setTip: function(tip) {
          console.info(tip);
        },
      },
    },
    get: {
      playerSkills: function(node, arg1, arg2) {
        var skills = node.getSkills(arg1, arg2).slice(0);
        skills.addArray(Object.keys(node.forbiddenSkills));
        skills.addArray(Object.keys(node.disabledSkills).filter(function(k) {
          return !node.hiddenSkills.contains(k) && 
            node.disabledSkills[k].length &&
            node.disabledSkills[k][0] === k + '_awake';
        }));
        return skills;
      },
      skillInfo: function(skill, node) {
        var obj = {};
        obj.id = skill;
        if (lib.translate[skill + '_ab']) {
          obj.name = lib.translate[skill + '_ab'];
          obj.nameSimple = lib.translate[skill + '_ab'];
        } else if (lib.translate[skill]) {
          obj.name = lib.translate[skill];
          obj.nameSimple = lib.translate[skill].slice(0, 2);
        }
        obj.info = lib.skill[skill];
        if (node) {
          if (node.forbiddenSkills[skill]) obj.forbidden = true;
          if (node.disabledSkills[skill]) obj.disabled = true;
          if (obj.info.temp || !node.skills.contains(skill)) obj.temp = true;
          if (obj.info.frequent || obj.info.subfrequent) obj.frequent = true;
          if (obj.info.clickable && node.isIn() && node.isUnderControl(true)) obj.clickable = true;
          if (obj.info.nobracket) obj.nobracket = true;
        }
        obj.translation = get.skillInfoTranslation(skill);
        obj.translationSource = lib.translate[skill + '_info'];
        obj.translationAppend = lib.translate[skill + '_append'];
        if (obj.info && obj.info.enable) {
          obj.type = 'enable';
        } else {
          obj.type = 'trigger';
        }
        return obj;
      },
    },
    listen: function(node, func) {
      node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func);
      return function() {
        node.removeEventLisnter(lib.config.touchscreen ? 'touchend' : 'click', func);
      };
    },
    mockTouch: function(node) {
      var event = new Event(lib.config.touchscreen ? 'touchend' : 'click');
      node.dispatchEvent(event);
      return node;
    },
    nextTick: function(func, time) {
      var funcs;
      if (Array.isArray(func)) funcs = func;
      else funcs = [func];
      var next = function() {
        var item = funcs.shift();
        if (item) {
          setTimeout(function() {
            item();
            next();
          }, time || 0);
        }
      };
      next();
    },
  };

  return {
    name: app.name,
    content: function() {
      return function(next) {
        app.waitAllFunction([
          function(_next) {
            lib.init.css(lib.assetURL + 'extension/' + app.name, 'extension', _next);
          },
          function(_next) {
            app.loadPlugins(function () {
              var plugins = app.plugins.slice(0);
              var runNext = function () {
                var item = plugins.shift();
                if (!item) return _next();
                if (item.filter && !item.filter()) return runNext();
                if (item.content) return item.content(runNext);
                runNext();
              };
              Object.assign(runNext, app.element.runNext);
              runNext();
            });
          },
        ], next);
      };
    },
    precontent: function() {
      lib.init.onload = function () {
        ui.updated();
        game.documentZoom = game.deviceZoom;
        if (game.documentZoom != 1) {
          ui.updatez();
        }
        ui.background = ui.create.div('.background');
        ui.background.style.backgroundSize = "cover";
        ui.background.style.backgroundPosition = '50% 50%';
        if (lib.config.image_background && lib.config.image_background != 'default' && lib.config.image_background.indexOf('custom_') != 0) {
          ui.background.setBackgroundImage('image/background/' + lib.config.image_background + '.jpg');
          if (lib.config.image_background_blur) {
            ui.background.style.filter = 'blur(8px)';
            ui.background.style.webkitFilter = 'blur(8px)';
            ui.background.style.transform = 'scale(1.05)';
          }
        }
        document.documentElement.style.backgroundImage = '';
        document.documentElement.style.backgroundSize = '';
        document.documentElement.style.backgroundPosition = '';
        document.body.insertBefore(ui.background, document.body.firstChild);
        document.body.onresize = ui.updatexr;
        if (lib.config.touchscreen) {
          document.body.addEventListener('touchstart', function (e) {
            this.startX = e.touches[0].clientX / game.documentZoom;
            this.startY = e.touches[0].clientY / game.documentZoom;
            _status.dragged = false;
          });
          document.body.addEventListener('touchmove', function (e) {
            if (_status.dragged) return;
            if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
              Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
              _status.dragged = true;
            }
          });
        }

        if (lib.config.image_background.indexOf('custom_') == 0) {
          ui.background.style.backgroundImage = "none";
          game.getDB('image', lib.config.image_background, function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              var data = fileLoadedEvent.target.result;
              ui.background.style.backgroundImage = 'url(' + data + ')';
              if (lib.config.image_background_blur) {
                ui.background.style.filter = 'blur(8px)';
                ui.background.style.webkitFilter = 'blur(8px)';
                ui.background.style.transform = 'scale(1.05)';
              }
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.card_style == 'custom') {
          game.getDB('image', 'card_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.card_stylesheet) {
                ui.css.card_stylesheet.remove();
              }
              ui.css.card_stylesheet = lib.init.sheet('.card:not(*:empty){background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.cardback_style == 'custom') {
          game.getDB('image', 'cardback_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.cardback_stylesheet) {
                ui.css.cardback_stylesheet.remove();
              }
              ui.css.cardback_stylesheet = lib.init.sheet('.card:empty,.card.infohidden{background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
          game.getDB('image', 'cardback_style2', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.cardback_stylesheet2) {
                ui.css.cardback_stylesheet2.remove();
              }
              ui.css.cardback_stylesheet2 = lib.init.sheet('.card.infohidden:not(.infoflip){background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.hp_style == 'custom') {
          game.getDB('image', 'hp_style1', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.hp_stylesheet1) {
                ui.css.hp_stylesheet1.remove();
              }
              ui.css.hp_stylesheet1 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
          game.getDB('image', 'hp_style2', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.hp_stylesheet2) {
                ui.css.hp_stylesheet2.remove();
              }
              ui.css.hp_stylesheet2 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
          game.getDB('image', 'hp_style3', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.hp_stylesheet3) {
                ui.css.hp_stylesheet3.remove();
              }
              ui.css.hp_stylesheet3 = lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
          game.getDB('image', 'hp_style4', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.hp_stylesheet4) {
                ui.css.hp_stylesheet4.remove();
              }
              ui.css.hp_stylesheet4 = lib.init.sheet('.hp:not(.text):not(.actcount)>.lost{background-image:url(' + fileLoadedEvent.target.result + ')}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.player_style == 'custom') {
          ui.css.player_stylesheet = lib.init.sheet('#window .player{background-image:none;background-size:100% 100%;}');
          game.getDB('image', 'player_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.player_stylesheet) {
                ui.css.player_stylesheet.remove();
              }
              ui.css.player_stylesheet = lib.init.sheet('#window .player{background-image:url("' + fileLoadedEvent.target.result + '");background-size:100% 100%;}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.border_style == 'custom') {
          game.getDB('image', 'border_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.border_stylesheet) {
                ui.css.border_stylesheet.remove();
              }
              ui.css.border_stylesheet = lib.init.sheet();
              ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg{display:block;background-image:url("' + fileLoadedEvent.target.result + '")}', 0);
              ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.control_style == 'custom') {
          game.getDB('image', 'control_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.control_stylesheet) {
                ui.css.control_stylesheet.remove();
              }
              ui.css.control_stylesheet = lib.init.sheet('#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("' + fileLoadedEvent.target.result + '")}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }
        if (lib.config.menu_style == 'custom') {
          game.getDB('image', 'menu_style', function (fileToLoad) {
            if (!fileToLoad) return;
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
              if (ui.css.menu_stylesheet) {
                ui.css.menu_stylesheet.remove();
              }
              ui.css.menu_stylesheet = lib.init.sheet('html #window>.dialog.popped,html .menu,html .menubg{background-image:url("' + fileLoadedEvent.target.result + '");background-size:cover}');
            };
            fileReader.readAsDataURL(fileToLoad, "UTF-8");
          });
        }

        var proceed2 = function () {
          var mode = lib.imported.mode;
          var card = lib.imported.card;
          var character = lib.imported.character;
          var play = lib.imported.play;
          delete window.game;
          var i, j, k;
          for (i in mode[lib.config.mode].element) {
            if (!lib.element[i]) lib.element[i] = [];
            for (j in mode[lib.config.mode].element[i]) {
              if (j == 'init') {
                if (!lib.element[i].inits) lib.element[i].inits = [];
                lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
              }
              else {
                lib.element[i][j] = mode[lib.config.mode].element[i][j];
              }
            }
          }
          for (i in mode[lib.config.mode].ai) {
            if (typeof mode[lib.config.mode].ai[i] == 'object') {
              if (ai[i] == undefined) ai[i] = {};
              for (j in mode[lib.config.mode].ai[i]) {
                ai[i][j] = mode[lib.config.mode].ai[i][j];
              }
            }
            else {
              ai[i] = mode[lib.config.mode].ai[i];
            }
          }
          for (i in mode[lib.config.mode].ui) {
            if (typeof mode[lib.config.mode].ui[i] == 'object') {
              if (ui[i] == undefined) ui[i] = {};
              for (j in mode[lib.config.mode].ui[i]) {
                ui[i][j] = mode[lib.config.mode].ui[i][j];
              }
            }
            else {
              ui[i] = mode[lib.config.mode].ui[i];
            }
          }
          for (i in mode[lib.config.mode].game) {
            game[i] = mode[lib.config.mode].game[i];
          }
          for (i in mode[lib.config.mode].get) {
            get[i] = mode[lib.config.mode].get[i];
          }
          lib.init.start = mode[lib.config.mode].start;
          lib.init.startBefore = mode[lib.config.mode].startBefore;
          if (game.onwash) {
            lib.onwash.push(game.onwash);
            delete game.onwash;
          }
          if (game.onover) {
            lib.onover.push(game.onover);
            delete game.onover;
          }
          lib.config.banned = lib.config[lib.config.mode + '_banned'] || [];
          lib.config.bannedcards = lib.config[lib.config.mode + '_bannedcards'] || [];

          lib.rank = window.noname_character_rank;
          delete window.noname_character_rank;
          for (i in mode[lib.config.mode]) {
            if (i == 'element') continue;
            if (i == 'game') continue;
            if (i == 'ai') continue;
            if (i == 'ui') continue;
            if (i == 'get') continue;
            if (i == 'config') continue;
            if (i == 'onreinit') continue;
            if (i == 'start') continue;
            if (i == 'startBefore') continue;
            if (lib[i] == undefined) lib[i] = (Array.isArray(mode[lib.config.mode][i])) ? [] : {};
            for (j in mode[lib.config.mode][i]) {
              lib[i][j] = mode[lib.config.mode][i][j];
            }
          }
          if (typeof mode[lib.config.mode].init == 'function') {
            mode[lib.config.mode].init();
          }

          var connectCharacterPack = [];
          var connectCardPack = [];
          for (i in character) {
            if (character[i].character) {
              lib.characterPack[i] = character[i].character
            }
            for (j in character[i]) {
              if (j == 'mode' || j == 'forbid') continue;
              if (j == 'connect') {
                connectCharacterPack.push(i);
                continue;
              }
              if (j == 'character' && !lib.config.characters.contains(i) && lib.config.mode != 'connect') {
                if (lib.config.mode == 'chess' && get.config('chess_mode') == 'leader') {
                  for (k in character[i][j]) {
                    lib.hiddenCharacters.push(k);
                  }
                }
                else if (lib.config.mode != 'boss' || i != 'boss') {
                  continue;
                }
              }
              if (Array.isArray(lib[j]) && Array.isArray(character[i][j])) {
                lib[j].addArray(character[i][j]);
                continue;
              }
              for (k in character[i][j]) {
                if (j == 'character') {
                  if (!character[i][j][k][4]) {
                    character[i][j][k][4] = [];
                  }
                  if (character[i][j][k][4].contains('boss') ||
                    character[i][j][k][4].contains('hiddenboss')) {
                    lib.config.forbidai.add(k);
                  }
                  if (lib.config.forbidai_user && lib.config.forbidai_user.contains(k)) {
                    lib.config.forbidai.add(k);
                  }
                  for (var l = 0; l < character[i][j][k][3].length; l++) {
                    lib.skilllist.add(character[i][j][k][3][l]);
                  }
                }
                if (j == 'skill' && k[0] == '_' && (!lib.config.characters.contains(i) || (lib.config.mode == 'connect' && !character[i].connect))) {
                  continue;
                }
                if (j == 'translate' && k == i) {
                  lib[j][k + '_character_config'] = character[i][j][k];
                }
                else {
                  if (lib[j][k] == undefined) {
                    if (j == 'skill' && lib.config.mode == 'connect' && !character[i].connect) {
                      lib[j][k] = {
                        nopop: character[i][j][k].nopop,
                        derivation: character[i][j][k].derivation
                      };
                    }
                    else {
                      lib[j][k] = character[i][j][k];
                    }
                    if (j == 'card' && lib[j][k].derivation) {
                      if (!lib.cardPack.mode_derivation) {
                        lib.cardPack.mode_derivation = [k];
                      }
                      else {
                        lib.cardPack.mode_derivation.push(k);
                      }
                    }
                  }
                  else if (Array.isArray(lib[j][k]) && Array.isArray(character[i][j][k])) {
                    lib[j][k].addArray(character[i][j][k]);
                  }
                  else {
                    console.log('dublicate ' + j + ' in character ' + i + ':\n' + k + '\n' + ': ' + lib[j][k] + '\n' + character[i][j][k]);
                  }
                }
              }
            }
          }
          var connect_avatar_list = [];
          for (var i in lib.character) {
            connect_avatar_list.push(i);
          }
          connect_avatar_list.sort(lib.sort.capt);
          for (var i = 0; i < connect_avatar_list.length; i++) {
            var ia = connect_avatar_list[i];
            lib.mode.connect.config.connect_avatar.item[ia] = lib.translate[ia];
          }
          if (lib.config.mode != 'connect') {
            var pilecfg = lib.config.customcardpile[get.config('cardpilename') || '当前牌堆'];
            if (pilecfg) {
              lib.config.bannedpile = get.copy(pilecfg[0] || {});
              lib.config.addedpile = get.copy(pilecfg[1] || {});
            }
            else {
              lib.config.bannedpile = {};
              lib.config.addedpile = {};
            }
          }
          else {
            lib.cardPackList = {};
          }
          for (i in card) {
            lib.cardPack[i] = [];
            if (card[i].card) {
              for (var j in card[i].card) {
                if (!card[i].card[j].hidden && card[i].translate[j + '_info']) {
                  lib.cardPack[i].push(j);
                }
              }
            }
            for (j in card[i]) {
              if (j == 'mode' || j == 'forbid') continue;
              if (j == 'connect') {
                connectCardPack.push(i);
                continue;
              }
              if (j == 'list') {
                if (lib.config.mode == 'connect') {
                  lib.cardPackList[i] = card[i][j];
                }
                else {
                  if (lib.config.cards.contains(i)) {
                    var pile;
                    if (typeof card[i][j] == 'function') {
                      pile = card[i][j]();
                    }
                    else {
                      pile = card[i][j];
                    }
                    lib.cardPile[i] = pile.slice(0);
                    if (lib.config.bannedpile[i]) {
                      for (var k = 0; k < lib.config.bannedpile[i].length; k++) {
                        pile[lib.config.bannedpile[i][k]] = null;
                      }
                    }
                    for (var k = 0; k < pile.length; k++) {
                      if (!pile[k]) {
                        pile.splice(k--, 1);
                      }
                    }
                    if (lib.config.addedpile[i]) {
                      for (var k = 0; k < lib.config.addedpile[i].length; k++) {
                        pile.push(lib.config.addedpile[i][k]);
                      }
                    }
                    lib.card.list = lib.card.list.concat(pile);
                  }
                }
              }
              else {
                for (k in card[i][j]) {
                  if (j == 'skill' && k[0] == '_' && (!lib.config.cards.contains(i) || (lib.config.mode == 'connect' && !card[i].connect))) {
                    continue;
                  }
                  if (j == 'translate' && k == i) {
                    lib[j][k + '_card_config'] = card[i][j][k];
                  }
                  else {
                    if (lib[j][k] == undefined) {
                      if (j == 'skill' && lib.config.mode == 'connect' && !card[i].connect) {
                        lib[j][k] = {
                          nopop: card[i][j][k].nopop,
                          derivation: card[i][j][k].derivation
                        };
                      }
                      else {
                        lib[j][k] = card[i][j][k];
                      }
                    }
                    else console.log('dublicate ' + j + ' in card ' + i + ':\n' + k + '\n' + lib[j][k] + '\n' + card[i][j][k]);
                    if (j == 'card' && lib[j][k].derivation) {
                      if (!lib.cardPack.mode_derivation) {
                        lib.cardPack.mode_derivation = [k];
                      }
                      else {
                        lib.cardPack.mode_derivation.push(k);
                      }
                    }
                  }
                }
              }
            }
          }
          if (lib.cardPack.mode_derivation) {
            for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
              if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivation == 'string' && !lib.character[lib.card[lib.cardPack.mode_derivation[i]].derivation]) {
                lib.cardPack.mode_derivation.splice(i--, 1);
              }
              else if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivationpack == 'string' && !lib.config.cards.contains(lib.card[lib.cardPack.mode_derivation[i]].derivationpack)) {
                lib.cardPack.mode_derivation.splice(i--, 1);
              }
            }
            if (lib.cardPack.mode_derivation.length == 0) {
              delete lib.cardPack.mode_derivation;
            }
          }
          if (lib.config.mode != 'connect') {
            for (i in play) {
              if (lib.config.hiddenPlayPack.contains(i)) continue;
              if (play[i].forbid && play[i].forbid.contains(lib.config.mode)) continue;
              if (play[i].mode && play[i].mode.contains(lib.config.mode) == false) continue;
              for (j in play[i].element) {
                if (!lib.element[j]) lib.element[j] = [];
                for (k in play[i].element[j]) {
                  if (k == 'init') {
                    if (!lib.element[j].inits) lib.element[j].inits = [];
                    lib.element[j].inits.push(play[i].element[j][k]);
                  }
                  else {
                    lib.element[j][k] = play[i].element[j][k];
                  }
                }
              }
              for (j in play[i].ui) {
                if (typeof play[i].ui[j] == 'object') {
                  if (ui[j] == undefined) ui[j] = {};
                  for (k in play[i].ui[j]) {
                    ui[j][k] = play[i].ui[j][k];
                  }
                }
                else {
                  ui[j] = play[i].ui[j];
                }
              }
              for (j in play[i].game) {
                game[j] = play[i].game[j];
              }
              for (j in play[i].get) {
                get[j] = play[i].get[j];
              }
              for (j in play[i]) {
                if (j == 'mode' || j == 'forbid' || j == 'init' || j == 'element' ||
                  j == 'game' || j == 'get' || j == 'ui' || j == 'arenaReady') continue;
                for (k in play[i][j]) {
                  if (j == 'translate' && k == i) {
                    // lib[j][k+'_play_config']=play[i][j][k];
                  }
                  else {
                    if (lib[j][k] != undefined) {
                      console.log('dublicate ' + j + ' in play ' + i + ':\n' + k + '\n' + ': ' + lib[j][k] + '\n' + play[i][j][k]);
                    }
                    lib[j][k] = play[i][j][k];
                  }
                }
              }
              if (typeof play[i].init == 'function') play[i].init();
              if (typeof play[i].arenaReady == 'function') lib.arenaReady.push(play[i].arenaReady);
            }
          }

          lib.connectCharacterPack = [];
          lib.connectCardPack = [];
          for (var i = 0; i < lib.config.all.characters.length; i++) {
            var packname = lib.config.all.characters[i];
            if (connectCharacterPack.contains(packname)) {
              lib.connectCharacterPack.push(packname)
            }
          }
          for (var i = 0; i < lib.config.all.cards.length; i++) {
            var packname = lib.config.all.cards[i];
            if (connectCardPack.contains(packname)) {
              lib.connectCardPack.push(packname)
            }
          }
          if (lib.config.mode != 'connect') {
            for (i = 0; i < lib.card.list.length; i++) {
              if (lib.card.list[i][2] == 'huosha') {
                lib.card.list[i] = lib.card.list[i].slice(0);
                lib.card.list[i][2] = 'sha';
                lib.card.list[i][3] = 'fire';
              }
              else if (lib.card.list[i][2] == 'leisha') {
                lib.card.list[i] = lib.card.list[i].slice(0);
                lib.card.list[i][2] = 'sha';
                lib.card.list[i][3] = 'thunder';
              }
              if (!lib.card[lib.card.list[i][2]]) {
                lib.card.list.splice(i, 1); i--;
              }
              else if (lib.card[lib.card.list[i][2]].mode &&
                lib.card[lib.card.list[i][2]].mode.contains(lib.config.mode) == false) {
                lib.card.list.splice(i, 1); i--;
              }
            }
          }

          if (lib.config.mode == 'connect') {
            _status.connectMode = true;
          }
          if (window.isNonameServer) {
            lib.cheat.i();
          }
          else if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
            lib.cheat.i();
          }
          lib.config.sort_card = get.sortCard(lib.config.sort);
          delete lib.imported.character;
          delete lib.imported.card;
          delete lib.imported.mode;
          delete lib.imported.play;
          for (var i in lib.init) {
            if (i.indexOf('setMode_') == 0) {
              delete lib.init[i];
            }
          }

          var loadExtensionCallback = function() {
            delete lib.extensions;

            if (lib.init.startBefore) {
              lib.init.startBefore();
              delete lib.init.startBefore;
            }
            ui.create.arena();
            game.createEvent('game', false).setContent(lib.init.start);
            if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode].fromextension) {
              var startstr = mode[lib.config.mode].start.toString();
              if (startstr.indexOf('onfree') == -1) {
                setTimeout(lib.init.onfree, 500);
              }
            }
            delete lib.init.start;
            game.loop();
            app.emit('createArenaAfter');
          };
          if (!_status.connectMode) {
            var loadNextExtension = function() {
              var obj = lib.extensions.shift();
              if (obj) {
                try {
                  _status.extension = obj[0];
                  _status.evaluatingExtension = obj[3];
                  if (obj[4]) {
                    if (obj[4].character) {
                      for (var j in obj[4].character.character) {
                        game.addCharacterPack(get.copy(obj[4].character));
                        break;
                      }
                    }
                    if (obj[4].card) {
                      for (var j in obj[4].card.card) {
                        game.addCardPack(get.copy(obj[4].card));
                        break;
                      }
                    }
                    if (obj[4].skill) {
                      for (var j in obj[4].skill.skill) {
                        game.addSkill(j, obj[4].skill.skill[j],
                          obj[4].skill.translate[j], obj[4].skill.translate[j + '_info']);
                      }
                    }
                  }
                  var func = obj[1](obj[2], obj[4]);
                  if (typeof func === 'function') {
                    func(loadNextExtension);
                  } else {
                    loadNextExtension();
                  }
                } catch(e) {
                  console.log(e);
                  loadNextExtension();
                }
              } else {
                delete _status.extension;
                delete _status.evaluatingExtension;
                loadExtensionCallback();
              }
            };
            loadNextExtension();
          } else {
            loadExtensionCallback();
          }
        }
        var proceed = function () {
          if (!lib.db) {
            try {
              lib.storage = JSON.parse(localStorage.getItem(lib.configprefix + lib.config.mode));
              if (typeof lib.storage != 'object') throw ('err');
              if (lib.storage == null) throw ('err');
            }
            catch (err) {
              lib.storage = {};
              localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
            }
            proceed2();
          }
          else {
            game.getDB('data', lib.config.mode, function (obj) {
              lib.storage = obj || {};
              proceed2();
            });
          }
        };
        if (!lib.imported.mode || !lib.imported.mode[lib.config.mode]) {
          window.inSplash = true;
          clearTimeout(window.resetGameTimeout);
          delete window.resetGameTimeout;
          var clickedNode = false;
          var clickNode = function () {
            if (clickedNode) return;
            this.classList.add('clicked');
            clickedNode = true;
            lib.config.mode = this.link;
            game.saveConfig('mode', this.link);
            if (game.layout != 'mobile' && lib.layoutfixed.indexOf(lib.config.mode) !== -1) {
              game.layout = 'mobile';
              ui.css.layout.href = lib.assetURL + 'layout/' + game.layout + '/layout.css';
            }
            else if (game.layout == 'mobile' && lib.config.layout != 'mobile' && lib.layoutfixed.indexOf(lib.config.mode) === -1) {
              game.layout = lib.config.layout;
              if (game.layout == 'default') {
                ui.css.layout.href = '';
              }
              else {
                ui.css.layout.href = lib.assetURL + 'layout/' + game.layout + '/layout.css';
              }
            }
            splash.delete(1000);
            delete window.inSplash;
            window.resetGameTimeout = setTimeout(lib.init.reset, 5000);

            this.listenTransition(function () {
              lib.init.js(lib.assetURL + 'mode', lib.config.mode, proceed);
            }, 500);
          }
          var downNode = function () {
            this.classList.add('glow');
          }
          var upNode = function () {
            this.classList.remove('glow');
          }
          var splash = ui.create.div('#splash', document.body);
          if (lib.config.touchscreen) {
            splash.classList.add('touch');
            lib.setScroll(splash);
          }
          if (lib.config.player_border != 'wide') {
            splash.classList.add('slim');
          }
          splash.dataset.radius_size = lib.config.radius_size;
          for (var i = 0; i < lib.config.all.mode.length; i++) {
            var node = ui.create.div('.hidden', splash, clickNode);
            node.link = lib.config.all.mode[i];
            ui.create.div(node, '.splashtext', get.verticalStr(get.translation(lib.config.all.mode[i])));
            if (lib.config.all.stockmode.indexOf(lib.config.all.mode[i]) != -1) {
              ui.create.div(node, '.avatar').setBackgroundImage('image/splash/' + lib.config.all.mode[i] + '.jpg');
            }
            else {
              var avatarnode = ui.create.div(node, '.avatar');
              var avatarbg = lib.mode[lib.config.all.mode[i]].splash;
              if (avatarbg.indexOf('ext:') == 0) {
                avatarnode.setBackgroundImage(avatarbg.replace(/ext:/, 'extension/'));
              }
              else {
                avatarnode.setBackgroundDB(avatarbg);
              }
            }
            if (!lib.config.touchscreen) {
              node.addEventListener('mousedown', downNode);
              node.addEventListener('mouseup', upNode);
              node.addEventListener('mouseleave', upNode);
            }
            setTimeout((function (node) {
              return function () {
                node.show();
              }
            }(node)), i * 100);
          }
          if (lib.config.mousewheel) {
            splash.onmousewheel = ui.click.mousewheel;
          }
        }
        else {
          proceed();
        }
        localStorage.removeItem(lib.configprefix + 'directstart');
        delete lib.init.init;
      };

      if (lib.config.dev) {
        window.app = app;
      }
    },
    config: {
      import: {
        name: '导入插件',
        clear: true,
        onclick: function() {
          var node = this;
          var input = document.createElement('input');
          input.type = 'file';
          input.onchange = function () {
            input.remove();
            if (!/\.zip$/.test(input.files[0].name)) {
              alert('请选择zip压缩包');
            } else {
              var reader = new FileReader();
              reader.readAsArrayBuffer(input.files[0], 'UTF-8');
              reader.onload = function () {
                app.importPlugin(reader.result, function(text) {
                  node.innerHTML = '<span>' + text + '</span>';
                });
              };
            }
          };
          input.style.opacity = 0;
          document.body.appendChild(input);
          input.click();
        },
      },
    },
    editable: false,
  };
});
