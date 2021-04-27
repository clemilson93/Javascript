//--------------------OBJETOS----------------------------------------------------------------------------//
var jogador = new Objeto("Jogador", 50, 50, jogadorImg);
jogador.vida = 100;
jogador.InicializarObjeto = function()
{
	jogador.imagem = jogadorImg;
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
	contextoDoCanvasDoCenario.fillText("Texto aparecendo" + jogador.vida, 10, 10);
}