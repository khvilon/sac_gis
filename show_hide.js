OLMap.prototype.show = function(id)
{
	this.createDiv();
	//this.map.updateSize();
this.init();

	$( "#" + this.divName ).show();
	for(var i = 0; i < this.divsToHide.length; i++)
	{		$( "#" + this.divsToHide[i] ).hide();	}

	this.regionsManager.geRegionLatLonById(id);
	if(this.type == 'avto')this.regionsManager.getRequisitions(id);
	else if(this.type == 'lpu') this.regionsManager.getLpus(id);

};


OLMap.prototype.hide = function()
{
	this.parentDiv.removeChild(this.div);
  //  $(  "#" + this.divName  ).hide();
    for(var i = 0; i < this.divsToHide.length; i++)
    {
		$( "#" + this.divsToHide[i] ).show();
	}

	var layers = this.map.layers;
	for (var i = 0; i < layers.length; i++)
	{		if(layers[i].CLASS_NAME == 'OpenLayers.Layer.Vector')
		{        	layers[i].removeAllFeatures();		}
	};
};