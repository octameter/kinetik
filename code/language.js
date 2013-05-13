	// Konstructor
	Language = function() 
	{
		this.sprachen = Language.data;
		
		this.select = null;
		
		this.vokabeln = [];
	};
	
	// For files to have a place to live
	Language.data = {};

	Language.prototype.sprache = document.documentElement.lang;
	
	Language.prototype.createSelect = function()
	{

		// IF SELECT IN HTML5 EMBEDDED
		if(!document.getElementById("sprache"))
		{
			this.select = document.createElement("select");
			this.select.id = "sprache";
			
			for(var i = 0; i < arguments.length; i++)
			{
				var option = document.createElement("option");
				option.setAttribute("value", arguments[i]);
				option.innerHTML = arguments[i].toUpperCase();			
				this.select.appendChild(option);
			}				
		} 
		else
		{
			this.select = document.getElementById("sprache");		
		}		

		this.select.addEventListener("change", function(event)
		{
			this.setLanguage(event.target);
		}
		.bind(this), false);		
	};
	
	Language.prototype.setOption = function()
	{
		if(!this.select) return;
		
		for(var i = 0; i < this.select.options.length; i++)
		{
			if(this.sprache == this.select.options[i].value)
			{
				this.select.options[i].selected = true;
			}
			else
			{
				this.select.options[i].selected = false;				
			}
		}

	};
	
	Language.prototype.getPreference = function(vorgabe)
	{	
		if(window["localStorage"] && window["localStorage"].sprache)
		{
			this.sprache = window["localStorage"].sprache;			
		}
		else
		{
			this.sprache = vorgabe;
		}
		this.setOption();
	};
	
	Language.prototype.setPreference = function()
	{
		if(window["localStorage"])
		{
			window["localStorage"].sprache = this.sprache;
		}
	};
	
	Language.prototype.setLanguage = function(event) 
	{   	
    	if(event)
    	{
    		var idx = event.selectedIndex;
    		this.sprache = event.options[idx].value;
    	}
    	
    	if( this.sprachen[ this.sprache ] )
    	{   		
    		this.translateAll();
    		this.setPreference();
    	}
    	else
    	{
    		this.getPreference("en");
    		alert("Language has not been translated, yet!\n\n**Want to contribute\n**Email: support@epha.ch");
    	}

    };
    
    Language.prototype.translateAll = function()
    {
    	this.vokabeln.forEach(function(e)
        {
    		this.translate(e,e);
        }
        .bind(this));
    };

    Language.prototype.translate = function(vokabel, element) 
    {
    	var woerterbuch = this.sprachen[ this.sprache ];
    	
    	if(element)
    	{
    		var e = document.getElementById(element);		
			e.innerHTML = woerterbuch[vokabel];
			e.title = woerterbuch[vokabel+"_INFO"];	   
    	}
    	else
    	{
    		return woerterbuch[vokabel];
    	}
    };