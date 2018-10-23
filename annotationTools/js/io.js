/** @file Input/output functions for writing annotation files to the LabelMe server. */

function ReadXML(xml_file,SuccessFunction,ErrorFunction) {
  $.ajax({
    type: "GET",
    url: xml_file,
    dataType: "xml",
    success: SuccessFunction,
    error: ErrorFunction
  });
}

function WriteXML(url,xml_data,SuccessFunction,ErrorFunction) {
    oXmlSerializer =  new XMLSerializer();
    sXmlString = oXmlSerializer.serializeToString(xml_data);
        
    // use regular expressions to replace all occurrences of
    sXmlString = sXmlString.replace(/ xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g, "");

                     
    $.ajax({
    type: "POST",
    url: url,
    data: sXmlString,
    contentType: "text/xml",
    dataType: "text",
    success: SuccessFunction,
    error: function(xhr,ajaxOptions,thrownError) {
      console.log(xhr.status);          
      console.log(thrownError);
    }
  });
}

// add by jeff
function ReadAttributes() {
  var req = new XMLHttpRequest();
  var url = "Attributes.xlsx"
  req.open("GET", url, true);
  req.responseType = "arraybuffer";

  req.onload = function(e) {
    /* parse the data when it is received */
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, {type:"array"});
    for( var i = 0; i < workbook.SheetNames.length; i++)
    {
      var sheet = workbook.Sheets[workbook.SheetNames[i]]
      var result = [];
      var row;
      var objname;
      var rowNum;
      var colNum;
      var range = XLSX.utils.decode_range(sheet['!ref']);
      for(colNum=range.s.c; colNum<=range.e.c; colNum++){
          row = [];
          for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
              var nextCell = sheet[
                XLSX.utils.encode_cell({c: colNum, r: rowNum})
              ];
              if( typeof nextCell === 'undefined' );
              else {
                if(rowNum == 0)
                  objname = nextCell.w;
                else
                  row.push(nextCell.w);
              } 
          }
          result.push({obj_name:objname,attributes:row});
      }      
      projects_objs_attributes.push({project:workbook.SheetNames[i],result});
    }

    //need ReadAttributes done before StartupLabelMe
    StartupLabelMe();

  };
  req.send();
}