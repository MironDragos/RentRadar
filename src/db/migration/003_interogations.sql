--DELETE FROM offer_type 
--WHERE offer_type NOT IN ('Vând', 'De închiriat lunar', 'De închiriat pe zi');

SELECT offer_type,AVG(price)/AVG(m2) as price_for_m2 FROM listing GROUP BY offer_type
