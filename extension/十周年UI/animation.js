'use strict';
decadeParts.import(function(lib, game, ui, get, ai, _status){
	
	var resize = decadeUI.element.create('sensor', document.body);
	resize.id = 'decadeUI-canvas-sensor';
	resize.rs = new decadeUI.ResizeSensor(resize, function(){
		if (resize.listens == void 0) return;
		for (var i = 0; i < resize.listens.length; i++) {
			resize.listens[i]();
		}
	}, false);
	resize.addListener = function (callback) {
		if (resize.listens == void 0) resize.listens = [];
		resize.listens.push(callback);
		
	};
	
	decadeUI.Animation = (function(){
		function Animation (pathPrefix, parentNode, thisId) {
			if (!window.spine) return console.error('spine 未定义.');
			
			var canvas = document.createElement('canvas');
			if (parentNode != void 0) parentNode.appendChild(canvas); 
			if (thisId != void 0) canvas.id = thisId;
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			
			var spine2d;
			var config = { alpha: true };
			var gl = canvas.getContext('gl', config) || canvas.getContext('experimental-webgl', config);
			
			if (gl) {
				spine2d = {
					shader: spine.webgl.Shader.newTwoColoredTextured(gl),
					batcher: new spine.webgl.PolygonBatcher(gl),
					skeletonRenderer: new spine.webgl.SkeletonRenderer(gl),
					shapes: new spine.webgl.ShapeRenderer(gl),
					assetManager: new spine.webgl.AssetManager(gl),
					assets: {},
					playing: {},
					skeletons: [],
				}
			} else {
				console.error('当前设备不支持 WebGL.');
			}
			
			this.gl = gl;
			this.canvas = canvas;
			this.spine2d = spine2d;
			this.pathPrefix = pathPrefix;
			this.lastFrameTime = void 0;
			
			if (!gl) {
				function empty(){};
				for (var key in this.__proto__) {
					if (typeof this.__proto__[key] == 'function') {
						this.__proto__[key] = empty;
					}
				}
			} else {
				resize.addListener(function(){
					canvas.sizeChanged = true;
				});
			}
		};
		
		function LoadNotif (assetName, onload, onerror) {
			this.name = assetName;
			this.assetName = assetName;
			this.onload = onload;
			this.onerror = onerror;
			this.loads = 0;
			this.errors = 0;
		};
		
		Animation.prototype.createTextureRegion = function (image, name) {
			var page = new spine.TextureAtlasPage();
			page.name = name;
			page.uWrap = spine.TextureWrap.ClampToEdge;
			page.vWrap = spine.TextureWrap.ClampToEdge;
			page.texture = this.spine2d.assetManager.textureLoader(image);
			page.texture.setWraps(page.uWrap, page.vWrap);
			page.width = page.texture.getImage().width;
			page.height = page.texture.getImage().height;
			
			var region = new spine.TextureAtlasRegion();
			region.page = page;
			region.rotate = false;
			region.width = page.width;
			region.height = page.height;
			region.x = 0;
			region.y = 0;
			region.u = region.x / page.width;
			region.v = region.y / page.height;
			if (region.rotate) {
				region.u2 = (region.x + region.height) / page.width;
				region.v2 = (region.y + region.width) / page.height;
			}
			else {
				region.u2 = (region.x + region.width) / page.width;
				region.v2 = (region.y + region.height) / page.height;
			}
			
			region.originalWidth = page.width;
			region.originalHeight = page.height;
			region.index = -1;
			region.texture = page.texture;
			region.renderObject = region;
			
			return region;
		};
		
		Animation.prototype.loadSpine2d = function (assetName, skelType, onload, onerror) {
			var anim = this;
			var loadNotif = new LoadNotif(assetName, onload, onerror);
			
			loadNotif.loadSuccess = function(){
				loadNotif.loads++;
				if (loadNotif.loads + loadNotif.errors == 3) {
					if (loadNotif.errors > 0) {
						console.error('加载[' + loadNotif.assetName + ']动画资源失败.');
						if (loadNotif.onerror !== void 0) {
							loadNotif.onerror();
						}
					} else {
						anim.spine2d.assets[loadNotif.assetName] = { name: loadNotif.assetName, skelType: skelType };
						if (loadNotif.onload !== void 0) {
							loadNotif.onload();
						}
					}
				}
			};
			
			loadNotif.loadError = function(){
				loadNotif.errors++;
				if (loadNotif.loads + loadNotif.errors == 3) {
					console.error('加载[' + loadNotif.assetName + ']动画资源失败.');
					if (loadNotif.onerror !== void 0) {
						loadNotif.onerror();
					}
				}
			};
			
			if (skelType != void 0 && skelType.toLowerCase() == 'json') {
				skelType = 'json';
				this.spine2d.assetManager.loadText(this.pathPrefix + assetName + '.json',
					loadNotif.loadSuccess, loadNotif.loadError);
			} else {
				skelType = 'skel';
				this.spine2d.assetManager.loadBinary(this.pathPrefix + assetName + '.skel',
					loadNotif.loadSuccess, loadNotif.loadError);
			}
			
			this.spine2d.assetManager.loadText(this.pathPrefix + assetName + '.atlas',
				loadNotif.loadSuccess, loadNotif.loadError);
			this.spine2d.assetManager.loadTexture(this.pathPrefix + assetName + '.png',
				loadNotif.loadSuccess, loadNotif.loadError);
		};
		
		Animation.prototype.prepSpine2d = function (assetName) {
			if (!this.spine2d.assets[assetName]) {
				console.error('未找到' + assetName + '动画资源.');
				return null;
			}
			
			var anim = this;
			var asset = this.spine2d.assets[assetName];
			var assetManager = this.spine2d.assetManager;
			var skelRawData = asset.rawSkel;
			if (!skelRawData) {
				var atlas = new spine.TextureAtlas(assetManager.get(anim.pathPrefix + assetName + '.atlas'),
					function(path){
						return assetManager.get(anim.pathPrefix + path);
					}
				);
				
				var atlasLoader = new spine.AtlasAttachmentLoader(atlas);
				if (asset.skelType.toLowerCase() == 'json') {
					skelRawData = new spine.SkeletonJson(atlasLoader);
				} else {
					skelRawData = new spine.SkeletonBinary(atlasLoader);
				}
				
				anim.spine2d.assets[assetName].rawSkel = skelRawData;
				anim.spine2d.assets[assetName].ready = true;
			}
			
			var skeletonData = skelRawData.readSkeletonData(assetManager.get(this.pathPrefix + assetName + '.' + asset.skelType));
			var skeleton = new spine.Skeleton(skeletonData);
			var skeletons = this.spine2d.skeletons;
			
			skeleton.setSkinByName('default');
			skeleton.setToSetupPose();
			skeleton.updateWorldTransform();
			
			var bounds = {
				offset: new spine.Vector2(),
				size: new spine.Vector2(),
			};
			
			skeleton.getBounds(bounds.offset, bounds.size, []);
			var animationStateData = new spine.AnimationStateData(skeleton.data);
			var animationState = new spine.AnimationState(animationStateData);
			
			animationState.addListener({
				complete:function(track){
					if (!track.loop) {
						skel.complete = true;
					}
				}
			});
			
			var skel = {
				id: skeletons.length,
				name: assetName,
				defaultAnimation: skeletonData.animations[0].name,
				skeleton: skeleton,
				state: animationState,
				bounds: bounds,
				position: void 0,
				premultipliedAlpha: false,
				complete: true,
				mvp: new spine.webgl.Matrix4(),
			};
			
			skel.mvp.ortho2d(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
			skeletons.push(skel);
			
			return skel.id;
		};
		
		Animation.prototype.playSpine2d = function (assetName, position){
			if (!decadeUI.config.gameAnimationEffect) return console.log('十周年UI游戏动画特效已关闭，无法播放动画.');
			
			var animName;
			if (Array.isArray(assetName)) {
				animName = assetName[1];
				assetName = assetName[0];
			}
			
			// if (position instanceof HTMLElement && !follow) {
				// var rect = position.getBoundingClientRect();
				// position = {
					// x: rect.left + rect.width / 2,
					// y: document.body.offsetHeight - rect.top - rect.height / 2,
				// };
			// }
			
			if (!this.spine2d.assets[assetName]) return console.error('未找到"' + assetName + '"的动画资源.');
			
			var skeletons = this.spine2d.skeletons;
			var skeleton;
			
			for (var i = 0; i < skeletons.length; i++) {
				if (skeletons[i].name == assetName && skeletons[i].complete) {
					skeleton = skeletons[i++];
					while (i < skeletons.length) {
						skeletons[i - 1] = skeletons[i++];
					}
					
					skeletons[skeletons.length - 1] = skeleton;
					break;
				}
			}
			
			if (!skeleton) {
				var id = this.prepSpine2d(assetName);
				for (var i = skeletons.length - 1; i >= 0; i--){
					if (skeletons[i].id == id) {
						skeleton = skeletons[i];
					}
				}
			}
			
			this.playSpine2dSkeleton(skeleton, animName, position);
			return skeleton.id;
		};
		
		Animation.prototype.stopSpine2d = function (id) {
			var skels = this.spine2d.skeletons;
			for (var i = 0; i < skels.length; i++) {
				if (skels[i].id == id) {
					skels[i].complete = true;
					skels[i].state.setEmptyAnimation(0);
					return true;
				}
			}
			
			return false;
		};
		
		Animation.prototype.loopSpine2d = function (assetName, position) {
			var id = this.playSpine2d(assetName, position);
			if (id == void 0) return;
			
			var skels = this.spine2d.skeletons;
			for (var i = 0; i < skels.length; i++) {
				if (skels[i].id == id) {
					skels[i].complete = false;
					skels[i].state.tracks[0].loop = true;
					return id;
				}
			}
			
			return;
		};
		
		Animation.prototype.playSpine2dSkeleton = function (skeleton, animationName, position) {
			var index = this.spine2d.skeletons.indexOf(skeleton);
			if (index == -1) return console.error('skeleton not found');
			
			var x, y, width, height, scale, parent, follow;
			if (position != void 0) {
				x = position.x;
				y = position.y;
				width = position.width;
				height = position.height;
				scale = position.scale;
				parent = position.parent;
				follow = position.parent;
			}
			
			var position = {
				x: x,
				y: y,
				width: width,
				height: height,
				scale: scale,
				parent: parent,
				follow: follow,
			}
			
			skeleton.complete = false;
			skeleton.position = position;
			skeleton.state.setAnimation(0, animationName == void 0 ? skeleton.defaultAnimation : animationName, false);
			
			if (this.requestId == void 0) {
				this.canvas.style.visibility = 'visible';
				this.requestId = requestAnimationFrame(this.render.bind(this));
			}
			
			return skeleton;
		};
		
		Animation.prototype.getSpine2dSkeleton = function (assetName) {
			if (!this.spine2d.assets[assetName]) {
				console.error('未找到"' + assetName + '"的动画资源.');
				return null;
			}
			
			var skeletons = this.spine2d.skeletons;
			var skeleton;
			
			for (var i = 0; i < skeletons.length; i++) {
				if (skeletons[i].name == assetName && skeletons[i].complete) {
					skeleton = skeletons[i++];
					while (i < skeletons.length) {
						skeletons[i - 1] = skeletons[i++];
					}
					
					skeletons[skeletons.length - 1] = skeleton;
					break;
				}
			}
			
			if (!skeleton) {
				var id = this.prepSpine2d(assetName);
				for (var i = skeletons.length - 1; i >= 0; i--){
					if (skeletons[i].id == id) {
						skeleton = skeletons[i];
					}
				}
			}
			
			skeleton.complete = false;
			return skeleton;
		};
		
		Animation.prototype.getSpine2dBounds = function (assetName, nocheck) {
			var skeletons = this.spine2d.skeletons;
			
			for (var i = 0; i < skeletons.length; i++) {
				if (skeletons[i].name == assetName) {
					return skeletons[i].bounds;
				}
			}
			
			if (!nocheck) {
				var id = this.prepSpine2d(assetName);
				if (id != null) {
					return this.getSpine2dBounds(assetName, true);
				}
			}
			
			return null;
		};
		
		Animation.prototype.resizeSkeleton = function (skeleton) {
			var x,
				y,
				width,
				height,
				ox,
				oy,
				dx,
				dy,
				canvas = this.canvas,
				position = skeleton.position;
			
			var scale = position.scale;
			var size = { width: canvas.width, height: canvas.height };
			var isElement = position.parent instanceof HTMLElement;
			
			if (isElement && (position.follow || !position.init)) {
				var rect = position.parent.getBoundingClientRect();
				ox = rect.left;
				oy = document.body.offsetHeight - rect.top;
				
				dx = ox + rect.width  / 2;
				dy = oy - rect.height / 2;
				size.width = rect.width;
				size.height = rect.height;
			}
			
			if (position.x != void 0) {
				var tx;
				if (Array.isArray(position.x)) {
					tx = position.x[0] + position.x[1] * size.width;
				} else {
					tx = position.x;
				}
				
				if (x == void 0) {
					x = tx;
				} else {
					x += tx;
				}
			}
			
			if (position.y != void 0) {
				var ty;
				if (Array.isArray(position.y)) {
					ty = position.y[0] + position.y[1] * size.height;
				} else {
					ty = position.y;
				}
				
				if (y == void 0) {
					y = ty;
				} else {
					y += ty;
				}
			}
			
			
			if (isElement && (position.follow || !position.init)) {
				if (position.x == void 0) {
					x = dx;
				} else {
					x += ox;
				}
				
				if (position.y == void 0) {
					y = dy;
				} else {
					y += oy;
				}
				
				if (!position.follow) {
					position.x = x;
					position.y = y;
					position.parent = null;
				}
				
				position.init = true;
			}
			
			skeleton.mvp.ortho2d(0, 0, canvas.width, canvas.height);
			if (x != void 0 && y == void 0) {
				skeleton.mvp.translate(x, 0, 0);
				skeleton.mvp.setY(0);
			} else if (x == void 0 && y != void 0) {
				skeleton.mvp.translate(0, y, 0);
				skeleton.mvp.setX(0);
			} else if (x != void 0 && y != void 0) {
				skeleton.mvp.translate(x, y, 0);
			} else {
				skeleton.mvp.setPos2D(0, 0);
			}
			
			if (scale != void 0 && scale != 1) {
				skeleton.mvp.scale(scale, scale, 0);
			}
		};
		
		Animation.prototype.render = function () {
			var complete = true,
				now = performance.now() / 1000,
				canvas = this.canvas,
				skeletons = this.spine2d.skeletons;
				
			var delta = now - (this.lastFrameTime == void 0 ? now : this.lastFrameTime);
			this.lastFrameTime = now;
			for (var i = 0; i < skeletons.length; i++) {
				if (!skeletons[i].complete) {
					complete = false;
					break;
				}
			}
			
			
			if (canvas.sizeChanged) {
				canvas.width = canvas.clientWidth;
				canvas.height = canvas.clientHeight;
				canvas.sizeChanged = false;
			}
			
			var width = canvas.width;
			var height = canvas.height;
			
			this.gl.viewport(0, 0, canvas.width, canvas.height);
			this.gl.clearColor(0, 0, 0, 0);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			
			if (complete) {
				this.lastFrameTime = void 0;
				this.requestId = void 0;
				this.canvas.style.visibility = 'hidden';
				return;
			}
			
			var state, skeleton, bounds, premultipliedAlpha,
				shader = this.spine2d.shader,
				batcher = this.spine2d.batcher,
				skeletonRenderer = this.spine2d.skeletonRenderer;
			
			shader.bind();
			
			for (var i = 0; i < skeletons.length; i++) {
				if (skeletons[i].complete) continue; 
				
				this.resizeSkeleton(skeletons[i]);
				state = skeletons[i].state;
				skeleton = skeletons[i].skeleton;
				bounds = skeletons[i].bounds;
				premultipliedAlpha = skeletons[i].premultipliedAlpha;
				
				state.update(delta);
				state.apply(skeleton);
				skeleton.updateWorldTransform();
				
				
				shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
				shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, skeletons[i].mvp.values);
				
				batcher.begin(shader);
				skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
				skeletonRenderer.draw(batcher, skeleton);
				batcher.end();
				
				
			}
			
			shader.unbind();
			
			this.requestId = requestAnimationFrame(this.render.bind(this));
		};
		
		return Animation;
	})();
	
	decadeUI.animation = (function(){
		var animation = new decadeUI.Animation(decadeUIPath + 'assets/animation/', document.body, 'decadeUI-canvas');
		
		var fileInfoList = [
			{ name: 'effect_youxikaishi' },
			{ name: 'effect_baguazhen' },
			{ name: 'effect_baiyinshizi' },
			{ name: 'effect_cixiongshuanggujian' },
			{ name: 'effect_fangtianhuaji' },
			{ name: 'effect_guanshifu' },
			{ name: 'effect_gudingdao' },
			{ name: 'effect_hanbingjian' },
			{ name: 'effect_qilingong' },
			{ name: 'effect_qinggangjian' },
			{ name: 'effect_qinglongyanyuedao' },
			{ name: 'effect_renwangdun' },
			{ name: 'effect_shoujidonghua' },
			{ name: 'effect_tengjiafangyu' },
			{ name: 'effect_tengjiaranshao' },
			{ name: 'effect_zhangbashemao' },
			{ name: 'effect_zhiliao' },
			{ name: 'effect_zhugeliannu' },
			{ name: 'effect_zhuqueyushan' },
			{ name: 'effect_jinhe' },
			{ name: 'effect_numa' },
			{ name: 'effect_nvzhuang' },
			{ name: 'effect_wufengjian' },
			{ name: 'effect_yajiaoqiang' },
			{ name: 'effect_yexingyi' },
			{ name: 'effect_yinfengjia' },
			{ name: 'effect_zheji' },
			{ name: 'effect_leisha' },
			{ name: 'effect_heisha' },
			{ name: 'effect_huosha' },
			{ name: 'effect_hongsha' },
			{ name: 'effect_shan' },
			{ name: 'effect_tao' },
			{ name: 'effect_jiu' },
			{ name: 'effect_jisha1' },
			{ name: 'effect_zhenwang' },
			{ name: 'effect_lebusishu' },
			{ name: 'effect_bingliangcunduan' },
			{ name: 'effect_shandian' },
			{ name: 'effect_wuzhongshengyou' },
			{ name: 'effect_wuxiekeji' },
			{ name: 'effect_nanmanruqin' },
			{ name: 'effect_wanjianqifa' },
			{ name: 'effect_wugufengdeng' },
			{ name: 'effect_taoyuanjieyi' },
			{ name: 'effect_shunshouqianyang' },
			{ name: 'effect_huogong' },
			{ name: 'effect_guohechaiqiao' },
			{ name: 'effect_xianding', fileType: 'json' },
		];
		
		var fileList = fileInfoList.concat();
		
		var read = function() {
			if (fileList.length) {
				var file = fileList.shift();
				animation.loadSpine2d(file.name, file.fileType == void 0 ? 'skel' : file.fileType, function(){
					read();
					animation.prepSpine2d(this.name);
				});
			}
		};
		
		read();read();
		
		var skillAnimation = (function(){
			var defines = {
				skill:{
					bagua_skill: ['bagua_skill', 'effect_baguazhen',					0.5],
					baiyin_skill: ['baiyin_skill', 'effect_baiyinshizi',				0.5],
					bazhen_bagua: ['bazhen_bagua', 'effect_baguazhen',					0.5],
					cixiong_skill: ['cixiong_skill', 'effect_cixiongshuanggujian',		0.5],
					fangtian_skill: ['fangtian_skill', 'effect_fangtianhuaji',			0.7],
					guanshi_skill: ['guanshi_skill', 'effect_guanshifu',				0.7],
					guding_skill: ['guding_skill', 'effect_gudingdao',					0.6],
					hanbing_skill: ['hanbing_skill', 'effect_hanbingjian',				0.5],
					linglong_bagua: ['linglong_bagua', 'effect_baguazhen',				0.5],
					qilin_skill: ['qilin_skill', 'effect_qilingong',					0.5],
					qinggang_skill: ['qinggang_skill', 'effect_qinggangjian',			0.7],
					qinglong_skill: ['qinglong_skill', 'effect_qinglongyanyuedao',		0.6],
					renwang_skill: ['renwang_skill', 'effect_renwangdun',				0.5],
					tengjia1: ['tengjia1', 'effect_tengjiafangyu',						0.6],
					tengjia2: ['tengjia2', 'effect_tengjiaranshao',						0.6],
					tengjia3: ['tengjia3', 'effect_tengjiafangyu',						0.6],
					zhangba_skill: ['zhangba_skill', 'effect_zhangbashemao',			0.7],
					zhuge_skill: ['zhuge_skill', 'effect_zhugeliannu',					0.5],
					zhuque_skill: ['zhuque_skill', 'effect_zhuqueyushan',				0.6],
					jinhe_skill: ['jinhe_skill', 'effect_jinhe',						0.4],
					numa: ['numa', 'effect_numa',										0.4],
					nvzhuang: ['nvzhuang', 'effect_nvzhuang',							0.5],
					wufengjian_skill: ['wufengjian_skill', 'effect_wufengjian',			0.4],
					yajiaoqiang_skill: ['yajiaoqiang_skill', 'effect_yajiaoqiang',		0.5],
					yexingyi_skill: ['yexingyi_skill', 'effect_yexingyi',				0.5],
					yinfengjia_skill: ['yinfengjia_skill', 'effect_yinfengjia',			0.5],
					zheji: ['zheji', 'effect_zheji',									0.35],
					lebu: ['lebu', 'effect_lebusishu',									0.7],
					bingliang: ['bingliang', 'effect_bingliangcunduan',					0.7],
					shandian: ['shandian', 'effect_shandian',							0.7],
				},
				card: {
					nanman: ['nanman', 'effect_nanmanruqin'],
					wanjian: ['wanjian', 'effect_wanjianqifa', 1.5],
					taoyuan: ['taoyuan', 'effect_taoyuanjieyi'],
				}
			}
			
			var cardAnimate = function(card){
				var anim = defines.card[card.name];
				var scale = anim.length >= 3 ? anim[2] : void 0;
				animation.playSpine2d(anim[1], void 0, scale);
			};
			
			for (var key in defines.card) {
				lib.animate.card[defines.card[key][0]] = cardAnimate;
			}
			
			var skillAnimate = function (name) {
				var anim = defines.skill[name];
				var scale = anim.length >= 3 ? anim[2] : void 0;
				animation.playSpine2d(anim[1], { scale: scale, parent:this });
			};
			
			for (var key in defines.skill) {
				lib.animate.skill[defines.skill[key][0]] = skillAnimate;
			}
			
			var trigger = {
				card:{
					nvzhuang:{
						onEquip:function(){
							if (player.sex == 'male' && player.countCards('he', function(cardx){ return cardx != card; })) {
								lib.animate.skill['nvzhuang'].call(player, 'nvzhuang');
								player.chooseToDiscard(true, function(card) {
									return card != _status.event.card;
								}, 'he').set('card', card);
							}
						},
						onLose:function(){
							if (player.sex != 'male') return;
							var next = game.createEvent('nvzhuang_lose');
							event.next.remove(next);
							var evt = event.getParent();
							if (evt.getlx === false) evt = evt.getParent();
							evt.after.push(next);
							next.player = player;
							next.setContent(function() {
								if (player.countCards('he')) {
									lib.animate.skill['nvzhuang'].call(player, 'nvzhuang');
									player.chooseToDiscard(true, 'he');
								}
							});
						}
					},
					zheji:{
						onEquip:function(){
							lib.animate.skill['zheji'].call(player, 'zheji');
						}
					},
					numa:{
						onEquip:function(){
							lib.animate.skill['numa'].call(player, 'numa');
						}
					},
					lebu:{
						effect:function(){
							if (result.bool == false){
								lib.animate.skill['lebu'].call(player, 'lebu');
								player.skip('phaseUse');
							}
						}
					},
					bingliang:{
						effect:function(){
							if (result.bool == false) {
								if (get.is.changban()) {
									player.addTempSkill('bingliang_changban');
								} else {
									lib.animate.skill['bingliang'].call(player, 'bingliang');
									player.skip('phaseDraw');
								}
							}
						}
					},
					shandian:{
						effect:function(){
							if (result.bool == false) {
								lib.animate.skill['shandian'].call(player, 'shandian');
								player.damage(3, 'thunder', 'nosource');
							} else {
								player.addJudgeNext(card);
							}
						}
					},
				},
			};
			
			
			for (var j in trigger.card) {
				if (lib.card[j]) {
					for (var k in trigger.card[j]) {
						lib.card[j][k] = trigger.card[j][k];
					}
				}
			}
		})();
		
		return animation;
	})();

	
	decadeUI.backgroundAnimation = (function(){
		var animation = new decadeUI.Animation(decadeUIPath + 'assets/dynamic/', document.body, 'decadeUI-canvas-background');
		animation._resizeSkeleton = animation.resizeSkeleton;
		
		animation.resizeSkeleton = function (skeleton) {
			if (skeleton.asset == void 0) {
				var name = skeleton.name.split('_');
				var skin = name.splice(name.length - 1, 1)[0];
				skeleton.asset = assets[name.join('_')];
				if (skeleton.asset) skeleton.asset = skeleton.asset[skin];
			}
			
			var asset = skeleton.asset;
			if (asset) {
				var canvas = this.canvas;
				var x = asset.x;
				var y = asset.y;
				var w = asset.width;
				var h = asset.height;
				var size = skeleton.bounds.size;
				var sx, sy, scale;
				
				if (x != void 0 && Array.isArray(x)) {
					x = x[0] + x[1] * canvas.width;
				}
				
				if (y != void 0 && Array.isArray(y)) {
					y = y[0] + y[1] * canvas.height;
				}
				
				if (w != void 0) {
					if (Array.isArray(w)) {
						sx = (w[0] + w[1] * canvas.width) / size.x;
					} else {
						sx = w / size.x;
					}
				}
				
				if (h != void 0) {
					if (Array.isArray(h)) {
						sy = (h[0] + h[1] * canvas.height) / size.y;
					} else {
						sy = h / size.y;
					}
				}
				
				if (sx != void 0 && sy == void 0) {
					scale = sx;
				} else if (sx == void 0 && sy != void 0) {
					scale = sy;
				} else if (sx != void 0 && sy != void 0) {
					scale = sy;
				}
				
				skeleton.position = { x: x, y: y, scale: scale };
			} 
			
			this._resizeSkeleton(skeleton);
		};
		
		
		var assets = {
			skin_xiaosha: {
				default: {
					name: 'skin_xiaosha_default',
					x: [ 0, 0.7],
					y: [ 0, 0.3],
				},
			},
			skin_daqiao: {
				战场绝版: {
					name: 'skin_daqiao_战场绝版',
					x: [ 0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_caojie: {
				战场绝版: {
					name: 'skin_caojie_战场绝版',
					x: [ 0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_mayunlu: {
				战场绝版:{
					name: 'skin_mayunlu_战场绝版',
					x: [ 0, 0.6],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_baosanniang: {
				舞剑铸缘: {
					name: 'skin_baosanniang_舞剑铸缘',
					animation: 'DaiJi',
					y: [75, 0.3],
					height: [0, 0.8],
				},
				漫花剑俏: {
					name: 'skin_baosanniang_漫花剑俏',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_caiwenji: {
				才颜双绝: {
					name: 'skin_caiwenji_才颜双绝',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_diaochan: {
				玉婵仙子: {
					name: 'skin_diaochan_玉婵仙子',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_lukang: {
				毁堰破晋: {
					name: 'skin_lukang_毁堰破晋',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_luxunlvmeng: {
				清雨踏春: {
					name: 'skin_luxunlvmeng_清雨踏春',
					// x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_luxun: {
				谋定天下: {
					name: 'skin_luxun_谋定天下',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_sundengzhoufei: {
				鹊星夕情: {
					name: 'skin_sundengzhoufei_鹊星夕情',
					// x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_shuxiangxiang: {
				花好月圆: {
					name: 'skin_shuxiangxiang_花好月圆',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_wangyi: {
				战场绝版: {
					name: 'skin_wangyi_战场绝版',
					x: [0, 0.7],
					y: [75, 0.35],
					height: [0, 0.8],
				},
				绝色异彩: {
					name: 'skin_wangyi_绝色异彩',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_wolongzhuge: {
				隆中陇亩: {
					name: 'skin_wolongzhuge_隆中陇亩',
					// x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_xiahoushi: {
				端华夏莲: {
					name: 'skin_xiahoushi_端华夏莲',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_xiaoqiao: {
				花好月圆: {
					name: 'skin_xiaoqiao_花好月圆',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_xushi: {
				为夫弑敌: {
					name: 'skin_xushi_为夫弑敌',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
				拈花思君: {
					name: 'skin_xushi_拈花思君',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_zhangchangpu: {
				钟桂香蒲: {
					name: 'skin_zhangchangpu_钟桂香蒲',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_zhangchunhua: {
				花好月圆: {
					name: 'skin_zhangchunhua_花好月圆',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_zhangqiying: {
				逐鹿天下: {
					name: 'skin_zhangqiying_逐鹿天下',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 1],
				},
			},
			skin_zhenji: {
				才颜双绝: {
					name: 'skin_zhenji_才颜双绝',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
				洛神御水: {
					name: 'skin_zhenji_洛神御水',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_zhugeguo: {
				兰荷艾莲: {
					name: 'skin_zhugeguo_兰荷艾莲',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
			skin_zhugeliang: {
				空城退敌: {
					name: 'skin_zhugeliang_空城退敌',
					x: [0, 0.7],
					y: [75, 0.3],
					height: [0, 0.8],
				},
			},
		};
		
		animation.assets = assets;
		
		animation.play = function (name, skin) {
			if (assets[name] == void 0 || assets[name][skin] == void 0) return console.log('没有找到[asset:' + name + ', skin:' + skin + ']的资源。');
			
			
			var asset = assets[name][skin];
			var assetName;
			
			if (asset.animation == void 0) {
				assetName = asset.name;
			} else {
				assetName = [asset.name, asset.animation];
			}
			
			animation.stop();
			if (!animation.spine2d.assets[asset.name]) {
				animation.loadSpine2d(asset.name, 'skel', function(){
					animation.current = animation.loopSpine2d(assetName);
				});
			} else {
				animation.current = animation.loopSpine2d(assetName);
			}
		};
		
		animation.stop = function () {
			if (animation.current != void 0) {
				animation.stopSpine2d(animation.current);
				animation.current = void 0;
			}
		};
		
		var background = decadeUI.config.dynamicBackground
		if (background != void 0 && background != 'off') {
			var name = background.split('_');
			var skin = name.splice(name.length - 1, 1)[0];
			animation.play(name.join('_'), skin);
		}
		
		return animation;
	})();
	
	// window.anm = decadeUI.backgroundAnimation;
	// window.game = game;
	// window.playerAnimate = decadeUI.animation.playspine2d;
});

