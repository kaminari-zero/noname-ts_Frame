game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"武将卡牌搜索器",editable:false,content:function (config,pack){
	game.tujianBegin = function(dialog, close ,val,manual) {
	var Image=ui.background.style.backgroundImage;
	var list=['相爱相杀','picture'].randomGet();
	ui.background.setBackgroundImage("extension/武将卡牌搜索器/"+list+".png");
		var result = val; 
		if (result == "" || result == null) {             
		 result = "你没有输入名称"; 
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
		var back=false;
		var value = false;
		var name = [];
		for (var a in lib.character) {
	//		if (lib.translate[a] == result) {     (这是精确搜索)
	//改为模糊搜索:
	if (lib.translate[a]&&lib.translate[a].indexOf(result)!=-1) {
				name.push(a);
				value = true;
			}
		} //寻找武将
		if (value == false || name.length == 0) {
			//alert('找不到名为' + result + '的武将!');
	  back=true;
		}
		//进一步
		for (var le = 0; le < name.length; le++) {
		dialog.addSmall([[name[le]], 'character']);	
			var str = '';
			var character = lib.character[name[le]];
			if (!character) {
				continue;
			} else {
				//var allcharacter = lib.config.all.characters;
				var allcharacter=lib.characterPack;
				//{武将包1,武将包2}
				var Packname;
	    for(var b in allcharacter){
					for (var c in allcharacter[b]) {					
						if ( JSON.stringify(lib.character[c]) == JSON.stringify(character)){
						//alert(true)
						//&&characterPack[c]==character) {
						//alert(lib.translate[lib.characterPack[b] ]+"，"+lib.translate[lib.characterPack[b] + '_character_config'])
							Packname = lib.translate[ b + '_character_config'];
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
		var back2=false;
		value = false;
	 name = [];
		for (var a in lib.card) {
	//		if (lib.translate[a] == result) {     (这是精确搜索)
	//改为模糊搜索:
	if (lib.translate[a]&&lib.translate[a].indexOf(result)!=-1) {
				name.add(a);
				value = true;
			}
		} //寻找卡牌
		if (value == false || name.length == 0) {
			//alert('找不到名为' + result + '的卡牌!');
		 back2=true;
		}
		//进一步
		for (var le = 0; le < name.length; le++) {
		dialog.addSmall([[name[le]], 'vcard']);	
			var str = '';
			var card = lib.card[name[le]];
			if (!card) {
				continue;
			} else {
			//	var allcard = lib.config.all.cards.concat(['mode_derivation','mode_banned']);
			var allcard = lib.cardPack;
			/*if(lib.cardPack.mode_banned!=undefined){
			allcard=allcard.concat('mode_banned');
			}*/
				var Packname;
				for (var b in allcard) {
					var cardPack = lib.cardPack[ b ];
			for (var c = 0; c < cardPack.length; c++) {
						if (cardPack[c] == name[le] ) {						 
							Packname = lib.translate[ b + '_card_config'];
							break;
						}
					}
				}
				//suit number name nature
				str += '<br><span class="bluetext">卡牌名称</span> ：' + lib.translate[name[le]] +  '<br><span class="bluetext">卡牌类别</span> ：' + lib.translate[lib.card[name[le]].type] +  '<br><span class="bluetext">卡牌效果</span>：' + lib.translate[name[le]+'_info'] + '<br><span class="bluetext">所在卡牌包</span>：' + Packname;
			 if(lib.card[name[le]].derivation){str += '<br><span class="bluetext">卡牌来源</span> ：' + lib.translate[lib.card[name[le]].derivation]}
			 str+='<br><br><br>';
			}
			dialog.addText('<div><div id="Cdetail" style="display:block; left:auto; text-align:left; ">' + str);
		}
		if(back==true&&back2==true){
		alert('没有符合条件的武将或卡牌!');
			var nodes=dialog.content.childNodes;
		for(var i=nodes.length-1;i>=0;i--){
		dialog.content.removeChild(nodes[i]);
		}
		}
	};
	
	window.诗笺_manual = {
		show:function(){
	  var	Image=ui.background.style.backgroundImage;
			var manual = ui.create.div('.manual', manual);
			var menu = ui.create.div('.menu', manual);
			var input = menu.appendChild(document.createElement('input'));
			input.onkeydown=function(e){
			if(e&&e.keyCode==13){
			game.tujianBegin(content , close , input.value , manual);
			input.value="";
			}
			};
			var search = ui.create.div('.search', menu);
			var close = ui.create.div('.close', menu);
			var oldDialog=_status.event.dialog;
			var dialog=ui.create.dialog();
			dialog.noImage=true;
			dialog.style.backgroundImage="";
			
			var content = manual.appendChild(dialog);	
			content.classList.remove('nobutton');
			content.classList.add('content');
			content.style.transform = '';
			content.style.opacity = '';
			content.style.height = '';
			
			search.innerHTML = '搜索';
			search.addEventListener('click', function(){
				// alert(input.value); 	 input.value 是输入框里的内容
				game.tujianBegin(content , close , input.value , manual);
				input.value="";
			});
			
			close.innerHTML = '关闭';
			close.addEventListener('click', function(){
				alert('搜索结束，谢谢您的使用');     
				manual.remove();
				ui.arena.show();
				ui.system.show();
				//ui.menuContainer.show();			
				ui.background.style.backgroundImage=Image;
				_status.event.dialog=oldDialog;
				_status.event.dialog.show();
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
 var layoutPath = lib.assetURL + 'extension/武将卡牌搜索器';
	lib.init.css(layoutPath, 'extension');

},help:{},config:{
"manual":{
"name":"点击此处进行搜索",
"clear":true,
onclick:function(){
window.诗笺_manual.show();
},
}
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