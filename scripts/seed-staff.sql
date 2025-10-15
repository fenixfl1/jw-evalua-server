INSERT INTO public."STAFF" (
  "NAME",
  "LAST_NAME",
  "EMAIL",
  "BIRTH_DATE",
  "PHONE",
  "GENDER",
  "IDENTITY_DOCUMENT",
  "ADDRESS",
  "STATE"
)
VALUES
  ('Laura', 'Gomez', 'laura.gomez.seed@example.com', '1991-02-18', '8095551200', 'F', '10123456780', 'Calle 27 de Febrero 120, Santo Domingo', 'A'),
  ('Miguel', 'Ramirez', 'miguel.ramirez.seed@example.com', '1988-07-05', '8295554501', 'M', '10123456781', 'Av. Maximo Gomez 45, Santo Domingo', 'A'),
  ('Daniela', 'Lopez', 'daniela.lopez.seed@example.com', '1993-11-22', '8495553321', 'F', '10123456782', 'Calle Duarte 233, Santiago', 'A'),
  ('Oscar', 'Torres', 'oscar.torres.seed@example.com', '1985-03-14', '8295557744', 'M', '10123456783', 'Carretera Mella Km 8, Santo Domingo Este', 'A'),
  ('Camila', 'Fernandez', 'camila.fernandez.seed@example.com', '1995-09-17', '8095556655', 'F', '10123456784', 'Residencial Los Laureles, La Vega', 'A'),
  ('Andres', 'Martinez', 'andres.martinez.seed@example.com', '1989-01-09', '8495558899', 'M', '10123456785', 'Urbanizacion Real, San Cristobal', 'A'),
  ('Sofia', 'Herrera', 'sofia.herrera.seed@example.com', '1994-06-28', '8295559080', 'F', '10123456786', 'Colinas del Norte, Santo Domingo Norte', 'A'),
  ('Rafael', 'Nunez', 'rafael.nunez.seed@example.com', '1987-12-03', '8095554123', 'M', '10123456787', 'Av. Juan Pablo Duarte 88, Santiago', 'A'),
  ('Valentina', 'Paredes', 'valentina.paredes.seed@example.com', '1992-04-11', '8295556402', 'F', '10123456788', 'Residencial Las Carmelitas, Santo Domingo Oeste', 'A'),
  ('Hector', 'Santos', 'hector.santos.seed@example.com', '1986-08-26', '8495557012', 'M', '10123456789', 'Calle Libertad 56, San Pedro de Macoris', 'A')
ON CONFLICT ("EMAIL") DO NOTHING;
