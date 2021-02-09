//get Active then populate		
var gene_length = 24;

function get_active(callback_active_list) {
	//if(response==undefined){return true}
	$("#side_menu_waiting").show();
	maingetActiveGeneList(function(response) {
		if (response.length > 0) {
			//var basket_name=response[0].gene_basket_name;
			var basket_name = (response[0].gene_basket_name.length >= gene_length) ? response[0].gene_basket_name.substring(0, gene_length) + '..' : response[0].gene_basket_name;
			MAIN_ACTIVE_GENELIST_ID = response[0].gene_basket_id;
			MAIN_ACTIVE_GENELIST_NAME = response.gene_basket_name;
			if ((response[0].gene_list.split(",").filter(function(el) {
					return el.length != 0
				})).length > 0) {
				MAIN_ACTIVE_GENELIST = response[0].gene_list;
			}
			else {
				MAIN_ACTIVE_GENELIST = "";
			}
		}
		else {}
		populate_sidebar_list(function(populated_all_call) {
			$("#side_menu_waiting").hide();
			MAIN_ALL_OBJ = populated_all_call; // this might take time so remove this or introduce new API method only to get numbers not full geneist
			MAIN_ACTIVE_OBJ = response; // cut paste these four lines after this function
			MAIN_ACTIVE_GENELIST_ARRAY.splice(0, MAIN_ACTIVE_GENELIST_ARRAY.length);
			MAIN_ACTIVE_GENELIST_ARRAY.push(MAIN_ACTIVE_GENELIST.split(","))
			callback_active_list(response)
			if (typeof common_init === 'function') {
				common_init(MAIN_ACTIVE_GENELIST_ARRAY);
			}
		});
	});
}
//Populate sidebar genelist and highlight
function populate_sidebar_list(callback_all_list) {
	maingetAllGeneList(function(response) {
		var tab = document.getElementById("js_table");
		//tab.innerHTML="";
		var tr, tn;
		for (var i = 0; i < response.length; i++) {
			tr = document.createElement('tr');
			var gene_b_name_tooltiip = response[i].gene_basket_name.toString();
			var gene_b_number = (response[i].gene_list.split(",").filter(function(el) {
				return el.length != 0
			})).length;
			var gene_b_name = (response[i].gene_basket_name.length >= gene_length) ? response[i].gene_basket_name.substring(0, gene_length) + '..' : response[i].gene_basket_name;
			if (MAIN_ACTIVE_GENELIST_ID == response[i].gene_basket_id) {
				tn = '<td><font style="color:#FF0000">' + gene_b_name + '</font> </a><span class="hint--top hint--error" aria-label="Open ' + gene_b_name_tooltiip + ' gene list" style="cursor: pointer" ><a  href="plugins/genelist/tool.php" data-toggle="modal" data-target="#myModal"   data-refresh="true" class="fa fa-eye" aria-hidden="true"></a></span></td><td><font style="color:#FF0000">' + gene_b_number + '</font></td><td><span style="cursor:pointer"  onclick="editme(\'' + response[i].gene_basket_id + '\',\'' + gene_b_name + '\')" class="hint--top hint--error" aria-label="Rename GeneList"><font style="color:#FF0000"><i class="tablemenu fa-edit"></i></font></span></td><td><span onclick="delete_genelist(' + response[i].gene_basket_id + ')" class="hint--left hint--error" style="cursor:pointer" aria-label="Delete GeneList"><font style="color:#FF0000"><i class="tablemenu fa-trash"></i></font></span></td>'
				update_sidebar_numbers(gene_b_number);
			}
			else {
				tn = '<td><a onclick="makemedefault(' + response[i].gene_basket_id + ')"  class="deactive_list" ><font id="' + response[i].gene_basket_id + '"  style="color:#7ab6ab;cursor:pointer">' + gene_b_name + '</font> </a><span class="hint--top hint--error" aria-label="Open ' + gene_b_name_tooltiip + ' gene list" style="cursor: pointer" ><a onclick="makemedefault(' + response[i].gene_basket_id + ')"  href="plugins/genelist/tool.php" data-toggle="modal" data-target="#myModal"   data-refresh="true" class="fa fa-eye" aria-hidden="true"></a></td><td>' + gene_b_number + '</td><td><span class="hint--top" style="cursor:pointer" onclick="editme(\'' + response[i].gene_basket_id + '\',\'' + gene_b_name + '\')" aria-label="Rename GeneList"><i class="tablemenu fa-edit"></i></span></td><td><span style="cursor:pointer" onclick="delete_genelist(' + response[i].gene_basket_id + ')"  class="hint--left" aria-label="Delete GeneList"><i class="tablemenu fa-trash"></i></span></td>';
			}
			tr.innerHTML = tn;
			//tab.appendChild(tr);
		}
		callback_all_list(response);
	});
}
//Delete genelist by id	
function delete_genelist(delete_id) {
	var tmp_url = "//api.plantgenie.org/genelist/delete_list_by_id?name=" + MAIN_GENELIST_DATABASE + "&fingerprint=" + MAIN_FINGERPRINT + "&basket_id=" + delete_id + "&table=" + MAIN_GENELIST_TABLE
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			get_active(function(e) {
				//console.log(e)
			});
		}
	};
	xhttp.open("POST", tmp_url, true);
	xhttp.send();
}
//Click and make default by id	
function makemedefault(id) {
	var tmp_url = "//api.plantgenie.org/genelist/make_me_active_by_id?name=" + MAIN_GENELIST_DATABASE + "&fingerprint=" + MAIN_FINGERPRINT + "&basket_id=" + id + "&table=" + MAIN_GENELIST_TABLE
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			get_active(function(e) {
				//console.log(e)
			});
		}
	};
	xhttp.open("POST", tmp_url, true);
	xhttp.send();
}
//Edit selected genelist name	
function editme(id, name) {
	MAIN_ACTIVE_GENELIST_ID = id;
	MAIN_ACTIVE_GENELIST_NAME = name;
	$("#formBarang").show();
	$("#namebarangid").val(name);
	current_opration = "edit";
}
//Save genelist name by id	
function savenewname() {
	if (current_opration == "edit") {
		var tmp_url = "//api.plantgenie.org/genelist/rename_list_by_id?name=" + MAIN_GENELIST_DATABASE + "&fingerprint=" + MAIN_FINGERPRINT + "&basket_id=" + MAIN_ACTIVE_GENELIST_ID + "&table=" + MAIN_GENELIST_TABLE + "&list_name=" + $("#namebarangid").val()
	}
	if (current_opration == "add") {
		var tmp_url = "//api.plantgenie.org/genelist/create_list?name=" + MAIN_GENELIST_DATABASE + "&fingerprint=" + MAIN_FINGERPRINT + "&basket_id=" + MAIN_ACTIVE_GENELIST_ID + "&table=" + MAIN_GENELIST_TABLE + "&list=&list_name=" + $("#namebarangid").val()
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			get_active(function(e) {
				console.log(e)
			});
			$("#formBarang").hide();
		}
	};
	xhttp.open("POST", tmp_url, true);
	xhttp.send();
}
//Add brand new list called new list
function addlist() {
	$("#formBarang").show();
	$("#namebarangid").val("new list");
	current_opration = "add";
}
$("#expression_tools").mouseover(function(e) {
	$("#genelistli").hide()
	$("#editpanel2").show()
	$("#editpanel3").hide()
});
$("#analysis_tools").mouseover(function(e) {
	$("#genelistli").hide()
	$("#editpanel2").hide()
	$("#editpanel3").show()
});
$("#genenumber").mouseover(function(e) {
	$("#genelistli").show()
	$("#editpanel2").hide()
	$("#editpanel3").hide()
});

function adjustPadding() {
	var u = document.getElementById("geniemenu-controller-0").className.split(" ")[2].split("-")[0]
	if (u == "right") {
		$("#editpanel").css({
			Right: "120px",
			Left: "10px"
		});
		$("#editpanel2").css({
			Right: "120px",
			Left: "10px"
		})
		$("#editpanel3").css({
			Right: "120px",
			Left: "10px"
		})
	}
	else {
		$("#editpanel").css({
			Right: "10px",
			Left: "120px"
		});
		$("#editpanel2").css({
			Right: "10px",
			Left: "120px"
		});
		$("#editpanel3").css({
			Right: "10px",
			Left: "120px"
		});
	}
}
/*Add side bar to the GenIE-CMS*/
var init_position = "left-top";
if (getCookie("sidebarclass") != null) {
	init_position = getCookie("sidebarclass");
}
/*
read Config file
*/
function readConfigFile(callback_configfile) {
	$.ajax({
		url: 'plugins/config.json',
		dataType: 'JSON',
		success: function(data) {
			if (callback_configfile && typeof(callback_configfile) === "function") {
				callback_configfile(data);
			}
		}
	});
}
var exampleString;
var exampleLimit;
var MAIN_EXAMPLE_GENES;
get_active(function(e) {})
/*
Example genelist
*/
var MAIN_EXAMPLE_GENES = "";

function get_example_genes(b, limit, callback_example_genes) {
	$.ajax({
		url: "plugins/blast/services/autocomplete.php",
		dataType: "json",
		data: {
			limit: limit,
			q: b,
			output: 'json'
		},
		success: function(data) {
			console.log("B", data);
			callback_example_genes(data)
		}
	});
}

function createexampleGenelist() {
	init_example_genes(function(e) {
		console.log("D", e)
		var tmp_genes = [];
		for (var j = 0; j < e.genedata.length; j++) {
			tmp_genes.push(e.genedata[j].TranscriptName)
		}
		MAIN_EXAMPLE_GENES = tmp_genes.join(",");
		//console.log(MAIN_EXAMPLE_GENES)
		create_example_genes();
	});
}

function init_example_genes(callback_testcall) {
	read_configfile(function(response) {
		console.log("A", response);
		(response.example == undefined) ? response = "cellulose synthase": response = response.example;
		$limit = 100;
		get_example_genes(response, $limit, function(response2) {
			console.log("C", response2);
			callback_testcall(response2);
		});
	});
}

function read_configfile(callback_configfile) {
	$.ajax({
		url: 'plugins/config.json',
		dataType: 'JSON',
		success: function(data) {
			callback_configfile(data);
		}
	});
}

function create_example_genes() {
	mainCreategenelistbyName(MAIN_EXAMPLE_GENES, "example_genelist", function(e) {
		console.log("D", e);
		$("#names").stop();
		$("#names").effect("transfer", {
			to: "#numberofgenesSpan",
			className: "ui-effects-transfer-2"
		}, 600);
		get_active(function(e) {})
	});
}