CREATE TABLE public.order_item
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL,
    ticket_id uuid NOT NULL,
    value integer NOT NULL,
    quantity integer NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id)
        REFERENCES public."order" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    FOREIGN KEY (ticket_id)
        REFERENCES public.ticket (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);