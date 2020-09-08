declare var _status:Status;
interface Status {
    paused:boolean,
    paused2:boolean,
    paused3:boolean,
    over:boolean,
    clicked:boolean,
    auto:boolean,

    /** 【核心】游戏当前事件 */
    event:GameEvent;
    
    ai:any,
    lastdragchange:any[],
    skillaudio:any[],
    dieClose:any[],
    dragline:any[],

    /** 当前处于濒死状态的，濒死玩家列表 */
    dying:Player[];

    /** 当前可以点击按钮选择 */
    imchoosing:boolean;

    /** 当前是否可选择多个目标，用于UI处理，选择完一个目标时，继续触发game.ckeck检测剩余目标 */
    multitarget:boolean;

    /*  扩展成员  */

    /** 当前是否播放录像中 */
    video:boolean;
    /** delay延时游戏的setTimeout标记 */
    timeout:number;

    /** 当前播放的音乐 */
    currentMusic:string;

    /** 等待window.location.reload执行，在reload2中重置该标记 */
    waitingToReload:boolean;

    /** 当前的回合阶段的玩家 */
    currentPhase:Player;

    /** 当前是否联机模式 */
    connectMode:boolean;

    /** 
     * 牌堆顶的一张牌 
     * 
     * 随game.updateRoundNumber()函数的运行实时更新
     */
    pileTop:Card;

    [key:string]:any;
}