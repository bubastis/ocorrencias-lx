$(document).ready( function () {
    var table = $('#lista').DataTable({
        ajax: {
            url: 'https://gisapps.cm-lisboa.pt/arcgisapps/rest/services/GOPI_Maps_Secure/NaMinhaRuaRead_PROD/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=id%2Cnumero%2Crequerente%2Cemail%2Clocal%2Creferencia%2Cdescricao%2Ctipo%2Carea%2Cfreg_descricao%2Cstate&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=id+DESC&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=500&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson',
            dataSrc: 'features'
        },
        "dom": '<"top">rt<"bottom"p><"clear">',
        "language": {
            search: "_INPUT_",
            searchPlaceholder: "Pesquisar...",
            loadingRecords: "A carregar..",
            paginate: {
                "first":      "Início",
                "last":       "Fim",
                "next":       "Seguinte",
                "previous":   "Anterior"
            }
            
          },
        "pageLength": 100, 
        columns: [
            { data: 'properties.id'},
            { data: 'properties.numero', visible: false},
            { data: 'properties.requerente' , visible: false},
            { data: 'properties.email', visible: false },
            { data: 'properties.local', visible: false },
            { data: 'properties.referencia', visible: false },
            { data: 'properties.descricao' , visible: false},
            { data: 'properties.tipo' },
            { data: 'properties.area' },
            { data: 'properties.freg_descricao' },
            { data: 'properties.state' }
        ],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal(),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll()
            }
        }
    });

    // var table = $('#mytable').DataTable();

    $('#lista tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        $(this).addClass("hovered");
        $(".modal-title").text("Ocorrência Nº" + data.properties.id);
        $('.modal-body').empty();
        $(".modal-body").append("<p>" + data.properties.area + " → " + data.properties.tipo + "</p>");
        console.log(data.geometry)
        $(".modal-body").append("<img alt='static Mapbox map of the San Francisco bay area' src='https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+000(" + data.geometry.coordinates[0] + "," + data.geometry.coordinates[1] + ")/" + data.geometry.coordinates[0] + "," + data.geometry.coordinates[1] + ",18,0.00,0.00/1000x600@2x?access_token=pk.eyJ1IjoiZWFzdDE5OTkiLCJhIjoiY2l5dW96ZXZxMDFyMzM4bXl6MDI3M2liOSJ9.zN_d4GPduMmFnsFDYuNnGw' ></img>")
        $(".modal-body").append("<table><tbody>");
        $(".modal-body").append("<tr><td>Freguesia</td><td>" + data.properties.freg_descricao + "</td></tr>");
        $(".modal-body").append("<tr><td>Local</td><td>" + data.properties.local + "</td></tr>");
        $(".modal-body").append("<tr><td>Descrição</td><td>" + data.properties.descricao + "</td></tr>");
        $(".modal-body").append("<tr><td>Requerente</td><td>" + data.properties.requerente + "</td></tr>");
        $(".modal-body").append("<tr><td>Email</td><td>" + data.properties.email + "</td></tr>");
        $(".modal-body").append("</table></tbody>");
        $('.modal').modal('toggle');
    });

    $('#pesquisa').on('keyup change', function () {
        table.search(this.value).draw();
    });

    $('#infoWindow').on('hidden.bs.modal', function (e) {
        $("tr").removeClass("hovered");
      })
});


