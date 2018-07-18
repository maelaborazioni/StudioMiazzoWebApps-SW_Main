/**
 * @properties={typeid:24,uuid:"ED0CDBC0-A129-4E5E-B5F1-65CAA6ACB35E"}
 */
function apriStampaScadenziari ()
{
	globals.ma_utl_showFormInDialog(forms.sw_stampa_scadenziario.controller.getName(),"Stampa scadenziario");
}

/**
 * @properties={typeid:24,uuid:"5B887B85-7BAF-4C26-9275-957CB378C7CD"}
 * @AllowToRunInFind
 */
function selezione_SW()
{
	var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD);
	if(recSingolaDitta)
		apriSW(recSingolaDitta);
	else
	if (globals._filtroSuDitta)
	{
		/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
		if(fs.find())
		{
			fs.tipologia = 0;
			fs.idditta = globals._filtroSuDitta;
			if(fs.search())
				apriSW(null);
			else
				globals.ma_utl_showInfoDialog('Non esistono scadenziari per la ditta selezionata','Scadenziari');
		}
		
		

	} else
	{
		var _event = new JSEvent;
		globals.svy_nav_showLookupWindow(_event, "", 'AG_Lkp_Ditta', 'apriSW', 'filtraDittaStandard',
		             	                 null, null, "", true);
	}
}

/**
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"62C863AF-A337-47B0-B9BB-B45F494231AE"}
 */
function apriSW(_rec)
{
	var _form = globals.openProgram('SW_Scadenziario');
	if (_rec)
		lookup(_rec['idditta'], _form);
	else
		lookup(globals._filtroSuDitta);
   	
}

/**
 * @properties={typeid:24,uuid:"90F69F69-A8CA-43B2-BCB4-A0D670140C9A"}
 * @AllowToRunInFind
 */
function ma_sw_onSolutionOpen(startArgs)
{
	// Escludi scadenze già viste
//	databaseManager.addTableFilterParam
//	(
//			  globals.Server.MA_SCADENZIARI
//			, globals.Table.SCADENZIARI_REPORT
//			, 'visto'
//			, globals.ComparisonOperator.EQ
//			, globals.FALSE
//			, 'ftr_scadenziari_non_visti'
//	);
}