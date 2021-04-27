var canvas;
var contextoDaTela;
var backgroundImage = new Image();
var pirateShip = new Image();
var wrongShot = new Image();
backgroundImage.src = "PlanoDeFundo.png";
pirateShip.src = "NavioDosPiratas.png";
wrongShot.src = "TiroErrado.png";
var jogo = new Jogo();
var ships=
[
	[false,false,false,false],
	[false,false,false,false],
	[false,false,false,false],
	[false,false,false,false]
];
var playerShots=
[
	[false,false,false,false],
	[false,false,false,false],
	[false,false,false,false],
	[false,false,false,false]
];
var colorsOfSpaces=
[
	["white","white","white","white"],
	["white","white","white","white"],
	["white","white","white","white"],
	["white","white","white","white"]
];
var spaces=[20,140,260,380];
var spacesLength=spaces.length;
var numberOfShips=0;
/*alert("Bem vindo ao jogo Batalha Naval!");
alert("Voce encontrou uma ilha com um grande tesouro. E agora voce deve proteger o seu tesouro de piratas que estao chegando em barcos na ilha, e sua arma para mante-los longe, e uma velha catapulta.");*/

function Jogo()
{
	this.maiorPontuacao = 0;
}

function TelaInicial()
{
	contextoDaTela.clearRect(0, 0, canvas.width, canvas.height);
	contextoDaTela.fillText("Maior pontuação", 50, 80);
	contextoDaTela.fillText(jogo.maiorPontuacao, 50, 100);
}


function PrepararJogo()
{
	canvas = document.getElementById("canvas");
	contextoDaTela = canvas.getContext("2d");
	contextoDaTela.save();
	contextoDaTela.font = "40px arial";
	contextoDaTela.fillText("Clique para jogar!", 160, 200);
	canvas.addEventListener("mousedown", ComandosDoMouseInicial);
	contextoDaTela.restore();
	/*initializeVariables();
	updateCanvas();*/
}

function ComandosDoMouseInicial(e)
{
	var mouseX = e.clientX - canvas.getBoundingClientRect().left;
	var mouseY = e.clientY - canvas.getBoundingClientRect().top;
	console.log(mouseX + " / " + mouseY);
	TelaInicial();
}

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
	document.getElementById("gameLog").innerHTML="Número de barcos: "+numberOfShips;
}
 
function updateCanvas()
{
	contextoDaTela.clearRect(0,0,canvas.width,canvas.height);
	contextoDaTela.drawImage(backgroundImage, 0, 0, 500, 500);
	var h=0;
	for(i=0;i<4;i++)
	{
	  for(j=0;j<4;j++)
	  {
		if(colorsOfSpaces[i][j] == "green")
		{
		contextoDaTela.drawImage(pirateShip, spaces[j], spaces[i], 100, 100);
		}
		if(colorsOfSpaces[i][j] == "red")
		{
		contextoDaTela.drawImage(wrongShot, spaces[j], spaces[i], 100, 100);
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
		alert("digite apenas números");
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
			alert("Você já atirou nesse lugar! Tente outra coordenada.");
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
	  document.getElementById("gameLog").innerHTML="Número de barcos: "+numberOfShips;
	}
	else
	{
	  alert("Errou tiro");
	  colorsOfSpaces[line][column]="red";
	}
	updateCanvas();
	if(numberOfShips==0)
	{
	  alert("Parabéns! Você destruiu todos os barcos inimigos.");
	  window.location.reload();
	}
}

 

function help()
{
	alert("Para dar um tiro no espaço desejado, digite as coordenadas linha e coluna, depois clique em atirar. São 4 linhas numeradas de 0 até 3, e 4 colunas numeradas de 0 até 3. ");
}