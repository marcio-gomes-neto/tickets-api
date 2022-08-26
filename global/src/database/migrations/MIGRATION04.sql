CREATE TABLE public."order"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    value integer NOT NULL,
    payment_type character varying(50) NOT NULL,
    quantity integer NOT NULL,
    status character varying(50) NOT NULL DEFAULT 'open',
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);