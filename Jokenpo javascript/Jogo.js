var canvas;

var contextoDaTela;

var imagem;

var jogo;

imagemTelaInicial = new Image();

imagemTelaEscolha = new Image();

imagemTelaInicial.src = "TelaInicial.png";

imagemTelaEscolha.src = "Escolha.png";

 

function IniciarJogo()

{

                canvas = document.getElementById("TelaDoJogo");

                contextoDaTela = canvas.getContext("2d");

                jogo = new Jogo();

                TelaInicial();

}

 

function TelaInicial()

{

                contextoDaTela.drawImage(imagemTelaInicial, 0, 0, 640, 480);

                contextoDaTela.font = "20px arial";

                contextoDaTela.fillText("Pressione a tecla J para jogar", 10, 470);

                contextoDaTela.fillText("Placar", 500, 350);

                contextoDaTela.fillText("Vitorias: " + jogo.vitorias, 500, 380);

                contextoDaTela.fillText("Derrotas: " + jogo.derrotas, 500, 410);

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

                contextoDaTela.fillText("Tecla J", 100, 300);

                contextoDaTela.fillText("Tecla K", 300, 300);

                contextoDaTela.fillText("Tecla L", 500, 300);

                window.addEventListener('keydown', ComandosDaTelaEscolha);

}

 

function ComandosDaTelaEscolha(e)

{

                switch(e.keyCode)

                {

                               case 74:

                                               jogo.opcaoJogador = 0;

                                               window.removeEventListener('keydown', ComandosDaTelaEscolha);

                                               TelaDeJogo();

                               break;

                               case 75:

                                               jogo.opcaoJogador = 1;

                                               window.removeEventListener('keydown', ComandosDaTelaEscolha);

                                               TelaDeJogo();

                               break;

                               case 76:

                                               jogo.opcaoJogador = 2;

                                               window.removeEventListener('keydown', ComandosDaTelaEscolha);

                                               TelaDeJogo();

                               break;

                }

}

 

function TelaDeJogo()

{

                jogo.opcaoComputador = Math.floor(Math.random() * 3);

                contextoDaTela.clearRect(0, 0, 640, 480);

                contextoDaTela.save();

                //desenha a opção do jogador

                contextoDaTela.translate(225, 113);

                contextoDaTela.rotate(90*Math.PI/180);

                contextoDaTela.drawImage(imagemTelaEscolha, 0 + 120 * jogo.opcaoJogador, 0, 120, 128, 0, 0, 120, 128);

                contextoDaTela.restore();

                contextoDaTela.save();

                //desenha a opção do computador

                contextoDaTela.translate(425, 227);

                contextoDaTela.rotate(-90*Math.PI/180);

                contextoDaTela.drawImage(imagemTelaEscolha, 0 + 120 * jogo.opcaoComputador, 0, 120, 128, 0, 0, 120, 128);

                contextoDaTela.restore();

 

                jogo.CalcularResultado();

                contextoDaTela.font = "20px arial";

                contextoDaTela.fillText("Você", 125, 300);

                contextoDaTela.fillText("Computador", 450, 300);

                contextoDaTela.fillText(jogo.mensagem, 10, 400);

                contextoDaTela.fillText("Aperte a tecla C para continuar.", 10, 430);

                window.addEventListener('keydown', ComandosDaTelaDeJogo);

}

 

function ComandosDaTelaDeJogo(e)

{

                switch(e.keyCode)

                {

                               case 67:

                                               window.removeEventListener('keydown', ComandosDaTelaDeJogo);

                                               TelaInicial();

                               break;

                }

}

 

function Jogo()

{

                this.opcaoJogador = 0;

                this.opcaoComputador = 0;

                this.vitorias = 0;

                this.derrotas = 0;

                this.mensagem = "Nada";

                this.CalcularResultado = function()

                {

                               var ganhou = false;

                               switch(this.opcaoJogador)

                               {

                                               case 0:

                                                               if(this.opcaoComputador == 1)

                                                               {

                                                                              this.derrotas += 1;

                                                                              ganhou = false;

                                                               }

                                                               if(this.opcaoComputador == 2)

                                                               {

                                                                              this.vitorias += 1;

                                                                              ganhou = true;

                                                               }

                                               break;

                                               case 1:

                                                               if(this.opcaoComputador == 0)

                                                               {

                                                                              this.vitorias += 1;

                                                                              ganhou = true;

                                                               }

                                                               if(this.opcaoComputador == 2)

                                                               {

                                                                              this.derrotas += 1;

                                                                              ganhou = false;

                                                               }

                                               break;

                                               case 2:

                                                               if(this.opcaoComputador == 0)

                                                               {

                                                                              this.derrotas += 1;

                                                                              ganhou = false;

                                                               }

                                                               if(this.opcaoComputador == 1)

                                                               {

                                                                              this.vitorias += 1;

                                                                              ganhou = true;

                                                               }

                                               break;

                               }

                               if(ganhou == true)

                               {

                                               this.mensagem = "Parabéns, você ganhou!";

                               }

                               else

                               {

                                               if(this.opcaoJogador != this.opcaoComputador)

                                               {

                                                               this.mensagem = "Sinto muito, você perdeu!";

                                               }

                                               else

                                               {

                                                               this.mensagem = "Empate!";

                                               }

                                              

                               }

                }

}