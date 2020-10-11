var table = $('#lista').DataTable({
    ajax: {
        url: '/data/lx.json',
        dataSrc: 'features'
    },
    "dom": '<"top">rt<"bottom"p><"clear">',
    "order": [[ 0, "desc" ]],
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
        { data: 'properties.state',
            render: function ( data, type, full ){
                if (data == "Resolvido") {
                    return '<span class="badge badge-success">' + data + '</span>'
                }
                else if (data == "Em execução") {
                    return '<span class="badge badge-warning">' + data + '</span>'   
                }
                else if (data == "Em análise") {
                return '<span class="badge badge-danger">' + data + '</span>'   
                }
                else if (data == "Registado para Resolução") {
                return '<span class="badge badge-info">Registado</span>'   
                }
                else {
                    return data;
                }
            }
        }
    ],
    "initComplete": function(settings, json) {
        makeChart(json)

    }
});

function makeChart(json) {
    var areas = [];
    json.features.forEach(el => {
        areas.push(el.properties.freg_descricao)
    }) 
    var areaCounting = areas.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    var areaCounted = Array.from(areaCounting.keys());
    var areaCountedNames = Array.from(areaCounting.values());

    var ctx = document.getElementById("v-bargraph");

    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: areaCounted,
            datasets: [{
                data: areaCountedNames,
                backgroundColor: "#00A0DD"
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {display:false},
            tooltips: {enabled: true},
            spanGaps: false,
            title: {
                display: true,
                text: 'Ocorrências por freguesia',
                fontColor: '#999999',
                fontFamily: '"Kumbh Sans", sans-serif',
                fontStyle: 'normal',
                fontSize: 14
            },
            scales: {
                xAxes: [{
                    gridLines: {
                      display:false,
                      offsetGridLines: true,
                      color: "#333333"
                    },
                    ticks: {
                      beginAtZero:true,
                      fontColor: "#a3b809",
                      display: false
                    }
                 }],
               yAxes: [{
                ticks: {
                  beginAtZero:true,
                  offsetGridLines: true,
                  fontColor: "#999999",
                  precision: 0,
                  maxTicksLimit: 4
                },
                gridLines: {
                  color: "#333333",
                  display:false,
                  zeroLineColor: "#333333"}
                }]
            }
        }
    });
}

$('#lista tbody').on('click', 'tr', function () {
    var data = table.row( this ).data();
    $(this).addClass("hovered");
    $(".modal-title").text("Ocorrência Nº" + data.properties.id);
    $('.modal-body').empty();
    $(".modal-body").append("<p>" + data.properties.area + " → " + data.properties.tipo + "</p>");
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