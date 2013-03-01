// wiktools.js

// Delacroix is our mouse handler.
//    "Attention mesdames et messieurs..."
var delacroix = null


function wikWindow(cvs)
{
  //--------------------------------
  //data members!
  //--------------------------------
  this.cvs = cvs;
  this.twod = null;
  this.whyx = {x:0, y:0, h:0, w:0};
  this.title = "Title";
  this.font = "20px Georgia";
  this.borderColor = "#000000";
  this.headFontColor = "#808080";
  this.headBorderColor = "#000000";
  this.headColor = "#F0F0F0";
  this.bg = "#FFFFFF";
  this.otherObjs = [];

  //--------------------------------
  //wikWindow.getGraphics()
  //--------------------------------
  //  @author: William I Krueger
  //  @date: 1 Mar 2013
  this.getGraphics = function() {
    if(!this.twod)
    {
      this.twod = this.cvs.getContext("2d");
    }
    return this.twod;
  };

  this.drawHead = function()
  {
    var g = this.getGraphics();
    g.lineWidth = 0.5;

    g.fillStyle = this.headColor;
    g.fillRect(this.whyx.x+1, this.whyx.y+1, this.whyx.w-2, 30-2);

    g.strokeStyle = this.headBorderColor;
    g.beginPath();
    //TODO: incorporate different head font sizes
    g.moveTo(this.whyx.x, this.whyx.y+30);
    g.lineTo(this.whyx.x + this.whyx.w, this.whyx.y + 30);
    g.stroke();
    g.fillStyle = this.headFontColor;
    g.font = this.font;
    var txtInfo = g.measureText(this.title);
    var leftPad = this.whyx.x + ((this.whyx.w - txtInfo.width)/2); //TODO: account for LOOOOOOOOOOONG titles.
    var topPad = this.whyx.y + 24;
    g.fillText(this.title,leftPad,topPad);

  }

  this.drawWindow = function()
  {
    var g = this.getGraphics();
    g.fillStyle = this.bg;
    g.lineWidth = 0.5;
    g.fillRect(this.whyx.x, this.whyx.y, this.whyx.w, this.whyx.h);
    g.fillStyle = this.borderColor;
    g.strokeRect(this.whyx.x, this.whyx.y, this.whyx.w, this.whyx.h);
    this.drawHead();

    if(this.otherObjs && this.otherObjs.length >0)
    {
      for(i = 0; i < this.otherObjs.length; ++i)
      {
        this.otherObjs[i].draw();
      }
    }
  };

  this.addObj = function(obj)
  {
    this.otherObjs.push(obj);
  }

  this.ouiMonsieur = function(evt, pe)
  {
    this.otherObjs[0].txt = "(".concat(evt.clientX, ",", evt.clientY,"), (", pe.x, ",", pe.y,")");
    this.drawWindow();
  }

  //--------------------------------
  //wikWindow.fillCanvasBg()
  //--------------------------------
  //  @author: William I Krueger
  //  @date: 1 Mar 2013
  this.fillCanvasBg = function(col)
  {
    var g = this.getGraphics();
    g.fillStyle = col;
    g.fillRect(0,0,this.cvs.width,this.cvs.height);
  };



};

function wikAddToMouseHandler(obj)
{
  if(delacroix)
  {
    delacroix.add(obj);
  }
}

function wikMouseHandler(cvs)
{
  this.cvs = cvs;
  this.continuer = 1;
  this.audience = [];


  this.personnaliser = function(evt, obj)
  {
    return {x:evt.clientX - obj.offsetLeft, y:evt.clientY - obj.offsetTop};
  }

  this.sourisBouge = function(evt)
  {
    if(delacroix.audience)
    {
      for(i = 0; i < delacroix.audience.length && delacroix.continuer; ++i)
      {
        delacroix.audience[i].ouiMonsieur(evt, delacroix.personnaliser(evt,this));
      }
    }
  }

  this.cvs.onmousemove = this.sourisBouge;
  this.add = function(obj)
  {
    this.audience.push(obj);
  }
}

function wikLabel(w)
{
  //TODO: type verification!
  this.prnt = w;
  this.font = this.font = "10px Georgia";
  this.txt = "";
  this.whyx = {x:0,y:0, h:0, w:0};
  this.fontStyle = "#000000";

  this.draw = function()
  {
    var g = this.prnt.getGraphics();
    g.fillStyle = this.fontStyle;
    g.font = this.font;
    var x = this.whyx.x + this.prnt.whyx.x;
    var y = this.whyx.y + this.prnt.whyx.y;
    g.fillText(this.txt, x,y);
  };
}


function wikTestWindow()
{
  var c = document.getElementById("testCanvas");
  var w = new wikWindow(c);
  return w;
}

function wikTest()
{

  var w = wikTestWindow();
  w.whyx = {x: 50, y:100, h: 200, w: 400};
  delacroix = new wikMouseHandler(w.cvs);

  var t = new wikLabel(w);
  t.txt = "Text Info";
  t.whyx = {x: 20, y:190};
  w.addObj(t);
  wikAddToMouseHandler(w);


  w.drawWindow();
}
