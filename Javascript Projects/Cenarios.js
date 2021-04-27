//--------------------CENARIOS-------------------------------------------------------------------------//
var fase1 = new Cenario("Fase 1", 800, 600);
fase1.InicializarCenario = function()
{
	fase1.planosDeFundo.push(PegarImagem("Plano de fundo"));
	//fase1.objetos.push(jogador);
}
gerenciadorDeCenarios.push(fase1);