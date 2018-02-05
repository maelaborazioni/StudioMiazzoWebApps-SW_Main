

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"13FBF05D-56DE-40DF-B5A0-5020F23D0B31",variableType:93}
 */
var vAllaData = new Date();

/**
 * @properties={typeid:35,uuid:"396E6696-A9D0-48C5-86B9-C8F0B7BDE7CB",variableType:-4}
 */
var vCod_ditta = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"81C86D9B-88F8-41C2-BA07-52CD8563AD4A",variableType:93}
 */
var vDallaData = new Date();

/**
 * @properties={typeid:35,uuid:"7472D034-1A65-455D-9B69-94C7710F6317",variableType:-4}
 */
var vRagioneSociale = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D719EC42-43F4-4620-B00F-106814DA94DF"}
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
 * @properties={typeid:24,uuid:"20112D6A-C2A1-43F0-B525-836FFD18C5DF"}
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
 * @properties={typeid:24,uuid:"4F5EFED8-69F0-43D5-B316-E21D420A37C0"}
 */
function aggiornaDitta (ditta)
{
	vRagioneSociale=ditta.ragionesociale;
}
