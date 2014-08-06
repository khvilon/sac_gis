OLMap.prototype.centerMos =  function()
{
    this.map.setCenter(this.newLonLat(55.9, 37.2),9);
}

OLMap.prototype.maskSubj =  function(geom)
{

    var wkt_options =
    {
        'internalProjection': this.map.baseLayer.projection,
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    };
	wkt = new OpenLayers.Format.WKT(wkt_options);

	var holeFeature = wkt.read(geom);

	var bgPoly = this.map.getExtent().toGeometry();
	var bgPolyFeature = new OpenLayers.Feature.Vector(bgPoly);

	function Subtract(bigFeature, smallFeature)
    {
 	   var newPolygon = new OpenLayers.Geometry.Polygon(bigFeature.geometry.components);
 	   var newFeature = new OpenLayers.Feature.Vector(newPolygon);

 	   newPolygon.addComponent(smallFeature.geometry.components[0]);

  	  return newFeature;
	}

	var maskFeature = Subtract(bgPolyFeature, holeFeature);

	this.maskLayer.addFeatures([maskFeature]);


}


OLMap.prototype.centerSubj =  function(data)
{

		var pnt1 = this.newPnt(data.min_lat, data.min_lon);
        var pnt2 = this.newPnt(data.max_lat, data.max_lon);

		var bounds = new OpenLayers.Bounds(pnt1.x, pnt1.y, pnt2.x, pnt2.y);

		this.map.zoomToExtent(bounds);

		this.maxZoom = this.map.getZoom();

        this.maskSubj(data.polygone);

        this.map.setOptions({restrictedExtent: this.map.getExtent()});


        if(this.type == 'avto')this.regionsManager.getRequisitions(id);
		else if(this.type == 'lpu')
		{
			bounds = this.map.getExtent();
			var min_lonlat = this.toEPSG4326(new OpenLayers.LonLat(bounds.left, bounds.bottom));
			var max_lonlat = this.toEPSG4326(new OpenLayers.LonLat(bounds.right,bounds.top));
			this.regionsManager.getLpus(min_lonlat.lat, min_lonlat.lon, max_lonlat.lat, max_lonlat.lon);		//	var min_lat = this.toEPSG4326();
		//	var min_lon = this.toEPSG4326();
		//	var max_lat = this.toEPSG4326(bounds.bottom);
		//	var max_lon = this.toEPSG4326(bounds.right);
		//	this.regionsManager.getLpus(min_lat, min_lon, max_lat, max_lon);
		}
		else if(this.type == 'vimpel')
		{
			bounds = this.map.getExtent();
			var min_lonlat = this.toEPSG4326(new OpenLayers.LonLat(bounds.left, bounds.bottom));
			var max_lonlat = this.toEPSG4326(new OpenLayers.LonLat(bounds.right,bounds.top));
			this.regionsManager.getStations(min_lonlat.lat, min_lonlat.lon, max_lonlat.lat, max_lonlat.lon);
		//	var min_lat = this.toEPSG4326();
		//	var min_lon = this.toEPSG4326();
		//	var max_lat = this.toEPSG4326(bounds.bottom);
		//	var max_lon = this.toEPSG4326(bounds.right);
		//	this.regionsManager.getLpus(min_lat, min_lon, max_lat, max_lon);
		}
}