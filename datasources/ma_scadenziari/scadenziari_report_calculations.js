/**
 * @properties={type:12,typeid:36,uuid:"01D2970A-4CBA-497B-8F37-F3166339EACE"}
 */
function note()
{
	return infonb ? 'N.B.: ' + infonb : '';
}

/**
 * @properties={type:12,typeid:36,uuid:"22EA7969-9D9E-48F2-BA25-D0DCBF9DEE54"}
 */
function html_info()
{
	
	var textHtml = infoup;
	textHtml=textHtml.replace(/<style isBold='true' pdfFontName='Helvetica-Bold'>/g,"<b>");
	textHtml=textHtml.replace(/<\/style>/g,"</b>");
	textHtml=textHtml.replace(/\n/g,"<br>");
	return textHtml + "<br><br>" + infodw;
}
