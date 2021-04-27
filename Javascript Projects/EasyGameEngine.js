//----------------------------BASE------------------------------------//
var recursos = [
				["imagem", "Jogador", "Jogador.png"],
				["imagem", "Plano de fundo", "PlanoDeFundo.png"],
				["imagem", "Plano de fundo 2", "PlanoDeFundo2.png"],
				["som", "Som de plano de fundo", "n1.wav"]
				
				];
var canvasPrincipal;
var contextoDoCanvas;
var gerenciadorDeCenarios = [];
var gerenciadorDeImagens = [];
var gerenciadorDeSons = [];
var cenario = null;
var andamento;
var teclado;
gerenciadorDeImagens
function Som(nome, recurso)
{
	this.nome = nome;
	this.som = recurso;
	
}

function Imagem(nome, recurso)
{
	this.nome = nome;
	this.imagem = recurso;
}

function Objeto(nome, x, y)
{
	this.nome = "Objeto";
	this.imagem = new Image();
	this.som = new Audio();
	this.x = x;
	this.y = y;
	this.InicializarObjeto = function(){}
	this.AtualizarObjeto = function(){}
	this.GraficosDoObjeto = function(contexto){}
}

function Cenario(nome, largura, altura)
{
	this.nome = nome;
	this.canvasDoCenario = document.createElement("canvas");
	this.canvasDoCenario.width = largura;
	this.canvasDoCenario.height = altura;
	this.objetos = [];
	this.planosDeFundo = [];
	this.contextoDoCanvasDoCenario = this.canvasDoCenario.getContext("2d");
	this.fps = 30;
	this.PegarLargura = function()
	{
		return this.canvasDoCenario.width;
	}
	this.PegarAltura = function()
	{
		return this.canvasDoCenario.height;
	}
	this.InicializarCenario = function(){}
	this.AtualizarCenario = function()
	{
		for(i=0;i<this.objetos.length;i++)
		{
			this.objetos[i].AtualizarObjeto();
		}
	}
	this.GraficosDoCenario = function()
	{
		this.contextoDoCanvasDoCenario.clearRect(0, 0, this.canvasDoCenario.width, this.canvasDoCenario.height);
		for(i=0;i<this.planosDeFundo.length;i++)
		{
			this.contextoDoCanvasDoCenario.drawImage(this.planosDeFundo[i], 0, 0, this.canvasDoCenario.width, this.canvasDoCenario.height);
		}
		for(i=0;i<this.objetos.length;i++)
		{
			this.contextoDoCanvasDoCenario.drawImage(this.objetos[i].imagem, this.objetos[i].x, this.objetos[i].y);
		}
		for(i=0;i<this.objetos.length;i++)
		{
			this.objetos[i].GraficosDoObjeto(this.contextoDoCanvasDoCenario);
		}
	}
}

function Teclado()
{
	this.teclas = [];
	this.InicializarTeclado = function()
	{
		for(i=0;i<100;i++)
		{
			this.teclas[i] = [false, false, false];
		}
	}
	this.Tecla = function(tecla)
	{
		return this.teclas[tecla][0];
	}
	this.TeclaDesce = function(tecla)
	{
		return this.teclas[tecla][1];
	}
	this.TeclaSobe = function(tecla)
	{
		return this.teclas[tecla][2];
	}
}

function PegarImagem(nomeDaImagem)
{
	var img = null;
	for(i=0; i<gerenciadorDeImagens.length; i++)
	{
		
		if(gerenciadorDeImagens[i].nome == nomeDaImagem)
		{
			img = gerenciadorDeImagens[i].imagem;
			i = gerenciadorDeImagens.length;
		}
	}
	return img;
}

function PegarCenario(nomeDoCenario)
{
	var cen = null;
	for(i=0; i<gerenciadorDeCenarios.length; i++)
	{
		
		if(gerenciadorDeCenarios[i].nome == nomeDoCenario)
		{
			cen = gerenciadorDeCenarios[i];
			i = gerenciadorDeCenarios.length;
		}
	}
	return cen;
}

function PegarSom(nomeDoSom)
{
	var som = null;
	for(i=0; i<gerenciadorDeSons.length; i++)
	{
		
		if(gerenciadorDeSons[i].nome == nomeDoSom)
		{
			som = gerenciadorDeSons[i].som;
			i = gerenciadorDeSons.length;
		}
	}
	return som;
}

function InicializarAplicacao()
{
	canvasPrincipal = document.getElementById("mainCanvas");
	contextoDoCanvas = canvasPrincipal.getContext("2d");
	var logoInicial = new Image();
	logoInicial.src = "EngineLogo.png";
	logoInicial.addEventListener
	(
		'load',
		function()
		{
			contextoDoCanvas.drawImage(logoInicial, 0, 0, canvasPrincipal.width, canvasPrincipal.height);
		}
	);
	teclado = new Teclado();
	teclado.InicializarTeclado();
	
	window.addEventListener
	(
		'keydown',
		function(evento)
		{
			if(!teclado.teclas[evento.keyCode][0])
			{
				teclado.teclas[evento.keyCode][1] = true;
			}
			teclado.teclas[evento.keyCode][0] = true;
		}
	);
	
	window.addEventListener
	(
		'keyup',
		function(evento)
		{
			teclado.teclas[evento.keyCode][0] = false;
			teclado.teclas[evento.keyCode][2] = true;
		}
	);
	
	var recursosProntos = 0;
	
	for(i=0; i<recursos.length; i++)
	{
		if(recursos[i][0] == "imagem")
		{
			var imagem = new Image();
			imagem.src = recursos[i][2];
			gerenciadorDeImagens.push(new Imagem(recursos[i][1], imagem));
			imagem.addEventListener
			(
				'load',
				function()
				{
					recursosProntos++;
					contextoDoCanvas.fillRect(0, canvasPrincipal.height - 10, (recursosProntos / recursos.length) * canvasPrincipal.width, 10);
				}
			);
		}
		if(recursos[i][0] == "som")
		{
			var som = new Audio();
			som.src = recursos[i][2];
			gerenciadorDeSons.push(new Som(recursos[i][1], som));
			som.addEventListener
			(
				'loadeddata',
				function()
				{
					recursosProntos++;
					contextoDoCanvas.fillRect(0, canvasPrincipal.height - 10, (recursosProntos / recursos.length) * canvasPrincipal.width, 10);
				}
			);
		}
	}
	var jogoPronto = setInterval(
									function()
									{
										if(recursosProntos == recursos.length)
										{
											contextoDoCanvas.font = "30px Arial";
											contextoDoCanvas.fillText("Pressione 'C' para continuar", canvasPrincipal.width / 2, canvasPrincipal.height - 30);
											if(teclado.TeclaDesce(67))
											{
												CarregarCenario("Fase 1");
												andamento = setInterval(CicloDaAplicacao, 1000/cenario.fps);
												clearInterval(jogoPronto);
											}
										}
									},
									500
								);
}

function CarregarCenario(idDoCenario)
{
	if(cenario != null)
	{
		for(i=0;i<cenario.objetos.length;i++)
		{
			cenario.objetos.pop();
		}
	}
	cenario = PegarCenario(idDoCenario);
	cenario.InicializarCenario();
	var cont = 0;
	while(cont < cenario.objetos.length)
	{
		cenario.objetos[cont].InicializarObjeto();
		cont++;
	}
}

function CicloDaAplicacao()
{
	contextoDoCanvas.clearRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
	contextoDoCanvas.fillStyle = "gray";
	contextoDoCanvas.fillRect(0, 0, canvasPrincipal.width, canvasPrincipal.height);
	cenario.AtualizarCenario();
	cenario.GraficosDoCenario();
	contextoDoCanvas.drawImage(cenario.canvasDoCenario, 0, 0, canvasPrincipal.width, canvasPrincipal.height);
	for(i=0;i<100;i++)
	{
		teclado.teclas[i][1] = false;
		teclado.teclas[i][2] = false;
	}
}

//--------------------OBJETOS----------------------------------------------------------------------------//
function Jogador()
{
	var jogador = new Objeto("Jogador", 50, 50);

	jogador.InicializarObjeto = function()
	{
		jogador.imagem = PegarImagem("Jogador");
	}

	jogador.AtualizarObjeto = function()
	{
		if(teclado.Tecla(74))
		{
			jogador.x -= 3;
		}
		if(teclado.Tecla(73))
		{
			jogador.y -= 3;
		}
		if(teclado.Tecla(76))
		{
			jogador.x += 3;
		}
		if(teclado.Tecla(75))
		{
			jogador.y += 3;
		}
	}

	jogador.GraficosDoObjeto = function(contextoDoCanvasDoCenario)
	{
		contextoDoCanvasDoCenario.fillText("Texto aparecendo", 10, 10);
	}
	
	return jogador;
}

function SomDoPlanoDeFundo()
{
	var somDoPlanoDeFundo = new Objeto("Som", 0, 0);

	somDoPlanoDeFundo.InicializarObjeto = function()
	{
		somDoPlanoDeFundo.som = PegarSom("Som de plano de fundo");
		somDoPlanoDeFundo.som.loop = true;
		somDoPlanoDeFundo.som.play();
	}
	
	return somDoPlanoDeFundo;
}

//--------------------CENARIOS-------------------------------------------------------------------------//
var fase1 = new Cenario("Fase 1", 800, 600);
fase1.InicializarCenario = function()
{
	fase1.planosDeFundo.push(PegarImagem("Plano de fundo"));
	fase1.objetos.push(SomDoPlanoDeFundo());
	fase1.objetos.push(Jogador());
}
gerenciadorDeCenarios.push(fase1);

var fase2 = new Cenario("Fase 2", 800, 600);
fase2.InicializarCenario = function()
{
	fase2.planosDeFundo.push(PegarImagem("Plano de fundo 2"));
}
gerenciadorDeCenarios.push(fase2);