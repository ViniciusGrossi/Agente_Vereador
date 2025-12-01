# Guia de Deploy na Vercel

Este projeto está configurado para ser implantado facilmente na Vercel. Siga os passos abaixo:

## Pré-requisitos
1.  Uma conta no [GitHub](https://github.com/).
2.  Uma conta na [Vercel](https://vercel.com/).
3.  Git instalado no seu computador.

## Passo 1: Subir o código para o GitHub

1.  Inicialize o repositório (se ainda não fez):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  Crie um novo repositório no GitHub e siga as instruções para enviar o código:
    ```bash
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
    git push -u origin main
    ```

## Passo 2: Conectar com a Vercel

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Importe o repositório do GitHub que você acabou de criar.
4.  A Vercel detectará automaticamente que é um projeto **Vite**.
5.  As configurações de build padrão (`npm run build`) e diretório de saída (`dist`) já estarão corretas.
6.  Clique em **"Deploy"**.

## Passo 3: Verificar o Deploy

Após alguns segundos, a Vercel fornecerá uma URL (ex: `https://seu-projeto.vercel.app`). Acesse essa URL para ver seu dashboard funcionando online!

## Notas
-   O arquivo `vercel.json` incluído no projeto garante que o roteamento funcione corretamente (caso você adicione rotas no futuro).
-   Se precisar configurar variáveis de ambiente, faça isso nas configurações do projeto na Vercel (Settings -> Environment Variables).
