/*
独立化修改：	
针对提取：移动卡牌用选择框，皮肤按钮，优化弹框；

去除武将，技能相关的东西，与其他暂时不必要的功能；

只要没有明显的bug，尽量不修改代码，也采用原来的名字，后续安装“蜀汉中兴”覆盖该整合扩展；

为了与原版区分：将其改名为“蜀汉中兴简化版提取版”

注：因为已经删除代码，准确定位移动代码，移动请搜索：shzx_moveCard

新版新增了，在界面的控制按钮
*/
game.import("extension", function (lib, game, ui, get, ai, _status) {
    //var fuc=arguments.callee;
    var url = lib.assetURL + 'extension/蜀汉中兴简化版/';
    try {
        return {
            name: "蜀汉中兴简化版",
            editable: false,
            content: function (config, pack) {
                lib.init.css(url, 'extension');
                lib.init.css(url, 'moveCard');
                // lib.init.css(url, 'music'); //删除“节奏大师”小游戏

                //功能注释：主界面快捷作弊弹窗：
                var dialogx = function () {
                    var i;
                    var hidden = false;
                    var notouchscroll = false;
                    var forcebutton = false;
                    var dialog = ui.create.div('.dialog');
                    dialog.contentContainer = ui.create.div('.content-container', dialog);
                    dialog.content = ui.create.div('.content', dialog.contentContainer);
                    dialog.bar1 = ui.create.div('.bar.top', dialog);
                    dialog.bar2 = ui.create.div('.bar.bottom', dialog);
                    dialog.buttons = [];
                    for (i in lib.element.dialog) {
                        dialog[i] = lib.element.dialog[i];
                    }
                    dialog.open = function () {
                        if (this.noopen) return;
                        var translate;
                        if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains('fixed')) {
                            translate = lib.config.dialog_transform;
                            this._dragtransform = translate;
                            this.style.transform = 'translate(' + translate[0] + 'px,' + translate[1] + 'px) scale(0.8)';
                        }
                        else {
                            this.style.transform = 'scale(0.8)';
                        }
                        this.style.transitionProperty = 'opacity,transform';
                        this.style.opacity = 0;
                        ui.arena.appendChild(this);
                        ui.update();
                        ui.refresh(this);
                        if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains('fixed')) {
                            this.style.transform = 'translate(' + translate[0] + 'px,' + translate[1] + 'px) scale(1)';
                        }
                        else {
                            this.style.transform = 'scale(1)';
                        }
                        this.style.opacity = 1;
                        var that = this;
                        setTimeout(function () {
                            that.style.transitionProperty = '';
                        }, 500);
                        return this;
                    };
                    dialog.close = function () {
                        this.delete();
                        if (ui.dialogs.length > 0) {
                            ui.update();
                        }
                        return this;
                    };
                    for (i = 0; i < arguments.length; i++) {
                        if (typeof arguments[i] == 'boolean') dialog.static = arguments[i];
                        else if (arguments[i] == 'hidden') hidden = true;
                        else if (arguments[i] == 'notouchscroll') notouchscroll = true;
                        else if (arguments[i] == 'forcebutton') forcebutton = true;
                        else dialog.add(arguments[i]);
                    }
                    if (!hidden) {
                        dialog.open();
                    }
                    if (!lib.config.touchscreen) dialog.contentContainer.onscroll = ui.update;
                    if (!notouchscroll) {
                        dialog.contentContainer.ontouchstart = ui.click.dialogtouchStart;
                        dialog.contentContainer.ontouchmove = ui.click.touchScroll;
                        dialog.contentContainer.style.WebkitOverflowScrolling = 'touch';
                        dialog.ontouchstart = ui.click.dragtouchdialog;
                    }
                    if (forcebutton) {
                        dialog.forcebutton = true;
                        dialog.classList.add('forcebutton');
                    }
                    return dialog;
                };
                //todo:自己分析控制台代码：
                console.open = function () {
                    if (_status.shzx_console == true) return false;
                    // 1.分析：创建控制台dialog面板：
                    var dialog = dialogx('控制台');
                    //dialog.bar1.innerHTML='控制台'	
                    dialog.style['z-index'] = 100;
                    dialog.style.color = "#FFFFFF";
                    dialog.style.backgroundImage = 'url(\"' + lib.assetURL + 'extension/蜀汉中兴简化版/switch_dialog.png\")';
                    dialog.style.backgroundSize = "100% 100%";
                    var currentrow1 = null; //
                    //var row1=ui.create.div('.menu-cheat',dialog.content);
                    var row1 = []
                    // 2.分析：创建控制台面板的关闭按钮：
                    var close = ui.create.div('.close-button', dialog);
                    // 3.分析：执行按钮：
                    var cheatButton = ui.create.div('.menubutton.round.highlight', '执');

                    /*
                        目标：
                        重新定制简便，可配置的方案：

                        目前游戏操作UI基本构成：
                        *****控制台*****
                        基础功能按钮：.menubutton；
                        *****其他选项*****
                        下拉列表1：#shzx_console_select；
                        下拉列表2：#shzx_console_select2；
                        *****选择数值*****
                        *****选择操作角色*****
                        角色按钮：.button .character .noclick ；

                    */

                    // 4.分析：是否有选中第一行的按钮：
                    var norow2 = function () {
                        var node = currentrow1;
                        if (!node) return false;
                        var node2 = document.getElementById('shzx_console_select2');
                        if (!node2 || node2.value != "none") return true;
                        return node.innerHTML == '横置' || node.innerHTML == '翻面' || node.innerHTML == '换人' || node.innerHTML == '复活' || node.innerHTML == '死亡' || node.innerHTML == '离开';
                    };
                    // 5.分析：更多选项，是否没有有选中（失去体力，失去体力上限，增加体力...）：
                    var noselect = function () {
                        var node = document.getElementById('shzx_console_select');
                        if (!node || node.value == "none") return true;
                        return false;
                    }
                    // 6.分析：更多选项2，是否没有有选中（加入游戏，离开游戏...）：
                    var noselect2 = function () {
                        var node = document.getElementById('shzx_console_select2');
                        if (!node || node.value == "none") return true;
                        return false;
                    }
                    // 方法分析：用于检测，刷新当前UI的状态，例如各种按钮；
                    var checkCheat = function () {
                        if (norow2() || select2.value != 'none') {
                            //for(var i=0;i<row2.childElementCount;i++){
                            for (var i = 0; i < row2.length; i++) {
                                row2[i].classList.remove('selectedx');
                                row2[i].classList.add('unselectable');
                            }
                        }
                        else {
                            //for(var i=0;i<row2.childElementCount;i++){
                            for (var i = 0; i < row2.length; i++) {
                                row2[i].classList.remove('unselectable');
                            }
                        }
                        if (currentrow1 && currentrow1.innerHTML == '复活') {
                            for (var i = 0; i < row3.childNodes.length; i++) {
                                if (row3.childNodes[i].dead) {
                                    row3.childNodes[i].style.display = '';
                                }
                                else {
                                    row3.childNodes[i].style.display = 'none';
                                    row3.childNodes[i].classList.remove('glow');
                                }
                                row3.childNodes[i].classList.remove('unselectable');
                            }
                        }
                        else {
                            for (var i = 0; i < row3.childElementCount; i++) {
                                if (currentrow1 && currentrow1.innerHTML == '换人' && row3.childNodes[i].link == game.me) {
                                    row3.childNodes[i].classList.add('unselectable');
                                }
                                else {
                                    row3.childNodes[i].classList.remove('unselectable');
                                }
                                if (!row3.childNodes[i].dead) {
                                    row3.childNodes[i].style.display = '';
                                }
                                else {
                                    row3.childNodes[i].style.display = 'none';
                                    row3.childNodes[i].classList.remove('glow');
                                }
                            }
                        }
                        if ((currentrow1 || select.value != 'none' || select2.value != 'none') && (currentrow2 || norow2() || select2.value != 'none') && (row3.querySelector('.glow') || row4.querySelector('.glow'))) {
                            //cheatButton.classList.add('glowing');
                            cheatButton.style['box-shadow'] = 'rgba(0, 0, 0, 0.3) 0 0 0 1px, rgba(0, 133, 255, 0.8) 0 0 10px, rgba(0, 133, 255, 0.8) 0 0 10px, rgba(0, 133, 255, 0.8) 0 0 15px';
                            return true;
                        }
                        else {
                            //cheatButton.classList.remove('glowing');
                            cheatButton.style['box-shadow'] = '';
                            return false;
                        }
                    }
                    cheatButton.listen(function () {
                        if (checkCheat()) {
                            var num = 0;
                            if (currentrow2) {
                                switch (currentrow2.innerHTML) {
                                    case '一': num = 1; break;
                                    case '二': num = 2; break;
                                    case '三': num = 3; break;
                                    case '四': num = 4; break;
                                    case '五': num = 5; break;
                                    case '六': num = 6; break;
                                    case '七': num = 7; break;
                                    case '八': num = 8; break;
                                    case '九': num = 9; break;
                                    case '十': num = 10; break;
                                }
                            }
                            var targets = [];
                            var buttons = row3.querySelectorAll('.glow');
                            for (var i = 0; i < buttons.length; i++) {
                                targets.push(buttons[i].link);
                            }
                            var buttons = row4.querySelectorAll('.glow');
                            for (var i = 0; i < buttons.length; i++) {
                                targets.push(buttons[i].link);
                            }
                            //alert('targets'+targets.length)
                            while (targets.length) {
                                var target = targets.shift();
                                var e = currentrow1 != null ? currentrow1.innerHTML : select.value;
                                if (e == "none" && select2.value != "none") e = select2.value;
                                //alert(e)
                                switch (e) {
                                    case '伤害': target.damage(num, 'nosource'); break;
                                    case '回复': target.recover(num, 'nosource'); break;
                                    case '摸牌': target.draw(num); break;
                                    case '弃牌': target.discard(target.getCards('he').randomGets(num)); break;
                                    case '横置': target.link(); break;
                                    case '翻面': target.turnOver(); break;
                                    case '复活': target.revive(target.maxHp); break;
                                    case '死亡': target.die(); break;
                                    case '离开': target.out(); break;
                                    case 'loseHp': target.loseHp(num); break;
                                    case 'loseMaxHp': target.loseMaxHp(num); break;
                                    case 'gainMaxHp': target.gainMaxHp(num); break;
                                    case 'addplayer': [].add.call(game.players, target); break;
                                    case 'removeplayer': [].remove.call(game.players, target); break;
                                    case '换人': {
                                        if (_status.event.isMine()) {
                                            if (!ui.auto.classList.contains('hidden')) {
                                                setTimeout(function () {
                                                    ui.click.auto();
                                                    setTimeout(function () {
                                                        ui.click.auto();
                                                        game.swapPlayer(target);
                                                    }, 500);
                                                });
                                            }
                                        }
                                        else {
                                            game.swapPlayer(target);
                                        }
                                        break;
                                    }
                                }
                            }
                            /*if(ui.coin){
                                game.changeCoin(-20);
                            }*/
                        }
                        index()
                    });

                    // 分析：当前界面，第一行操作的点击事件：
                    var clickrow1 = function () {
                        if (this.classList.contains('unselectable')) return;
                        if (currentrow1 == this) {
                            this.classList.remove('selectedx');
                            currentrow1 = null;
                        }
                        else {
                            this.classList.add('selectedx');
                            if (currentrow1) {
                                currentrow1.classList.remove('selectedx');
                            }
                            currentrow1 = this;
                            if (this.innerHTML == '换人') {
                                for (var i = 0; i < row3.childNodes.length; i++) {
                                    row3.childNodes[i].classList.remove('glow');
                                }
                            }
                        }
                        checkCheat();
                    };

                    // 这部分为创建UI：
                    // 理想：希望，功能设置能走配置的路线：
                    /*
                        当前创建按钮的要素：
                        var buttonDiv = ui.create.div('.menubutton', 'xxxxx', clickrow1);
                    */
                   /*
                        基本结构：
                        div .content-container
                            div .content
                                div .caption 控制台
                                div .caption 
                                div .menubutton 伤害    .unselectable（不能选中） 
                                ... ...
                                div .caption 其他选项
                                select #shzx_console_select （select组件）
                                    option value="none" 无 （select的选项）
                                select #shzx_console_select2 （select组件）
                                    option value="none" 无 （select的选项）
                                div .caption 选择数值
                                div .menubutton 一
                                div .menubutton 二
                                ... ...
                                div .caption 选择游戏内角色
                                div .menu-buttons .leftbutton .commandbutton （menubutton为单一按钮，menu-buttons为按钮组）
                                    div .button .character .noclick  （.button .character角色按钮   该项身为menu-buttons子项  .glow选中后有这个）
                                div .menubutton .round .highlight 执 （.menubutton.highlight红色高亮  .menubutton.round圆形按钮）
                   */
                    // 创建第一排操作按钮：统一注册clickrow1点击事件，
                    var nodedamage = ui.create.div('.menubutton', '伤害', clickrow1);
                    var noderecover = ui.create.div('.menubutton', '回复', clickrow1);
                    var nodedraw = ui.create.div('.menubutton', '摸牌', clickrow1);
                    var nodediscard = ui.create.div('.menubutton', '弃牌', clickrow1);
                    var nodelink = ui.create.div('.menubutton', '横置', clickrow1);
                    var nodeturnover = ui.create.div('.menubutton', '翻面', clickrow1);
                    var noderevive = ui.create.div('.menubutton', '复活', clickrow1);
                    var nodereplace = ui.create.div('.menubutton', '换人', clickrow1);
                    var nodedie = ui.create.div('.menubutton', '死亡', clickrow1);
                    var nodeout = ui.create.div('.menubutton', '离开', clickrow1);

                    dialog.add(" ")
                    dialog.add(nodedamage)
                    dialog.add(noderecover)
                    dialog.add(nodedraw)
                    dialog.add(nodediscard)
                    dialog.add(nodelink)
                    dialog.add(nodeturnover)
                    dialog.add(noderevive)
                    dialog.add(nodereplace)
                    dialog.add(nodedie);
                    dialog.add(nodeout)

                    row1.add(nodedamage)
                    row1.add(noderecover)
                    row1.add(nodedraw)
                    row1.add(nodediscard)
                    row1.add(nodelink)
                    row1.add(nodeturnover)
                    row1.add(noderevive)
                    row1.add(nodereplace)
                    row1.add(nodedie);
                    row1.add(nodeout);
                    dialog.add(" ")
                    //非某些游戏模式时，不能被选中：
                    if (lib.config.mode != 'identity' && lib.config.mode != 'guozhan' && lib.config.mode != 'doudizhu') {
                        nodereplace.classList.add('unselectable');
                    }
                    var currentrow2 = null;
                    //var row2=ui.create.div('.menu-cheat',dialog.content);
                    var row2 = []
                    var clickrow2 = function () {
                        if (this.classList.contains('unselectable')) return;
                        if (currentrow2 == this) {
                            this.classList.remove('selectedx');
                            currentrow2 = null;
                        }
                        else {
                            this.classList.add('selectedx');
                            if (currentrow2) {
                                currentrow2.classList.remove('selectedx');
                            }
                            currentrow2 = this;
                        }
                        checkCheat();
                    };

                    var select = document.createElement('select');
                    select.onchange = function (e) {
                        for (var i = 0; i < row1.length; i++) {
                            if (!noselect() || !noselect2()) {
                                row1[i].classList.add('unselectable');
                                row1[i].classList.remove('selectedx');
                            } else {
                                row1[i].classList.remove('unselectable');
                                row1[i].classList.remove('selectedx');
                            }
                        }
                        currentrow1 = null;
                        var node = document.getElementById('shzx_console_select2');
                        if (node) node.value = "none";
                        index();
                    };
                    select.id = 'shzx_console_select';
                    dialog.add("其他选项");
                    dialog.content.appendChild(select);
                    dialog.add(" ");

                    var option = document.createElement('option');
                    option.text = "无";
                    option.value = "none";
                    select.add(option);

                    option = document.createElement('option');
                    option.text = "失去体力";
                    option.value = "loseHp";
                    select.add(option);

                    option = document.createElement('option');
                    option.text = "失去体力上限";
                    option.value = "loseMaxHp";
                    select.add(option);

                    option = document.createElement('option');
                    option.text = "增加体力上限";
                    option.value = "gainMaxHp";
                    select.add(option);

                    var select2 = document.createElement('select');
                    select2.onchange = function (e) {
                        for (var i = 0; i < row1.length; i++) {
                            if (!noselect() || !noselect2()) {
                                row1[i].classList.add('unselectable');
                                row1[i].classList.remove('selectedx');
                            } else {
                                row1[i].classList.remove('unselectable');
                                row1[i].classList.remove('selectedx');
                            }
                        }
                        currentrow1 = null;
                        for (var i = 0; i < row2.length; i++) {
                            row2[i].classList.add('unselectable');
                            row2[i].classList.remove('selectedx');
                        }
                        currentrow2 = null;

                        var node = document.getElementById('shzx_console_select');
                        if (node) node.value = "none";

                        index();
                    };
                    select2.id = 'shzx_console_select2';
                    //dialog.add("其他选项(不可选择数值)");
                    dialog.content.appendChild(select2);
                    dialog.add("选择数值");

                    var option2 = document.createElement('option');
                    option2.text = "无";
                    option2.value = "none";
                    select2.add(option2);

                    option2 = document.createElement('option');
                    option2.text = "加入游戏";
                    option2.value = "addplayer";
                    select2.add(option2);

                    option2 = document.createElement('option');
                    option2.text = "移出游戏";
                    option2.value = "removeplayer";
                    select2.add(option2);


                    var nodex1 = ui.create.div('.menubutton', '一', clickrow2);
                    var nodex2 = ui.create.div('.menubutton', '二', clickrow2);
                    var nodex3 = ui.create.div('.menubutton', '三', clickrow2);
                    var nodex4 = ui.create.div('.menubutton', '四', clickrow2);
                    var nodex5 = ui.create.div('.menubutton', '五', clickrow2);

                    var nodex6 = ui.create.div('.menubutton', '六', clickrow2);
                    var nodex7 = ui.create.div('.menubutton', '七', clickrow2);
                    var nodex8 = ui.create.div('.menubutton', '八', clickrow2);
                    var nodex9 = ui.create.div('.menubutton', '九', clickrow2);
                    var nodex10 = ui.create.div('.menubutton', '十', clickrow2);
                    for (var i = 1; i < 11; i++) {
                        eval('dialog.add(nodex' + i + ');row2.add(nodex' + i + ');');
                    }
                    dialog.add("选择游戏内角色");

                    var row3 = ui.create.div('.menu-buttons.leftbutton.commandbutton', dialog.content);
                    row3.style.marginTop = '3px';
                    var clickrow3 = function () {
                        if (this.classList.contains('unselectable')) return;
                        this.classList.toggle('glow');
                        if (currentrow1 && currentrow1.innerHTML == '换人' && this.classList.contains('glow')) {
                            if (this.link == game.me) {
                                this.classList.remove('glow');
                            }
                            for (var i = 0; i < row3.childElementCount; i++) {
                                if (row3.childNodes[i] != this) {
                                    row3.childNodes[i].classList.remove('glow');
                                }
                            }
                        }
                        checkCheat();
                    };
                    dialog.add("选择游戏外角色");
                    var row4 = ui.create.div('.menu-buttons.leftbutton.commandbutton', dialog.content);
                    row4.style.marginTop = '3px';
                    var clickrow4 = function () {
                        if (this.classList.contains('unselectable')) return;
                        this.classList.toggle('glow');
                        if (currentrow1 && currentrow1.innerHTML == '换人' && this.classList.contains('glow')) {
                            if (this.link == game.me) {
                                this.classList.remove('glow');
                            }
                            for (var i = 0; i < row4.childElementCount; i++) {
                                if (row4.childNodes[i] != this) {
                                    row4.childNodes[i].classList.remove('glow');
                                }
                            }
                        }
                        checkCheat();
                    };

                    // 创建角色选项：
                    //var index=setInterval(
                    var index = function () {
                        var list2 = [];
                        row4.innerHTML = '';
                        //创建非玩家的角色：
                        var node = document.getElementsByClassName('player');
                        if (node && node.length > 0) {
                            for (var i = 0; i < node.length; i++) {
                                if (!game.players.contains(node[i]) && !game.dead.contains(node[i]) && (lib.character[node[i].name] || lib.character[node[i].name1])) {
                                    list2.push(node[i]);
                                }
                            }
                        }
                        if (list2.length) {
                            buttons = ui.create.buttons(list2, 'player', row4, true);
                            for (var i = 0; i < buttons.length; i++) {
                                buttons[i].listen(clickrow4);
                            }
                            checkCheat();
                        }
                        var list = [];
                        for (var i = 0; i < game.players.length; i++) {
                            if (lib.character[game.players[i].name] || game.players[i].name1) {
                                list.push(game.players[i]);
                            }
                        }
                        for (var i = 0; i < game.dead.length; i++) {
                            if (lib.character[game.dead[i].name] || game.dead[i].name1) {
                                list.push(game.dead[i]);
                            }
                        }
                        if (list.length) {
                            for (var i = 0; i < row1.length; i++) {
                                row1[i].show()
                            }
                            for (var i = 0; i < row2.length; i++) {
                                row2[i].show()
                            }
                            row3.innerHTML = '';
                            //创建当前游戏的玩家角色（包括死亡）：
                            var buttons = ui.create.buttons(list, 'player', row3, true);
                            for (var i = 0; i < buttons.length; i++) {
                                buttons[i].listen(clickrow3);
                                if (game.dead.contains(buttons[i].link)) { //显示阵亡
                                    buttons[i].dead = true;
                                }
                            }
                            //row3.innerHTML += "<br/>";
                            checkCheat();
                        }
                        else if (!list2.length) {
                            for (var i = 0; i < row1.length; i++) {
                                row1[i].hide()
                            }
                            for (var i = 0; i < row2.length; i++) {
                                row2[i].hide()
                            }
                        }

                        if (lib.config.mode == 'identity' || lib.config.mode == 'guozhan') {
                            if (!game.phaseNumber || _status.qianlidanji) {
                                nodereplace.classList.add('unselectable');
                            }
                            else if (_status.event.isMine() && ui.auto.classList.contains('hidden')) {
                                nodereplace.classList.add('unselectable');
                            }
                            else if (noselect() && noselect2()) {
                                nodereplace.classList.remove('unselectable');
                            }
                        }
                        if (game.dead.length == 0) {
                            noderevive.classList.add('unselectable');
                        }
                        else {
                            noderevive.classList.remove('unselectable');
                        }

                        checkCheat();
                        //},1200);
                    };
                    index()
                    close.listen(function () {
                        dialog.remove();
                        _status.shzx_console = false;
                    });
                    _status.shzx_console = true;

                    dialog.add(cheatButton)
                    dialog.style.top = '50px';
                    dialog.style.height = '350px';
                    return {
                        'dialog': dialog,
                    };
                };

                var download = function (url, folder, onsuccess, onerror, onprogress) {
                    var fileTransfer = new FileTransfer();
                    folder = lib.assetURL + folder;
                    if (onprogress) {
                        fileTransfer.onprogress = function (progressEvent) {
                            onprogress(progressEvent.loaded, progressEvent.total);
                        };
                    }
                    lib.config.brokenFile.add(folder);
                    game.saveConfigValue('brokenFile');
                    fileTransfer.download(encodeURI(url), encodeURI(folder), function () {
                        lib.config.brokenFile.remove(folder);
                        game.saveConfigValue('brokenFile');
                        if (onsuccess) {
                            onsuccess();
                        }
                    }, onerror);
                };
                //download("https://wumingshashijian.coding.net/public/noname/noname/git/files/master/music/神谕法则-诗笺翻唱.mp3",'extension/蜀汉中兴简化版/神谕法则.mp3',function(){},function(){});
                //console.log(pack.character.character)						
                /*
                        if(get.mode()=="guozhan"&&lib.characterPack.mode_guozhan){
                        var packx=pack.character.character;
                        var characters=[];
                            for(var i in packx){
                            characters.push('gz_'+i);
                            if(!packx[i][4]) packx[i][4]=[];
                            //packx[i][4].push("unseen");
                            download(lib.assetURL+'extension/蜀汉中兴简化版/'+i+'.jpg','image/character/'+i+'.jpg',function(){},function(){});
                          lib.characterPack.mode_guozhan['gz_'+i]=packx[i];			
                            }
                            lib.perfectPair.gz_shzx_jiangwei=['gz_shzx_zhugeliang']
                            lib.perfectPair.gz_shzx_liufeng=['gz_shzx_ruanji']
                                var guozhanRank={
                         '8':['gz_shzx_pangtong','gz_shzx_dengai','gz_shzx_zhaoxiang','gz_shzx_masu'],
                         '7':['gz_shzx_re_machao','gz_shzx_zhangfei','gz_shzx_ruanji'],
                         '6':['gz_shzx_guanyu','gz_shzx_jiangwei','gz_shzx_huangyueying','gz_shzx_weiyan','gz_shzx_puyuan','gz_shzx_zuocizhugeliang','gz_shzx_qinmi','gz_shzx_wuxian'],
                         '5':['gz_shzx_liufeng','gz_shzx_zhugeliang'],
                         //'4':[],
                         //'3':[],
                         //'2':[],
                         //'1':[],
                        };
                        for(var i in guozhanRank){
                            lib.guozhanRank[i].addArray(guozhanRank[i])
                        }
                        lib.characterSort.mode_guozhan.shuhanzhongxing=characters;
                        lib.translate['shuhanzhongxing']="蜀汉中兴简化版";
                        };
                        */
                /*if(config.skill){
                //技能特效的设置方式类似
                //例：设置孙笨【激昂】的特效
                //lib.animate.skill.jiang=function(name,popname,checkShow){
                // this.chat('吾乃江东的小霸王，孙伯符！')
                //}
                //name为技能名称 popname为原先发动技能时弹出的文字（绝大多数情况下与name相同） checkShow为双将模式下技能的来源（vice为主将 其他情况下为副将）
                
                var style2=document.createElement('style');
                     style2.innerHTML='@keyframes myMovex {'+
                    'from { left: -175px; }  to { left:'+document.body.offsetWidth*0.30+'px;} '+
                    '}'+    
                    '@keyframes myMovex2 {'+
                    'from { right: -175px; }  to { right:'+document.body.offsetWidth*0.30+'px;} '+
                    '}'+
                    '@keyframes myMovex3 {'+
                    'from { left:'+document.body.offsetWidth*0.30+'px;} to { left:'+document.body.offsetWidth*0.4+'px; }  '+
                    '}'+
                    '@keyframes myMovex4 {'+
                    'from { right:'+document.body.offsetWidth*0.30+'px;} to { right:'+ document.body.offsetWidth*0.4+'px; }  '+
                    '}'+       
                    '@keyframes myMovex5 {'+
                    'from { left:'+document.body.offsetWidth*0.4+'px;} to { left:120%; }  '+
                    '}'+    
                    '@keyframes myMovex6 {'+
                    'from { right:'+document.body.offsetWidth*0.4+'px;} to { right:120%; }  '+
                    '}'+    
                    '@keyframes myShadow {'+
                    '0% { box-shadow:0 0 15px rgb(255,106,4),0 0 15px rgb(255,106,4),0 0 20px rgb(255,106,4),0 0 20px rgb(255,106,4); }'+
                    '50% { box-shadow:0 0 15px rgb(255,106,4),0 0 35px rgb(255,106,4),0 0 20px rgb(255,106,4),0 0 30px rgb(255,106,4);  }  '+
                    '100% { box-shadow:0 0 15px rgb(255,106,4),0 0 15px rgb(255,106,4),0 0 20px rgb(255,106,4),0 0 20px rgb(255,106,4);  }'+
                    '}'+    
                    '.shzxchange {'+   
                    'position: absolute;'+
                    'animation-name: myShadow,myMovex,myMovex3,myMovex5; '+
                    'animation-duration: 4.5s,1s,2.5s,1s;'+
                    'animation-delay: 0s,0s, 1s , 2s;'+
                    'animation-timing-function: linear,linear,linear,linear;'+   
                    'animation-iteration-count: 4,1,1,1;'+
                    'animation-fill-mode: forwards,forwards,forwards,forwards;'+
                    '}'+
                    '.shzxchange2 {'+   
                    'position: absolute;'+
                    'animation-name: myMovex2,myMovex4,myMovex6; '+
                    'animation-duration: 1s,2.5s,1s;'+
                    'animation-delay: 0s, 1s , 2s;'+
                    'animation-timing-function: linear,linear,linear;'+   
                    'animation-iteration-count: 1,1,1;'+
                    'animation-fill-mode: forwards,forwards,forwards;'+
                    '}'+
                '}';
                document.head.appendChild(style2);
                
                
                var skills=this[4]['skill']['skill'];//Object {}
                for(var i in skills){
                lib.animate.skill[i]=function(name,popname,checkShow){
                 //var color = lib.groupnature[this.group] || '';
                 var color='rgb(255,106,4)';
                 var div=ui.create.div('.shzxchange',ui.window);//武将图片 
                 div.style.transform="rotateZ(-15deg)";
                 div.style.top="33%";
                 div.style.width="150px";
                 div.style.height="225px";
                 div.style.zIndex=20;
                    div.style.backgroundImage =( checkShow=="main" ? this.node.avatar.style.backgroundImage : this.node.avatar2.style.backgroundImage);
                    div.style.backgroundSize="cover";
                    div.style.borderRadius = '5px';
                //	div.style.boxShadow='0 0 15px rgb(255,106,4),0 0 15px rgb(255,106,4),0 0 20px rgb(255,106,4),0 0 20px rgb(255,106,4)';
                	
                    var div2=ui.create.div('.shzxchange2',lib.translate[popname],ui.window);//技能名
                 div2.style.top="55%";
                 div2.style.width="150px";
                 div2.style.height="75px";
                 div2.style.zIndex=20;
                 div2.style.color=color;
                 div2.style.textShadow='0 0 5px #000,0 0 5px #000,0 0 5px #000,0 0 5px #000';
                 div2.style.fontSize='60px';
                 div.style['font-family']='shousha';
                 
                 ui.arena.classList.add('menupaused');
                    game.delay(4);
                    setTimeout(function(){	
                 div.remove();
                 div2.remove();
                 ui.arena.classList.remove('menupaused');
                    },4000);
                }
                }
                
                }
                */
               //功能注释：改变弹出对话框样式：
                if (config.changeDialog) {
                    var dialog = ui.create.dialog;
                    ui.create.dialog = function () {
                        var log = dialog.apply(this, arguments);
                        log.style.color = "#FFFFFF";
                        log.style.backgroundImage = 'url(\"' + lib.assetURL + 'extension/蜀汉中兴简化版/switch_dialog.png\")';
                        log.style.backgroundSize = "100% 100%";
                        return log;
                    };
                    var style = document.createElement('style');
                    style.innerHTML = '#control > .control > div{' +
                        'background-size: 100% 100%;' +
                        'background-image: url(\"' + lib.assetURL + 'extension/蜀汉中兴简化版/chooseControl.png\");' +
                        'color: #ffffff;' +
                        'text-align: center;' +
                        'text-items: center;' +
                        'position: relative;' +
                        'padding: 5px 15px 5px 15px;' +
                        'font-size: 23px;' +
                        //'font-family: shousha;'+
                        'top: -5px;' +
                        //'height: 25px;'+
                        'text-shadow: 0 0 3px #000,0 0 3px #000,0 0 3px #000,0 0 3px #000;' +
                        '}' +
                        '#control > .control {' +
                        'box-shadow: none !important;' +
                        'background-image: none !important;' +
                        'overflow: visible;' +
                        '}' +
                        '.control.disabled {' +
                        'filter: grayscale(100%);' +
                        '-webkit-filter: grayscale(100%);' +
                        '}';
                    /*'.control.selectable {'+
                    'opacity: 1;'+
                    'box-shadow: 0px -1px 3px blue, 0px -1px 6px blue, 0px 0px 9px blue, 0px 3px 12px blue;'+
                    'transition: opacity 0.3s linear;'+
                    '}';*/
                    document.head.appendChild(style);

                    var control = ui.create.control;
                    game.saveConfig('seperate_control', true);
                    //分离选项条
                    ui.create.control = function () {
                        var c = control.apply(this, arguments);
                        if (arguments[0] == '结束回合' || arguments[0] == '结束') {
                            c.childNodes[0].style.backgroundImage = 'url(\"' + lib.assetURL + 'extension/蜀汉中兴简化版/phaseUseEnd.png\")';
                            //c.classList.add('selectable');
                        }
                        return c;
                    };
                }

                //功能注释：分享（到qq）：
                /*						
                if(window.shzx_fuc==undefined){
                window.shzx_fuc={
                readFile:game.readFile,
                getFileList:game.getFileList,
                }
                }if(parent.shzx_fuc!=undefined){
                game.readFile=parent.shzx_fuc.readFile;
                game.getFileList=parent.shzx_fuc.getFileList;
                }
                
                if(config.share){
                   var button = ui.create.div('.menubutton.round', '享', ui.window, function() {
                   var inputObj=document.createElement('input')
                   inputObj.setAttribute('id','file');
                   inputObj.setAttribute('type','file');
                   inputObj.setAttribute('name','file');
                   inputObj.setAttribute("style",'visibility:hidden');
                   document.body.appendChild(inputObj);
                   inputObj.click();
                   inputObj.onchange=function(e){
                   var file=e.target.files[0];    
                    var upload = function() {
                    if (input.files.length === 0) {
                        console.log("未选择文件")
                        return;
                    } 
                    var formData = new FormData();
                    formData.append("file", file);
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            console.log(xhr.responseText);
                            //info.innerHTML = 
                            game.print(xhr.responseText);
                        }
                    };
                    xhr.upload.addEventListener("progress", function(event) {
                        if(event.lengthComputable){
                            //progress.style.width = 
                            //Math.ceil(event.loaded * 100 / event.total) + "%";
                        }
                    }, false);
                    xhr.open("POST", "http://wpa.qq.com/msgrd?v=3&uin=2954700422&site=qq&menu=yes");
                    xhr.send(formData);
                };
                   }
                   });
                   //window.button=button
                  ui.window.appendChild(button)
                  button.style.bottom = '30%';
                  button.style.right = '25px';
                  button.style.background = 'rgba(0,0,0,0.4)';
                  button.style.color = 'white';
                  button.style.textShadow = 'rgba(0,0,0,0.5) 0px 0px 2px';
                  button.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0 0 0 1px, rgba(0, 0, 0, 0.3) 0 3px 10px';
                  button.style.position = 'fixed';    
                }
                */
                //功能注释：截图（已删除）
                
                //功能注释：节奏大师游戏（已删除）
               
                //功能注释：获取样式：
                window.shzx_gainStyle = function (target) {
                    if (target == null || typeof target != 'object') throw arguments;
                    var obj = {};
                    for (var i in target.style) {
                        if (target.style[i]) {
                            obj[i] = target.style[i]
                        }
                    }
                    return obj;
                }

                //功能注释：移动框
                //移动框:
                window.shzx_moveDiv = function (target) {
                    if (target == null || typeof target != 'object') throw arguments;
                    target.onmousedown = function (evt) {
                        var e = evt || event;
                        var disX = e.clientX - target.offsetLeft;
                        var disY = e.clientY - target.offsetTop;
                        document.onmousemove = function (evt1) {
                            var eMove = evt1 || event;
                            var xPos = eMove.clientX - disX;
                            var yPos = eMove.clientY - disY;
                            if (xPos < 0) {
                                xPos = 0;
                            }
                            else if (xPos > document.documentElement.clientWidth - target.offsetWidth) {
                                xPos = document.documentElement.clientWidth - target.offsetWidth;
                            }
                            if (yPos < 0) {
                                yPos = 0;
                            }
                            else if (yPos > document.documentElement.clientHeight - target.offsetHeight) {
                                yPos = document.documentElement.clientHeight - target.offsetHeight;
                            }
                            target.style.left = xPos + 'px';
                            target.style.top = yPos + 'px';
                        };
                        document.onmouseup = function () {
                            document.onmousemove = null;
                            document.onmouseup = null;

                        };
                        return false;
                    };
                    target.onmousedown = function (evt) {
                        var e = evt || event;
                        var disX = e.clientX - target.offsetLeft;
                        var disY = e.clientY - target.offsetTop;
                        document.onmousemove = function (evt1) {
                            var eMove = evt1 || event;
                            var xPos = eMove.clientX - disX;
                            var yPos = eMove.clientY - disY;
                            if (xPos < 0) {
                                xPos = 0;
                            }
                            else if (xPos > document.documentElement.clientWidth - target.offsetWidth) {
                                xPos = document.documentElement.clientWidth - target.offsetWidth;
                            }

                            if (yPos < 0) {
                                yPos = 0;
                            }
                            else if (yPos > document.documentElement.clientHeight - target.offsetHeight) {
                                yPos = document.documentElement.clientHeight - target.offsetHeight;
                            }
                            target.style.left = xPos + 'px';
                            target.style.top = yPos + 'px';
                        };
                        document.onmouseup = function () {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                        return false;
                    };
                    target.ontouchmove = function (e) {
                        if (_status.mousedragging) return;
                        if (_status.draggingtouchdialog) return;
                        if (!_status.dragged) {
                            if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 ||
                                Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
                                _status.dragged = true;
                            }
                        }
                        if ((this == ui.handcards1Container || this == ui.handcards2Container) && !this.classList.contains('scrollh')) {
                            e.preventDefault();
                        }
                        else if (lib.device == 'ios' && this.scrollHeight <= this.offsetHeight + 5 && this.scrollWidth <= this.offsetWidth + 5) {
                            e.preventDefault();
                        }
                        else {
                            delete _status._swipeorigin;
                            e.stopPropagation();
                        }
                    };
                    target.style.WebkitOverflowScrolling = 'touch';
                    target.ontouchstart = function (e) {
                        if ((this == _status.extension_背景音乐open ? e.touches.length > 0 : e.touches.length > 1) &&
                            !this.classList.contains('popped') &&
                            !this.classList.contains('fixed')) {
                            _status.draggingtouchdialog = this;
                            this._dragorigin = {
                                clientX: e.touches[0].clientX,
                                clientY: e.touches[0].clientY,
                            };
                            if (!this._dragtransform) {
                                this._dragtransform = [0, 0];
                            }
                            this._dragorigintransform = this._dragtransform.slice(0);
                            if (this != _status.extension_背景音乐open) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }
                    };
                    return target;
                };

                //功能注释：在游戏开始时，进行测试（当前为游戏开始时，显示控制按钮）
                lib.skill._shzx_测试 = {
                    trigger: { global: "gameStart" },
                    forced: true,
                    filter: function (trigger, player) {
                        return player == game.me
                    },
                    content: function () {
                        window.ui = ui;
                        window.game = game;
                        window.lib = lib;
                        window._status = _status;
                        window.player = game.me;
                        window.get = get;
                        var backbutton = ui.create.div('.menubutton.round', '控', ui.arena, function () {
                            console.open();
                        });
                        backbutton.style.bottom = '30%';
                        backbutton.style.right = '80px';
                        backbutton.style.background = 'rgba(0,0,0,0.4)';
                        backbutton.style.color = 'white';
                        backbutton.style.textShadow = 'rgba(0,0,0,0.5) 0px 0px 2px';
                        backbutton.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0 0 0 1px, rgba(0, 0, 0, 0.3) 0 3px 10px';
                        backbutton.style.position = 'fixed';

                        if (get.mode() == "shzx_connect") {
                            _status.connectMode = true;
                        }
                        return;
                        /*ui.menuContainer.show();
                        ui.click.consoleMenu()
                        var input = document.getElementsByTagName('input')[0];
                        var str = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value') ;
                        Object.defineProperty(input,'value',{
                        enumerable: true,
                        configurable: true, 
                        get:function() { 
                        var next=str.get.call(this) ; 
                        return next;
                        },
                        set:function(value) { 
                        if(input.value.length != value.length && value.length == 0) alert('作弊了');
                        str.set.call(this,value) ;
                        },
                        });
                        ui.menuContainer.hide();
                        */
                    },
                }

                lib.element.player.shzx_moveCard = function (skill, nojudge) {
                    var next = game.createEvent('shzx_moveCard');
                    next.player = this;
                    next.setContent('shzx_moveCard');
                    next.skill = skill;
                    next.nojudge = nojudge;
                    return next;
                };
                lib.element.content.shzx_moveCard = function () {
                    'step 0'
                    event.aichoose = function () {
                        if (event.close == true) {
                            game.resume();
                            return;
                        }
                        if (event.choosed == true) return;
                        var cards = document.getElementsByClassName('moveCard');
                        if (cards == null || cards.length < 18 || !event.dialog || event.dialog != window.shzx_moveCardDialog) return;
                        var dialog = event.dialog;
                        var equips1 = dialog.equips1;
                        var player1 = equips1[0].storage.player;
                        //var att1=get.attitude(event.player,player1);
                        var equips2 = dialog.equips2;
                        var player2 = equips2[0].storage.player;
                        //var att2=get.attitude(event.player,player2);
                        var fromplayer = null, toplayer = null, choose = null, effect;
                        var close = dialog.closeButton;
                        //get.effect(event.target,event.card,event.player,player)<0;
                        var cardList = Array.from(document.getElementsByClassName('moveCard'));
                        var cardList2 = [];

                        for (var i = 0; i < cardList.length; i++) {
                            var check = cardList[i];
                            if ((check.style.webkitFilter == "grayscale(100%)" || check.style.filter == "grayscale(100%)")) continue;;
                            if (!check.style.backgroundImage || !check.realPictures) continue;
                            if (!check.storage.card) continue;
                            var pos = get.position(check.storage.card);
                            if (event.nojudge == true && pos == "j") continue;
                            cardList2.push(check);
                        }

                        for (var i = 0; i < cardList2.length; i++) {
                            var to = cardList2[i].to[0].storage.player;
                            var from = cardList2[i].storage.player;
                            var att1 = get.attitude(event.player, to);
                            var att2 = get.attitude(event.player, from);
                            var pos = get.position(cardList2[i].storage.card);
                            var cardeffect = Math.abs(get.effect(to, cardList2[i].storage.card, to, event.player));
                            if (att1 > 0 && pos == "j" && cardeffect > 0) {
                                cardeffect = -cardeffect;
                            }
                            if (att1 <= 0 && pos == "e" && get.value(cardList2[i].storage.card, from) > 0.1 && cardeffect > 0) {
                                cardeffect = -cardeffect;
                            }
                            if (att1 > 0 && pos == "e" && get.value(cardList2[i].storage.card, from) <= 0.1) {
                                cardeffect = -cardeffect - 1;
                            }
                            if (att1 <= 0 && pos == "e" && get.value(cardList2[i].storage.card, from) <= 0.1) {
                                cardeffect = 3;
                            }
                            if (cardeffect < 0 && pos == "e" && att2 <= 0 && get.name(cardList2[i].storage.card) == "tengjia") {
                                cardeffect = 1;
                            }
                            if (cardeffect > 0 && pos == "e" && att2 > 0 && get.name(cardList2[i].storage.card) == "tengjia") {
                                cardeffect = -1;
                            }
                            //game.log(from,'的',cardList2[i].storage.card,'对',to,'的收益为',cardeffect);
                            if (cardeffect == 0) {
                                if (att1 <= 0) {
                                    if (!(pos == "e" && get.cardtag(cardList2[i].storage.card, 'gifts'))) { continue; }
                                }
                                effect = cardeffect;
                                toplayer = to;
                                fromplayer = from;
                                choose = cardList2[i]
                            }
                            else if (!effect || cardeffect > effect) {
                                effect = cardeffect;
                                toplayer = to;
                                fromplayer = from;
                                choose = cardList2[i]
                            }
                        }

                        if (choose != null) {
                            event.choosed = true;
                            setTimeout(function () {
                                choose.click();
                                setTimeout(function () {
                                    close.click();
                                }, 300);
                            }, 300);
                        } else if (event.choosedNum && event.choosedNum > 4) {
                            choose = cardList2[0];
                            event.choosed = true;
                            setTimeout(function () {
                                choose.click();
                                setTimeout(function () {
                                    close.click();
                                }, 300);
                            }, 300);
                        }
                        return choose;
                    };
                    if (event.fromPlayer && event.ToPlayer) {
                        event.goto(2);
                        return
                    }
                    var next = player.chooseTarget(2, function (card, player, target) {
                        if (ui.selected.targets.length) {
                            var from = ui.selected.targets[0];
                            var js = from.getCards('j');
                            if (js.length > 0 && _status.event.nojudge != true) {
                                for (var i = 0; i < js.length; i++) {
                                    if (!['lebu', 'bingliang', 'shandian'].contains(js[i].name)) continue;
                                    if (target.canAddJudge(js[i])) return true;
                                }
                            }
                            if (target.isMin()) return false;
                            var es = from.getCards('e');
                            if (es.length > 0) {
                                for (var i = 0; i < es.length; i++) {
                                    if (target.isEmpty(get.subtype(es[i]))) return true;
                                    //else if(get.subtype(es[i])=='equip6') return target.canEquip('equip6');
                                }
                            }
                            var js2 = target.getCards('j');
                            if (js2.length > 0 && _status.event.nojudge != true) {
                                for (var i = 0; i < js2.length; i++) {
                                    if (!['lebu', 'bingliang', 'shandian'].contains(js2[i].name)) continue;
                                    if (from.canAddJudge(js2[i])) return true;
                                }
                            }
                            if (from.isMin()) return false;
                            var es2 = target.getCards('e');
                            if (es2.length > 0) {
                                for (var i = 0; i < es2.length; i++) {
                                    if (from.isEmpty(get.subtype(es2[i]))) return true;
                                    //else if(get.subtype(es2[i])=='equip6') return from.canEquip('equip6');
                                }
                            }
                            return false;
                        }
                        else {
                            var range = 'ej';
                            if (_status.event.nojudge) range = 'e';
                            return target.getCards(range, function (card) {
                                if (get.type(card) == "delay") {
                                    return ['lebu', 'bingliang', 'shandian'].contains(card.name);
                                } else return get.type(card) == "equip";
                            }).length > 0;
                        }
                    });
                    next.set('nojudge', event.nojudge || false);
                    next.set('ai', function (target) {
                        var player = _status.event.player;
                        var att = get.attitude(player, target);
                        var sgnatt = get.sgn(att);
                        if (ui.selected.targets.length == 0) {
                            //如果还没选择目标
                            if (att > 0) {
                                //player对target的态度大于0
                                if (!_status.event.nojudge && target.countCards('j', function (card) {
                                    //如果可以移动判定牌
                                    if (['lebu', 'bingliang', 'shandian'].contains(card.name) == false) return false;
                                    //只允许乐不思蜀，兵粮寸断，闪电
                                    return game.hasPlayer(function (current) {
                                        //返回可以移动这个卡牌且对他态度小于0的目标
                                        return current.canAddJudge(card) && get.attitude(player, current) < 0;
                                    });
                                })) return 14;
                                //有上述结果，return 14
                                if (target.countCards('e', function (card) {
                                    //对于装备牌的判定								
                                    return ((get.effect(target, card, target, player) < 0 && get.name(card) != 'tengjia') || get.cardtag(card, 'gifts')) && game.hasPlayer(function (current) {
                                        return current != target && get.attitude(player, current) < 0 && current.isEmpty(get.subtype(card))
                                    });
                                }) > 0) return 9;
                                //如果此牌对其的效果小于等于0则寻找对其一个态度小于0且能装备此牌的角色
                                //如果有，返回9
                                if (target.countCards('e', function (card) {
                                    //对于失去装备牌有收益角色的判定								
                                    return get.effect(target, card, target, player) > 0 && target.hasSkillTag('noe') && game.hasPlayer(function (current) {
                                        return current != target && get.attitude(player, current) > 0 && current.isEmpty(get.subtype(card))
                                    });
                                }) > 0) {
                                    //game.log(10)
                                    return 10
                                }
                                //如果有，返回10
                            }
                            else if (att < 0) {
                                //如果你对target的态度小于0，且没选择目标
                                if (game.hasPlayer(function (current) {
                                    //寻找另一个角色
                                    if (current != target && get.attitude(player, current) > 0) {
                                        //如果你对寻找的角色态度大于0
                                        var es = target.getCards('e');
                                        for (var i = 0; i < es.length; i++) {
                                            //循环他的装备牌
                                            //game.log(es[i],'对',target,'的价值为',get.value(es[i],target),'，',current,'是否可以装备',current.isEmpty(get.subtype(es[i])),'，价值',get.value(es[i],current),'，效果',get.effect(current,es[i],current,player))

                                            var cardeffect = Math.abs(get.effect(current, es[i], current, player));
                                            if (get.cardtag(es[i], 'gifts') && cardeffect > 0) {
                                                cardeffect = -cardeffect;
                                            } else if (get.name(es[i]) == 'tengjia') {
                                                cardeffect = -cardeffect;
                                            }
                                            //game.log('是否确定：',get.value(es[i],target)>0 &&current.isEmpty(get.subtype(es[i]))&&( get.value(es[i],current)>0||cardeffect>0) ,'，AI考虑第一个目标：',target);
                                            if (!get.cardtag(es[i], 'gifts') && current.isEmpty(get.subtype(es[i])) && (get.value(es[i], current) > 0.1 || cardeffect > 0)) return true;
                                            //如果牌对target和current的价值大于0且current可以装备此牌，则返回true
                                        }
                                    }
                                })) {
                                    return -att;
                                    //如果有，返回对target态度的负值
                                }
                            }
                            return 0;
                            //其他情况则不选
                        }
                        //选择第一个角色后:
                        var es = ui.selected.targets[0].getCards('e');
                        //es为选择的第一个角色的装备牌。
                        var i;
                        var att2 = get.sgn(get.attitude(player, ui.selected.targets[0]));
                        var att2x = get.attitude(player, ui.selected.targets[0])

                        //game.log("name:"+ui.selected.targets[0].name+" att2x:"+att2x)

                        //get.sgn的意思为大于0返回1，小于0返回负一，否则返回0
                        //att2为player对第一个角色的态度(1，0，-1)
                        for (i = 0; i < es.length; i++) {
                            //折戟的价值是0.1，大于0，真的是醉了																													
                            if (att2 > 0 && sgnatt <= 0) {
                                //对target态度小于等于0，对第一个目标态度大于0						
                                if (get.value(es[i], ui.selected.targets[0]) <= 0.1 && target.isEmpty(get.subtype(es[i]))) {
                                    //game.log('第一判断，将',ui.selected.targets[0],'的',es[i],'移动给',target,'，收益绝对值:', Math.abs(get.effect(target,es[i],target,player)) , '，态度值:', -att				);
                                    return Math.abs(get.effect(target, es[i], target, player)) > 0 ? Math.abs(get.effect(target, es[i], target, player)) : -att;
                                }
                            }
                            else if (att2 <= 0 && sgnatt > 0) {
                                //对target态度大于0，对第一个目标态度小于等于0						
                                if ((!get.cardtag(es[i], 'gifts') && !get.value(es[i], ui.selected.targets[0]) <= 0.1) && target.isEmpty(get.subtype(es[i]))) {
                                    //game.log('第二判断，将',ui.selected.targets[0],'的',es[i],'移动给',target,'，收益绝对值:', Math.abs(get.effect(target,es[i],target,player)) , '，态度值:', att			);
                                    return Math.abs(get.effect(target, es[i], target, player)) > 0 ? Math.abs(get.effect(target, es[i], target, player)) : att;
                                }
                            }
                            else if (att2 > 0 && sgnatt > 0) {
                                //对target态度大于0，对第一个目标态度大于0
                                //将第一个目标的装备给第二个
                                //if(  get.value(es[i],ui.selected.targets[0])>0.1 && get.name(es[i])!='tengjia'  && !get.cardtag(es[i],'gifts')  && ui.selected.targets[0].hasSkillTag('noe')&&target.isEmpty(get.subtype(es[i])) ){								
                                if (((get.value(es[i], target) > 0.1 && get.name(es[i]) != 'tengjia') || (get.value(es[i], target) < 0.1 && get.name(es[i]) == 'tengjia')) && !get.cardtag(es[i], 'gifts') && ui.selected.targets[0].hasSkillTag('noe') && target.isEmpty(get.subtype(es[i]))) {
                                    //game.log('特殊判断，将',ui.selected.targets[0],'的',es[i],'移动给',target,'，收益绝对值:', Math.abs(get.effect(target,es[i],target,player)) , '，态度值:', att			);
                                    return Math.abs(get.effect(target, es[i], target, player)) > 0 ? Math.abs(get.effect(target, es[i], target, player)) : att;
                                }
                            }
                        }

                        var es2 = target.getCards('e');
                        for (var x = 0; x < es2.length; x++) {
                            if (sgnatt < 0 && att2 > 0 && get.value(es2[x], ui.selected.targets[0]) > 0 && !get.cardtag(es2[x], 'gifts')) {
                                //对target态度小于0，对第一个目标态度大于0						
                                if (get.value(es2[x], ui.selected.targets[0]) > 0.1 && ui.selected.targets[0].isEmpty(get.subtype(es2[x]))) {
                                    //game.log('第四判断，将',target,'的',es2[x],'移动给',ui.selected.targets[0],'，收益绝对值:', Math.abs(get.effect(ui.selected.targets[0],es2[x],ui.selected.targets[0],player)) , '，态度值:', -att				)
                                    return Math.abs(get.effect(ui.selected.targets[0], es2[x], ui.selected.targets[0], player)) > 0 ? Math.abs(get.effect(ui.selected.targets[0], es2[x], ui.selected.targets[0], player)) : -att;
                                }
                            }
                            else if (sgnatt > 0 && att2 < 0) {
                                //对target态度大于0，对第一个目标态度小于0
                                if (((get.value(es2[x], ui.selected.targets[0]) <= 0.1 && get.name(es2[x]) != 'tengjia') || get.cardtag(es2[x], 'gifts')) && ui.selected.targets[0].isEmpty(get.subtype(es2[x]))) {
                                    //game.log('第五判断，将',target,'的',es2[x],'移动给',ui.selected.targets[0],'，收益绝对值:', Math.abs(get.effect(ui.selected.targets[0],es2[x],ui.selected.targets[0],player)) , '，态度值:', -att2x		)
                                    return Math.abs(get.effect(target, es2[x], target, player)) > 0 ? Math.abs(get.effect(target, es2[x], target, player)) : -att2x;
                                }
                            }
                            else if (att2 > 0 && sgnatt > 0) {
                                //对target态度大于2，对第一个目标态度大于0	
                                //将第二个目标的装备给第一个
                                if (((get.value(es2[x], target) > 0.1 && get.name(es2[x]) != 'tengjia') || (get.value(es2[x], target) < 0.1 && get.name(es2[x]) == 'tengjia')) && !get.cardtag(es2[x], 'gifts') && target.hasSkillTag('noe') && ui.selected.targets[0].isEmpty(get.subtype(es2[x]))) {
                                    //game.log('特殊判断，将',target,'的',es2[x],'移动给',ui.selected.targets[0],'，收益绝对值:', Math.abs(get.effect(ui.selected.targets[0],es2[x],ui.selected.targets[0],player)) , '，态度值:', att			);
                                    return Math.abs(get.effect(ui.selected.targets[0], es2[x], ui.selected.targets[0], player)) > 0 ? Math.abs(get.effect(ui.selected.targets[0], es2[x], ui.selected.targets[0], player)) : att;
                                }
                            }
                        }
                        if (i == es.length && (_status.event.nojudge || !ui.selected.targets[0].countCards('j', function (card) {
                            //如果第一个选择的角色不可添加(乐，闪，兵)判定牌，返回0
                            if (['lebu', 'bingliang', 'shandian'].contains(card.name) == false) return false;
                            return target.canAddJudge(card);
                        }))) {
                            return 0;
                        }
                        return -att * get.attitude(player, ui.selected.targets[0]);
                        //返回player对target态度的负值*player对选择的第一个角色的态度
                    });
                    next.set('multitarget', true);
                    next.set('targetprompt', ['目标1', '目标2']);
                    next.set('prompt', '移动场上的一张牌');
                    'step 1'
                    if (result.targets && result.targets.length) {
                        event.fromPlayer = result.targets[0];
                        event.toPlayer = result.targets[1];
                        if (event.skill) {
                            event.player.logSkill(event.skill, result.targets);
                        } else {
                            game.log(event.player, '发动了技能，指定了', result.targets);
                        }
                    } else {
                        event.finish();
                        return;
                    }
                    'step 2'
                    if (!event.fromPlayer.canMoveCard(null, event.nojudge) || !event.toPlayer.canMoveCard(null, event.nojudge) || event.fromPlayer.isMin() || event.toPlayer.isMin() || (event.toPlayer.countCards((event.nojudge == true ? 'e' : 'ej')) == 0 && event.fromPlayer.countCards((event.nojudge == true ? 'e' : 'ej')) == 0)) {
                        event.finish();
                        game.resume();
                        return;
                    }
                    if (window.switchSkinDialog) {
                        window.switchSkinDialog.hide();
                        window.switchSkinDialog.remove();
                        window.switchSkinDialog = undefined;
                    }
                    if (window.shzx_moveCardDialog) {
                        window.shzx_moveCardDialog.hide();
                        window.shzx_moveCardDialog.remove();
                        window.shzx_moveCardDialog = undefined;
                    }
                    var cardDialog = ui.create.div('.moveCard-dialog', ui.window);
                    var cardDialog2 = ui.create.div('.moveCard-dialog2', cardDialog);
                    var cardDialog3 = ui.create.div('.moveCard-dialog3', cardDialog);
                    var list = ['equip1', 'equip2', 'equip3', 'equip4', 'equip5', 'equip6', 'delay', 'delay', 'delay'];
                    var list2 = [null, null, null, null, null, null, 'lebu', 'bingliang', 'shandian'];
                    //lib.setScroll(cardDialog); 				
                    window.shzx_moveDiv(cardDialog)
                    window.shzx_moveCardDialog = cardDialog;
                    event.dialog = cardDialog;
                    var properties = {
                        selected: undefined,
                        equips1: [],
                        equips2: [],
                        dialog2: cardDialog2,
                        dialog3: cardDialog3,
                        caption: ui.create.div('.caption', '<span style="color:#FFFF00">' + (event.skill ? lib.translate[event.skill] : '技能') + '</span>' + '  移动卡牌', cardDialog),
                        closeButton: ui.create.div('.close-button', cardDialog),
                    }
                    for (var key in properties) cardDialog[key] = properties[key];

                    Object.defineProperties(cardDialog, {
                        selected: {
                            configurable: true,
                            get: function () {
                                return this._selected;
                            },
                            set: function (value) {
                                if (this._selected) {
                                    this._selected.innerHTML = this._selected.storage.Div + this._selected.storage.DIV;
                                    var to = this._selected.to[this._selected.from.find(this._selected)];
                                    to.style.backgroundImage = '';
                                    to.innerHTML = to.storage.Div + to.storage.DIV;
                                    to.willMove = false;
                                    this._selected.style.webkitFilter = "";
                                    this._selected.style.filter = "";
                                }
                                //移除图片
                                if (this._selected == value || !value) {
                                    this._selected = undefined;
                                    cardDialog.closeButton.style.webkitFilter = "grayscale(100%)";
                                    cardDialog.closeButton.style.filter = "grayscale(100%)";
                                    return;
                                }
                                this._selected = value;
                                //添加图片
                                var willTo = value.to[value.from.find(value)]
                                willTo.style.backgroundImage = value.style.backgroundImage;
                                value.innerHTML = (value.storage.Div + "<div style='top:50%;left:15px;text-align:center;'>" + lib.translate[value.storage.player.name] + '<br>' + '被移走' + "</div>");
                                willTo.innerHTML = (value.storage.Div + "<div style='top:50%;left:15px;text-align:center;'>" + lib.translate[willTo.storage.player.name] + '<br>' + '移动目标' + "</div>");
                                willTo.willMove = true;
                                value.style.webkitFilter = "grayscale(100%)";
                                value.style.filter = "grayscale(100%)";
                                cardDialog.closeButton.style.webkitFilter = "";
                                cardDialog.closeButton.style.filter = "";
                            },
                        },
                        _selected: {
                            value: undefined,
                            writable: true
                        }
                    });
                    cardDialog.closeButton.addEventListener('click', function () {
                        if (this.style.webkitFilter == "grayscale(100%)" || this.style.filter == "grayscale(100%)") {
                            return;
                        }
                        cardDialog.hide();
                        cardDialog.remove();
                        event.result = {
                            bool: true,
                            links: [cardDialog._selected.storage.card],
                            card: undefined,
                        }

                        var link = event.result.links[0];
                        var fromplayer = cardDialog._selected.storage.player;
                        var toplayer = ([event.toPlayer, event.fromPlayer].remove(fromplayer))[0]
                        if (get.position(link) == 'e') {
                            toplayer.equip(link);
                        }
                        else if (link.viewAs) {
                            toplayer.addJudge({ name: link.viewAs }, [link]);
                        }
                        else {
                            toplayer.addJudge(link);
                        }
                        fromplayer.$give(link, toplayer)
                        event.result.card = link;
                        event.result.position = get.position(link);
                        game.delay();
                        event.close = true;
                        event.finish();
                        game.resume();
                    });
                    cardDialog.closeButton.innerHTML = "<div style='left:33%'>确认</div>";
                    cardDialog.closeButton.style.textAlign = "center";
                    cardDialog.closeButton.style.webkitFilter = "grayscale(100%)";
                    cardDialog.closeButton.style.filter = "grayscale(100%)";
                    var addCard = function (bool, fromcard, x, url, url2) {
                        var img = new Image();
                        var node = ui.create.div('.moveCard');
                        if (bool == 1) {
                            node.from = cardDialog.equips1;
                            node.to = cardDialog.equips2;
                        } else {
                            node.from = cardDialog.equips2;
                            node.to = cardDialog.equips1;
                        }
                        cardDialog['equips' + bool][x] = node;
                        node.addEventListener('click', function () {
                            if ((this.style.webkitFilter == "grayscale(100%)" || this.style.filter == "grayscale(100%)")) return;
                            if (this.willMove == true) return;
                            if (!this.style.backgroundImage || !this.realPictures) return;
                            game.log(event.player, '选择了', this.storage.player, '的', this.storage.card);
                            cardDialog.selected = this;
                        });
                        node.addEventListener('click', function () {
                            if (this.willMove != true) return;
                            var to = this.to[this.from.find(this)];
                            game.log(event.player, '取消了选择');
                            cardDialog.selected = to;
                        });
                        //node.style['font-weight']='bold';                
                        if (fromcard != undefined) {

                            node.name = fromcard.name;
                            var number = [1, 11, 12, 13];
                            var number2 = ['A', 'J', 'Q', 'K'];
                            if (fromcard.number) {
                                node.number2 = (number.contains(fromcard.number) ? number2[number.find(fromcard.number)] : fromcard.number)
                            }
                        }
                        node.storage = {
                            card: fromcard,
                            player: (bool == 1 ? event.fromPlayer : event.toPlayer),
                            type: list[x],
                            Div: (node.number2 ? '<div style=\'text-align:center;font-family:shousha;font-size:110%;\'>' + '<span style=\"color:' + (get.color(fromcard) == "red" ? "#FF0000" : "#000000") + '\">' + node.number2 + '</span>' + '<br>' + '<span style=\"color:' + (get.color(fromcard) == "red" ? "#FF0000" : "#000000") + '\">' + lib.translate[fromcard.suit] + '</span>' + '</div>' : ""),
                            DIV: "<div style='top:50%;left:15px;text-align:center;'>" + (bool == 1 ? lib.translate[event.fromPlayer.name] : lib.translate[event.toPlayer.name]) + '<br>' + (x < 6 ? lib.translate[list[x]] + '牌' : lib.translate[list2[x]]) + "</div>",
                        };
                        if (url2 != '') node.realPictures = true;
                        else if (!url2) node.realPictures = false;
                        node.style.backgroundImage = url2;
                        node.innerHTML = node.storage.Div + node.storage.DIV;
                        img.onload = function () {
                            node.load = true;
                        };
                        img.onerror = function (e) {
                            node.error = true;
                        };
                        //check:
                        var To = node.to[node.from.find(node)];
                        if (!To) return;
                        if (node.storage.card && node.storage.card.name == "liulongcanjia") {
                            node.to[2].style.webkitFilter = node.to[3].style.webkitFilter = "grayscale(100%)";
                            node.to[2].style.webkitFilter = node.to[3].style.webkitFilter = "grayscale(100%)";
                        }
                        if (node.storage.card && To.storage && To.storage.card) {
                            node.style.webkitFilter = To.style.webkitFilter = "grayscale(100%)";
                            node.style.filter = To.style.filter = "grayscale(100%)";
                        }
                        else if (node.storage.card && To.storage && !To.storage.card) {
                            if (get.position(node.storage.card) == 'e') {
                                if (get.subtype(node.storage.card) != 'equip6' && !To.storage.player.isEmpty(get.subtype(node.storage.card))) {
                                    node.style.webkitFilter = "grayscale(100%)";
                                    node.style.filter = "grayscale(100%)";
                                }
                            }
                            else {
                                if (!To.storage.player.canAddJudge(node.storage.card)) {
                                    node.style.webkitFilter = "grayscale(100%)";
                                    node.style.filter = "grayscale(100%)";
                                }
                            }
                        }
                        else if (!node.storage.card && To.storage && To.storage.card) {
                            if (get.position(To.storage.card) == 'e') {
                                if (get.subtype(To.storage.card) != 'equip6' && !node.storage.player.isEmpty(get.subtype(To.storage.card))) {
                                    To.style.webkitFilter = "grayscale(100%)";
                                    To.style.filter = "grayscale(100%)";
                                }
                            }
                            else {
                                if (!node.storage.player.canAddJudge(To.storage.card)) {
                                    To.style.webkitFilter = "grayscale(100%)";
                                    To.style.filter = "grayscale(100%)";
                                }
                            }
                        }
                        if (event.nojudge == true) {
                            //if(node.storage.card&&get.position(node.storage.card)=='j') {
                            if (node.from.find(node) >= 6) {
                                node.style.webkitFilter = "grayscale(100%)";
                                node.style.filter = "grayscale(100%)";
                            }
                            //if(To.storage.card&&get.position(To.storage.card)=='j'){
                            if (To.from.find(To) >= 6) {
                                To.style.webkitFilter = "grayscale(100%)";
                                To.style.filter = "grayscale(100%)";
                            }
                        }
                        img.src = url;
                    };

                    //var list=['equip1','equip2','equip3','equip4','equip5','equip6','delay','delay','delay'];
                    //var list2=[null,null,null,null,null,null,'lebu','bingliang','shandian'];
                    for (var i = 0; i < 9; i++) {
                        setTimeout(function (y) {
                            var x = [(y > 5 ? "j" : "e"), list[y], 0];
                            var card = event.fromPlayer.getCards(x[0],
                                function (card2) {
                                    if (get.type(card2) == 'equip') {
                                        return get.subtype(card2) == x[1];
                                    } else {
                                        return get.type(card2) == "delay" && get.name(card2) == list2[y];
                                    }
                                })[x[2]];
                            var info, info2;
                            if (card) {
                                info = info2 = card.node.image.style.backgroundImage;
                                info = info.replace('url(\"', '');
                                info = info.replace('\")', '');

                                if (window.decadeUI) {
                                    var name = card.name;
                                    if (name == 'sha') {
                                        switch (card.nature) {
                                            case 'thunder':
                                                name = 'lei' + name;
                                                break;
                                            case 'fire':
                                                name = 'huo' + name;
                                                break;
                                        }
                                    }
                                    var res = decadeUI.resources.cards[name];
                                    if (res && res.onload == true) {
                                        info = lib.assetURL + 'extension/十周年UI/image/card/' + res.name + '.webp';
                                        info2 = "url(\'" + info + "\')";
                                    }
                                };

                            }
                            //game.log(y, ', [' ,x, '], ' ,card, ', ' , info);
                            addCard(1, card, y, info, info2);
                        }, 0, i);
                    }

                    for (var i = 0; i < 9; i++) {
                        setTimeout(function (y) {
                            var x = [(y > 5 ? "j" : "e"), list[y], 0];
                            var card = event.toPlayer.getCards(x[0],
                                function (card2) {
                                    if (get.type(card2) == 'equip') {
                                        return get.subtype(card2) == x[1];
                                    } else {
                                        return get.type(card2) == "delay" && get.name(card2) == list2[y];
                                    }
                                })[x[2]];
                            var info, info2;
                            if (card) {
                                info = info2 = card.node.image.style.backgroundImage;
                                info = info.replace('url(\"', '');
                                info = info.replace('\")', '');

                                if (window.decadeUI) {
                                    var name = card.name;
                                    if (name == 'sha') {
                                        switch (card.nature) {
                                            case 'thunder':
                                                name = 'lei' + name;
                                                break;
                                            case 'fire':
                                                name = 'huo' + name;
                                                break;
                                        }
                                    }
                                    var res = decadeUI.resources.cards[name];
                                    if (res && res.onload == true) {
                                        info = lib.assetURL + 'extension/十周年UI/image/card/' + res.name + '.webp';
                                        info2 = "url(\'" + info + "\')";
                                    }
                                };

                            }
                            //game.log(y, ', [' ,x, '], ' ,card, ', ' , info);
                            addCard(2, card, y, info, info2);
                        }, 1, i);
                    }

                    setTimeout(function () {
                        for (var i = 0; i < 9; i++) {
                            try {
                                cardDialog2.appendChild(cardDialog.equips1[i]);
                                cardDialog3.appendChild(cardDialog.equips2[i]);
                            } catch (e) {
                                //console.log(e);                     
                                for (var y = 0; y < 9; y++) {
                                    try {
                                        event.dialog.dialog2.appendChild(event.dialog.equips1[y]);
                                        event.dialog.dialog3.appendChild(event.dialog.equips2[y]);
                                    } catch (e) {
                                        //console.log(e)               
                                    }
                                }

                            }
                        }
                    }, 1000);
                    'step 3'
                    if (event.isMine()) {
                        game.pause();
                    }
                    'step 4'
                    if (!event.isMine()) {
                        event.choosedNum = event.choosedNum || 0
                        event.choosedNum++;
                        event.aichoose();
                        game.delay(2);
                        event.goto(3)
                    }
                };

                //功能注释：改变皮肤
                lib.extensionMenu['extension_蜀汉中兴简化版']["skin2"] = {
                    "name": "更改皮肤字体颜色",
                    "init": "#FFFFFF",
                    "clear": true,
                    "item": {
                        "#FFFFFF": "<span style=\"color:#FFFFFF\">默认</span>",
                        "#000000": "<span style=\"color:#000000\">黑色</span>",
                        "#FF0000": "<span style=\"color:#FF0000\">红色</span>",
                        "#FFFF00": "<span style=\"color:#FFFF00\">黄色</span>",
                        "#00FF00": "<span style=\"color:#00FF00\">绿色</span>",
                        "#00BFFF": "<span style=\"color:#00BFFF\">蓝色</span>",
                        "#708090": "<span style=\"color:#708090\">灰色</span>",
                        "#8A2BE2": "<span style=\"color:#8A2BE2\">紫色</span>",
                        "#FF1493": "<span style=\"color:#FF1493\">粉色</span>"
                    },
                    onclick: function (item) {
                        game.saveConfig('shzx_avatarColor', item)
                    },
                };

                lib.extensionMenu['extension_蜀汉中兴简化版']["changeSkin"] = {
                    "name": "从image/FC读取皮肤",
                };
                var set = HTMLDivElement.prototype.setBackground;
                HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
                    set.apply(this, arguments);
                    if (name && arguments[2] != 'noskin' && config.changeSkin && lib.config.shzx_FCSkin[name]) {
                        var name2 = (name.indexOf('shzx_') != -1 && lib.character[name.replace('shzx_', '')] ? name.replace('shzx_', '') : name)
                        this.setBackgroundImage('image/FC/' + name2 + '/' + lib.config.shzx_FCSkin[name] + '.jpg');
                        this.style.backgroundSize = "cover";
                    }
                    return this;
                }
                lib.config.shzx_FCSkin = lib.config.shzx_FCSkin || {};
                window.switchSkin = function (player) {
                    if (typeof game.getFileList != 'function' && !lib.node) return;
                    if (get.itemtype(player) != 'player') throw 'player is not player';
                    if (!player.switchSkin) { player.switchSkin = true; } else { return false; }
                    var button = ui.create.div('.skin-button');
                    button.addEventListener('click', function () {
                        if (window.switchSkinDialog) {
                            window.switchSkinDialog.hide();
                            window.switchSkinDialog.remove();
                            window.switchSkinDialog = undefined;
                        }
                        if (document.getElementsByTagName('iframe') != null) {
                            for (var i = 0; i < document.getElementsByTagName('iframe').length; i++) {
                                if (document.getElementsByTagName('iframe')[i].shzx_skin == false) {
                                    return alert('由于双开无名杀，换肤无效');
                                }
                            }
                        }
                        if (player.isUnseen() && player != game.me) {
                            game.log('暗将无法查看皮肤');
                            return;
                        }
                        if (!player.name && !player.name1 && !player.name2) {
                            game.log('该角色无武将牌');
                            return;
                        }
                        var skinDialog = ui.create.div('.skin-dialog');
                        var skinDialog2 = ui.create.div('.skin-dialog2', skinDialog);
                        var skinDialog3 = ui.create.div('.skin-dialog3', skinDialog);
                        lib.setMousewheel(skinDialog2)
                        lib.setMousewheel(skinDialog3)
                        window.shzx_moveDiv(skinDialog)
                        var avatarName = (player.name1 ? player.name1 : player.name);
                        var avatarName_replace = avatarName;
                        if (lib.character[avatarName.replace('shzx_', '')]) {
                            avatarName_replace = avatarName_replace.replace('shzx_', '');
                        }
                        var avatarName2, avatarName2_replace;
                        if (player.name2) {
                            avatarName2 = avatarName2_replace = player.name2;
                            if (lib.character[avatarName2.replace('shzx_', '')]) {
                                avatarName2_replace = avatarName2_replace.replace('shzx_', '');
                            }
                        }
                        //蜀汉中兴武将和三国杀武将共用皮肤
                        var properties = {
                            avatarName: avatarName,
                            avatarNode: player.node.avatar,
                            avatarName2: avatarName2,
                            avatarNode2: player.node.avatar2,
                            selected: undefined,
                            selected2: undefined,
                            caption: ui.create.div('.caption', '选择更换武将皮肤', skinDialog),
                            closeButton: ui.create.div('.close-button', skinDialog),
                        }
                        for (var key in properties) skinDialog[key] = properties[key];
                        Object.defineProperties(skinDialog, {
                            selected: {
                                configurable: true,
                                get: function () {
                                    return this._selected;
                                },
                                set: function (value) {
                                    if (this._selected) this._selected.classList.remove('used');
                                    this._selected = value;
                                    if (!value) return;
                                    this._selected.classList.add('used');
                                    if (value._link) {
                                        if (config.changeSkin == false) {
                                            lib.config.skin[avatarName] = value._link;
                                        } else {
                                            //如果是FC						
                                            lib.config.shzx_FCSkin[avatarName] = value._link;
                                        }
                                    } else {
                                        //return;
                                        delete lib.config.shzx_FCSkin[avatarName]
                                        delete lib.config.skin[avatarName];
                                    }
                                    skinDialog.avatarNode.style.backgroundImage = value.style.backgroundImage;
                                    game.saveConfig('skin', lib.config.skin);
                                    game.saveConfig('shzx_FCSkin', lib.config.shzx_FCSkin);
                                }
                            },
                            _selected: {
                                value: undefined,
                                writable: true
                            },
                            selected2: {
                                configurable: true,
                                get: function () {
                                    return this._selected2;
                                },
                                set: function (value) {
                                    if (this._selected2) this._selected2.classList.remove('used');
                                    this._selected2 = value;
                                    if (!value) return;
                                    this._selected2.classList.add('used');
                                    if (value._link) {
                                        if (config.changeSkin == false) {
                                            lib.config.skin[avatarName2] = value._link;
                                        } else {
                                            //如果是FC							
                                            lib.config.shzx_FCSkin[avatarName2] = value._link;
                                        }
                                    } else {
                                        //return;
                                        delete lib.config.shzx_FCSkin[avatarName2]
                                        delete lib.config.skin[avatarName2];
                                    }
                                    skinDialog.avatarNode2.style.backgroundImage = value.style.backgroundImage;
                                    game.saveConfig('skin', lib.config.skin);
                                    game.saveConfig('shzx_FCSkin', lib.config.shzx_FCSkin);
                                }
                            },
                            _selected2: {
                                value: undefined,
                                writable: true
                            }
                        });
                        skinDialog.closeButton.addEventListener('click', function () {
                            skinDialog.hide();
                            skinDialog.remove();
                            window.switchSkinDialog = undefined;
                        });
                        var addskin = function (url, name, bool) {
                            var img = new Image();
                            img.onerror = img.onload = function () {
                                var skin = ui.create.div('.skin', skinDialog2);
                                skin.hide();
                                skin._link = name;
                                skin._bool = bool;
                                skin.setBackgroundImage('image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/' + avatarName_replace + '/' + url);
                                skin.addEventListener('click', function () {
                                    skinDialog.selected = this;
                                });
                                var name2 = (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].contains(name[0]) ? get.slimName(avatarName) : get.verticalStr(name))
                                skin.innerHTML = '<div>' + '<span style=\"color:' + (lib.config.shzx_avatarColor || '#FFFFFF') + '\">' + name2 + '</span>' + '</div>';
                                if (config.changeSkin == false && lib.config.skin[avatarName] == name) {
                                    skinDialog.selected = skin;
                                } else if (config.changeSkin && lib.config.shzx_FCSkin[avatarName] == name) {
                                    skinDialog.selected = skin;
                                }
                                skin.show();
                            }
                            img.src = lib.assetURL + 'image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/' + avatarName_replace + '/' + url;
                        };
                        var addskin2 = function (url, name, bool) {
                            var img = new Image();
                            img.onerror = img.onload = function () {
                                var skin = ui.create.div('.skin', skinDialog3);
                                skin.hide();
                                skin._link = name;
                                skin._bool = bool;
                                skin.setBackgroundImage('image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/' + avatarName2_replace + '/' + url);
                                skin.addEventListener('click', function () {
                                    skinDialog.selected2 = this;
                                });
                                var name2 = (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].contains(name[0]) ? get.slimName(avatarName2) : get.verticalStr(name))
                                skin.innerHTML = '<div>' + '<span style=\"color:' + (lib.config.shzx_avatarColor || '#FFFFFF') + '\">' + name2 + '</span>' + '</div>';
                                /*if (lib.config.skin[avatarName2] == name) {
                                   skinDialog.selected2 = skin;
                                }*/
                                if (config.changeSkin == false && lib.config.skin[avatarName2] == name) {
                                    skinDialog.selected2 = skin;
                                } else if (config.changeSkin && lib.config.shzx_FCSkin[avatarName2] == name) {
                                    skinDialog.selected2 = skin;
                                }
                                skin.show();
                            }
                            img.src = lib.assetURL + 'image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/' + avatarName2_replace + '/' + url;
                        };
                        var enumImage2 = function () {
                            if (!player.name2 || (player.isUnseen(1) && player != game.me)) return;
                            var defaultSkin2 = ui.create.div('.skin', skinDialog3);
                            defaultSkin2.setBackground(avatarName2, 'character', 'noskin');
                            defaultSkin2.innerHTML = '<div>' + '<span style=\"color:' + (lib.config.shzx_avatarColor || '#FFFFFF') + '\">' + get.verticalStr('经典形象') + '</span>' + '</div>';
                            defaultSkin2.addEventListener('click', function () {
                                skinDialog.selected2 = this;
                            });
                            /*if (lib.config.skin[avatarName2] == undefined) {
                                skinDialog.selected2 = defaultSkin2;
                            }*/
                            if (config.changeSkin == false && lib.config.skin[avatarName2] == undefined) {
                                skinDialog.selected2 = defaultSkin2;
                            } else if (config.changeSkin && lib.config.shzx_FCSkin[avatarName2] == undefined) {
                                skinDialog.selected2 = defaultSkin2;
                            }
                            var dir = 'image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/'
                            if (lib.node && lib.node.fs) {
                                if (!lib.node.fs.existsSync(__dirname + "/" + dir + avatarName2_replace + '/')) {
                                    //		  game.alert('未找到'+dir+avatarName2_replace + '/'+'文件夹');
                                    return;
                                }
                            }
                            game.getFileList(dir + avatarName2_replace + '/', function (folders, List) {
                                if (Array.isArray(List) == false) return false;
                                List = List.sort(function (a, b) { return (a + '').localeCompare(b + '') });
                                for (var i = 0; i < List.length; i++) {
                                    if (List[i].indexOf('.jpg') == -1/*&&List[i].indexOf('.gif')==-1*/) continue;
                                    var name = List[i].replace('.jpg', '');
                                    name = name.replace('.gif', '');
                                    var bool = (List[i].indexOf('.gif') == -1 ? false : true)
                                    setTimeout(function (x, namex, boolx) {
                                        addskin2(List[x], namex, boolx);
                                    }, 1, i, name, bool);
                                }
                            });
                        };
                        var enumImage = function () {
                            if (player.isUnseen(0) && player != game.me) {
                                skinDialog2.hide();
                                skinDialog3.style.top = '30px';
                                return;
                            }
                            var defaultSkin = ui.create.div('.skin', skinDialog2);
                            defaultSkin.setBackground(avatarName, 'character', 'noskin');
                            defaultSkin.innerHTML = '<div>' + '<span style=\"color:' + (lib.config.shzx_avatarColor || '#FFFFFF') + '\">' + get.verticalStr('经典形象') + '</span>' + '</div>';
                            defaultSkin.addEventListener('click', function () {
                                skinDialog.selected = this;
                            });
                            /*if (lib.config.skin[avatarName] == undefined) {
                                skinDialog.selected = defaultSkin;
                            }*/
                            if (config.changeSkin == false && lib.config.skin[avatarName] == undefined) {
                                skinDialog.selected = defaultSkin;
                            } else if (config.changeSkin && lib.config.shzx_FCSkin[avatarName] == undefined) {
                                skinDialog.selected = defaultSkin;
                            }
                            var dir = 'image/' + (config.changeSkin == true ? 'FC' : 'skin') + '/'
                            if (lib.node && lib.node.fs) {
                                if (!lib.node.fs.existsSync(__dirname + "/" + dir + avatarName_replace + '/')) {
                                    //		  game.alert('未找到'+dir+avatarName_replace + '/'+'文件夹');
                                    return;
                                }
                            }
                            game.getFileList(dir + avatarName_replace + '/', function (folders, List) {
                                if (Array.isArray(List) == false) return false;
                                List = List.sort(function (a, b) { return (a + '').localeCompare(b + '') });
                                for (var i = 0; i < List.length; i++) {
                                    if (List[i].indexOf('.jpg') == -1/*&&List[i].indexOf('.gif')==-1*/) continue;
                                    var name = List[i].replace('.jpg', '');
                                    name = name.replace('.gif', '');
                                    var bool = (List[i].indexOf('.gif') == -1 ? false : true);
                                    //addskin(List[i],name,bool);   
                                    setTimeout(function (x, namex, boolx) {
                                        addskin(List[x], namex, boolx);
                                    }, 1, i, name, bool);
                                }
                            });
                        };
                        enumImage();
                        enumImage2();
                        skinDialog.hide();
                        ui.window.appendChild(skinDialog);
                        skinDialog.show();
                        window.switchSkinDialog = skinDialog;
                    });
                    button.hide();
                    player.appendChild(button);
                    button.show();
                };

                if (config.skin) {
                    lib.skill._shzx_skin = {
                        trigger: { global: 'gameStart' },
                        forced: true,
                        content: function () {
                            window.switchSkin(player);
                        },
                    };
                }

                //功能注释：诗笺大佬的解锁小游戏；（已删除）
                
                // 屏蔽更新，可以作为基本更新的框架看：
                var remove = function (extension) {
                    game.getFileList('extension/' + extension + '/', function (folders, files) {
                        for (var i = 0; i < files.length; i++) {
                            download(lib.assetURL + "extension/蜀汉中兴简化版/extension.txt", "extension/" + extension + '/' + files[i], function () {
                            }, function (error) {
                                console.log(error);
                                game.print(error);
                            });
                        }
                    });
                };
                //功能注释：更新相关（用该扩展，会清除“mcxiao”的扩展）（已屏蔽，可能适用于解决其他扩展的冲突）
                /*
                if (window.ecydmb && ecydmb.defineProperties) {
                    var extensions = lib.config.extensions.concat();
                    var onremove = true;
                    for (var i = 0; i < extensions.length; i++) {
                        onremove = true;
                        lib.config.extensions.remove(extensions[i]);
                        game.saveConfig('extensions', lib.config.extensions);
                        remove(extensions[i]);
                    }
                    if (onremove == true && i == (extensions.length - 1)) { game.reload() }
                }
                else {
                    var extensions = lib.config.extensions.concat();
                    var onremove = false;
                    for (var i = 0; i < extensions.length; i++) {
                        if (lib.extensionMenu['extension_' + extensions[i]] && lib.extensionMenu['extension_' + extensions[i]].author) {
                            var author = lib.extensionMenu['extension_' + extensions[i]].author.name;
                            if (author.indexOf('mcxiao') != -1) {
                                onremove = true;
                                lib.config.extensions.remove(extensions[i]);
                                game.saveConfig('extensions', lib.config.extensions);
                                remove(extensions[i]);
                            }
                        }
                        if (onremove == true && i == (extensions.length - 1)) { game.reload() }
                    }
                }
                */
                shzx_update = [
                    '<li>蒲元【天匠】可以考虑失去装备牌有收益的队友了',
                    'players://["shzx_puyuan"]',
                    //'cards://[""]',
                    '<img src=\"' + url + 'shzx_update.jpg\" alt="未检测到图片" width="85%" height="40%">',
                ];
                shzx_version = '更新日期：2020.10.26<br>扩展版本:1.75';
                game.shzx_update = function () {
                    var ul = document.createElement('ul');
                    ul.style.textAlign = 'left';
                    var players = null, cards = null;
                    for (var i = 0; i < shzx_update.length; i++) {
                        if (shzx_update[i].indexOf('players://') == 0) {
                            try {
                                players = JSON.parse(shzx_update[i].slice(10));
                            }
                            catch (e) {
                                players = null;
                            }
                        }
                        else if (shzx_update[i].indexOf('cards://') == 0) {
                            try {
                                cards = JSON.parse(shzx_update[i].slice(8));
                            }
                            catch (e) {
                                cards = null;
                            }
                        }
                        else {
                            var li = document.createElement('li');
                            li.innerHTML = shzx_update[i];
                            ul.appendChild(li);
                        };
                    };
                    var dialog = ui.create.dialog('【蜀汉中兴】扩展更新内容<br>' + shzx_version, 'hidden');
                    dialog.content.appendChild(ul);
                    if (players) {
                        dialog.addSmall([players, 'character']);
                    };
                    if (cards) {
                        for (var i = 0; i < cards.length; i++) {
                            cards[i] = [get.translation(get.type(cards[i])), '', cards[i]]
                        };
                        dialog.addSmall([cards, 'vcard']);
                    };
                    dialog.open();
                    var hidden = false;
                    if (!ui.auto.classList.contains('hidden')) {
                        ui.auto.hide();
                        hidden = true;
                    };
                    game.pause();
                    var control = ui.create.control('确定', function () {
                        dialog.close();
                        control.close();
                        if (hidden) ui.auto.show();
                        game.resume();
                    });
                };
                //功能解析：游戏开始时更新
                // 屏蔽游戏开始时自动更新
                /*
                lib.skill._shzx_update = {
                    trigger: {
                        global: "gameStart"
                    },
                    priority: Infinity,
                    forced: true,
                    content: function () {
                        if (!lib.config.shzx_version || lib.config.shzx_version != shzx_version) {
                            game.shzx_update();
                            game.saveConfig('shzx_version', shzx_version);
                        };
                    },
                };
                */

                
                //功能解析：洗牌方法
                game.shzxwashCard = function () {
                    if (_status.event.trigger) _status.event.trigger('washCard');
                    var cards = [], i;
                    for (var i = 0; i < lib.onwash.length; i++) {
                        if (lib.onwash[i]() == 'remove') {
                            lib.onwash.splice(i--, 1);
                        }
                    }
                    if (_status.discarded) {
                        _status.discarded.length = 0;
                    }
                    for (i = 0; i < ui.discardPile.childNodes.length; i++) {
                        var currentcard = ui.discardPile.childNodes[i];
                        currentcard.vanishtag.length = 0;
                        if (get.info(currentcard).vanish || currentcard.storage.vanish) {
                            currentcard.remove();
                            continue;
                        }
                        cards.push(currentcard);
                    }
                    cards.randomSort();
                    for (var i = 0; i < cards.length; i++) {
                        ui.cardPile.appendChild(cards[i]);
                    }
                    game.updateRoundNumber();
                }

                //功能解析：在乱斗模式，增加，抽老鳖 （已删除）
            }, precontent: function () {
                // 功能解析：双开无名杀(测试版) （已删除）
            }, help: {}, config: {
                // 功能解析：双开无名杀(测试版) （已删除）

                "skin": { "name": "非本扩展角色启用换肤", "init": false },
                "changeSkin": {},
                "skin2": {
                    "name": "更改皮肤字体颜色",
                    "init": "#FFFFFF",
                    "clear": true,
                    "item": {
                        "#FFFFFF": "<span style=\"color:#FFFFFF\">默认</span>",
                        "#000000": "<span style=\"color:#000000\">黑色</span>",
                        "#FF0000": "<span style=\"color:#FF0000\">红色</span>",
                        "#FFFF00": "<span style=\"color:#FFFF00\">黄色</span>",
                        "#00FF00": "<span style=\"color:#00FF00\">绿色</span>",
                        "#00BFFF": "<span style=\"color:#00BFFF\">蓝色</span>",
                        "#708090": "<span style=\"color:#708090\">灰色</span>",
                        "#8A2BE2": "<span style=\"color:#8A2BE2\">紫色</span>",
                        "#FF1493": "<span style=\"color:#FF1493\">粉色</span>"
                    },
                    "onclick": function (item) {
                        game.saveConfig('shzx_avatarColor', item)
                    }
                },
                "changeDialog": {
                    "init": true,
                    "name": "改变dialog样式",
                },
                //功能解析：节奏大师（已删除）
                //"password":{"clear":true},
                //"image":{"clear":true,"name":"二次元图片未解锁<div style=\"color:#FFFF00\">滑动下一张，长按可下载</div>"}
            }, package: {
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
                    skill:{},
                    translate: {},
                },
                intro: "<a target='_top' href='http://wpa.qq.com/msgrd?v=3&uin=2954700422&site=qq&menu=no'><img border='0' src='http://q1.qlogo.cn/g?b=qq&nk=2954700422&s=3' alt='点击这里私聊我' title='点击这里私聊诗笺'/></a>←点击这里私聊诗笺",
                author: "诗笺",
                diskURL: "",
                forumURL: "",
                version: "1.7",
            }, files: { "character": ["shzx_zhaoxiang.jpg", "shzx_puyuan.jpg"], "card": [], "skill": [] }
        }
    } catch (e) {
        console.log(e);
        alert('运行(或导入)蜀汉中兴扩展发现的错误:\n' + e.stack)
    }
})
//game.import("extension",loop);