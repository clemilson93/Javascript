var canvas;
var contextoDaTela;
var PFTelaDeJogo = new Image();
var PFTelaInicial = new Image();
var tiroCerto = new Image();
var tiroErrado = new Image();
var ouroExtra = new Image();
var PFMusica = new Audio();
var SETiro = new Audio();
var SEAlerta = new Audio();
var SEPirata = new Audio();
PFMusica.src = "Musica.ogg";
PFMusica.volume =  0.6;
SETiro.src = "";
SEAlerta.src = "";
SEPirata.src = "";
PFMusica.loop = true;
PFTelaDeJogo.src = "PlanoDeFundo.png";
PFTelaInicial.src = "TelaInicial.png";
tiroCerto.src = "NavioDosPiratas.png";
tiroErrado.src = "TiroErrado.png";
ouroExtra.src = "OuroExtra.png";
var jogo;
var jogador = new Jogador();
/*alert("Bem vindo ao jogo Batalha Naval!");
alert("Voce encontrou uma ilha com um grande tesouro. E agora voce deve proteger o seu tesouro pois piratas estÃ¯Â¿Â½o chegando em barcos camuflados na ilha, e sua arma para mante-los longe Ã¯Â¿Â½ uma velha catapulta.\nBoa sorte!");*/

function PrepararJogo()
{
	canvas = document.getElementById("canvas");
	contextoDaTela = canvas.getContext("2d");
	contextoDaTela.save();
	contextoDaTela.font = "60px courier";
	contextoDaTela.textAlign = "center";
	contextoDaTela.fillText("Clique para jogar!", canvas.width / 2, canvas.height / 2);
	canvas.addEventListener("mousedown", ComandosDoMouseInicial);
	contextoDaTela.restore();
}

function ComandosDoMouseInicial(e)
{
	var mouseX = e.clientX - canvas.getBoundingClientRect().left;
	var mouseY = e.clientY - canvas.getBoundingClientRect().top;
	canvas.removeEventListener("mousedown", ComandosDoMouseInicial);
	jogo = new Jogo();
	jogo.TrocarTela(new TelaInicial());
}

function Jogador()
{
	this.pontuacao = 0;
	this.pedrasRestantes = 0;
	this.ouroRestante = 100;
}

function Jogo()
{
	PFMusica.play();
	this.maiorPontuacao = 0;
	this.ondaAtingida = 0;
	this.piratasRestantes = 0;
	this.espacoSelecionado = 0;
	this.andamento = "Pausa";
	this.telaAtual = 0;
	this.poup = 0;
	this.IniciarAndamento = function(objeto)
	{
		this.andamento = setInterval(this.AtualizarTela, 1000/30);
	}
	this.ChecarFimDaOnda = function()
	{
		var poupFimDaOnda = 0;
		if(jogador.pedrasRestantes == 0 || this.piratasRestantes == 0)
		{
			var posicao = jogo.telaAtual.objetosDaTela.findIndex(function(objeto){return objeto.id == "C4";});
			for(var i = posicao; i >= 0; i--)
			{
				this.telaAtual.objetosDaTela[i].clique = false;
			}
			if(this.piratasRestantes == 0)
			{
				setTimeout
				(
					function()
					{
						poupFimDaOnda = new PoupDeDialogo(100, 100, "informacao", "Você conseguiu destruir todos \nos barcos! Prepare-se para \na próxima onda de piratas.");
						poupFimDaOnda.Concluido = function()
						{
							NovaOnda();
							
						}
					},
					1000
				);
			}
			else
			{
				setTimeout
				(
					function()
					{
						poupFimDaOnda = new PoupDeDialogo(100, 100, "informacao", "Você não conseguiu destruir todos \nos barcos e agora os piratas estão \nlevando parte do seu ouro!");
						poupFimDaOnda.Concluido = function()
						{
							SEPirata.src = "Pirata.mp3";
							SEPirata.play();
							for(var i = jogo.piratasRestantes * 2; i > 0 && jogador.ouroRestante > 0; i--)
							{
								jogador.ouroRestante -= 1;
							}
							
							if(jogador.ouroRestante > 0)
							{
								setTimeout
								(
									function()
									{
										poupFimDaOnda = new PoupDeDialogo(100, 100, "informacao", "Prepare-se para a próxima onda de piratas.");
										poupFimDaOnda.Concluido = function()
										{
											NovaOnda();
											
										}
									},
									1000
								);
							}
							else
							{
								setTimeout
								(
									function()
									{
										poupFimDaOnda = new PoupDeDialogo(100, 100, "informacao", "Fim de jogo! \nTodo seu ouro foi levado pelos piratas. \nPontuação final: " + jogador.pontuacao);
										poupFimDaOnda.Concluido = function()
										{
											jogo.AtualizarPontuacao();
											jogo.TrocarTela(new TelaInicial());
											
										}
									},
									1000
								);
							}
							
						}
					},
					1000
				);
			}
		}
		
	}
	this.AtualizarPontuacao = function()
	{
		if(this.maiorPontuacao < jogador.pontuacao)
		{
			this.maiorPontuacao = jogador.pontuacao;
			jogador.pontuacao = 0;
			jogador.ouroRestante = 100
			this.ondaAtingida = 0;
			
		}
		
	}
	this.TrocarTela = function(tela)
	{
		this.telaAtual = tela;
		this.telaAtual.InicializarTela();
		
	}
	this.AtualizarTela = function()
	{
		jogo.telaAtual.AtualizarTela();
		
	}
	this.ComandosDoMouse = function(e)
	{
		jogo.telaAtual.ComandosDoMouse(e);
	}
	this.andamento = setInterval(this.AtualizarTela, 1000/30);
	canvas.addEventListener("mousedown", this.ComandosDoMouse);
}

function Texto(texto, x, y)
{
	this.ativo = true;
	this.valor = ["Texto"];
	this.x = x;
	this.y = y;
	this.cor = "black";
	this.tamanho = 20;
	this.alinhamento = "left";
	this.Atualizar = function(){}
	this.AtribuirTexto = function(novoValor)
	{
		var novoTexto = [];
		for(var i = 0; novoValor.search("\n") > -1; i++)
		{
			var posicao = novoValor.search("\n");
			var pedacoDoTexto = novoValor.slice(0, posicao);
			novoValor = novoValor.substr((posicao - 1) + 2);
			novoTexto.push(pedacoDoTexto);
		}
		novoTexto.push(novoValor);
		this.valor = novoTexto;
	}
	this.AtribuirTexto(texto);
	this.Desenhar = function()
	{
		contextoDaTela.save();
		contextoDaTela.font = this.tamanho + "px courier";
		contextoDaTela.textAlign = this.alinhamento;
		contextoDaTela.fillStyle = this.cor;
		contextoDaTela.strokeStyle = this.cor;
		for(var i = 0; i < this.valor.length; i++)
		{
			contextoDaTela.fillText(this.valor[i], this.x, this.y + this.tamanho * i);
		}
		contextoDaTela.restore();
	}
}

function Botao(x, y, texto)
{
	this.ativo = true;
	this.clique = true;
	this.x = x;
	this.y = y;
	this.largura = 0;
	this.altura = 0;
	this.parente = null;
	this.imagem = null;
	this.texto = ["Botão"];
	this.maiorCadeia = 0;
	this.textoTamanho = 20;
	this.Atualizar = function(){}
	this.AtribuirTexto = function(novoValor)
	{
		var novoTexto = [];
		for(var i = 0; novoValor.search("\n") > -1; i++)
		{
			var posicao = novoValor.search("\n");
			var pedacoDoTexto = novoValor.slice(0, posicao);
			novoValor = novoValor.substr((posicao - 1) + 2);
			novoTexto.push(pedacoDoTexto);
		}
		novoTexto.push(novoValor);
		this.texto = novoTexto;
		for(var i = 0; i < this.texto.length; i++)
		{
			if(this.texto[i].length > this.maiorCadeia)
			{
				this.maiorCadeia = this.texto[i].length;
			}
		}
		this.largura = (3 * (this.textoTamanho/5)) * this.maiorCadeia + 12;
		this.altura = this.texto.length * this.textoTamanho + 3 * (this.textoTamanho / 10);
	}
	this.AtribuirTexto(texto);
	this.Desenhar = function()
	{
		this.largura = (3 * (this.textoTamanho/5)) * this.maiorCadeia + 12;
		this.altura = this.texto.length * this.textoTamanho + 3 * (this.textoTamanho / 10);
		if(this.imagem == null)
		{
			contextoDaTela.save();
			contextoDaTela.fillStyle = "rgb(210,210,210)";
			contextoDaTela.strokeStyle = "black";
			contextoDaTela.fillRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.strokeRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.restore();
		}
		else
		{
			contextoDaTela.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
		}
		
		contextoDaTela.save();
		contextoDaTela.font = this.textoTamanho + "px courier";
		for(var i = 0; i < this.texto.length; i++)
		{
			contextoDaTela.fillText(this.texto[i], this.x + 6, this.y + this.textoTamanho + this.textoTamanho * i, this.largura);
		}
		contextoDaTela.restore();
	}
}

function AreaDeTexto(texto, x, y)
{
	clearInterval(jogo.andamento);
	jogo.andamento = "Pausa";
	jogo.poup = this;
	this.ativo = true;
	this.x = x;
	this.y = y;
	this.largura = 128;
	this.altura = 128;
	this.mensagem = ["Area de texto"];
	this.tamanhoDoTexto = 20;
	this.imagem = null;
	this.maxDeLinhas = 5;
	this.paginaAtual = 0;
	this.alturaDosBotoes = 0;
	this.AtribuirTexto = function(novoValor)
	{
		var novoTexto = [];
		for(var i = 0; novoValor.search("\n") > -1; i++)
		{
			var posicao = novoValor.search("\n");
			var pedacoDoTexto = novoValor.slice(0, posicao);
			novoValor = novoValor.substr((posicao - 1) + 2);
			novoTexto.push(pedacoDoTexto);
		}
		novoTexto.push(novoValor);
		this.mensagem = novoTexto;
		var maiorCadeia = 0;
		for(var i = 0; i < this.mensagem.length; i++)
		{
			if(this.mensagem[i].length > maiorCadeia)
			{
				maiorCadeia = this.mensagem[i].length;
			}
		}
		this.largura = (3 * (this.tamanhoDoTexto/5)) * maiorCadeia + 12;
		this.altura = this.maxDeLinhas * this.tamanhoDoTexto + 4 * (this.tamanhoDoTexto / 10) + 12;
		this.alturaDosBotoes = this.y + this.altura - 6;
		
	}
	this.AtribuirTexto(texto);
	this.botaoVoltarPagina = new Botao(this.x + 6, this.alturaDosBotoes, "<");
	this.botaoVoltarPagina.x = this.x + this.largura - this.botaoVoltarPagina.largura * 4.5;
	this.botaoVoltarPagina.parente = this;
	this.botaoVoltarPagina.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.paginaAtual -= 1;
			this.parente.Desenhar();
		}
	}
	this.botaoPassarPagina = new Botao(this.botaoVoltarPagina.x + this.botaoVoltarPagina.largura + 6, this.alturaDosBotoes, ">");
	this.botaoPassarPagina.parente = this;
	this.botaoPassarPagina.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.paginaAtual += 1;
			this.parente.Desenhar();
		}
	}
	this.botaoFechar = new Botao(this.botaoPassarPagina.x + this.botaoPassarPagina.largura + 6, this.alturaDosBotoes, "X");
	this.botaoFechar.parente = this;
	this.botaoFechar.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.Fechar();
			this.parente.Concluido();
		}
	}
	this.altura = this.altura + this.botaoVoltarPagina.altura;
	this.Desenhar = function()
	{
		contextoDaTela.clearRect(this.x - 1, this.y - 1, this.largura + 2, this.altura + 2);
		if(this.paginaAtual == Math.floor(this.mensagem.length / this.maxDeLinhas))
		{
			this.botaoPassarPagina.ativo = false;
		}
		else
		{
			this.botaoPassarPagina.ativo = true;
		}
		if(this.paginaAtual > 0)
		{
			this.botaoVoltarPagina.ativo = true;
		}
		else
		{
			this.botaoVoltarPagina.ativo = false;
		}
		if(this.imagem == null)
		{
			contextoDaTela.save();
			contextoDaTela.fillStyle = "white";
			contextoDaTela.strokeStyle = "black";
			contextoDaTela.fillRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.strokeRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.restore();
		}
		else
		{
			contextoDaTela.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
		}
		if(this.botaoFechar.ativo)
		{
			this.botaoFechar.Desenhar();
		}
		if(this.botaoPassarPagina.ativo)
		{
			this.botaoPassarPagina.Desenhar();
		}
		if(this.botaoVoltarPagina.ativo)
		{
			this.botaoVoltarPagina.Desenhar();
		}
		contextoDaTela.save();
		contextoDaTela.font = this.tamanhoDoTexto + "px courier"
		for(var i = 0, j = this.paginaAtual * this.maxDeLinhas; i < this.maxDeLinhas && j < this.mensagem.length; i++, j++)
		{
			contextoDaTela.fillText(this.mensagem[j], this.x + 6, this.y + this.tamanhoDoTexto + this.tamanhoDoTexto * i);
		}
		contextoDaTela.restore();
	}
	this.Clique = function(e)
	{
		jogo.poup.botaoVoltarPagina.Clique(e);
		jogo.poup.botaoPassarPagina.Clique(e);
		jogo.poup.botaoFechar.Clique(e);
	}
	canvas.addEventListener("mousedown", this.Clique);
	this.Fechar = function()
	{
		jogo.IniciarAndamento(this);
		canvas.removeEventListener("mousedown", jogo.poup.Clique);
		this.botaoFechar.ativo = false;
		this.botaoPassarPagina.ativo = false;
		this.botaoVoltarPagina.ativo = false;
		this.ativo = false;
	}
	this.Desenhar();
}

function PoupDeDialogo(x, y, tipo, mensagem)
{
	clearInterval(jogo.andamento);
	jogo.andamento = "Pausa";
	jogo.poup = this;
	this.ativo = true;
	this.x = x;
	this.y = y;
	this.largura = 128;
	this.altura = 128;
	this.mensagem = ["Poup de dialogo"];
	this.tamanhoDoTexto = 20;
	this.imagem = null;
	this.alturaDosBotoes = 0;
	this.AtribuirTexto = function(novoValor)
	{
		var novoTexto = [];
		for(var i = 0; novoValor.search("\n") > -1; i++)
		{
			var posicao = novoValor.search("\n");
			var pedacoDoTexto = novoValor.slice(0, posicao);
			novoValor = novoValor.substr((posicao - 1) + 2);
			novoTexto.push(pedacoDoTexto);
		}
		novoTexto.push(novoValor);
		this.mensagem = novoTexto;
		var maiorCadeia = 0;
		for(var i = 0; i < this.mensagem.length; i++)
		{
			if(this.mensagem[i].length > maiorCadeia)
			{
				maiorCadeia = this.mensagem[i].length;
			}
		}
		this.largura = (3 * (this.tamanhoDoTexto/5)) * maiorCadeia + 12;
		this.altura = this.mensagem.length * this.tamanhoDoTexto + 4 * (this.tamanhoDoTexto / 10) + 12;
		this.alturaDosBotoes = this.y + this.altura + 6;
	}
	this.AtribuirTexto(mensagem);
	this.botaoPositivo = new Botao(this.x + this.largura / 2, this.alturaDosBotoes, "Sim");
	this.botaoPositivo.x = (this.botaoPositivo.x - this.botaoPositivo.largura) - 10;
	this.botaoPositivo.ativo = false;
	this.botaoPositivo.parente = this;
	this.botaoPositivo.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.Fechar();
			this.parente.Sim();
		}
	}
	this.botaoFechar = new Botao(this.x + this.largura / 2, this.alturaDosBotoes, "Fechar");
	this.botaoFechar.x = this.botaoFechar.x - this.botaoFechar.largura;
	this.botaoFechar.ativo = false;
	this.botaoFechar.parente = this;
	this.botaoFechar.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.Fechar();
			this.parente.Concluido();
		}
	}
	this.botaoNegativo = new Botao(this.x + this.largura / 2, this.alturaDosBotoes, "Não");
	this.botaoNegativo.x = this.botaoNegativo.x + 10;
	this.botaoNegativo.ativo = false;
	this.botaoNegativo.parente = this;
	this.botaoNegativo.Clique = function(e)
	{
		var mouseX = e.clientX - canvas.getBoundingClientRect().left;
		var mouseY = e.clientY - canvas.getBoundingClientRect().top;
		if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura && this.ativo)
		{
			this.parente.Fechar();
			this.parente.Nao();
		}
	}
	this.Clique = function(e)
	{
		jogo.poup.botaoPositivo.Clique(e);
		jogo.poup.botaoFechar.Clique(e);
		jogo.poup.botaoNegativo.Clique(e);
	}
	canvas.addEventListener("mousedown", this.Clique);
	switch(tipo)
	{
		case "informacao":
			this.botaoFechar.ativo = true;
		break;
		case "decisao":
			this.botaoPositivo.ativo = true;
			this.botaoNegativo.ativo = true;
		break;
	}
	this.altura = this.altura + this.botaoPositivo.altura + 12;
	this.Desenhar = function()
	{
		if(this.imagem == null)
		{
			contextoDaTela.save();
			contextoDaTela.fillStyle = "white";
			contextoDaTela.strokeStyle = "black";
			contextoDaTela.fillRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.strokeRect(this.x, this.y, this.largura, this.altura);
			contextoDaTela.restore();
		}
		else
		{
			contextoDaTela.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
		}
		contextoDaTela.save();
		contextoDaTela.font = this.tamanhoDoTexto + "px courier"
		for(var i = 0; i < this.mensagem.length; i++)
		{
			contextoDaTela.fillText(this.mensagem[i], this.x + 6, this.y + this.tamanhoDoTexto + this.tamanhoDoTexto * i);
		}
		contextoDaTela.restore();
		if(this.botaoFechar.ativo)
		{
			this.botaoFechar.Desenhar();
		}
		if(this.botaoPositivo.ativo)
		{
			this.botaoPositivo.Desenhar();
		}
		if(this.botaoNegativo.ativo)
		{
			this.botaoNegativo.Desenhar();
		}
	}
	this.Fechar = function()
	{
		jogo.IniciarAndamento(this);
		canvas.removeEventListener("mousedown", jogo.poup.Clique);
		this.botaoFechar.ativo = false;
		this.botaoNegativo.ativo = false;
		this.botaoPositivo.ativo = false;
		this.ativo = false;
	}
	this.Desenhar();
}

function Placa(x, y, lar, alt)
{
	this.ativo = true;
	this.Atualizar = function(){}
	this.Desenhar = function()
	{
		contextoDaTela.save();
		contextoDaTela.fillStyle = "white";
		contextoDaTela.fillRect(x, y, lar, alt);
		contextoDaTela.strokeStyle = "black";
		contextoDaTela.strokeRect(x, y, lar, alt);
		contextoDaTela.restore();
	}
}

function TelaInicial()
{
	this.objetosDaTela = [];
	this.objetosDeClicar = [];
	this.InicializarTela = function()
	{
		var textoPontuacao00 = new Texto("Melhor pontuação:\n" + jogo.maiorPontuacao, 350, 400);
		textoPontuacao00.Atualizar = function()
		{
			this.AtribuirTexto("Melhor pontuação:\n" + jogo.maiorPontuacao);
		}
		var placaDaPontuacao = new Placa(textoPontuacao00.x - 20, textoPontuacao00.y - 30, 250, 70);
		var btJogar = new Botao(30, 370, "Jogar");
		btJogar.textoTamanho = 50;
		btJogar.Clique = function(e)
		{
			var mouseX = e.clientX - canvas.getBoundingClientRect().left;
			var mouseY = e.clientY - canvas.getBoundingClientRect().top;
			if(mouseX >= btJogar.x && mouseX <= btJogar.x + btJogar.largura && mouseY >= btJogar.y && mouseY <= btJogar.y + btJogar.altura)
			{
				jogo.TrocarTela(new TelaDeJogo());
			}
		}
		this.objetosDaTela.push(placaDaPontuacao);
		this.objetosDaTela.push(textoPontuacao00);
		this.objetosDaTela.push(btJogar);
		this.objetosDeClicar.push(btJogar);
	}
	this.AtualizarTela = function()
	{
		contextoDaTela.clearRect(0, 0, canvas.width, canvas.height);
		contextoDaTela.drawImage(PFTelaInicial, 0, 0);
		for(var i = 0; i < this.objetosDaTela.length; i++)
		{
			if(this.objetosDaTela[i].ativo)
			{
				this.objetosDaTela[i].Atualizar();
				this.objetosDaTela[i].Desenhar();
			}
		}
		
	}
	this.ComandosDoMouse = function(e)
	{
		for(var i = 0; i < this.objetosDeClicar.length; i++)
		{
			if(this.objetosDeClicar[i].ativo && jogo.andamento != "Pausa")
			{
				this.objetosDeClicar[i].Clique(e);
			}
		}
		
	}
}

function PainelDeInformacoes()
{
	this.ativo = true;
	this.Atualizar = function(){}
	this.Desenhar = function()
	{
		contextoDaTela.save();
		contextoDaTela.fillStyle = "white";
		contextoDaTela.font = "25px courier";
		contextoDaTela.fillText("A", 20, 78);
		contextoDaTela.fillText("B", 20, 190);
		contextoDaTela.fillText("C", 20, 302);
		contextoDaTela.fillText("0", 96, 20);
		contextoDaTela.fillText("1", 208, 20);
		contextoDaTela.fillText("2", 320, 20);
		contextoDaTela.fillText("3", 432, 20);
		contextoDaTela.fillText("4", 544, 20);
		contextoDaTela.restore();
		contextoDaTela.save();
		contextoDaTela.fillStyle = "white";
		contextoDaTela.fillRect(0, 360, 640, 120);
		contextoDaTela.strokeStyle = "black";
		contextoDaTela.strokeRect(0, 360, 640, 120);
		contextoDaTela.restore();
		
		contextoDaTela.save();
		contextoDaTela.font = "bold 20px courier";
		contextoDaTela.fillText("Pontuação: " + jogador.pontuacao, 10, 390);
		contextoDaTela.fillText("Ouro: " + jogador.ouroRestante + "%", 10, 420);
		contextoDaTela.fillText("Pedras: " + jogador.pedrasRestantes, 10, 450);
		contextoDaTela.fillText("Onda: " + jogo.ondaAtingida, 300, 420);
		contextoDaTela.restore();
		
	}
	
}

function NovaOnda()
{
	jogo.piratasRestantes = 0;
	var piratas = new Array(15);
	piratas.fill(false);
	for(var i = 0, j = 0, o = 0; j < 8; i++)
	{
		var espaco = Math.floor(Math.random() * 10);
		if(espaco != 1 && piratas[i] == false)
		{
			var pirata = Math.floor(Math.random() * 2);
			if(pirata == 1)
			{
				piratas[i] = true;
				j += 1;
			}
			else
			{
				piratas[i] = false;
			}
			
		}
		else
		{
			if(o < 2)
			{
				piratas[i] = "OuroExtra";
				o += 1;
			}
		}
		if(i == 14)
		{
			i = 0;
		}
		
	}
	var posicao = jogo.telaAtual.objetosDaTela.findIndex(function(objeto){return objeto.id == "A0";});
	for(var i = 0, j = posicao; i >= 0 && i < 15; i++, j++)
	{
		jogo.telaAtual.objetosDaTela[j].imagem = null;
		jogo.telaAtual.objetosDaTela[j].clique = true;
		jogo.telaAtual.objetosDaTela[j].pirata = piratas[i];
		if(jogo.telaAtual.objetosDaTela[j].pirata == true)
		{
			jogo.telaAtual.objetosDaTela[j].Acerto = function(e)
			{
				SETiro.src = "TiroCerto.mp3";
				SETiro.play();
				this.imagem = tiroCerto;
				jogador.pontuacao += 50;
				jogo.piratasRestantes -= 1;
				jogador.pedrasRestantes -= 1;
				this.clique = false;
				
			}
			jogo.piratasRestantes += 1;
		}
		if(jogo.telaAtual.objetosDaTela[j].pirata == false)
		{
			jogo.telaAtual.objetosDaTela[j].Acerto = function(e)
			{
				SETiro.src = "TiroErrado.mp3";
				SETiro.play();
				this.imagem = tiroErrado;
				jogador.pedrasRestantes -= 1;
				this.clique = false;
				
			}
		}
		if(jogo.telaAtual.objetosDaTela[j].pirata == "OuroExtra")
		{
			jogo.telaAtual.objetosDaTela[j].Acerto = function(e)
			{
				SETiro.src = "OuroExtra.mp3";
				SETiro.play();
				this.imagem = ouroExtra;
				for(var i = 0; i < 2 && jogador.ouroRestante < 100; i++)
				{
					jogador.ouroRestante += 1;
				}
				this.clique = false;
				jogador.pedrasRestantes -= 1;
				this.clique = false;
				
			}
			
		}
	}
	jogador.pedrasRestantes = 10;
	jogo.ondaAtingida += 1;
	SEAlerta.src = "Alerta.mp3";
	SEAlerta.play();
}

function TelaDeJogo()
{
	this.objetosDaTela = [];
	this.objetosDeClicar = [];
	this.InicializarTela = function()
	{
		jogador = new Jogador();
		this.objetosDaTela.push(new PainelDeInformacoes());
		var espaco;
		var coord = ["A", "B", "C"];
		for(var i = 0, j = 0, h = 0, l = 0; i < 15; i++, j++)
		{
			if(j / 5 == 1)
			{
				h += 1;
				j = 0;
				l += 1;
			}
			espaco = new Botao(48 + 112 * j, 30 + 112 * h, "");
			espaco.clique = false;
			espaco.largura = 96;
			espaco.altura = 96;
			espaco.id = coord[l] + j;
			espaco.pirata = false;
			espaco.Desenhar = function()
			{
				if(this.imagem == null)
				{
					contextoDaTela.save()
					contextoDaTela.lineWidth = 3;
					contextoDaTela.strokeStyle = "white";
					contextoDaTela.strokeRect(this.x, this.y, this.largura, this.altura);
					contextoDaTela.restore();
				}
				else
				{
					contextoDaTela.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
				}
			}
			espaco.Acerto = function(e)
			{
				if(this.pirata == true)
				{
					this.imagem = tiroCerto;
					jogador.pontuacao += 50;
					jogo.piratasRestantes -= 1;
				}
				else
				{
					this.imagem = tiroErrado;
				}
				jogador.pedrasRestantes -= 1;
				this.clique = false;
				
			}
			espaco.Clique = function(e)
			{
				var mouseX = e.clientX - canvas.getBoundingClientRect().left;
				var mouseY = e.clientY - canvas.getBoundingClientRect().top;
				if(mouseX >= this.x && mouseX <= this.x + this.largura && mouseY >= this.y && mouseY <= this.y + this.altura)
				{
					jogo.espacoSelecionado = this;
					var diag = new PoupDeDialogo(180, 360, "decisao", "Tem certeza de que quer\natirar no espaço " + this.id + "?");
					diag.Sim = function()
					{
						jogo.espacoSelecionado.Acerto();
						jogo.ChecarFimDaOnda();
						
					}
					diag.Nao = function()
					{
						console.log("não");
					}
					contextoDaTela.save();
					contextoDaTela.strokeStyle = "black";
					
					contextoDaTela.beginPath();//cima
					contextoDaTela.moveTo(diag.x, diag.y);
					contextoDaTela.lineTo(this.x + this.largura / 2, this.y + this.altura / 2);
					contextoDaTela.lineTo(diag.x + diag.largura, diag.y);
					contextoDaTela.closePath();
					contextoDaTela.fill();
					
					contextoDaTela.beginPath();//baixo
					contextoDaTela.moveTo(diag.x, diag.y + diag.altura);
					contextoDaTela.lineTo(this.x + this.largura / 2, this.y + this.altura / 2);
					contextoDaTela.lineTo(diag.x + diag.largura, diag.y + diag.altura);
					contextoDaTela.closePath();
					contextoDaTela.fill();
					
					contextoDaTela.beginPath();//esquerda
					contextoDaTela.moveTo(diag.x, diag.y);
					contextoDaTela.lineTo(this.x + this.largura / 2, this.y + this.altura / 2);
					contextoDaTela.lineTo(diag.x, diag.y + diag.altura);
					contextoDaTela.closePath();
					contextoDaTela.fill();
					
					contextoDaTela.beginPath();//direita
					contextoDaTela.moveTo(diag.x + diag.largura, diag.y);
					contextoDaTela.lineTo(this.x + this.largura / 2, this.y + this.altura / 2);
					contextoDaTela.lineTo(diag.x + diag.largura, diag.y + diag.altura);
					contextoDaTela.closePath();
					contextoDaTela.fill();
					
					contextoDaTela.restore();
					diag.Desenhar();
				}
			}
			this.objetosDaTela.push(espaco);
			this.objetosDeClicar.push(espaco);
		}
		setTimeout
		(
			function()
			{
				var at = new AreaDeTexto("Bem vindo ao jogo Batalha Naval!\nVocê encontrou uma ilha com um grande tesouro.\nE agora você precisa proteger o seu tesouro pois,\npiratas estão chegando na ilha usando barcos\ncamuflados, e sua arma para mante-los longe\né uma velha catapulta.\nBoa sorte!", 20, 100);
				at.Concluido = function()
				{
					NovaOnda();
				}
			},
			1000
		);
	}
	
	this.AtualizarTela = function()
	{
		contextoDaTela.clearRect(0, 0, canvas.width, canvas.height);
		contextoDaTela.drawImage(PFTelaDeJogo, 0, 0);
		for(var i = 0; i < this.objetosDaTela.length; i++)
		{
			if(this.objetosDaTela[i].ativo)
			{
				this.objetosDaTela[i].Atualizar();
				this.objetosDaTela[i].Desenhar();
			}
		}
		
	}
	
	this.ComandosDoMouse = function(e)
	{
		for(var i = 0; i < jogo.telaAtual.objetosDeClicar.length; i++)
		{
			if(jogo.telaAtual.objetosDeClicar[i].clique && jogo.andamento != "Pausa")
			{
				jogo.telaAtual.objetosDeClicar[i].Clique(e);
			}
		}
		
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeVariables()
{
	Math.floor(Math.random()*4);
	for(i=0;i<4;i++)
	{
		for(j=0;j<4;j++)
		{
			var shipExist=Math.floor(Math.random()*4);
			if(shipExist==3&&numberOfShips<6)
			{
			ships[i][j]=true;
			numberOfShips++;
			}
			else
			{
			ships[i][j]=false;
			}
		}
	}
	document.getElementById("gameLog").innerHTML="NÃ¯Â¿Â½mero de barcos: "+numberOfShips;
}
 
function updateCanvas()
{
	contextoDaTela.clearRect(0,0,canvas.width,canvas.height);
	contextoDaTela.drawImage(PFTelaDeJogo, 0, 0, 500, 500);
	var h=0;
	for(i=0;i<4;i++)
	{
	  for(j=0;j<4;j++)
	  {
		if(colorsOfSpaces[i][j] == "green")
		{
		contextoDaTela.drawImage(barcoPirata, spaces[j], spaces[i], 100, 100);
		}
		if(colorsOfSpaces[i][j] == "red")
		{
		contextoDaTela.drawImage(tiroErrado, spaces[j], spaces[i], 100, 100);
		}
		contextoDaTela.strokeStyle=colorsOfSpaces[i][j];
		contextoDaTela.strokeRect(spaces[j], spaces[i], 100, 100);
	  }
	  h+=120;
	}
	for(numberColumn=70,i=0;numberColumn<=4*120;numberColumn+=120)
	{
	  contextoDaTela.strokeStyle="white";
	  contextoDaTela.fillStyle="red";
	  contextoDaTela.strokeText(i,numberColumn,10);
	  contextoDaTela.fillText(i,numberColumn,10);
	  i++;
	}

	for(numberLine=70,i=0;numberLine<=4*120;numberLine+=120)
	{
	  contextoDaTela.strokeStyle="white";
	  contextoDaTela.fillStyle="red";
	  contextoDaTela.strokeText(i,10,numberLine);
	  contextoDaTela.fillText(i,10,numberLine);
	  i++;
	}
}

function checkCoordinates()
{
	var line=document.coordinates.line.value;
	var column=document.coordinates.column.value;
	try
	{
	  line=parseInt(line);
	  column=parseInt(column);
	  if(isNaN(column)||isNaN(line))
	  {
		alert("digite apenas nÃ¯Â¿Â½meros");
	  }
	  else
	  {
		  if(!playerShots[line][column])
		  {
			playerShots[line][column]=true;
			checkShot(line,column);
		  }
		  else
		  {
			alert("VocÃ¯Â¿Â½ jÃ¯Â¿Â½ atirou nesse lugar! Tente outra coordenada.");
		  }
	  }

	}
	catch(e)
	{
	  alert("Error");
	}
}

function checkShot(line,column)
{
	if(playerShots[line][column]==ships[line][column])
	{
	  alert("Acertou tiro");
	  colorsOfSpaces[line][column]="green";
	  numberOfShips--;
	  document.getElementById("gameLog").innerHTML="NÃ¯Â¿Â½mero de barcos: "+numberOfShips;
	}
	else
	{
	  alert("Errou tiro");
	  colorsOfSpaces[line][column]="red";
	}
	updateCanvas();
	if(numberOfShips==0)
	{
	  alert("ParabÃ¯Â¿Â½ns! VocÃ¯Â¿Â½ destruiu todos os barcos inimigos.");
	  window.location.reload();
	}
}

 

function help()
{
	alert("Para dar um tiro no espaÃ¯Â¿Â½o desejado, digite as coordenadas linha e coluna, depois clique em atirar. SÃ¯Â¿Â½o 4 linhas numeradas de 0 atÃ¯Â¿Â½ 3, e 4 colunas numeradas de 0 atÃ¯Â¿Â½ 3. ");
}