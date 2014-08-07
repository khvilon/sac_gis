OLMap.prototype.addMarker =  function(layer, lat, lon, options)
{
	var style = {
        externalGraphic: options.path,
        graphicWidth: 42,
    	graphicHeight: 42,
    	cursor: options.status_id
    };
    var pnt = this.newPnt(lat, lon);
    if(this.type == 'avto')var feature = new OpenLayers.Feature.Vector(pnt, options, style);
    else var feature = new OpenLayers.Feature.Vector(pnt, options);
	layer.addFeatures([feature]);
}

OLMap.prototype.addAmbulance =  function(lat, lon)
{
	var options = new Object();
	options.path =  this.hostIP + '/static/compile/js/olmap/images/ambulance.png';
    options.poppedup = false;
    this.addMarker(this.ambulanceLayer, lat, lon, options );}


OLMap.prototype.addLpus =  function(lpus)
{
	this.lpus = lpus;

    if(lpus == null) return false;
	var path = this.hostIP + '/static/compile/js/olmap/images/lpu/lpu_red.png';
	for(var i = 0; i < lpus.length; i++)
    {
    	lpus[i].path = path;
    	lpus[i].poppedup = false;
       // var options = {poppedup: false, label: lpus[i].name, path: path};
        this.addMarker(this.lpuLayer, lpus[i].lat, lpus[i].lon, lpus[i] );
    }


	this.map.events.register('featureclick', this.lpuLayer, null );

	this.addMarkersPopup(this.lpuLayer, this.createLpusPopupHtml , null);

    return true;
}

OLMap.prototype.addRequisitions =  function(data, onPopupClick)
{

  if(data == null) return false;
  	this.requisitionsLayer.destroyFeatures();
  	var self = this;
	for(var i = 0; i < data.length; i++)
    {
        data[i].path = this.hostIP + '/static/compile/js/olmap/images/' +
       //   data[i].path = 'images/' +
            data[i].type + '_' + data[i].color + '.png';


        data[i].poppedup = false;

        this.addMarker(this.requisitionsLayer, data[i].lat, data[i].lon, data[i]);
    }

	if(!this.first) {
		this.first = true;
		this.map.events.register('featureclick', this.requisitionsLayer, function hh(e) {onPopupClick(e.feature.attributes) });
	}


    this.addMarkersPopup(this.requisitionsLayer, this.createRequisitionsPopupHtml , onPopupClick);
    return true;
};

OLMap.prototype.createLpusPopupHtml =  function(attr)
{

    html =   '<div style="background-image: url('+attr.popup_bg_path+'); background-size: 100% 100%;';
    html += 'height: 107px; width: 230px; ">';
    html += '<div style="position: absolute; top: 25px; left: 20px; color: white; padding-top: 10px;">';
    html += '<table cellpadding = 1px cellspacing=2px width=185px border=0'+
    ' style="color: white; font-size: 12px; font-family: arial">';
    html += '<tr><td style="white-space: no-wrap;">' + attr.name + '</td></tr>';
    html +=  '</table></div>';
    html +=  '<div class="close" style="position: absolute; top: 23px; right: 25px;'+
        ' " onclick="window.application.olmap.popup.destroy()"></div>';
    html +=  '</div>';
    return html;
}


OLMap.prototype.createRequisitionsPopupHtml =  function(attr)
{
	var myDate = new Date(attr.creation_time);
	var formatDateStr = (myDate.getMonth() + 1) + "-" + myDate.getDate() + "-" + myDate.getFullYear();

    html =   '<div style="background-image: url('+attr.popup_bg_path+'); background-size: 100% 100%;';
    html += 'height: 189px; width: 232px; ">';
    html += '<div style="position: absolute; top: 25px; left: 20px; color: white; padding-top: 10px;">';
    html += '<table cellpadding = 1px cellspacing=2px width=185px border=0'+
    ' style="color: white; font-size: 12; font-family: arial">';
    html += '<tr><td style="white-space: no-wrap;">' + attr.num + '</td><td  align=center bgcolor="'+ attr.color +'">' +
        attr.status + '</td></tr>';
    html += '<tr><td colspan="2" style="font-size: 14px; font-weight: bold">' + attr.type_ru + '</td></tr>';
    html += '<tr><td colspan="2" style="font-size: 12px;">' + attr.address + '</td></tr>';
    html += '<tr><td colspan="2" style="font-size: 12px;">' + formatDateStr + '</td></tr>';
    html +=  '</table></div>';
    html +=  '<div class="close" style="position: absolute; top: 23px; right: 20px;'+
        ' " onclick="olmap.popup.destroy()"></div>';
    html +=  '</div>';
    return html;
}

OLMap.prototype.createStationsPopupHtml =  function(attr)
{
	function addRow(name, val)
	{		return '<tr><td>'+name+'</td><td style="white-space: no-wrap; padding: 4px;">' + val + '</td></tr>';	}

     if(attr.processkind_code == 'BS_CREATION') attr.processkind_code = 'Строительство';
     else attr.processkind_code = 'Модернизация';
    html =   '<div style="background-image: url('+attr.popup_bg_path+'); background-size: 100% 100%;';
    html += 'height: 285px; width: 280px; ">';
    html += '<div style="position: absolute; top: 35px; left: 20px; color: white; padding-top: 10px;">';
    html += '<table cellpadding = 1px cellspacing=2px width=230px border=0'+
    ' style="color: white; font-size: 12px; font-family: arial; padding: 4px">';
    html += addRow('ГФК',attr.position_code);//'<tr><td>ГФК</td><td style="white-space: no-wrap;">' + attr.gfk + '</td></tr>';
    html += addRow('Код ЕРП',attr.position_name);//'<tr><td>Код ЕРП</td><td style="white-space: no-wrap;">' + attr.position_code + '</td></tr>';
    html += addRow('Наименование позиции',attr.position_name);//'<tr><td>Наименование позиции</td><td style="white-space: no-wrap;">' + attr.position_name + '</td></tr>';
    html += addRow('Тип позиции',attr.positiongroup_name);//'<tr><td>Тип позиции</td><td style="white-space: no-wrap;">' + attr.positiongroup_name + '</td></tr>';
    html += addRow('Широта',attr.position_latitude);//'<tr><td>Широта</td><td style="white-space: no-wrap;">' + attr.position_latitude + '</td></tr>';
    html += addRow('Догота',attr.position_longitude);//'<tr><td> Догота</td><td style="white-space: no-wrap;">' + attr.position_longitude + '</td></tr>';
    html += addRow('Адрес',attr.position_addressstring_norm);//'<tr><td>Адрес</td><td style="white-space: no-wrap;">' + attr.position_addressstring_norm + '</td></tr>';
    html += addRow('Диапазон',attr.bsband_band);//'<tr><td>Диапазон</td><td style="white-space: no-wrap;">' + attr.bsband_band + '</td></tr>';
    html += addRow('Стандарт',attr.telecomstandard_code);//'<tr><td>Стандарт</td><td style="white-space: no-wrap;">' + attr.telecomstandard_code + '</td></tr>';
    html += addRow('Тип работ',attr.processkind_code);//'<tr><td>Тип работ</td><td style="white-space: no-wrap;">' + attr.processkind_code + '</td></tr>';
    html +=  '</table></div>';
    html +=  '<div class="close" style="position: absolute; top: 23px; right: 25px;'+
        ' " onclick="window.application.olmap.popup.destroy()"></div>';
    html +=  '</div>';
    return html;
}

OLMap.prototype.addMarkersPopup =  function(layer, createHTMLFunction, onPopupClick)
{
     var me = this;
     function selectFeature(feature)
     {
        var pos = feature.geometry;

        if (me.popup) me.map.removePopup(me.popup);


        var path =  me.hostIP + '/static/compile/js/olmap/images/tooltip-bottom-blue.png';
		feature.attributes.popup_bg_path = path;

        var pWidth = 240;
        var pHeight = 112;
        if (me.type == "vimpel")
        {        	pWidth = 320;
        	pHeight = 320;        }

        //var offset = {'size':new OpenLayers.Size(0,0),'offset':new OpenLayers.Pixel(pWidth/2+10,pHeight+10)};
        var offsetX =  pWidth/2;
        var offsetY =  pHeight+10;

        html = createHTMLFunction(feature.attributes); //createPopupHTML(feature.attributes);
        me.popup = new OpenLayers.Popup.Anchored("popup",
        new OpenLayers.LonLat(pos.x, pos.y),
        new OpenLayers.Size(pWidth,pHeight), html, null, false);

        me.popup.relativePosition = "br";
        me.popup.keepInMap = false;

        me.popup.calculateNewPx = function(px)
        {
            if (me.popup.size !== null){px = px.add(-offsetX, 0);}
            return px;
        };


        me.popup.setBackgroundColor("tranceparent");

       if(onPopupClick != null) me.popup.events.register("click", me.map, function() {if(me.popup != null) onPopupClick(feature.attributes);});


        me.map.addPopup(me.popup);
    }
    var popupControl = new OpenLayers.Control.SelectFeature(layer,
    {
        onSelect: function(feature) {selectFeature(feature);}
    });

    this.map.addControl(popupControl);

    popupControl.activate();
}

OLMap.prototype.addRequisition =  function(attr)
{
 attr.path = this.hostIP + '/static/compile/js/olmap/images/' +
            attr.type + '_' + attr.color + '.gif';
 this.addMarker(this.requisitionsLayer, attr.lat, attr.lon, attr);
}




OLMap.prototype.addStations =  function(data, onPopupClick)
{

  if(data == null) return false;
  	this.stationsLayer.destroyFeatures();
  	var self = this;
	for(var i = 0; i < data.length; i++)
    {
        data[i].path = this.hostIP + '/static/compile/js/olmap/images/stations/station_' + data[i].color + '.png';
      //   data[i].path = this.hostIP + '/static/compile/js/olmap/images/stations/station_green.png';

        data[i].poppedup = false;

        this.addMarker(this.stationsLayer, data[i].position_latitude, data[i].position_longitude, data[i]);
    }


	this.map.events.register('featureclick', this.stationsLayer, null);

    this.addMarkersPopup(this.stationsLayer, this.createStationsPopupHtml , onPopupClick);
    return true;
};