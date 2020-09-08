module ZJNGEx {
    (function(){
        NG.Utils.importCurContent(this.ZJNGEx,"XSSP-0001",NG.ImportFumType.hero,
        
        function(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
            let output: DevCharacterData = { 
                name:"XSSP-0001",
                nickName:"测试人物1-xxx",
                character:  ["male","wei","3/4",[/* 技能列表 */"zj_shili_lianyu","zj_shenwei","zj_weirong"],[/* 图片信息 */'ZJNGEx'],['狱',4]],
                characterTitle:"xxxxxxx  势力:狱",
                characterIntro:"ZJ联盟杀的人物",
                skill:{
                    
                },
            }

            return output;
        });
    })();
}