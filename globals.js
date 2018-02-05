/**
 * @properties={typeid:35,uuid:"76D10E62-DD15-4C70-894C-07AC3C669B67",variableType:-4}
 */
var DisplayType = 
{
	STANDARD  : 0,
	FIXED	  : 1,
	COMPUTED  : 2,
	MANDATORY : 3
};

/**
 * Create a servoy JSForm from the provided specification. This must be an object
 * containing a number of properties equal to the number of the fields in the form.
 * <p>
 * Each field has in turn the following, fixed, structure<br/>
 * <code>{ code: String, name: String, format: String, size: Number, lines: Number, enabled: Boolean, visible: Boolean, order: Number, group: Number, type: String, [dataprovider]: String }</code>
 * </p>
 * @param 			specification
 * @param {Number} 	type				the type of the form, as defined in SM_VIEW. Accepted types are record (locked or not) and locked table
 * @param {String}	[formName]
 * @param {String} 	[extendsForm]
 * @param {String}  [dataSource]
 * @param {
 * 			{
 * 				sideMargin		: Number, 
 * 				topMargin		: Number,
 * 				bottomMargin	: Number, 
 * 				fieldHeight		: Number, 
 * 				fieldSpacing	: Number, 
 * 				rowSpacing		: Number, 
 * 				labelHeight		: Number, 
 * 		  	}
 * 		  }			[layoutParams]
 * @param {String} [requestType]  
 * 
 * @return {JSForm}
 *
 * @properties={typeid:24,uuid:"758E9679-221E-41D1-BB8F-87A96F5F9465"}
 */
function buildForm(specification, type, formName, extendsForm, dataSource, layoutParams, requestType)
{
	switch(type)
	{
		case JSForm.RECORD_VIEW:
		case JSForm.LOCKED_RECORD_VIEW:
			return buildDetailForm(specification, layoutParams, formName, extendsForm, dataSource, requestType);
			break;
			
		case JSForm.LOCKED_TABLE_VIEW:
			return buildTableForm(specification, layoutParams, formName, extendsForm, dataSource);
			break;
			
		default:
			throw 'Form type ' + type + ' not recognized';
	}
}

/**
 * Create a servoy JSForm from the provided specification. This must be an object
 * containing a number of properties equal to the number of the fields in the form.
 * <p>
 * Each field has in turn the following, fixed, structure<br/>
 * <code>{ code: String, name: String, format: String, size: Number, lines: Number, enabled: Boolean, visible: Boolean, order: Number, group: Number, type: String, [dataprovider]: String }</code>
 * </p>
 * @param 			specification
 * @param {Number} 	type				the type of the form, as defined in SM_VIEW. Accepted types are record (locked or not) and locked table
 * @param {String}	[formName]
 * @param {String} 	[extendsForm]
 * @param {String}  [dataSource]
 * @param {
 * 			{
 * 				sideMargin		: Number, 
 * 				topMargin		: Number,
 * 				bottomMargin	: Number, 
 * 				fieldHeight		: Number, 
 * 				fieldSpacing	: Number, 
 * 				rowSpacing		: Number, 
 * 				labelHeight		: Number, 
 * 		  	}
 * 		  }			[layoutParams]
 * @param [params]
 * 
 * @return {JSForm}
 *
 * @properties={typeid:24,uuid:"E5FB2AAC-3BA8-49EA-9868-1CAC75D33DE7"}
 */
function buildFormDetail(specification, type, formName, extendsForm, dataSource, layoutParams, params)
{
	switch(type)
	{
		case JSForm.RECORD_VIEW:
		case JSForm.LOCKED_RECORD_VIEW:
			return buildDetailFormDays(specification, layoutParams, formName, extendsForm, dataSource, params);
			break;
			
		case JSForm.LOCKED_TABLE_VIEW:
			return buildTableForm(specification, layoutParams, formName, extendsForm, dataSource);
			break;
			
		default:
			throw 'Form type ' + type + ' not recognized';
	}
}

/**
 * @param {Object} specification
 * @param {
 * 			{
 * 				sideMargin		: Number, 
 * 				topMargin		: Number,
 * 				bottomMargin	: Number, 
 * 				fieldHeight		: Number, 
 * 				fieldSpacing	: Number, 
 * 				rowSpacing		: Number, 
 * 				labelHeight		: Number, 
 * 			}
 * 		  } [layoutParams]
 * @param {String} [formName]
 * @param {String} [extendsForm]
 * @param {String} [dataSource]
 * @param {String} [requestType]
 * 
 * @properties={typeid:24,uuid:"850FC132-75ED-4FAE-A984-E5190C5F6225"}
 */
function buildDetailForm(specification, layoutParams, formName, extendsForm, dataSource, requestType)
{
	if(!specification || !dataSource)
		return null;
	
	if(!layoutParams)
		layoutParams = 
		{ 
			  sideMargin 	: 10
			, topMargin		: 0
			, bottomMargin	: 10
			, fieldHeight	: 20
			, fieldSpacing 	: 10
			, rowSpacing 	: 0
			, labelHeight	: 20
		}
	
	var jsForm = solutionModel.newForm(formName, solutionModel.getForm(extendsForm));
	
		jsForm.navigator   = SM_DEFAULTS.NONE;
		jsForm.view 	   = JSForm.RECORD_VIEW;
		jsForm.transparent = false;

	/**
	 * The form's coordinates, top-left based
	 */
	var x, y;
	
	/**
	 * Add any previous element to the tab sequence
	 */
	var maxTabSequence = forms[extendsForm].controller.getTabSequence().length;
	
	if(layoutParams.topMargin === null || layoutParams.topMargin === undefined)
		layoutParams.topMargin = jsForm.getBodyPart().height;

	y = layoutParams.topMargin;
		
	if(layoutParams.sideMargin === null || layoutParams.sideMargin === undefined)
		layoutParams.sideMargin = jsForm.width;

	x = layoutParams.sideMargin;
	
	// The first row must always be numbered 1
	var lastGroup = 1;
	var formWidth = jsForm.width;
		
	for(var f in specification)
	{
		/** @type {
		 * 			{ 
		 * 				code: String, 
		 * 				name: String, 
		 * 				format: String, 
		 * 				size: Number, 
		 * 				lines: Number, 
		 * 				enabled: Boolean, 
		 * 				visible: Boolean, 
		 * 				order: Number, 
		 * 				group: Number, 
		 * 				type: String, 
		 * 				dataprovider: String, 
		 * 				formula: String, 
		 * 				displaytype: Number, 
		 * 				regex: String, 
		 * 				onaction: { name: String, code: String }, 
		 * 				lookupparams: String, 
		 * 				filterquery: String, 
		 * 				filterargs: String,
		 * 				relation: String,
		 * 				showndataprovider: String, 
		 *              tooltip: String,
		 *              hasdefault: Boolean,
		 *              dependson: String,
		 *              contentdataprovider: String
		 * 			}
		 * 		} 
		 */
		var field = specification[f];
		
		var fieldStyle 	   = 'default';
		var fieldAlignment = SM_ALIGNMENT.CENTER;
		var fieldValidator = null;
		var transparent;
				
		/**
		 * Add the field to the form according to its type
		 */
		var fieldType = JSField.TEXT_FIELD;
		switch(field.type)
		{
			case globals.FieldType.BOOLEAN:
				fieldType 		 = JSField.CHECKS;
				fieldStyle 		 = 'check';
				fieldAlignment 	 = SM_ALIGNMENT.CENTER;
				transparent 	 = true;
				break;
			
			case globals.FieldType.STRING:
				fieldType 		 = JSField.TEXT_FIELD;
				fieldStyle 		 = 'default';
				fieldAlignment 	 = SM_ALIGNMENT.CENTER;
				transparent 	 = false;
				break;
				
			case globals.FieldType.DATETIME:
				fieldType 		 = JSField.TEXT_FIELD;
				fieldStyle 		 = 'default';
				fieldAlignment 	 = SM_ALIGNMENT.CENTER;
				transparent 	 = false;
				break;
				
			case globals.FieldType.INTEGER:
				fieldType 		 = JSField.TEXT_FIELD;
				fieldStyle 		 = 'default';
				fieldAlignment 	 = SM_ALIGNMENT.CENTER;
				transparent 	 = false;
				break;
				
			case globals.FieldType.NUMBER:
				fieldType 		 = JSField.TEXT_FIELD;
				fieldStyle 		 = 'default';
				fieldAlignment 	 = SM_ALIGNMENT.CENTER;
				
				if(field.regex)
					fieldValidator = jsForm.newMethod
					(
						"function validate_" + field.dataprovider + "(oldValue, newValue, event)\
						 {\
						 	var regex = /" + field.regex + "/;\
						 	if(newValue && newValue > 0 && regex.test(newValue))\
						 	{\
						 		setStatusWarning('Formato non valido');\
						 		return false;\
						 	}\
						 	else\
						 	{\
						 		resetStatus();\
						 		return true;\
						 	}\
						 }"
					);
				else
					fieldValidator = jsForm.getMethod('validateField');

				transparent 	 = false;
				break;
			
			case globals.FieldType.TEXT:
				fieldType 		= JSField.TEXT_AREA;
				fieldStyle 		= 'default';
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				transparent 	= false;
				break;
			
			case globals.FieldType.TRISTATE:
				fieldType 		= JSField.COMBOBOX;
				fieldStyle 		= 'default';
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				transparent 	= false;
				break;
				
			default:
				throw 'Field type ' + field.type + ' not recognized';
		}
		
		// Add fields to the current row until they belong to the same group, otherwise start a new row
		if(field.group !== lastGroup)
		{
			x  = layoutParams.sideMargin;
			y += layoutParams.labelHeight + layoutParams.fieldHeight + layoutParams.rowSpacing;
			
			lastGroup = field.group;
		}
		
		// Add the field. Don't create it if already present
		var formField = jsForm.getField('fld_' + field.dataprovider);
		if(!formField)
		{
			formField = jsForm.newField(null, fieldType, x, y + layoutParams.labelHeight, field.size, field.lines * layoutParams.fieldHeight);
			
			// Move coordinates to the next field
			x += field.size + layoutParams.fieldSpacing;
		}
		
		formField.dataProviderID        = field.dataprovider;
		formField.name 					= 'fld_' + field.dataprovider;
		formField.format				= field.format;
		formField.displayType 			= fieldType;
		formField.horizontalAlignment 	= fieldAlignment;
		formField.toolTipText			= field.tooltip;
		formField.transparent 			= transparent;
		formField.styleClass 			= fieldStyle;
		formField.enabled			    = 
		formField.editable				= (field.enabled && !field.dependson) //|| field.hasdefault;
		formField.visible 				= field.visible;
		formField.anchors 				= SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
		formField.displaysTags			= true;
		
		if(formField.editable)
			formField.tabSeq = maxTabSequence++;
		else
			formField.tabSeq = SM_DEFAULTS.IGNORE;
		
		// onDataChange validator
		if(fieldValidator)
			formField.onDataChange		= fieldValidator;
			
		if(field.onaction)
		{
			var method = jsForm.getMethod(field.onaction.name)
			if(!method)
				method = jsForm.newMethod(field.onaction.code);
			
			formField.onAction = method; 
		}
			
		// The field is related
		if(field.relation)
		{
			var relObject = plugins.serialize.fromJSON(field.relation);
			if (relObject)
				formField.dataProviderID = dataSource + '_' + relObject.name + '.' + field.contentdataprovider;
		}
		
		// Add a lookup if required
		if (field.enabled && field.lookupparams)
		{
			var lkpBtn 				  = addLookup(field, formField, jsForm, layoutParams);
				lkpBtn.labelFor		  = formField.name;
				lkpBtn.styleClass	  = 'HideIfReadOnly';
		}
		
		// Add the label
		var fieldLabel 			   = jsForm.newLabel(field.name, formField.x, y, field.size, layoutParams.labelHeight);
			fieldLabel.name        = 'lbl_' + field.dataprovider;
			fieldLabel.transparent = true;
			fieldLabel.labelFor    = formField.name;
			
		// Add the 'overwrite default value' checkbox
		if(field.hasdefault)
		{
			var checkName      = 'chk_setdefault_' + field.dataprovider;
			var overwriteCheck = jsForm.getField(checkName);
			
			if(!overwriteCheck)
				overwriteCheck = jsForm.newCheck(field.dataprovider + '_setdefault', formField.x + formField.width - 22, formField.y, 20, 20);
			
			overwriteCheck.name			  	   = checkName
			overwriteCheck.anchors	     	   = SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
			overwriteCheck.transparent	  	   = true;
			overwriteCheck.styleClass     	   = 'check';
			overwriteCheck.horizontalAlignment = SM_ALIGNMENT.CENTER;
			overwriteCheck.dataProviderID 	   = field.dataprovider + '_setdefault';
			overwriteCheck.displaysTags   	   = true;
			overwriteCheck.toolTipText    	   = '%%i18n:ma.pv.lbl.overwrite_default%%';
			overwriteCheck.tabSeq		  	   = formField.tabSeq + 1; maxTabSequence++;
			overwriteCheck.onRender			   = jsForm.getMethod('onOverwriteDefaultRender');
			overwriteCheck.enabled			   = false;
			
			// Move coordinates to the next field
			x += field.size + layoutParams.fieldSpacing;
		}
	}
	
	var isMonetary = requestType == null || requestType == globals.CategoriaRichiesta.MONETARIA;
	if(isMonetary)
	{
		// add the check field for the detail by day of request
		var chkField = jsForm.newCheck(null,x, y + layoutParams.labelHeight, field.size, field.lines * layoutParams.fieldHeight);
		chkField.dataProviderID = 'dettaglio';
		
		chkField.name = 'chk_dettaglio_giorni';
		chkField.anchors = SM_ANCHOR.WEST;
		chkField.transparent = true;
		chkField.styleClass = 'check';
		chkField.horizontalAlignment = SM_ALIGNMENT.CENTER;
		chkField.tabSeq		  	   = formField.tabSeq + 1; maxTabSequence++;
		chkField.enabled = true;
		chkField.onDataChange = solutionModel.getGlobalMethod('globals', 'onDataChangeDettaglioGiorni');
		
		var chkLabel = jsForm.newLabel('Dettaglio giorni', x, y, field.size, field.lines * layoutParams.fieldHeight);
		chkLabel.name = 'lbl_dettaglio_giorni';
		chkLabel.transparent = true;
		chkLabel.labelFor = chkField.name;
		chkLabel.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
		// Move coordinates to the next field
		x += chkLabel.width + layoutParams.fieldSpacing;
	}
	
	if(globals.ma_utl_hasKey(globals.Key.PANNELLO_VARIAZIONI_UTENTE))
	{
		// add the check field for the detail by day of request
		var chkFieldTerm = jsForm.newCheck(null,x, y + layoutParams.labelHeight, field.size, field.lines * layoutParams.fieldHeight);
		chkFieldTerm.dataProviderID = 'terminato';
		
		chkFieldTerm.name = 'chk_terminato';
		chkFieldTerm.anchors = SM_ANCHOR.WEST;
		chkFieldTerm.transparent = true;
		chkFieldTerm.styleClass = 'check';
		chkFieldTerm.horizontalAlignment = SM_ALIGNMENT.CENTER;
		chkFieldTerm.tabSeq		  	   = formField.tabSeq + 1; maxTabSequence++;
		chkFieldTerm.enabled = true;
		chkFieldTerm.editable = true;
		
		
		var chkLabelTerm = jsForm.newLabel('Terminato', x, y, field.size, field.lines * layoutParams.fieldHeight);
		chkLabelTerm.name = 'lbl_terminato_giorni';
		chkLabelTerm.transparent = true;
		chkLabelTerm.labelFor = chkFieldTerm.name;
		chkLabelTerm.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
		// Move coordinates to the next field
		x += chkLabelTerm.width + layoutParams.fieldSpacing;	
	}
	
	// nel caso di form di inserimento, disegniamo anche il pulsante per accedere alla fase di dettaglio
	if(utils.stringRight(formName,5) == '_edit' && isMonetary)
	{		
		// add the button for opening the per-day-management of current request
		var btnLabel = jsForm.newLabel('', x, y + layoutParams.labelHeight, 20, 20);
		btnLabel.name = 'btn_dettaglio_giorni';
		btnLabel.styleClass = 'btn_add';
		btnLabel.enabled = false;
		btnLabel.showClick = false;
		btnLabel.showFocus = true;
		btnLabel.toolTipText = 'Vai alla gestione puntuale della richiesta sui singoli giorni';
		btnLabel.onAction = solutionModel.getGlobalMethod('globals','onActionBtnDettaglioGiorni');	
	}
		
	if(x > formWidth)
		formWidth = x;
	
	jsForm.width = formWidth;
	jsForm.getBodyPart().height = y + layoutParams.labelHeight + layoutParams.fieldHeight + layoutParams.bottomMargin;
	
	return jsForm;
}

/**
 * @param {Object} specification
 * @param {
 * 			{
 * 				sideMargin		: Number, 
 * 				topMargin		: Number,
 * 				bottomMargin	: Number, 
 * 				fieldHeight		: Number, 
 * 				fieldSpacing	: Number, 
 * 				rowSpacing		: Number, 
 * 				labelHeight		: Number, 
 * 			}
 * 		  } [layoutParams]
 * @param {String} [formName]
 * @param {String} [extendsForm]
 * @param {String} [dataSource]
 * @param {Object} [params]
 * 
 * @properties={typeid:24,uuid:"46AAEE26-878B-4043-9341-EC08C9176759"}
 */
function buildDetailFormDays(specification, layoutParams, formName, extendsForm, dataSource, params)
{
	if(!specification || !dataSource)
		return null;
	
	if(!layoutParams)
		layoutParams = 
		{ 
			  sideMargin 	: 10
			, topMargin		: 0
			, bottomMargin	: 10
			, fieldHeight	: 20
			, fieldSpacing 	: 10
			, rowSpacing 	: 0
			, labelHeight	: 20
		}
	
	if(solutionModel.getForm(formName))
	{
		history.removeForm(formName);
		solutionModel.removeForm(formName);
	}
		
	var jsForm = solutionModel.newForm(formName, solutionModel.getForm(extendsForm));
	
		jsForm.navigator   = SM_DEFAULTS.NONE;
		jsForm.view 	   = JSForm.RECORD_VIEW;
		jsForm.transparent = false;
			
	/**
	 * The form's coordinates, top-left based
	 */
	var x, y;
	
	/**
	 * Add any previous element to the tab sequence
	 */
	var maxTabSequence = forms[extendsForm].controller.getTabSequence().length;
	
	if(layoutParams.topMargin === null || layoutParams.topMargin === undefined)
		layoutParams.topMargin = jsForm.getBodyPart().height;

	y = layoutParams.topMargin;
		
	if(layoutParams.sideMargin === null || layoutParams.sideMargin === undefined)
		layoutParams.sideMargin = jsForm.width;

	x = layoutParams.sideMargin;
	
	// The first row must always be numbered 1
	var lastGroup = 1;
	var formWidth = jsForm.width;

	var firstDay = globals.getFirstDatePeriodo(params['periodo']);
	var daysNumber = globals.getTotGiorniMese(firstDay.getMonth() + 1,firstDay.getFullYear());
//    var requestFields = globals.getRequestFields(params['requestid']);
	
	for(var d = 1; d <= daysNumber; d++)
	{
		/** @type {Date}*/
		var day = new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + (d - 1));
		/** @type {String}*/
		var dayIso = globals.dateFormat(day,ISO_DATEFORMAT);
		
		// Add fields to the current row until they belong to the same group, otherwise start a new row
		if(d !== lastGroup)
		{
			x = layoutParams.sideMargin;
			y += layoutParams.fieldHeight + layoutParams.rowSpacing;
			
			lastGroup = d;
		}
		
		if(d == 1)
		   jsForm.newLabel('Giorno',layoutParams.sideMargin,y,60,layoutParams.labelHeight);
				
		var fldDayVariable = jsForm.newVariable('v' + dateFormat(day,ISO_DATEFORMAT),JSVariable.TEXT);
		fldDayVariable.defaultValue = "'" + globals.getNomeGiorno(day) + " " + day.getDate() + "'";
		var dayField = jsForm.newField(fldDayVariable.name,JSField.TEXT_FIELD,layoutParams.sideMargin,y + layoutParams.fieldHeight,60,layoutParams.fieldHeight);
		dayField.name 					= 'fld_day_' + dayIso;
		dayField.horizontalAlignment 	= SM_ALIGNMENT.CENTER;
		dayField.toolTipText			= 'Giorno ' + dateFormat(day,EU_DATEFORMAT);
		dayField.transparent 			= false;
		dayField.enabled			    = false;
		dayField.editable				= false;
		dayField.visible 				= true;
		dayField.anchors 				= SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
		dayField.displaysTags			= true;
		
		x = 60 + layoutParams.sideMargin + layoutParams.fieldSpacing;
		
		for(var f in specification)
		{
			/** @type {
			 * 			{ 
			 * 				code: String, 
			 * 				name: String, 
			 * 				format: String, 
			 * 				size: Number, 
			 * 				lines: Number, 
			 * 				enabled: Boolean, 
			 * 				visible: Boolean, 
			 * 				order: Number, 
			 * 				group: Number, 
			 * 				type: String, 
			 * 				dataprovider: String, 
			 * 				formula: String, 
			 * 				displaytype: Number, 
			 * 				regex: String, 
			 * 				onaction: { name: String, code: String }, 
			 * 				lookupparams: String, 
			 * 				filterquery: String, 
			 * 				filterargs: String,
			 * 				relation: String,
			 * 				showndataprovider: String, 
			 *              tooltip: String,
			 *              hasdefault: Boolean,
			 *              dependson: String,
			 *              contentdataprovider: String
			 * 			}
			 * 		} 
			 */
			var field = specification[f];
			
			var fieldStyle 	   = 'default';
			var fieldAlignment = SM_ALIGNMENT.CENTER;
			var fieldValidator = null;
			var fieldDataChange = null;
			var transparent;
					
			/**
			 * Add the field to the form according to its type
			 */
			var fieldType = JSField.TEXT_FIELD;
			switch(field.type)
			{
				case globals.FieldType.BOOLEAN:
					fieldType 		 = JSField.CHECKS;
					fieldStyle 		 = 'check';
					fieldAlignment 	 = SM_ALIGNMENT.CENTER;
					transparent 	 = true;
					break;
				
				case globals.FieldType.STRING:
					fieldType 		 = JSField.TEXT_FIELD;
					fieldStyle 		 = 'default';
					fieldAlignment 	 = SM_ALIGNMENT.CENTER;
					transparent 	 = false;
					break;
					
				case globals.FieldType.DATETIME:
					fieldType 		 = JSField.TEXT_FIELD;
					fieldStyle 		 = 'default';
					fieldAlignment 	 = SM_ALIGNMENT.CENTER;
					transparent 	 = false;
					break;
					
				case globals.FieldType.INTEGER:
					fieldType 		 = JSField.TEXT_FIELD;
					fieldStyle 		 = 'default';
					fieldAlignment 	 = SM_ALIGNMENT.CENTER;
					transparent 	 = false;
					break;
					
				case globals.FieldType.NUMBER:
					fieldType 		 = JSField.TEXT_FIELD;
					fieldStyle 		 = 'default';
					fieldAlignment 	 = SM_ALIGNMENT.CENTER;
					
					if(field.regex)
						fieldValidator = jsForm.newMethod
						(
							"function validate_" + field.dataprovider + "(oldValue, newValue, event)\
							 {\
							 	var regex = /" + field.regex + "/;\
							 	if(newValue && newValue > 0 && regex.test(newValue))\
							 	{\
							 		setStatusWarning('Formato non valido');\
							 		return false;\
							 	}\
							 	else\
							 	{\
							 		resetStatus();\
							 		return true;\
							 	}\
							 }"
						);
					else
						fieldValidator = jsForm.getMethod('validateFieldDetail');
	
					fieldDataChange = jsForm.getMethod('onDataChangeFieldDetail');
					
					transparent 	 = false;
					break;
				
				case globals.FieldType.TEXT:
					fieldType 		= JSField.TEXT_AREA;
					fieldStyle 		= 'default';
					fieldAlignment 	= SM_ALIGNMENT.CENTER;
					transparent 	= false;
					break;
				
				case globals.FieldType.TRISTATE:
					fieldType 		= JSField.COMBOBOX;
					fieldStyle 		= 'default';
					fieldAlignment 	= SM_ALIGNMENT.CENTER;
					transparent 	= false;
					break;
					
				default:
					throw 'Field type ' + field.type + ' not recognized';
			}
						
			// for the first row, also add the labels
			if(d == 1)
			{
				// Add the label
				var fieldLabel 			   = jsForm.newLabel(field.name, x, y, field.size, layoutParams.labelHeight);
					fieldLabel.name        = 'lbl_' + field.dataprovider;
					fieldLabel.transparent = true;
			}
						
			// Add the field. Don't create it if already present
			var fldName = 'fld_' + field.dataprovider + '_' + dateFormat(day,ISO_DATEFORMAT);
			var formField = jsForm.getField(fldName);
			if(!formField)
			{
				formField = jsForm.newField(null, fieldType, x, y + layoutParams.labelHeight, field.size, field.lines * layoutParams.fieldHeight);
				
				// Move coordinates to the next field
				x += field.size + layoutParams.fieldSpacing;
							
			}
				
			// verifica se esiste un valore precedentemente inserito
			var existingRecord = params['recordid'] ? getRichiestaCampoDettaglioCodice(params['recordid'],field.code,dayIso) : params['recordid'];
			var defaultVarValue = ( existingRecord && existingRecord.valore) 
			                      || (field.formula && !isNaN(utils.stringReplace(field.formula,",",".")) ? utils.stringReplace(field.formula,",",".") : null);
			
			var fldVariable = jsForm.newVariable('v_' + field.dataprovider + '_' + dateFormat(day,ISO_DATEFORMAT)
				                                 ,JSVariable.TEXT
												 ,defaultVarValue);
			
			formField.dataProviderID        = fldVariable.name;
			formField.name 					= fldName;
//			formField.format				= field.format;
			formField.displayType 			= fieldType;
			formField.horizontalAlignment 	= fieldAlignment;
			formField.toolTipText			= field.tooltip;
			formField.transparent 			= transparent;
			formField.styleClass 			= fieldStyle;
			formField.enabled			    = 
			formField.editable				= (field.enabled && !field.dependson) //|| field.hasdefault;
			formField.visible 				= field.visible;
			formField.anchors 				= SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
			formField.displaysTags			= true;
			
			if(formField.editable)
				formField.tabSeq = maxTabSequence++;
			else
				formField.tabSeq = SM_DEFAULTS.IGNORE;
			
			// onDataChange validator
			if(fieldValidator)
				formField.onFocusLost           = fieldValidator;
				//formField.onDataChange		= fieldValidator;
				formField.onDataChange          = fieldDataChange;
				
//			if(field.onaction)
//			{
//				var method = jsForm.getMethod(field.onaction.name)
//				if(!method)
//					method = jsForm.newMethod(field.onaction.code);
//				
//				formField.onAction = method; 
//			}
				
			// The field is related
			if(field.relation)
			{
				var relObject = plugins.serialize.fromJSON(field.relation);
				if (relObject)
					formField.dataProviderID = dataSource + '_' + relObject.name + '.' + field.contentdataprovider;
			}
			
			// Add a lookup if required
			if (field.enabled && field.lookupparams)
			{
				var lkpBtn 				  = addLookup(field, formField, jsForm, layoutParams);
					lkpBtn.labelFor		  = formField.name;
					lkpBtn.styleClass	  = 'HideIfReadOnly';
			}
									
	//		if(x > formWidth)
	//			formWidth = x;
		}
	}
	
	// creazione totali campi richiesta
	x = 60 + layoutParams.sideMargin + layoutParams.fieldSpacing;
	y += (layoutParams.fieldHeight * 2) + layoutParams.rowSpacing;
			
	for(f in specification)
	{
		/** @type {
		 * 			{ 
		 * 				code: String, 
		 * 				name: String, 
		 * 				format: String, 
		 * 				size: Number, 
		 * 				lines: Number, 
		 * 				enabled: Boolean, 
		 * 				visible: Boolean, 
		 * 				order: Number, 
		 * 				group: Number, 
		 * 				type: String, 
		 * 				dataprovider: String, 
		 * 				formula: String, 
		 * 				displaytype: Number, 
		 * 				regex: String, 
		 * 				onaction: { name: String, code: String }, 
		 * 				lookupparams: String, 
		 * 				filterquery: String, 
		 * 				filterargs: String,
		 * 				relation: String,
		 * 				showndataprovider: String, 
		 *              tooltip: String,
		 *              hasdefault: Boolean,
		 *              dependson: String,
		 *              contentdataprovider: String
		 * 			}
		 * 		} 
		 */
		var spec = specification[f];
		var lblTotale = jsForm.newLabel('Tot. ' + spec.dataprovider ,x , y ,spec.size ,layoutParams.labelHeight)
		lblTotale.name = 'lbl_' + spec.dataprovider + '_tot';
		// Add the total field. Don't create it if already present
		var fldTotale = 'fld_' + spec.dataprovider + '_tot';
		var totField = jsForm.getField(fldTotale);
		if(!totField)
		{
			totField = jsForm.newField(null, JSField.TEXT_FIELD, x, y + layoutParams.labelHeight, spec.size, layoutParams.fieldHeight);
			
			// Move coordinates to the next field
			x += spec.size + layoutParams.fieldSpacing;
		}
		
		var defaultTotValue = spec.formula && !isNaN(utils.stringReplace(spec.formula,",",".")) ? utils.stringReplace(spec.formula,",",".") : null;
		var fldTotVariable = jsForm.newVariable('v_' + spec.dataprovider + '_tot'
			                                    ,JSVariable.TEXT
												,defaultTotValue);
		
		totField.dataProviderID        = fldTotVariable.name;
		totField.name 				   = fldName;
		totField.styleClass            = 'default';
		totField.transparent           = false;
		totField.enabled               = false;
		totField.editable              = false;
		totField.horizontalAlignment   = SM_ALIGNMENT.CENTER;
		
		var defaultFormulaValue = spec.formula ? spec.formula.toString() : null;
		jsForm.newVariable('v_' + spec.dataprovider + '_formula'
			               ,JSVariable.TEXT
						   ,"'" + defaultFormulaValue + "'");
	}
	
	if(x > formWidth)
		formWidth = x;
	
	jsForm.width = formWidth;
	jsForm.getBodyPart().height = y + layoutParams.labelHeight + layoutParams.fieldHeight + layoutParams.bottomMargin;
	
	return jsForm;
}

/**
 * @param specification
 * @param {
 * 			{ 
 * 				fieldHeight		: Number, 
 * 				labelHeight		: Number, 
 * 				sideMargin		: Number,
 * 				bottomMargin	: Number
 * 			}
 * 		  } [layoutParams]
 * @param {String} [formName]
 * @param {String} [extendsForm]
 * @param {String} [dataSource]
 * 
 * @properties={typeid:24,uuid:"9D827697-EDFD-4699-8DB7-7C2DB2048DFB"}
 */
function buildTableForm(specification, layoutParams, formName, extendsForm, dataSource)
{
	if(!specification || !dataSource)
		return null;
	
	if(!layoutParams)
		layoutParams = 
		{ 
			  fieldHeight	: 20
			, labelHeight	: 20
			, bottomMargin	: 0
		}
	
	var jsForm = solutionModel.newForm(formName, solutionModel.getForm(extendsForm));
		
		jsForm.navigator = SM_DEFAULTS.NONE;
		jsForm.view = JSForm.LOCKED_TABLE_VIEW;
		jsForm.transparent = false;
		
	/**
	 * The form's coordinates, top-left based
	 */
	var x = layoutParams.sideMargin || jsForm.width, y = 0;
	
	/**
	 * Add any previous element to the tab sequence
	 */
	var maxTabSequence = forms[extendsForm].controller.getTabSequence().length;
	
	var formWidth = jsForm.width;
//	var formHeight = jsForm.getBodyPart().height + (jsForm.getFooterPart() && jsForm.getFooterPart().height);
	
	for(var f in specification)
	{
		/** @type {{ code: String, 
		 * 			 name: String, 
		 * 			 format: String, 
		 * 			 size: Number, 
		 * 			 lines: Number, 
		 * 			 enabled: Boolean, 
		 * 			 visible: Boolean, 
		 * 			 order: Number, 
		 * 			 group: Number, 
		 * 			 type: String, 
		 * 			 dataprovider: String, 
		 * 			 formula: String, 
		 * 			 displaytype: Number, 
		 * 			 regex: String, 
		 * 			 onaction: { name: String, code: String }, 
		 * 			 lookupparams: String, 
		 * 			 filterquery: String, 
		 * 			 filterargs: String,
		 * 			 relation: String,
		 * 			 showndataprovider: String,
		 *           tooltip: String,
		 *           dependson: String,
		 *           contentdataprovider: String,
		 *           hasdefault : Boolean }} 
		 */	
		var field = specification[f];
		
		var fieldAlignment = SM_ALIGNMENT.CENTER;
		var fieldValidator = null;
		
		/**
		 * Add the field to the form according to its type
		 */
		var displayType = JSField.TEXT_FIELD;
		switch(field.type)
		{
			case globals.FieldType.BOOLEAN:
				displayType 	= JSField.CHECKS;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
			
			case globals.FieldType.STRING:
				displayType 	= JSField.TEXT_FIELD;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
				
			case globals.FieldType.DATETIME:
				displayType 	= JSField.TEXT_FIELD;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
				
			case globals.FieldType.INTEGER:
				displayType 	= JSField.TEXT_FIELD;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
				
			case globals.FieldType.NUMBER:
				displayType 	= JSField.TEXT_FIELD;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				
				if(field.regex)
					fieldValidator = jsForm.newMethod
					(
						"function validate_" + field.dataprovider + "(oldValue, newValue, event)\
						 {\
						 	var regex = /" + field.regex + "/;\
						 	if(newValue && newValue > 0 && regex.test(newValue))\
						 	{\
						 		setStatusWarning('Formato non valido');\
						 		return false;\
						 	}\
						 	else\
						 	{\
						 		resetStatus();\
						 		return true;\
						 	}\
						 }"
					);
				else
					fieldValidator = jsForm.getMethod('validateField');
				
				break;
			
			case globals.FieldType.TEXT:
				displayType 	= JSField.TEXT_AREA;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
			
			case globals.FieldType.TRISTATE:
				displayType 	= JSField.COMBOBOX;
				fieldAlignment 	= SM_ALIGNMENT.CENTER;
				break;
				
			default:
				throw 'Field type ' + field.type + ' not recognized';
		}
		
		// Actually add the field. Don't create it if already present
		var formField = jsForm.getField('fld_' + field.dataprovider);
		if(!formField)
		{
			formField = jsForm.newField(null, displayType, x, y + layoutParams.labelHeight, field.size, field.lines * layoutParams.fieldHeight);
			
			// Move coordinates to the next field
			x += formField.width;
		}
		
		formField.dataProviderID 	  = field.dataprovider;
		formField.name 				  = 'fld_' + field.dataprovider;
		formField.format 			  = field.format;
		formField.displayType 		  = displayType;
		formField.toolTipText		  = field.tooltip;
		formField.horizontalAlignment = fieldAlignment;
		formField.enabled			  = 
		formField.editable			  = (field.enabled && !field.dependson); // || field.hasdefault 
		formField.visible 			  = field.visible;
		formField.anchors 			  = SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
		formField.styleClass 		  = 'table';
		formField.displaysTags		  = true;
		formField.transparent         = false;
		
		if(formField.editable)
			formField.tabSeq = maxTabSequence++;
		else
			formField.tabSeq = SM_DEFAULTS.IGNORE;
			
		if(fieldValidator && formField.editable)
			formField.onDataChange = fieldValidator;
			
		if(field.onaction)
		{
			var method = jsForm.getMethod(field.onaction.name)
			if(!method)
				method = jsForm.newMethod(field.onaction.code);
			
			formField.onAction = method; 
		}
			
		// The field is related
		if(field.relation)
		{
			var relObject = plugins.serialize.fromJSON(field.relation);
			if (relObject)
				formField.dataProviderID = dataSource + '_' + relObject.name + '.' + field.contentdataprovider;
		}
			
		// Add a lookup if required
		if (field.enabled && field.lookupparams)
		{
			field.onrender = false;
			
			var lkpBtn 			  = addLookup(field, formField, jsForm, layoutParams);
				lkpBtn.styleClass = 'table';
				
			// Add the label for the button
			var lkpLabel             = jsForm.newLabel(null, lkpBtn.x, lkpBtn.y, lkpBtn.width, layoutParams.labelHeight);
				lkpLabel.name 		 = 'lbl_' + lkpBtn.name;
				lkpLabel.anchors 	 = SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
				lkpLabel.styleClass  = 'table_header';
				lkpLabel.labelFor 	 = lkpBtn.name;
				lkpLabel.transparent = false;
				lkpLabel.tabSeq		 = SM_DEFAULTS.IGNORE;
				
			x += lkpBtn.width;
		}
			
		// Don't apply only if explicity requested
		if(field.onrender !== false)
			formField.onRender = jsForm.getMethod('onFieldRender');
			
		// Add the label for the field
		var fieldLabel = jsForm.newLabel(field.name, formField.x, y, field.size, layoutParams.labelHeight);
			fieldLabel.name 		= 'lbl_' + field.dataprovider;
			fieldLabel.anchors 		= SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
			fieldLabel.styleClass  	= 'table_header';
			fieldLabel.labelFor 	= formField.name;
			fieldLabel.transparent 	= false;
			fieldLabel.tabSeq		= SM_DEFAULTS.IGNORE;
			
		// Add the 'overwrite default value' checkbox
		if(field.hasdefault)
		{
			var checkName = 'chk_setdefault_' + field.dataprovider;

			var overwriteCheck = jsForm.getField(checkName);
			if(!overwriteCheck)
			{
				overwriteCheck = jsForm.newCheck(null, formField.x + formField.width, formField.y, 20, 20);
				x += overwriteCheck.width;
			}
			
			overwriteCheck.dataProviderID      = field.dataprovider + '_setdefault';
			overwriteCheck.name			  	   = checkName
			overwriteCheck.anchors	     	   = SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
			overwriteCheck.transparent	  	   = true;
			overwriteCheck.horizontalAlignment = SM_ALIGNMENT.CENTER;
			overwriteCheck.displaysTags   	   = true;
			overwriteCheck.toolTipText    	   = '%%i18n:ma.pv.lbl.overwrite_default%%';
			overwriteCheck.onRender			   = jsForm.getMethod('onOverwriteDefaultRender');
			overwriteCheck.enabled			   = false;
			overwriteCheck.styleClass          = 'table';
			
			if(formField.enabled)
			{
				overwriteCheck.tabSeq = formField.tabSeq + 1; 
				maxTabSequence++;
			}
			else
				overwriteCheck.tabSeq = SM_DEFAULTS.IGNORE;		
			
			formField.styleClass  = 'table_no_side_border';
			fieldLabel.styleClass = 'table_header_no_side_border';
						
			var labelName      = 'lbl_setdefault_' + field.dataprovider;
			
			var overwriteLabel = jsForm.getLabel(labelName);
			if(!overwriteLabel)
				overwriteLabel = jsForm.newLabel(null, overwriteCheck.x, y, overwriteCheck.width, layoutParams.labelHeight);
			
			overwriteLabel.name 	   = labelName;
			overwriteLabel.anchors 	   = SM_ANCHOR.WEST | SM_ANCHOR.NORTH;
			overwriteLabel.styleClass  = 'table_header';
			overwriteLabel.labelFor    = overwriteCheck.name;
			overwriteLabel.transparent = false;
			overwriteLabel.tabSeq	   = SM_DEFAULTS.IGNORE;
		}
		
		if(x > formWidth)
			formWidth = x;
		
	}
	jsForm.width = formWidth;
	jsForm.getBodyPart().height = y + layoutParams.labelHeight + layoutParams.fieldHeight;
	
	return jsForm;
}

/**
 * @param 			field
 * @param {JSField} formField
 * @param {JSForm} 	jsForm
 * @param 			layoutParams
 * 
 * @properties={typeid:24,uuid:"D7D74FA5-0DCF-4D94-8200-0C58412916FD"}
 */
function addLookup(field, formField, jsForm, layoutParams)
{
	var lookupParams 						   = plugins.serialize.fromJSON(field.lookupparams);
		lookupParams.methodToAddFoundsetFilter = 'filterByQuery';
		lookupParams.returnField			   = field.dataprovider;
		
	if(lookupParams.afterUpdateFunction)
	{
		var afterUpdate = jsForm.newMethod(lookupParams.afterUpdateFunction);
		lookupParams.methodToExecuteAfterSelection = afterUpdate.getName();
	}
	
	if(field.filterquery)
		var filterQuery   = "'" + globals.ma_utl_replaceCatalogs(field.filterquery) + "'";
	
	if(field.filterargs)
	{
		/** @type {Array} */
		var filterArgs = plugins.serialize.fromJSON(field.filterargs);
			filterArgs = filterArgs.map(function(arg){ return { name: arg, type: globals.fieldTypeToJSColumn(field.type) }; });
	}
	
	var lkpMethod   = solutionModel.wrapMethodWithArguments
						(
								  jsForm.getMethod('showLookup')
								, [null, lookupParams, filterQuery, filterArgs]
						);
						
	var lkpBtnWidth 		   		  = layoutParams.lookupButtonWidth || 20;
	var lkpBtn 				     	  = jsForm.newLabel(null, formField.x + formField.width - lkpBtnWidth, formField.y, lkpBtnWidth, lkpBtnWidth);
		lkpBtn.name			     	  = 'btn_' + field.dataprovider;
		lkpBtn.toolTipText       	  = 'Ricerca ' + field.name;
		lkpBtn.onAction		     	  = lkpMethod;
		lkpBtn.imageMedia 	     	  = solutionModel.getMedia('magnifier-left.png');
		lkpBtn.transparent 	     	  = true;
		lkpBtn.showClick 	    	  = false;
		lkpBtn.rolloverCursor   	  = SM_CURSOR.HAND_CURSOR;
		lkpBtn.tabSeq				  = SM_DEFAULTS.IGNORE;
		
		formField.editable       	  = false;
		formField.horizontalAlignment = SM_ALIGNMENT.LEFT;
		
	return lkpBtn;
}

/**
 * Gestisce il cambio del valore per il caso del dettaglio su giorno o meno per la richiesta corrente 
 * 
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"365A07E5-B62D-4046-8659-23808A6E6B1D"}
 */
function onDataChangeDettaglioGiorni(oldValue,newValue,event)
{
	//pulizia di eventuali valori dei campi compilabili e bloccare i campi o viceversa
	var frmName = event.getFormName();
	var frm = forms[frmName];
	var fs = frm.foundset;
		 
	// rollback di eventuali transazioni precedenti (specie se nuova variazione già compilata in dettaglio e modificata togliendo il dettaglio)
	if(databaseManager.getEditedRecords())
		databaseManager.rollbackTransaction();
	
	var specification = ['base','quantita','importo'];
	
	for(var f in specification)
	{
		var fldName = 'fld_' + specification[f];
		if(frm.elements[fldName])
		{
			frm.elements[fldName].enabled = !newValue;
		    if(frm.elements[fldName].editable)
		       	if(fs[specification[f]])
		    		fs[specification[f]] = null;		    
		}
	}
	
	frm.elements['btn_dettaglio_giorni'].enabled = newValue;
}