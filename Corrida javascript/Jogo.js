var canvas;
var contextoDaTela;
var jogo = new Jogo();
var areaDeMensagens = new AreaDeMensagens();
var posicaoDosCirculos = new Array(24);
var espelhoDosCirculos = new Array(24);
var posicaoDosBotoes = [[20, 170],[112, 170], [20, 170]];
var imagemTelaInicial = new Image();
var imagemTelaEscolha = new Image();
var imagemTelaDeJogo = new Image();
var somDoInicioDoJogo = new Audio();
var somDoMenuDoJogo = new Audio();
var somDoCarro = new Audio();
var somFimDeCorrida1 = new Audio();
var somFimDeCorrida2 = new Audio();
var cores = [["red", 0], ["white", 0], ["blue", 0]];
somDoInicioDoJogo.src = "somInicioDoJogo.mp3";
somDoMenuDoJogo.src = "somMenuPrincipal.mp3";
somDoCarro.src = "somCarro.ogg";
somFimDeCorrida1.src = "fimDaCorrida1.wav";
somFimDeCorrida2.src = "fimDaCorrida2.ogg";
imagemTelaInicial.src = "TelaInicial.png";
imagemTelaEscolha.src = "Escolha.png";
imagemTelaDeJogo.src = "TelaDeJogo.png";

function PrepararJogo()
{
	canvas = document.getElementById("TelaDoJogo");
	contextoDaTela = canvas.getContext("2d");
	contextoDaTela.font = "40px arial";
	contextoDaTela.fillText("Clique para jogar!", 160, 200);
	canvas.addEventListener("mousedown", ComandosDoMouseInicial);
}

function ComandosDoMouseInicial()
{
	IniciarJogo();
	canvas.removeEventListener("mousedown", ComandosDoMouseInicial);
}

function IniciarJogo()
{
	somFimDeCorrida1.load();
	somFimDeCorrida2.load();
	for(var i = 0; i < cores.length; i++)
	{
		cores[i][1] = 0;
	}
	for(var i = 0; i < jogo.veiculos.length; i++)
	{
		jogo.veiculos[i][1] = 0;
	}
	for(var i = 0; i < espelhoDosCirculos.length; i++)
	{
		espelhoDosCirculos[i] = "nada";
	}
	for(var i = 0, j = 0, k = 0; i < posicaoDosCirculos.length; i++, j += 56)
	{
		if(j > 280)
		{
			j = 0;
			k += 56;
			
		}
		posicaoDosCirculos[i] = new Array(3);
		posicaoDosCirculos[i][0] = 328 + j;
		posicaoDosCirculos[i][1] = 32 + k;
		var escolhido = false;
		while(!escolhido)
		{
			var corEscolhida = Math.floor(Math.random() * cores.length);
			if(cores[corEscolhida][1] < 8)
			{
				posicaoDosCirculos[i][2] = cores[corEscolhida][0];
				cores[corEscolhida][1] += 1;
				escolhido = true;
			}
			
		}
		
	}
	if(jogo.estado == 0)
	{
		TelaInicial();
	}
	jogo.estado = 0;
	jogo.mensagens[3] = "Fim da corrida! Vencedor é o ";
	areaDeMensagens.inicioDaCadeia = 0;
	somDoMenuDoJogo.play();
	
}

function TelaInicial()
{
	contextoDaTela.drawImage(imagemTelaInicial, 0, 0, 640, 480);
	contextoDaTela.font = "20px arial";
	contextoDaTela.fillStyle = "black";
	contextoDaTela.fillText("Pressione a tecla J para jogar", 10, 470);
	contextoDaTela.fillText("Placar", 500, 400);
	contextoDaTela.fillText("Vitorias: " + jogo.vitorias, 500, 430);
	contextoDaTela.fillText("Derrotas: " + jogo.derrotas, 500, 460);
	window.addEventListener('keydown', ComandosDaTelaInicial);
	
}

function ComandosDaTelaInicial(e)
{
	if(e.keyCode == 74)
	{
		TelaDeEscolha();
		window.removeEventListener('keydown', ComandosDaTelaInicial);
	}
}

function TelaDeEscolha()
{
	contextoDaTela.clearRect(0, 0, 640, 480);
	contextoDaTela.drawImage(imagemTelaEscolha, 0, 0, 640, 240);
	contextoDaTela.font = "20px arial";
	contextoDaTela.fillText("Pressione a tecla que corresponde a opção desejada.", 10, 470);
	contextoDaTela.fillText("Bombeiro", 56, 300);
	contextoDaTela.fillText("Tecla J", 56, 350);
	contextoDaTela.fillText("Socorrista", 260, 300);
	contextoDaTela.fillText("Tecla K", 260, 350);
	contextoDaTela.fillText("Policial", 500, 300);
	contextoDaTela.fillText("Tecla L", 500, 350);
	window.addEventListener('keydown', ComandosDaTelaEscolha);
}

function ComandosDaTelaEscolha(e)
{
	switch(e.keyCode)
	{
		case 74:
			jogo.opcaoJogador = 0;
			jogo.opcaoComputador1 = 1;
			jogo.opcaoComputador2 = 2;
			window.removeEventListener('keydown', ComandosDaTelaEscolha);
			TelaDeJogo();
		break;
		case 75:
			jogo.opcaoJogador = 1;
			jogo.opcaoComputador1 = 0;
			jogo.opcaoComputador2 = 2;
			window.removeEventListener('keydown', ComandosDaTelaEscolha);
			TelaDeJogo();
		break;
		case 76:
			jogo.opcaoJogador = 2;
			jogo.opcaoComputador1 = 0;
			jogo.opcaoComputador2 = 1;
			window.removeEventListener('keydown', ComandosDaTelaEscolha);
			TelaDeJogo();
		break;
	}

}

function TelaDeJogo()
{
	somDoMenuDoJogo.load();
	contextoDaTela.clearRect(0, 0, 640, 480);
	contextoDaTela.drawImage(imagemTelaDeJogo, 0, 0, 640, 480);//tabuleiro
	contextoDaTela.drawImage(imagemTelaEscolha, 0, 0, 64, 64, jogo.veiculos[0][1] * 72, 270, 64, 64);//bombeiro
	contextoDaTela.drawImage(imagemTelaEscolha, 64, 0, 64, 64, jogo.veiculos[1][1] * 72, 340, 64, 64);//socorrista
	contextoDaTela.drawImage(imagemTelaEscolha, 128, 0, 64, 64, jogo.veiculos[2][1] * 72, 410, 64, 64);//policia
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoJogador][2];
	contextoDaTela.fillText("Jogador: " + jogo.veiculos[jogo.opcaoJogador][0], 10, 20);
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoComputador1][2];
	contextoDaTela.fillText("Corredor 1: " + jogo.veiculos[jogo.opcaoComputador1][0], 10, 40);
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoComputador2][2];
	contextoDaTela.fillText("Corredor 2: " + jogo.veiculos[jogo.opcaoComputador2][0], 10, 60);
	areaDeMensagens.DesenharArea();
	window.addEventListener('keydown', ComandosDaTelaDeJogo);
	somDoInicioDoJogo.loop = true;
	somDoInicioDoJogo.play();
}

function AtualizarTelaDeJogo()
{
	contextoDaTela.clearRect(0, 0, 640, 480);
	contextoDaTela.drawImage(imagemTelaDeJogo, 0, 0, 640, 480);//tabuleiro
	contextoDaTela.drawImage(imagemTelaEscolha, 0, 0, 64, 64, jogo.veiculos[0][1] * 72, 270, 64, 64);//bombeiro
	contextoDaTela.drawImage(imagemTelaEscolha, 64, 0, 64, 64, jogo.veiculos[1][1] * 72, 340, 64, 64);//socorrista
	contextoDaTela.drawImage(imagemTelaEscolha, 128, 0, 64, 64, jogo.veiculos[2][1] * 72, 410, 64, 64);//policia
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoJogador][2];
	contextoDaTela.fillText("Jogador: " + jogo.veiculos[jogo.opcaoJogador][0], 10, 20);
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoComputador1][2];
	contextoDaTela.fillText("Corredor 1: " + jogo.veiculos[jogo.opcaoComputador1][0], 10, 40);
	contextoDaTela.fillStyle = jogo.veiculos[jogo.opcaoComputador2][2];
	contextoDaTela.fillText("Corredor 2: " + jogo.veiculos[jogo.opcaoComputador2][0], 10, 60);
	for(var i = 0; i < posicaoDosCirculos.length; i++)
	{
		if(espelhoDosCirculos[i] != "nada")
		{
			contextoDaTela.fillStyle = espelhoDosCirculos[i];
			contextoDaTela.beginPath();
			contextoDaTela.arc(posicaoDosCirculos[i][0], posicaoDosCirculos[i][1], 24, 0, 2 * Math.PI);
			contextoDaTela.fill();
		}
	}
	areaDeMensagens.DesenharArea();
	jogo.VerificarFimDeJogo();
}

function ComandosDaTelaDeJogo(e)
{
	switch(e.keyCode)
	{
		case 13:
			if(jogo.estado == 0)
			{
				areaDeMensagens.DesenharArea();
				if(areaDeMensagens.inicioDaCadeia > jogo.mensagens[jogo.estado].length)
				{
					jogo.estado = 1;
					areaDeMensagens.inicioDaCadeia = 0;
					areaDeMensagens.DesenharArea();
					canvas.addEventListener("mousedown", ComandosDoMouse);
				}
			}
		break;
	}
}

function ComandosDoMouse(e)
{
	var mouseX = e.clientX - canvas.getBoundingClientRect().left;
	var mouseY = e.clientY - canvas.getBoundingClientRect().top;
	switch(jogo.estado)
	{
		case 1:
			for(var i = 0; i < posicaoDosCirculos.length; i++)
			{
				var calculo = Math.sqrt(Math.pow(posicaoDosCirculos[i][0] - mouseX, 2) + Math.pow(posicaoDosCirculos[i][1] - mouseY, 2));
				if(calculo < 24 && espelhoDosCirculos[i] == "nada")
				{
					jogo.circuloEscolhido = i;
					jogo.mensagens[2] = "Você tem certeza de que  quer a opção " + (jogo.circuloEscolhido + 1) +"?";
					jogo.estado = 2;
					areaDeMensagens.inicioDaCadeia = 0;
					areaDeMensagens.DesenharArea();
					
				}
				
			}
		break;
		case 2:
			for(var i = 0; i < posicaoDosBotoes.length; i++)
			{
				if(mouseX >= posicaoDosBotoes[i][0] && mouseX <= posicaoDosBotoes[i][0] + 64 && mouseY >= posicaoDosBotoes[i][1] && mouseY <= posicaoDosBotoes[i][1] + 48)
				{
					switch(i)
					{
						case 0://botao sim
							somDoCarro.load();
							jogo.estado = 1;
							espelhoDosCirculos[jogo.circuloEscolhido] = posicaoDosCirculos[jogo.circuloEscolhido][2];
							if(posicaoDosCirculos[jogo.circuloEscolhido][2] == "red")
							{
								jogo.veiculos[0][1] += 1;
							}
							if(posicaoDosCirculos[jogo.circuloEscolhido][2] == "white")
							{
								jogo.veiculos[1][1] += 1;
							}
							if(posicaoDosCirculos[jogo.circuloEscolhido][2] == "blue")
							{
								jogo.veiculos[2][1] += 1;
							}
							somDoCarro.play();
							AtualizarTelaDeJogo();
							areaDeMensagens.inicioDaCadeia = 0;
							areaDeMensagens.DesenharArea();
						break;
						case 1://botao nao
							jogo.estado = 1;
							areaDeMensagens.inicioDaCadeia = 0;
							areaDeMensagens.DesenharArea();
						break;
					}
					
				}
				
			}
		break;
		case 3:
			for(var i = 0; i < posicaoDosBotoes.length; i++)
			{
				if(mouseX >= posicaoDosBotoes[i][0] && mouseX <= posicaoDosBotoes[i][0] + 64 && mouseY >= posicaoDosBotoes[i][1] && mouseY <= posicaoDosBotoes[i][1] + 48)
				{
					switch(i)
					{
						case 2://botao tela inicial
							window.removeEventListener('keydown', ComandosDaTelaDeJogo);
							canvas.removeEventListener("mousedown", ComandosDoMouse);
							IniciarJogo();
							somDoInicioDoJogo.load();
							TelaInicial();
						break;
					}
					
				}
				
			}
		break;
		
	}
	
	
}

function AreaDeMensagens()
{
	this.maximoDeCaracteres = 25;
	this.maximoDeLinhas = 7;
	this.inicioDaCadeia = 0;
	/*
	-"                         " para pular linhas
	-a caixa de texto mostra no maximo 175 caracteres
	
	*/
	this.DesenharArea = function()
	{
		contextoDaTela.strokeStyle = "white";
		contextoDaTela.lineWidth = 3;
		contextoDaTela.strokeRect(3, 70, 288, 160);
		contextoDaTela.fillStyle = "black";
		contextoDaTela.fillRect(3, 70, 288, 160);
		contextoDaTela.fillStyle = "white";
		for(var i = 0, j = 90; i < this.maximoDeLinhas; i++, j += 20)
		{
			contextoDaTela.fillText(jogo.mensagens[jogo.estado].substr(this.inicioDaCadeia, this.maximoDeCaracteres), 5, j);
			this.inicioDaCadeia += this.maximoDeCaracteres;
		}
		switch(jogo.estado)
		{
			case 2:
				contextoDaTela.strokeRect(posicaoDosBotoes[0][0], posicaoDosBotoes[0][1], 64, 48);
				contextoDaTela.fillText("Sim", posicaoDosBotoes[0][0] + 10, posicaoDosBotoes[0][1] + 30);
				contextoDaTela.strokeRect(posicaoDosBotoes[1][0], posicaoDosBotoes[1][1], 64, 48);
				contextoDaTela.fillText("Não", posicaoDosBotoes[1][0] + 10, posicaoDosBotoes[1][1] + 30);
			break;
			case 3:
				contextoDaTela.strokeRect(posicaoDosBotoes[2][0], posicaoDosBotoes[2][1], 64, 48);
				contextoDaTela.fillText("Menu", posicaoDosBotoes[2][0] + 10, posicaoDosBotoes[2][1] + 30);
			break;
		}
		
	}
}

function Jogo()
{
	this.opcaoJogador = 0;
	this.opcaoComputador1 = 0;
	this.opcaoComputador2 = 0;
	this.estado = 0;
	this.circuloEscolhido = 0;
	this.veiculos = [
		["Bombeiro", 0, "red"],
		["Socorrista", 0, "white"],
		["Policial", 0, "blue"]
	];
	this.vitorias = 0;
	this.derrotas = 0;
	this.mensagens = [
		"Olá, nesse jogo você deveser o primeiro a chegar  na linha final clicando  com mouse nos círculos   enumerados de 1 a 24, se esse número tiver a sua         Pressione enter...cor, o seu veículo vai   avançar, caso contrário, o veículo que avançará   será o do concorrente queteve a cor que apareceu.                                 Pressione enter...",
		"Escolha um número agora!",
		"padrao",
		"Fim da corrida! Vencedor é o ",
		"0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
	];
	this.VerificarFimDeJogo = function()
	{
		for(var i = 0; i < this.veiculos.length; i++)
		{
			if(this.veiculos[i][1] == 8)
			{
				somDoInicioDoJogo.load();
				this.estado = 3;
				this.mensagens[3] = this.mensagens[3] + this.veiculos[i][0] + "!";
				if(this.opcaoJogador == i)
				{
					this.vitorias += 1;
					somFimDeCorrida1.play();
				}
				else
				{
					this.derrotas += 1;
					somFimDeCorrida2.play();
				}
				areaDeMensagens.inicioDaCadeia = 0;
				areaDeMensagens.DesenharArea();
			}
		}
	}
}