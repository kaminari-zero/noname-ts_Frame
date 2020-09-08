//@ts-nocheck
module ZJNGEx {
	(function () {
		NG.Utils.importCurContent(this.ZJNGEx, "乱世天下的方法", NG.ImportFumType.none,

			//看了下 “永远的萌新”大佬的简易联机框架，非常之好，整合进这里(暂时不需要，先收集在这里)
			//扩展中文名的英文名方法
			function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
				//---------配音接口----------//
				game.playGz = function (fn, dir, sex) {
					if (lib.config.background_speak) {
						if (dir && sex)
							game.playAudio(dir, sex, fn);
						else if (dir)
							game.playAudio(dir, fn);
						else
							game.playAudio('..', 'extension', '乱世天下', fn);
					}
				}
				//---------阵亡配音----------//
				lib.skill._zhenwangpeiyin_gz = {
					trigger: {
						player: 'dieBegin',
					},
					priority: 2,
					forced: true,
					unique: true,
					frequent: true,
					charlotte: true,
					content: function () {
						game.playAudio('..', 'extension', '乱世天下', player.name);
					},
				}
				//---------击杀特效----------//
				if (config.Gz_jishatexiao) {
					lib.skill._jishatexiao_gz = {
						marktext: "杀",
						intro: {
							content: function (storage) {
								var num = layer.storage.jisharenshu_gz;
								return '你已击杀' + num + '名角色';
							},
						},
						trigger: {
							global: "dieBegin",
						},
						direct: true,
						forced: true,
						charlotte: true,
						unique: true,
						firstDo: true,
						filter: function (event, player) {
							return event.source == player;
						},
						content: function () {
							'step 0'
							if (!player.storage.jisharenshu_gz) player.storage.jisharenshu_gz = 0;
							player.storage.jisharenshu_gz++;
							'step 1'
							if (player.storage.jisharenshu_gz == 1) { player.$fullscreenpop('一血·卧龙出山', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha1'); }
							if (player.storage.jisharenshu_gz == 2) { player.$fullscreenpop('双杀·一战成名', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha2'); }
							if (player.storage.jisharenshu_gz == 3) { player.$fullscreenpop('三杀·举世皆惊', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha3'); }
							if (player.storage.jisharenshu_gz == 4) { player.$fullscreenpop('四杀·天下无敌', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha4'); }
							if (player.storage.jisharenshu_gz == 5) { player.$fullscreenpop('五杀·诛天灭地', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha5'); }
							if (player.storage.jisharenshu_gz == 6) { player.$fullscreenpop('六杀·癫狂杀戮', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha6'); }
							if (player.storage.jisharenshu_gz >= 7) { player.$fullscreenpop('无双·万军取首', 'fire'); game.playAudio('..', 'extension', '乱世天下', 'luan_jisha7'); }
						},
					}
				}

				//---------简化函数----------//
				game.washCardGz = function () {
					var cards = get.cards(ui.cardPile.childElementCount + 1);
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
					game.updateRoundNumber();
				}

				return null;
			});
	})();
}