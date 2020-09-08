game.import("extension", function (lib, game, ui, get, ai, _status) {
	return {
		name: "十六人扩展精简版",
		editable: true,
		precontent: function (config) {
			//---------------------------------------缩放---------------------------------------//
			if (config.jmsfaa) {
				game.addCharacterPack({
					skill: {
						"_useCardLimitaa": {
							mode: ['identity', 'guozhan', 'versus'],
							mod: {
								targetEnabled: function (card, player, target) {
									if (game.players.length + game.dead.length > 8 && get.distance(player, target) > 4) return false;
								}
							}
						},
						"_minskinSJaa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								global: ["gameStart", "useCardAfter", "useCardBefore", "phaseBefore", "loseEnd", "phaseBegin", "phaseDradBegin", "phaseUseBegin", "phaseUseEnd", "phaseEnd", "phaseDiscardAfter", "phaseDiscardBegin", "useSkillBefore", "judgeBefore", "judgeAfter"],
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13 && player && player != game.me && !player.isUnseen(1) && player.name2 && player.storage.STAVA2 != 0;
							},
							forced: true,
							content: function () {
								player.storage.STAVA2 = 0;
								player.setNickname = function (all) { };
								var avatar2 = ui.create.div(function () { if (player.name2) ui.click.charactercard(player.name2, '') });
								avatar2.style.height = '40px';
								avatar2.style.width = '40px';
								avatar2.style.borderRadius = '40px';
								avatar2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
								avatar2.style.left = '-10px';
								avatar2.style.top = '77px';
								avatar2.setBackground(player.name2, 'character');
								player.node.nameol.appendChild(avatar2);
								setInterval(function () { avatar2.setBackground(player.name2, 'character') }, 1000);
							},
						},
						"_minskinSJ1aa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								player: 'dieBefore',
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13 && player && player != game.me && player.isUnseen(1) && player.name2 && player.storage.STAVA2 != 0;
							},
							forced: true,
							content: function () {
								player.storage.STAVA2 = 0;
								player.setNickname = function (all) { };
								var avatar2 = ui.create.div(function () { if (player.name2) ui.click.charactercard(player.name2, '') });
								avatar2.style.height = '40px';
								avatar2.style.width = '40px';
								avatar2.style.borderRadius = '40px';
								avatar2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
								avatar2.style.left = '-10px';
								avatar2.style.top = '77px';
								avatar2.setBackground(player.name2, 'character');
								player.node.nameol.appendChild(avatar2);
								setInterval(function () { avatar2.setBackground(player.name2, 'character') }, 1000);
							},
						},
						// "_minskinEquipaa": {
						// 	mode: ['identity', 'guozhan', 'versus'],
						// 	mod: {
						// 		cardEnabled: function (card, player) {
						// 			if (game.players.length + game.dead.length >= 13 && player.isMin() && !player.hasSkill('ganran')) {
						// 				if (get.type(card) == 'equip') return true;
						// 			}
						// 		}
						// 	}
						// },
						"_minskinEquip1aa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								player: "equipBefore",
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13;
							},
							forced: true,
							content: function () {
								if (player && player != game.me) player.classList.remove('minskin');
							},
						},
						"_minskinEquip2aa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								player: "equipAfter",
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13;
							},
							forced: true,
							content: function () {
								if (player && player != game.me) player.classList.add('minskin');
							},
						},
						"_useMinskinaa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								global: ["gameStart", "useCardAfter", "useCardBefore", "phaseBefore", "loseEnd", "phaseBegin", "phaseDradBegin", "phaseUseBegin", "phaseUseEnd", "phaseEnd", "phaseDiscardAfter", "phaseDiscardBegin", "useSkillBefore", "judgeBefore", "judgeAfter"],
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13 && player && player != game.me && player.name2;
							},
							forced: true,
							content: function () {
								if (player) player.node.avatar2.remove();
							},
						},
						"_useMinskin1aa": {
							mode: ['identity', 'guozhan', 'versus'],
							trigger: {
								global: ["gameStart", "useCardAfter", "useCardBefore", "phaseBefore", "loseEnd", "phaseBegin", "phaseDradBegin", "phaseUseBegin", "phaseUseEnd", "phaseEnd", "phaseDiscardAfter", "phaseDiscardBegin", "useSkillBefore", "judgeBefore", "judgeAfter"],
							},
							filter: function (event, player) {
								return game.players.length + game.dead.length >= 13;
							},
							forced: true,
							content: function () {
								game.swapPlayer = function (all) { };
								game.swapControl = function (all) { };
								if (player && player != game.me) {
									player.classList.add('minskin');
								};
							},
						},

					}
				});

				//重写联机房间相关：【这个比较核心，是创建联机界面，需要改一下，虽然主要的UI显示都是通过style实现】
				ui.create.connectPlayers=function(ip){
					game.connectPlayers=[];
					let count = Math.max(8,lib.configOL.number);
					for(var i=0;i<count;i++){
						var player=ui.create.player(ui.window);
						player.dataset.position=i;
						player.dataset.number=count;
						player.classList.add('connect');
						game.connectPlayers.push(player);
						if(i>=lib.configOL.number){
							player.classList.add('unselectable2');
						}
					}
	
					var bar=ui.create.div(ui.window);
					bar.style.height='20px';
					bar.style.width='80%';
					bar.style.left='10%';
					bar.style.top='calc(200% / 7 - 120px + 5px)';
					bar.style.textAlign='center';
					var ipbar=ui.create.div('.shadowed',ip,bar);
					ipbar.style.padding='4px';
					ipbar.style.borderRadius='2px';
					ipbar.style.position='relative';
	
					var button=ui.create.div('.menubutton.large.highlight.connectbutton.pointerdiv',game.online?'退出联机':'开始游戏',ui.window,function(){
						if(button.clicked) return;
						if(game.online){
							if(game.onlinezhu){
								game.send('startGame');
							}
							else{
								game.saveConfig('tmp_owner_roomId');
								game.saveConfig('tmp_user_roomId');
								game.saveConfig('reconnect_info');
								game.reload();
							}
						}
						else{
							game.resume();
						}
						button.delete();
						bar.delete();
						delete ui.connectStartButton;
						delete ui.connectStartBar;
						button.clicked=true;
					});
	
					ui.connectStartButton=button;
					ui.connectStartBar=bar;
				}

				//感觉这个不用改：
				//1.主要使设置“明忠模式”都不用改，就让它限制8人；
				//2.lib.identity.name='身份'，满足8人开启“特殊身份”模式，也不需要改；
				// lib.message.server.changeRoomConfig=function(config){
				// 	if(this.id==game.onlinezhu){
				// 		game.broadcastAll(function(config){
				// 			for(var i in config){
				// 				lib.configOL[i]=config[i];
				// 			}
				// 			if(ui.connectStartBar){
				// 				ui.connectStartBar.firstChild.innerHTML=get.modetrans(lib.configOL,true);
				// 			}
				// 		},config);
				// 		if(lib.configOL.mode=='identity'&&lib.configOL.identity_mode=='zhong'&&game.connectPlayers){
				// 			for(var i=0;i<game.connectPlayers.length;i++){
				// 				game.connectPlayers[i].classList.remove('unselectable2');
				// 			}
				// 			let count = Math.max(8,lib.configOL.number);
				// 			lib.configOL.number=count;
				// 			game.updateWaiting();
				// 		}
				// 		if(game.onlineroom){
				// 			game.send('server','config',lib.configOL);
				// 		}
				// 		for(var i=0;i<game.connectPlayers.length;i++){
				// 			if(game.connectPlayers[i].playerid==this.id){
				// 				game.connectPlayers[i].chat('房间设置已更改');
				// 			}
				// 		}
				// 	}
				// }
			}
			//---------------------------------------9人---------------------------------------//
			if (config.IncreasePlayer5Number == '1') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'9': '九人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'9': '九人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '9',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '13' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '9', 'identity');
						game.saveConfig('player_number', '9', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
					}
				});
				if (config.nine9Man == '1') {
					lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.nine9Man == '2') {
					lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.nine9Man == '3') {
					lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.nine9Man == '4') {
					lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
			};
			//---------------------------------------10人---------------------------------------//
			if (config.IncreasePlayer5Number == '2') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'10': '十人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'10': '十人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '10',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '9' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '13' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '10', 'identity');
						game.saveConfig('player_number', '10', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
					}
				});
				if (config.ten10Man == '1') {
					lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.ten10Man == '2') {
					lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.ten10Man == '3') {
					lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
			};
			//---------------------------------------11人---------------------------------------//
			if (config.IncreasePlayer5Number == '3') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'11': '十一人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'11': '十一人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '11',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '12' || get.config('player_number') == '13' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '11', 'identity');
						game.saveConfig('player_number', '11', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
					}
				});
				if (lib.device) {
					game.saveConfig('layout', 'long');
				}
				if (config.eleven11Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.eleven11Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.eleven11Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.eleven11Man == '4') {
					lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
			};
			//---------------------------------------12人---------------------------------------//
			if (config.IncreasePlayer5Number == '4') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'12': '十二人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'12': '十二人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '12',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
						'12': '十二人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '13' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '12', 'identity');
						game.saveConfig('player_number', '12', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
						lib.translate.unknown11 = '十二号位';
					}
				});
				if (lib.device) {
					game.saveConfig('layout', 'long');
				}
				if (config.twelve12Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.twelve12Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.twelve12Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
			};
			//---------------------------------------13人---------------------------------------//
			if (config.IncreasePlayer5Number == '5') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'13': '十三人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'13': '十三人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '13',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
						'12': '十二人',
						'13': '十三人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '13', 'identity');
						game.saveConfig('player_number', '13', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
						lib.translate.unknown11 = '十二号位';
						lib.translate.unknown12 = '十三号位';
					}
				});
				if (lib.device) {
					game.saveConfig('layout', 'long');
				}
				if (config.thirteen13Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.thirteen13Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.thirteen13Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.thirteen13Man == '4') {
					lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
			};
			//---------------------------------------14人---------------------------------------//
			if (config.IncreasePlayer5Number == '6') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'14': '十四人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'14': '十四人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '14',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
						'12': '十二人',
						'13': '十三人',
						'14': '十四人',
					},
					frequent: true,
					restart: true,
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '15' || get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '13') {
						game.saveConfig('player_number', '14', 'identity');
						game.saveConfig('player_number', '14', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
						lib.translate.unknown11 = '十二号位';
						lib.translate.unknown12 = '十三号位';
						lib.translate.unknown13 = '十四号位';
					}
				});
				if (config.fourteen14Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.fourteen14Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.fourteen14Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					//1 5z 2n 6f
					//2 5z 1n 7f
					//3 6z 0n 7f

				}
			};
			//---------------------------------------15人---------------------------------------//
			if (config.IncreasePlayer5Number == '7') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'15': '十五人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'15': '十五人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '15',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
						'12': '十二人',
						'13': '十三人',
						'14': '十四人',
						'15': '十五人',
					},
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '16' || get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '13' || get.config('player_number') == '14') {
						game.saveConfig('player_number', '15', 'identity');
						game.saveConfig('player_number', '15', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
						lib.translate.unknown11 = '十二号位';
						lib.translate.unknown12 = '十三号位';
						lib.translate.unknown13 = '十四号位';
						lib.translate.unknown14 = '十五号位';
					}
				});
				if (config.fifteen15Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.fifteen15Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.fifteen15Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.fifteen15Man == '4') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					//1 6z 1n 7f
					//2 5z 2n 7f
					//3 7z 0n 7f
					//4 6z 0n 8f
				}
			};
			//---------------------------------------16人---------------------------------------//
			if (config.IncreasePlayer5Number == '8') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'16': '十六人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'16': '十六人',
				}
				lib.mode.identity.connect.connect_player_number = {
					name: '游戏人数',
					init: '16',
					item: {
						'2': '两人',
						'3': '三人',
						'4': '四人',
						'5': '五人',
						'6': '六人',
						'7': '七人',
						'8': '八人',
						'9': '九人',
						'10': '十人',
						'11': '十一人',
						'12': '十二人',
						'13': '十三人',
						'14': '十四人',
						'15': '十五人',
						'16': '十六人',
					},
				}
				lib.arenaReady.push(function () {
					if (get.config('player_number') == '9' || get.config('player_number') == '10' || get.config('player_number') == '11' || get.config('player_number') == '12' || get.config('player_number') == '13' || get.config('player_number') == '14' || get.config('player_number') == '15') {
						game.saveConfig('player_number', '16', 'identity');
						game.saveConfig('player_number', '16', 'guozhan');
					};
					if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
						if (lib.device) {
							var zoom = function (num) {
								var zoom = num;
								game.documentZoom = game.deviceZoom * zoom;
								document.documentElement.style.zoom = game.documentZoom;
							};
							zoom(0.8);
						}
						ui.arenalog.style.top = '240px';
						ui.arenalog.style.height = '35%';
						lib.translate.unknown8 = '九号位';
						lib.translate.unknown9 = '十号位';
						lib.translate.unknown10 = '十一号位';
						lib.translate.unknown11 = '十二号位';
						lib.translate.unknown12 = '十三号位';
						lib.translate.unknown13 = '十四号位';
						lib.translate.unknown14 = '十五号位';
						lib.translate.unknown15 = '十六号位';
					}
				});
				if (config.Sixteen16Man == '1') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.Sixteen16Man == '2') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
				}
				if (config.Sixteen16Man == '3') {
					lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					//1 6z 2n 7f
					//2 6z 1n 8f
					//3 7z 0n 8f  
				}
			};
			//---------------------------------------全部---------------------------------------//
			if (config.IncreasePlayer5Number == 'all') {
				game.saveConfig('player_height', 'short');
				lib.mode.identity.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'9': '九人',
					'10': '十人',
					'11': '十一人',
					'12': '十二人',
					'13': '十三人',
					'14': '十四人',
					'15': '十五人',
					'16': '十六人',
				}
				lib.mode.guozhan.config.player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'9': '九人',
					'10': '十人',
					'11': '十一人',
					'12': '十二人',
					'13': '十三人',
					'14': '十四人',
					'15': '十五人',
					'16': '十六人',
				}
				lib.mode.identity.connect.connect_player_number.item = {
					'2': '两人',
					'3': '三人',
					'4': '四人',
					'5': '五人',
					'6': '六人',
					'7': '七人',
					'8': '八人',
					'9': '九人',
					'10': '十人',
					'11': '十一人',
					'12': '十二人',
					'13': '十三人',
					'14': '十四人',
					'15': '十五人',
					'16': '十六人',
				}
				if (get.config('player_number') == '9') {
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
						}
					});
					if (config.nine9Man == '1') {
						lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.nine9Man == '2') {
						lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.nine9Man == '3') {
						lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.nine9Man == '4') {
						lib.config.mode_config.identity.identity.push(['zhu', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
				};
				if (get.config('player_number') == '10') {
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
						}
					});
					if (config.ten10Man == '1') {
						lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.ten10Man == '2') {
						lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.ten10Man == '3') {
						lib.config.mode_config.identity.identity.push([], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
				};
				if (get.config('player_number') == '11') {
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
						}
					});
					if (lib.device) {
						game.saveConfig('layout', 'long');
					}
					if (config.eleven11Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.eleven11Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.eleven11Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.eleven11Man == '4') {
						lib.config.mode_config.identity.identity.push([], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
				};
				if (get.config('player_number') == '12') {
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
							lib.translate.unknown11 = '十二号位';
						}
					});
					if (lib.device) {
						game.saveConfig('layout', 'long');
					}
					if (config.twelve12Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.twelve12Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.twelve12Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
				};
				if (get.config('player_number') == '13') {
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
							lib.translate.unknown11 = '十二号位';
							lib.translate.unknown12 = '十三号位';
						}
					});
					if (lib.device) {
						game.saveConfig('layout', 'long');
					}
					if (config.thirteen13Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.thirteen13Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.thirteen13Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.thirteen13Man == '4') {
						lib.config.mode_config.identity.identity.push([], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
				};
				if (get.config('player_number') == '14') {
					game.saveConfig('player_height', 'short');
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
							lib.translate.unknown11 = '十二号位';
							lib.translate.unknown12 = '十三号位';
							lib.translate.unknown13 = '十四号位';
						}
					});
					if (config.fourteen14Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.fourteen14Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.fourteen14Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
						//1 5z 2n 6f
						//2 5z 1n 7f
						//3 6z 0n 7f
					}
				};
				if (get.config('player_number') == '15') {
					game.saveConfig('player_height', 'short');
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
							lib.translate.unknown11 = '十二号位';
							lib.translate.unknown12 = '十三号位';
							lib.translate.unknown13 = '十四号位';
							lib.translate.unknown14 = '十五号位';
						}
					});
					if (config.fifteen15Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.fifteen15Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.fifteen15Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.fifteen15Man == '4') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
						//1 6z 1n 7f
						//2 5z 2n 7f
						//3 7z 0n 7f
						//4 6z 0n 8f
					}
				};
				if (get.config('player_number') == '16') {
					game.saveConfig('player_height', 'short');
					lib.arenaReady.push(function () {
						if ((get.mode() == 'identity') || (get.mode() == 'guozhan')) {
							if (lib.device) {
								var zoom = function (num) {
									var zoom = num;
									game.documentZoom = game.deviceZoom * zoom;
									document.documentElement.style.zoom = game.documentZoom;
								};
								zoom(10 / 7);
							}
							ui.arenalog.style.top = '240px';
							ui.arenalog.style.height = '35%';
							lib.translate.unknown8 = '九号位';
							lib.translate.unknown9 = '十号位';
							lib.translate.unknown10 = '十一号位';
							lib.translate.unknown11 = '十二号位';
							lib.translate.unknown12 = '十三号位';
							lib.translate.unknown13 = '十四号位';
							lib.translate.unknown14 = '十五号位';
							lib.translate.unknown15 = '十六号位';
						}
					});
					if (config.Sixteen16Man == '1') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.Sixteen16Man == '2') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'nei', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
					}
					if (config.Sixteen16Man == '3') {
						lib.config.mode_config.identity.identity.push([], [], [], [], [], [], [], ['zhu', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'zhong', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan']);
						//1 6z 2n 7f
						//2 6z 1n 8f
						//3 7z 0n 8f  
					}
				};
			};

			//多人布局css：后续需要修改，现布局有点不太行
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='9']>.player[data-position='1']{top:30px;left:calc(97% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='2']{top:20px;left:calc(84% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='3']{top:10px;left:calc(71% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='4']{top:0;left:calc(58% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='5']{top:0;left:calc(45% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='6']{top:10px;left:calc(32% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='7']{top:20px;left:calc(19% - 75px);}";
				style.innerHTML += "[data-number='9']>.player[data-position='8']{top:30px;left:calc(6% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='10']>.player[data-position='1']{top:calc(200% / 3 - 170px);left:calc(97% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='2']{top:0px;left:calc(97% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='3']{top:0px;left:calc(84% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='4']{top:5px;left:calc(71% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='5']{top:0;left:calc(58% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='6']{top:5px;left:calc(45% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='7']{top:0px;left:calc(32% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='8']{top:5px;left:calc(19% - 75px);}";
				style.innerHTML += "[data-number='10']>.player[data-position='9']{top:10px;left:calc(6% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='11']>.player[data-position='1']{top:calc(200% / 3 - 175px);left:calc(96% - 60px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='2']{top:-5px;left:calc(95% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='3']{top:-5px;left:calc(82% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='4']{top:0;left:calc(69% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='5']{top:0;left:calc(56% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='6']{top:0;left:calc(43% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='7']{top:0;left:calc(30% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='8']{top:-5px;left:calc(17% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='9']{top:-5px;left:calc(4% - 53px);}";
				style.innerHTML += "[data-number='11']>.player[data-position='10']{top:calc(200% / 3 - 175px);left:calc(18% - 55px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='12']>.player[data-position='1']{top:calc(200% / 3 - 155px);left:calc(84% - 75px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='2']{top:calc(200% / 3 - 175px);left:calc(95% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='3']{top:-5px;left:calc(95% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='4']{top:-5px;left:calc(82% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='5']{top:-5px;left:calc(69% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='6']{top:0;left:calc(56% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='7']{top:0;left:calc(43% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='8']{top:-5px;left:calc(30% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='9']{top:-5px;left:calc(17% - 53px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='10']{top:-5px;left:calc(4% - 60px);}";
				style.innerHTML += "[data-number='12']>.player[data-position='11']{top:calc(200% / 3 - 175px);left:calc(6% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='13']>.player[data-position='1']{top:calc(200% / 3 - 155px);left:calc(84% - 75px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='2']{top:calc(200% / 3 - 175px);left:calc(95% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='3']{top:-5px;left:calc(95% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='4']{top:-5px;left:calc(82% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='5']{top:-5px;left:calc(69% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='6']{top:0;left:calc(56% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='7']{top:0;left:calc(43% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='8']{top:-5px;left:calc(30% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='9']{top:-5px;left:calc(17% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='10']{top:-5px;left:calc(4% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='11']{top:calc(200% / 3 - 190px);left:calc(17% - 53px);}";
				style.innerHTML += "[data-number='13']>.player[data-position='12']{top:calc(200% / 3 - 155px);left:calc(4% - 55px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='14']>.player[data-position='1']{top:calc(40%);left:calc(86% - 75px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='2']{top:calc(30%);left:calc(98% - 75px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='3']{top:0;left:calc(98% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='4']{top:0;left:calc(86.4% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='5']{top:0;left:calc(74.8% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='6']{top:0;left:calc(63.2% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='7']{top:0;left:calc(51.6% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='8']{top:0;left:calc(40% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='9']{top:0;left:calc(28.4% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='10']{top:0;left:calc(16.8% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='11']{top:0;left:calc(5.2% - 80px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='12']{top:calc(30%);left:calc(5% - 75px);}";
				style.innerHTML += "[data-number='14']>.player[data-position='13']{top:calc(40%);left:calc(16% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='15']>.player[data-position='1']{top:calc(43%);left:calc(98% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='2']{top:calc(30%);left:calc(88% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='3']{top:10px;left:calc(98.5% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='4']{top:5px;left:calc(88% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='5']{top:5px;left:calc(77.5% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='6']{top:5px;left:calc(67% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='7']{top:0;left:calc(56.5% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='8']{top:0;left:calc(46% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='9']{top:5px;left:calc(35.5% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='10']{top:5px;left:calc(25% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='11']{top:5px;left:calc(14.5% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='12']{top:5px;left:calc(4% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='13']{top:calc(30%);left:calc(4% - 75px);}";
				style.innerHTML += "[data-number='15']>.player[data-position='14']{top:calc(43%);left:calc(15% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='16']>.player[data-position='1']{top:calc(51%);left:calc(98% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='2']{top:calc(26.3%);left:calc(98% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='3']{top:10px;left:calc(98.5% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='4']{top:5px;left:calc(89.05% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='5']{top:5px;left:calc(79.6% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='6']{top:5px;left:calc(70.15% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='7']{top:0;left:calc(60.7% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='8']{top:0;left:calc(51.25% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='9']{top:5px;left:calc(41.8% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='10']{top:5px;left:calc(32.35% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='11']{top:5px;left:calc(22.9% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='12']{top:5px;left:calc(13.45% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='13']{top:0px;left:calc(4% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='14']{top:calc(25.3%);left:calc(5.5% - 75px);}";
				style.innerHTML += "[data-number='16']>.player[data-position='15']{top:calc(49.2%);left:calc(5% - 75px);}";
				document.head.appendChild(style);
			}
			cssStyle();
			var cssStyle = function () {
				var style = document.createElement('style');
				style.innerHTML = "[data-number='17']>.player[data-position='1']{top:calc(100% / 3 + 160px);left:calc(50% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='2']{top:calc(100% / 3 + 160px);left:calc(95% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='3']{top:calc(100% / 3 + 30px);left:calc(95% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='4']{top:calc(100% / 3 - 100px);left:calc(95% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='5']{top:calc(100% / 3 - 230px);left:calc(95% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='6']{top:30px;left:calc(83.75% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='7']{top:20px;left:calc(72.5% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='8']{top:5px;left:calc(61.25% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='9']{top:0;left:calc(50% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='10']{top:5px;left:calc(38.75% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='11']{top:20px;left:calc(27.5% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='12']{top:30px;left:calc(16.25% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='13']{top:calc(100% / 3 - 230px);left:calc(5% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='14']{top:calc(100% / 3 - 100px);left:calc(5% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='15']{top:calc(100% / 3 + 30px);left:calc(5% - 75px);}";
				style.innerHTML += "[data-number='17']>.player[data-position='16']{top:calc(100% / 3 + 160px);left:calc(5% - 75px);}";
				document.head.appendChild(style);
			}


			//联机的css：
			/** 根据个数生成对象显示style */
			function outputCssStyle(num) {
				let outputStr = "";
				let calNum = Math.ceil(num/2);
				let width = 150;
				let sumWidth = width*calNum;
				// let jiange = `((100% - ${sumWidth}px) / ${calNum-1})`;//间隔
				let jiange = `30px`;//间隔
				let start = `((100% - ${sumWidth}px - ${jiange} * ${calNum-1}) / 2)`;//起使位置  - ${jiange} * ${calNum-1}

				for (let i = 0; i < num; i++) {
					if(i < calNum) {
						// outputStr += `#window>.player.connect[data-position='${i}'][data-number='${num}']{left:calc(100% / ${calNum} * ${i} + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}`;
						outputStr += `#window>.player.connect[data-position='${i}'][data-number='${num}']{left:calc(${start} + ${width}px * ${i} + ${jiange} * ${i});top:calc(300% / 7 - 160px + 5px);}\n`;
					} else {
						outputStr += `#window>.player.connect[data-position='${i}'][data-number='${num}']{left:calc(${start} + ${width*(i-calNum)}px + ${jiange} * ${i-calNum});top:calc(400% / 7 - 40px + 5px);}\n`;
					}
				}

				var style = document.createElement('style');
				style.innerHTML = outputStr;
				document.head.appendChild(style);
			}
			outputCssStyle(9);
			outputCssStyle(10);
			outputCssStyle(11);
			outputCssStyle(12);
			outputCssStyle(13);
			outputCssStyle(14);
			outputCssStyle(15);
			outputCssStyle(16);

			/*--------位置(联机)------*/
			/*-----------测试模式12人----------*/
			// #window>.player.connect[data-position='0'][data-number='12']{left:calc(100% / 7 * 0 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='1'][data-number='12']{left:calc(100% / 7 * 1 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='2'][data-number='12']{left:calc(100% / 7 * 2 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='3'][data-number='12']{left:calc(100% / 7 * 3 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='4'][data-number='12']{left:calc(100% / 7 * 4 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='5'][data-number='12']{left:calc(100% / 7 * 5 + 100% / 7 / 6);top:calc(300% / 7 - 160px + 5px);}
			// #window>.player.connect[data-position='6'][data-number='12']{left:calc(100% / 7 * 0 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}
			// #window>.player.connect[data-position='7'][data-number='12']{left:calc(100% / 7 * 1 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}
			// #window>.player.connect[data-position='8'][data-number='12']{left:calc(100% / 7 * 2 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}
			// #window>.player.connect[data-position='9'][data-number='12']{left:calc(100% / 7 * 3 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}
			// #window>.player.connect[data-position='10'][data-number='12']{left:calc(100% / 7 * 4 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}
			// #window>.player.connect[data-position='11'][data-number='12']{left:calc(100% / 7 * 5 + 100% / 7 / 6);top:calc(400% / 7 - 40px + 5px);}

		}, content: function (config, pack) {

		}, 
		help: {},
		config: {
			"jmsfaa": {
				"name": "缩放",
				"init": false,
				"intro": "开启后，人数大于12时缩小武将牌。8人局以上，任何卡牌不能指定距离大于四的角色为目标。"
			},
			"IncreasePlayer5Number": {
				"name": "增加人数",
				"init": "all",
				"item": {
					"0": "不增加",
					"1": "+1",
					"2": "+2",
					"3": "+3",
					"4": "+4",
					"5": "+5",
					"6": "+6",
					"7": "+7",
					"8": "+8",
					"all": "全部增加"
				}
			},
			"nine9Man": {
				"name": "九人场身份",
				"init": "1",
				"item": {
					"1": "三忠四反一内",
					"2": "二忠四反二内",
					"3": "四忠四反零内",
					"4": "三忠五反零内"
				}
			},
			"ten10Man": {
				"name": "十人场身份",
				"init": "1",
				"item": {
					"1": "三忠四反二内",
					"2": "三忠五反一内",
					"3": "四忠五反零内"
				}
			},
			"eleven11Man": {
				"name": "十一人场身份",
				"init": "1",
				"item": {
					"1": "四忠五反一内",
					"2": "三忠五反二内",
					"3": "五忠五反零内",
					"4": "四忠六反零内"
				}
			},
			"twelve12Man": {
				"name": "十二人场身份",
				"init": "1",
				"item": {
					"1": "四忠五反二内",
					"2": "四忠六反一内",
					"3": "五忠六反零内"
				}
			},
			"thirteen13Man": {
				"name": "十三人场身份",
				"init": "1",
				"item": {
					"1": "五忠六反一内",
					"2": "四忠六反二内",
					"3": "六忠六反零内",
					"4": "五忠七反零内"
				}
			},
			"fourteen14Man": {
				"name": "十四人场身份",
				"init": "1",
				"item": {
					"1": "五忠六反二内",
					"2": "五忠七反一内",
					"3": "六忠七反零内"
				}
			},
			"fifteen15Man": {
				"name": "十五人场身份",
				"init": "1",
				"item": {
					"1": "六忠七反一内",
					"2": "五忠七反二内",
					"3": "七忠七反零内",
					"4": "六忠八反零内"
				}
			},
			"Sixteen16Man": {
				"name": "十六人场身份",
				"init": "1",
				"item": {
					"1": "六忠七反二内",
					"2": "六忠八反一内",
					"3": "七忠八反零内"
				}
			}
		},
		package: {
			character: {
				character: {
				},
				translate: {
				},
			},
			card: {
				card: {
				},
				translate: {
				},
				list: [],
			},
			skill: {
				skill: {
				},
				translate: {
				},
			},
			intro: "1.食用前请删十人扩展，食用方法，开启十六人扩展》开始选项》身份或国战》人数》八人以上。<br><span style=\"color: red\">2.关闭方法》开始选项》身份和国战》人数》8人》关闭十六人扩展。<br>注，不按此操作者，需重置无名杀注，不按此操作者，需重置无名杀注，不按此操作者，需重置无名杀，重要的事情说三遍</span><br>3.此扩展代码从《新英魂之忍》《风华绝代》扩展参考并搬运<br>4.搬运者太上大牛<br>人数太多请调缩放<br>个人新扩展：联机9-16人",
			author: "无名玩家",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		}, files: { "character": [], "card": [], "skill": [] }
	}
})