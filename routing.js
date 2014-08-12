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
	$('#' + this.divName).css('cursor', 'crosshair');
	this.clickControl.activate();
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{	this.addAmbulance(lat, lon);
	this.showRadarWaiter();
	this.routeLPU(lat, lon, 0);
}

OLMap.prototype.routeLPU =  function(lat, lon, i)
{
   	if(this.lpus.length == 0) return;

	var url = "http://route-maps.yandex.ru/1.x/?" +
    	"format=json&avoidTrafficJams=false&rll=" + lat + "," + lon +
    	"~" + this.lpus[i].lat + "," + this.lpus[i].lon +
        "&lang=ru-RU";

	url = window.btoa(url);
   	var ajaxPath =  this.hostIP + "/arm/proxy?url=" + url;

	var me = this;

    var callback;
    if(i==this.lpus.length-1)
    {
    	callback = function(data)
    	{
    		me.drawPath(data);    		me.hideRadarWaiter();    	};
    }
    else
    {
    	callback = function(data)
    	{    		me.drawPath(data);
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
		center: ["50%", "513px"],//"500px"],
	});
}

OLMap.prototype.hideRadarWaiter =  function()
{	$("#radar_arrow").hide();
    $("#radar_back").hide();
	$("#radar_arrow").stopRotate();}

OLMap.prototype.pntsFromYData = function(data)
{
	console.log("data " + data);
	if(data == null) return null;
	var obj = $.parseJSON(data);
	console.log("obj " + obj);
	return obj;
}

OLMap.prototype.pathStyle =
{
		strokeColor: "blue",
		strokeOpacity: 0.6,
    	strokeWidth: 4
}


OLMap.prototype.drawPath =  function(data)
{
	var points = this.pntsFromYData(data);
	if(data == null) return;

    var line = new OpenLayers.Geometry.LineString(points);
	var lineFeature = new OpenLayers.Feature.Vector(line, null, this.pathStyle);
	this.ambulanceLayer.addFeatures([lineFeature]);

	//if(!noZoom) this.map.zoomToExtent(line.getBounds());

    //return line.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))/1000;
}