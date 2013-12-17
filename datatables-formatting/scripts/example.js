$(document).ready(function() {
    $('#example').dataTable( {
        "bProcessing": true,
        "bDeferRender": true,
		"aoColumns": [ 
		{ "mData": "Raw" },
		{
			"mData": "Whole",
			"mRender": function(data, type, full){
				return $.formatNumber(data, {format:"#,###", locale:"us"});
			}
		},
		{
			"mData": "Currency",
			"mRender": function(data, type, full){
				return $.formatNumber(data, {format:"$#,###.00", locale:"us"});
			}
		},
		{
			"mData": "Floating",
			"mRender": function(data, type, full){
				return $.formatNumber(data, {format:"#,###.00##", locale:"us"});
			}
		} 
		],
		"aaData": [
			{
			  "Raw": 626319.563988105,
			  "Whole": 626319.563988105,
			  "Currency": 626319.563988105,
			  "Floating": 626319.563988105
			},
			{
			  "Raw": 31108.7,
			  "Whole": 31108.7,
			  "Currency": 31108.7,
			  "Floating": 31108.7
			},
			{
			  "Raw": 75367.29,
			  "Whole": 75367.29,
			  "Currency": 75367.29,
			  "Floating": 75367.29
			},
			{
			  "Raw": 52350.527,
			  "Whole": 52350.527,
			  "Currency": 52350.527,
			  "Floating": 52350.527
			},
			{
			  "Raw": 95671,
			  "Whole": 95671,
			  "Currency": 95671,
			  "Floating": 95671
			},
			{
			  "Raw": 695.6828912,
			  "Whole": 695.6828912,
			  "Currency": 695.6828912,
			  "Floating": 695.6828912
			},
			{
			  "Raw": 1962.1290806,
			  "Whole": 1962.1290806,
			  "Currency": 1962.1290806,
			  "Floating": 1962.1290806
			},
			{
			  "Raw": 89.9812305,
			  "Whole": 89.9812305,
			  "Currency": 89.9812305,
			  "Floating": 89.9812305
			},
			{
			  "Raw": 189.5998652,
			  "Whole": 189.5998652,
			  "Currency": 189.5998652,
			  "Floating": 189.5998652
			},
			{
			  "Raw": 484.8545123,
			  "Whole": 484.8545123,
			  "Currency": 484.8545123,
			  "Floating": 484.8545123
			}
		  ]
    } );
} );