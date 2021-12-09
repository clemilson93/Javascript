var traseiraDaCarta = new Image();
traseiraDaCarta.src = "./Imagens/traseiraDaCarta.png";
function criarCarta(_nome, _posicaoX, _posicaoY){
    var carta = [];
    carta.nome = _nome;
    carta.imagem = new Image();
    carta.face = new Image();
    carta.face.src = "./Imagens/"+_nome+".png";
    carta.posicaoX = _posicaoX;
    carta.posicaoY = _posicaoY;
    carta.altura = 96;
    carta.largura = 64;
    carta.facePraCima = false;
    carta.clique = "";
    carta.ativo = true;
    carta.inicializar = function(){
        this.imagem = traseiraDaCarta;
        this.clique = criarComponenteClique(this);
        jogo.objetosClicaveis.push(this.clique);
        jogo.objetosDoJogo.push(this);
    };
    carta.atualizar = function(_contextoDaTela){
        _contextoDaTela.drawImage(this.imagem, this.posicaoX, this.posicaoY);
    };
    carta.acao = function(){
        if(this.ativo){
            if(this.facePraCima){
                this.imagem = traseiraDaCarta;
                this.facePraCima = false;
            }
            else{
                this.imagem = carta.face;
                this.facePraCima = true;
                this.clique.ativo = false;
                jogo.cartasPraComparar.push(this);
            }
        }
    };
    return carta;
};

function criarComponenteClique(_objeto){
    var clique = [];
    clique.ativo = true;
    clique.verificar = function(_evento){
        if(_evento.offsetX >=_objeto.posicaoX && _evento.offsetX <= (_objeto.posicaoX + _objeto.imagem.width) && _evento.offsetY >=_objeto.posicaoY && _evento.offsetY <= (_objeto.posicaoY + _objeto.imagem.height)){
            if(clique.ativo){
                _objeto.acao();
            }
        }
    };
    return clique;
}

const tela = {
    canvas:"",
    atualizador : "",
    fps : 30/1000,
    inicializar(){
        this.canvas = document.getElementById("canvas");
        this.canvas.addEventListener("click", this.notificarClique);
        this.atualizador = setInterval(this.notificarAtualizacao, this.fps, this.canvas.getContext("2d"));
    },
    reinicializarAtualizador(){
        this.atualizador = setInterval(this.notificarAtualizacao, this.fps, this.canvas.getContext("2d"));
    },
    pararAtualizador(){
        clearInterval(this.atualizador);        
    },
    notificarClique(_evento){
        jogo.notificarClique(_evento);
    },
    notificarAtualizacao(_contextoDaTela){
        jogo.notificarAtualizacao(_contextoDaTela);
    }
};

const mesa = {
    baralho : [],
    inicializar(){
        this.baralho.push(criarCarta("MACA", 10, 10));
        this.baralho.push(criarCarta("MACA", 10, 10));
        this.baralho.push(criarCarta("BANANA", 10, 10));
        this.baralho.push(criarCarta("BANANA", 10, 10));
        this.baralho.push(criarCarta("LARANJA", 10, 10));
        this.baralho.push(criarCarta("LARANJA", 10, 10));
        this.baralho.push(criarCarta("KIWI", 10, 10));
        this.baralho.push(criarCarta("KIWI", 10, 10));
        this.baralho.push(criarCarta("LIMAO", 10, 10));
        this.baralho.push(criarCarta("LIMAO", 10, 10));
        this.baralho.push(criarCarta("CEREJA", 10, 10));
        this.baralho.push(criarCarta("CEREJA", 10, 10));
        this.baralho.push(criarCarta("MORANGO", 10, 10));
        this.baralho.push(criarCarta("MORANGO", 10, 10));
        this.baralho.push(criarCarta("PERA", 10, 10));
        this.baralho.push(criarCarta("PERA", 10, 10));
        var i, adicionalX = 20, adicionalY = 100;
        for(i = 0; i < this.baralho.length; i++){
            this.baralho[i].inicializar();
        }
        for(i = 0; this.baralho.length > 0; i++, adicionalX += 74){
            var aleatorio = Math.floor(Math.random() * this.baralho.length);
            if(adicionalX >= 20 + 74 * 4){
                adicionalX = 20;
                adicionalY += 106;
            }
            this.baralho[aleatorio].posicaoX = adicionalX;
            this.baralho[aleatorio].posicaoY = adicionalY;
            this.baralho.splice(aleatorio, 1);
        }
        jogo.objetosDoJogo.push(this);
    },
    atualizar(_contextoDaTela){

    }
};

const jogo = {
    objetosClicaveis : [],
    objetosDoJogo : [],
    cartasPraComparar : [],
    tempoDeEspera : -1,
    pares : 0,
    atualizadorDoTempoDeEspera : "",
    inicializar(){
        tela.inicializar();
        mesa.inicializar();
    },
    notificarAtualizacao(_contextoDaTela){
        _contextoDaTela.clearRect(0, 0, tela.canvas.width, tela.canvas.height);
        _contextoDaTela.font = "40px Georgia";
        _contextoDaTela.fillText("Jogo da memoria", 20, 60);
        var i;
        for(i = 0; i < this.objetosDoJogo.length; i++){
            if(this.objetosDoJogo[i].ativo == true){
                this.objetosDoJogo[i].atualizar(_contextoDaTela);
            }
        };
        if(this.cartasPraComparar.length == 2){
            tempoDeEspera = 0;
            this.atualizadorDoTempoDeEspera = setInterval(function(){
                jogo.tempoDeEspera++;
                if(jogo.tempoDeEspera == 1){
                    if(jogo.cartasPraComparar[0].nome != jogo.cartasPraComparar[1].nome){
                        jogo.cartasPraComparar[0].clique.ativo = true;
                        jogo.cartasPraComparar[0].acao();
                        jogo.cartasPraComparar[1].clique.ativo = true;
                        jogo.cartasPraComparar[1].acao();
                    }
                    else{
                        jogo.pares++;
                        if(jogo.pares == 8){
                            alert("Fim de jogo!");
                            location.reload();
                        }
                    }
                    jogo.cartasPraComparar.splice(0, 2);
                    jogo.tempoDeEspera = -1;
                    clearInterval(jogo.atualizadorDoTempoDeEspera);
                    tela.reinicializarAtualizador();
                }
            }, 1000);
            tela.pararAtualizador();
        }
    },
    notificarClique(_evento){
        var i;
        if(this.tempoDeEspera < 0){
            for(i = 0; i < this.objetosClicaveis.length; i++){
                this.objetosClicaveis[i].verificar(_evento);
            };
        }
    }
};