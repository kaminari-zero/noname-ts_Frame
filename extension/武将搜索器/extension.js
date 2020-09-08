game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"武将搜索器",editable:false,content:function (config,pack){
	game.tujianBegin = function(dialog, close ,val,manual) {
	var Image=ui.background.style.backgroundImage;
	ui.background.setBackgroundImage("extension/武将搜索器/相爱相杀.png");
		var result = val; 
		if (result == "" || result == null) {             
		 result = "你没有输入武将名称"; 
		 alert(result);  
		 close.parentNode.remove();
			//_status.paused = false;
			manual.remove();
			ui.arena.show();
			ui.system.show();
			ui.menuContainer.show();
			ui.background.style.backgroundImage=Image;
			return;        
		}   
		else{
		var nodes=dialog.content.childNodes;
		for(var i=nodes.length-1;i>=0;i--){
		dialog.content.removeChild(nodes[i]);
		}
		//这里必须是从后往前删除
		}
		var value = false;
		var name = [];
		for (var a in lib.character) {
	//		if (lib.translate[a] == result) {     (这是精确搜索)
	//改为模糊搜索:
	if (lib.translate[a]&&lib.translate[a].indexOf(result)!=-1) {
				name.add(a);
				value = true;
			}
		} //寻找武将
		if (value == false || name.length == 0) {
			alert('找不到名为' + result + '的武将!');
			//_status.paused = false;
			manual.remove();
			close.parentNode.remove();
			ui.arena.show();
			ui.system.show();
			ui.menuContainer.show();
			ui.background.style.backgroundImage=Image;
			return;
		}
		//进一步
		//game.pause();
		//_status.paused = true;
		//window.alert('搜索成功');		
		//dialog.addSmall([name, 'character']);	
		for (var le = 0; le < name.length; le++) {
		dialog.addSmall([[name[le]], 'character']);	
			var str = '';
			var character = lib.character[name[le]];
			if (!character) {
				continue;
			} else {
				var allcharacter = lib.config.all.characters;
				var Packname;
				for (var b = 0; b < allcharacter.length; b++) {
					var characterPack = lib.characterPack[allcharacter[b]];
					for (var c in characterPack) {
						if (c == name[le]) {
							Packname = lib.translate[allcharacter[b] + '_character_config'];
							break;
						}
					}
				}
				var skillstr = '';
				for (var d = 0; d < character[3].length; d++) {
					if (lib.translate[character[3][d]]) {
						skillstr += '<li><span class="bluetext">' + lib.translate[character[3][d]] + '</span>：';
						skillstr += lib.translate[character[3][d] + '_info'];
					}
				}
				str += '<br><span class="bluetext">武将信息</span>：' + get.characterIntro(name[le]) + '<br><span class="bluetext">所在武将包</span>：' + Packname + '<br><span class="bluetext">武将名称</span> ：' + lib.translate[name[le]] + '<br><span class="bluetext">武将性别</span>：' + lib.translate[character[0]] + '<br><span class="bluetext">武将势力</span>：' + lib.translate[character[1]] + '<br><span class="bluetext">体力上限</span>：' + character[2] + '<br><span class="bluetext">武将技能</span>：' + skillstr + '<br><br><br>';
			}
			dialog.addText('<div><div id="Cdetail" style="display:block; left:auto; text-align:left; ">' + str);
		}
	};
	
	window.诗笺_manual = {
		show:function(){
	  var	Image=ui.background.style.backgroundImage;
			var manual = ui.create.div('.manual', manual);
			var menu = ui.create.div('.menu', manual);
			var input = menu.appendChild(document.createElement('input'));
			var search = ui.create.div('.search', menu);
			var close = ui.create.div('.close', menu);
			
			var content = manual.appendChild(ui.create.dialog());	
			content.classList.remove('nobutton');
			content.classList.add('content');
			content.style.transform = '';
			content.style.opacity = '';
			content.style.height = '';
			
			search.innerHTML = '搜索';
			search.addEventListener('click', function(){
				// alert(input.value); 	 input.value 是输入框里的内容
				game.tujianBegin(content, close,input.value,manual);
			});
			
			close.innerHTML = '关闭';
			close.addEventListener('click', function(){
				alert('搜索结束，谢谢您的使用');     
				manual.remove();
				ui.arena.show();
				ui.system.show();
				ui.menuContainer.show();			
				ui.background.style.backgroundImage=Image;
			});
			
			//_status.paused = true;
			ui.arena.classList.remove('menupaused');
			ui.arena.hide();
			ui.system.hide();
			ui.menuContainer.hide();
			ui.window.appendChild(manual);				
		},
	};
	
},precontent:function (){
 var layoutPath = lib.assetURL + 'extension/武将搜索器';
	lib.init.css(layoutPath, 'extension');
},help:{},config:{
manual:{
		name: '武将图鉴(点我点我)',
		clear: true,
		onclick:function(){
			诗笺_manual.show();	   
		},
	},
},package:{
    character:{
        character:{
        },
        translate:{
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
        },
        translate:{
        },
    },
    intro:"",
    author:"<span class='bluetext'>诗笺</span>",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}})