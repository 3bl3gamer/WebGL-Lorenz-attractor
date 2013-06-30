gfx.cubeFramebufferCreate=function(size) {
	var cfb=new Object;
	cfb.size=size;
	cfb.tex=gl.createTexture();
	
	var face=[
		gl.TEXTURE_CUBE_MAP_POSITIVE_X,
		gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
		gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
		gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
		gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
		gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
		
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cfb.tex);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	for (var i in face) {
		gl.texImage2D(face[i],
		0,                // level
		gl.RGBA,          // internalFormat
		cfb.size,         // width
		cfb.size,         // height
		0,                // border
		gl.RGBA,          // format
		gl.UNSIGNED_BYTE, // type
		null);            // data
	}
	
	cfb.depth_buf=gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, cfb.depth_buf);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, cfb.size, cfb.size);
	
	cfb.framebuffer = [];
	cfb.camera=[];
	for (var i in face) {
		var fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,face[i],cfb.tex,0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,cfb.depth_buf);
		
		var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status != gl.FRAMEBUFFER_COMPLETE) {
			throw("gl.checkFramebufferStatus() returned " + WebGLDebugUtils.glEnumToString(status));
		}
		cfb.framebuffer.push(fb);
		cfb.camera.push(gfx.cameraCreate(size,size));
	}
	
	cfb.camera[0].rotate(Math.PI,[0,0,1]); cfb.camera[0].rotate(Math.PI/2,[0,1,0]);
	cfb.camera[1].rotate(Math.PI,[0,0,1]); cfb.camera[1].rotate(-Math.PI/2,[0,1,0]);
	
	cfb.camera[2].rotate(-Math.PI/2,[1,0,0]);// cfb.camera[2].flip_x();
	cfb.camera[3].rotate(Math.PI/2,[1,0,0]);// cfb.camera[3].flip_x();
	
	cfb.camera[4].rotate(Math.PI,[0,0,1]); cfb.camera[4].rotate(Math.PI,[0,1,0]);
	cfb.camera[5].rotate(Math.PI,[0,0,1]);
	
	//for (var i in face) {mat4.translate(cfb.camera[i].mvMatrix, [-0.35,-4.8,-0.8]);}//{cfb.camera[i].translate([-0.35,-4.8,-0.8]);}
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	return cfb;
}