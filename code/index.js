     /**
  Copyright (C) 2013
              _                 _     
             | |               | |    
    ___ _ __ | |__   __ _   ___| |__  
   / _ \ '_ \| '_ \ / _` | / __| '_ \ 
  |  __/ |_) | | | | (_| || (__| | | |
   \___| .__/|_| |_|\__,_(_)___|_| |_|
       | |                            
       |_|        
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this 
  software and associated documentation files (the "Software"), to deal in the Software 
  without restriction, including without limitation the rights to use, copy, modify, merge, 
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
  to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or 
  substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.          
 */
var App = {
    
  // CONTROLLER
  on: function (type, call){ (type.indexOf(call) != -1) ?  console.log("Function already exists") : type.push(call); },
  off: function(type, call){  type.splice(type.indexOf(call), 1); },
  dispatch: function(type, data){  for(var i = 0; i < type.length; i++){ type[i](data); } }
  ,
  // COMMANDS
  READY: []
  ,
  // MODEL
  model: new Model()
  ,
  // VIEWS
  views: function(){
    Tafel.init();
  }
  ,
  // BINDING 
  bind: function()
  {  
    DOM(window).on("ready", function()
    {
      App.dispatch(App.READY);
    });
  }
  ,
  // ENVIROMENT
  initialize: function(domain)
  {  
    if (!App.live) console.log("- DOMAIN " + domain);

    if (!App.live && !DOM) console.log("- MODULE DOM required");
    
    this.device = DOM().device();
    
    App.live = Node.init( domain );
    
    Node.navigation();
    
    this.views();
    
    this.bind();
  }
}; 

var Tafel = {
    
  init:function() 
  {
    var kinetics = new Kinetics();
    
    kinetics.start();
  }
};
















  
