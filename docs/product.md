## 1 - The Problem: 
As empresas de desenvolvimento de software tem dificuldades em manter uma padronização na criação de novos projetos com as configurações e stacks definidas pela companhia, principalmente quando são diversos times de áreas e gestões distintas.
Outro problema que se apresenta é a demora para que sejam criados os recursos, através de chamados e tickets para outras áreas criarem os recursos solicitados. Recursos tais como: banco de dados, repositório arquivos(ex. git), configuração de pipelines e seus webhooks, serviços em cloud entre outros. Em ambiente cloud esse problema é ainda maior, por envolver custo, aprovação de criação de recurso e a criação propriamente dita.
Esse projeto busca desenvolver uma plataforma de desenvolvimento interno (Internal Developer Platform - IDP) opensource.


## 2 - Steakholders and Needs:
Developers: um template que cria o projeto com todas as configurações necessarias do ambiente, repositorio no git criados e com os IaCs dos recursos de cloud prontos e criar os recursos via pela pipeline quando cloud.
SREs: Serviço pronto para ser observado e monitorado.
Infra: Serviço dentro dos padrões definidos por esse time, usando as stacks já contratadas.
FinOps: Controle de custos facil de visualização com os alertas configurados
Devops: Acompanhamento do CI/CD
Cybersecurity: Estar dentro dos padrões de seguranças definidos.
Managers: o Serviço estar dentro dos padrões definidos pela companhia, com qualidade e dentro dos custos.

## 3 - Success criteria:
Criar o serviço de forma automática, dentro dos padrões da companhia com os inputs feito pelos desenvolvedores com as aprovações dos times de Infra, Finops, Cybersecutiry e Managers.

## 4 - Out of scope:
Não deve ter nada gerencial de andamento de projeto, ex. Project.

## 5 - Quality Test:
Gerador de projetos atomáticos, com o minímo de intervenção humana.

## 6 - Others products references:
Fury (Mercado Livre - Meli)
Backstage (Spotyfy)
Humanitec
