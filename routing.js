OLMap.prototype.initRoute =  function()
{	var me = this;

	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control,
	{
		defaultHandlerOptions:
		{
			'single': true,
			'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
		},

		initialize: function(options)
		{
			this.handlerOptions = OpenLayers.Util.extend( {}, this.defaultHandlerOptions);

			OpenLayers.Control.prototype.initialize.apply(this, arguments);

            this.handler = new OpenLayers.Handler.Click(this, {'click': this.trigger}, this.handlerOptions );
  		},

        trigger: function(e)
        {        	me.clickControl.deactivate();
        	$('#' + me.divName).css('cursor', 'default');
         	var lonlat = me.toEPSG4326(me.map.getLonLatFromPixel(e.xy));

			me.map.setCenter(me.map.getLonLatFromPixel(e.xy));
            me.routeStartSelected(lonlat.lat,lonlat.lon);
		}

	});

	this.clickControl = new OpenLayers.Control.Click();
	this.map.addControl(this.clickControl);

	var pathBack = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_back.png';
	var pathArrow = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_arrow.png';
	var html = "<img src='"+pathBack+"' id='radar_back' style='position:absolute; left:0px; top:0px; z-index:1000; display:none'>";
	html+= "<img src='"+pathArrow+"' width='2000px' id='radar_arrow' style='position:absolute; left:-136px; top:-81px; z-index:1000; display:none'>";
	$("#"+this.divName).append(html);}


OLMap.prototype.route =  function()
{
	if(this.clickControl.active)
	{
		me.clickControl.deactivate();
        $('#' + me.divName).css('cursor', 'default');
	}
	else
	{
		this.ambulanceLayer.removeAllFeatures();
		$('#' + this.divName).css('cursor', 'crosshair');
		this.clickControl.activate();
	}
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{	this.addAmbulance(lat, lon);
	this.showRadarWaiter();
	this.routeLPU(lat, lon, 0);
}

OLMap.prototype.routeLPU =  function(lat, lon, i)
{
   	if(this.lpus.length == 0) return;



	var url = "route-maps.yandex.ru/1.x/?" +
    	"format=json&avoidTrafficJams=false&rll=" + lon + "," + lat +
    	"~" + this.lpus[i].lon + "," + this.lpus[i].lat +
        "&lang=ru-RU";

	url = encodeURIComponent(url);
   	var ajaxPath =  this.hostIP + "/arm/proxy?url=" + url;

	var me = this;

    var callback;
    if(i==this.lpus.length-1)
    {
    	callback = function(data)
    	{
    		setTimeout(me.drawPath(data), 0);    		me.hideRadarWaiter();    	};
    }
    else
    {
    	callback = function(data)
    	{    		setTimeout(me.drawPath(data), 0);
    		me.routeLPU(lat, lon, i+1);
    	};
    }


   $.get(ajaxPath,callback);
}


OLMap.prototype.showRadarWaiter =  function()
{
	$("#radar_arrow").show();
    $("#radar_back").show();

	var repeats = 100;
	var animateTo = repeats*360;
	var duration = repeats * 70 * 1000;
	$("#radar_arrow").rotate(
	{
		angle:-90,
		animateTo:animateTo,
		duration:duration,
		center: ["50%", "513px"],
	});
}

OLMap.prototype.hideRadarWaiter =  function()
{	$("#radar_arrow").hide();
    $("#radar_back").hide();
	$("#radar_arrow").stopRotate();}

OLMap.prototype.pntsFromYData = function(data)
{
    data = data.replace(new RegExp("&quot;",'g'),'"');
	var obj = $.parseJSON(data);
	if(obj.features == null) return;
	if(obj.features.length < 3) return;
	obj.points = [];
    var me = this;
	for(var i = 0; i <  obj.features[1].features.length; i++)
	{		$.each(   obj.features[1].features[i].geometry.geometries[0].coordinates,
			function(key, coords )
	    {
	    	var lon = coords[0];
	    	var lat = coords[1];
	    	obj.points.push(me.newPnt(lat, lon));
	    });	}
	obj.time =   parseInt(obj.features[1].properties.RouterRouteMetaData.time)/60;
	obj.timeJams = parseInt(obj.features[1].properties.RouterRouteMetaData.jamsTime)/60;

	return obj;
}

OLMap.prototype.drawPath =  function(data)
{
	var maxMinutes = 31;

	if(data == null) return;
	if(data.indexOf("Bad request") !=-1) return;
	var obj = this.pntsFromYData(data);
    if(obj.points == null) return;

    var pathStyle = new Object();
    pathStyle.strokeOpacity = 0.6;
    pathStyle.strokeWidth = 3;
    //{strokeOpacity: 0.6,strokeWidth: 3}

    if(obj.time < maxMinutes && obj.timeJams < maxMinutes) pathStyle.strokeColor='green';
    else if(obj.time < maxMinutes) pathStyle.strokeColor='yellow';
    else pathStyle.strokeColor='red';

    var line = new OpenLayers.Geometry.LineString([]);//obj.points);
	var lineFeature = new OpenLayers.Feature.Vector(line, null, pathStyle);

	this.ambulanceLayer.addFeatures([lineFeature]);

	drawLineSlow =  function(line, obj, 0);
	//if(!noZoom) this.map.zoomToExtent(line.getBounds());

    //return line.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))/1000;
}

OLMap.prototype.drawLineSlow =  function(line, obj, ind)
{	if(ind == obj.points.length) return;	line.addPoint(obj.points[ind]);
	setTimeout(this.drawLineSlow(line, obj, ind+1), 10);}