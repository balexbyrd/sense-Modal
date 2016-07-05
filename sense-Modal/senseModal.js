
var IdS;
var user;

Object.defineProperty(Array.prototype, 'extend', {
	configurable: true,
	enumerable: false,  
	value:function(arr) {
		arr.forEach(function(v) {
			IdS.push(v[0].qText);
			
		},this);
	}
});
function flattenPages(data) {
	var flat = [];
	$.each(data, function() {
		flat.extend(this.qMatrix);
	});
	return flat;
};				
function pageExtensionData_save(me, $element, layout, qApp, urlP, cnt) {	
	// Build array based on extension dimension
	var lastrow = 0
	var colNums = layout.qHyperCube.qSize.qcx;
	var calcHeight = Math.floor(10000 / colNums);

	me.backendApi.eachDataRow(function(rownum, row) {
		lastrow = rownum;
	});
	if (me.backendApi.getRowCount() > lastrow + 1) {
		var requestPage = [{
			qTop : lastrow + 1,
			qLeft : 0,
			qWidth : colNums,
			qHeight : Math.min(calcHeight, me.backendApi.getRowCount() - lastrow)
		}];
		me.backendApi.getData(requestPage).then(function(dataPages) {
			pageExtensionData_save(me, $element, layout, qApp, urlP, cnt);
		});
	} else {
		var bigMatrix = [];
		bigMatrix = flattenPages(layout.qHyperCube.qDataPages);		
		getCurrSel(qApp, urlP, cnt);	
	};
};

function getCurrSel(qApp,urlP,cnt){	
	var str = {};
	// Get current selections
	qApp.getList("CurrentSelections", function(reply) {	 
		if(cnt != 2){
			return false;
		};
		
		var selFields = reply.qSelectionObject.qSelections;		// Current selections
		var selFields_Len = selFields.length;					// # of selections
		
		// For each selected dimension
		for (var i = 0; i < selFields_Len; i++) {			
			var fld = selFields[i].qField;
			var fvlu = selFields[i].qSelected;
			str[fld] = fvlu;
		};		
		
		// Returns unique dimension
		var sId = _.uniqBy(IdS);
		
		
		var cN = $('#cnameSend').val();				// Task Name
		var saveType = $('input:checked').val();	// Post or Put task
		
		str["IdList"] = sId.join(', ');
		str["saveName"] = cN;
		str["saveUser"] = user;						// Will be null when on QS Desktop
		
		var jsonTxt = JSON.stringify(str, null, '\t'); // Turn selections into JSON
		
		$('#send').unbind('click')
		if(saveType === 'POST'){
			cnt += 1;
			AjaxPOST(jsonTxt,urlP,saveType,cnt);			
		} else if(saveType === 'PUT'){
			location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
		};
	});
};

function AjaxPOST(jsonTxt,urlP,saveType,cnt){	
	$.ajax({
		type: saveType,
		url: urlP,
		contentType: "application/json",
		data: jsonTxt,
		success: function(data, textStatus, jqXHR){					
			console.log('Success',data, cnt);
			$('#modalSend').modal('hide');
			$('#strap').remove();
			
		},
		error: function(e) {
			console.log('Failed',e);
			$('#strap').remove();
			return false;
		}
	});
};

define( [
	'jquery',
	'js/qlik',
	"text!./css/scoped-bootstrap.css",
	"text!./css/style.css",
	"text!./html/modal.html",
	"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js" // Lodash CDN for arrays
],
    function ($,qlik, boot, cssContent, modal ) {
        'use strict';
		
		$( '<style>' ).html( boot ).appendTo( 'head' ); // Adding scoped bootstrap to head			
		$( '<style>' ).html( cssContent ).appendTo( 'head' ); // Adding scopped style to head				
		$( '<div>' ).html( modal ).appendTo( 'body' ); // Adding modal to body		
		$( '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css">' ).appendTo( 'head' ); // Font Awesome CDN		
		$( '<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js">' ).appendTo( 'body' ); // Bootstrap.js CDN
		
        return {
            definition: {
                type: "items",
                component: "accordion",
                items: {
                   dimensions: {
                        uses: "dimensions",
						min: 1,
						max: 1
					},						
                    jsonURL: {
						ref: "props.urlPost",
						label: "JSON URL",
						type: "string",
						defaultValue: "http://jsonplaceholder.typicode.com/posts"
					},
                    bName: {
						ref: "props.bName",
						label: "Button Name",
						type: "string",
						defaultValue: "-Enter Button Name-"
					},
					bIcon: {
						ref : "props.icon2",
						label : "Font Awesome icon",
						type : "string",
						defaultValue : "fa fa-thumbs-o-up"						
					}
                }
            },
            initialProperties: {
                qHyperCubeDef: {
					qDimensions: [],  
                    qMeasures: [],
                    qInitialDataFetch: [
                        {
                            qWidth: 1,
                            qHeight: 1
                        }
                    ]
                }
            },			
            paint: function ( $element, layout) {								
				
				$element.empty();
				var me = this;
				var qApp = qlik.currApp();
				var bName = layout.props.bName;			// Button Name
				var bIcon = layout.props.icon2;			// Button Icon
				var urlP = layout.props.urlPost;		// URL to post JSON to
				var ewd = $element.width();
				IdS = []; 								// ID List

				var cnt = 1;				
				var id = layout.qInfo.qId; //Get this extension's ID --> !important
				
				// Create scoped bootstrap div
				var $bootstrapStyle = $( '#' + id );
				$bootstrapStyle = $( document.createElement( 'div' ) ).attr( 'id', id  ).addClass( 'bootstrap_inside' );
				
				// Create Button
				var html = '';
				html += '<div  class="btn-group" style="overflow: scroll;">';
				html +=		'<button id="modButton" style="width: '+ewd+'px;" data-toggle="dropdown" class="btn btn-primary dropdown-toggle"><i id="iconButton" class="'+bIcon+'"></i>&nbsp;&nbsp;'+bName+'&nbsp;&nbsp;<span class="caret"></span></button>';
				html +=		'<ul class="dropdown-menu" style="width: '+ewd+'px;">';								
				html +=			'<li id="modSave" data-toggle="modal" data-target="#modalSend"><a ><i class="fa fa-angle-double-right"></i>&nbsp;&nbsp;Save Selections</a></li>';
				//html +=			'<li class="divider"></li>';				
				//html +=			'<li id="cohortReceive"><a ><i class="fa fa-angle-double-left"></i>&nbsp;&nbsp;Fetch Selections</a></li>';
				html +=		'</ul>';
				html +=	'</div>';
				
				
				$bootstrapStyle.html( html );
				// Inject button
				$element.html( $bootstrapStyle );
				
				
				
				// Dropdown positioning
				$('#'+id+' .dropdown-toggle').click(function (){
					dropDownFixPosition($('#'+id+' button'),$('#' + id+' .dropdown-menu'));
				});
				
				function dropDownFixPosition(button,dropdown){
					// Position the dropdown
					var dropDownTop = button.offset().top + button.outerHeight();
					dropdown.css('top', dropDownTop + "px").css('left', button.offset().left + "px");
					
					// To bring the dropdown to the top
					$('article').css({zIndex: '0', position: 'relative'});
					dropdown.closest('article').removeAttr('style');
				}
				
				// Used to retrieve username on Qlik Sense server to be used in the JSON string
				var global = qlik.getGlobal();
				global.getAuthenticatedUser(function(reply){					
					user= reply.qReturn.split('=')[2];
				});	
				
				// When 'Save Selections' is clicked
				 $('#'+id+' #modSave').on('click', function(event) {
					// Attach Bootstrap CSS CDN
					$( '<link rel="stylesheet" id="strap" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">' ).appendTo( 'head' ); 
					
					cnt = 2;
					
					// Create Modal
					$('#modalSend').hide().toggle(400);
				 });
				
				// When modal 'Cancel' is clicked remove the bootstrap CDN to not conflict with styles
				$('.strap').on('click', function(event) {
					$('#strap').remove();
				});
				
				// When modal 'Save Selections' is clicked
				$('#send').on('click', function() {
					if($('#cnameSend').val().length > 4){						
						pageExtensionData_save(me, $element, layout, qApp, urlP, cnt);
					};
				});
				
				// Blocks a 'submit' call
				$("form").submit(function() { return false; });							
			}
        };
    });