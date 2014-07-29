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

			me.map.setCenter(lonlat);
            me.routeStartSelected(lonlat.lat,lonlat.lon);
		}

	});

	this.clickControl = new OpenLayers.Control.Click();
	this.map.addControl(this.clickControl);}


OLMap.prototype.route =  function()
{
	$('#' + this.divName).css('cursor', 'crosshair');
	this.clickControl.activate();
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{
	this.showRadarWaiter();

	//for(var i = 0; i < c; i++)
	//{
    	/*var ajaxPath =  "http://route-maps.yandex.ru/1.x/?" +
    	"format=json&avoidTrafficJams=false&rll=" lon "," + lat +
    	"~" + prepCoord(obj._coords[3]) + "," + prepCoord(obj._coords[2]) +
        "&lang=ru-RU";

		$.getJSON(ajaxPath, callback); */
	//}
}

OLMap.prototype.routeLPU =  function(lat, lon, i)
{

    	/*var ajaxPath =  "http://route-maps.yandex.ru/1.x/?" +
    	"format=json&avoidTrafficJams=false&rll=" lon "," + lat +
    	"~" + prepCoord(obj._coords[3]) + "," + prepCoord(obj._coords[2]) +
        "&lang=ru-RU";

		$.getJSON(ajaxPath, callback); */

}


OLMap.prototype.showRadarWaiter =  function()
{
	var pathBack = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_back.png';
	var pathArrow = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_arrow.png';
	var html = "<img src='"+pathBack+"' id='radar_back' style='position:absolute; left:0px; top:0px; z-index:1000'>";
	html+= "<img src='"+pathArrow+"' id='radar_arrow' style='position:absolute; left:0px; top:0px; z-index:1000'>";
	$("#"+this.divName).append(html);
	$("#radar_arrow").rotate(
	{
		angle:-90,
		animateTo:5*360,
		duration:5*8*1000,
	});
}