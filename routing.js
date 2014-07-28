OLMap.prototype.route =  function()
{
	this.map.cursor =  'crosshair';

	var me = this;

	this.map.events.register('click', this, function(click_event)
	{
		alert(click_event);
		me.map.cursor = 'default';
		me.map.events.unregister('click');
		routeStartSelected(35,55);
	});
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{
	showRadarWaiter();


}


OLMap.prototype.showRadarWaiter =  function()
{
	var pathBack = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_back.png';
	var pathArrow = this.hostIP + '/static/compile/js/olmap/imagesradar_waiter_arrow.png';
	var html = "<img src='"+pathBack+"' style='position:absolute; left:0px; top:0px'>";
	html+= "<img src='"+pathArrow+"' style='position:absolute; left:50%; top:51%'>";
	$(this.map).append(html);
}