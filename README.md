# 🐻 Agenda Escolar – Maple Bear Big Bears

## ⚠️ Configuração obrigatória no Vercel

Para o site atualizar automaticamente quando você editar os arquivos, o Vercel precisa estar configurado corretamente:

**Settings → General → Root Directory → deve estar VAZIO**

Se tiver `agenda-final` ou qualquer pasta no Root Directory, o Vercel não detecta mudanças nos `.txt` e não rebuilda.

---

## Estrutura

```
/ (raiz do repositório)
├── src/
│   ├── data/
│   │   ├── aulas.txt        ← EDITE para atualizar as aulas
│   │   └── comunicados.txt  ← EDITE para atualizar os comunicados
│   ├── tarefas.js           ← EDITE para gerenciar tarefas
│   ├── App.jsx
│   ├── parseData.js
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Corrigir Root Directory no Vercel

1. Vercel → seu projeto → **Settings → General**
2. **Root Directory** → apague o valor atual → clique em **Save**
3. **Deployments** → clique nos 3 pontinhos (⋯) do último deploy → **Redeploy**
4. Aguarde ~1 minuto → site atualizado ✅

## Acessos

| Usuário | Senha | Perfil |
|---|---|---|
| `responsavel` | `mateus2026` | Família Larocca |
| `admin` | `escola2026` | Coordenação |
