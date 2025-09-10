--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-09-10 18:52:44

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

--
-- TOC entry 6 (class 2615 OID 110613)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

CREATE EXTENSION unaccent;

--
-- TOC entry 939 (class 1247 OID 110885)
-- Name: GOAL_PROGRESS_scope_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GOAL_PROGRESS_scope_enum" AS ENUM (
    'individual',
    'module'
);


ALTER TYPE public."GOAL_PROGRESS_scope_enum" OWNER TO postgres;

--
-- TOC entry 954 (class 1247 OID 111117)
-- Name: GOAL_scope_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GOAL_scope_enum" AS ENUM (
    'individual',
    'module'
);


ALTER TYPE public."GOAL_scope_enum" OWNER TO postgres;

--
-- TOC entry 948 (class 1247 OID 111100)
-- Name: MENU_OPTION_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MENU_OPTION_type_enum" AS ENUM (
    'group',
    'divider',
    'link'
);


ALTER TYPE public."MENU_OPTION_type_enum" OWNER TO postgres;

--
-- TOC entry 960 (class 1247 OID 111230)
-- Name: period_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.period_type_enum AS ENUM (
    'weekly',
    'monthly',
    'custom'
);


ALTER TYPE public.period_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 110614)
-- Name: ACTION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ACTION" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "ACTION_ID" integer NOT NULL,
    "NAME" character varying(255) NOT NULL,
    "DESCRIPTION" character varying(255),
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer
);


ALTER TABLE public."ACTION" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 110622)
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
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 219
-- Name: ACTION_ACTION_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ACTION_ACTION_ID_seq" OWNED BY public."ACTION"."ACTION_ID";


--
-- TOC entry 220 (class 1259 OID 110623)
-- Name: ACTIVITY_LOG; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ACTIVITY_LOG" (
    "ID" integer NOT NULL,
    "USER_ID" integer NOT NULL,
    "ACTION" character varying(100) NOT NULL,
    "MODEL" character varying(150) NOT NULL,
    "OBJECT_ID" integer,
    "CHANGES" jsonb,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "IP" inet,
    "USER_AGENT" text
);


ALTER TABLE public."ACTIVITY_LOG" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 110629)
-- Name: ACTIVITY_LOG_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ACTIVITY_LOG_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ACTIVITY_LOG_ID_seq" OWNER TO postgres;

--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 221
-- Name: ACTIVITY_LOG_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ACTIVITY_LOG_ID_seq" OWNED BY public."ACTIVITY_LOG"."ID";


--
-- TOC entry 222 (class 1259 OID 110630)
-- Name: BUSINESS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BUSINESS" (
    "BUSINESS_ID" integer NOT NULL,
    "NAME" character varying NOT NULL,
    "LOGO" bytea,
    "RNC" character varying NOT NULL,
    "PHONE" character varying NOT NULL,
    "ADDRESS" text NOT NULL,
    "STATE" character(1) NOT NULL,
    "LOGO_URL" text,
    "CREATED_AT" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CREATED_BY" integer,
    "UPDATED_AT" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_BY" integer
);


ALTER TABLE public."BUSINESS" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 110635)
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
-- TOC entry 224 (class 1259 OID 110640)
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
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 224
-- Name: DEPARTMENT_DEPARTMENT_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DEPARTMENT_DEPARTMENT_ID_seq" OWNED BY public."DEPARTMENT"."DEPARTMENT_ID";


--
-- TOC entry 253 (class 1259 OID 111122)
-- Name: GOAL; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GOAL" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer,
    "GOAL_ID" integer NOT NULL,
    "MODULE_ID" integer NOT NULL,
    "DESCRIPTION" character varying NOT NULL,
    "START_DATE" timestamp without time zone NOT NULL,
    "END_DATE" timestamp without time zone NOT NULL,
    "WEIGHT" integer NOT NULL,
    "SCOPE" public."GOAL_scope_enum" NOT NULL
);


ALTER TABLE public."GOAL" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 110641)
-- Name: GOAL_GOAL_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GOAL_GOAL_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GOAL_GOAL_ID_seq" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 111121)
-- Name: GOAL_GOAL_ID_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GOAL_GOAL_ID_seq1"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GOAL_GOAL_ID_seq1" OWNER TO postgres;

--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 252
-- Name: GOAL_GOAL_ID_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GOAL_GOAL_ID_seq1" OWNED BY public."GOAL"."GOAL_ID";


--
-- TOC entry 248 (class 1259 OID 110890)
-- Name: GOAL_PROGRESS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GOAL_PROGRESS" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer,
    "GOAL_PROGRESS_ID" integer NOT NULL,
    "GOAL_ID" integer NOT NULL,
    "SCOPE" public."GOAL_PROGRESS_scope_enum" NOT NULL,
    "PERIOD_ID" integer NOT NULL,
    "STAFF_ID" integer,
    "MODULE_ID" integer,
    "ACTUAL_VALUE" bigint NOT NULL
);


ALTER TABLE public."GOAL_PROGRESS" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 110889)
-- Name: GOAL_PROGRESS_GOAL_PROGRESS_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GOAL_PROGRESS_GOAL_PROGRESS_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GOAL_PROGRESS_GOAL_PROGRESS_ID_seq" OWNER TO postgres;

--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 247
-- Name: GOAL_PROGRESS_GOAL_PROGRESS_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GOAL_PROGRESS_GOAL_PROGRESS_ID_seq" OWNED BY public."GOAL_PROGRESS"."GOAL_PROGRESS_ID";


--
-- TOC entry 250 (class 1259 OID 110900)
-- Name: GOAL_X_MODULE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GOAL_X_MODULE" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer,
    "GOAL_MODULE_ID" integer NOT NULL,
    "GOAL_ID" integer NOT NULL,
    "MODULE_ID" integer NOT NULL,
    "PERIOD_ID" integer,
    "TARGET_VALUE" bigint
);


ALTER TABLE public."GOAL_X_MODULE" OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 110899)
-- Name: GOAL_X_MODULE_GOAL_MODULE_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GOAL_X_MODULE_GOAL_MODULE_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GOAL_X_MODULE_GOAL_MODULE_ID_seq" OWNER TO postgres;

--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 249
-- Name: GOAL_X_MODULE_GOAL_MODULE_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GOAL_X_MODULE_GOAL_MODULE_ID_seq" OWNED BY public."GOAL_X_MODULE"."GOAL_MODULE_ID";


--
-- TOC entry 246 (class 1259 OID 110873)
-- Name: GOAL_X_STAFF; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GOAL_X_STAFF" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer,
    "GOAL_STAFF_ID" integer NOT NULL,
    "GOAL_ID" integer NOT NULL,
    "STAFF_ID" integer NOT NULL,
    "PERIOD_ID" integer NOT NULL,
    "TARGET_VALUE" bigint NOT NULL,
    "WEIGHT" numeric NOT NULL
);


ALTER TABLE public."GOAL_X_STAFF" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 110872)
-- Name: GOAL_X_STAFF_GOAL_STAFF_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GOAL_X_STAFF_GOAL_STAFF_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GOAL_X_STAFF_GOAL_STAFF_ID_seq" OWNER TO postgres;

--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 245
-- Name: GOAL_X_STAFF_GOAL_STAFF_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GOAL_X_STAFF_GOAL_STAFF_ID_seq" OWNED BY public."GOAL_X_STAFF"."GOAL_STAFF_ID";


--
-- TOC entry 251 (class 1259 OID 111107)
-- Name: MENU_OPTION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MENU_OPTION" (
    "MENU_OPTION_ID" character varying(50) NOT NULL,
    "NAME" character varying(100) NOT NULL,
    "DESCRIPTION" character varying(250),
    "PATH" character varying(100),
    "TYPE" public."MENU_OPTION_type_enum",
    "ICON" text,
    "ORDER" integer NOT NULL,
    "PARENT_ID" character varying,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_BY" integer
);


ALTER TABLE public."MENU_OPTION" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 110642)
-- Name: MENU_OPTIONS_X_ROLES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MENU_OPTIONS_X_ROLES" (
    "MENU_OPTION_ID" character varying(50) NOT NULL,
    "ROLE_ID" integer NOT NULL
);


ALTER TABLE public."MENU_OPTIONS_X_ROLES" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 110645)
-- Name: MODULE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MODULE" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "MODULE_ID" integer NOT NULL,
    "DESCRIPTION" character varying(150) NOT NULL,
    "SUPERVISOR_ID" integer NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer
);


ALTER TABLE public."MODULE" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 110651)
-- Name: MODULE_MODULE_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MODULE_MODULE_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MODULE_MODULE_ID_seq" OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 228
-- Name: MODULE_MODULE_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MODULE_MODULE_ID_seq" OWNED BY public."MODULE"."MODULE_ID";


--
-- TOC entry 255 (class 1259 OID 111238)
-- Name: PERIOD; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PERIOD" (
    "PERIOD_ID" integer NOT NULL,
    "NAME" character varying(50) NOT NULL,
    "START_DATE" date NOT NULL,
    "END_DATE" date NOT NULL,
    "TYPE" public.period_type_enum NOT NULL,
    CONSTRAINT "CHK_PERIOD_DATES" CHECK (("START_DATE" <= "END_DATE"))
);


ALTER TABLE public."PERIOD" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 111237)
-- Name: PERIOD_PERIOD_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PERIOD_PERIOD_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PERIOD_PERIOD_ID_seq" OWNER TO postgres;

--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 254
-- Name: PERIOD_PERIOD_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PERIOD_PERIOD_ID_seq" OWNED BY public."PERIOD"."PERIOD_ID";


--
-- TOC entry 229 (class 1259 OID 110652)
-- Name: PERMISSION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PERMISSION" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "PERMISSION_ID" integer NOT NULL,
    "DESCRIPTION" character varying(255),
    "ACTION_ID" integer NOT NULL,
    "MENU_OPTION_ID" character varying,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer
);


ALTER TABLE public."PERMISSION" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 110660)
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
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 230
-- Name: PERMISSION_PERMISSION_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PERMISSION_PERMISSION_ID_seq" OWNED BY public."PERMISSION"."PERMISSION_ID";


--
-- TOC entry 231 (class 1259 OID 110661)
-- Name: PERMISSION_X_ROLE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PERMISSION_X_ROLE" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "PERMISSION_ID" integer NOT NULL,
    "ROLE_ID" integer NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer
);


ALTER TABLE public."PERMISSION_X_ROLE" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 110667)
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
-- TOC entry 233 (class 1259 OID 110672)
-- Name: ROLES_X_USER; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ROLES_X_USER" (
    "USER_ID" integer NOT NULL,
    "ROLE_ID" integer NOT NULL,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer,
    "ID" integer NOT NULL
);


ALTER TABLE public."ROLES_X_USER" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 110678)
-- Name: ROLES_X_USER_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ROLES_X_USER_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ROLES_X_USER_ID_seq" OWNER TO postgres;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 234
-- Name: ROLES_X_USER_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ROLES_X_USER_ID_seq" OWNED BY public."ROLES_X_USER"."ID";


--
-- TOC entry 235 (class 1259 OID 110679)
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
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 235
-- Name: ROLE_ROLE_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ROLE_ROLE_ID_seq" OWNED BY public."ROLE"."ROLE_ID";


--
-- TOC entry 236 (class 1259 OID 110680)
-- Name: ROLE_X_PERMISSION; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ROLE_X_PERMISSION" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "PERMISSION_ID" integer NOT NULL,
    "ROLE_ID" integer NOT NULL
);


ALTER TABLE public."ROLE_X_PERMISSION" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 110685)
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
    "BIRTH_DATE" date NOT NULL,
    "PHONE" character varying NOT NULL,
    "GENDER" character(1) NOT NULL,
    "IDENTITY_DOCUMENT" character varying(11) NOT NULL,
    "ADDRESS" text NOT NULL,
    "MODULE_ID" integer,
    "UPDATED_AT" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_BY" integer,
    CONSTRAINT "CHK_STAFF_GENDER" CHECK (("GENDER" = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar]))),
    CONSTRAINT "CHK_STAFF_IDENTITY_DOCUMENT" CHECK ((("IDENTITY_DOCUMENT")::text ~ '^[0-9]{11}$'::text))
);


ALTER TABLE public."STAFF" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 110692)
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
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 238
-- Name: STAFF_STAFF_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."STAFF_STAFF_ID_seq" OWNED BY public."STAFF"."STAFF_ID";


--
-- TOC entry 239 (class 1259 OID 110693)
-- Name: STAFF_X_MODULE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."STAFF_X_MODULE" (
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "STAFF_MODULE_ID" integer NOT NULL,
    "STAFF_ID" integer NOT NULL,
    "MODULE_ID" integer NOT NULL,
    "UPDATED_AT" timestamp without time zone DEFAULT now(),
    "UPDATED_BY" integer
);


ALTER TABLE public."STAFF_X_MODULE" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 110699)
-- Name: STAFF_X_MODULE_STAFF_MODULE_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."STAFF_X_MODULE" ALTER COLUMN "STAFF_MODULE_ID" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."STAFF_X_MODULE_STAFF_MODULE_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 110700)
-- Name: USERS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USERS" (
    "USER_ID" integer NOT NULL,
    "USERNAME" character varying(25) NOT NULL,
    "PASSWORD_HASH" character varying NOT NULL,
    "LAST_LOGIN" timestamp without time zone,
    "CREATED_AT" timestamp without time zone DEFAULT now() NOT NULL,
    "CREATED_BY" integer,
    "STATE" character(1) DEFAULT 'A'::bpchar NOT NULL,
    "AVATAR" text,
    "MODULE_ID" integer,
    "STAFF_ID" integer NOT NULL,
    "IS_ACTIVE" boolean NOT NULL,
    "LOGIN_COUNT" integer
);


ALTER TABLE public."USERS" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 110707)
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
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 242
-- Name: USERS_USER_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."USERS_USER_ID_seq" OWNED BY public."USERS"."USER_ID";


--
-- TOC entry 243 (class 1259 OID 110708)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 110713)
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
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 244
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 256 (class 1259 OID 111283)
-- Name: v_kpi_efficiency_daily; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_kpi_efficiency_daily AS
 SELECT "GOAL_ID",
    "PERIOD_ID",
    "ACTUAL_VALUE"
   FROM public."GOAL_PROGRESS" gp;


ALTER VIEW public.v_kpi_efficiency_daily OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 111287)
-- Name: v_kpi_efficiency_weekly; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_kpi_efficiency_weekly AS
 SELECT gp."GOAL_ID",
    gp."PERIOD_ID",
    gp."ACTUAL_VALUE"
   FROM (public."GOAL_PROGRESS" gp
     JOIN public."PERIOD" p ON (((p."PERIOD_ID" = gp."PERIOD_ID") AND (p."TYPE" = 'weekly'::public.period_type_enum))));


ALTER VIEW public.v_kpi_efficiency_weekly OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 111291)
-- Name: v_kpi_goal_achievement; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_kpi_goal_achievement AS
 SELECT "GOAL_ID",
    "PERIOD_ID",
    "ACTUAL_VALUE"
   FROM public."GOAL_PROGRESS" gp;


ALTER VIEW public.v_kpi_goal_achievement OWNER TO postgres;

--
-- TOC entry 4871 (class 2604 OID 110724)
-- Name: ACTION ACTION_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTION" ALTER COLUMN "ACTION_ID" SET DEFAULT nextval('public."ACTION_ACTION_ID_seq"'::regclass);


--
-- TOC entry 4873 (class 2604 OID 110725)
-- Name: ACTIVITY_LOG ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTIVITY_LOG" ALTER COLUMN "ID" SET DEFAULT nextval('public."ACTIVITY_LOG_ID_seq"'::regclass);


--
-- TOC entry 4877 (class 2604 OID 110726)
-- Name: DEPARTMENT DEPARTMENT_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT" ALTER COLUMN "DEPARTMENT_ID" SET DEFAULT nextval('public."DEPARTMENT_DEPARTMENT_ID_seq"'::regclass);


--
-- TOC entry 4929 (class 2604 OID 111128)
-- Name: GOAL GOAL_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL" ALTER COLUMN "GOAL_ID" SET DEFAULT nextval('public."GOAL_GOAL_ID_seq1"'::regclass);


--
-- TOC entry 4918 (class 2604 OID 110896)
-- Name: GOAL_PROGRESS GOAL_PROGRESS_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_PROGRESS" ALTER COLUMN "GOAL_PROGRESS_ID" SET DEFAULT nextval('public."GOAL_PROGRESS_GOAL_PROGRESS_ID_seq"'::regclass);


--
-- TOC entry 4922 (class 2604 OID 110906)
-- Name: GOAL_X_MODULE GOAL_MODULE_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_MODULE" ALTER COLUMN "GOAL_MODULE_ID" SET DEFAULT nextval('public."GOAL_X_MODULE_GOAL_MODULE_ID_seq"'::regclass);


--
-- TOC entry 4914 (class 2604 OID 110879)
-- Name: GOAL_X_STAFF GOAL_STAFF_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_STAFF" ALTER COLUMN "GOAL_STAFF_ID" SET DEFAULT nextval('public."GOAL_X_STAFF_GOAL_STAFF_ID_seq"'::regclass);


--
-- TOC entry 4882 (class 2604 OID 110727)
-- Name: MODULE MODULE_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MODULE" ALTER COLUMN "MODULE_ID" SET DEFAULT nextval('public."MODULE_MODULE_ID_seq"'::regclass);


--
-- TOC entry 4930 (class 2604 OID 111241)
-- Name: PERIOD PERIOD_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERIOD" ALTER COLUMN "PERIOD_ID" SET DEFAULT nextval('public."PERIOD_PERIOD_ID_seq"'::regclass);


--
-- TOC entry 4886 (class 2604 OID 110728)
-- Name: PERMISSION PERMISSION_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION" ALTER COLUMN "PERMISSION_ID" SET DEFAULT nextval('public."PERMISSION_PERMISSION_ID_seq"'::regclass);


--
-- TOC entry 4891 (class 2604 OID 110729)
-- Name: ROLE ROLE_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE" ALTER COLUMN "ROLE_ID" SET DEFAULT nextval('public."ROLE_ROLE_ID_seq"'::regclass);


--
-- TOC entry 4897 (class 2604 OID 110730)
-- Name: ROLES_X_USER ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER" ALTER COLUMN "ID" SET DEFAULT nextval('public."ROLES_X_USER_ID_seq"'::regclass);


--
-- TOC entry 4902 (class 2604 OID 110731)
-- Name: STAFF STAFF_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF" ALTER COLUMN "STAFF_ID" SET DEFAULT nextval('public."STAFF_STAFF_ID_seq"'::regclass);


--
-- TOC entry 4907 (class 2604 OID 110732)
-- Name: USERS USER_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS" ALTER COLUMN "USER_ID" SET DEFAULT nextval('public."USERS_USER_ID_seq"'::regclass);


--
-- TOC entry 4910 (class 2604 OID 110733)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 5159 (class 0 OID 110614)
-- Dependencies: 218
-- Data for Name: ACTION; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 1, 'view', 'Ver o listar registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 2, 'create', 'Crear nuevos registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 3, 'update', 'Actualizar registros existentes', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 4, 'delete', 'Eliminar registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 5, 'export', 'Exportar datos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 6, 'approve', 'Aprobar operaciones o flujos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 7, 'reject', 'Rechazar operaciones o flujos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 8, 'assign', 'Asignar recursos o roles', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 1, 'view', 'Ver o listar registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 2, 'create', 'Crear nuevos registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 3, 'update', 'Actualizar registros existentes', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 4, 'delete', 'Eliminar registros', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 5, 'export', 'Exportar datos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 6, 'approve', 'Aprobar operaciones o flujos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 7, 'reject', 'Rechazar operaciones o flujos', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."ACTION" ("CREATED_AT", "CREATED_BY", "STATE", "ACTION_ID", "NAME", "DESCRIPTION", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:51:14.472359', 1, 'A', 8, 'assign', 'Asignar recursos o roles', '2025-08-18 14:36:07.169651', NULL);


--
-- TOC entry 5161 (class 0 OID 110623)
-- Dependencies: 220
-- Data for Name: ACTIVITY_LOG; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (2, 1, 'INSERT', 'Staff', 1, '{"NAME": "María Altagracias", "EMAIL": "maltagraciam@gmail.com", "PHONE": "8495567878", "STATE": "A", "GENDER": "F", "ADDRESS": "n/a", "STAFF_ID": 5, "LAST_NAME": "Medina", "MODULE_ID": null, "BIRTH_DATA": "2001-05-14T04:00:00.000Z", "CREATED_AT": "2025-08-20T15:23:45.084Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40239785589"}', '2025-08-20 15:23:48.375033', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (14, 1, 'INSERT', 'User', 8, '{"STAFF": {"NAME": "Michael", "EMAIL": "mjackson@gmail.com", "PHONE": "8295597878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 2, "LAST_NAME": "Jackson", "MODULE_ID": null, "BIRTH_DATA": "1996-08-13", "CREATED_AT": "2025-08-20T15:05:29.058Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40235979985"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 8, "PASSWORD": "$2b$10$nnt3V7U/lnfBKjF7PgoLz.ce1J16icBlwvT06tICnHdSbNNyHe1Bq", "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}', '2025-08-20 19:14:56.451406', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (15, 1, 'INSERT', 'UserRoles', NULL, '{"ROLE": {"NAME": "Supervisor", "STATE": "A", "ROLE_ID": 2, "CREATED_AT": "2025-08-01T16:00:42.657Z", "CREATED_BY": 1, "DESCRIPTION": "Rol para empleados que tiene resposabilidad de supervisar a otros"}, "USER": {"STAFF": {"NAME": "Michael", "EMAIL": "mjackson@gmail.com", "PHONE": "8295597878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 2, "LAST_NAME": "Jackson", "MODULE_ID": null, "BIRTH_DATA": "1996-08-13", "CREATED_AT": "2025-08-20T15:05:29.058Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40235979985"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 8, "PASSWORD": "$2b$10$nnt3V7U/lnfBKjF7PgoLz.ce1J16icBlwvT06tICnHdSbNNyHe1Bq", "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "STATE": "A", "ROLE_ID": 2, "USER_ID": 8, "CREATED_AT": "2025-08-20T19:14:54.454Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-20T23:14:56.451Z", "UPDATED_BY": null}', '2025-08-20 19:14:56.451406', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (16, 1, 'INSERT', 'User', 9, '{"STAFF": {"NAME": "Miguel", "EMAIL": "mmartes@gmail.com", "PHONE": "8495587878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 3, "LAST_NAME": "Martes", "MODULE_ID": null, "BIRTH_DATA": "1995-06-17", "CREATED_AT": "2025-08-20T15:12:41.138Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "04789898587"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 9, "PASSWORD": "$2b$10$VROizWCuqSlh.62lGiEeauuC4lmUr9KrDvXCS3G99WmdQlgrYTXZe", "STAFF_ID": 3, "USERNAME": "mmarte", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:35:03.491Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}', '2025-08-20 19:35:05.644435', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (17, 1, 'INSERT', 'UserRoles', 3, '{"ID": 3, "ROLE": {"NAME": "Coordinador", "STATE": "A", "ROLE_ID": 4, "CREATED_AT": "2025-08-02T00:21:52.134Z", "CREATED_BY": 1, "DESCRIPTION": "Coordina los equipos de trabajo y las metas"}, "USER": {"STAFF": {"NAME": "Miguel", "EMAIL": "mmartes@gmail.com", "PHONE": "8495587878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 3, "LAST_NAME": "Martes", "MODULE_ID": null, "BIRTH_DATA": "1995-06-17", "CREATED_AT": "2025-08-20T15:12:41.138Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "04789898587"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 9, "PASSWORD": "$2b$10$VROizWCuqSlh.62lGiEeauuC4lmUr9KrDvXCS3G99WmdQlgrYTXZe", "STAFF_ID": 3, "USERNAME": "mmarte", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:35:03.491Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "STATE": "A", "ROLE_ID": 4, "USER_ID": 9, "CREATED_AT": "2025-08-20T19:35:03.717Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-20T23:35:05.644Z", "UPDATED_BY": null}', '2025-08-20 19:35:05.644435', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (18, 1, 'UPDATE', 'User', NULL, '{}', '2025-08-20 19:36:04.625212', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (22, 1, 'INSERT', 'Module', 4, '{"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (23, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}, "STAFF_ID": 4, "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.475Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (24, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}, "STAFF_ID": 5, "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.475Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (25, 1, 'INSERT', 'Module', 5, '{"STATE": "A", "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:54.933Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas", "SUPERVISOR_ID": 8}', '2025-08-24 02:18:55.620909', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (26, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:54.933Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas", "SUPERVISOR_ID": 8}, "STAFF_ID": 4, "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:55.095Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null}', '2025-08-24 02:18:55.620909', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (2, 1, 'INSERT', 'Staff', 1, '{"NAME": "María Altagracias", "EMAIL": "maltagraciam@gmail.com", "PHONE": "8495567878", "STATE": "A", "GENDER": "F", "ADDRESS": "n/a", "STAFF_ID": 5, "LAST_NAME": "Medina", "MODULE_ID": null, "BIRTH_DATA": "2001-05-14T04:00:00.000Z", "CREATED_AT": "2025-08-20T15:23:45.084Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40239785589"}', '2025-08-20 15:23:48.375033', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (14, 1, 'INSERT', 'User', 8, '{"STAFF": {"NAME": "Michael", "EMAIL": "mjackson@gmail.com", "PHONE": "8295597878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 2, "LAST_NAME": "Jackson", "MODULE_ID": null, "BIRTH_DATA": "1996-08-13", "CREATED_AT": "2025-08-20T15:05:29.058Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40235979985"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 8, "PASSWORD": "$2b$10$nnt3V7U/lnfBKjF7PgoLz.ce1J16icBlwvT06tICnHdSbNNyHe1Bq", "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}', '2025-08-20 19:14:56.451406', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (15, 1, 'INSERT', 'UserRoles', NULL, '{"ROLE": {"NAME": "Supervisor", "STATE": "A", "ROLE_ID": 2, "CREATED_AT": "2025-08-01T16:00:42.657Z", "CREATED_BY": 1, "DESCRIPTION": "Rol para empleados que tiene resposabilidad de supervisar a otros"}, "USER": {"STAFF": {"NAME": "Michael", "EMAIL": "mjackson@gmail.com", "PHONE": "8295597878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 2, "LAST_NAME": "Jackson", "MODULE_ID": null, "BIRTH_DATA": "1996-08-13", "CREATED_AT": "2025-08-20T15:05:29.058Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "40235979985"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 8, "PASSWORD": "$2b$10$nnt3V7U/lnfBKjF7PgoLz.ce1J16icBlwvT06tICnHdSbNNyHe1Bq", "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "STATE": "A", "ROLE_ID": 2, "USER_ID": 8, "CREATED_AT": "2025-08-20T19:14:54.454Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-20T23:14:56.451Z", "UPDATED_BY": null}', '2025-08-20 19:14:56.451406', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (16, 1, 'INSERT', 'User', 9, '{"STAFF": {"NAME": "Miguel", "EMAIL": "mmartes@gmail.com", "PHONE": "8495587878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 3, "LAST_NAME": "Martes", "MODULE_ID": null, "BIRTH_DATA": "1995-06-17", "CREATED_AT": "2025-08-20T15:12:41.138Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "04789898587"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 9, "PASSWORD": "$2b$10$VROizWCuqSlh.62lGiEeauuC4lmUr9KrDvXCS3G99WmdQlgrYTXZe", "STAFF_ID": 3, "USERNAME": "mmarte", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:35:03.491Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}', '2025-08-20 19:35:05.644435', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (17, 1, 'INSERT', 'UserRoles', 3, '{"ID": 3, "ROLE": {"NAME": "Coordinador", "STATE": "A", "ROLE_ID": 4, "CREATED_AT": "2025-08-02T00:21:52.134Z", "CREATED_BY": 1, "DESCRIPTION": "Coordina los equipos de trabajo y las metas"}, "USER": {"STAFF": {"NAME": "Miguel", "EMAIL": "mmartes@gmail.com", "PHONE": "8495587878", "STATE": "A", "GENDER": "M", "ADDRESS": "n/a", "STAFF_ID": 3, "LAST_NAME": "Martes", "MODULE_ID": null, "BIRTH_DATA": "1995-06-17", "CREATED_AT": "2025-08-20T15:12:41.138Z", "CREATED_BY": 1, "IDENTITY_DOCUMENT": "04789898587"}, "STATE": "A", "AVATAR": null, "CREATOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "USER_ID": 9, "PASSWORD": "$2b$10$VROizWCuqSlh.62lGiEeauuC4lmUr9KrDvXCS3G99WmdQlgrYTXZe", "STAFF_ID": 3, "USERNAME": "mmarte", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:35:03.491Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "STATE": "A", "ROLE_ID": 4, "USER_ID": 9, "CREATED_AT": "2025-08-20T19:35:03.717Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-20T23:35:05.644Z", "UPDATED_BY": null}', '2025-08-20 19:35:05.644435', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (18, 1, 'UPDATE', 'User', NULL, '{}', '2025-08-20 19:36:04.625212', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (22, 1, 'INSERT', 'Module', 4, '{"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (23, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}, "STAFF_ID": 4, "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.475Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (24, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": "https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg", "USER_ID": 1, "STAFF_ID": 1, "USERNAME": "admin", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T12:44:20.000Z", "CREATED_BY": null, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas deportivas", "SUPERVISOR_ID": 1}, "STAFF_ID": 5, "MODULE_ID": 4, "CREATED_AT": "2025-08-21T23:37:18.475Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-22T03:37:23.584Z", "UPDATED_BY": null}', '2025-08-21 23:37:23.584791', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (25, 1, 'INSERT', 'Module', 5, '{"STATE": "A", "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:54.933Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas", "SUPERVISOR_ID": 8}', '2025-08-24 02:18:55.620909', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (26, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:54.933Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null, "DESCRIPTION": "Producción de Camisetas", "SUPERVISOR_ID": 8}, "STAFF_ID": 4, "MODULE_ID": 5, "CREATED_AT": "2025-08-24T02:18:55.095Z", "CREATED_BY": 1, "UPDATED_AT": "2025-08-24T06:18:55.620Z", "UPDATED_BY": null}', '2025-08-24 02:18:55.620909', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (27, 1, 'INSERT', 'Goal', 1, '{"SCOPE": "module", "STATE": "A", "WEIGHT": 10, "GOAL_ID": 1, "END_DATE": "2025-09-08T03:59:59.999Z", "MODULE_ID": 4, "CREATED_AT": "2025-09-08T01:24:46.981Z", "CREATED_BY": 1, "START_DATE": "2025-09-01T04:00:00.000Z", "UPDATED_AT": "2025-09-08T01:24:46.986Z", "UPDATED_BY": null, "DESCRIPTION": "Aumentar producción de zapatos"}', '2025-09-07 21:24:46.986286', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (28, 1, 'INSERT', 'Module', 6, '{"STATE": "A", "MODULE_ID": 6, "CREATED_AT": "2025-09-08T23:28:57.826Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-09-08T23:28:57.825Z", "UPDATED_BY": null, "DESCRIPTION": "FUSIONADORA", "SUPERVISOR_ID": 8}', '2025-09-08 19:28:57.825734', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (29, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 6, "CREATED_AT": "2025-09-08T23:28:57.826Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-09-08T23:28:57.825Z", "UPDATED_BY": null, "DESCRIPTION": "FUSIONADORA", "SUPERVISOR_ID": 8}, "STAFF_ID": 4, "MODULE_ID": 6, "CREATED_AT": "2025-09-08T23:28:57.852Z", "CREATED_BY": 1, "UPDATED_AT": "2025-09-08T23:28:57.825Z", "UPDATED_BY": null}', '2025-09-08 19:28:57.825734', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (30, 1, 'INSERT', 'Goal', 2, '{"SCOPE": "module", "STATE": "A", "WEIGHT": 10, "GOAL_ID": 2, "END_DATE": "2025-09-14T03:59:59.999Z", "MODULE_ID": 4, "CREATED_AT": "2025-09-08T23:32:51.803Z", "CREATED_BY": 1, "START_DATE": "2025-09-08T04:00:00.000Z", "UPDATED_AT": "2025-09-08T23:32:51.861Z", "UPDATED_BY": null, "DESCRIPTION": "Prueba"}', '2025-09-08 19:32:51.861558', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (31, 1, 'INSERT', 'Module', 7, '{"STATE": "A", "MODULE_ID": 7, "CREATED_AT": "2025-09-09T00:31:23.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-09-09T00:31:23.335Z", "UPDATED_BY": null, "DESCRIPTION": "probando", "SUPERVISOR_ID": 8}', '2025-09-08 20:31:23.335614', NULL, NULL);
INSERT INTO public."ACTIVITY_LOG" ("ID", "USER_ID", "ACTION", "MODEL", "OBJECT_ID", "CHANGES", "CREATED_AT", "IP", "USER_AGENT") VALUES (32, 1, 'INSERT', 'StaffModule', NULL, '{"STATE": "A", "MODULE": {"STATE": "A", "MODULE_ID": 7, "CREATED_AT": "2025-09-09T00:31:23.336Z", "CREATED_BY": 1, "SUPERVISOR": {"STATE": "A", "AVATAR": null, "USER_ID": 8, "STAFF_ID": 2, "USERNAME": "mjackson", "IS_ACTIVE": true, "MODULE_ID": null, "CREATED_AT": "2025-08-20T19:14:54.252Z", "CREATED_BY": 1, "LAST_LOGIN": null, "LOGIN_COUNT": null}, "UPDATED_AT": "2025-09-09T00:31:23.335Z", "UPDATED_BY": null, "DESCRIPTION": "probando", "SUPERVISOR_ID": 8}, "STAFF_ID": 5, "MODULE_ID": 7, "CREATED_AT": "2025-09-09T00:31:23.358Z", "CREATED_BY": 1, "UPDATED_AT": "2025-09-09T00:31:23.335Z", "UPDATED_BY": null}', '2025-09-08 20:31:23.335614', NULL, NULL);


--
-- TOC entry 5163 (class 0 OID 110630)
-- Dependencies: 222
-- Data for Name: BUSINESS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5164 (class 0 OID 110635)
-- Dependencies: 223
-- Data for Name: DEPARTMENT; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5194 (class 0 OID 111122)
-- Dependencies: 253
-- Data for Name: GOAL; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."GOAL" ("CREATED_AT", "CREATED_BY", "STATE", "UPDATED_AT", "UPDATED_BY", "GOAL_ID", "MODULE_ID", "DESCRIPTION", "START_DATE", "END_DATE", "WEIGHT", "SCOPE") VALUES ('2025-09-07 21:24:46.981', 1, 'A', '2025-09-07 21:24:46.986286', NULL, 1, 4, 'Aumentar producción de zapatos', '2025-09-01 00:00:00', '2025-09-07 23:59:59.999', 10, 'module');
INSERT INTO public."GOAL" ("CREATED_AT", "CREATED_BY", "STATE", "UPDATED_AT", "UPDATED_BY", "GOAL_ID", "MODULE_ID", "DESCRIPTION", "START_DATE", "END_DATE", "WEIGHT", "SCOPE") VALUES ('2025-09-08 19:32:51.803', 1, 'A', '2025-09-08 19:32:51.861558', NULL, 2, 4, 'Prueba', '2025-09-08 00:00:00', '2025-09-13 23:59:59.999', 10, 'module');


--
-- TOC entry 5189 (class 0 OID 110890)
-- Dependencies: 248
-- Data for Name: GOAL_PROGRESS; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5191 (class 0 OID 110900)
-- Dependencies: 250
-- Data for Name: GOAL_X_MODULE; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5187 (class 0 OID 110873)
-- Dependencies: 246
-- Data for Name: GOAL_X_STAFF; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5192 (class 0 OID 111107)
-- Dependencies: 251
-- Data for Name: MENU_OPTION; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5167 (class 0 OID 110642)
-- Dependencies: 226
-- Data for Name: MENU_OPTIONS_X_ROLES; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-2', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-2-1', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-2-2', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-4', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-1', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-5-2', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-5-4', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-5-1', 1);
INSERT INTO public."MENU_OPTIONS_X_ROLES" ("MENU_OPTION_ID", "ROLE_ID") VALUES ('0-5-3', 1);


--
-- TOC entry 5168 (class 0 OID 110645)
-- Dependencies: 227
-- Data for Name: MODULE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "MODULE_ID", "DESCRIPTION", "SUPERVISOR_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-21 19:37:18.336', 1, 'A', 4, 'Producción de Camisetas deportivas', 1, '2025-08-21 23:37:23.584791', NULL);
INSERT INTO public."MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "MODULE_ID", "DESCRIPTION", "SUPERVISOR_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-23 22:18:54.933', 1, 'A', 5, 'Producción de Camisetas', 8, '2025-08-24 02:18:55.620909', NULL);
INSERT INTO public."MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "MODULE_ID", "DESCRIPTION", "SUPERVISOR_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-09-08 19:28:57.826', 1, 'A', 6, 'FUSIONADORA', 8, '2025-09-08 19:28:57.825734', NULL);
INSERT INTO public."MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "MODULE_ID", "DESCRIPTION", "SUPERVISOR_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-09-08 20:31:23.336', 1, 'A', 7, 'probando', 8, '2025-09-08 20:31:23.335614', NULL);


--
-- TOC entry 5196 (class 0 OID 111238)
-- Dependencies: 255
-- Data for Name: PERIOD; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5170 (class 0 OID 110652)
-- Dependencies: 229
-- Data for Name: PERMISSION; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:09:22', 8, 'A', 5, 'VIEW', 1, NULL, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 101, 'Ver roles', 1, '0-2-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 102, 'Crear roles', 2, '0-2-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 103, 'Editar roles', 3, '0-2-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 104, 'Eliminar roles', 4, '0-2-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 105, 'Ver usuarios', 1, '0-2-2', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 106, 'Crear usuarios', 2, '0-2-2', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 107, 'Editar usuarios', 3, '0-2-2', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 108, 'Eliminar usuarios', 4, '0-2-2', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 109, 'Ver empleados', 1, '0-4', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 110, 'Crear empleados', 2, '0-5-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 111, 'Editar empleados', 3, '0-5-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 112, 'Eliminar empleados', 4, '0-5-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 113, 'Ver evaluaciones', 1, '0-5-2', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 114, 'Ver equipos', 1, '0-5-3', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:56:07.994447', 8, 'A', 115, 'Ver metas', 1, '0-5-4', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:06:22', 8, 'A', 1, 'ver', 1, '0-1', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:08:00', 8, 'A', 2, 'VIEW', 1, '0-5', '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "DESCRIPTION", "ACTION_ID", "MENU_OPTION_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:08:54', 8, 'A', 4, 'VIEW', 1, '0-2', '2025-08-18 14:36:07.169651', NULL);


--
-- TOC entry 5172 (class 0 OID 110661)
-- Dependencies: 231
-- Data for Name: PERMISSION_X_ROLE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 101, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 102, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 103, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 104, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 105, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 106, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 107, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 108, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 109, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 110, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 111, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 112, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 113, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 114, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 00:57:50.474694', 1, 'A', 115, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:10:11', 1, 'A', 1, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:10:26', 1, 'A', 2, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:10:35', 1, 'A', 4, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 11:11:10', 1, 'A', 5, 1, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 101, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 102, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 103, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 104, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 105, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 106, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 107, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 108, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 109, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 110, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 111, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 112, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 113, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 114, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 115, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 1, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 2, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 4, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 12:00:42.657', 1, 'A', 5, 2, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 109, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 110, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 111, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 112, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 113, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 114, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 115, 4, '2025-08-18 14:36:07.169651', NULL);
INSERT INTO public."PERMISSION_X_ROLE" ("CREATED_AT", "CREATED_BY", "STATE", "PERMISSION_ID", "ROLE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-01 20:21:52.134', 1, 'A', 1, 4, '2025-08-18 14:36:07.169651', NULL);


--
-- TOC entry 5173 (class 0 OID 110667)
-- Dependencies: 232
-- Data for Name: ROLE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (1, 'Admin', 'Rol de administradr', '2025-07-31 19:50:37.343746', 1, 'A');
INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (2, 'Supervisor', 'Rol para empleados que tiene resposabilidad de supervisar a otros', '2025-08-01 12:00:42.657', 1, 'A');
INSERT INTO public."ROLE" ("ROLE_ID", "NAME", "DESCRIPTION", "CREATED_AT", "CREATED_BY", "STATE") VALUES (4, 'Coordinador', 'Coordina los equipos de trabajo y las metas', '2025-08-01 20:21:52.134', 1, 'A');


--
-- TOC entry 5174 (class 0 OID 110672)
-- Dependencies: 233
-- Data for Name: ROLES_X_USER; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE", "UPDATED_AT", "UPDATED_BY", "ID") VALUES (1, 1, '2025-08-20 19:34:27.133815', NULL, 'A', '2025-08-20 19:34:27.133815', NULL, 1);
INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE", "UPDATED_AT", "UPDATED_BY", "ID") VALUES (8, 2, '2025-08-20 19:34:27.133815', NULL, 'A', '2025-08-20 19:34:27.133815', NULL, 2);
INSERT INTO public."ROLES_X_USER" ("USER_ID", "ROLE_ID", "CREATED_AT", "CREATED_BY", "STATE", "UPDATED_AT", "UPDATED_BY", "ID") VALUES (9, 4, '2025-08-20 15:35:03.717', 1, 'A', '2025-08-20 19:35:05.644435', NULL, 3);


--
-- TOC entry 5177 (class 0 OID 110680)
-- Dependencies: 236
-- Data for Name: ROLE_X_PERMISSION; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5178 (class 0 OID 110685)
-- Dependencies: 237
-- Data for Name: STAFF; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATE", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-07-17 08:16:53.374', 1, 'A', 1, 'Juan', 'Pérez', 'juan.perez@example.com', '1990-05-19', '8091234567', 'M', '00123456789', 'Calle 10, Santo Domingo, RD', NULL, '2025-09-08 17:42:14.021762', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATE", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-20 11:05:29.058', 1, 'A', 2, 'Michael', 'Jackson', 'mjackson@gmail.com', '1996-08-13', '8295597878', 'M', '40235979985', 'n/a', NULL, '2025-09-08 17:42:14.021762', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATE", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-20 11:12:41.138', 1, 'A', 3, 'Miguel', 'Martes', 'mmartes@gmail.com', '1995-06-17', '8495587878', 'M', '04789898587', 'n/a', NULL, '2025-09-08 17:42:14.021762', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATE", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-20 11:16:38.067', 1, 'A', 4, 'Marlon', 'Medina', 'mmedina@gmail.com', '2000-02-12', '8497785658', 'M', '40236789965', 'n/a', NULL, '2025-09-08 17:42:14.021762', NULL);
INSERT INTO public."STAFF" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_ID", "NAME", "LAST_NAME", "EMAIL", "BIRTH_DATE", "PHONE", "GENDER", "IDENTITY_DOCUMENT", "ADDRESS", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-20 11:23:45.084', 1, 'A', 5, 'María Altagracias', 'Medina', 'maltagraciam@gmail.com', '2001-05-14', '8495567878', 'F', '40239785589', 'n/a', NULL, '2025-09-08 17:42:14.021762', NULL);


--
-- TOC entry 5180 (class 0 OID 110693)
-- Dependencies: 239
-- Data for Name: STAFF_X_MODULE; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."STAFF_X_MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_MODULE_ID", "STAFF_ID", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-21 19:37:18.475', 1, 'A', 1, 4, 4, '2025-08-21 23:37:23.584791', NULL);
INSERT INTO public."STAFF_X_MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_MODULE_ID", "STAFF_ID", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-21 19:37:18.475', 1, 'A', 2, 5, 4, '2025-08-21 23:37:23.584791', NULL);
INSERT INTO public."STAFF_X_MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_MODULE_ID", "STAFF_ID", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-08-23 22:18:55.095', 1, 'A', 3, 4, 5, '2025-08-24 02:18:55.620909', NULL);
INSERT INTO public."STAFF_X_MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_MODULE_ID", "STAFF_ID", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-09-08 19:28:57.852', 1, 'A', 4, 4, 6, '2025-09-08 19:28:57.825734', NULL);
INSERT INTO public."STAFF_X_MODULE" ("CREATED_AT", "CREATED_BY", "STATE", "STAFF_MODULE_ID", "STAFF_ID", "MODULE_ID", "UPDATED_AT", "UPDATED_BY") VALUES ('2025-09-08 20:31:23.358', 1, 'A', 5, 5, 7, '2025-09-08 20:31:23.335614', NULL);


--
-- TOC entry 5182 (class 0 OID 110700)
-- Dependencies: 241
-- Data for Name: USERS; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD_HASH", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "AVATAR", "MODULE_ID", "STAFF_ID", "IS_ACTIVE", "LOGIN_COUNT") VALUES (1, 'admin', '$2a$12$atIDCxn/e5bcWkiaHS2X9eCiLiieJurleSSgj5mrYxNMelKifKUHO', NULL, '2025-08-20 08:44:20', NULL, 'A', 'https://i.pinimg.com/originals/bc/0a/c1/bc0ac1ee347b750bc0a710ab342fd550.jpg', NULL, 1, true, NULL);
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD_HASH", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "AVATAR", "MODULE_ID", "STAFF_ID", "IS_ACTIVE", "LOGIN_COUNT") VALUES (8, 'mjackson', '$2b$10$nnt3V7U/lnfBKjF7PgoLz.ce1J16icBlwvT06tICnHdSbNNyHe1Bq', NULL, '2025-08-20 15:14:54.252', 1, 'A', NULL, NULL, 2, true, NULL);
INSERT INTO public."USERS" ("USER_ID", "USERNAME", "PASSWORD_HASH", "LAST_LOGIN", "CREATED_AT", "CREATED_BY", "STATE", "AVATAR", "MODULE_ID", "STAFF_ID", "IS_ACTIVE", "LOGIN_COUNT") VALUES (9, 'mmarte', '$2b$10$VROizWCuqSlh.62lGiEeauuC4lmUr9KrDvXCS3G99WmdQlgrYTXZe', NULL, '2025-08-20 15:35:03.491', 1, 'I', NULL, NULL, 3, true, NULL);


--
-- TOC entry 5184 (class 0 OID 110708)
-- Dependencies: 243
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
INSERT INTO public.migrations (id, "timestamp", name) VALUES (10, 1752765601639, 'Migration1752765601639');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (11, 1752765707976, 'Migration1752765707976');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (12, 1753064203213, 'Migration1753064203213');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (13, 1754004212601, 'Migration1754004212601');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (14, 1754004439077, 'Migration1754004439077');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (15, 1754004765834, 'Migration1754004765834');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (16, 1754005667936, 'Migration1754005667936');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (17, 1754005808933, 'Migration1754005808933');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (18, 1754005855770, 'Migration1754005855770');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (19, 1755447069430, 'Migration1755447069430');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (20, 1755447811563, 'Migration1755447811563');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (21, 1755447926691, 'Migration1755447926691');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (22, 1755542142052, 'Migration1755542142052');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (23, 1755542231311, 'Migration1755542231311');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (24, 1755545746159, 'Migration1755545746159');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (25, 1755550928961, 'Migration1755550928961');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (26, 1755617151613, 'Migration1755617151613');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (27, 1755692986635, 'Migration1755692986635');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (28, 1755715129847, 'Migration1755715129847');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (29, 1755717769967, 'Migration1755717769967');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (30, 1756074763538, 'Migration1756074763538');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (31, 1756908155907, 'Migration1756908155907');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (32, 1757292234570, 'Migration1757292234570');
INSERT INTO public.migrations (id, "timestamp", name) VALUES (33, 1699999999999, 'SchemaHardeningPeriodsSecurity1699999999999');


--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 219
-- Name: ACTION_ACTION_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ACTION_ACTION_ID_seq"', 1, false);


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 221
-- Name: ACTIVITY_LOG_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ACTIVITY_LOG_ID_seq"', 32, true);


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 224
-- Name: DEPARTMENT_DEPARTMENT_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DEPARTMENT_DEPARTMENT_ID_seq"', 1, false);


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 225
-- Name: GOAL_GOAL_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GOAL_GOAL_ID_seq"', 1, false);


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 252
-- Name: GOAL_GOAL_ID_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GOAL_GOAL_ID_seq1"', 2, true);


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 247
-- Name: GOAL_PROGRESS_GOAL_PROGRESS_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GOAL_PROGRESS_GOAL_PROGRESS_ID_seq"', 2, true);


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 249
-- Name: GOAL_X_MODULE_GOAL_MODULE_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GOAL_X_MODULE_GOAL_MODULE_ID_seq"', 1, false);


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 245
-- Name: GOAL_X_STAFF_GOAL_STAFF_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GOAL_X_STAFF_GOAL_STAFF_ID_seq"', 1, false);


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 228
-- Name: MODULE_MODULE_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MODULE_MODULE_ID_seq"', 7, true);


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 254
-- Name: PERIOD_PERIOD_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PERIOD_PERIOD_ID_seq"', 1, false);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 230
-- Name: PERMISSION_PERMISSION_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PERMISSION_PERMISSION_ID_seq"', 1, false);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 234
-- Name: ROLES_X_USER_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ROLES_X_USER_ID_seq"', 3, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 235
-- Name: ROLE_ROLE_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ROLE_ROLE_ID_seq"', 1, false);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 238
-- Name: STAFF_STAFF_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."STAFF_STAFF_ID_seq"', 5, true);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 240
-- Name: STAFF_X_MODULE_STAFF_MODULE_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."STAFF_X_MODULE_STAFF_MODULE_ID_seq"', 5, true);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 242
-- Name: USERS_USER_ID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."USERS_USER_ID_seq"', 9, true);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 244
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 33, true);


--
-- TOC entry 4954 (class 2606 OID 110735)
-- Name: ROLE_X_PERMISSION PK_1daeb68c929a23440933008dcd0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE_X_PERMISSION"
    ADD CONSTRAINT "PK_1daeb68c929a23440933008dcd0" PRIMARY KEY ("PERMISSION_ID", "ROLE_ID");


--
-- TOC entry 4942 (class 2606 OID 111282)
-- Name: MENU_OPTIONS_X_ROLES PK_1f6674a97c67f5297c5d3b5997f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTIONS_X_ROLES"
    ADD CONSTRAINT "PK_1f6674a97c67f5297c5d3b5997f" PRIMARY KEY ("MENU_OPTION_ID", "ROLE_ID");


--
-- TOC entry 4950 (class 2606 OID 110739)
-- Name: ROLE PK_2464e6137ccbd5f89724b83282e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "PK_2464e6137ccbd5f89724b83282e" PRIMARY KEY ("ROLE_ID");


--
-- TOC entry 4983 (class 2606 OID 111132)
-- Name: GOAL PK_31918bd1daf1306b0e32a329ea7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL"
    ADD CONSTRAINT "PK_31918bd1daf1306b0e32a329ea7" PRIMARY KEY ("GOAL_ID");


--
-- TOC entry 4962 (class 2606 OID 110741)
-- Name: STAFF_X_MODULE PK_3f3e5ba18b672be054f6ca21f71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF_X_MODULE"
    ADD CONSTRAINT "PK_3f3e5ba18b672be054f6ca21f71" PRIMARY KEY ("STAFF_MODULE_ID");


--
-- TOC entry 4944 (class 2606 OID 110743)
-- Name: MODULE PK_4d733a2e60db181ead5029c4f2a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MODULE"
    ADD CONSTRAINT "PK_4d733a2e60db181ead5029c4f2a" PRIMARY KEY ("MODULE_ID");


--
-- TOC entry 4974 (class 2606 OID 110898)
-- Name: GOAL_PROGRESS PK_550d2158f7acf25e165c397006d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_PROGRESS"
    ADD CONSTRAINT "PK_550d2158f7acf25e165c397006d" PRIMARY KEY ("GOAL_PROGRESS_ID");


--
-- TOC entry 4986 (class 2606 OID 111244)
-- Name: PERIOD PK_5784a1ce88c4067fd83629d00cf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERIOD"
    ADD CONSTRAINT "PK_5784a1ce88c4067fd83629d00cf" PRIMARY KEY ("PERIOD_ID");


--
-- TOC entry 4946 (class 2606 OID 110747)
-- Name: PERMISSION PK_7efad0105d237300cbd89505d3d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION"
    ADD CONSTRAINT "PK_7efad0105d237300cbd89505d3d" PRIMARY KEY ("PERMISSION_ID");


--
-- TOC entry 4976 (class 2606 OID 110908)
-- Name: GOAL_X_MODULE PK_80938948bdeeb8114e9350501a0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_MODULE"
    ADD CONSTRAINT "PK_80938948bdeeb8114e9350501a0" PRIMARY KEY ("GOAL_MODULE_ID");


--
-- TOC entry 4936 (class 2606 OID 110749)
-- Name: BUSINESS PK_8726e67e668478ef7d1aedd6a0e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BUSINESS"
    ADD CONSTRAINT "PK_8726e67e668478ef7d1aedd6a0e" PRIMARY KEY ("BUSINESS_ID");


--
-- TOC entry 4969 (class 2606 OID 110751)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 4956 (class 2606 OID 110753)
-- Name: STAFF PK_9d3026d6816040c56533cfd122e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "PK_9d3026d6816040c56533cfd122e" PRIMARY KEY ("STAFF_ID");


--
-- TOC entry 4971 (class 2606 OID 110883)
-- Name: GOAL_X_STAFF PK_a638fb438a78ca2e89d17326205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_STAFF"
    ADD CONSTRAINT "PK_a638fb438a78ca2e89d17326205" PRIMARY KEY ("GOAL_STAFF_ID");


--
-- TOC entry 4948 (class 2606 OID 110755)
-- Name: PERMISSION_X_ROLE PK_aba3c897a024c6ba7edf7a47da3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "PK_aba3c897a024c6ba7edf7a47da3" PRIMARY KEY ("PERMISSION_ID", "ROLE_ID");


--
-- TOC entry 4938 (class 2606 OID 110757)
-- Name: DEPARTMENT PK_b3142394ad5073f4a21ef3df9c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT"
    ADD CONSTRAINT "PK_b3142394ad5073f4a21ef3df9c4" PRIMARY KEY ("DEPARTMENT_ID");


--
-- TOC entry 4979 (class 2606 OID 111115)
-- Name: MENU_OPTION PK_c33923d6f156b267e8e4dfe59c3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTION"
    ADD CONSTRAINT "PK_c33923d6f156b267e8e4dfe59c3" PRIMARY KEY ("MENU_OPTION_ID");


--
-- TOC entry 4965 (class 2606 OID 110761)
-- Name: USERS PK_f37d934f4f6abb757dce91ce6f2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "PK_f37d934f4f6abb757dce91ce6f2" PRIMARY KEY ("USER_ID");


--
-- TOC entry 4981 (class 2606 OID 111277)
-- Name: MENU_OPTION UQ_MENU_OPTION_PARENT_ORDER; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTION"
    ADD CONSTRAINT "UQ_MENU_OPTION_PARENT_ORDER" UNIQUE ("PARENT_ID", "ORDER");


--
-- TOC entry 4988 (class 2606 OID 111246)
-- Name: PERIOD UQ_PERIOD_NAME; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERIOD"
    ADD CONSTRAINT "UQ_PERIOD_NAME" UNIQUE ("NAME");


--
-- TOC entry 4958 (class 2606 OID 111267)
-- Name: STAFF UQ_STAFF_EMAIL; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "UQ_STAFF_EMAIL" UNIQUE ("EMAIL");


--
-- TOC entry 4960 (class 2606 OID 111269)
-- Name: STAFF UQ_STAFF_IDENTITY_DOCUMENT; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "UQ_STAFF_IDENTITY_DOCUMENT" UNIQUE ("IDENTITY_DOCUMENT");


--
-- TOC entry 4967 (class 2606 OID 111264)
-- Name: USERS UQ_USERS_USERNAME; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "UQ_USERS_USERNAME" UNIQUE ("USERNAME");


--
-- TOC entry 4952 (class 2606 OID 110763)
-- Name: ROLE UQ_cfcd3a13b39580bf95cd2ef1b1f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "UQ_cfcd3a13b39580bf95cd2ef1b1f" UNIQUE ("NAME");


--
-- TOC entry 4939 (class 1259 OID 110764)
-- Name: IDX_2c7ac3fef525331bd30141dafb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2c7ac3fef525331bd30141dafb" ON public."MENU_OPTIONS_X_ROLES" USING btree ("ROLE_ID");


--
-- TOC entry 4934 (class 1259 OID 111279)
-- Name: IDX_ACTIVITY_LOG_USER_CREATED_AT; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ACTIVITY_LOG_USER_CREATED_AT" ON public."ACTIVITY_LOG" USING btree ("USER_ID", "CREATED_AT");


--
-- TOC entry 4972 (class 1259 OID 111280)
-- Name: IDX_GOAL_PROGRESS_COMPOSITE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_GOAL_PROGRESS_COMPOSITE" ON public."GOAL_PROGRESS" USING btree ("GOAL_ID", "PERIOD_ID", "MODULE_ID", "STAFF_ID");


--
-- TOC entry 4977 (class 1259 OID 111275)
-- Name: IDX_MENU_OPTION_PARENT_ORDER; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_MENU_OPTION_PARENT_ORDER" ON public."MENU_OPTION" USING btree ("PARENT_ID", "ORDER");


--
-- TOC entry 4984 (class 1259 OID 111247)
-- Name: IDX_PERIOD_NAME; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_PERIOD_NAME" ON public."PERIOD" USING btree ("NAME");


--
-- TOC entry 4963 (class 1259 OID 111265)
-- Name: IDX_USERS_USERNAME; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_USERS_USERNAME" ON public."USERS" USING btree ("USERNAME");


--
-- TOC entry 4940 (class 1259 OID 110765)
-- Name: IDX_d3bd9bead05f4d2521b2ffe1a8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d3bd9bead05f4d2521b2ffe1a8" ON public."MENU_OPTIONS_X_ROLES" USING btree ("MENU_OPTION_ID");


--
-- TOC entry 5005 (class 2606 OID 110766)
-- Name: USERS FK_1b85e2063e5a2fd607568dbe803; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "FK_1b85e2063e5a2fd607568dbe803" FOREIGN KEY ("MODULE_ID") REFERENCES public."MODULE"("MODULE_ID");


--
-- TOC entry 4989 (class 2606 OID 110771)
-- Name: ACTIVITY_LOG FK_22655a7b2a103dec25107c5d076; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ACTIVITY_LOG"
    ADD CONSTRAINT "FK_22655a7b2a103dec25107c5d076" FOREIGN KEY ("USER_ID") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4993 (class 2606 OID 110776)
-- Name: PERMISSION_X_ROLE FK_24cb3d11068904d9544b5add23b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "FK_24cb3d11068904d9544b5add23b" FOREIGN KEY ("PERMISSION_ID") REFERENCES public."PERMISSION"("PERMISSION_ID");


--
-- TOC entry 4991 (class 2606 OID 110781)
-- Name: MENU_OPTIONS_X_ROLES FK_2c7ac3fef525331bd30141dafb7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MENU_OPTIONS_X_ROLES"
    ADD CONSTRAINT "FK_2c7ac3fef525331bd30141dafb7" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 5008 (class 2606 OID 111253)
-- Name: GOAL_X_STAFF FK_3a48e234c55c19df9fa47787522; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_STAFF"
    ADD CONSTRAINT "FK_3a48e234c55c19df9fa47787522" FOREIGN KEY ("PERIOD_ID") REFERENCES public."PERIOD"("PERIOD_ID") ON DELETE RESTRICT;


--
-- TOC entry 4996 (class 2606 OID 110786)
-- Name: ROLES_X_USER FK_6014c0ac471a029270386464b0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "FK_6014c0ac471a029270386464b0e" FOREIGN KEY ("USER_ID") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 5001 (class 2606 OID 110791)
-- Name: STAFF FK_6959a222385d4145719ceb62226; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "FK_6959a222385d4145719ceb62226" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4998 (class 2606 OID 110796)
-- Name: ROLE_X_PERMISSION FK_7a73adef6a37de3385f3c262dce; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE_X_PERMISSION"
    ADD CONSTRAINT "FK_7a73adef6a37de3385f3c262dce" FOREIGN KEY ("PERMISSION_ID") REFERENCES public."PERMISSION"("PERMISSION_ID");


--
-- TOC entry 4992 (class 2606 OID 110801)
-- Name: MODULE FK_8b35e265973ca359f88acc0003a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MODULE"
    ADD CONSTRAINT "FK_8b35e265973ca359f88acc0003a" FOREIGN KEY ("SUPERVISOR_ID") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4990 (class 2606 OID 110806)
-- Name: DEPARTMENT FK_acec9f72e1346671835b0b5ecb7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DEPARTMENT"
    ADD CONSTRAINT "FK_acec9f72e1346671835b0b5ecb7" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4994 (class 2606 OID 110811)
-- Name: PERMISSION_X_ROLE FK_ae267066b6f7555d2adb197c85a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PERMISSION_X_ROLE"
    ADD CONSTRAINT "FK_ae267066b6f7555d2adb197c85a" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 5010 (class 2606 OID 111258)
-- Name: GOAL_X_MODULE FK_b079b08e005d25756d8300a0568; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_X_MODULE"
    ADD CONSTRAINT "FK_b079b08e005d25756d8300a0568" FOREIGN KEY ("PERIOD_ID") REFERENCES public."PERIOD"("PERIOD_ID") ON DELETE RESTRICT;


--
-- TOC entry 4999 (class 2606 OID 110816)
-- Name: ROLE_X_PERMISSION FK_b58460781260bd2b802546df081; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE_X_PERMISSION"
    ADD CONSTRAINT "FK_b58460781260bd2b802546df081" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 5006 (class 2606 OID 110821)
-- Name: USERS FK_c477bdfa53cec3db27eb50458f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "FK_c477bdfa53cec3db27eb50458f8" FOREIGN KEY ("STAFF_ID") REFERENCES public."STAFF"("STAFF_ID");


--
-- TOC entry 5003 (class 2606 OID 110826)
-- Name: STAFF_X_MODULE FK_c7df3e8d6f2a40ba46084c64c39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF_X_MODULE"
    ADD CONSTRAINT "FK_c7df3e8d6f2a40ba46084c64c39" FOREIGN KEY ("STAFF_ID") REFERENCES public."STAFF"("STAFF_ID");


--
-- TOC entry 4997 (class 2606 OID 110831)
-- Name: ROLES_X_USER FK_cfb5ba942f33086e54cec026244; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLES_X_USER"
    ADD CONSTRAINT "FK_cfb5ba942f33086e54cec026244" FOREIGN KEY ("ROLE_ID") REFERENCES public."ROLE"("ROLE_ID");


--
-- TOC entry 5002 (class 2606 OID 110836)
-- Name: STAFF FK_d11fbcc2e9a1b168e05a1251c2e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF"
    ADD CONSTRAINT "FK_d11fbcc2e9a1b168e05a1251c2e" FOREIGN KEY ("MODULE_ID") REFERENCES public."MODULE"("MODULE_ID");


--
-- TOC entry 5004 (class 2606 OID 110841)
-- Name: STAFF_X_MODULE FK_d24accafdc1ea2253b404678408; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."STAFF_X_MODULE"
    ADD CONSTRAINT "FK_d24accafdc1ea2253b404678408" FOREIGN KEY ("MODULE_ID") REFERENCES public."MODULE"("MODULE_ID");


--
-- TOC entry 5009 (class 2606 OID 111248)
-- Name: GOAL_PROGRESS FK_ebee84489b1c79d37f4c4cab7cc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GOAL_PROGRESS"
    ADD CONSTRAINT "FK_ebee84489b1c79d37f4c4cab7cc" FOREIGN KEY ("PERIOD_ID") REFERENCES public."PERIOD"("PERIOD_ID") ON DELETE RESTRICT;


--
-- TOC entry 5000 (class 2606 OID 110846)
-- Name: ROLE_X_PERMISSION FK_efb2dfed9dad6cb277a5897e010; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE_X_PERMISSION"
    ADD CONSTRAINT "FK_efb2dfed9dad6cb277a5897e010" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 5007 (class 2606 OID 110851)
-- Name: USERS FK_f6c2423fd7a3b24eae6c372cc57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "FK_f6c2423fd7a3b24eae6c372cc57" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 4995 (class 2606 OID 110856)
-- Name: ROLE FK_fd9db9681674bb23b2e69b2dc28; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ROLE"
    ADD CONSTRAINT "FK_fd9db9681674bb23b2e69b2dc28" FOREIGN KEY ("CREATED_BY") REFERENCES public."USERS"("USER_ID");


--
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-09-10 18:52:44

--
-- PostgreSQL database dump complete
--

