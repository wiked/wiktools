// wiktools.js

// Delacroix is our mouse handler.
//    "Attention mesdames et messieurs..."
var delacroix = null

//--------------------------------
// wikMaster
//--------------------------------
// wikMaster is the global-scope variable that acts as
//     - a resource manager
//     - a rudimentary garbage collector (eventually)
//     - your BFF, Jill.
var wikMaster = null;



//--------------------------------
// wikWindow class
//--------------------------------
// @author: William I Krueger
// @date: 1 Mar 2013
// @description:
//    wikWindow is your basic window.
function wikWindow(cvs)
{
  //--------------------------------
  //data members!
  //--------------------------------
  this.id = wikMaster.getNewId();
  this.cvs = cvs;
  this.twod = null;

  this.borderColor = "#000000";
  this.font = "20px Georgia";

  this.headColor = "#F0F0F0";
  this.bg = "#FFFFFF";
  this.otherObjs = [];
  this.mouseMod = new wikMouseMod(this);





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

  this.draw = function()
  {
    this.drawWindow();
  }

  wikMaster.add(this);

  //wikWindow.drawWindow
  this.drawWindow = function()
  {
    var g = this.getGraphics();
    var whyx = this.mouseMod.whyx;
    g.fillStyle = this.bg;
    g.lineWidth = 0.5;
    g.fillRect(whyx.x, whyx.y, whyx.w, whyx.h);
    g.fillStyle = this.borderColor;
    g.strokeRect(whyx.x, whyx.y, whyx.w, whyx.h);


    if(this.otherObjs && this.otherObjs.length >0)
    {
      var i = 0;
      for(; i < this.otherObjs.length; ++i)
      {
        this.otherObjs[i].draw();
      }
    }
  };

  //wikWindow.addObj
  this.addObj = function(obj)
  {
    this.otherObjs.push(obj);
  }

  if(!delacroix)
  {
    delacroix = new wikMouseHandler(this);
  }

  var head = new wikWindowHead(this);
  this.addObj(head);

  wikCloseButton(this);

  //wikWindow.cleanUp
  this.cleanUp = function()
  {
    if(this.otherObjs)
    {
      var i = 0;
      for(; i < this.otherObjs.length; ++i)
      {
        if(this.otherObjs[i].cleanUp)
        {
         this.otherObjs[i].cleanUp();
        }

        this.otherObjs[i] = null;
      }
      this.otherObjs.length = 0;
      delacroix.removeMe(this);
      wikMaster.removeMe(this);
    }
  }

  //wikWindow.mouseMove
  this.mouseMod.mouseMove = function(evt, pe)
  {
    this.prnt.drawWindow();
  }

  //wikWindow.afterMove
  this.mouseMod.afterMove = function(diffPoint)
  {
    this.moveBounds(diffPoint);
    var objs = this.prnt.otherObjs;
    if(objs)
    {
      var i = 0;
      for(; i < objs.length; ++i)
      {
        objs[i].mouseMod.move(diffPoint);
      }
    }
    wikMaster.redraw();
  }

  //wikWindow.resize
  this.mouseMod.resize = function()
  {
    if(this.prnt.otherObjs)
    {
      var objs = this.prnt.otherObjs;
      var i = 0;
      for(; i < objs.length; i++)
      {
        if(objs[i].mouseMod)
        {
          objs[i].mouseMod.resize();
        }
      }
    }
  };


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


//wikMouseMod class
function wikMouseMod(pw)
{
  this.id = wikMaster.getNewId();
  this.prnt = pw;
  this.bounds = {x:0, y:0, h:0,w:0};
  this.whyx = {x:0, y:0, h:0,w:0};

  this.resize    = function(){};
  this.mouseMove = function(evt,pe){};
  this.mouseDown = function(evt,pe){};
  this.afterMove = function(diffPoint){};
  this.mouseUp = function(evt, pe){};
  this.doMouseUp = false;


  //wikMouseMod.reboundToRect
  this.reboundToRect = function(rect)
  {
   this.bounds = {x:rect.x, y:rect.y, h:rect.h, w:rect.w};
  };

  //wikMouseMod.move
  this.move = function(diffPoint)
  {
    this.whyx.x += diffPoint.x;
    this.whyx.y += diffPoint.y;
    this.afterMove(diffPoint);
  };

  //wikMouseMod.moveBounds
  this.moveBounds = function(diffPoint)
  {
    this.bounds.x += diffPoint.x;
    this.bounds.y += diffPoint.y;
  };

  //wikMouseMod.checkBounds
  this.checkBounds = function(evt,pe)
  {
    return (pe.x >= this.bounds.x && pe.x <= (this.bounds.x + this.bounds.w)) && (pe.y >= this.bounds.y && pe.y <= (this.bounds.y + this.bounds.h));
  };


  //wikMouseMod.resizeToRect
  this.resizeToRect = function(rect)
  {
   this.whyx = {x:rect.x, y:rect.y, h:rect.h, w:rect.w};
  };
}


//wikWindowHead class
function wikWindowHead(pw)
{
  this.id = wikMaster.getNewId();
  this.mouseMod = new wikMouseMod(this);
  this.prnt = pw;
  this.title = "Title";
  this.headFontColor = "#808080";
  this.headBorderColor = "#000000";
  this.headColor = "#F0F0F0";
  this.font = "20px Georgia";


  //wikWindowHead.resize
  this.mouseMod.resize = function()
  {
    this.reboundToRect(this.prnt.prnt.mouseMod.whyx);
    this.resizeToRect(this.prnt.prnt.mouseMod.whyx);
    this.bounds.h = 30;
  };

  //wikWindowHead.cleanUp
  this.cleanUp = function()
  {
    delacroix.removeMe(this);
    this.mouseMod = null;
  }

  //wikWindowHead.mouseDown
  this.mouseMod.mouseDown = function(evt, pe)
  {
    if(this.checkBounds(evt,pe))
    {
      this.prnt.headColor = "#FF00FF";
      this.prnt.draw(this.prnt.prnt.getGraphics());
      this.doMouseUp = true;
    }
  };

  //wikWindowHead.mouseUp
  this.mouseMod.mouseUp = function(evt, pe)
  {
    if(this.doMouseUp)
    {
      this.prnt.headColor = "#F0F0F0";
      this.doMouseUp = false;
      wikMaster.redraw();
    }
  };

  //wikWindowHead.mouseMove
  this.mouseMod.mouseMove = function(evt,pe)
  {
    if(this.checkBounds(evt,delacroix.downPoint) && delacroix.down)
    {
      var moveX = pe.x - delacroix.downPoint.x;
      var moveY = pe.y - delacroix.downPoint.y;
      delacroix.downPoint.x += moveX;
      delacroix.downPoint.y += moveY;

      var diffPoint = {x:moveX, y:moveY};
      this.moveBounds(diffPoint);
      this.prnt.prnt.mouseMod.move(diffPoint);
    }
  }



  wikAddToMouseHandler(this);

  //wikWindowHead.draw
  this.draw = function(g)
  {
    var g = this.prnt.getGraphics();
    g.lineWidth = 0.5;
    var whyx = this.mouseMod.whyx;
    g.fillStyle = this.headColor;
    g.fillRect(whyx.x+1,whyx.y+1, whyx.w-2, 30-2);

    g.strokeStyle = this.headBorderColor;
    g.beginPath();
    //TODO: incorporate different head font sizes
    g.moveTo(whyx.x, whyx.y+30);
    g.lineTo(whyx.x + whyx.w, whyx.y + 30);
    g.stroke();
    g.fillStyle = this.headFontColor;
    g.font = this.font;
    var txtInfo = g.measureText(this.title);
    var leftPad = whyx.x + ((whyx.w - txtInfo.width)/2); //TODO: account for LOOOOOOOOOOONG titles.
    var topPad = whyx.y + 24;
    g.fillText(this.title,leftPad,topPad);
  }
}

//wikAddToMouseHandler function
function wikAddToMouseHandler(obj)
{
  if(delacroix)
  {
    delacroix.add(obj);
  }

}

//wikMouseHandler class
function wikMouseHandler(cvs)
{
  this.id = wikMaster.getNewId();
  this.cvs = cvs;
  this.continue = 1;
  this.downPoint  = {x:0,y:0};
  this.audience = [];
  this.down = 0;


  //wikMouseHandler.translate
  this.wndTranslate = function(evt, obj)
  {
    return {x:evt.clientX - obj.offsetLeft, y:evt.clientY - obj.offsetTop};
  }

  //wikMouseHandler.mouseDown
  this.mouseDown = function(evt)
  {
    if(!delacroix.down)
    {
      delacroix.down = 1;
      var pe = delacroix.wndTranslate(evt, this);
      delacroix.downPoint = {x: pe.x, y:pe.y};
      var gens = delacroix.audience;
      if(gens)
      {
        delacroix.continue = 1;
        var i = 0;
        for(; i < gens.length && delacroix.continue; ++i)
        {
          if(gens[i].mouseMod)
          {
            gens[i].mouseMod.mouseDown(evt, pe);
          }
        }
      }
    }

  };
  this.cvs.onmousedown = this.mouseDown;



  //wikMouseHandler.removeMe
  this.removeMe = function(obj)
  {
    if(obj && obj.id)
    {
      if(this.audience && this.audience.length > 0)
      {
        var i = 0;
        for(; i < this.audience.length; ++i)
        {
          if(this.audience[i].id == obj.id)
          {
            this.audience.splice(i,1);
          }
        }
      }
    }
  };

  //wikMouseHandler.mouseMove
  this.mouseMove = function(evt)
  {
    if(delacroix.audience)
    {
      var i = 0;
      for(; i < delacroix.audience.length && delacroix.continue; ++i)
      {
        delacroix.audience[i].mouseMod.mouseMove(evt, delacroix.wndTranslate(evt,this));
      }
    }
  };
  this.cvs.onmousemove = this.mouseMove;

  //wikMouseHandler.mouseUp
  this.mouseUp = function(evt)
  {
    delacroix.down = 0;
    if(delacroix.audience && delacroix.audience.length > 0)
    {
      var i = 0;
      for(; i < delacroix.audience.length; ++i)
      {
        delacroix.audience[i].mouseMod.mouseUp(evt, delacroix.wndTranslate(evt,this));
      }
    }
  };

  this.cvs.onmouseup = this.mouseUp;

  //wikMouseHandler.add
  this.add = function(obj)
  {
    if(obj.mouseMod)
    {
     this.audience.push(obj);
    }
  };
}

//wikLabel class
function wikLabel(w)
{
  this.id = wikMaster.getNewId();
  //TODO: type verification!

  this.prnt = w;
  this.font = this.font = "10px Georgia";
  this.txt = "";
  this.mouseMod = new wikMouseMod(this);
  this.whyx = {x:0,y:0, h:0, w:0};
  this.fontStyle = "#000000";

  wikAddToMouseHandler(this);

  //wikLabel.mouseMove
  this.mouseMod.mouseMove  = function(evt, pe)
  {
    this.prnt.txt = "(".concat(evt.clientX, ",", evt.clientY,"), (", pe.x, ",", pe.y,")");
  };

  //wikMouseHandler.cleanUp
  this.cleanUp = function()
  {
    delacroix.removeMe(this);
    this.mouseMod = null;
  }


  //wikMouseHandler.draw
  this.draw = function()
  {
    var g = this.prnt.getGraphics();
    g.fillStyle = this.fontStyle;
    g.font = this.font;
    var pRect = this.prnt.mouseMod.whyx;
    var x = this.whyx.x + pRect.x;
    var y = this.whyx.y + pRect.y;
    g.fillText(this.txt, x,y);
  };
}


//wikTestWindow function
function wikTestWindow()
{
  var c = document.getElementById("testCanvas");
  if(!wikMaster)
  {
   wikMaster = new wikGlobal(c);
  }

  if(!delacroix)
  {
    delacroix = new wikMouseHandler(c);
  }
  var w = new wikWindow(c);

  return w;
}

//wikTest function
function wikTest()
{
  var w = wikTestWindow();
  w.mouseMod.whyx = {x: 50, y:100, h: 200, w: 400};
  w.mouseMod.resize();
//  delacroix = new wikMouseHandler(w.cvs);





  var t = new wikLabel(w);
  t.txt = "Text Info";
  t.whyx = {x: 20, y:190};
  w.addObj(t);
  wikAddToMouseHandler(w);


  var y = new wikTestWindow();
  y.mouseMod.whyx = {x: 0, y:0, h: 90, w: 60};


  var btn = new wikButton(y);
  btn.mouseMod.whyx = {x:3, y:33, h:40, w:50};
  btn.title = "yup";
  y.addObj(btn);
  y.mouseMod.resize();

  wikMaster.redraw();
}

//wikGlobal class
function wikGlobal(cvs)
{
  this.cvs = cvs;
  this.bgColor = "#A0FFA0";
  this.audience = [];
  this.nextId = 0;

  //wikGlobal.add
  this.add = function(obj)
  {
    if(obj.draw)
    {
      this.audience.push(obj);
    }
  };

  //wikGlobal.redraw
  this.redraw = function()
  {
    var g = this.cvs.getContext("2d");
    g.fillStyle = this.bgColor;
    g.fillRect(0,0,this.cvs.width, this.cvs.height);
    if(this.audience)
    {
      for(i = 0; i < this.audience.length; ++i)
      {
        this.audience[i].draw();
      }
    }
  };


  //wikGlobal.removeMe
  this.removeMe = function(obj)
  {
    if(this.audience && this.audience.length > 0)
    {
      for(i = 0; i < this.audience.length; ++i)
      {
        if(this.audience[i].id == obj.id)
        {
          this.audience.splice(i,1);
          obj = null;
        }
      }
      this.redraw();
    }
  };

  //wikGlobal.getNewId
  this.getNewId = function()
  {
    var ret = wikMaster.nextId;
    wikMaster.nextId += 1;
    return ret;
  };
}


//wikButton class
function wikButton(w)
{
  this.id = wikMaster.getNewId();
  this.mouseMod = new wikMouseMod(this);
  this.prnt = w;
  this.title = "Button";
  this.borderColor = "#000000";
  this.bgColor = "#A0A0A0";
  this.fontColor = "#000000";


  //wikButton.mouseDown
  this.mouseMod.mouseDown = function(evt, pe)
  {
    if(this.checkBounds(evt,pe))
    {
      this.prnt.buttonClicked(evt,pe);
    }
  }

  //wikButton.afterMove
  this.mouseMod.afterMove = function(diffPoint)
  {
    this.bounds.x = this.whyx.x;
    this.bounds.y = this.whyx.y;
    this.bounds.h = this.whyx.h;
    this.bounds.w = this.whyx.w;
  }

  this.buttonClicked = function(evt,pe){}

  wikAddToMouseHandler(this);

  //wikButton.draw
  this.draw = function()
  {
    var g = this.prnt.getGraphics();
    g.fillStyle = this.bgColor;
    var whyx = this.mouseMod.whyx;
    g.fillRect(whyx.x, whyx.y, whyx.w, whyx.h);
    g.strokeStyle = this.borderColor;
    g.strokeRect(whyx.x, whyx.y, whyx.w, whyx.h);
    g.fillStyle = this.fontColor;
    var txtInfo = g.measureText(this.title);
    var leftPad = whyx.x + ((whyx.w - txtInfo.width)/2); //TODO: account for LOOOOOOOOOOONG titles.
    var topPad = whyx.y + 24;
    g.fillText(this.title,leftPad,topPad);
  }

  //wikButton.cleanUp
  this.cleanUp = function()
  {
    this.mouseMod = null;
    delacroix.removeMe(this);
  }

}

//wikCloseButton function
function wikCloseButton(w)
{
  var btn = new wikButton(w);

  btn.title = "";
  btn.buttonClicked = function(evt,pe)
  {
    this.prnt.cleanUp();
  };

  btn.mouseMod.resize = function()
  {
    var whyx = this.prnt.prnt.mouseMod.whyx;
    var rect = {x: whyx.x + whyx.w - 13, y:whyx.y+3, h: 10, w: 10};
    this.whyx = rect;
    btn.mouseMod.bounds = rect;
  }

  w.addObj(btn);
}
