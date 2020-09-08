module ZJNGEx {
        (function(){
            NG.Utils.importCurContent(this.ZJNGEx,"动态添加删除十周UI扩展",NG.ImportFumType.none,
            
            function(lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                
                //判断是否移除十周年UI扩展：
                //原因：网页版本存在奇怪的跨域原因，只能手动删除了;
                //目前两种处理方式：
                // 1.就是当前下面的处理方式，动态加进去；
                // 2.删除test的window.loadExtensionConfig配置，只配置lib.config.loadExtensionConfig，然后用我的index.html这样就只在非网页环境下运行；
                if(lib.device || typeof window.require=='function'){
                    // let loadExtensionConfig:string[] = window.loadExtensionConfig||lib.config.loadExtensionConfig;
                    // loadExtensionConfig.push("十周年UI");
                    if(!lib.extensionMenu["extension_十周年UI"]) {
                        lib.init.js(lib.assetURL + "extension/" + "十周年UI", "extension", function(){
                            // delete _status.windowLoaded;
                            // game.reload();
                        }, function(){
                            console.log("加载'十周年UI'失败！");
                        });
                    }
                } else {
                    if(lib.extensionMenu["extension_十周年UI"]) {
                        delete lib.extensionMenu["extension_十周年UI"];
                        alert("删除'十周年UI'重启！");
                        game.reload();
                    }
                }

                return null;
            });
        })();
    }