CREATE TABLE public.ticket
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(100) NOT NULL,
    description character varying(512) NOT NULL,
    genre character varying(100) NOT NULL,
    type character varying(100) NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    event_date timestamp with time zone NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);