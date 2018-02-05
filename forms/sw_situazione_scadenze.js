/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"53F96092-6E69-499B-91E3-37EC4BF3E242",variableType:93}
 */
var vAllaData = new Date();

/**
 * @properties={typeid:35,uuid:"A06D788E-C51D-4EE9-976F-9C9EB9ACD22E",variableType:-4}
 */
var vCod_ditta = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"8EA85655-DB49-4403-A5F5-AF2AFAFA402E",variableType:93}
 */
var vDallaData = new Date();

/**
 * @properties={typeid:35,uuid:"257174FA-B09B-4FB1-BA50-FB5831F18AD0",variableType:-4}
 */
var vRagioneSociale = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CED6933D-86F5-421F-8870-71D5A6F4464F",variableType:4}
 */
var chkFtrCategoria = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B105EB8D-F5E8-457C-9BAF-95AEA11C2D7A",variableType:4}
 */
var chkFtrScadenziario = 0;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"84562969-BAD6-42BF-8F23-0E138B618077",variableType:12}
 */
var vCategoria = '';
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"EAA073D0-4266-4F9D-BA2D-C421F394556A",variableType:8}
 */
var vIdCategoria = null;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C79F0571-04FB-490E-B4F9-DF9404C7F3D2",variableType:12}
 */
var vScadenziario = '';
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"836D2D52-F503-4E4F-ABB8-12BF3A716C5F",variableType:8}
 */
var vIdScadenziario = null;

/**
 * @properties={typeid:24,uuid:"C680DB2F-2173-4C66-B38A-CA24743FBC1E"}
 */
function init(firstShow)
{
	foundset.sort('datascadenza asc, cognome asc, nome asc');
//	elements.scadenziario_tab.dividerSize = 0;
    elements.fld_check_categorie.readOnly = false;
    elements.fld_check_scadenziari.readOnly = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E5F82F6D-7E1F-4CF2-A45E-42EF6831F5A1"}
 */
function lkpSelezionaDitta(event) 
{
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
 * @properties={typeid:24,uuid:"186BF528-1EA9-49B8-835B-889367371DC2"}
 */
function filtraDitta (fs)
{
	var sql="SELECT DISTINCT codditta FROM JBADipendScadenzari";
	var ds=databaseManager.getDataSetByQuery("job",sql,[],-1);
	fs.addFoundSetFilterParam("codice", globals.ComparisonOperator.IN,ds.getColumnAsArray(1));
	
	return fs
}

/**
 * @properties={typeid:24,uuid:"B762D8D7-A44E-4229-AF35-A03FEDD8335D"}
 */
function aggiornaDitta(ditta)
{
	vRagioneSociale=ditta.ragionesociale;
}

/**
 * Filtra le categorie di scadenziari selezionabili
 * 
 * @param {JSFoundset<db:/ma_scadenziari/tab_categoriescadenziari>} fs
 *
 * @properties={typeid:24,uuid:"AF97FC7F-35BC-46B5-B10E-159BDB10B45F"}
 */
function FiltraCategoria(fs)
{
	var sql = "SELECT idTabCategoriaScadenziario FROM Tab_Scadenziari \
        WHERE idTabScadenziario IN \
        (SELECT idTabScadenziario FROM Tab_ScadenziariModelli)";
   var ds = databaseManager.getDataSetByQuery(globals.Server.MA_SCADENZIARI,sql,null,-1);
   fs.addFoundSetFilterParam('idtabcategoriascadenziario','IN',ds.getColumnAsArray(1));
   fs.loadAllRecords();
   return fs;
}

/**
 * Filtra gli scadenziari selezionabili
 * 
 * @param {JSFoundset<db:/ma_scadenziari/tab_scadenziari>} fs
 *
 * @properties={typeid:24,uuid:"A26C4952-CA61-454D-85BA-224576D2D798"}
 */
function FiltraScadenziario(fs)
{
	var sql = "SELECT idTabScadenziario FROM Tab_ScadenziariModelli";
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_SCADENZIARI,sql,null,-1);
	fs.addFoundSetFilterParam('idtabscadenziario','IN',ds.getColumnAsArray(1));
	fs.loadAllRecords();
	return fs;
}

/**
 * Aggiorna la visualizzazione dopo la selezione del filtro 
 *  
 * @param {JSRecord<db:/ma_scadenziari/tab_categoriescadenziari>} rec
 *
 * @properties={typeid:24,uuid:"9D272A15-6009-4FAE-B7A8-0D2AD0342640"}
 */
function AggiornaCategoria(rec)
{
	vIdCategoria = rec.idtabcategoriascadenziario;
	vCategoria = rec.descrizione;
	
	aggiornaVisualizzazione();
}

/**
 * Aggiorna la visualizzazione dopo la selezione del filtro
 * 
 * @param {JSRecord<db:/ma_scadenziari/tab_scadenziari>} rec
 *
 * @properties={typeid:24,uuid:"A200D1F5-D69E-45F0-9638-BAD7686485F2"}
 */
function AggiornaScadenziario(rec)
{
	vIdScadenziario = rec.idtabscadenziario;
    vScadenziario = rec.descrizione;

    aggiornaVisualizzazione();
}

/**
 * Aggiorna la visualizzazione dello scadenziario in base ai filtri selezionati
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"E3B4D913-0647-4E36-BC3E-5BE0687693DB"}
 */
function aggiornaVisualizzazione()
{
	var frm = forms.sw_situazione_scadenze_tbl;
	var fs = frm.foundset;
	if(chkFtrCategoria || chkFtrScadenziario)
	{
		fs.find();
		if(chkFtrCategoria)
			fs.idcategoria = vIdCategoria;
		if(chkFtrScadenziario)
			fs.iddettaglio = vIdScadenziario;
		fs.search();
	}
	else
		fs.loadAllRecords();
}
/**
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"16986F39-AA35-4582-B131-64F1ACDF6A34"}
 */
function onDataChangeChkCategoria(oldValue, newValue, event) 
{
	if(!newValue || vIdCategoria)
	   aggiornaVisualizzazione();
	return true;
}

/**
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"78B94D2F-B62C-4F66-ADB5-30E58F1DCD57"}
 */
function onDataChangeScadenza(oldValue, newValue, event)
{
	if(!newValue || vIdScadenziario)
	   aggiornaVisualizzazione();
	return true;
}
