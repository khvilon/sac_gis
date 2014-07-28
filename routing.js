OLMap.prototype.route =  function()
{
	this.routing = true;
	//this.map.cursor =
  //place car
}


OLMap.prototype.routeStartSelected =  function(lat, lon)
{
	//route
}


OLMap.prototype.showRadarWaiter =  function()
{
	var pathBack = this.hostIP + '/static/compile/js/olmap/images/radar_waiter_back.png';
	var pathArrow = this.hostIP + '/static/compile/js/olmap/imagesradar_waiter_arrow.png';
	var html = "<img src='"+pathBack+"' style='position:absolute; left:0px; top:0px'>";
	html+= "<img src='"+pathArrow+"' style='position:absolute; left:50%; top:51%'>";
}