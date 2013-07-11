/**
 * Created by Marco Egbring on March 2013
 * Copyright 2013 EPha.ch. All rights reserved.
 */

/**
 * COMMANDS
 * @param data
 */
Events = 
{	
	START:"start",
	REQUEST:"request",
	RESPONSE:"response"
};

function startCommand( event )
{	
	// CLIENTWIDTH AVAILABLE
	DOM( "app" ).show();

	// HANDLER FOR STROAGE RESULTS
	DOM( window ).onMSG( Events.RESPONSE );
	
	//DOM("app").style("top","40px");
	
	DOM("xauth").addChild( "iframe", { id:"apiId", src : app.konto, style:"position:fixed; width:100%; height:42px; border:none;"} ).onLoad( Events.REQUEST, {} );
	
	app.storage = document.getElementById( "apiId" ).contentWindow;
	
	var kinetics = new Kinetics();
	
	kinetics.start();
};

function requestCommand( data )
{
	if( data.request == "REDIRECT")	app.storage.postMessage( { request:"REDIRECT", target:data.target }, "*");	
};

function responseCommand( data )
{
	if( data.request == "REDIRECT") location.replace(data.target);  	
};