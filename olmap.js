function OLMap(parentName, hostIP, type, mapServerIP, divsToHide, regionsManager, onClose)
{
	this.divName = 'gis_div';
	this.parentName = parentName;
	this.parentDiv = document.getElementById(parentName);
	//this.div = this.createDiv();

	this.onClose = onClose;

	this.divsToHide = divsToHide;

	this.regionsManager = regionsManager;


	this.hostIP = hostIP;
	this.path = this.hostIP + '/static/compile/js/olmap';
	this.mapServer = mapServerIP + "/mapcache/tms/";  //"http://sac.khvi.ru:82/mapcache/tms/"
	this.type = type;

    	this.loadLib();
}


OLMap.prototype.init = function()
{
	OpenLayers.Lang.setCode("ru");
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

	this.createMap();
	this.addBaseLayers();
	this.addVectorLayers();

	this.addLayersMenu();
	this.addCustomControls();
	this.initRoute();
	return true;
};


OLMap.prototype.loadLib = function()
{
	var kLoader = new KScriptLoader();

	var urls = ['create_map','markers','subj','tools','vector_layers', 'controls', 'show_hide',
	 'routing', 'jQueryRotate'];
	for(var i = 0; i < urls.length; i++){urls[i] = this.path +'/'+ urls[i] + '.js';}

    var me = this;
	kLoader.add(urls);
	//kLoader.add(function() {me.init()});
	kLoader.run();
};

OLMap.prototype.createDiv = function()
{
	this.div = document.createElement('div');

	this.div.style.width = "90%";
	this.div.style.height = "80%";
	this.div.style.position = "absolute";
	this.div.style.left = "5%";
	this.div.style.top = "13%";
	this.div.style.background = "#77a4d4";
	this.div.style.borderStyle = "solid";
	this.div.style.borderWidth = "2px";
	this.div.style.borderColor = "#79a7d9";
	this.div.style.overflow = "hidden";
	this.div.style.zIndex = 1000;
//	this.div.style.display = 'none';
	this.div.id = this.divName;

	this.parentDiv.appendChild(this.div);
};

