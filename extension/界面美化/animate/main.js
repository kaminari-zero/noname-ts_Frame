app.import(function() {
  var plugin = {
    name: 'animate',
    content: function(next) {
      return app.waitAllFunction([
        function(next) {
          game.saveConfig('show_card_prompt', false);
          next();
        },
        // 动画素材预加载
        function(next) {
          var list = Object.keys(plugin.animate);
          var loaded = 0;
          var total = list.length;
          list.map(function(name) {
            return plugin.create.animate(name, {
              onload: function() {
                if (++loaded === total) {
                  next();
                }
              },
            });
          });
        },
        function(next) {
          lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main', next);
        },
      ], next);
    },
    precontent: function() {
      app.reWriteFunction(lib.configMenu.view.config, {
        update: [null, function(res, config, map) {
          map.show_card_prompt.hide();
        }],
      });

      app.reWriteFunction(lib.element.player, {
        useCard: [null, function(next) {
          plugin.playeCardAnimate(this, next.card);
        }],
        respond: [null, function(next) {
          plugin.playeCardAnimate(this, next.card);
        }],
        logSkill: [
          'popup(get.skillTranslation(name,this))',
          'popup(get.skillTranslation(name,this), "skill")',
        ],
        popup: [null, function(res, name, nature) {
          if (nature === 'skill') {
            setTimeout(function(player) {
              player.createSkillAnimate('skill');
            }, 100, this);
          }
        }],
      });

      app.reWriteFunction(lib.element.player, {
        logSkill: ['popup(name[1])', 'popup(name[1], "skill")'],
        judge: [null, function(next) {
          app.reWriteFunction(next, {
            judge: [null, function(judge, result) {
              if (result.card && result.card.clone) {
                result.card.clone.delete = function() {
                  var clone = this;
                  var args = arguments;
                  lib.element.card.createJudgeAnimate.call(result.card.clone, judge, function() {
                    setTimeout(function() {
                      HTMLDivElement.prototype.delete.apply(clone, args);
                    }, 200);
                  });
                };
              }
            }],
          });
        }],
      });

      app.reWriteFunction(lib.element.content, {
        useSkill: [
          'popup(get.skillTranslation(skill,player))',
          'popup(get.skillTranslation(skill,player), "skill")',
        ],
      });

      app.reWriteFunction(lib.element.event, {
        trigger: [null, function(res, name) {
          setTimeout(function(event) {
            app.emit('event:' + name, event);
          }, 0, this);
        }],
      });

      Object.assign(lib.element.player, {
        createCardAnimate: function(name) {
          var width = this.offsetWidth;
          // var left;
          // if (this.offsetLeft > width / 2) {
          //   left = 'calc(0% - ' + (width / 2) + 'px)';
          // } else {
          //   left = 'calc(100% - ' + (width / 2) + 'px)';
          // }
          plugin.create.animate(name, {
            canvas: {
              width: width,
              height: width,
            },
            style: {
              left: 'calc(50% - ' + (width / 2) + 'px)',
              bottom: 'calc(50% - ' + (width / 2) + 'px)',
            },
            step: 1000,
            remove: true,
            autoPlay: true,
            parentNode: this,
          });
        },
        createDamageAnimate: function(name) {
          var width = this.offsetWidth;
          plugin.create.animate(name, {
            canvas: {
              width: width,
              height: width,
            },
            style: {
              left: 'calc(50% - ' + (width / 2) + 'px)',
              bottom: 0,
            },
            step: 200,
            remove: true,
            autoPlay: true,
            parentNode: this,
          });
        },
        createSkillAnimate: function(name) {
          var width = this.offsetWidth;
          plugin.create.animate(name, {
            canvas: {
              width: width,
              height: width,
            },
            style: {
              left: 'calc(50% - ' + (width / 2) + 'px)',
              bottom: 'calc(50% - ' + (width / 2) + 'px)',
            },
            step: 500,
            remove: true,
            autoPlay: true,
            parentNode: this,
          });
        },
      });

      Object.assign(lib.element.card, {
        createJudgeAnimate: function(judge, callback) {
          var name = (judge > -1 && judge <= 0) ? 'judge_fail' : 'judge_success';
          var width = this.offsetWidth / 2;
          plugin.create.animate(name, {
            canvas: {
              width: width,
              height: width,
            },
            style: {
              right: 0,
              bottom: 0,
            },
            step: 500,
            autoPlay: true,
            parentNode: this,
            callback: callback,
            stopEnd: true,
          });
        },
      });

      app.on('event:damageBegin4', function(event) {
        if (event.player) {
          event.player.createDamageAnimate('damage');
        }
      });
      window.plugin = plugin;
    },
    animate: {
      sha: 'sha_black',
      sha_red: 24,
      sha_black: 18,
      sha_fire: 24,
      sha_thunder: 24,
      shan: 23,
      jiu: 17,
      tao: 17,
      damage: 6,
      skill: [11, true, 1],
      judge_fail: [4, false],
      judge_success: [4, false],
    },
    cardAnimate: ['sha', 'sha_red', 'sha_black', 'sha_fire', 'sha_thunder', 'shan', 'jiu', 'tao'],
    create: {
      animate: function(name, opts) {
        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        canvas.classList.add('animateCanvas');
        opts = opts || {};
        if (opts.canvas) Object.assign(canvas, opts.canvas);
        if (opts.style) Object.assign(canvas.style, opts.style);
        if (opts.parentNode) opts.parentNode.appendChild(canvas);
        if (opts.remove) canvas._remove = true;
        if (opts.autoPlay) canvas._autoPlay = true;
        if (opts.step) canvas._step = opts.step;
        if (opts.onload) canvas._onload = opts.onload;
        if (opts.callback) canvas._callback = opts.callback;
        if (opts.stopEnd) canvas._stopEnd = opts.stopEnd;

        var ctx = canvas.getContext('2d');
        canvas.ctx = ctx;
        canvas._animate = name;
        Object.assign(canvas, plugin.element.animate);
        canvas.init();
        return canvas;
      },
    },
    element: {
      animate: {
        init: function() {
          this.aid = get.id();
          this.images = [];
          var animate = plugin.animate[this._animate];
          while(typeof animate === 'string') {
            this._animate = animate;
            animate = plugin.animate[animate];
          }
          if (!animate) return this;
          this._clear = Array.isArray(animate) ? animate[1] : true;
          var num = Array.isArray(animate) ? animate[0] : animate;
          if (Array.isArray(animate) && typeof animate[2] === 'number') {
            this._coverRender = animate[2];
          }
          var loaded = 0;
          var canvas = this;
          var loadNext = function() {
            if (loaded >= num) {
              canvas.loaded = true;
              if (canvas._step) {
                canvas._step = canvas._step / canvas.images.length;
              }
              app.emit('animate:' + canvas.aid + ':loaded', canvas);
              canvas.computedSize();
              if (canvas._autoPlay) {
                canvas.play();
              }
              if (canvas._onload) {
                canvas._onload();
              }
              return;
            }
            var img = new Image();
            img.src = lib.assetURL + 'extension/' + app.name + '/' + plugin.name + '/animate/' + canvas._animate + '/' + loaded + '.png';
            img.onload = function() {
              loaded++;
              canvas.images.push(img);
              loadNext();
            };
            img.onerror = function(e) {
              app.emit('animate:' + canvas.aid + ':error', e, canvas);
            };
          };
          loadNext();
          return this;
        },
        play: function() {
          if (this.playing) return;
          if (!this.loaded) {
            app.once('animate:' + this.aid + ':loaded', function(canvas) {
              canvas.play();
            });
            return this;
          }
          this.playing = true;
          var canvas = this;
          var images = this.images.slice(0);
          var playNext = function() {
            if (images.length) {
              canvas.draw(images.shift(), playNext);
            } else {
              if (!canvas._stopEnd) {
                canvas.clear();
              }
              canvas.playing = false;
              if (canvas._remove) {
                canvas.remove();
              }
              if (typeof canvas._callback === 'function') {
                canvas._callback();
              }
            }
          };
          playNext();
          return this;
        },
        draw: function(img, drawNext) {
          if (this._clear) {
            this.ctx.clearRect(0, 0, this.width, this.height);
          }

          if (this._coverRender) {
            var index = this.images.indexOf(img);
            if (index >= this._coverRender) {
              this._clear = false;
              for (var i = 0; i < this._coverRender; i++) {
                this.draw(this.images[i]);
              }
              this._clear = true;
            }
          }

          /** @type {CanvasRenderingContext2D} */
          var ctx = this.ctx;
          var dw = img.width * this.width / this._width;
          var dh = img.height * this.height / this._height;
          var dx = (this.width - dw) / 2;
          var dy = (this.height - dh) / 2;

          ctx.drawImage(img, dx, dy, dw, dh);
          if (typeof drawNext === 'function') {
            setTimeout(drawNext, this._step || 200);
          }
          return this;
        },
        clear: function() {
          var ctx = this.ctx;
          ctx.clearRect(0, 0, this.width, this.height);
          return this;
        },
        computedSize: function() {
          var width = Math.max.apply(Math, this.images.map(function(item) {
            return item.width;
          }));
          var height = Math.max.apply(Math, this.images.map(function (item) {
            return item.height;
          }));
          this._width = width;
          this._height = height;
          return this;
        },
      },
    },
    playeCardAnimate: function(player, card) {
      var name = card.name;
      var color = get.color(card);
      var nature = get.nature(card);
      if (nature && plugin.cardAnimate.contains(name + '_' + nature)) {
        name = name + '_' + nature;
      } else if (color && plugin.cardAnimate.contains(name + '_' + color)) {
        name = name + '_' + color;
      }
      if (plugin.cardAnimate.contains(name)) {
        player.createCardAnimate(name);
      }
    },
  };
  return plugin;
});
