
	Kinetics = function() 
	{
		this.language = null;
		this.data = {};
	};
	
	Kinetics.prototype.start = function() {
		
		this.graph = new Graph();
		
		this.registerListener();
		
		this.registerLanguage();
		
		this.visualize();		
	};
	
	Kinetics.prototype.stop = function() {
		
	};
	
	Kinetics.prototype.setData = function(data) {
		this.data = data;
	};
	
	Kinetics.prototype.getData = function() {
		return this.data;
	};
	

	Kinetics.prototype.registerListener = function() {
		
		var inputs = document.getElementsByTagName("input");
		
		for(var i = 0; i < inputs.length; i++){
			
			inputs[i].addEventListener("change", this.visualize, true);
			inputs[i].value = 0;
		}
	};

	Kinetics.prototype.registerLanguage = function()
	{
		var language = new Language();
		
		if(!language.setSelect("sprache")) return;	
		
		language.getPreference();
		
		language.vokabeln.push("DOSIERUNG","F","DOSIS","INTERVALL","PREDOSE","SPRACHE");
		language.vokabeln.push("POPULATIONSDATEN","ABSORPTION","HALBWERTSZEIT","VOLUMEN","CLEARANCE","ELIKONSTANTE");
		language.vokabeln.push("PERSONALISIERUNG","KONZENTRATION1","ZEIT1","KONZENTRATION2","ZEIT2","RECHENART");
		language.vokabeln.push("BEREICH","OBERE_GRENZE","UNTERE_GRENZE");

		language.translateAll();
		
		document.getElementById("sprache").addEventListener("change", function(event)
		{
			this.visualize();
		}
		.bind(this), false);
		
		this.language = language;
	};
	
	Kinetics.prototype.visualize = function(event) {
		
		param = new Kinetic();
	
		if(!event)
		{				
			if( window.location.hash.length > 0) 
			{
				window.location.hash.replace("#","").split("&").forEach(zuweisen);
			}
	
			param.toInput();	
		}
		else
		{	
			param.fromInput();					
	
	    	window.location.hash = param.toHash();
		}
	
		// Berechnete Werte von Eingabe
		var dosis = param.dosierung * param.bio / 100;  
	 	var ka  = ( param.tin > 0 ) ? Math.log(2) / param.tin : 0;  
	 	var cl  = ( param.hwz > 0 && param.v > 0) ? Math.log(2) * param.v / param.hwz : 0;
	 	var ke  = ( param.hwz > 0) ? Math.log(2) / param.hwz : 0;
	 	var c0 = dosis / param.v;
	 	var ccssmin1a = 0;
	 	var ccssmin1b = 0;
	 	var cv1a = 0;
	 	var cv1b = 0;
	 	var cke1a = 0;
	 	var cke1b = 0;
	 	var ccssmin2 = 0;
	 	var cv2 = 0;
	 	var cke2 = 0;
	 	
	 	getElement( "clo" ).value = cl.toFixed(3);    	
	 	getElement( "keo" ).value = ke.toFixed(4);
	
	 	if(param.hwz == 0 || param.v == 0){
	 		this.graph.board(100, 100);	
	 		
		    	var abszisse = this.language.translate("ABSZISSE");
		    	var ordinate = this.language.translate("ORDINATE");
		    	
	 	    this.graph.coordinates(abszisse, ordinate);
	 	    
	 		return;
	 	}
	
			// Concentration Max
			// Standard
	 	var cmax = ( c0 / param.getAccu(ke, param.tau) ) + param.cssmin;
	
		if(param.c1 > 0 || param.t1 > 0)
		{
			getElement("co1").style.opacity = "1";     			
		}else
		{
			getElement("co1").style.opacity = "0.6";     			     						     			 			     			
		}
			
		if((param.c1 > 0 && param.t1 > 0 ) && (param.c2 > 0 || param.t2 > 0))
		{
	 		getElement("co2").style.opacity = "1";     			
		}else
		{
	 		getElement("co2").style.opacity = "0.6";     			     			
		}
	
		getElement("cv1").value = 0;
		getElement("hwz1").value = 0;
		getElement("cv2").value = 0;
		getElement("hwz2").value = 0;
		getElement("co3").style.opacity = "0.6";
		getElement("co4").style.opacity = "0.6";
	
		// Reset
		this.language.translate("RECHENART","RECHENART");
		// Range Volumen und Eliminiation variiert
		if(param.c1 > 0 && param.t1 > 0 && param.c2 == 0 && param.t2 == 0)
		{     			
			// Volumen a)
			cv1a = param.getVolume( dosis, param.tau, param.c1, param.t1, ke, ka);
			cke1a = ke;
			ccssmin1a = param.getConcentration( dosis, param.tau, cv1a, 0, ke, ka); 
	 		
	 		// Max
		    cmax = Math.max( cmax, ( (dosis / cv1a) + ccssmin1a) );
	 		getElement("cv1").value = cv1a.toFixed(2);
	 		getElement("hwz1").value = (Math.log(2) / ke ).toFixed(1);
	
		    // Elimination b)
		    var ccssmax1b = param.getConcentration( dosis, param.tau, param.v, param.t1, ke, ka);
			cke1b = param.getElimination(ke, c0, param.c1, ccssmax1b );
	 		cv1b = param.getVolume( dosis, param.tau, param.c1, param.t1, cke1b, ka);
	 		ccssmin1b = param.getConcentration( dosis, param.tau, cv1b, 0, cke1b, ka); 
	 		
	 		// Max
		    cmax = Math.max( cmax, ( (dosis / cv1b) + ccssmin1b), param.c1, ccssmax1b );
	 		getElement("cv2").value = cv1b.toFixed(2);
	 		getElement("hwz2").value = (Math.log(2) / cke1b).toFixed(1);
	
	 		this.language.translate("RECHENART_VARIATION","RECHENART");
	
	 		getElement("co3").style.opacity = "1";
	 		getElement("co4").style.opacity = "1";
		}
			
			// Volumen und Elimination genau
		if(param.c1 > 0 && param.t1 > 0 && param.c2 > 0 && param.t2 > 0){
				cke2 = ( Math.log(param.c1) - Math.log(param.c2) ) / ( param.t2 % param.tau - param.t1 % param.tau );
				cv2 = param.getVolume( dosis, param.tau, param.c1, param.t1, cke2, ka);
				ccssmin2 = param.getConcentration( dosis, param.tau, cv2, 0, cke2, ka); 
	 		// Max
		    cmax = Math.max( cmax, ( (dosis / cv2) + ccssmin2), param.c2 );
	 		getElement("cv1").value = cv2.toFixed(2);
	 		getElement("hwz1").value = (Math.log(2) / cke2 ).toFixed(1);
	 		getElement("cv2").value = 0;
	 		getElement("hwz2").value = 0;
	 		
	 		this.language.translate("RECHENART_PRECISE","RECHENART");
	
	 		getElement("co3").style.opacity = "1";
	 		getElement("co4").style.opacity = "0.6";
		}
			
			// Max andere Kandidaten
		cmax = Math.max( cmax, getValue("otbi")*1.25, getValue("utbi")*1.25 );
	
	 	// Time Max
	 	var tmax = Math.max( param.hwz, param.tau) * 6;
	 	
	 	/////////////////////////
	 	// Graph Build
		this.graph.board( tmax, cmax );
	
	 	var abszisse = this.language.translate("ABSZISSE");
	 	var ordinate = this.language.translate("ORDINATE");
	    this.graph.coordinates(abszisse, ordinate);
	    
	    // Limits
	    this.graph.limit( getValue("utbi"), "rgba(50  ,255,50,0.4)");
	    this.graph.limit( getValue("otbi"), "rgba(255,50  ,50,0.4)");
			
	    this.graph.auc(param.cssmin, c0, param.tau, ke, ka, "rgba(255,255,255,0.6)","rgba(255,255,255,0.6)");	   		
			
		// Berechnungen
		if(param.c1 > 0 && param.t1 > 0  && param.c2 == 0 && param.t2 == 0)
		{
			this.graph.auc(ccssmin1a, dosis / cv1a, param.tau, cke1a, ka, "none"  , "rgba(0,150,200,0.6)"  );	   		    		     		
			this.graph.auc(ccssmin1b, dosis / cv1b, param.tau, cke1b, ka, "none", "rgba(0,200,200,0.6)");	   		    		
		}
			
		if(param.c1 > 0 && param.t1 > 0 && param.c2 > 0 && param.t2 > 0)
		{
			this.graph.auc(ccssmin2 , dosis / cv2,  param.tau, cke2 , ka, "none", "rgba(0,150,200,0.6)");	   		    		
		}
		    		
		// Punkte
		if(param.c1 > 0 && param.t1 > 0 && param.c2 == 0 && param.t2 == 0)
		{
			this.graph.point(param.c1, param.t1, "rgba(0,50,200,0.6)", 8);  	
		}
		if(param.c1 > 0 && param.t1 > 0 && param.c2 > 0 && param.t2 > 0)
		{
			this.graph.point(param.c1, param.t1, "rgba(0,50,200,0.6)", 8);  	
			this.graph.point(param.c2, param.t2, "rgba(0,100,200,0.6)", 8);  		
		}
		   		    		
		this.graph.legende();
	};


		// Konstruktor
		Graph = function() {
	
			var dummy = document.getElementsByTagName("kinetics")[0];
			
			if(!dummy) return;
					
			var container = document.createElement("div");
			container.style["position"] = "relative";
						
			var parent = dummy.parentNode;
			parent.replaceChild(container, dummy);
			
			// Container
			this.view = container; 
	
			// Dimensionen
			this.width = Number(dummy.getAttribute("width"));
			this.height = Number(dummy.getAttribute("height"));
			this.padding = Number(dummy.getAttribute("padding"));

			// Ursprung
			this.x0 = this.padding;
			this.xN = this.width - this.padding;
			this.y0 = this.height - this.padding;
			this.yN = this.padding;
	
			this.x = function(t) {
				return (this.x0 + ( t * this.xCorr ));
			};
	
			this.y = function(c) {
				return (this.y0 - ( c * this.yCorr ));
			};
	
			//Content
			this.contentWidth  = (this.xN - this.x0);   		
			this.contentHeight = (this.y0 - this.yN);
	
			// Skalierung
			this.xCorr = 1;
			this.yCorr = 1;  		
		};
    	
    	Graph.prototype.board = function(xMax, yMax) {
    		
    		var svg = document.getElementById("spiegel");
    		if(svg) this.view.removeChild(svg);
    		
    		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    		svg.id = "spiegel";
    			
    		svg.style.position = "absolute";
    		svg.style.top = "0px";
    		svg.style.left = "0px";
    		svg.style.width = this.width +"px";
    		svg.style.height = this.height + "px";
    			 		
	 		this.view.appendChild(svg); 			

			this.xCorr = this.contentWidth / xMax;
			this.yCorr = this.contentHeight / yMax;
    	};
    	
    	Graph.prototype.limit = function(limit, color) {

    		if(limit === 0) return;
    		
    		var svg = document.getElementById("spiegel");
    		
		 	    var grenze = document.createElementNS("http://www.w3.org/2000/svg", "line");
		 	    grenze.setAttribute("x1", this.x0);
		 	    grenze.setAttribute("y1", this.y0 - (limit * this.yCorr) );
		 	  	grenze.setAttribute("x2", this.xN);
		 	 	grenze.setAttribute("y2", this.y0 - (limit * this.yCorr));
		 		grenze.setAttribute("stroke", color);
		 		grenze.setAttribute("stroke-width", 10);

     		svg.appendChild(grenze);
    	};
    	
    	Graph.prototype.legende = function() {
    		
    		var svg = document.getElementById("spiegel");
    		
	 		var legende = document.createElementNS("http://www.w3.org/2000/svg", "text");
	 		legende.id = "legende";
	 		legende.setAttribute("visibility","collapse");
	 		svg.appendChild(legende);
    		
    		svg.onmouseover = function(event) {     	 		

				if(event.target.id == "punkt"){

					var daten = event.target.getAttributeNS("http://epha.ch/pharmacovigilance", "data");
					var json = JSON.parse( daten );		

					legende.setAttribute("fill", "#000000");
					legende.setAttribute("x", event.layerX -60);
					legende.setAttribute("y", event.layerY + 30);
					legende.setAttribute("visibility", "visible");
					legende.setAttribute("font-size", "1.2em");
					legende.setAttribute("color", "blue");

					legende.textContent = "C("+json.t.toFixed(0)+")= "+json.c.toFixed(0)+"mg/L";
				}else{
					legende.setAttribute("visibility", "collapse");
				}
    		};
    		
    	};
    	
    	Graph.prototype.coordinates = function(xLabel, yLabel) {
    		
    		var canvas = document.getElementById("can");
    		if(canvas) this.view.removeChild(canvas);
    		
    		canvas = document.createElement("canvas");
    		canvas.id = "can";
    		canvas.setAttribute("position","absolute");
    		canvas.setAttribute("top","0px");
    		canvas.setAttribute("left","0px");
    		canvas.setAttribute("height",this.height+"px");
    		canvas.setAttribute("width",this.width+"px");
    		this.view.appendChild(canvas);
    		
    		var ctx = canvas.getContext("2d");
    		ctx.clearRect(0, 0, this.width, this.height);
    		
    		// Tafel-Effekt
    		ctx.shadowOffsetX = 1;
    		ctx.shadowOffsetY = 1;
    		ctx.shadowBlur    = 1;
    		ctx.shadowColor   = 'rgba(50, 50, 50, 0.9)';

			ctx.beginPath();			
   	        ctx.strokeStyle="rgba(255,255,255,1)";
    	    ctx.fillStyle = "rgba(255,255,255,1)";
    	    ctx.lineWidth = "2";
    		var fontSize = 26;
    		
    	    // X axis
    	    ctx.moveTo(this.x0, this.y0);
    	    ctx.lineTo(this.xN, this.y0);
    	    ctx.font = fontSize+"px sans-serif";
 			// X Label
    	    ctx.fillText(xLabel, this.xN -20, this.y0 + fontSize*1.5);   	  
 			// X Tick Multiple
    	    var xStep = this.contentWidth / 6;

    	    for(var xMark = xStep; xMark < this.contentWidth; xMark += xStep){
    	    	 ctx.moveTo( this.x0 + xMark, this.y0 );
    	    	 ctx.lineTo( this.x0 + xMark, this.y0 + 10 );
    	     	 ctx.font = (fontSize*2/3)+"px sans-serif";

    	     	 ctx.fillText((xMark / this.xCorr).toFixed(0), this.x0 + xMark - ((xMark / this.Corr).toString().length * 4), this.y0 + fontSize * 2/3 * 1.5);
    	    }
    	     
    	     ctx.moveTo(this.xN, this.y0);
    	     ctx.lineTo(this.xN, this.y0-5);
    	     ctx.lineTo(this.xN+8, this.y0);
    	     ctx.lineTo(this.xN, this.y0+5);
    	     ctx.lineTo(this.xN, this.y0);
    
    	    
    	     // Y axis
    	     ctx.moveTo(this.x0, this.y0);
    	     ctx.lineTo(this.x0, this.yN);
    	     ctx.font = fontSize+"px sans-serif";
    	     // Y Label
    	     ctx.fillText(yLabel, 5, this.yN-20);
    	     // Y Tick Multiple
    	     var yStep = this.contentHeight / 10;
     
     	     for(var yMark = 0; yMark < this.contentHeight; yMark += yStep){
     	    	 ctx.moveTo( this.x0 - 10, this.y0 - yMark);
     	    	 ctx.lineTo( this.x0, this.y0 - yMark);
     	     	 ctx.font = (fontSize*2/3)+"px sans-serif";
    	     	 ctx.fillText((yMark / this.yCorr).toFixed(0),  5, this.y0 - yMark + 5);
    	     }

       	     ctx.moveTo(this.x0, this.yN);
    	     ctx.lineTo(this.x0-5, this.yN);
    	     ctx.lineTo(this.x0, this.yN-8);
    	     ctx.lineTo(this.x0+5, this.yN);
    	     ctx.lineTo(this.x0, this.yN);
    	     ctx.fill();
     	     
     	    ctx.stroke(); 	     
     	    ctx.closePath(); 
    	};

    
    	Graph.prototype.auc = function(css, c0, intervall, ke, ka, fill, stroke) {
    		
    		var svg = document.getElementById("spiegel");

     	    var conc = document.createElementNS("http://www.w3.org/2000/svg", "path");
     	    svg.appendChild(conc);

     	    // Zeitverlauf
     	    var verlauf = "M"+ this.x0+ " "+ this.y0;
     	    var zeit = this.contentWidth / this.xCorr;   	    
    		
			for(var t = 0; t < zeit; t++){

				// Addieren für Zeitpunkt t
				var c = dose(c0, intervall, ka, ke, t);

				// Vorhandene Konzentration ohne Absorbtion
				c += css * param.getFraction(ke, t, 0);
				// Vorhandene Konzentration mit Absorbtion
				//c += css * Kinetic.getFraction(ke, t, ka);

				verlauf += " L" + this.x(t) + " " + this.y(c);		

				this.point(c, t, stroke, 4);
			}   	


			// Rekursive Function AUC
	    	function dose(c0, intervall, ka, ke, t) {

	    		var c = c0 * param.getFraction(ke,t,ka);

	    		if(t >= intervall){ 
	    			c += dose(c0, intervall, ka, ke, t-intervall); 
	    		}

	    		return c;
	    	}
    	    if(fill != "none"){
    	    	conc.setAttribute("d", verlauf + " L"+this.x(zeit -1)+" "+this.y(0)+" Z");     	    	
    	    }else{
    	    	conc.setAttribute("d", verlauf);     	    	    	    	
    	    }
     	    conc.setAttribute("fill", fill);
     	    
     	    if(stroke)
     	    conc.setAttribute("stroke", stroke);
     	 	conc.setAttribute("stroke-width", 3);  		
    	};
    	
    	Graph.prototype.point = function(c, t, stroke, radius){
    		
    		var svg = document.getElementById("spiegel");
    		
     		var punkt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
     		punkt.id = "punkt";
     		punkt.setAttribute("cx", this.x( t ) );
     		punkt.setAttribute("cy", this.y( c ) );
     		punkt.setAttribute("r", radius);
     		
     		punkt.setAttribute("fill", stroke);
     	 	
     		punkt.setAttributeNS("http://epha.ch/pharmacovigilance", "data", "{\"c\":"+c+",\"t\":"+t+"}" );

     		svg.appendChild(punkt); 		
    	};

		Kinetic = function() {
	
			this.bio = 100;
			this.dosierung = 0;	
			this.tau = 0;
			this.cssmin = 0;
	
			this.tin = 0;
			this.hwz = 0;
			this.v = 0;
	
			this.c1 = 0;
			this.t1 = 0;
	
			this.c2 = 0;
			this.t2 = 0;
	
			this.otb = 0;
			this.utb = 0;
		};
	    	
	    	Kinetic.prototype.getFraction = function(ke, t, ka){
	    		
	    		if(!ka || ka == 0){
	    			 return Math.exp( -ke*t);
	    		}else{
	    			return (ka / (ka -ke)) * ( Math.exp( -ke*t) - Math.exp( -ka*t) );	    			
	    		}
	    		
	    	};
	    	
	    	Kinetic.prototype.getAccu = function(ke, t, ka){
	    		return (1 - this.getFraction(ke, t, ka) );
	    	};
	    	
	    	Kinetic.prototype.getVolume = function(dosis, tau, c, t, ke, ka){  		
	    		return this.getConcentration(dosis, tau, c, t, ke, ka);
	    	};
	    	
	    	Kinetic.prototype.getConcentration = function(dosis, tau, v, t, ke, ka){
	
	    		if(!ka || ka == 0){
	    			//////////////////////////////////////// 
	    			//  dosis		  1
	    			// ------ * --------------- * e*-ke*t = c
	    			//    v     ( 1 - e*-k*tau)
	    			////////////////////////////////////////    	
	    			var timepoint = ( t == 0) ? tau : t % tau;
	
	
	    			return ( dosis / v ) * (1 / this.getAccu(ke, tau) ) * this.getFraction(ke, timepoint);    				
	    			
	    		}else{
	    			//////////////////////////////////////////////////////////////////// 
	    			//  dosis		ka		  (    e*-ke*t			    e*-ka*t    )
	    			// ------ * ----------- * (--------------  -   ----------------) = c
	    			//    v     ( ka - ke )	  ( 1 - e*-ke*tau)		(1 - e*-ka*tau))
	    			////////////////////////////////////////////////////////////////////   			    			
	    			return ( dosis / v ) * (ka / (ka - ke)) * ( (this.getFraction(ke, t % tau) / this.getAccu(ke, tau) ) - (this.getFraction(ka, t % tau) / this.getAccu(ka, tau) ) ) ;	    			
	    		}
	    		
	    	};
	    	
	    	Kinetic.prototype.getElimination = function(ke, c0, css1, css1o) { 		
	    		//////////////////////////////////////// 
	    		// ln( Cmax + Css1  / Css1  )
	    		// -------------------------- * k = k'
	    		// ln( Cmax + Css1o / Css1o )
	    		//////////////////////////////////////
	    		return ke  * Math.log( (c0 + css1) / css1 ) / Math.log( (c0 + css1o ) / css1o);
	    	};
	    	
	    	Kinetic.prototype.toHash = function(){
	    		
	    		var hash = [];
	    		
	    		for(parameter in this){
	    			
	    			if(typeof(this[parameter]) == "number" && this[parameter] > 0){
	    				hash.push(parameter +"="+this[parameter]);    				
	    			}
	    		}
	    		return hash.join("&");
	    	};
	    	
	    	Kinetic.prototype.toInput = function() {
	    		
	    		for(parameter in this){
	    			
	    			if(typeof(this[parameter]) == "number"){
	
	    				if(getElement(parameter+"i"))
    					{
	    					getElement(parameter+"i").value = this[parameter];    					
    					}
	    			}  			
	    		}
	    	};
	    	
	    	Kinetic.prototype.fromInput = function() {
	    		
	    		for(parameter in this){
	    			
	    			if(typeof(this[parameter]) == "number"){
	    				this[parameter] = getValue(parameter+"i");
	    			}  			
	    		}
	    		 
	    	};

  
// Utility functions
function zuweisen(e){
	if( e.split("=")[0] in param){
		param[ e.split("=")[0] ] = parseFloat( e.split("=")[1] );
	}
}

function getElement(id) {
	return document.getElementById(id);
}

function getValue(id) {
	return parseFloat( document.getElementById(id).value );	
}


	
    	