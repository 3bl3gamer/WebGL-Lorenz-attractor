gfx.cameraCreate=function(w,h)
{
	var camera=new Object();
	//camera.pos=[0.0,0.0,0.0];//vec3.create([0.0,0.0,0.0]);
	//camera.xRot=0.0;
	//camera.yRot=0.0;
	//camera.zRot=0.0;
	camera.w=w;
	camera.h=h;
	camera.ar=w/h;
	camera.pMatrix=mat4.create();
	camera.nMatrix=mat3.create();
	camera.mvMatrix=mat4.create();
	
	/*camera.createUniforms=finction() {
		camera.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		camera.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		if (gfx.light_mode&gfx.LIGHT_ENABLE) {
			camera.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
		}
	}*/
	
	mat4.perspective(90, camera.ar, 0.1, 100.0, camera.pMatrix);
	mat4.identity(camera.mvMatrix);
	
	camera.rotate=function(angle,vector) {
		mat4.rotate(camera.pMatrix, angle, vector);
	}
	camera.translate=function(vector) {
		mat4.translate(camera.pMatrix, vector);
	}
	camera.flip_x=function() {
		camera.pMatrix[0]=-camera.pMatrix[0];
		camera.pMatrix[1]=-camera.pMatrix[1];
		camera.pMatrix[2]=-camera.pMatrix[2];
	}
	
	return camera;
}

gfx.cameraUpdate=function(camera,update_matrices) {
	gl.viewport(0, 0, camera.w, camera.h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (update_matrices) {
		mat4.perspective(45, camera.ar, 0.1, 100.0, camera.pMatrix);
		//mat4.ortho(-camera.ar, camera.ar, -1, 1, 0.1, 100.0, camera.pMatrix);
		
		//camera.pos[0]=2*Math.sin(camera.yRot)*Math.cos(camera.xRot);
		//camera.pos[2]=-2*Math.cos(camera.yRot)*Math.cos(camera.xRot);
		//camera.pos[1]=-2*Math.sin(camera.xRot);

		//mat4.rotate(camera.pMatrix, camera.xRot, [1, 0, 0]);
		//mat4.rotate(camera.pMatrix, camera.yRot, [0, 1, 0]);
		
		//mat4.translate(camera.pMatrix, camera.pos);//vec3.negate(camera.pos)
		
		//mat4.identity(camera.mvMatrix);
	}
}

gfx.cameraSetUniforms=function(camera, mvMtx) {
	gl.uniformMatrix4fv(gfx.shader.pMatrixUniform, false, camera.pMatrix);
	
	if (mvMtx===undefined)
		mvMtx=camera.mvMatrix;
	gl.uniformMatrix4fv(gfx.shader.mvMatrixUniform, false, mvMtx);
	
	if (gfx.light.mode&gfx.LIGHT_ENABLE) {
		mat4.toInverseMat3(mvMtx,camera.nMatrix);
		mat3.transpose(camera.nMatrix);
		gl.uniformMatrix3fv(gfx.shader.nMatrixUniform, false, camera.nMatrix);
	}
}
