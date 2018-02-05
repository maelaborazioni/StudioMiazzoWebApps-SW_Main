///**
// * @properties={type:12,typeid:36,uuid:"D2F5627B-0ED6-428E-8CCF-2F88F39C9BA9"}
// */
//function htmlDesc()
//{
//	
//	var textHtml = infoup;
//	textHtml=textHtml.replace(/<style isBold='true' pdfFontName='Helvetica-Bold'>/g,"<b>");
//	textHtml=textHtml.replace(/<\/style>/g,"</b>");
//	textHtml=textHtml.replace(/\n/g,"<br>");
//	return textHtml + "<br><br>" + infodw;
//}
//
///**
// * @properties={type:12,typeid:36,uuid:"178A3279-73D2-4A5C-9F36-7E138AF44F62"}
// */
//function nominativo()
//{
//	var nominativo = cognome + " " + nome;
//	return nominativo;
//}
//
///**
// * @properties={type:93,typeid:36,uuid:"4776BBD5-3A7E-45E3-85EF-CF53C00BD441"}
// */
//function cessazione_calc()
//{
//	if (utils.dateFormat(datafinerapporto, globals.ISO_DATEFORMAT) == "18000101")  
//		return null;
//	else
//		return datafinerapporto;
//}
//
///**
// * @properties={type:93,typeid:36,uuid:"B6AA21DB-F6D9-4CAC-A153-1263766E7EC2"}
// */
//function scadenzacontratto_calc()
//{
//	if (utils.dateFormat(datascadcontratto, globals.ISO_DATEFORMAT) == "18000101")  
//		return null;
//	else
//		return datascadcontratto;
//}
