INSERT INTO public."COMPETENCY" ("NAME", "DESCRIPTION", "WEIGHT", "STATE", "CREATED_BY")
VALUES
  ('Planificacion estrategica de metas', 'Define objetivos claros alineados al plan del modulo y estructura metricas para medir el avance.', NULL, 'A', NULL),
  ('Orientacion a resultados', 'Mantiene el foco en el cumplimiento oportuno de los entregables y compromisos asumidos con el equipo.', NULL, 'A', NULL),
  ('Gestion del tiempo', 'Organiza y prioriza actividades para cumplir con los plazos establecidos sin sacrificar la calidad.', NULL, 'A', NULL),
  ('Trabajo en equipo', 'Colabora activamente, comparte informacion y aporta al logro colectivo de los objetivos del modulo.', NULL, 'A', NULL),
  ('Comunicacion efectiva', 'Transmite ideas con claridad, escucha activamente y adapta el mensaje segun la audiencia.', NULL, 'A', NULL),
  ('Servicio al cliente interno/externo', 'Responde con oportunidad y empatia a las necesidades de clientes internos y externos.', NULL, 'A', NULL),
  ('Liderazgo y acompanamiento', 'Motiva al equipo, delega con criterio y brinda retroalimentacion para el desarrollo del talento.', NULL, 'A', NULL),
  ('Pensamiento analitico', 'Interpreta datos y tendencias para sustentar decisiones y proponer acciones correctivas.', NULL, 'A', NULL),
  ('Innovacion y mejora continua', 'Identifica oportunidades de optimizacion en procesos, herramientas y practicas de trabajo.', NULL, 'A', NULL),
  ('Cumplimiento de procesos y politicas', 'Sigue lineamientos establecidos y promueve la estandarizacion de buenas practicas.', NULL, 'A', NULL),
  ('Gestion del cambio', 'Se adapta con rapidez a nuevas prioridades, herramientas o procesos y ayuda al equipo a hacerlo.', NULL, 'A', NULL),
  ('Dominio tecnico/funcional', 'Aplica conocimientos tecnicos o funcionales clave para ejecutar las tareas de su rol con excelencia.', NULL, 'A', NULL),
  ('Gestion de proyectos y tareas', 'Planifica recursos, coordina dependencias y da seguimiento a hitos de proyectos asignados.', NULL, 'A', NULL),
  ('Resolucion de problemas', 'Aborda incidencias con criterio, propone alternativas viables y ejecuta soluciones sostenibles.', NULL, 'A', NULL),
  ('Responsabilidad y compromiso', 'Asume la propiedad de los resultados, cumple acuerdos y mantiene una conducta etica.', NULL, 'A', NULL)
ON CONFLICT ("NAME") DO NOTHING;
