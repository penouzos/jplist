(function(){
	'use strict';		
		
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var $option
			,status = null
			,data;
		
		//get selected option (if default, get option with data-default=true or first option)
		if(isDefault){
		
			$option = context.$control.find('option[data-default="true"]').eq(0);
			if($option.length <= 0){
				$option =  context.$control.find('option').eq(0);
			}
		}
		else{
			$option = context.$control.find('option:selected');
		}
		
		//create status related data
		data = new jQuery.fn.jplist.controls.DropdownPaginationDTO($option.attr('data-number'));
		
		//create status object
		status = new jQuery.fn.jplist.StatusDTO(
			context.name
			,context.action
			,context.type
			,data
			,context.inStorage
			,context.inAnimation
			,context.isAnimateToTop
			,context.inDeepLinking
		);
		
		return status;			
	};
	
	/**
	* Get deep link
	* @param {Object} context
	* @return {string} deep link
	*/
	var getDeepLink = function(context){
		
		var deepLink = ''
			,status
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if(jQuery.isNumeric(status.data.number) || status.data.number === 'all'){
					
					//init deep link
					deepLink = context.name + context.options.delimiter0 + 'number=' + status.data.number;
				}
			}
		}
		
		return deepLink;
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = true
			,status = null;
			
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
			
				if((propName === 'number') && jQuery.isNumeric(status.data.number)){
					
					//set value
					status.data.number = propValue;
				}	
			}	
		}
		
		return status;
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var jqPath
			,dataType
			,path;
			
		context.$control.find('option').each(function(){
				
			//init vars
			jqPath = jQuery(this).attr('data-path');
			dataType = jQuery(this).attr('data-type');
			
			//init path
			if(jqPath){
			   
				path = new jQuery.fn.jplist.PathModel(jqPath, dataType);
				paths.push(path);
			}
		});
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.StatusDTO|Array.<jQuery.fn.jplist.StatusDTO>} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
				
		var $option
            ,itemsPerPageNumber;

        if(jQuery.isArray(status)){

            for(var i=0; i<status.length; i++){

                if(status[i].data && status[i].data.number){

                    itemsPerPageNumber = status[i].data.number;
                }
            }
        }
        else{
            if(status.data) {
                itemsPerPageNumber = status.data.number;
            }
        }

        if(jQuery.isNumeric(itemsPerPageNumber)) {

            $option = context.$control.find('option[data-number="' + itemsPerPageNumber + '"]');

            if ($option.length === 0) {
                $option = context.$control.find('option[data-number="all"]');
            }

            $option.get(0).selected = true;
        }
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
		
		context.$control.change(function(){
		
			var status
				,selectedOption
				,data_path
				,data_number;
			
			status = getStatus(context, false);
			
			//get selected option
			selectedOption = jQuery(this).find('option:selected');
			
			//get data
			data_path = selectedOption.attr('data-path');
			data_number = selectedOption.attr('data-number');
			
			if(data_path){
			
				status.data.path = data_path;
				status.data.type = jQuery(this).attr('data-type');
				status.data.order = jQuery(this).attr('data-order');				
			}
			else{
				if(data_number){
					status.data.number = data_number;
				}
			}
			
			//send status event
			context.observer.trigger(context.observer.events.knownStatusesChanged, [[status]]);
		});
	};
	
	/** 
	* Items Per Page Select Control
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
					
		//init events
		initEvents(context);
		
		return jQuery.extend(this, context);
	};
	
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* Get Deep Link
	* @return {string} deep link
	*/
	Init.prototype.getDeepLink = function(){
		return getDeepLink(this);
	};
	
	/**
	* Get Paths by Deep Link
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.PathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/**
	* Set Status
	* @param {jQuery.fn.jplist.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
	
	/** 
	* Items Per Page Select Control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.controls.ItemsPerPageSelect = function(context){
		return new Init(context);
	};	
	
	/**
	* static control registration
	*/
	jQuery.fn.jplist.controlTypes['items-per-page-select'] = {
		className: 'ItemsPerPageSelect'
		,options: {}
	};		
})();

