gfx.shader=0;

gfx.shaderCreateHttp=function(path) {
	var request=new XMLHttpRequest();
	request.open("GET",path+".vs",0);
	request.send();
	vss=request.responseText;
	
	request.open("GET",path+".fs",0);
	request.send();
	fss=request.responseText;
	
	return gfx.shaderCreate(vss,fss);
}

gfx.shaderCreate=function(vss,fss) {
	var vs=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vss);
    gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        alert("vs error:\n"+gl.getShaderInfoLog(vs)+"\n"+vss);
		gl.deleteShader(vs);
        return null;
	}
	var fs=gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fss);
    gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        alert("fs error:\n"+gl.getShaderInfoLog(fs)+"\n"+fss);
		gl.deleteShader(vs);
		gl.deleteShader(fs);
        return null;
	}
	
	program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Could not initialise shader in");
		gl.deleteProgram(program);
		gl.deleteShader(vs);
		gl.deleteShader(fs);
		return null;
	}
	
	return program;
}

gfx.setShader=function(shader) {
	gl.useProgram(shader);
	gfx.shader=shader;
}

gfx.def_shader=[];
/*gfx.def_shader_name=[];
gfx.def_shader_name[0]="baseWhite";
gfx.def_shader_name[0+64]="baseTex";*/

gfx.setupDefaultShaders=function() {
	//for (var i in gfx.defaultShader) {
	//	gfx.def_shader[i]=gfx.shaderCreateHttp("def_shaders/"+gfx.def_shader_name[i]);
	//}
	//gfx.def_shader[0]=gfx.shaderCreateHttp("def_shaders/base");
	gfx.def_shader[0]=gfx.shaderCreateHttp("def_shaders/baseTex");
	gfx.def_shader[gfx.LIGHT_ENABLE]=gfx.shaderCreateHttp("def_shaders/singleDirLightTex");
	gfx.def_shader[2]=gfx.shaderCreateHttp("def_shaders/singleDirLightTCM");
	gfx.def_shader[3]=gfx.shaderCreateHttp("def_shaders/singleDirLightSB");
	
	
	for (var i in gfx.def_shader) {
		if (gfx.def_shader[i]==null) {alert("Error creating shader "+i); continue;}
		
		gfx.def_shader[i].pMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uPMatrix");
		gfx.def_shader[i].mvMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uMVMatrix");
		if (i!=0) {
			gfx.def_shader[i].nMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uNMatrix");
		}
		
		
		
		gfx.def_shader[i].objAmbColUniform = gl.getUniformLocation(gfx.def_shader[i], "uObjAmbCol");
		if (i!=0) {
			gfx.def_shader[i].objDifColUniform = gl.getUniformLocation(gfx.def_shader[i], "uObjDifCol");
			
			gfx.def_shader[i].lightDirectionUniform = gl.getUniformLocation(gfx.def_shader[i], "uLightDirection");
			gfx.def_shader[i].lightDirColorUniform = gl.getUniformLocation(gfx.def_shader[i], "uLightDirColor");
		}
		
		gfx.def_shader[i].samplerUniform = gl.getUniformLocation(gfx.def_shader[i], "uSampler");
		gfx.def_shader[i].texEnableUniform = gl.getUniformLocation(gfx.def_shader[i], "uTexEnable");
		
		
		
		gfx.def_shader[i].vertexPositionAttribute = gl.getAttribLocation(gfx.def_shader[i], "aVertexPosition");
        //gl.enableVertexAttribArray(gfx.def_shader[i].vertexPositionAttribute);
		if (i!=0) {
			gfx.def_shader[i].vertexNormalAttribute = gl.getAttribLocation(gfx.def_shader[i], "aVertexNormal");
			//gl.enableVertexAttribArray(gfx.def_shader[i].vertexNormalAttribute);
		}
        gfx.def_shader[i].textureCoordAttribute = gl.getAttribLocation(gfx.def_shader[i], "aTextureCoord");
        //gl.enableVertexAttribArray(gfx.def_shader[i].textureCoordAttribute);
	}
	
	gfx.def_shader[2].samplerDisUniform = gl.getUniformLocation(gfx.def_shader[2], "uSamplerDis");
	gfx.def_shader[2].lightPosUniform = gl.getUniformLocation(gfx.def_shader[2], "uLightPos");
	gfx.def_shader[2].lightMatrixUniform = gl.getUniformLocation(gfx.def_shader[2], "uLightMatrix");
	
	gfx.def_shader[3].samplerShUniform = gl.getUniformLocation(gfx.def_shader[3], "uSamplerSh");//alert(gfx.def_shader[3].samplerShUniform);
	//gfx.def_shader[3].lightMatrixUniform = gl.getUniformLocation(gfx.def_shader[3], "uLightMatrix");
	
	var i=128;
	gfx.def_shader[i]=gfx.shaderCreateHttp("def_shaders/distance");
	gfx.def_shader[i].pMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uPMatrix");
	gfx.def_shader[i].mvMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uMVMatrix");
	gfx.def_shader[i].lightPosUniform = gl.getUniformLocation(gfx.def_shader[i], "uLightPos");
	gfx.def_shader[i].vertexPositionAttribute = gl.getAttribLocation(gfx.def_shader[i], "aVertexPosition");
	
	var i=129;
	gfx.def_shader[i]=gfx.shaderCreateHttp("def_shaders/shadowBlur");
	gfx.def_shader[i].pMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uPMatrix");
	gfx.def_shader[i].mvMatrixUniform = gl.getUniformLocation(gfx.def_shader[i], "uMVMatrix");
	gfx.def_shader[i].vertexPositionAttribute = gl.getAttribLocation(gfx.def_shader[i], "aVertexPosition");
	gfx.def_shader[i].textureCoordAttribute = gl.getAttribLocation(gfx.def_shader[i], "aTextureCoord");
	gfx.def_shader[i].samplerUniform = gl.getUniformLocation(gfx.def_shader[i], "uSampler");
}


