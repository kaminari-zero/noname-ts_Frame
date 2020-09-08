module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组14", NG.ImportFumType.none,
            //1.添加临时技：需要发动技能之后才能视为你拥有该效果，那么player.addTempSkill(技能名,'phaseAfter')//维持到当前回合结束
            //2.可通过init方法，设置某些特殊参数到player，event中，直接在添加技能，直接使用特殊参数条件

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //你的攻击距离没有限制
                let skill1: ExSkillData = {
                    mod:{
                        globalFrom:function(){
                            return -Infinity;
                        }
                    },
                };

                //你的手牌上限+X(X=现存[联盟杀势力（一般为玩家自身的）]数+1)
                let skill2:ExSkillData = {
                    maxHandcard:function(player: Player, num: number){ 
                        return num+get.getZJShaShiliCount(get.getZJShaShili(player)); 
                    },
                };
                
                let skill3: ExSkillData = {
                    
                };


                let output = {
                    
                }

                return output;
            });
    })();
}