// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 960;
var SCREEN_HEIGHT = 640;

var hi=0;
var int =90;
var player;
var anim;
var anim_e;
var speed=1.0;

var ASSETS = {
  // 画像
  image: {
    'chara': 'img/UnityChan.png',
    'uni': 'img/uni.png',
    'sky': 'img/BG_01.png',
    'ground': 'img/BG_02.png',
    'block':'img/block1.png'
  },
  sound: {
    'jump1': 'sound/jump1.wav',
    'jump2': 'sound/jump2.wav',
    'ouch': 'sound/ouch.wav',
    'start':'sound/start.wav'
  },
  // スプライトシート
  spritesheet: {
    'char_sprite': 'img/chara.tmss',
    'uni_sprite': 'img/uni.tmss'
  },
};

phina.define('Title', {
  superClass: 'DisplayScene',
  init: function(option) {
    this.superInit(option);
    var self=this;

    // 背景
    this.backgroundColor = 'skyblue';

    var bg =  DisplayElement().addChildTo(this);
    var e =  DisplayElement().addChildTo(this);
    var group =  DisplayElement().addChildTo(this);

    var shape = Shape().setSize(SCREEN_WIDTH,50).setPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT-25).addChildTo(bg);

    for(var i=0;i<2;i++){
      bg[i] = Sprite('sky', 256, 256).addChildTo(bg);
      bg[i].setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
      bg[i].setPosition(SCREEN_WIDTH/2+SCREEN_WIDTH*i,SCREEN_HEIGHT/2);
      bg[i].update=function(){
        this.x-=2.5;
        if(this.x==-SCREEN_WIDTH/2){
          this.x=SCREEN_WIDTH/2+SCREEN_WIDTH;
        }
      }
    }

    for(var i=0;i<2;i++){
      bg[i] = Sprite('ground', 256, 256).addChildTo(bg);
      bg[i].setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
      bg[i].setPosition(SCREEN_WIDTH/2+SCREEN_WIDTH*i,SCREEN_HEIGHT/2);
      bg[i].update=function(){
        this.x-=7.5;
        if(this.x==-SCREEN_WIDTH/2){
          this.x=SCREEN_WIDTH/2+SCREEN_WIDTH;
        }
      }
    }

    if(!localStorage.getItem('hi(unity)')){hi=0}
    else{hi = parseInt(localStorage.getItem('hi(unity)'),10);}

    Label({x:40,y:40,fill:'white',text:'スコア：0',align:'left',fontSize:40}).addChildTo(this);
    Label({x:SCREEN_WIDTH-40,y:40,fill:'white',text:'ハイスコア：'+hi,align:'right',fontSize:40}).addChildTo(this);
    Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2,fill:'white',stroke:'black',text:'ユニティラン',fontSize:40}).addChildTo(this);
    // スプライト画像作成
    player = Sprite('chara', 32, 32).addChildTo(group);
    // スプライトにフレームアニメーションをアタッチ
    anim = FrameAnimation('char_sprite').attachTo(player);
    anim.fit = false;
    player.setSize(256,256);
    // アニメーションを指定
    anim.gotoAndPlay('walk');

    // 初期位置
    player.x = SCREEN_WIDTH/5;
    player.bottom = SCREEN_HEIGHT;
  },

  onpointstart: function() {
    this.exit('main');
  }
});



phina.define('Main', {
  superClass: 'DisplayScene',
  init: function(option) {
    this.superInit(option);
    var self=this;
    var score=0;
    // 背景
    this.backgroundColor = 'skyblue';

    var bg =  DisplayElement().addChildTo(this);
    var e =  DisplayElement().addChildTo(this);
    var group =  DisplayElement().addChildTo(this);

    var shape = Shape().setSize(SCREEN_WIDTH,50).setPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT-25).addChildTo(bg);

    for(var i=0;i<2;i++){
      bg[i] = Sprite('sky', 256, 256).addChildTo(bg);
      bg[i].setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
      bg[i].setPosition(SCREEN_WIDTH/2+SCREEN_WIDTH*i,SCREEN_HEIGHT/2);
      bg[i].update=function(){
        this.x-=2.5;
        if(this.x<=-SCREEN_WIDTH/2){
          this.x=SCREEN_WIDTH/2+SCREEN_WIDTH;
        }
      }
    }

    for(var i=0;i<2;i++){
      bg[i] = Sprite('ground', 256, 256).addChildTo(bg);
      bg[i].setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
      bg[i].setPosition(SCREEN_WIDTH/2+SCREEN_WIDTH*i,SCREEN_HEIGHT/2);
      bg[i].update=function(){
        this.x-=7.5;
        if(this.x<=-SCREEN_WIDTH/2){
          this.x=SCREEN_WIDTH/2+SCREEN_WIDTH;
        }
      }
    }

    if(!localStorage.getItem('hi(unity)')){hi=0}
    else{hi = parseInt(localStorage.getItem('hi(unity)'),10);}

    label=Label({x:40,y:40,fill:'white',text:'スコア：0',align:'left',fontSize:40}).addChildTo(this);
    Label({x:SCREEN_WIDTH-40,y:40,fill:'white',text:'ハイスコア：'+hi,align:'right',fontSize:40}).addChildTo(this);

    // スプライト画像作成
    player = Sprite('chara', 32, 32).addChildTo(group);
    // スプライトにフレームアニメーションをアタッチ
    anim = FrameAnimation('char_sprite').attachTo(player);
    anim.fit = false;
    player.setSize(256,256);
    // アニメーションを指定
    anim.gotoAndPlay('walk');

    // 初期位置
    player.x = SCREEN_WIDTH/5;
    player.y = SCREEN_HEIGHT-100;
    //anim.ss.getAnimation('walk').frequency = 4;
    player.vy = -10;
    player.collider.setSize(64, 160).offset(0,0);


    player.update= function(app){
      // 下に移動
      this.vy += 0.98;
      this.y += this.vy;

      // 着地
      if (this.bottom > SCREEN_HEIGHT) {
        this.bottom = SCREEN_HEIGHT;
        this.vy =0;
        if(anim.currentAnimation.next!='walk'){anim.gotoAndPlay('walk')};
      }

      var k = app.keyboard;
      if(k.getKey('space')){
        if (SCREEN_HEIGHT-player.bottom<50) { //設置判定緩め
          player.vy =-2.5*9.8;
          anim.gotoAndPlay('jump');

          var voice = 1+Math.floor(Math.random()*2);
          var str = 'jump'+voice;
          SoundManager.play(str);
        }
      }


      /*//前進
      if (this.x < 320) {
      this.x +=5;
    }

    if (this.x > 320) {
    this.x=320;
    this.vx =0;
  }*/
}
enemysporn(10);
// 更新処理
this.update = function(app) {
  // 経過フレーム数表示
  score++;
      speed+=1;
  label.text='スコア：'+score;
};

function enemysporn(spd){
  var front;
  var enemy;
  enemy = Sprite('uni', 32, 32).addChildTo(e);
  enemy.setSize(128,128);
  enemy.flag=true;
  enemy.speed=spd;
  anim_e=FrameAnimation('uni_sprite').attachTo(enemy);
  anim_e.fit = false;
  anim_e.gotoAndPlay('walk');
  enemy.setPosition(SCREEN_WIDTH,SCREEN_HEIGHT-90);
  enemy.collider.setSize(96, 96).offset(0,0);
  enemy.update=function(){
    this.x-=this.speed;
    if(this.x<player.x && this.flag==true){ //Collider準拠
      var s=[5,10,15];
      var sp=Math.floor(Math.random()*3); // 5, 7.5, 10, 12.5, 15
      spd=s[sp];
      this.flag=false;
      console.log(spd)
      enemysporn(spd);
    }
    if(this.right<0){this.remove();}

    //hit
    if (enemy.collider.hitTest(player.collider)) {
      //console.log("hit");
      anim.gotoAndPlay('hit');
      anim_e.gotoAndPlay('hit');
      SoundManager.play('ouch');
      //SoundManager.stopMusic('bgm');
      //SoundManager.play('hit');
      self.app.pushScene(GameOver(score));
    }

  }
}


},

onpointstart: function() {
  if (SCREEN_HEIGHT-player.bottom<50) { //設置判定緩め
    player.vy =-2.5*9.8;
    anim.gotoAndPlay('jump');

    var voice = 1+Math.floor(Math.random()*2);
    var str = 'jump'+voice;
    SoundManager.play(str);
  }
},

update:function(app){

},



});

phina.define("GameOver", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function(score) {
    // 親クラス初期化
    this.superInit();
    var self=this;

    // 背景を半透明化
    this.backgroundColor = 'rgba(0, 0, 0, 0)';

    var t='GAME OVER';
    var c='white';

    score--;
    if(hi<score){
      localStorage.setItem('hi(unity)',score);
      t='NEW RECORD';
      c='yellow'
    }

    Label({
      x:SCREEN_WIDTH/2,
      y:SCREEN_HEIGHT/2,
      text:t,
      fill:c,
      stroke:'black',
      fontSize:48
    }).addChildTo(this);
  },
  onpointstart: function() {
    score=0;
    location.reload();
  }
});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    fps: 60, // fps指定
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'title',
    assets: ASSETS,
    width:960,
    height:640,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Title',
        label: 'title',
      },
      {
        className: 'Main',
        label: 'main',
      },
    ],

  });

  // 実行
  app.run();
});
