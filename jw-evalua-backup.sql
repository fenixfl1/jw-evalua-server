--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-01 20:29:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS "jw-evalua";
--
-- TOC entry 5033 (class 1262 OID 83451)
-- Name: jw-evalua; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "jw-evalua" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE "jw-evalua" OWNER TO postgres;

\encoding SQL_ASCII
\connect -reuse-previous=on "dbname='jw-evalua'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 84687)
-- Name: ACTION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ACTION" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "ACTION_ID" integer NOT NULL,
    "NAME" character varying(255) NOT NULL,
    "DESCRIPTION" character varying(255)
);


ALTER TABLE public."ACTION" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 84686)
-- Name: ACTION_ACTION_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ACTION_ACTION_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ACTION_ACTION_ID_seq" OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 228
-- Name: ACTION_ACTION_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ACTION_ACTION_ID_seq" OWNED BY public."ACTION"."ACTION_ID";


--
-- TOC entry 233 (class 1259 OID 84814)
-- Name: BUSINESS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BUSINESS" (
    "BUSINESS_ID" integer NOT NULL,
    "NAME" character varying NOT NULL,
    "LOGO" bytea NOT NULL,
    "RNC" character varying NOT NULL,
    "PHONE" character varying NOT NULL,
    "ADDRESS" text NOT NULL,
    "STATE" character(1) NOT NULL
);


ALTER TABLE public."BUSINESS" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 84872)
-- Name: DEPARTMENT; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DEPARTMENT" (
    "DEPARTMENT_ID" integer NOT NULL,
    "NAME" character varying(50) NOT NULL,
    "DESCRIPTION" character varying(100),
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL
);


ALTER TABLE public."DEPARTMENT" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 84871)
-- Name: DEPARTMENT_DEPARTMENT_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DEPARTMENT_DEPARTMENT_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DEPARTMENT_DEPARTMENT_ID_seq" OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 235
-- Name: DEPARTMENT_DEPARTMENT_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DEPARTMENT_DEPARTMENT_ID_seq" OWNED BY public."DEPARTMENT"."DEPARTMENT_ID";


--
-- TOC entry 226 (class 1259 OID 84367)
-- Name: MENU_OPTION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MENU_OPTION" (
    "MENU_OPTION_ID" character varying(50) NOT NULL,
    "NAME" character varying(100) NOT NULL,
    "DESCRIPTION" character varying(250),
    "PATH" character varying(100),
    "ICON" text,
    "ORDER" integer NOT NULL,
    "PARENT_ID" character varying,
    "TYPE" public."MENU_OPTION_type_enum",
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL
);


ALTER TABLE public."MENU_OPTION" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 84821)
-- Name: MENU_OPTIONS_X_ROLES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MENU_OPTIONS_X_ROLES" (
    "MENU_OPTION_ID" character varying(50) NOT NULL,
    "ROLE_ID" integer NOT NULL
);


ALTER TABLE public."MENU_OPTIONS_X_ROLES" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 84698)
-- Name: PERMISSION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PERMISSION" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "PERMISSION_ID" integer NOT NULL,
    "DESCRIPTION" character varying(255),
    "MENU_OPTION_ID" character varying(50),
    "ACTION_ID" integer
);


ALTER TABLE public."PERMISSION" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 84697)
-- Name: PERMISSION_PERMISSION_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PERMISSION_PERMISSION_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PERMISSION_PERMISSION_ID_seq" OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 230
-- Name: PERMISSION_PERMISSION_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PERMISSION_PERMISSION_ID_seq" OWNED BY public."PERMISSION"."PERMISSION_ID";


--
-- TOC entry 232 (class 1259 OID 84773)
-- Name: PERMISSION_X_ROLE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PERMISSION_X_ROLE" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "PERMISSION_ID" integer NOT NULL,
    "ROLE_ID" integer NOT NULL
);


ALTER TABLE public."PERMISSION_X_ROLE" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 84304)
-- Name: ROLE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ROLE" (
    "ROLE_ID" integer NOT NULL,
    "NAME" character varying(30) NOT NULL,
    "DESCRIPTION" character varying(250) NOT NULL,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL
);


ALTER TABLE public."ROLE" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 84319)
-- Name: ROLES_X_USER; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ROLES_X_USER" (
    "USER_ID" integer NOT NULL,
    "ROLE_ID" integer NOT NULL,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL
);


ALTER TABLE public."ROLES_X_USER" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 84303)
-- Name: ROLE_ROLE_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ROLE_ROLE_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ROLE_ROLE_ID_seq" OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 223
-- Name: ROLE_ROLE_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ROLE_ROLE_ID_seq" OWNED BY public."ROLE"."ROLE_ID";


--
-- TOC entry 222 (class 1259 OID 84284)
-- Name: STAFF; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."STAFF" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "STAFF_ID" integer NOT NULL,
    "NAME" character varying NOT NULL,
    "LAST_NAME" character varying NOT NULL,
    "EMAIL" character varying NOT NULL,
    "BIRTH_DATA" date NOT NULL,
    "PHONE" character varying NOT NULL,
    "GENDER" character(1) NOT NULL,
    "IDENTITY_DOCUMENT" character varying(11) NOT NULL,
    "ADDRESS" text NOT NULL,
    "DEPARTMENT_ID" integer
);


ALTER TABLE public."STAFF" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 84515)
-- Name: STAFF_STAFF_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."STAFF_STAFF_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."STAFF_STAFF_ID_seq" OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 227
-- Name: STAFF_STAFF_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."STAFF_STAFF_ID_seq" OWNED BY public."STAFF"."STAFF_ID";


--
-- TOC entry 221 (class 1259 OID 84274)
-- Name: USERS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USERS" (
    "USER_ID" integer NOT NULL,
    "USERNAME" character varying(25) NOT NULL,
    "PASSWORD" character varying NOT NULL,
    "LOGIN_COUNT" character varying,
    "LAST_LOGIN" timestamp without time zone,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "STAFF_ID" integer NOT NULL,
    "IS_ACTIVE" boolean NOT NULL,
    "AVATAR" text
);


ALTER TABLE public."USERS" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 84273)
-- Name: USERS_USER_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."USERS_USER_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."USERS_USER_ID_seq" OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 220
-- Name: USERS_USER_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."USERS_USER_ID_seq" OWNED BY public."USERS"."USER_ID";


--
-- TOC entry 219 (class 1259 OID 83733)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 83732)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 218
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 4805 (class 2604 OID 84692)
-- Name: ACTION ACTION_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTION" ALTER COLUMN "ACTION_ID" SET DEFAULT nextval('public."ACTION_ACTION_ID_seq"'::regclass);


--
-- TOC entry 4811 (class 2604 OID 84875)
-- Name: DEPARTMENT DEPARTMENT_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT" ALTER COLUMN "DEPARTMENT_ID" SET DEFAULT nextval('public."DEPARTMENT_DEPARTMENT_ID_seq"'::regclass);


--
-- TOC entry 4808 (class 2604 OID 84703)
-- Name: PERMISSION PERMISSION_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION" ALTER COLUMN "PERMISSION_ID" SET DEFAULT nextval('public."PERMISSION_PERMISSION_ID_seq"'::regclass);


--
-- TOC entry 4796 (class 2604 OID 84309)
-- Name: ROLE ROLE_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE" ALTER COLUMN "ROLE_ID" SET DEFAULT nextval('public."ROLE_ROLE_ID_seq"'::regclass);


--
-- TOC entry 4795 (class 2604 OID 84516)
-- Name: STAFF STAFF_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF" ALTER COLUMN "STAFF_ID" SET DEFAULT nextval('public."STAFF_STAFF_ID_seq"'::regclass);


--
-- TOC entry 4790 (class 2604 OID 84277)
-- Name: USERS USER_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS" ALTER COLUMN "USER_ID" SET DEFAULT nextval('public."USERS_USER_ID_seq"'::regclass);


--
-- TOC entry 4789 (class 2604 OID 83736)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 5020 (class 0 OID 84687)
-- Dependencies: 229
-- Data for Name: ACTION; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 1, 'view', 'Ver o listar registros');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 2, 'create', 'Crear nuevos registros');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 3, 'update', 'Actualizar registros existentes');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 4, 'delete', 'Eliminar registros');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 5, 'export', 'Exportar datos');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 6, 'approve', 'Aprobar operaciones o flujos');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 7, 'reject', 'Rechazar operaciones o flujos');
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION") VALUES ('2025-08-01 00:51:14.472359', 8, 'A', 8, 'assign', 'Asignar recursos o roles');


--
-- TOC entry 5024 (class 0 OID 84814)
-- Dependencies: 233
-- Data for Name: BUSINESS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5027 (class 0 OID 84872)
-- Dependencies: 236
-- Data for Name: DEPARTMENT; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5017 (class 0 OID 84367)
-- Dependencies: 226
-- Data for Name: MENU_OPTION; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-2', 'Gestión de usuarios', 'Administración de usuarios y roles', NULL, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-cog-icon lucide-user-round-cog"><path d="m14.305 19.53.923-.382"/><path d="m15.228 16.852-.923-.383"/><path d="m16.852 15.228-.383-.923"/><path d="m16.852 20.772-.383.924"/><path d="m19.148 15.228.383-.923"/><path d="m19.53 21.696-.382-.924"/><path d="M2 21a8 8 0 0 1 10.434-7.62"/><path d="m20.772 16.852.924-.383"/><path d="m20.772 19.148.924.383"/><circle cx="10" cy="8" r="5"/><circle cx="18" cy="18" r="3"/></svg>', 2, NULL, 'group', '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-2-1', 'Roles', 'Listado de roles', '/0-2-1/roles', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-lock" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
  <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
</svg>', 4, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-2-2', 'Usuarios', 'Listado de usuarios', '/0-2-2/users', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
</svg>', 3, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-4', 'Gestion de empleados', '-----', NULL, NULL, 4, NULL, 'group', '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-1', 'Dashboard', 'Vista principal del sistema', '/0-1/dashboard', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer2" viewBox="0 0 16 16">
  <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
  <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"/>
</svg>', 1, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-5', 'Gestion de Empleados', 'Listado de empleados', NULL, '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-contact-round-icon lucide-contact-round"><path d="M16 2v2"/><path d="M17.915 22a6 6 0 0 0-12 0"/><path d="M8 2v2"/><circle cx="12" cy="12" r="4"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>', 4, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'I');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-5-2', 'Evaluaciones', 'Evaluación de empleados', '/0-5-2/evaluation', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-rolodex" viewBox="0 0 16 16">
  <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
  <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1z"/>
</svg>', 6, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-5-3', 'Equipos', 'Equipos de trabajo', '/0-5-3/work_teams', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
</svg>', 7, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-5-4', 'Metas', 'Metas por equipos', '/0-5-4/goals', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-data" viewBox="0 0 16 16">
  <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z"/>
  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
</svg>', 8, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."MENU_OPTION" ("MENU_OPTION_ID", "NAME", "DESCRIPTION", "PATH", "ICON", "ORDER", "PARENT_ID", "TYPE", "CREATED_AT", "CREATED_BY", "STATE") VALUES ('0-5-1', 'Empleados', 'Lista de empleados', '/0-5-1/employees', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5"/>
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
</svg>', 5, NULL, NULL, '2025-07-31 19:51:24.800755', NULL, 'A');


--
-- TOC entry 5025 (class 0 OID 84821)
-- Dependencies: 234
-- Data for Name: MENU_OPTIONS_X_ROLES; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5022 (class 0 OID 84698)
-- Dependencies: 231
-- Data for Name: PERMISSION; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 101, 'Ver roles', '0-2-1', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 102, 'Crear roles', '0-2-1', 2);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 103, 'Editar roles', '0-2-1', 3);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 104, 'Eliminar roles', '0-2-1', 4);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 105, 'Ver usuarios', '0-2-2', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 106, 'Crear usuarios', '0-2-2', 2);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 107, 'Editar usuarios', '0-2-2', 3);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 108, 'Eliminar usuarios', '0-2-2', 4);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 109, 'Ver empleados', '0-5-1', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 110, 'Crear empleados', '0-5-1', 2);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 111, 'Editar empleados', '0-5-1', 3);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 112, 'Eliminar empleados', '0-5-1', 4);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 113, 'Ver evaluaciones', '0-5-2', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 114, 'Ver equipos', '0-5-3', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 115, 'Ver metas', '0-5-4', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 11:06:22', 8, 'A', 1, 'ver', '0-1', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 11:08:00', 8, 'A', 2, 'VIEW', '0-2', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 11:08:54', 8, 'A', 4, 'VIEW', '0-4', 1);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "MENU_OPTION_ID", "ACTION_ID") VALUES ('2025-08-01 11:09:22', 8, 'A', 5, 'VIEW', '0-5', 1);


--
-- TOC entry 5023 (class 0 OID 84773)
-- Dependencies: 232
-- Data for Name: PERMISSION_X_ROLE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 101, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 102, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 103, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 104, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 105, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 106, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 107, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 108, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 109, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 110, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 111, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 112, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 113, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 114, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 00:57:50.474694', 8, 'A', 115, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 11:10:11', 8, 'A', 1, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 11:10:26', 8, 'A', 2, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 11:10:35', 8, 'A', 4, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 11:11:10', 8, 'A', 5, 1);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 101, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 102, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 103, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 104, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 105, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 106, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 107, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 108, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 109, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 110, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 111, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 112, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 113, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 114, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 115, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 1, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 2, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 4, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 12:00:42.657', 8, 'A', 5, 2);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 109, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 110, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 111, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 112, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 113, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 114, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 115, 4);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID") VALUES ('2025-08-01 20:21:52.134', 8, 'A', 1, 4);


--
-- TOC entry 5015 (class 0 OID 84304)
-- Dependencies: 224
-- Data for Name: ROLE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (1, 'Admin', 'Rol de administradr', '2025-07-31 19:50:37.343746', NULL, 'A');
INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (2, 'Supervisor', 'Rol para empleados que tiene resposabilidad de supervisar a otros', '2025-08-01 12:00:42.657', 8, 'A');
INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (4, 'Coordinador', 'Coordina los equipos de trabajo y las metas', '2025-08-01 20:21:52.134', 8, 'A');


--
-- TOC entry 5016 (class 0 OID 84319)
-- Dependencies: 225
-- Data for Name: ROLES_X_USER; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE") VALUES (8, 1, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE") VALUES (14, 1, '2025-07-31 19:51:24.800755', NULL, 'A');
INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE") VALUES (15, 1, '2025-07-31 19:51:24.800755', NULL, 'A');


--
-- TOC entry 5013 (class 0 OID 84284)
-- Dependencies: 222
-- Data for Name: STAFF; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-17 08:16:53.374', NULL, 'A', 1, 'Juan', 'Pérez', 'juan.perez@example.com', '1990-05-19', '8091234567', 'M', '00123456789', 'Calle 10, Santo Domingo, RD', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-17 11:26:24.773', 8, 'A', 2, 'Pedro', 'Santana', 'pedro.santana@example.com', '1990-05-19', '8091234561', 'M', '00123456788', 'Calle 10, Santo Domingo, RD', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-17 11:27:14.435', 8, 'A', 3, 'Mario', 'Cruz', 'mario.cruz@example.com', '1990-05-19', '8091234512', 'M', '00123456208', 'Calle 10, Santo Domingo, RD', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-29 16:14:40.694', 8, 'A', 4, 'Miguel', 'Concepción', 'miguel.concepcion@gmail.com', '1998-07-16', '8496634545', 'M', '40235979996', 'n/a', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-29 16:19:38.612', 8, 'A', 5, 'Hector ', 'Coste', 'user@example.com', '2001-07-03', '8099967874', 'M', '47896587963', 'n.a', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-29 16:25:50.316', 8, 'A', 6, 'Alfredo', 'Pérez', 'alfredo@example.com', '2003-07-02', '8096635658', 'M', '04789969893', 'Las Carolinas, La vega', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATA", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "DEPARTMENT_ID") VALUES ('2025-07-29 20:23:19.373', 8, 'A', 7, 'Andrea', 'Martinez', 'andrea@user.com', '2000-06-28', '8496357896', 'F', '40295697896', 'n/a', NULL);


--
-- TOC entry 5012 (class 0 OID 84274)
-- Dependencies: 221
-- Data for Name: USERS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (8, 'admin', '$2b$10$QTQQt.zKKGaYIUxa66lDOe9JrdXzdUuCRztfm/wjuM/jTwK/3yJdm', NULL, NULL, '2025-07-17 11:06:00.1', NULL, 'A', 1, true, 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png');
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (9, 'psantana', '$2b$10$IwmioyUyM9NRic/2chxeKOzjja.Af5OTMIiU43RrQHtLLwMpaH.iO', NULL, NULL, '2025-07-29 18:46:40.385', 8, 'A', 2, true, 'https://tse4.mm.bing.net/th/id/OIP.9_MptOLxjJEGSGukPt9FWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3');
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (10, 'mcruz', '$2b$10$KhsFcocLDu4DVMcoNglTGOSIQnN5nb1vRIPmMlOTd9cuo4F5RoCxu', NULL, NULL, '2025-07-29 19:40:41.047', 8, 'A', 3, true, NULL);
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (12, 'afperez', '$2b$10$u0oZBoikzSsV512CkpAVAeBRa20pEuvj.5VJrRLeI.LkoDmpco9je', NULL, NULL, '2025-07-29 19:45:46.327', 8, 'A', 6, true, NULL);
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (14, 'hcoste', '$2b$10$RHcFRzA26QJBgvf7ATDakOs5QDcu7gE/6dUKh/Lp/dUcMoffSToC.', NULL, NULL, '2025-07-29 19:50:24.74', 8, 'A', 5, true, NULL);
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD", "LOGIN_COUNT", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "IS_ACTIVE", "AVATAR") VALUES (15, 'mconcepcion', '$2b$10$.VtBrJE5FqNwTvBqvDM2yekwBP7avktNiYvLwz5obrIwzRXS5SeWW', NULL, NULL, '2025-07-29 20:13:36.92', 8, 'A', 4, true, NULL);


--
-- TOC entry 5010 (class 0 OID 83733)
-- Dependencies: 219
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.migrations (id, "timestamp", name) VALUES (1, 1752662128871, 'PostRefactoring1752662128871');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (2, 1752662474818, 'Migration1752662474818');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (3, 1752662589994, 'Migration1752662589994');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (4, 1752662811596, 'Migration1752662811596');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (5, 1752662879313, 'Migration1752662879313');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (6, 1752663355604, 'Migration1752663355604');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (7, 1752712403947, 'Migration1752712403947');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (8, 1752713181923, 'Migration1752713181923');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (9, 1752750020987, 'Migration1752750020987');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (10, 1752765707976, 'Migration1752765707976');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (11, 1752765601639, 'Migration1752765601639');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (12, 1753064203213, 'Migration1753064203213');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (13, 1754004212601, 'Migration1754004212601');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (14, 1754004439077, 'Migration1754004439077');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (15, 1754004765834, 'Migration1754004765834');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (16, 1754005667936, 'Migration1754005667936');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (17, 1754005808933, 'Migration1754005808933');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (18, 1754005855770, 'Migration1754005855770');


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 228
-- Name: ACTION_ACTION_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ACTION_ACTION_ID_seq"', 1, false);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 235
-- Name: DEPARTMENT_DEPARTMENT_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DEPARTMENT_DEPARTMENT_ID_seq"', 1, false);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 230
-- Name: PERMISSION_PERMISSION_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PERMISSION_PERMISSION_ID_seq"', 5, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 223
-- Name: ROLE_ROLE_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ROLE_ROLE_ID_seq"', 4, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 227
-- Name: STAFF_STAFF_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."STAFF_STAFF_ID_seq"', 7, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 220
-- Name: USERS_USER_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."USERS_USER_ID_seq"', 15, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 218
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 18, true);


--
-- TOC entry 4841 (class 2606 OID 84825)
-- Name: MENU_OPTIONS_X_ROLES PK_1f6674a97c67f5297c5d3b5997f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTIONS_X_ROLES"
    ADD CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID");


--
-- TOC entry 4821 (class 2606 OID 84311)
-- Name: ROLE PK_2464e6137ccbd5f89724b83282e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "PK_2464e6137ccbd5f89724b83282e" PRIMARY KEY ("ROLE_ID");


--
-- TOC entry 4827 (class 2606 OID 84325)
-- Name: ROLES_X_USER PK_27488ae7e50440d4a06b585798b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "PK_27488ae7e50440d4a06b585798b" PRIMARY KEY ("USER_ID", "ROLE_ID");


--
-- TOC entry 4833 (class 2606 OID 84705)
-- Name: PERMISSION PK_7efad0105d237300cbd89505d3d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION"
    ADD CONSTRAINT "PK_7efad0105d237300cbd89505d3d" PRIMARY KEY ("PERMISSION_ID");


--
-- TOC entry 4837 (class 2606 OID 84820)
-- Name: BUSINESS PK_8726e67e668478ef7d1aedd6a0e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BUSINESS"
    ADD CONSTRAINT "PK_8726e67e668478ef7d1aedd6a0e" PRIMARY KEY ("BUSINESS_ID");


--
-- TOC entry 4815 (class 2606 OID 83740)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 4819 (class 2606 OID 84292)
-- Name: STAFF PK_9d3026d6816040c56533cfd122e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "PK_9d3026d6816040c56533cfd122e" PRIMARY KEY ("STAFF_ID");


--
-- TOC entry 4835 (class 2606 OID 84779)
-- Name: PERMISSION_X_ROLE PK_aba3c897a024c6ba7edf7a47da3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "PK_aba3c897a024c6ba7edf7a47da3" PRIMARY KEY ("PERMISSION_ID", "ROLE_ID");


--
-- TOC entry 4843 (class 2606 OID 84879)
-- Name: DEPARTMENT PK_b3142394ad5073f4a21ef3df9c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT"
    ADD CONSTRAINT "PK_b3142394ad5073f4a21ef3df9c4" PRIMARY KEY ("DEPARTMENT_ID");


--
-- TOC entry 4829 (class 2606 OID 84375)
-- Name: MENU_OPTION PK_c33923d6f156b267e8e4dfe59c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTION"
    ADD CONSTRAINT "PK_c33923d6f156b267e8e4dfe59c3" PRIMARY KEY ("MENU_OPTION_ID");


--
-- TOC entry 4831 (class 2606 OID 84696)
-- Name: ACTION PK_dfc4a3ad12020abd40ef5d092ac; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTION"
    ADD CONSTRAINT "PK_dfc4a3ad12020abd40ef5d092ac" PRIMARY KEY ("ACTION_ID");


--
-- TOC entry 4817 (class 2606 OID 84283)
-- Name: USERS PK_f37d934f4f6abb757dce91ce6f2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "PK_f37d934f4f6abb757dce91ce6f2" PRIMARY KEY ("USER_ID");


--
-- TOC entry 4823 (class 2606 OID 84313)
-- Name: ROLE UQ_cfcd3a13b39580bf95cd2ef1b1f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "UQ_cfcd3a13b39580bf95cd2ef1b1f" UNIQUE ("NAME");


--
-- TOC entry 4838 (class 1259 OID 84827)
-- Name: IDX_2c7ac3fef525331bd30141dafb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON public."MENU_OPTIONS_X_ROLES" USING btree ("ROLE_ID");


--
-- TOC entry 4824 (class 1259 OID 84939)
-- Name: IDX_6014c0ac471a029270386464b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6014c0ac471a029270386464b0" ON public."ROLES_X_USER" USING btree ("USER_ID");


--
-- TOC entry 4825 (class 1259 OID 84940)
-- Name: IDX_cfb5ba942f33086e54cec02624; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cfb5ba942f33086e54cec02624" ON public."ROLES_X_USER" USING btree ("ROLE_ID");


--
-- TOC entry 4839 (class 1259 OID 84826)
-- Name: IDX_d3bd9bead05f4d2521b2ffe1a8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON public."MENU_OPTIONS_X_ROLES" USING btree ("MENU_OPTION_ID");


--
-- TOC entry 4852 (class 2606 OID 84941)
-- Name: MENU_OPTION FK_19bed68461b29c412f1aa9a9cfe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTION"
    ADD CONSTRAINT "FK_19bed68461b29c412f1aa9a9cfe" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4853 (class 2606 OID 84717)
-- Name: MENU_OPTION FK_1f20d78a9ea67f0564538ea95f7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTION"
    ADD CONSTRAINT "FK_1f20d78a9ea67f0564538ea95f7" FOREIGN KEY ("PARENT_ID") REFERENCES public."MENU_OPTION"("MENU_OPTION_ID");


--
-- TOC entry 4858 (class 2606 OID 84804)
-- Name: PERMISSION_X_ROLE FK_24cb3d11068904d9544b5add23b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "FK_24cb3d11068904d9544b5add23b" FOREIGN KEY ("PERMISSION_ID") REFERENCES public."PERMISSION"("PERMISSION_ID");


--
-- TOC entry 4861 (class 2606 OID 84866)
-- Name: MENU_OPTIONS_X_ROLES FK_2c7ac3fef525331bd30141dafb7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTIONS_X_ROLES"
    ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 4855 (class 2606 OID 84732)
-- Name: PERMISSION FK_3c9b3cee370052f5bba1d4805af; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION"
    ADD CONSTRAINT "FK_3c9b3cee370052f5bba1d4805af" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES public."MENU_OPTION"("MENU_OPTION_ID");


--
-- TOC entry 4856 (class 2606 OID 84737)
-- Name: PERMISSION FK_3e0bac09494fb052114349b2a62; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION"
    ADD CONSTRAINT "FK_3e0bac09494fb052114349b2a62" FOREIGN KEY ("ACTION_ID") REFERENCES public."ACTION"("ACTION_ID");


--
-- TOC entry 4859 (class 2606 OID 84799)
-- Name: PERMISSION_X_ROLE FK_5b0ff7785c8f8885aab2ea9f905; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "FK_5b0ff7785c8f8885aab2ea9f905" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4849 (class 2606 OID 84951)
-- Name: ROLES_X_USER FK_6014c0ac471a029270386464b0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4846 (class 2606 OID 84298)
-- Name: STAFF FK_6959a222385d4145719ceb62226; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "FK_6959a222385d4145719ceb62226" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4863 (class 2606 OID 84884)
-- Name: DEPARTMENT FK_acec9f72e1346671835b0b5ecb7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT"
    ADD CONSTRAINT "FK_acec9f72e1346671835b0b5ecb7" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4860 (class 2606 OID 84809)
-- Name: PERMISSION_X_ROLE FK_ae267066b6f7555d2adb197c85a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "FK_ae267066b6f7555d2adb197c85a" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 4844 (class 2606 OID 84517)
-- Name: USERS FK_c477bdfa53cec3db27eb50458f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8" FOREIGN KEY ("STAFF_ID") REFERENCES public."STAFF"("STAFF_ID");


--
-- TOC entry 4850 (class 2606 OID 84946)
-- Name: ROLES_X_USER FK_c9f359899bb9076d7c817389a01; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "FK_c9f359899bb9076d7c817389a01" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4854 (class 2606 OID 84722)
-- Name: ACTION FK_cd81ce38f4455efde440e99ffa0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTION"
    ADD CONSTRAINT "FK_cd81ce38f4455efde440e99ffa0" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4851 (class 2606 OID 84956)
-- Name: ROLES_X_USER FK_cfb5ba942f33086e54cec026244; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 4862 (class 2606 OID 84861)
-- Name: MENU_OPTIONS_X_ROLES FK_d3bd9bead05f4d2521b2ffe1a88; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTIONS_X_ROLES"
    ADD CONSTRAINT "FK_d3bd9bead05f4d2521b2ffe1a88" FOREIGN KEY ("MENU_OPTION_ID") REFERENCES public."MENU_OPTION"("MENU_OPTION_ID") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 84889)
-- Name: STAFF FK_d9793973a8feee9057072c2c93e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "FK_d9793973a8feee9057072c2c93e" FOREIGN KEY ("DEPARTMENT_ID") REFERENCES public."DEPARTMENT"("DEPARTMENT_ID");


--
-- TOC entry 4845 (class 2606 OID 84293)
-- Name: USERS FK_f6c2423fd7a3b24eae6c372cc57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4857 (class 2606 OID 84727)
-- Name: PERMISSION FK_f8162ac3b4eeffe234362266e35; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION"
    ADD CONSTRAINT "FK_f8162ac3b4eeffe234362266e35" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4848 (class 2606 OID 84915)
-- Name: ROLE FK_fd9db9681674bb23b2e69b2dc28; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


-- Completed on 2025-08-01 20:29:35

--
-- PostgreSQL database dump complete
--

