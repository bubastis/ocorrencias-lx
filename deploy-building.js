const fetch = require('node-fetch');
const fs = require("fs"); 
const dataFile = require.resolve('../.../data.json');
 
exports.handler = async function(event, context) {

  try {
    const response = await fetch('https://gisapps.cm-lisboa.pt/arcgisapps/rest/services/GOPI_Maps_Secure/NaMinhaRuaRead_PROD/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=id%2Cnumero%2Crequerente%2Cemail%2Clocal%2Creferencia%2Cdescricao%2Ctipo%2Carea%2Cfreg_descricao%2Cstate&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=id+DESC&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=500&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson', {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()
    console.log(data)
    
    fs.writeFile(dataFile, JSON.stringify({data}), err => { 
      // Checking for errors 
      if (err) throw err;  
      console.log("Wrote json"); // Success 
    }); 
    const stats = fs.statSync(dataFile);
    console.log(stats.mtime)
  
    return {
      statusCode: 200,
      /* body: JSON.stringify({ data }), */
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  } 
}
