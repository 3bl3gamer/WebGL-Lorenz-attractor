
gfx.framebufferCreate=function(width,height,filter) {
	var fb=new Object;
	fb.fbo=gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.fbo);
    fb.width = width;
    fb.height = height;
	
	fb.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fb.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);//_MIPMAP_NEAREST
    //gl.generateMipmap(gl.TEXTURE_2D);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fb.width, fb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	fb.depth_buf = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, fb.depth_buf);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fb.width, fb.height);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fb.tex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fb.depth_buf);
	
	var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status != gl.FRAMEBUFFER_COMPLETE) {
		alert("checkFramebufferStatus error:\n" + WebGLDebugUtils.glEnumToString(status));
	}
	
	gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	fb.camera=gfx.cameraCreate(fb.width,fb.height);
	
	return fb;
}

/*












gfx.framebufferCreate=function(width,height) {
	var fb=new Object;
	fb.fbo=gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.fbo);
    fb.width = width;
    fb.height = height;
	
	fb.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fb.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);//_MIPMAP_NEAREST
    //gl.generateMipmap(gl.TEXTURE_2D);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.GL_DEPTH_COMPONENT24, fb.width, fb.height, 0, gl.GL_DEPTH_COMPONENT24, gl.UNSIGNED_BYTE, null);
	
	fb.depth_buf = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, fb.depth_buf);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fb.width, fb.height);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fb.tex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fb.depth_buf);
	
	var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status != gl.FRAMEBUFFER_COMPLETE) {
		alert("checkFramebufferStatus error");
	}
	
	gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	fb.camera=gfx.cameraCreate(fb.width,fb.height);
	
	return fb;
}*/