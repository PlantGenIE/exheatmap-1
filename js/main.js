// Create JS GenIE object
var GenIE =({selectedspeciesAbbreviation: '', allGenelists: {}, activeGenelist: {}, allExperiments:{},activeExperiment:{},genelistDatabase:'',speciesDatabase:'',userID:'',selectedspeciesAbbreviation:'',genelistDatabase:'',databaseURL:'',genelistURL:'',expressionURL:'',networkURL:''})

//Feed the unique user ID into the GenIE object 
GenIE.selectedspeciesAbbreviation="potra",
GenIE.userID="2973611485",
GenIE.genelistDatabase="plantgenie_genelist"
GenIE.databaseURL="https://api.plantgenie.org/db",
GenIE.genelistURL="https://api.plantgenie.org/genelist/get_active_list",
GenIE.experimentURL="https://api.plantgenie.org/experiment",
GenIE.expressionURL="https://api.plantgenie.org/experiment/expression"
GenIE.networkURL="https://api.plantgenie.org/experiment/network";

// Database request
plantgenieRequest=(e=>new Promise((t,s)=>{const n=new XMLHttpRequest;n.open("POST",e,!0),n.send(),n.onreadystatechange=(()=>{if(4===n.readyState)if(200===n.status)t(JSON.parse(n.responseText));else{const e=n.statusText||"error";s(e)}})}));

// Set text if needed
setText = (text) => { 
  div.innerHTML = text
}

getGeneList={updateSpecies;let database_name=await plantgenieRequest(GenIE.databaseURL+"/"+GenIE.selectedspeciesAbbreviation)
GenIE.selectedspeciesDatabase=database_name[0].db
let genelist=null;if(database_name){genelist=await plantgenieRequest(GenIE.genelistURL+"?name="+GenIE.genelistDatabase+"&fingerprint="+GenIE.userID+"&table="+GenIE.selectedspeciesDatabase)}
let experiments=null;if(genelist){experiments=await plantgenieRequest(GenIE.experimentURL+"/get_all?name="+GenIE.selectedspeciesDatabase)}
GenIE.allExperiments=experiments;GenIE.activeGenelist=genelist;setText("Species: "+database_name[0].species+" <br> Database: "+database_name[0].db+" <br> active GeneList: "+genelist[0].gene_basket_name+" <br>Genes: "+genelist[0].gene_list);return genelist}