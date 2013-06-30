gfx.loadMtllib=function(obj,path) {
	var request=new XMLHttpRequest();
	request.open("GET",path,false);
	request.send();
	//request.onreadystatechange=function() {
		//if (request.readyState!=4) return;//alert(request.responseText);
		//alert(request.responseText);
		var line=request.responseText.split("\n");
	
		for (var i in line) {
			var part=line[i].split(/\s+/);
			switch (part[0]) {
			case "newmtl":
				var mtl=new Object();
				obj.mtl.push(mtl);
				mtl.amb=[];
				mtl.dif=[];
				mtl.spec=[];
				mtl.name=part[1];//alert("name:   "+part[1]);
				mtl.tex=null;
				mtl.bump=null;
				break;
			case "Ka":
				for (var j=0;j<3;j++)
					mtl.amb[j]=parseFloat(part[j+1]);
				mtl.spec_n=50;//default
				break;
			case "Kd":
				for (var j=0;j<3;j++)
					mtl.dif[j]=parseFloat(part[j+1]);
				break;
			case "Ks":
				for (var j=0;j<3;j++)
					mtl.spec[j]=parseFloat(part[j+1]);
				break;
			case "Ns":
				mtl.spec_n=parseFloat(part[1]);
				break;
			case "map_Kd":
				mtl.tex=gfx.textureLoad(path.substr(0,path.lastIndexOf("/")+1)+part[1]);//include obj location
				break;
			case "map_bump":
				mtl.bump=gfx.textureLoad(path.substr(0,path.lastIndexOf("/")+1)+part[1]);//include obj location
				break;
			}
		}
		mtl.ready=1;
		//if (obj.vtx_ready) {}
	//}
	//request.send();
}

gfx.loadObj=function(path) {
	var obj=new Object();
	
	obj.target=gl.TEXTURE_2D;//default
	obj.vtx_ready=0;
	obj.mtl=[];
	obj.mtl_ready=1;
	/*obj.mtl_name=[];
	obj.mtl_amb=[];
	obj.mtl_dif=[];
	obj.mtl_spec=[];
	obj.mtl_spec_n=[];
	obj.mtl_tex=[];*/
	//obj.mtl_texture=[];
	
	var request=new XMLHttpRequest();
	request.open("GET",path);
	request.onreadystatechange=function() {
		if (request.readyState==4)
		{
			//alert(request.responseText);
			var line=request.responseText.split("\n");
			var ind,mode,v_id,vn_id,vt_id;
			
			//              v 2d v
			var v_buf=[],v_used=[];
			var vn_buf=[],vn_used=[];
			var vt_buf=[],vt_used=[];
			var /*f_buf=[],*/f_id=[];
			
			var cbuf=[];
			var nbuf=[];
			var tbuf=[];
			var ibuf=[];//2d
			
			//var bad_shapes=0;
			var cur_mtl=-1;
			
			for (var i in line)
			{
				var part=line[i].split(/\s+/);
				if (part.length<2) continue;
				switch (part[0])
				{
				case "mtllib":
					//alert(path.substr(0,path.lastIndexOf("/")+1)+part[1]);
					gfx.loadMtllib(obj,path.substr(0,path.lastIndexOf("/")+1)+part[1]);
					for (var j in obj.mtl) {
						v_used[j]=new Array();
						vn_used[j]=new Array();
						vt_used[j]=new Array();
						f_id[j]=new Array();
						ibuf[j]=new Array();
					}
					break;
				case "v":
					for (var j=1;j<4;j++)
						v_buf.push(parseFloat(part[j]));
					break;
				case "vn":
					for (var j=1;j<4;j++)
						vn_buf.push(parseFloat(part[j]));
					break;
				case "vt":
					for (var j=1;j<3;j++)
						vt_buf.push(parseFloat(part[j]));
					break;
				case "usemtl":
				var j=0;
					for (var j in obj.mtl) {
						if (obj.mtl[j].name==part[1]) {
							cur_mtl=j;
							//alert(obj.mtl.length+"    "+j+"   "+path+"   \n<"+part[1]+"|"+obj.mtl[j].name+">");
							break;
						}
					}
					break;
				case "f":
					//var xx=[],yy=[],zz=[];//,next=[];
					var ci=[];
					var ni=[];
					var ti=[];
					for (var j=1;j<part.length;j++)
					{
						if (part[j].length==0) continue;
						var ind=part[j].split("/");

						//xx.push(v_buf[ (parseInt(ind[0])-1)*3   ]);//for triangulation
						//yy.push(v_buf[ (parseInt(ind[0])-1)*3+1 ]);
						//zz.push(v_buf[ (parseInt(ind[0])-1)*3+2 ]);
						//next.push(j);
						
						ci.push(parseInt(ind[0])-1);
						ti.push(parseInt(ind[1])-1);
						ni.push(parseInt(ind[2])-1);
						
						//f_buf.push(part[j]);
					}
					
					/*next[next.length-1]=0;
					var stop=0;
					//var t=[0,1,2];
					var max_dis=0,max_i=0;
					for (var j=1;j<xx.lenght;j++) {
						var t=Math.sqrt((xx[0]-xx[i])*(xx[0]-xx[i])+(yy[0]-yy[i])*(yy[0]-yy[i]));
						if (t>max_dis) {max_dis=t; max_i=i;}
					}
					
					var x2=[],y2=[],z2=[];
					for (var j in xx) {
						
					}
					
					while (!stop)
					{
						var a=[];
						for (var j in t)
							a[j]=vec3.create([ xx[t[(j+1)%3]]-xx[t[j]],
											   yy[t[(j+1)%3]]-yy[t[j]],
											   zz[t[(j+1)%3]]-zz[t[j]] ]);
						var vecCross=vec3.create([0,0,0]);//mb remove [0,0,0]
						var inside=0;
						for (var j in xx)
							if (j!=t[0] && j!=t[1] && j!=t[2]) {
								inside=1;
								for (var k in a) {
									var tvec=vec3.create([ xx[j]-xx[t[k]], yy[j]-yy[t[k]], zz[j]-zz[t[k]] ]);//v
									vec3.cross(a[k],tvec,vecCross);
									if (vec3.getScale(vecCross,vecBase)<0)
										{inside=0; break;}
								}
								if (inside) break;
							}
						vec3.cross(a[0],a[1],vecCross);
						if (vec3.getScale(vecCross,vecBase)>0 && !inside) {
							//adding triangle
							for (var j in t)
							{
								cbuf.push(xx[t[j]]);
								cbuf.push(yy[t[j]]);
								cbuf.push(zz[t[j]]);
								tbuf.push(vt_buf[ ti[t[j]]*2   ]);
								tbuf.push(vt_buf[ ti[t[j]]*2+1 ]);
								nbuf.push(vn_buf[ ni[t[j]]*3   ]);
								nbuf.push(vn_buf[ ni[t[j]]*3+1 ]);
								nbuf.push(vn_buf[ ni[t[j]]*3+2 ]);
								ibuf.push(cbuf.length/3-1);
							}
							next[t[0]]=t[2];
						} else {t[0]=t[1];}
						
						t[1]=t[2];
						t[2]=next[t[2]];
						if (t[2]==t[0]) t[2]=next[t[2]];
						if (t[2]==t[1]) {stop=1; break;}
						//alert(t[0]+" "+t[1]+" "+t[2]+"   "+vec3.str(vecCross)+" "+inside);//
					}*/
					for (var j in ci) {
						var found=0;
						for (var k in v_used[cur_mtl]) {
							if (v_used[cur_mtl][k]==ci[j] && vn_used[cur_mtl][k]==ni[j] && vt_used[cur_mtl][k]==ti[j])
								found=f_id[cur_mtl][k];
						}
						if (found==0) {
							v_used[cur_mtl].push(ci[j]);
							vn_used[cur_mtl].push(ni[j]);
							vt_used[cur_mtl].push(ti[j])
							f_id[cur_mtl].push(cbuf.length/3);
							for (var k=0;k<3;k++) {
								cbuf.push(v_buf[ ci[j]*3+k ]);
								nbuf.push(vn_buf[ ni[j]*3+k ]);
							}
							for (var k=0;k<2;k++) {
								tbuf.push(vt_buf[ ti[j]*2+k ]);
							}
							ibuf[cur_mtl].push(cbuf.length/3-1);//alert(cbuf.length/3-1);
						} else {
							ibuf[cur_mtl].push(found);
						}
					}//alert("q");
					
					break;
				}
			}
		
			//vertices
			obj.posBuf=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER,obj.posBuf);//alert(cbuf.length);
			/*...*/
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cbuf),gl.STATIC_DRAW);
			
			//indeces
			for (var i in obj.mtl) {
				obj.mtl[i].indBuf=gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,obj.mtl[i].indBuf);
				/*...*/
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ibuf[i]),gl.STATIC_DRAW);
				obj.mtl[i].tri_total=ibuf[i].length/3;
			}
			
			//normals
			obj.normBuf=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER,obj.normBuf);
			/*...*/
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(nbuf),gl.STATIC_DRAW);
			
			//texture coords
			obj.texBuf=gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER,obj.texBuf);
			/*...*/
			gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(tbuf),gl.STATIC_DRAW);
			
			obj.tri_total=ibuf[0].length/3;
			//alert("triangles: "+obj.tri_total);
			obj.vtx_ready=1;
		}
	}
	request.send();
	
	return obj;
}

/*gfx.modelCreateUniforms=function(model) {
	model.gfx.lightAmbientUniform = gl.getUniformLocation(gfx.shader, "uLightAmbient");
}*/
//gfx.modelSetUniforms=function(model) {
//	
//}

gfx.modelSetTexture=function(model, mtl_i, tex) {
	if (model.mtl.length<=mtl_i) return null;
	model.mtl[mtl_i].tex=tex;
}

gfx.modelDraw=function(model) {
	if (!model.vtx_ready || !model.mtl_ready) return;
	
	
	gl.enableVertexAttribArray(gfx.shader.vertexPositionAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, model.posBuf);
    gl.vertexAttribPointer(gfx.shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	
	if (gfx.light.mode&gfx.LIGHT_ENABLE) {
		gl.enableVertexAttribArray(gfx.shader.vertexNormalAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, model.normBuf);
		gl.vertexAttribPointer(gfx.shader.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	}
	
	for (var i in model.mtl) {
		gl.uniform3fv(gfx.shader.objAmbColUniform, model.mtl[i].amb);
		if (gfx.light.mode&gfx.LIGHT_ENABLE)
			gl.uniform3fv(gfx.shader.objDifColUniform, model.mtl[i].dif);
		
		if (model.mtl[i].tex==null || gfx.tex_mode==0) {
			//gl.disableVertexAttribArray(gfx.shader.textureCoordAttribute);
			gl.uniform1i(gfx.shader.texEnableUniform, 0);
		} else {
			gl.enableVertexAttribArray(gfx.shader.textureCoordAttribute);
			gl.uniform1i(gfx.shader.texEnableUniform, 1);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuf);
			gl.vertexAttribPointer(gfx.shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			
			gl.activeTexture(gl.TEXTURE0);//alert(model.mtl_tex[0]);
			gl.bindTexture(model.target, model.mtl[i].tex);
			gl.uniform1i(gfx.shader.samplerUniform, 0);
			
			if (model.mtl[0].bump!=null)
			{
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D,model.mtl[i].bump);
				gl.uniform1i(gfx.shader.samplerBumpUniform, 1);
			}
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mtl[i].indBuf);
		gl.drawElements(gl.TRIANGLES, model.mtl[i].tri_total*3, gl.UNSIGNED_SHORT, 0);
		
		
		if (model.mtl[i].tex!==undefined && gfx.tex_mode!=0) gl.disableVertexAttribArray(gfx.shader.textureCoordAttribute);
	}
	
	gl.disableVertexAttribArray(gfx.shader.vertexPositionAttribute);
	if (gfx.light.mode&gfx.LIGHT_ENABLE) gl.disableVertexAttribArray(gfx.shader.vertexNormalAttribute);
}
