# Como colocar as fotos reais do Ornellas nas thumbnails

As thumbnails já vêm com a identidade de marca (fundo escuro dramático + dourado
+ selo ORNELLAS). Para usar **fotos reais** em vez do visual gerado:

1. Salve as imagens (JPG/PNG/WebP) aqui nesta pasta: `public/ornellas/`
   Ex.: `public/ornellas/l11.jpg`

2. No arquivo `app/data.js`, adicione o campo `img` na aula desejada:

   ```js
   { id: "l11", title: "O que é Visagismo masculino", dur: "09:32",
     progress: 100, caption: "retrato · estúdio",
     img: "/ornellas/l11.jpg",   // <-- caminho a partir de /public
     desc: "..." },
   ```

3. Pronto — o card passa a exibir a foto (com uma sobreposição escura para o
   texto continuar legível). Sem o campo `img`, a thumbnail de marca é usada.

> Dica: use imagens em 16:9 (ex. 1280×720) para o melhor enquadramento.
> Não foi possível baixar as fotos do Instagram automaticamente (perfil é
> restrito a login), então basta arrastar os arquivos para cá.
