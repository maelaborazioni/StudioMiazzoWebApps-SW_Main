


/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"F1521B80-5B4E-4408-81F4-AA42BC955B5B",variableType:93}
 */
var vDallaData = new Date();

/**
 * @properties={typeid:35,uuid:"8FA39B84-C663-4112-8B43-8C959CA38D44",variableType:-4}
 */
var vRagioneSociale = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C0436763-9DE0-4C9C-A7F3-62D86AE96121"}
 */
function lkpSelezionaDitta(event) {
	globals.ma_utl_showLkpWindow(
		{	lookup:"AG_Lkp_Ditta",
			returnField:"vCod_ditta",
			event:event,
			methodToAddFoundsetFilter:"filtraDitta",
			methodToExecuteAfterSelection:"aggiornaDitta",
			fieldToReturn:"codice"
		}
	)
}

/**
 * @properties={typeid:24,uuid:"EB204154-43D8-4C64-99A8-C4134CB34D6A"}
 */
function filtraDitta (fs)
{
	var sql="SELECT DISTINCT codditta FROM JBADipendScadenzari";
	var ds=databaseManager.getDataSetByQuery("job",sql,[],-1);
	fs.addFoundSetFilterParam("codice", globals.ComparisonOperator.IN,ds.getColumnAsArray(1));
	
	return fs
}

/**
 * // TODO generated, please specify type and doc for the params
 *
 * @properties={typeid:24,uuid:"9EA2A9D0-2EB5-475A-913F-3707779D3B59"}
 */
function aggiornaDitta (ditta)
{
	vRagioneSociale=ditta.ragionesociale;
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"681BDC78-A8B0-4685-BA5D-0B996A42328F"}
 */
function onRecordSelection(event, _form)
{
	_super.onRecordSelection(event, _form);
	elements.lbl_sostituisce.visible = elements.fld_sostituisce.visible = !!lavoratoresostituito;
}
