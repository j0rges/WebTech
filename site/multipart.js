function parseMultipart(body){
  parts = body.split(boundary);
  indices = [];

  for (var i in parts){
    parts[i] = parseMultipartPiece(parts[i]);
    if(parts[i].content == undefined){
      // to adjust for the indices changing.
      indices.push(i - indices.length);
    }
  }
  //delete the elements that are empty:
  for (var i = 0; i < indices.length; i++) {
    parts.splice(indices[i],1);
  }
  return parts;
}

// Returns an object with the name of the form field as attribute field and
// the content as attribute content.
function parseMultipartPiece(piece){
  let field = {filename: "", contentType: "text/plain", content: ""};
  let temp;
  temp = piece.substring(piece.indexOf("name=\"")+6);
  field.name = temp.substring(0,temp.indexOf("\""));

  let index = piece.indexOf("filename=\"");
  // Parse a piece that carries a file.
  if(index > 0){
    temp = piece.substring(index+10);
    field.filename = temp.substring(0,temp.indexOf("\""));
    temp = piece.substring(piece.indexOf("Content-Type: ")+14);
    field.contentType = temp.substring(0,temp.indexOf("\r\n"));
    temp = temp.substring(temp.indexOf("\r\n")+2);
    field.content = temp.substring(0,temp.lastIndexOf("\r\n"));
  }
  // Parse a piece that contains text.
  else{
    piece = piece.split("\r\n");
    field.content = piece[3];
  }
  return field;
}

module.exports = {
  parseMultipart: parseMultipart
}
