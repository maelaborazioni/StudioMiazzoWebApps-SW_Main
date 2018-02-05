
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"08EFE9B9-E818-432A-AC9A-334BC7539AE2",variableType:8}
 */
var vCod_ditta = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"2687A01C-0034-4EDC-85E1-DF81449AFD34"}
 */
var vRagioneSociale = null;
/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"7ACEFF8C-5A27-463E-AE6B-B9DFA8ADFAAA",variableType:93}
 */
var vDallaData = new Date();
/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"90BC0F0A-0871-4DCA-BCB8-3D4169D1128A",variableType:93}
 */
var vAllaData = new Date();


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4DB4B856-BDB3-4E71-A3E9-F9682790E1CD"}
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
 * @properties={typeid:24,uuid:"C29EAD82-D0AE-4EC7-AD35-687AA3E2C965"}
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
 * @properties={typeid:24,uuid:"FD25047E-8B4F-4943-A8FC-52F642198401"}
 */
function aggiornaDitta (ditta)
{
	vRagioneSociale=ditta.ragionesociale;
}