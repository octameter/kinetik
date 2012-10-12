
	
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
	
	Language.prototype.setSelect = function(element)
	{
		this.select = document.getElementById(element);	
		
		if(this.select)
		{
			this.select.addEventListener("change", function(event)
			{
				this.setLanguage(event.target);
			}
			.bind(this), false);		
		}
		
		return (!!this.select);
	};
	
	Language.prototype.setOption = function()
	{
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
	
	Language.prototype.getPreference = function()
	{	
		if(window["localStorage"] && window["localStorage"].sprache)
		{
			this.sprache = window["localStorage"].sprache;	
			
			this.setOption();
		}
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
    	
    	if(element){
			document.getElementById(element).innerHTML = woerterbuch[vokabel];
			document.getElementById(element).title = woerterbuch[vokabel+"_INFO"];	   
    	}else{
    		return woerterbuch[vokabel];
    	}
    };