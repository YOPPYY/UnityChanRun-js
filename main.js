// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 960;
var SCREEN_HEIGHT = 640;

var sprite;
var anim;
var anim_e;
var bg=[];
var on=true;
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

phina.define('Main', {
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


    // スプライト画像作成
    sprite = Sprite('chara', 32, 32).addChildTo(group);
    // スプライトにフレームアニメーションをアタッチ
    anim = FrameAnimation('char_sprite').attachTo(sprite);
    anim.fit = false;
    sprite.setSize(256,256);
    // アニメーションを指定
    anim.gotoAndPlay('walk');

    // 初期位置
    sprite.x = SCREEN_WIDTH/5;
    sprite.y = SCREEN_HEIGHT-100;
    //anim.ss.getAnimation('walk').frequency = 4;
    sprite.vy = -10;
    sprite.collider.setSize(64, 160).offset(0,0).show();


    sprite.update= function(){
      // 下に移動
      if(!on){
      this.vy += 0.98;}
      if(on){
      this.vy = 0;}
      this.y += this.vy;

      // 着地
      if (this.bottom > SCREEN_HEIGHT) {
        this.bottom = SCREEN_HEIGHT;
        this.vy =0;
        if(anim.currentAnimation.next!='walk'){anim.gotoAndPlay('walk')};
        if(!on)on=true;
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

// 更新処理
this.update = function(app) {
  // 経過フレーム数表示
  if(app.frame%100==0){
    enemysporn();
  }

  if(app.frame%100==0){
    //blocksporn();
  }


};

function enemysporn(){
  var enemy = Sprite('uni', 32, 32).addChildTo(e);
  enemy.setSize(128,128);
  anim_e=FrameAnimation('uni_sprite').attachTo(enemy);
  anim_e.fit = false;
  anim_e.gotoAndPlay('walk');
  enemy.setPosition(SCREEN_WIDTH,SCREEN_HEIGHT-90);
  enemy.collider.setSize(96, 96).offset(0,0).show();
  var r=Math.floor(Math.random()*2);
  var s=7.5+7.5*r
  enemy.update=function(){
    this.x-=s;
    if(this.right<0){
      this.remove();
    }

    //hit
    if (enemy.collider.hitTest(sprite.collider)) {
     //console.log("hit");
     anim.gotoAndPlay('hit');
     anim_e.gotoAndPlay('hit');
     SoundManager.play('ouch');
     //SoundManager.stopMusic('bgm');
     //SoundManager.play('hit');
     self.app.pushScene(GameOver());
   }

  }
}

function blocksporn(){
  var block = Sprite('block', 32, 32).addChildTo(e);
  block.setSize(128,128);
  block.setPosition(SCREEN_WIDTH+96,SCREEN_HEIGHT-218);
  block.collider.setSize(128, 128).offset(0,0).show();
  block.update=function(){
    this.x-=7.5;
    if(this.right<0){
      this.remove();
    }

    //hit
    if (block.collider.hitTest(sprite.collider)) {
      if(Math.abs(sprite.bottom-block.top)<5){
      if(anim.currentAnimation.next!='walk'){anim.gotoAndPlay('walk')};
      on=true;
      sprite.vy=0;
    }
   }
   else{on=false;console.log('false')}

  }
}


},

onpointstart: function() {
  if (on || sprite.x==SCREEN_HEIGHT) {
    sprite.vy =-2.5*9.8;
    anim.gotoAndPlay('jump');
    on=false;

    var v = Math.floor(Math.random()*2);
    SoundManager.play('jump'+v);
  }
},

update:function(){

}



});

phina.define("GameOver", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function(score) {
    // 親クラス初期化
    this.superInit();
    // 背景を半透明化
    this.backgroundColor = 'rgba(0, 0, 0, 0)';
    Label({
      x:SCREEN_WIDTH/2,
      y:100,
      text:'GAME OVER',
      fill:'white',
      stroke:'black',
      fontSize:48
    }).addChildTo(this);
}
});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    fps: 60, // fps指定
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'main',
    assets: ASSETS,
    width:960,
    height:640,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Main',
        label: 'main',
      },
    ],

  });

  app.domElement.addEventListener('touchend', function dummy() {
    var s = phina.asset.Sound();
    s.loadFromBuffer();
    s.play().stop();
    app.domElement.removeEventListener('touchend', dummy);
  });

  // 実行
  app.run();
});
