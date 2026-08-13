-- creez tabel pentru list individual id_intern, id_extern, titlu, pret, m2, zona, camere, tip(chirie/vanzare), activ
CREATE TABLE listing(
    id SERIAL PRIMARY KEY,
    id_extern varchar(64) UNIQUE NOT NULL,
    title varchar(64) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    m2 DECIMAL(5,1) NOT NULL,
    zone varchar(64) NOT NULL,
    rooms INT NOT NULL,
    floor INT NOT NULL,
    offer_type varchar(64) NOT NULL,
    link TEXT NOT NULL,
    first_date DATE DEFAULT NOW(),
    last_check DATE,
    active BOOLEAN DEFAULT true
);

CREATE TABLE price_history(
    id SERIAL PRIMARY KEY ,
    property_id INT REFERENCES listing(id) ON DELETE CASCADE,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    date_change DATE DEFAULT NOW()
);