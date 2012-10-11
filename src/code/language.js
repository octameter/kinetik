
Language = function() 
{	
	this.element = null;
	
	this.sprache = document.documentElement.lang;
};

	Language.data = {};
    	
	Language.prototype.setAuswahlElement = function(element)
	{
		this.element = document.getElementById(element);		
	};
	
	Language.prototype.setAuswahl = function()
	{
		for(var i = 0; i < this.element.options.length; i++)
		{
			if(this.sprache === this.element.options[i].value)
			{
				this.element.options[i].selected = true;
			}
			else
			{
				this.element.options[i].selected = false;				
			}
		}
	};
	
	Language.prototype.setLanguage = function(event) 
	{
    	
    	if(event)
    	{
    		var idx = event.selectedIndex;
    		this.sprache = event.options[idx].value;
    	}
    	else
    	{
    		if(window["localStorage"] && window["localStorage"].sprache)
    		{
    			this.sprache = window["localStorage"].sprache;	
    			this.setAuswahl();
    		}
	
    	}
    	
    	if(Language.data[this.sprache])
    	{
    		Language.data.sprache = this.sprache;
    		this.translateElements();
    		
    		if(window["localStorage"])
    		{
    			window["localStorage"].sprache = this.sprache;
    		}

    	}
    	else
    	{
    		alert("Language has not been translated, yet!\n\n**Want to contribute\n**Email: support@epha.ch");
    	}

    };
    
    Language.prototype.translateElements = function() 
    {    	
    	var toTranslate = [];
    	toTranslate.push("DOSIERUNG","F","DOSIS","INTERVALL","PREDOSE","SPRACHE");
    	toTranslate.push("POPULATIONSDATEN","ABSORPTION","HALBWERTSZEIT","VOLUMEN","CLEARANCE","ELIKONSTANTE");
    	toTranslate.push("PERSONALISIERUNG","KONZENTRATION1","ZEIT1","KONZENTRATION2","ZEIT2","RECHENART");
    	toTranslate.push("BEREICH","OBERE_GRENZE","UNTERE_GRENZE");
    	
    	toTranslate.forEach(function(e){
    		Language.translate(e,e);
    	});
    };

    Language.translate = function(vokabel, element) 
    {
    	var woerterbuch = Language.data[ Language.data.sprache ];
    	
    	if(element){
			temp = getElement(element).innerHTML = woerterbuch[vokabel];
			getElement(element).title = woerterbuch[vokabel+"_INFO"];	   
    	}else{
    		return woerterbuch[vokabel];
    	}
    };