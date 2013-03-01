// wiktools.js
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
  this.bg = "#F0F0F0";

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


  this.drawWindow = function()
  {
    var g = this.getGraphics();
    g.fillStyle = this.bg;
    g.fillRect(this.whyx.x, this.whyx.y, this.whyx.w, this.whyx.h);
    g.fillStyle = this.borderColor;
    g.strokeRect(this.whyx.x, this.whyx.y, this.whyx.w, this.whyx.h);
    g.fillStyle = this.headFontColor;
    g.font = this.font;
    var txtInfo = g.measureText(this.title);
    var leftPad = this.whyx.x + ((this.whyx.w - txtInfo.width)/2); //TODO: account for LOOOOOOOOOOONG titles.
    var topPad = this.whyx.y + 24;
    g.fillText(this.title,leftPad,topPad);
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
  w.drawWindow();
}