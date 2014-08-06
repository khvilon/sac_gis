OLVectorStyle =
{
	mask: new OpenLayers.StyleMap(
	{
        pointRadius: 10,
        strokeWidth: 2,
        fillOpacity: 0.5,
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeColor: "#ffffff",
        fillColor: "#000033"
	}),


	lpu: new OpenLayers.StyleMap(
   	{
         externalGraphic: "${path}",
	  	graphicWidth: 22,
	  	graphicHeight: 32,
	  	pointRadius: 100
	}),

    requisitions: new OpenLayers.StyleMap(
   	{
        externalGraphic: "${path}",
	  	graphicWidth: 42,
	  	graphicHeight: 42,
	  	pointRadius: 100
	}),

	ambulance: new OpenLayers.StyleMap(
   	{
        externalGraphic: "${path}",
	  	graphicWidth: 45,
	  	graphicHeight: 28,
	  	pointRadius: 100
	}),

	stations: new OpenLayers.StyleMap(
   	{
        externalGraphic: "${path}",
	  	graphicWidth: 43,
	  	graphicHeight: 43,
	  	pointRadius: 100
	}),
};


OLMap.prototype.addVectorLayers = function()
{
	var me = this;
	function addVectorLayer(name, styleMap, projection)
	{
		var args = {styleMap: styleMap, renderers: ['VML', 'Canvas' ]};
		if(projection) args.projection = projection;
		var layer = new OpenLayers.Layer.Vector(name, args);
	    me.map.addLayer(layer);
	    return layer;
	}

    this.maskLayer = addVectorLayer("Затемнение", OLVectorStyle.mask);

    if (this.type == "lpu")
    {
	   this.lpuLayer = addVectorLayer("ЛПУ", OLVectorStyle.lpu);

	   this.ambulanceLayer = addVectorLayer("Скорая", OLVectorStyle.ambulance);
	}
    else if (this.type == "vimpel")
	   this.stationsLayer = addVectorLayer("Базовые станции", OLVectorStyle.stations);
    else if (this.type == "avto")
	   this.requisitionsLayer = addVectorLayer("Обращения", OLVectorStyle.requisitions);


};