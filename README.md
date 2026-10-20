# Exercices & Annales (Next.js + Supabase, PWA)

## Lancer
1. `npm install`
2. Copier `.env.local.example` en `.env.local` et remplir l'URL + la clé **anon** (Supabase > Project Settings > API)
3. Exécuter dans Supabase (SQL Editor) `supabase/03_patch_sessions_prof.sql` (permet au prof de créer les années d'annales)
4. `npm run dev` puis ouvrir http://localhost:3000

## Déployer sur Vercel
Importer le dépôt, ajouter les 2 variables d'environnement, déployer. Ne jamais mettre la clé `service_role` dans l'appli.

## Pages
- Élèves : `/`, `/niveau/[college|lycee]`, `/parcours/[classe]`, `/parcours/[classe]/[matiere]`, `/lecon/[id]`, `/annales/[bfem|bac]/[matiere]`
- Admin : `/admin/login`, `/admin/exercices` (prof + dev), `/admin/annales` (prof + dev), `/admin/catalogue` (dev uniquement)
