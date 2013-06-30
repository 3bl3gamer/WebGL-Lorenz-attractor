//chaeck cam_pos. does it exist?

gfx.light=null;//current light object

gfx.light_mode=0;
gfx.LIGHT_ENABLE=1;
gfx.LIGHT_PERPIXEL=2;
gfx.LIGHT_DIFFUSE=4;
gfx.LIGHT_SPECULAR=8;
gfx.LIGHT_SHADOWS=16;

gfx.setLight=function(light) {
	gfx.light=light;
}

gfx.lightSetMode=function(light,mode) {
	light.mode=mode;
}
gfx.lightInit=function()
{
	var light=new Object();
	light.ambient=[0.2,0.2,0.2];
	light.dir=[1,1,1]; vec3.normalize(light.dir);
	light.dir_col=[0.8,0.8,0.8];
	
	light.point_n=0;
	light.point_pos=[];//vec3
	light.point_r=[];//float
	light.point_col=[];//vec3
	light.point_spec=[];//vec3
	return light;
}

/*gfx.lightCreateUniforms=function(light) {
	if (light.mode&gfx.LIGHT_ENABLE) {
		gfx.lightAmbientUniform = gl.getUniformLocation(gfx.shader, "uLightAmbient");
		gfx.lightDirectionUniform = gl.getUniformLocation(gfx.shader, "uLightDirection");
		gfx.lightDirColorUniform = gl.getUniformLocation(gfx.shader, "uLightDirColor");
	}
	if (light.mode&gfx.LIGHT_DIFFUSE) {
		gfx.lightNUniform = gl.getUniformLocation(gfx.shader, "lightN");
		gfx.lightColUniform = gl.getUniformLocation(gfx.shader, "lightCol");
		gfx.lightPosUniform = gl.getUniformLocation(gfx.shader, "lightPos");
		gfx.lightRUniform = gl.getUniformLocation(gfx.shader, "lightR");
	}
	if (light.mode&gfx.LIGHT_SPECULAR) {
		gfx.camPosUniform = gl.getUniformLocation(gfx.shader, "camPos");
		gfx.lightSpecUniform = gl.getUniformLocation(gfx.shader, "lightSpec");
	}
}*/

gfx.lightPointAdd=function(light,x,y,z,radius,r,g,b,specular)
{
	light.point_pos[light.point_n*3  ]=x;
	light.point_pos[light.point_n*3+1]=y;
	light.point_pos[light.point_n*3+2]=z;
	
	light.point_r[light.point_n]=radius;
	
	light.point_col[light.point_n*3  ]=r;
	light.point_col[light.point_n*3+1]=g;
	light.point_col[light.point_n*3+2]=b;
	
	light.point_spec[light.point_n]=specular;
	
	light.point_n+=1;
	
	return light.point_n-1;
}

gfx.lightSetUniforms=function()
{
	if (gfx.light.mode&gfx.LIGHT_ENABLE) {
		//gl.uniform3fv(gfx.shader.lightAmbientUniform, light.ambient);
		gl.uniform3fv(gfx.shader.lightDirectionUniform, gfx.light.dir);//alert(vec3.str(gfx.light.dir));
		gl.uniform3fv(gfx.shader.lightDirColorUniform, gfx.light.dir_col);
	}
	if (gfx.light.mode&gfx.LIGHT_DIFFUSE) {
		gl.uniform3fv(gfx.shader.lightColUniform, gfx.light.point_col);
		gl.uniform1fv(gfx.shader.lightRUniform, gfx.light.point_r);
		gl.uniform3fv(gfx.shader.lightPosUniform, gfx.light.point_pos);
		gl.uniform1i(gfx.shader.lightNUniform, gfx.light.point_n);
	}
	if (gfx.light.mode&gfx.LIGHT_SPECULAR) {
		gl.uniform3fv(gfx.shader.camPosUniform, gfx.camera_pos);//<-here
		gl.uniform3fv(gfx.shader.lightSpec, gfx.light.point_spec);
	}
}

/*
gfx.lightSetMode=function(mode) {
	switch (mode) {
	case 0://no light
		gfx.light_enable=0;
		gfx.light_perPixl=0;
		gfx.light_diffuse=0;
		gfx.light_specular=0;
		gfx.light_shadows=0;
		break;
	case 1://one directional+ambient
		gfx.light_enable=1;
		gfx.light_perPixl=0;
		gfx.light_diffuse=0;
		gfx.light_specular=0;
		gfx.light_shadows=0;
		break;
	}
}
*/