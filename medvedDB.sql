--
-- Файл сгенерирован с помощью SQLiteStudio v3.4.4 в Чт окт 31 23:35:49 2024
--
-- Использованная кодировка текста: UTF-8
--

use medveddb;

drop table cms_data;
drop table orders;
drop table products;

-- Таблица: cms_data
CREATE TABLE cms_data (
    page VARCHAR(20) NOT NULL,
    section VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'index',
                         'wood_product_desc',
                         'Описание древесных изделий',
                         'Деревянные доски разных сортов, брусья, вырезные изделия такие как:

- Пластина
- Необрезанная доска
- Трёхактный брус с обзолом
- Строганные шпунтованные изделияcvc'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'index',
                         'wood_desc',
                         'Описание дров',
                         'Дрова березовые, осиновые, ольховые. Чистая древесина без трухи, гнили и грязи!



    - Собственное производство

    - Лес зимней заготовки

    - Доставка в день заказа

    - Возможен самовывоз



Доставляем дрова начиная от 2 кубометров! Доставка ежедневно без выходных дней, в любое удобное для Вас время, предварительно согласовав день и время доставки. Для доставки дров имеется свой автопарк, состоящий из более тридцати грузовиков, которые готовы доставить Вам дрова практически в любое место Санкт-Петербурга и Ленинградской области.'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'index',
                         'header_desc',
                         'Текст шапки',
                         'Доставка дров, древесных изделий, перевозка грузов, расчистка участков от древесных насаждений fdfd'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'index',
                         'company_desc',
                         'Описание компании',
                         'Мы производим различные древесные изделия по доступным ценам. В
            ассортимент нашей продукции входят дрова, доски, брусья, пластины и
            другие изделия. Также мы предоставляем услуги по расчистке древесных
            насаждений.
Мы гарантируем высокое качество нашей продукции и доступные
            цены!'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'contacts',
                         'email',
                         'Email',
                         'medved-vyborg@yandex.rudf hgh'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'contacts',
                         'adress',
                         'Адрес',
                         ' г. Выборг, ул. Кривоносова, д. 13, офис 231 hgh'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'contacts',
                         'telephone',
                         'Телефон',
                         '+7 (931) 432-55-44 gfg'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'index',
                         'telephone',
                         'Телефон',
                         '+7 (931) 432-55-44 gfg'
                     );

INSERT INTO cms_data (
                         page,
                         section,
                         name,
                         content
                     )
                     VALUES (
                         'catalog',
                         'telephone',
                         'Телефон',
                         '+7 (931) 432-55-44 gfg'
                     );


-- Таблица: orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT UNIQUE NOT NULL,
    client VARCHAR(20) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    cart TEXT NOT NULL,
    cart_count SMALLINT NOT NULL,
    order_notes TEXT NOT NULL,
    request_type VARCHAR(8) NOT NULL,
    status VARCHAR(11) NOT NULL,
    date TIMESTAMP NOT NULL
);

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       1,
                       'Игорь',
                       '+75545455454',
                       '[{"id":"2","img":"no_img.jpg","title":"Брус двухактный","price":"1200","count":5},{"id":"4","img":"no_img.jpg","title":"Доски вагонка","price":"600","count":3}]',
                       8,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-06-11'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       3,
                       'Игорь',
                       '+75545455454',
                       '[{"id":"2","img":"no_img.jpg","title":"Брус двухактный","price":"1200","count":5},{"id":"18","img":"wood1.jpg","title":"Дрова берёза2","price":"2500","count":3}]',
                       8,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-06-11'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       4,
                       'Олег',
                       '+79316557892',
                       '[{"id":"1","img":"no_img.jpg","title":"Пластина","price":"1800","count":4},{"id":"2","img":"no_img.jpg","title":"Брус двухактный","price":"1200","count":6},{"id":"3","img":"no_img.jpg","title":"Брус трёхактный","price":"1500","count":3},{"id":"18","img":"wood1.jpg","title":"Дрова берёза2","price":"2500","count":7}]',
                       20,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-06-11'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       5,
                       'Алексей',
                       '+79314556732',
                       '[{"id":"1","img":"no_img.jpg","title":"Пластина","price":"1800","count":9},{"id":"3","img":"no_img.jpg","title":"Брус трёхактный","price":"1500","count":6},{"id":"4","img":"no_img.jpg","title":"Доски вагонка","price":"600","count":4},{"id":"5","img":"no_img.jpg","title":"Ольховые дрова","price":"1500","count":9},{"id":"6","img":"no_img.jpg","title":"Берёзовые дрова","price":"1300","count":5},{"id":"7","img":"no_img.jpg","title":"Осиновые дрова","price":"1300","count":3},{"id":"18","img":"wood1.jpg","title":"Дрова берёза2","price":"2500","count":5}]',
                       41,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-06-12'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       8,
                       'Владимир',
                       '+7931365848',
                       '[{"id":"1","img":"product1.jpg","title":"Пластина","price":"1800","count":14},{"id":"2","img":"product2.jpg","title":"Брус двухкантный","price":"1200","count":4},{"id":"3","img":"product3.jpg","title":"Брус трёхкантный","price":"2500","count":3},{"id":"4","img":"product4.jpg","title":"Доски вагонка","price":"600","count":7},{"id":"5","img":"product5.jpeg","title":"Ольховые дрова","price":"1500","count":4},{"id":"6","img":"product7.jpg","title":"Берёзовые дрова","price":"1300","count":2}]',
                       34,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-06-15'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       9,
                       'Антон',
                       '+7931355234',
                       '[{"id":"2","img":"product2.jpg","title":"Брус двухкантный","price":"1200","count":7},{"id":"3","img":"product3.jpg","title":"Брус трёхкантный","price":"2500","count":1},{"id":"4","img":"product4.jpg","title":"Доски вагонка","price":"600","count":5},{"id":"6","img":"product7.jpg","title":"Берёзовые дрова","price":"1300","count":3},{"id":"7","img":"product6.jpeg","title":"Осиновые дрова","price":"1300","count":1}]',
                       17,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-07-22'
                   );

INSERT INTO orders (
                       id,
                       client,
                       telephone,
                       cart,
                       cart_count,
                       order_notes,
                       request_type,
                       status,
                       date
                   )
                   VALUES (
                       10,
                       'hghgg',
                       '434434',
                       '[{"id":"2","img":"product2.jpg","title":"Брус двухкантный","price":"1200","count":6},{"id":"3","img":"product3.jpg","title":"Брус трёхкантный","price":"2500","count":1},{"id":"4","img":"product4.jpg","title":"Доски вагонка","price":"600","count":1}]',
                       8,
                       'dfdfdfdfd',
                       'корзина',
                       'new',
                       '2023-08-02'
                   );


-- Таблица: products
CREATE TABLE products (
    id SMALLINT PRIMARY KEY AUTO_INCREMENT UNIQUE NOT NULL,
    title TINYTEXT NOT NULL,
    description TINYTEXT NOT NULL,
    price INT NOT NULL,
    img VARCHAR(30) NOT NULL
);

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         1,
                         'Пластина',
                         '- Хорошее качество

- Быстрая доставкаdfdf',
                         1800,
                         'product1.jpg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         2,
                         'Брус двухкантный',
                         '- Хорошее качество

- Быстрая доставка',
                         1200,
                         'product2.jpg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         3,
                         'Брус трёхкантный',
                         '- Хорошее качество

- Быстрая доставка',
                         2500,
                         'product3.jpg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         4,
                         'Доски вагонка',
                         '- Хорошее качество

- Быстрая доставка',
                         600,
                         'product4.jpg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         5,
                         'Ольховые дрова',
                         '- Хорошее качество

- Быстрая доставка

- Без гнили',
                         1500,
                         'product5.jpeg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         6,
                         'Берёзовые дрова',
                         'На 15% больше жара

- Долго горят

- Не стреляют и не искрят

- Полностью прогорают

- Оставляют хорошие жаркие 

   угли',
                         1300,
                         'product7.jpg'
                     );

INSERT INTO products (
                         id,
                         title,
                         description,
                         price,
                         img
                     )
                     VALUES (
                         7,
                         'Осиновые дрова',
                         '- Хорошее качество

- Быстрая доставка

- Без гнили',
                         1300,
                         'product6.jpeg'
                     );



