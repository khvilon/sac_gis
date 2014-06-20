var olmap;
var gisParentDiv;
var gisDiv;
var gisDivsToHide = [];

function loadOLMAPLibs()
{	var kLoader = new KScriptLoader();

	var p = 'map/';
	var urls = [
	'olmap',
	'create_map',
	'markers',
	'subj',
	'tools',
	'vactor_layers'];
	for(var i = 0; i < urls.length; i++){urls[i] = p + urls[i] + '.js';}

	kLoader.add(urls);
	kLoader.add(function(){updateMainMask('подключаются основные модули');});
}


function initGis(parentDiv, divsToHide)
{



	for(var i = 0; i < divsToHide.length; i++)
	{		var d = document.getElementById(divsToHide[i]);
		d.style.temp_display=d.style.temp_display;
		d.temp_className = d.className;
		gisDivsToHideStyles.push(style);	}
}

function showGis(id)
{
	gisParentDiv.appendChild(gisDiv);

	for(var i = 0; i < gisDivsToHideStyles.length; i++)
	{		gisDivsToHideStyles[i].className = '';
		gisDivsToHideStyles[i].style.display = 'none';	}


    olmap = new OLMap();
    olmap.init("gis_div", this.app.apiHost, ConfigApp["SAC_TYPE"]);

    this.app.regionsManagerLocal.geRegionLatLonById(id);
    if(ConfigApp["SAC_TYPE"] == 'avto')this.app.regionsManagerLocal.getRequisitions(id);
    else if(ConfigApp["SAC_TYPE"] == 'lpu') this.app.regionsManagerLocal.getMarkers(id);
}

function removeGis()
{
	for(var i = 0; i < gisDivsToHideStyles.length; i++)
	{
		gisDivsToHideStyles[i].className = '';
		gisDivsToHideStyles[i].style.display = 'none';
	}

	gisDiv.parentNode.removeChild(gisDiv);

  /*  document.getElementById('bg-events').style.display='yes';
    document.getElementById('bg-event-image').style.display='';
    document.getElementById('bg-svg').style.display='block';
	document.getElementById('bg-video').style.display='';
	document.getElementById('bg-regions-image').style.display='';
	document.getElementById('bg-colored-image').style.display='';
	document.getElementById('miniMap').className = 'onShow';
	document.getElementById('miniMap').style.display='';
document.getElementById('legend-widget').style.display='block'; */
}







function getTileURL(bounds)
{
  /*  var res = olmap.map.getResolution();
    var x = Math.round((bounds.left - olmap.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
            var limit = Math.pow(2, z);

            if (y < 0 || y >= limit) {
                return OpenLayers.Util.getImagesLocation() + "404.png";
            } else {
                x = ((x % limit) + limit) % limit;
                return this.url + "x=" + x + "&y=" + y + "&z=" + z;    //+ "&ss=" + x + "-" + y + "-" + z
            }*/
}





