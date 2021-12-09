const aplicacao = {
	ciclo : '',
	mundo : '',
	resolucao : {largura : 1920, altura : 1080},
	imagem : '',
	inicializar(){
		this.mundo = criarMundo('Fase1');
		tela.inicializar();
		this.mundo.inicializar();
		this.ciclo = setInterval(this.atualizar, 1000, this);
	},
	atualizar(_aplicacao){
		tela.atualizar(_aplicacao.mundo.atualizar());
	}
};

const tela = {
	canvas : '',
	contexto : '',
	altura : 360,
	largura : 640,
	inicializar(){
		this.canvas = document.createElement("canvas");
		this.contexto = this.canvas.getContext("2d");
		this.canvas.width = this.largura;
		this.canvas.height = this.altura;
		document.getElementById("telaDoJogo").appendChild(this.canvas);
	},
	atualizar(_imagem){
		this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.contexto.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.contexto.drawImage(_imagem, 0, 0, this.canvas.width, this.canvas.height);

	}
};

function criarMundo(_nome){
	const mundo = {
		nome : _nome,
		canvas : '',
		contexto : '',
		corDeFundo : '',
		cameras : [criarCamera('Camera Principal')],
		objetos : [criarObjeto('Objeto')],
		inicializar(){
			this.canvas = document.createElement("canvas");
			this.contexto = this.canvas.getContext('2d');
			this.canvas.width = 9999;
			this.canvas.height = 9999;
			this.corDeFundo = '#0099cc';
		},
		atualizar(){
			this.contexto.save();
			this.contexto.fillStyle = this.corDeFundo;
			this.contexto.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.contexto.restore();
			for(var i = 0; i < this.objetos.length; i++){
				this.contexto.save();
				this.contexto.translate(this.objetos[i].posicao.x, this.objetos[i].posicao.y);
				this.contexto.scale(this.objetos[i].escala.x, this.objetos[i].escala.y);
				this.contexto.rotate(this.objetos[i].rotacao * Math.PI / 180);
				this.contexto.drawImage(this.objetos[i].imagem.recurso, (this.objetos[i].imagem.recurso.width * this.objetos[i].imagem.centro.x) * -1, (this.objetos[i].imagem.recurso.height * this.objetos[i].imagem.centro.y) * -1);
				this.contexto.restore();
			}
			let nCanvas = document.createElement('canvas');
			nCanvas.width = aplicacao.resolucao.largura;
			nCanvas.height = aplicacao.resolucao.altura;
			let nCtx = nCanvas.getContext('2d');
			for(var i = 0; i < this.cameras.length; i++){
				nCanvas = this.cameras[i].renderizar(this.canvas, nCanvas);
			}
			
			return nCanvas;
		}
	};

	return mundo;
}

function criarObjeto(_nome){
	const objeto = {
		nome : _nome,
		posicao : {x : 0, y : 0},
		escala : {x : 1, y : 1},
		rotacao : 0,
		imagem : criarImagem('./padrao/img/sprite.png')
	};

	return objeto;
}

function criarCamera(_nome){
	const camera = {
		nome : _nome,
		imagem : '',
		posicao : {x : 0, y : 0},
		tamanho : {x : 1, y : 1},
		visualizacaoNaTela : {x : 0, y : 0, largura : 1, altura : 1},
		rotacao : 0,
		renderizar(_canvasMundo, _canvasFinal){
			let ctx = _canvasFinal.getContext('2d');
			ctx.drawImage(_canvasMundo, this.posicao.x, this.posicao.y, _canvasFinal.width * this.tamanho.x, _canvasFinal.height * this.tamanho.y, _canvasFinal.width * this.visualizacaoNaTela.x, _canvasFinal.height * this.visualizacaoNaTela.y, _canvasFinal.width * this.visualizacaoNaTela.largura, _canvasFinal.height * this.visualizacaoNaTela.altura);

			return _canvasFinal;
		}

	};

	return camera;
}

function criarImagem(caminhoDaImagem){
	let img = new Image();
	img.src = caminhoDaImagem;
	
	const imagem = {
		recurso : img,
		centro : {x : 0, y : 0}

	};

	return imagem;
}

function parar(){
	clearInterval(aplicacao.ciclo);
}