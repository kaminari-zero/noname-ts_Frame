game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"自由选将",content:function (config,pack){
    var enabledPack=[];
	var disabledPack=[];
	lib.freeChooseExt2={};
	for(var p in lib.characterPack){
		if(!lib.config.blackListPack.contains(p)){
			enabledPack.push(p);
		}
		var name="freeChooseExt2_"+p;
		var pack=p;
		if(p.indexOf('_')!=-1){
			var p1=p.split('_')[2];
			pack=game.getJsonKey(lib.translate,p1);
		}
		var str=pack;
		if(lib.translate[pack+"_character_config"]){
			str=lib.translate[pack+"_character_config"];
		}
		lib.card[name]={
			fullskin:true,
			type:'武将包',
		};
		lib.freeChooseExt2[name]=p;
		lib.translate[name]=str;
	}
	lib.enabledCPack=enabledPack;
	lib.disabledPack=lib.config.blackListPack;
	//偷看代码的大哥，不到帖子里回复下吗？
	if(lib.config.mode=="brawl"){
		if(!lib.storage.scene) lib.storage.scene={};
		var sk=lib.storage.scene["设可选包"];
		if(!lib.storage.scene["设可选包"]){
			lib.storage.scene["设可选包"]={
				name:"设可选包",
				intro:"本场景隶属于“自由选将”扩展包，用于配置自定义可选的武将包。",
				players:[{"name":"djidjcnc","name2":"none","identity":"fan","position":1,"hp":999,"maxHp":999,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"djidjcnc","name2":"none","identity":"fan","position":7,"hp":999,"maxHp":999,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]}],
				gameDraw:true,
				cardPileTop:[],
				cardPileBottom:[],
				discardPile:[],
			};
			_status.extensionscene=true;}
			if(!_status.extensionmade) _status.extensionmade=[];
			_status.extensionmade.push("设可选包");
		}
},precontent:function (config){
    if(!config.enableExt)return;

    lib.freeChooseExt={};
	var standardPack=['standard','refresh','yijiang','sp','shenhua'];
	if(!lib.config.blackListPack){
		game.saveConfig("blackListPack",[]);
	}
	
	game.getJsonLength=function(jsonData){
        var length=0;
        for(var ever in jsonData) {
            length++;
        }
        return length;
    };
    game.playerNames=function(){
        var list=[];
        for(var i=0;i<game.players.length;i++){
            list.push(game.players[i].name);
        }
        return list;
    };
    lib.packCanSelect=config.packCanSelect*1;
    game.getJsonKey=function(jsonData,value){
        var json1={};
        for(var ever in jsonData) {
            json1[jsonData[ever]]=ever;
        }
        if(json1[value]!=undefined&&json1[value].indexOf('_')==-1)
        	return json1[value];
        else
          	return value;
    };
	lib.characterPack2={};
	lib.hasCharacterPack=false;
	if(!lib.extensionMenu['extension_自由选将']["intro1"]){
		var s=lib.config.mode=="connect"?'':'不';
		var Name="<font color=Blue>当前</font><font color=Red>"+s+"是<font color=Blue>联机模式，您所更改<br>的以下选项卡在重启后生效";
		lib.extensionMenu['extension_自由选将']["intro1"]={
			clear:true,
			nopointer:true,
		}
		lib.extensionMenu['extension_自由选将']["intro1"].name=Name;
	}
	if(!lib.extensionMenu['extension_自由选将']["intro3"]){
		lib.extensionMenu['extension_自由选将']["intro3"]={
			name:"<font color=Purple>武将包开关：</font>",
			clear:true,
			nopointer:true,
		}
	}
	game.addCharacterPackMethod=function(pack,packagename){
		var extname=_status.extension||'扩展';
		lib.hasCharacterPack=true;
		packagename=packagename||extname;
		
		var packname='mode_extension_'+packagename;
		
		var reloadMsg="<font color=Red><重启后生效>";
		if(!lib.extensionMenu['extension_自由选将'][packname]){
			lib.extensionMenu['extension_自由选将'][packname]={};
			var intro="设置开启"+packagename+"武将包"+reloadMsg;
			var bolM=function(){
				if(lib.config["extension_自由选将_"+packname]==undefined){
					return true;
				}
				return lib.config["extension_自由选将_"+packname];
			};
			var bol=bolM();
			lib.extensionMenu['extension_自由选将'][packname].name=packagename;
			lib.extensionMenu['extension_自由选将'][packname].intro=intro;
			lib.extensionMenu['extension_自由选将'][packname].init=bol;
		}
		
		if(!lib.config["extension_自由选将_"+packname]){
			return;
		}
		for(var i in pack){
			if(i=='mode'||i=='forbid') continue;
			for(var j in pack[i]){
				if(i=='character'){
					if(!pack[i][j][4]){
						pack[i][j][4]=[];
					}
					var imgsrc;
					if(_status.evaluatingExtension){
						imgsrc='db:extension-'+extname+':'+j+'.jpg';
					}
					else{
						imgsrc='ext:'+extname+'/'+j+'.jpg';
					}
					pack[i][j][4].push(imgsrc);
					if(pack[i][j][4].contains('boss')||
						pack[i][j][4].contains('hiddenboss')){
						lib.config.forbidai.add(j);
					}
					if(lib.config.forbidai_user&&lib.config.forbidai_user.contains(j)){
						lib.config.forbidai.add(j);
					}
					for(var l=0;l<pack[i][j][3].length;l++){
						lib.skilllist.add(pack[i][j][3][l]);
					}
				}
				else if(i=='skill'){
					if(typeof pack[i][j].audio=='number'||typeof pack[i][j].audio=='boolean'){
						pack[i][j].audio='ext:'+extname+':'+pack[i][j].audio;
					}
				}
				if(lib[i][j]==undefined){
					lib[i][j]=pack[i][j];
				}
			}
		}
		lib.characterPack[packname]=pack.character;
		lib.translate[packname+'_character_config']=packagename;
		if(!lib.connectCharacterPack.contains(packname))
			lib.connectCharacterPack.push(packname);
		
	};
	if(config.cPackCanConnect){
		game.addCharacterPack=function(pack,packagename){
			game.addCharacterPackMethod(pack,packagename);
		}
		if(_status.connectMode){
			for(var a in lib.extensionPack){
				var pack=lib.extensionPack[a];
				var b={
					character:{},
					translate:{},
					skill:{},
				};
				if(pack.character){
					var character=pack.character.character;
					var translate=pack.character.translate;
					var length=game.getJsonLength(character);
					var length2=0;
					if(translate){
						length2=game.getJsonLength(translate);
					}
					
					if(length>0){
						for(var i in character){
							b.character[i]=character[i];
						}
					}
					if(length2>0){
						for(var i in translate){
							b.translate[i]=translate[i];
						}
					}
					if(pack.skill){
						var skills=pack.skill.skill;
						for(var i in skills){
							b.skill[i]=skills[i];
						}
						for(var i in pack.skill.translate){
							b.translate[i]=pack.skill.translate[i];
						}
					}
					game.addCharacterPackMethod(b,a);
				}
			}
		}
	}
	lib.init.onload=function(){
		if(navigator.userAgent.toLowerCase().indexOf('crosswalk')!=-1){
			lib.crosswalk=true;
		}
		if(lib.device=='android'&&window.devicePixelRatio>1&&document.documentElement.offsetWidth<900&&!lib.crosswalk){
			game.documentZoom=Math.round(document.documentElement.offsetWidth/96)/10;
			game.deviceZoom=game.documentZoom;
			document.documentElement.style.zoom=game.documentZoom;
		}
		else{
			if(lib.device=='ios'){
				if(document.documentElement.offsetWidth<900){
					var zoom=Math.round(document.documentElement.offsetWidth/96)/10;
					var metas=document.head.querySelectorAll('meta');
					for(var j=0;j<metas.length;j++){
						if(metas[j].name=='viewport'){
							metas[j].content="user-scalable=no, initial-scale="+zoom+", maximum-scale="+zoom+", minimum-scale="+zoom+", width=device-width, height=device-height";
							break;
						}
					}
					game.metaZoom=zoom;
					var barHeight=Math.round(20/zoom);
					lib.init.sheet(
						'.statusbar #window{top:'+barHeight+'px;height:calc(100% - '+barHeight+'px)}',
						'.statusbar #statusbg{height:'+barHeight+'px}'
					);
				}
			}
			game.documentZoom=1;
			game.deviceZoom=1;
		}
		ui.background=ui.create.div('.background');
		ui.background.style.backgroundSize="cover";
		ui.background.style.backgroundPosition='50% 50%';
		if(lib.config.image_background&&lib.config.image_background!='default'&&lib.config.image_background.indexOf('custom_')!=0){
			ui.background.setBackgroundImage('image/background/'+lib.config.image_background+'.jpg');
			if(lib.config.image_background_blur){
				ui.background.style.filter='blur(8px)';
				ui.background.style.webkitFilter='blur(8px)';
				ui.background.style.transform='scale(1.05)';
			}
		}
		document.documentElement.style.backgroundImage='';
		document.documentElement.style.backgroundSize='';
		document.documentElement.style.backgroundPosition='';
		document.body.insertBefore(ui.background,document.body.firstChild);
		document.body.onresize=ui.updatex;
		if(lib.config.touchscreen){
			document.body.addEventListener('touchstart',function(e){
				this.startX=e.touches[0].clientX/game.documentZoom;
				this.startY=e.touches[0].clientY/game.documentZoom;
				_status.dragged=false;
			});
			document.body.addEventListener('touchmove',function(e){
				if(_status.dragged) return;
				if (Math.abs(e.touches[0].clientX/game.documentZoom - this.startX) > 10 ||
					Math.abs(e.touches[0].clientY/game.documentZoom - this.startY) > 10) {
					_status.dragged=true;
				}
			});
		}

		if(lib.config.image_background.indexOf('custom_')==0){
			ui.background.style.backgroundImage="none";
			game.getDB('image',lib.config.image_background,function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent)
				{
					var data = fileLoadedEvent.target.result;
					ui.background.style.backgroundImage='url('+data+')';
					if(lib.config.image_background_blur){
						ui.background.style.filter='blur(8px)';
						ui.background.style.webkitFilter='blur(8px)';
						ui.background.style.transform='scale(1.05)';
					}
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.card_style=='custom'){
			game.getDB('image','card_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.card_stylesheet){
						ui.css.card_stylesheet.remove();
					}
					ui.css.card_stylesheet=lib.init.sheet('.card:not(*:empty){background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.cardback_style=='custom'){
			game.getDB('image','cardback_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.cardback_stylesheet){
						ui.css.cardback_stylesheet.remove();
					}
					ui.css.cardback_stylesheet=lib.init.sheet('.card:empty,.card.infohidden{background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
			game.getDB('image','cardback_style2',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.cardback_stylesheet2){
						ui.css.cardback_stylesheet2.remove();
					}
					ui.css.cardback_stylesheet2=lib.init.sheet('.card.infohidden:not(.infoflip){background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.hp_style=='custom'){
			game.getDB('image','hp_style1',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.hp_stylesheet1){
						ui.css.hp_stylesheet1.remove();
					}
					ui.css.hp_stylesheet1=lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
			game.getDB('image','hp_style2',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.hp_stylesheet2){
						ui.css.hp_stylesheet2.remove();
					}
					ui.css.hp_stylesheet2=lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
			game.getDB('image','hp_style3',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.hp_stylesheet3){
						ui.css.hp_stylesheet3.remove();
					}
					ui.css.hp_stylesheet3=lib.init.sheet('.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
			game.getDB('image','hp_style4',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.hp_stylesheet4){
						ui.css.hp_stylesheet4.remove();
					}
					ui.css.hp_stylesheet4=lib.init.sheet('.hp:not(.text):not(.actcount)>.lost{background-image:url('+fileLoadedEvent.target.result+')}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.player_style=='custom'){
			ui.css.player_stylesheet=lib.init.sheet('#window .player{background-image:none;background-size:100% 100%;}');
			game.getDB('image','player_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.player_stylesheet){
						ui.css.player_stylesheet.remove();
					}
					ui.css.player_stylesheet=lib.init.sheet('#window .player{background-image:url("'+fileLoadedEvent.target.result+'");background-size:100% 100%;}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.border_style=='custom'){
			game.getDB('image','border_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.border_stylesheet){
						ui.css.border_stylesheet.remove();
					}
					ui.css.border_stylesheet=lib.init.sheet();
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg{display:block;background-image:url("'+fileLoadedEvent.target.result+'")}',0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}',0);
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.control_style=='custom'){
			game.getDB('image','control_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.control_stylesheet){
						ui.css.control_stylesheet.remove();
					}
					ui.css.control_stylesheet=lib.init.sheet('#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("'+fileLoadedEvent.target.result+'")}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}
		if(lib.config.menu_style=='custom'){
			game.getDB('image','menu_style',function(fileToLoad){
				if(!fileToLoad) return;
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					if(ui.css.menu_stylesheet){
						ui.css.menu_stylesheet.remove();
					}
					ui.css.menu_stylesheet=lib.init.sheet('html #window>.dialog.popped,html .menu,html .menubg{background-image:url("'+fileLoadedEvent.target.result+'");background-size:cover}');
				};
				fileReader.readAsDataURL(fileToLoad, "UTF-8");
			});
		}

		var proceed2=function(){
			var mode=lib.imported.mode;
			var card=lib.imported.card;
			var character=lib.imported.character;
			var play=lib.imported.play;
			delete window.game;
			var i,j,k;
			for(i in mode[lib.config.mode].element){
				if(!lib.element[i]) lib.element[i]=[];
				for(j in mode[lib.config.mode].element[i]){
					if(j=='init'){
						if(!lib.element[i].inits) lib.element[i].inits=[];
						lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
					}
					else{
						lib.element[i][j]=mode[lib.config.mode].element[i][j];
					}
				}
			}
			for(i in mode[lib.config.mode].ai){
				if(typeof mode[lib.config.mode].ai[i]=='object'){
					if(ai[i]==undefined) ai[i]={};
					for(j in mode[lib.config.mode].ai[i]){
						ai[i][j]=mode[lib.config.mode].ai[i][j];
					}
				}
				else{
					ai[i]=mode[lib.config.mode].ai[i];
				}
			}
			for(i in mode[lib.config.mode].ui){
				if(typeof mode[lib.config.mode].ui[i]=='object'){
					if(ui[i]==undefined) ui[i]={};
					for(j in mode[lib.config.mode].ui[i]){
						ui[i][j]=mode[lib.config.mode].ui[i][j];
					}
				}
				else{
					ui[i]=mode[lib.config.mode].ui[i];
				}
			}
			for(i in mode[lib.config.mode].game){
				game[i]=mode[lib.config.mode].game[i];
			}
			for(i in mode[lib.config.mode].get){
				get[i]=mode[lib.config.mode].get[i];
			}
			lib.init.start=mode[lib.config.mode].start;
			lib.init.startBefore=mode[lib.config.mode].startBefore;
			if(game.onwash){
				lib.onwash.push(game.onwash);
				delete game.onwash;
			}
			if(game.onover){
				lib.onover.push(game.onover);
				delete game.onover;
			}
			lib.config.banned=lib.config[lib.config.mode+'_banned']||[];
			lib.config.bannedcards=lib.config[lib.config.mode+'_bannedcards']||[];

			lib.rank=window.noname_character_rank;
			delete window.noname_character_rank;
			for(i in mode[lib.config.mode]){
				if(i=='element') continue;
				if(i=='game') continue;
				if(i=='ai') continue;
				if(i=='ui') continue;
				if(i=='get') continue;
				if(i=='config') continue;
				if(i=='onreinit') continue;
				if(i=='start') continue;
				if(i=='startBefore') continue;
				if(lib[i]==undefined) lib[i]=(Array.isArray(mode[lib.config.mode][i]))?[]:{};
				for(j in mode[lib.config.mode][i]){
					lib[i][j]=mode[lib.config.mode][i][j];
				}
			}
			if(typeof mode[lib.config.mode].init=='function'){
				mode[lib.config.mode].init();
			}

			var connectCharacterPack=[];
			var connectCardPack=[];
			for(i in character){
				if(character[i].character){
					lib.characterPack[i]=character[i].character
				}
				for(j in character[i]){
					if(j=='mode'||j=='forbid') continue;
					if(j=='connect'){
						connectCharacterPack.push(i);
						continue;
					}
					if(j=='character'&&!lib.config.characters.contains(i)&&lib.config.mode!='connect'){
						if(lib.config.mode=='chess'&&get.config('chess_mode')=='leader'){
							for(k in character[i][j]){
								lib.hiddenCharacters.push(k);
							}
						}
						else if(lib.config.mode!='boss'||i!='boss'){
							continue;
						}
					}
					if(Array.isArray(lib[j])&&Array.isArray(character[i][j])){
						lib[j].addArray(character[i][j]);
						continue;
					}
					for(k in character[i][j]){
						if(j=='character'){
							if(!character[i][j][k][4]){
								character[i][j][k][4]=[];
							}
							if(character[i][j][k][4].contains('boss')||
								character[i][j][k][4].contains('hiddenboss')){
								lib.config.forbidai.add(k);
							}
							if(lib.config.forbidai_user&&lib.config.forbidai_user.contains(k)){
								lib.config.forbidai.add(k);
							}
							for(var l=0;l<character[i][j][k][3].length;l++){
								lib.skilllist.add(character[i][j][k][3][l]);
							}
						}
						if(j=='skill'&&k[0]=='_'&&(!lib.config.characters.contains(i)||(lib.config.mode=='connect'&&!character[i].connect))){
							continue;
						}
						if(j=='translate'&&k==i){
							lib[j][k+'_character_config']=character[i][j][k];
						}
						else{
							if(lib[j][k]==undefined){
								if(j=='skill'&&lib.config.mode=='connect'&&!character[i].connect){
									lib[j][k]={
										nopop:character[i][j][k].nopop,
										derivation:character[i][j][k].derivation
									};
								}
								else{
									lib[j][k]=character[i][j][k];
								}
								if(j=='card'&&lib[j][k].derivation){
									if(!lib.cardPack.mode_derivation){
										lib.cardPack.mode_derivation=[k];
									}
									else{
										lib.cardPack.mode_derivation.push(k);
									}
								}
							}
							else if(Array.isArray(lib[j][k])&&Array.isArray(character[i][j][k])){
								lib[j][k].addArray(character[i][j][k]);
							}
							else{
								console.log('dublicate '+j+' in character '+i+':\n'+k+'\n'+': '+lib[j][k]+'\n'+character[i][j][k]);
							}
						}
					}
				}
			}
			var connect_avatar_list=[];
			for(var i in lib.character){
				connect_avatar_list.push(i);
			}
			connect_avatar_list.sort(lib.sort.capt);
			for(var i=0;i<connect_avatar_list.length;i++){
				var ia=connect_avatar_list[i];
				lib.mode.connect.config.connect_avatar.item[ia]=lib.translate[ia];
			}
			if(lib.config.mode!='connect'){
				var pilecfg=lib.config.customcardpile[get.config('cardpilename')||'当前牌堆'];
				if(pilecfg){
					lib.config.bannedpile=get.copy(pilecfg[0]||{});
					lib.config.addedpile=get.copy(pilecfg[1]||{});
				}
				else{
					lib.config.bannedpile={};
					lib.config.addedpile={};
				}
			}
			else{
				lib.cardPackList={};
			}
			for(i in card){
				lib.cardPack[i]=[];
				if(card[i].card){
					for(var j in card[i].card){
						if(!card[i].card[j].hidden&&card[i].translate[j+'_info']){
							lib.cardPack[i].push(j);
						}
					}
				}
				for(j in card[i]){
					if(j=='mode'||j=='forbid') continue;
					if(j=='connect'){
						connectCardPack.push(i);
						continue;
					}
					if(j=='list'){
						if(lib.config.mode=='connect'){
							lib.cardPackList[i]=card[i][j];
						}
						else{
							if(lib.config.cards.contains(i)){
								var pile;
								if(typeof card[i][j]=='function'){
									pile=card[i][j]();
								}
								else{
									pile=card[i][j];
								}
								lib.cardPile[i]=pile.slice(0);
								if(lib.config.bannedpile[i]){
									for(var k=0;k<lib.config.bannedpile[i].length;k++){
										pile[lib.config.bannedpile[i][k]]=null;
									}
								}
								for(var k=0;k<pile.length;k++){
									if(!pile[k]){
										pile.splice(k--,1);
									}
								}
								if(lib.config.addedpile[i]){
									for(var k=0;k<lib.config.addedpile[i].length;k++){
										pile.push(lib.config.addedpile[i][k]);
									}
								}
								lib.card.list=lib.card.list.concat(pile);
							}
						}
					}
					else{
						for(k in card[i][j]){
							if(j=='skill'&&k[0]=='_'&&(!lib.config.cards.contains(i)||(lib.config.mode=='connect'&&!card[i].connect))){
								continue;
							}
							if(j=='translate'&&k==i){
								lib[j][k+'_card_config']=card[i][j][k];
							}
							else{
								if(lib[j][k]==undefined){
									if(j=='skill'&&lib.config.mode=='connect'&&!card[i].connect){
										lib[j][k]={
											nopop:card[i][j][k].nopop,
											derivation:card[i][j][k].derivation
										};
									}
									else{
										lib[j][k]=card[i][j][k];
									}
								}
								else console.log('dublicate '+j+' in card '+i+':\n'+k+'\n'+lib[j][k]+'\n'+card[i][j][k]);
								if(j=='card'&&lib[j][k].derivation){
									if(!lib.cardPack.mode_derivation){
										lib.cardPack.mode_derivation=[k];
									}
									else{
										lib.cardPack.mode_derivation.push(k);
									}
								}
							}
						}
					}
				}
			}
			if(lib.cardPack.mode_derivation){
				for(var i=0;i<lib.cardPack.mode_derivation.length;i++){
					if(typeof lib.card[lib.cardPack.mode_derivation[i]].derivation=='string'&&!lib.character[lib.card[lib.cardPack.mode_derivation[i]].derivation]){
						lib.cardPack.mode_derivation.splice(i--,1);
					}
					else if(typeof lib.card[lib.cardPack.mode_derivation[i]].derivationpack=='string'&&!lib.config.cards.contains(lib.card[lib.cardPack.mode_derivation[i]].derivationpack)){
						lib.cardPack.mode_derivation.splice(i--,1);
					}
				}
				if(lib.cardPack.mode_derivation.length==0){
					delete lib.cardPack.mode_derivation;
				}
			}
			if(lib.config.mode!='connect'){
				for(i in play){
					if(lib.config.hiddenPlayPack.contains(i)) continue;
					if(play[i].forbid&&play[i].forbid.contains(lib.config.mode)) continue;
					if(play[i].mode&&play[i].mode.contains(lib.config.mode)==false) continue;
					for(j in play[i].element){
						if(!lib.element[j]) lib.element[j]=[];
						for(k in play[i].element[j]){
							if(k=='init'){
								if(!lib.element[j].inits) lib.element[j].inits=[];
								lib.element[j].inits.push(play[i].element[j][k]);
							}
							else{
								lib.element[j][k]=play[i].element[j][k];
							}
						}
					}
					for(j in play[i].ui){
						if(typeof play[i].ui[j]=='object'){
							if(ui[j]==undefined) ui[j]={};
							for(k in play[i].ui[j]){
								ui[j][k]=play[i].ui[j][k];
							}
						}
						else{
							ui[j]=play[i].ui[j];
						}
					}
					for(j in play[i].game){
						game[j]=play[i].game[j];
					}
					for(j in play[i].get){
						get[j]=play[i].get[j];
					}
					for(j in play[i]){
						if(j=='mode'||j=='forbid'||j=='init'||j=='element'||
						j=='game'||j=='get'||j=='ui'||j=='arenaReady') continue;
						for(k in play[i][j]){
							if(j=='translate'&&k==i){
								// lib[j][k+'_play_config']=play[i][j][k];
							}
							else{
								if(lib[j][k]!=undefined){
									console.log('dublicate '+j+' in play '+i+':\n'+k+'\n'+': '+lib[j][k]+'\n'+play[i][j][k]);
								}
								lib[j][k]=play[i][j][k];
							}
						}
					}
					if(typeof play[i].init=='function') play[i].init();
					if(typeof play[i].arenaReady=='function') lib.arenaReady.push(play[i].arenaReady);
				}
			}

			lib.connectCharacterPack=[];
			lib.connectCardPack=[];
			for(var i=0;i<lib.config.all.characters.length;i++){
				var packname=lib.config.all.characters[i];
				if(connectCharacterPack.contains(packname)){
					lib.connectCharacterPack.push(packname)
				}
			}
			for(var i=0;i<lib.config.all.cards.length;i++){
				var packname=lib.config.all.cards[i];
				if(connectCardPack.contains(packname)){
					lib.connectCardPack.push(packname)
				}
			}
			if(lib.config.mode!='connect'){
				for(i=0;i<lib.card.list.length;i++){
					if(lib.card.list[i][2]=='huosha'){
						lib.card.list[i]=lib.card.list[i].slice(0);
						lib.card.list[i][2]='sha';
						lib.card.list[i][3]='fire';
					}
					else if(lib.card.list[i][2]=='leisha'){
						lib.card.list[i]=lib.card.list[i].slice(0);
						lib.card.list[i][2]='sha';
						lib.card.list[i][3]='thunder';
					}
					if(!lib.card[lib.card.list[i][2]]){
						lib.card.list.splice(i,1);i--;
					}
					else if(lib.card[lib.card.list[i][2]].mode&&
						lib.card[lib.card.list[i][2]].mode.contains(lib.config.mode)==false){
						lib.card.list.splice(i,1);i--;
					}
				}
			}

			if(lib.config.mode=='connect'){
				_status.connectMode=true;
			}
			if(window.isNonameServer){
				lib.cheat.i();
			}
			else if(lib.config.dev&&(!_status.connectMode||lib.config.debug)){
				lib.cheat.i();
			}
			lib.config.sort_card=get.sortCard(lib.config.sort);
			delete lib.imported.character;
			delete lib.imported.card;
			delete lib.imported.mode;
			delete lib.imported.play;
			for(var i in lib.init){
				if(i.indexOf('setMode_')==0){
					delete lib.init[i];
				}
			}
			var a=lib.config["extension_自由选将_cPackCanConnect"];
			if(!_status.connectMode||a){
				for(var i=0;i<lib.extensions.length;i++){
					try{
						_status.extension=lib.extensions[i][0];
						_status.evaluatingExtension=lib.extensions[i][3];
						lib.extensions[i][1](lib.extensions[i][2],lib.extensions[i][4]);
						if(lib.extensions[i][4]){
							if(lib.extensions[i][4].character){
								for(var j in lib.extensions[i][4].character.character){
									game.addCharacterPack(get.copy(lib.extensions[i][4].character));
									break;
								}
							}
							if(lib.extensions[i][4].card){
								for(var j in lib.extensions[i][4].card.card){
									game.addCardPack(get.copy(lib.extensions[i][4].card));
									break;
								}
							}
							if(lib.extensions[i][4].skill){
								for(var j in lib.extensions[i][4].skill.skill){
									game.addSkill(j,lib.extensions[i][4].skill.skill[j],
									lib.extensions[i][4].skill.translate[j],lib.extensions[i][4].skill.translate[j+'_info']);
								}
							}
						}
						delete _status.extension;
						delete _status.evaluatingExtension;
					}
					catch(e){
						console.log(e);
					}
				}
			}
			delete lib.extensions;

			if(lib.init.startBefore){
				lib.init.startBefore();
				delete lib.init.startBefore;
			}
			ui.create.arena();
			game.createEvent('game',false).setContent(lib.init.start);
			if(lib.mode[lib.config.mode]&&lib.mode[lib.config.mode].fromextension){
				var startstr=mode[lib.config.mode].start.toString();
				if(startstr.indexOf('onfree')==-1){
					setTimeout(lib.init.onfree,500);
				}
			}
			delete lib.init.start;
			game.loop();
		}
		var proceed=function(){
			if(!lib.db){
				try{
					lib.storage=JSON.parse(localStorage.getItem(lib.configprefix+lib.config.mode));
					if(typeof lib.storage!='object') throw('err');
					if(lib.storage==null) throw('err');
				}
				catch(err){
					lib.storage={};
					localStorage.setItem(lib.configprefix+lib.config.mode,"{}");
				}
				proceed2();
			}
			else{
				game.getDB('data',lib.config.mode,function(obj){
					lib.storage=obj||{};
					proceed2();
				});
			}
		};
		if(!lib.imported.mode||!lib.imported.mode[lib.config.mode]){
			window.inSplash=true;
			clearTimeout(window.resetGameTimeout);
			delete window.resetGameTimeout;
			var clickedNode=false;
			var clickNode=function(){
				if(clickedNode) return;
				this.classList.add('clicked');
				clickedNode=true;
				lib.config.mode=this.link;
				game.saveConfig('mode',this.link);
				if(game.layout!='mobile'&&lib.layoutfixed.indexOf(lib.config.mode)!==-1){
					game.layout='mobile';
					ui.css.layout.href=lib.assetURL+'layout/'+game.layout+'/layout.css';
				}
				else if(game.layout=='mobile'&&lib.config.layout!='mobile'&&lib.layoutfixed.indexOf(lib.config.mode)===-1){
					game.layout=lib.config.layout;
					if(game.layout=='default'){
						ui.css.layout.href='';
					}
					else{
						ui.css.layout.href=lib.assetURL+'layout/'+game.layout+'/layout.css';
					}
				}
				splash.delete(1000);
				delete window.inSplash;
				window.resetGameTimeout=setTimeout(lib.init.reset,5000);

				this.listenTransition(function(){
					lib.init.js(lib.assetURL+'mode',lib.config.mode,proceed);
				},500);
			}
			var downNode=function(){
				this.classList.add('glow');
			}
			var upNode=function(){
				this.classList.remove('glow');
			}
			var splash=ui.create.div('#splash',document.body);
			if(lib.config.touchscreen){
				splash.classList.add('touch');
				lib.setScroll(splash);
			}
			if(lib.config.player_border!='wide'){
				splash.classList.add('slim');
			}
			splash.dataset.radius_size=lib.config.radius_size;
			for(var i=0;i<lib.config.all.mode.length;i++){
				var node=ui.create.div('.hidden',splash,clickNode);
				node.link=lib.config.all.mode[i];
				ui.create.div(node,'.splashtext',get.verticalStr(get.translation(lib.config.all.mode[i])));
				if(lib.config.all.stockmode.indexOf(lib.config.all.mode[i])!=-1){
					ui.create.div(node,'.avatar').setBackgroundImage('image/splash/'+lib.config.all.mode[i]+'.jpg');
				}
				else{
					var avatarnode=ui.create.div(node,'.avatar');
					var avatarbg=lib.mode[lib.config.all.mode[i]].splash;
					if(avatarbg.indexOf('ext:')==0){
						avatarnode.setBackgroundImage(avatarbg.replace(/ext:/,'extension/'));
					}
					else{
						avatarnode.setBackgroundDB(avatarbg);
					}
				}
				if(!lib.config.touchscreen){
					node.addEventListener('mousedown',downNode);
					node.addEventListener('mouseup',upNode);
					node.addEventListener('mouseleave',upNode);
				}
				setTimeout((function(node){
					return function(){
						node.show();
					}
				}(node)),i*100);
			}
			if(lib.config.mousewheel){
				splash.onmousewheel=ui.click.mousewheel;
			}
		}
		else{
			proceed();
		}
		localStorage.removeItem(lib.configprefix+'directstart');
		delete lib.init.init;
	}
    
    if(config.standCharacter){
        lib.card.freechoose_stand={
            fullskin:true,
            type:'武将包',
        };
        lib.freeChooseExt.freechoose_stand="standard";
        lib.translate.freechoose_stand="标准武将";
        lib.translate.freechoose_stand_info="列出所有标准武将包武将，提您选择";
    }
    if(config.refreshCharacter){
        lib.card.freechoose_refresh={
			fullskin:true,
            type:'武将包',
        };
        lib.freeChooseExt.freechoose_refresh="refresh";
        lib.translate.freechoose_refresh="界限突破";
        lib.translate.freechoose_refresh_info="列出所有界限突破武将包武将，提您选择";
    }
    if(config.spCharacter){
        lib.card.freechoose_sp={
			fullskin:true,
            type:'武将包',
        };
        lib.freeChooseExt.freechoose_sp="sp";
        lib.translate.freechoose_sp="SP武将";
        lib.translate.freechoose_sp_info="列出所有SP武将包武将，提您选择";
    }
    if(config.yijiangCharacter){
        lib.card.freechoose_yijiang={
			fullskin:true,
            type:'武将包',
        };
        lib.freeChooseExt.freechoose_yijiang="yijiang";
        lib.translate.freechoose_yijiang="一将成名";
        lib.translate.freechoose_yijiang_info="列出所有一将成名武将包武将，提您选择";
    }
    if(config.shenhuaCharacter){
        lib.card.freechoose_shenhua={
			fullskin:true,
            type:'武将包',
        };
        lib.freeChooseExt.freechoose_shenhua="shenhua";
        lib.translate.freechoose_shenhua="神话再临";
        lib.translate.freechoose_shenhua_info="列出所有神话再临武将包武将，提您选择";
    }
    lib.freeChooseExt.cardList=function(){
        var list=[];
        if(lib.card.freechoose_stand){
            list.push("freechoose_stand");
        }
        if(lib.card.freechoose_refresh){
            list.push("freechoose_refresh");
        }
        if(lib.card.freechoose_yijiang){
            list.push("freechoose_yijiang");
        }
        if(lib.card.freechoose_sp){
            list.push("freechoose_sp");
        }
        if(lib.card.freechoose_shenhua){
            list.push("freechoose_shenhua");
        }
        var old=standardPack;
        for(var p in lib.characterPack){
            if(!old.contains(p)){
                var f1=lib.packCanSelect;
                var f2=lib.config.blackListPack.contains(p);
              	if(f1==1){
                    continue;
                }
				if(f1==2&&f2){
					continue;
				}
                var pack=p;
                if(p.indexOf('_')!=-1){
                    var p1=p.split('_')[2];
                    pack=game.getJsonKey(lib.translate,p1);
                }
                var str=pack;
                if(lib.translate[pack+"_character_config"]){
                    str=lib.translate[pack+"_character_config"];
                }
				//c
                lib.card['freechoose_'+pack]={
                    fullskin:true,
                    type:'武将包',
                };
                lib.freeChooseExt["freechoose_"+pack]=p;
        		lib.translate["freechoose_"+pack]=str;
        		lib.translate["freechoose_"+pack+"_info"]="列出所有"+str+"武将包武将，提供您选择";
                list.push('freechoose_'+pack);
            }
        }
        return list;
    };
    lib.translate.extfreeChoose="自由选将";
    lib.skill.extfreeChoose={
        trigger:{
          	global:'gameStart',
            player:'enterGame',
        },
        forced:true,
        silent:true,
        priority:99999,
        filter:function(event,player){
            return get.mode()!='guozhan';
        },
        content:function(){
            "step 0"
           	var next=player.chooseBool("是否重新选择武将？");
            next.ai=function(){
                return false;
            };
            "step 1"
            if(result&&result.bool==false){
                event.finish();
                return;
            }
            "step 2"
            var cardlist=lib.freeChooseExt.cardList();
            if(cardlist.length<=0){
                player.removeSkill("extfreeChoose");
                event.finish();
                return;
            }
            player.chooseButton(["请选择一个武将包？",[cardlist,'vcard']]);
            "step 3"
            if(result&&result.bool&&result.links[0]){
                var card={name:result.links[0][2]};
                var list=[];
                var bans=[];
                var name=lib.freeChooseExt[card.name];
                
                for(var k in lib.characterPack[name]){
                    if(bans.contains(k))continue;
                    list.push(k);
                }
                var dialog = ui.create.dialog("自由选将","hidden");
                dialog.add(get.translation(card));
                dialog.add([list,'character']);
                
                game.resume();
				player.chooseButton(dialog,false).set('filterButton',function(button){
					var f1=game.playerNames().contains(button.link);
					var b1=lib.config["extension_自由选将_canSelectdisableCharacter"];
					if(!b1){
						var cfg=lib.config[get.mode()+"_banned"];
						if(cfg&&cfg.contains(button.link))return false;
					}
                	return list.contains(button.link)&&!f1;
                }).set('onfree',true);
            }else{
                player.removeSkill("extfreeChoose");
                event.finish();
                return;
            }
            "step 4"
            if(result&&result.bool==true){
                player.init(result.links[0]);
                player.removeSkill("extfreeChoose");
            }else{
                event.goto(2);
            }
        }
    }
	if(config.enableFreeChoose){
		var ID = setInterval(function(){
			if(game.getJsonLength(lib.character)>0){
				for(var i in lib.character){
					if(!lib.character[i][3].contains("extfreeChoose")){
						lib.character[i][3].push("extfreeChoose");
					}
				}
				clearInterval(ID);
			}
		},1000);
	}
},help:{},config:{"enableExt":{"name":"开启扩展","intro":"设置开启扩展","init":true},"enableFreeChoose":{"name":"开启自由选将","intro":"设置联机模式自由选将","init":true},"canSelectdisableCharacter":{"name":"可选已禁用武将","intro":"设置可选已禁用武将","init":false},"packCanSelect":{"name":"可选的武将包","intro":"设置自由选择武将时，可选择的武将包<br><font color=Red>注意：基本包包括 标准武将包、界限突破、一将成名、神话再临、SP 这五个武将包","init":"0","item":{"0":"所有武将包","1":"仅基本包","2":"自定义"}},"standCharacter":{"name":"标准武将包","intro":"设置开启标准武将包选择","init":true},"refreshCharacter":{"name":"界限突破武将包","intro":"设置开启界限突破武将包选择","init":true},"spCharacter":{"name":"SP武将包","intro":"设置开启SP武将包选择","init":true},"yijiangCharacter":{"name":"一将成名武将包","intro":"设置开启一将成名武将包选择","init":true},"shenhuaCharacter":{"name":"神话再临武将包","intro":"设置开启神话再临武将包选择","init":true},"cPackCanConnect":{"name":"特殊武将包可联机","intro":"设置一些通过game.addCharacterPack<br>方法或用无名杀自带编辑武将写出的武将实现添加的武将包可以联机","init":true}},package:{
    character:{
        character:{
            djidjcnc:["male","wei",1,["enableCPack","disableCPack"],["forbidai","des:我是个跑龙套的"]],
        },
        translate:{
            djidjcnc:"龙套哥",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            enableCPack:{
                enable:"chooseToUse",
                filter:function (event,player){
        return lib.config.blackListPack.length>0;
    },
                init:function (player){
        lib.enabledPack=[];
        lib.disabledPack=lib.config.blackListPack;
        for(var p in lib.characterPack){
            if(!lib.config.blackListPack.contains(p)){
                lib.enabledPack.push(p);
            }
        }
    },
                content:function (){
        "step 0"
        var dCard=[];
        var disabledPack=lib.config.blackListPack;
        for(var i=0;i<disabledPack.length;i++){
            dCard.push(["武将包","","freeChooseExt2_"+disabledPack[i]]);
        }
        player.chooseButton(["请您选择要启用的武将包？",[dCard,'vcard']]);
        "step 1"
        if(result.bool&&result.links[0]){
            var name=lib.freeChooseExt2[result.links[0][2]];
            lib.config.blackListPack.remove(name);
            lib.enabledCPack.add(name);
            game.saveConfig("blackListPack",lib.config.blackListPack);
        }
    },
            },
            disableCPack:{
                enable:"chooseToUse",
                filter:function (event,player){
        return lib.enabledCPack.length>0;
    },
                init:function (player){
        lib.enabledPack=[];
        lib.disabledPack=lib.config.blackListPack;
        for(var p in lib.characterPack){
            if(!lib.config.blackListPack.contains(p)){
                lib.enabledPack.push(p);
            }
        }
    },
                content:function (){
        "step 0"
        var eCard=[];
        var enabledPack=lib.enabledCPack;
        for(var i=0;i<enabledPack.length;i++){
            eCard.push(["武将包","","freeChooseExt2_"+enabledPack[i]]);
        }
        player.chooseButton(["请您选择要禁用的武将包？",[eCard,'vcard']]);
        "step 1"
        if(result.bool&&result.links[0]){
            var name=lib.freeChooseExt2[result.links[0][2]];
            lib.config.blackListPack.add(name);
            lib.enabledCPack.remove(name);
            game.saveConfig("blackListPack",lib.config.blackListPack);
        }
    },
            },
        },
        translate:{
            enableCPack:"启用武将包",
            "enableCPack_info":"编辑启用武将包",
            disableCPack:"禁用武将包",
            "disableCPack_info":"编辑禁用武将包",
        },
    },
    intro:"",
    author:"仲哥！",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["djidjcnc.jpg"],"card":[],"skill":[]}}})