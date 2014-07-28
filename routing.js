OLMap.prototype.route =  function()
{
//	this.map.style.cursor =  'crosshair';

	var me = this;

	this.map.events.register('click', this.map, function(click_event)
	{
		alert(click_event);
//		me.map.style.cursor = 'default';
		me.map.events.unregister('click', me.map);
		me.routeStartSelected(35,55);
	});
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
	html+= "<img src='"+pathArrow+"' style='position:absolute; left:50%; top:51%; z-index:1000'>";
	$("#"+this.divName).append(html);
}