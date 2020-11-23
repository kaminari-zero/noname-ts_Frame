//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "简易联机框架方法", NG.ImportFumType.run,

            //看了下 “永远的萌新”大佬的简易联机框架，非常之好，整合进这里(暂时不需要，先收集在这里)
            //扩展中文名的英文名方法
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                game.导入character = function (英文名, 翻译名, obj, 扩展包名) {
					var oobj = get.copy(obj);
					oobj.name = 英文名;
					oobj.character = obj.character.character;
					oobj.skill = obj.skill.skill;
					oobj.translate = Object.assign({}, obj.character.translate, obj.skill.translate);
					game.import('character', function () {
						// if (lib.device || lib.node) {
						// 	for (var i in oobj.character) {
						// 		oobj.character[i][4].push('ext:' + 扩展包名 + '/' + i + '.jpg');
						// 	}
						// } else {
						// 	for (var i in oobj.character) {
						// 		oobj.character[i][4].push('db:extension-' + 扩展包名 + ':' + i + '.jpg');
						// 	}
                        // }
                        for (var i in oobj.character) {
                            oobj.character[i][4].push('ext:' + 扩展包名 + '/' + i + '.jpg');
                        }
						return oobj;
					});
					lib.config.all.characters.push(英文名);
					if (!lib.config.characters.contains(英文名)) {
						lib.config.characters.push(英文名);
					}
					lib.translate[英文名 + '_character_config'] = 翻译名;
				};
				game.导入card = function (英文名, 翻译名, obj) {
					var oobj = get.copy(obj);
					oobj.list = obj.card.list;
					oobj.card = obj.card.card;
					oobj.skill = obj.skill.skill;
					oobj.translate = Object.assign({}, obj.card.translate, obj.skill.translate);
					game.import('card', function () {
						return oobj
					});
					lib.config.all.cards.push(英文名);
					if (!lib.config.cards.contains(英文名)) lib.config.cards.push(英文名);
					lib.translate[英文名 + '_card_config'] = 翻译名;
				};
				game.新增势力 = function (名字, 映射, 渐变) {
					var n, t;
					if (!名字) return;
					if (typeof 名字 == "string") {
						n = 名字; t = 名字
					} else if (Array.isArray(名字) && 名字.length == 2 && typeof 名字[0] == "string") {
						n = 名字[0]; t = 名字[1]
					} else
						return;
					if (!映射 || !Array.isArray(映射) || 映射.length != 3)
						映射 = [199, 21, 133];
					var y = "(" + 映射[0] + "," + 映射[1] + "," + 映射[2];
					var y1 = y + ",1)", y2 = y + ")";
					var s = document.createElement('style');
					var l;
					l = ".player .identity[data-color='diy" + n + "'],";
					l += "div[data-nature='diy" + n + "'],";
					l += "span[data-nature='diy" + n + "'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 10px,rgba" + y1 + " 0 0 10px}";
					l += "div[data-nature='diy" + n + "m'],";
					l += "span[data-nature='diy" + n + "m'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,rgba" + y1 + " 0 0 5px,black 0 0 1px;}";
					l += "div[data-nature='diy" + n + "mm'],";
					l += "span[data-nature='diy" + n + "mm'] {text-shadow: black 0 0 1px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,rgba" + y1 + " 0 0 2px,black 0 0 1px;}";
					s.innerHTML = l; document.head.appendChild(s);
					if (渐变 && Array.isArray(渐变) && Array.isArray(渐变[0]) && 渐变[0].length == 3) {
						var str = "", st2 = [];
						for (var i = 0; i < 渐变.length; i++) {
							str += ",rgb(" + 渐变[i][0] + "," + 渐变[i][1] + "," + 渐变[i][2] + ")";
							if (i < 2) st2[i] = "rgb(" + 渐变[i][0] + "," + 渐变[i][1] + "," + 渐变[i][2] + ")";
						} var tenUi = document.createElement('style');
						tenUi.innerHTML = ".player>.camp-zone[data-camp='" + n + "']>.camp-back {background: linear-gradient(to bottom" + str + ");}";
						tenUi.innerHTML += ".player>.camp-zone[data-camp='" + n + "']>.camp-name {text-shadow: 0 0 5px " + st2[0] + ", 0 0 10px " + st2[1] + ";}";
						document.head.appendChild(tenUi);
					}
					lib.group.add(n);
					lib.translate[n] = t;
					lib.groupnature[n] = "diy" + n;
                };
                
                game.loadForbidai = function (英文名) {
                    if (config[英文名]) {
                        for (var i in lib.characterPack[英文名]) {
                            if (lib.character[i][4].indexOf("forbidai") < 0) lib.character[i][4].push("forbidai");
                        }
                    }
                };


                // 例子：
                /*
                game.新增势力(["ysqin","秦"],[199,21,133],[[250,123,183],[101,5,49]]);//新增势力秦，英文名为ysqin，颜色为rgb(199,21,133)，十周年渐变为rgb(250,123,183)  rgb(101,5,49)

                game.导入character(武将包英文名,武将包翻译名,{
					connect:true,//是否能联机
					character:{
						character:{
							"djaxvd_jiaxu":["male","shen",4,["djaxvd_taoguang","djaxvd_anqiao"],[]],//武将
						},
						translate:{
							"djaxvd_jiaxu":"贾诩",//武将翻译
						},
					},
					characterTitle:{
						"djaxvd_jiaxu":"#b一语定乾坤",//武将称号
					},
					skill:{
						skill:{
							"biyue":{
								trigger:{player:"phaseJieshuBegin",},
								frequent:true,
								content:function(){player.draw();},
							},
							//技能代码，以闭月为例
						},
						translate:{
							"biyue":"闭月",//技能翻译
						},
					},
                },扩展包名--"简易联机框架");
                
                game.导入card(卡牌包英文名,卡牌包翻译名,{
					connect:true,//是否能联机
					card:{
						card:{
						},
						translate:{
						},
						list:[],
					},
					skill:{
						skill:{
						},
						translate:{
						},
					},
                });
                
				game.loadForbidai("dwajad");//此处填武将包英文名
				
				//直接增加一个关闭开关
				config: {
					"dwajad": { "name": "将王翦设为禁用", "init": false },//:{前面填武将包英文名
				},
                */

                return null;
            });
    })();
}