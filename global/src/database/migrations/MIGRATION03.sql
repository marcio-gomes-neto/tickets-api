CREATE TABLE public."user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    cpf character varying(11) NOT NULL,
    email character varying(255) NOT NULL,
    email_verification character varying(255),
    password character varying(512) NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(50) NOT NULL,
    status character varying(20) NOT NULL DEFAULT 'waiting-verification',
    admin boolean NOT NULL DEFAULT false,
    created_at time with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, cpf),
    UNIQUE(id, cpf, email)
);