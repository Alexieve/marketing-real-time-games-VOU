DROP TABLE GAMECONFIG CASCADE;

DROP TABLE GAMEITEM CASCADE;

DROP TABLE EXCHANGELOG CASCADE;

DROP TABLE EVENTGAMECONFIG CASCADE;

DROP TABLE EVENTGAMEITEM CASCADE;

DROP TABLE PLAYLOG CASCADE;



-- Creating table for 'GameConfig'
CREATE TABLE GameConfig (
    GameID SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    imageUrl VARCHAR(255),
    isExchange BOOLEAN,
    guide TEXT
);

-- Creating table for 'GameItem'
CREATE TABLE GameItem (
    ItemID SERIAL PRIMARY KEY,
    GameID INT,
    name VARCHAR(255),
    imageUrl VARCHAR(255),
    description VARCHAR(255),
    FOREIGN KEY (GameID) REFERENCES GameConfig(GameID)
);

-- Creating table for 'EventGame'
CREATE TABLE EventGameConfig (
    EventID TEXT PRIMARY KEY,
    GameID INT,
    playTurn INT,
    FOREIGN KEY (GameID) REFERENCES GameConfig(GameID)
);

-- Creating table for 'EventGameItem'
CREATE TABLE EventGameItem (
    CustomerID INT,
    EventID TEXT,
    ItemID INT,
    Quantity INT,
    PRIMARY KEY (CustomerID, EventID, ItemID),
    FOREIGN KEY (EventID) REFERENCES EventGameConfig(EventID),
    FOREIGN KEY (ItemID) REFERENCES GameItem(ItemID)
);

-- Creating table for 'ExchangeLog'
CREATE TABLE ExchangeLog (
    CustomerID INT,
    EventID TEXT,
	TimeExchange TIMESTAMP,
    ItemID INT,
	Quantity INT,
	Description TEXT,
    PRIMARY KEY (CustomerID, EventID, TimeExchange, ItemID),
    FOREIGN KEY (CustomerID, EventID, ItemID) REFERENCES EventGameItem(CustomerID, EventID, ItemID)
);

-- Creating table for 'PlayLog'
CREATE TABLE PlayLog (
    CustomerID INT,
    EventID TEXT,
    Time TIMESTAMP,
    PRIMARY KEY (CustomerID, EventID, Time),
    FOREIGN KEY (EventID) REFERENCES EventGameConfig(EventID)
);


INSERT INTO GameConfig (NAME, TYPE, IMAGEURL, ISEXCHANGE, GUIDE) 
VALUES
('HQ Trivia', 'Quiz', '/assets/game/HQ.png', FALSE, 'HQ Trivia guide'),
('Lắc xì', 'Collect items', '/assets/game/lac_xi.jpg', TRUE, 'Lắc xì guide');

INSERT INTO GameItem (GameID, name, imageUrl, description) 
VALUES 
(1, 'HQ Point', '/assets/item/Point.png', 'HQ Point'),
(2, 'Lắc xì Coin', '/assets/item/Coin.png', 'A collectible coin in Lắc xì.'),
(2, 'Lắc xì Diamond', '/assets/item/Diamond.png', 'A rare diamond in Lắc xì.'),
(2, 'Lắc xì Gem', '/assets/item/Gem.png', 'A precious gem in Lắc xì.'),
(2, 'Lắc xì Badge', '/assets/item/Badge.png', 'A badge awarded in Lắc xì events.'),
(2, 'Lắc xì Token', '/assets/item/Token.png', 'A special token for Lắc xì exchanges.'),
(2, 'Lắc xì Trophy', '/assets/item/Trophy.png', 'A trophy for top players in Lắc xì.');