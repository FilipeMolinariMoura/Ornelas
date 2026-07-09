# Área de Membros · Ornellas Barbeiro

Área de membros premium (visagismo, prótese capilar e gestão de barbearia) recriada
em **Next.js 14 (App Router)** a partir do protótipo do Claude Design — fiel ao design original.

## Telas

- **Página inicial** — hero + trilhas "Continue de onde parou" e módulos em carrossel
- **Módulo** — capa, progresso e grade de aulas
- **Player** — vídeo (placeholder), infos da aula e lista de conteúdo do módulo
- **Favoritas** — aulas marcadas com ★
- **Configurações** — dados do membro e preferências

Estado de navegação, favoritos (★) e progresso ("marcar como concluída") funcionam localmente.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o Next.js automaticamente — não precisa configurar nada.
4. Cada `git push` na branch principal gera um novo deploy (CI/CD).

## Stack

- Next.js 14 · React 18
- Fontes: Cinzel + Manrope (via `next/font/google`, sem requisições externas)
- Sem dependências de UI — estilos inline fiéis ao protótipo
