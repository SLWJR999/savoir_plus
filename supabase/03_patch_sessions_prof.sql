-- Permet au professeur de créer/modifier les sessions d'examen (année + session).
-- Sans ce patch, seul le développeur peut les créer (policy "dev gère les sessions examen").
create policy "staff ajoute les sessions" on public.exam_sessions
  for insert to authenticated with check (public.is_staff());
create policy "staff modifie les sessions" on public.exam_sessions
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
