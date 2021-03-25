// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var sprite;

var ASSETS = {
  // 画像
  image: {
    'chara': 'img/UnityChan.png',
    'sky': 'img/BG_01.png',
    'ground': 'img/BG_02.png',
  },
  // スプライトシート
  spritesheet: {
    'char_sprite': 'img/chara.tmss',

  },
};

phina.define('Main', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    var self=this;

    // 背景
    this.backgroundColor = 'skyblue';

    var bg =  DisplayElement().addChildTo(this);
    var group =  DisplayElement().addChildTo(this);

    var shape = Shape().setSize(640,50).setPosition(320,960-25).addChildTo(bg);

    //var ground = Sprite('ground', 640, 240).setPosition(320,840).addChildTo(bg);

    // スプライト画像作成
     sprite = Sprite('chara', 32, 32).addChildTo(group);
    // スプライトにフレームアニメーションをアタッチ
    var anim = FrameAnimation('char_sprite').attachTo(sprite);
    anim.fit = false;
    sprite.setSize(100,100);
    // アニメーションを指定
    anim.gotoAndPlay('walk');

    // 初期位置
    sprite.x = SCREEN_WIDTH/2;
    sprite.y = SCREEN_HEIGHT-100;
    anim.ss.getAnimation('walk').frequency = 3;
    sprite.vy = -10;

    sprite.update= function(){
      // 下に移動
      this.vy += 0.98;
      this.y += this.vy;

      // 地面に着いたら反発する
      if (this.bottom > 960) {
        this.bottom = 960;
        this.vy =0;
      }

      if (this.x < 320) {
        this.x +=5;
      }

      if (this.x > 320) {
        this.x=320;
        this.vx =0;
      }
    }
  },

   onpointstart: function() {
     if (sprite.bottom == 960) {
     //sprite.vy =-20;
     sprite.x=120;
   }
 }



});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'main',
    assets: ASSETS,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Main',
        label: 'main',
      },
    ]
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
