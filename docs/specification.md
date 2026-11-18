##1-O usuario irá logar usando o fluxo PKCE do keycloak.
##2-Selecionará um item do menu esquerdo "Criar Projeto"

##3-Após o clique do botão o usuario preenchera o nome do servico, o namespace, o Kubernates(Openshift ou EKS) o endereco do git,  irá selecionar através de uma combo-box qual template de projeto que ele deseja criar (Microservice Spring-Boot, Microservice Spring-Boot Native, Produtor/Consumidor Kafka, Banco Cache Redis, Banco Cache Redis c/ Réplica). Cada um desses item tem um Archetype relacionadoa cada um deles.
##3.1-Após a selecao será gerado o projeto no repositorio git a configuração dele no jenkins

##4- Após essa etapa o usuario irá escolher se existe algum recurso adicionar a ser criado em cloud.
##4.1- caso a resposta seja positiva, será aberto um item onde um recurso adicional será escolhido, listando: Banco de dados , Secret manager.
##4.2- Conforme a escolha será criado um template em um text-box com um iac padrao, onde o usuario irá validar.
##5- um processo de workflow será aberto para aprovar essa solicitacao do desenvolvedor.
##5.1- Após a aprovação de todos na cadeia, na qual foi configurada anteriormente, o motor cria o IAC sobe em um git default, e roda a pipe de criacao.

##6- Deverá ter um item no menu, abaixo do item 2(##2), "Criar Workflow".
6.1 - Qdo clicado abrirá uma tela onde será possivel desenhar um fluxo de aprovação conforme o perfil do usuario.


Todo o processo de criação do item 3.x e 4.x será realizada de forma assincrona através de robos executores, onde o front receberá o status através de SSE, vindas desses robos, com um percentual e qdo finalizar.



