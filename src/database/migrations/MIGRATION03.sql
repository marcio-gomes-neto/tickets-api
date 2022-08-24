CREATE TABLE public."user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    cpf character varying(11)[] NOT NULL,
    name character varying(100)[] NOT NULL,
	email character varying(255)[] NOT NULL,
    admin boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);