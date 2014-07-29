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
         	var lonlat = me.map.getLonLatFromPixel(e.xy);
                    alert("You clicked near " + lonlat.lat + " N, " +
                                              + lonlat.lon + " E");
            me.routeStartSelected(lonlat.lat,lonlat.lon);
		}

	});

	this.clickControl = new OpenLayers.Control.Click();
	this.map.addControl(this.clickControl);}


OLMap.prototype.route =  function()
{
	$('#' + this.divName).css('cursor', 'crosshair');
//	this.map.style.cursor =  'crosshair';
//	var me = this;
	this.clickControl.activate();
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{
	this.showRadarWaiter();


}


OLMap.prototype.showRadarWaiter =  function()
{
	var pathBack = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_back.png';
	var pathArrow = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_arrow.png';
	var html = "<img src='"+pathBack+"' style='position:absolute; left:0px; top:0px; z-index:1000'>";
	html+= "<img src='"+pathArrow+"' style='position:absolute; left:0px; top:0px; z-index:1000'>";
	$("#"+this.divName).append(html);
}