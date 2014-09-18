/* gajse-api */
var loop=require("./gajse-loop");
var THREE=require("three");
var storage=require("./gajse-slim-storage");
var cutscene=require("./gajse-cutscene");
var { Item }=require("./gajse-item");
var { MeshActions }=require("./gajse-mesh-actions");
var { Light }=require("./gajse-light");
var { ScriptedText, Question, Answer }=require("./gajse-text");
var { Character }=require("./gajse-character");
var Action = require("./gajse-action").Action;
var version=require("./gajse-version");

module.exports={
	apiVersion: "0.0.3",
	Item: Item,
	Light: Light,
	Character: Character,
	Action: Action,
	ScriptedText: ScriptedText,
	Question: Question,
	Answer: Answer,
	version: version,
	storage: storage,
	MeshActions: MeshActions,
	addObject: function(resource,position,text){
		var objectFile=storage.getURLResourceAs(resource,"application/json");
		new THREE.JSONLoader().load(objectFile,function(geo,mat){
			var mesh=new THREE.Mesh(geo,new THREE.MeshFaceMaterial(mat));
			mesh.updateMatrix();
			mesh.gajse={};
			mesh.gajse.textCallback=text;
			var event=new CustomEvent("GAJSE_PushMesh",{"detail": {"mesh": mesh, "position": position}});
			document.dispatchEvent(event);
		});
		return this.MeshActions({position: position});
	},
	addManualObject: function(mesh,position,text){
		mesh.gajse={};
		mesh.gajse.textCallback=text;
		var event=new CustomEvent("GAJSE_PushMesh",{"detail": {"mesh": mesh,"position": position}});
		document.dispatchEvent(event);

		return this.MeshActions({position: position});
	},
	getResource: function(resource){
		return storage.getResource(resource);
	},
	setBackgroundMusic: function(resource){
		var event=new CustomEvent("GAJSE_SetBackgroundMusic",{"detail" : {"resource" : resource}});
		document.dispatchEvent(event);
	},
	playSFX: function(){
		
	},
	changeScene: function(file){
		var event=new CustomEvent("GAJSE_LoadScene",{"detail" : {"file" : file}});
		document.dispatchEvent(event);
	},
	/**
	 * Plays a Cutscene using the GAJSE Cutscene API. Resources can be WebM, VP9, Ogg Theora (OGV). MP4 and other might be supported depending on the browser. 
	 * Subtitles use WebVTT format and they are supported on the browsers that implement it.
	 * @param resource - The resource name of the video
	 * @param callback - The callback when the video finish (or is skipped)
	 * @param subtitles - An array containing GAJSE Subtitles Objects
	 * */
	playCutscene: function(resource,callback,subtitles){
		cutscene.playCutscene(resource,callback,subtitles);
	}
}
