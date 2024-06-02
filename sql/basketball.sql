-- felhasznaloi tabla letrehozasa
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  email VARCHAR(255) NOT NULL,       -- felhasznaloi email cim
  password VARCHAR(255) NOT NULL,    -- felhasznaloi jelszo
  name VARCHAR(255) NOT NULL,        -- felhasznaloi nev
  role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user', -- felhasznaloi szerepkor
  status VARCHAR(50),                -- felhasznaloi statusz
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- regisztracio datuma
);

-- csapatok tabla letrehozasa
CREATE TABLE Teams (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  name VARCHAR(255) NOT NULL,        -- csapat neve
  city VARCHAR(255) NOT NULL         -- csapat varosa
);

-- arenak tabla letrehozasa
CREATE TABLE Arenas (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  name VARCHAR(255) NOT NULL,        -- arena neve
  city VARCHAR(255) NOT NULL         -- arena varosa
);

-- meccsek tabla letrehozasa
CREATE TABLE Games (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  home_team_id INT,                  -- hazai csapat azonosito (kulso kulcs)
  away_team_id INT,                  -- vendeg csapat azonosito (kulso kulcs)
  arena_id INT,                      -- arena azonosito (kulso kulcs)
  game_date TIMESTAMP NOT NULL,      -- meccs datuma es idopontja
  FOREIGN KEY (home_team_id) REFERENCES Teams(id), -- kapcsolat a Teams tablaval (hazai csapat)
  FOREIGN KEY (away_team_id) REFERENCES Teams(id), -- kapcsolat a Teams tablaval (vendeg csapat)
  FOREIGN KEY (arena_id) REFERENCES Arenas(id)     -- kapcsolat az Arenas tablaval
);

-- jegyek tabla letrehozasa
CREATE TABLE Tickets (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  user_id INT,                       -- felhasznaloi azonosito (kulso kulcs)
  game_id INT,                       -- meccs azonosito (kulso kulcs)
  seat VARCHAR(50) NOT NULL,         -- ulohely
  price DECIMAL(10, 2) NOT NULL,     -- jegy ara
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- vasarlas datuma
  FOREIGN KEY (user_id) REFERENCES Users(id), -- kapcsolat a Users tablaval
  FOREIGN KEY (game_id) REFERENCES Games(id)  -- kapcsolat a Games tablaval
);

-- forum bejegyzesek tabla letrehozasa
CREATE TABLE Posts (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  user_id INT,                       -- felhasznaloi azonosito (kulso kulcs)
  title VARCHAR(255) NOT NULL,       -- bejegyzes cime
  content TEXT NOT NULL,             -- bejegyzes tartalma
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- letrehozas datuma
  FOREIGN KEY (user_id) REFERENCES Users(id) -- kapcsolat a Users tablaval
);

-- forum hozzaszolasok tabla letrehozasa
CREATE TABLE Comments (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  post_id INT,                       -- bejegyzes azonosito (kulso kulcs)
  user_id INT,                       -- felhasznaloi azonosito (kulso kulcs)
  content TEXT NOT NULL,             -- hozzaszolas tartalma
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- letrehozas datuma
  FOREIGN KEY (post_id) REFERENCES Posts(id), -- kapcsolat a Posts tablaval
  FOREIGN KEY (user_id) REFERENCES Users(id)  -- kapcsolat a Users tablaval
);

-- kepek tabla letrehozasa
CREATE TABLE Photos (
  id INT PRIMARY KEY AUTO_INCREMENT, -- egyedi azonosito (automatikusan novekvo)
  user_id INT,                       -- felhasznaloi azonosito (kulso kulcs)
  file_name VARCHAR(255),            -- fajl neve
  file_path VARCHAR(255),            -- fajl eleresi utja
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- feltoltes datuma
  FOREIGN KEY (user_id) REFERENCES Users(id) -- kapcsolat a Users tablaval
);

-- felhasznaloi adatok beszurasa
INSERT INTO Users (email, password, name, `role`, status)
VALUES 
('lebron.james@example.com', 'lebron123', 'LeBron James', 'user', 'active'),
('steph.curry@example.com', 'curry30', 'Stephen Curry', 'moderator', 'active'),
('giannis.antetokounmpo@example.com', 'greekfreak', 'Giannis Antetokounmpo', 'user', 'active'),
('kevin.durant@example.com', 'durantula', 'Kevin Durant', 'admin', 'active'),
('kawhi.leonard@example.com', 'kawhi2', 'Kawhi Leonard', 'user', 'active'),
('james.harden@example.com', 'harden13', 'James Harden', 'moderator', 'active'),
('luka.doncic@example.com', 'luka77', 'Luka Doncic', 'user', 'active'),
('zion.williamson@example.com', 'zion1', 'Zion Williamson', 'user', 'active'),
('nikola.jokic@example.com', 'joker15', 'Nikola Jokic', 'user', 'active'),
('damian.lillard@example.com', 'dame0', 'Damian Lillard', 'user', 'active');

-- csapatok beszurasa
INSERT INTO Teams (name, city)
VALUES 
('Los Angeles Lakers', 'Los Angeles'),
('Golden State Warriors', 'San Francisco'),
('Boston Celtics', 'Boston'),
('Brooklyn Nets', 'Brooklyn'),
('Miami Heat', 'Miami'),
('Milwaukee Bucks', 'Milwaukee'),
('Dallas Mavericks', 'Dallas'),
('Phoenix Suns', 'Phoenix'),
('Philadelphia 76ers', 'Philadelphia'),
('Chicago Bulls', 'Chicago'),
('Toronto Raptors', 'Toronto'),
('Indiana Pacers', 'Indianapolis'),
('New York Knicks', 'New York'),
('Atlanta Hawks', 'Atlanta'),
('San Antonio Spurs', 'San Antonio'),
('Memphis Grizzlies', 'Memphis'),
('Houston Rockets', 'Houston'),
('Los Angeles Clippers', 'Los Angeles'),
('Utah Jazz', 'Salt Lake City'),
('Sacramento Kings', 'Sacramento');

-- arenak beszurasa
INSERT INTO Arenas (name, city)
VALUES 
('Staples Center', 'Los Angeles'),
('Chase Center', 'San Francisco'),
('TD Garden', 'Boston'),
('Barclays Center', 'Brooklyn'),
('American Airlines Arena', 'Miami'),
('Fiserv Forum', 'Milwaukee'),
('American Airlines Center', 'Dallas'),
('Talking Stick Resort Arena', 'Phoenix'),
('Wells Fargo Center', 'Philadelphia'),
('United Center', 'Chicago'),
('Scotiabank Arena', 'Toronto'),
('Bankers Life Fieldhouse', 'Indianapolis'),
('Madison Square Garden', 'New York'),
('State Farm Arena', 'Atlanta'),
('AT&T Center', 'San Antonio'),
('FedExForum', 'Memphis'),
('Toyota Center', 'Houston'),
('Staples Center', 'Los Angeles'),
('Vivint Smart Home Arena', 'Salt Lake City'),
('Golden 1 Center', 'Sacramento');

-- meccsek beszurasa
INSERT INTO Games (home_team_id, away_team_id, arena_id, game_date)
VALUES 
(1, 2, 1, '2023-10-25 19:00:00'), -- lakers vs. warriors
(3, 4, 3, '2023-11-10 20:00:00'), -- celtics vs. nets
(5, 6, 5, '2023-12-05 18:30:00'), -- heat vs. bucks
(7, 8, 7, '2023-12-20 20:00:00'), -- mavericks vs. suns
(9, 10, 9, '2023-11-15 19:30:00'), -- 76ers vs. bulls
(11, 12, 11, '2023-12-10 18:00:00'), -- raptors vs. pacers
(13, 14, 13, '2023-12-25 17:00:00'), -- knicks vs. hawks
(15, 16, 15, '2024-01-10 20:00:00'), -- spurs vs. grizzlies
(17, 18, 17, '2024-01-20 19:30:00'), -- rockets vs. clippers
(19, 20, 19, '2024-02-15 20:00:00'); -- jazz vs. kings

-- jegy adatok beszurasa
INSERT INTO Tickets (user_id, game_id, seat, price, purchase_date)
VALUES 
(1, 1, 'A12', 150.00, '2023-10-25 19:00:00'), -- lakers vs. warriors
(2, 2, 'B22', 200.00, '2023-11-10 20:00:00'), -- celtics vs. nets
(3, 3, 'C18', 180.00, '2023-12-05 18:30:00'), -- heat vs. bucks
(4, 4, 'D16', 220.00, '2023-12-20 20:00:00'), -- mavericks vs. suns
(5, 5, 'E14', 130.00, '2023-11-15 19:30:00'), -- 76ers vs. bulls
(6, 6, 'F11', 145.00, '2023-12-10 18:00:00'), -- raptors vs. pacers
(7, 7, 'G10', 160.00, '2023-12-25 17:00:00'), -- knicks vs. hawks
(8, 8, 'H9', 125.00, '2024-01-10 20:00:00'), -- spurs vs. grizzlies
(9, 9, 'I8', 175.00, '2024-01-20 19:30:00'), -- rockets vs. clippers
(10, 10, 'J7', 135.00, '2024-02-15 20:00:00'); -- jazz vs. kings

-- forum bejegyzesek beszurasa
INSERT INTO Posts (user_id, title, content)
VALUES 
(1, 'Upcoming Lakers vs. Warriors Game', 'can''t wait for the lakers vs. warriors game! who else is going?'),
(2, 'Best Seats in the House?', 'what are the best seats to watch a game at the td garden?'),
(3, 'Heat vs. Bucks Predictions', 'who do you think will win the upcoming heat vs. bucks game?'),
(4, 'Mavericks vs. Suns: Key Players to Watch', 'who are the key players to watch in the mavericks vs. suns game?'),
(5, '76ers vs. Bulls Matchup', 'any thoughts on the 76ers vs. bulls game next week?'),
(6, 'Raptors vs. Pacers Tickets', 'where can i find cheap tickets for the raptors vs. pacers game?'),
(7, 'Knicks vs. Hawks Christmas Game', 'who else is excited for the knicks vs. hawks game on christmas?'),
(8, 'Spurs vs. Grizzlies Analysis', 'what are your thoughts on the upcoming spurs vs. grizzlies game?'),
(9, 'Rockets vs. Clippers Strategy', 'what should be the rockets'' strategy against the clippers?'),
(10, 'Jazz vs. Kings Predictions', 'who do you think will win the jazz vs. kings game?');

-- forum hozzaszolasok beszurasa
INSERT INTO Comments (user_id, post_id, content)
VALUES 
(2, 1, 'i’ll be there! got my tickets already.'),
(3, 1, 'can’t wait! go lakers!'),
(4, 1, 'warriors will win for sure!'),
(5, 2, 'i recommend seats in the lower bowl. great view and atmosphere.'),
(6, 2, 'club level seats are the best!'),
(7, 3, 'i think the bucks have a good chance.'),
(8, 3, 'heat all the way!'),
(9, 4, 'keep an eye on luka doncic. he’s been on fire this season.'),
(10, 4, 'devin booker is definitely a player to watch.'),
(1, 5, '76ers will dominate!'),
(2, 5, 'bulls have a strong lineup this year.'),
(3, 6, 'check out secondary markets for cheaper tickets.'),
(4, 6, 'try the team’s official website first.'),
(5, 7, 'christmas games are always special.'),
(6, 7, 'i hope the knicks win this one.'),
(7, 8, 'spurs have a solid defense.'),
(8, 8, 'grizzlies might surprise us.'),
(9, 9, 'rockets need to improve their defense.'),
(10, 9, 'clippers have a strong offense.'),
(1, 10, 'jazz will take this one.'),
(2, 10, 'kings have been playing well lately.');

-- kepek beszurasa
INSERT INTO Photos (user_id, file_name, file_path)
VALUES 
(1, 'photo1.jpg', '/images/photo1.jpg'),
(2, 'photo2.jpg', '/images/photo2.jpg'),
(3, 'photo3.jpg', '/images/photo3.jpg'),
(4, 'photo4.jpg', '/images/photo4.jpg'),
(5, 'photo5.jpg', '/images/photo5.jpg'),
(6, 'photo6.jpg', '/images/photo6.jpg'),
(7, 'photo7.jpg', '/images/photo7.jpg'),
(8, 'photo8.jpg', '/images/photo8.jpg'),
(9, 'photo9.jpg', '/images/photo9.jpg'),
(10, 'photo10.jpg', '/images/photo10.jpg');
