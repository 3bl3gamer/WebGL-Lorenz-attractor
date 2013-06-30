gfx.tex_mode=3;
//gfx.teture=null;

gfx.handleLoadedTexture=function(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

	switch (gfx.tex_mode)
	{
	case 1:
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		break;
	case 2:
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		break;
	case 3:
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		break;
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
}

gfx.textureLoad=function(path) {
	var img = new Image();

	var texture = gl.createTexture();
	texture.image = img;

	img.onload = function () {
		gfx.handleLoadedTexture(texture)
	}
	img.src = path;
	
	return texture;
}