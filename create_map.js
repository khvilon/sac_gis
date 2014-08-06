OLMap.prototype.createMap =  function()
{

	//creating OpenLayers map object//
    this.map = new OpenLayers.Map(
    {
        div: this.divName,
       	projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
		controls: []
    });

	//zoom event//
	this.map.events.register('zoomend', this, function(zoom_event)
	{
		var zoom = zoom_event.object.getZoom();
		if(this.maxZoom != null && this.maxZoom > zoom)
			this.hide();
	});

	//adding default controls on map//
//	this.map.addControl(new OpenLayers.Control.LayerSwitcher());
    this.map.addControl(new OpenLayers.Control.Navigation());
}

//Add ONE descripted mapserver layer
OLMap.prototype.addMapserverLayer =  function(layerName, layerRuName, isBase)
{	if(isBase === undefined) isBase = false;
	var layer = new OpenLayers.Layer.TMS( layerRuName, this.mapServer,
		{layername: layerName, type:'png', opacity: 1, isBaseLayer: isBase});
	this.map.addLayer(layer);
	return layer;
}

//Add ALL mapserver layers by addMapserverLayer
OLMap.prototype.addMapserverLayers =  function()
{
	this.msLayer = this.addMapserverLayer('osm@g', "BaseMapServer", true);
	this.waterLayer = this.addMapserverLayer('water@g', "Реки и озера");
	this.roadLayer = this.addMapserverLayer('road@g', "Дороги");
	this.railwayLayer = this.addMapserverLayer('railway@g', "Железные дороги");
}

OLMap.prototype.addOSMLayer =  function()
{
	this.osmLayer = new OpenLayers.Layer.OSM();
	this.map.addLayer(this.osmLayer);
}

OLMap.prototype.addOSMLocalLayer =  function()
{
	this.osmLocalLayer = new OpenLayers.Layer.OSM("Локальная OSM карта",
	this.hostIP + "/static/compile/js/olmap/tiles/${z}/${x}/${y}.png", {numZoomLevels: 17, alpha: true, isBaseLayer: true});
    this.map.addLayers([this.osmLocalLayer]);
}

OLMap.prototype.addBaseLayers = function()
{
	if (this.type == "lpu") this.addMapserverLayers();//this.addOSMLayer();}
	else if (this.type == "avto") this.addMapserverLayers();
	else if (this.type == "vimpel") this.addMapserverLayers();
}