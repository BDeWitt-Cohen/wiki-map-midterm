DELETE FROM users;
DELETE FROM maps;
DELETE FROM pins;
DELETE FROM favorites;


INSERT INTO users (username, email, password) VALUES ('landongt', 'landontipantiza@gmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('BDeWitt-Cohen', 'BDeWitt-Cohen@hotmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES (' cjfelice', 'cjfelice@hotmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES ('randomUserName1', 'randomUserName1@gmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES ('randomUserName2', 'randomUserName2@hotmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES ('randomUserName3', 'randomUserName3@gmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES ('randomUserName4', 'randomUserName4@hotmail.com', 'password'));
INSERT INTO users (username, email, password) VALUES ('randomUserName5', 'randomUserName5@gmail.com', 'password'));


INSERT INTO maps (user_id, title, description) VALUES (1, 'Best Pubs In Calgary', "I've worked long and hard to find the best pubs in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."));
INSERT INTO maps (user_id, title, description) VALUES (2, 'Best Coffee In Calgary', "I've worked long and hard to find the best Coffee in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."));
INSERT INTO maps (user_id, title, description) VALUES (3, 'Best Sandwhiches In Calgary', "I've worked long and hard to find the best Sandwhiches in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."));
INSERT INTO maps (user_id, title, description) VALUES (1, 'Best Wings In Calgary', "I've worked long and hard to find the best Wings in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."));
INSERT INTO maps (user_id, title, description) VALUES (1, 'Best Malls In Calgary', "I've worked long and hard to find the best Malls in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."));


-- Best Pubs In Calgary
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 1, 51.043602, -114.065446, "Bottlescrew Bill's Pub is greatttt"));
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 1, 1.016280, -114.108436, "I freaken love this place you have to see it"));

-- Best Coffee In Calgary
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (2, 2, 51.047838, -114.049879, "its a must go!!"));
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (2, 2, 51.043076, -114.090010, "You'll be obssessed with this place!"));

-- Best Sandwhiches In Calgary
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (3, 3, 51.044770, -114.065782, "crazy good, trust!!!"));
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (3, 3, 50.998403, -114.069985, "if you dont go here youre crazy"));


-- Best Wings In Calgary
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 4, 51.043602, -114.065446, "truly amzaing"));
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 4, 51.076588, -113.988063, "so delicous"));

-- Best Malls In Calgary
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 5, 51.043602, -114.065446, "They have the best cloths in town"));
INSERT INTO pins (user_id, map_id, long, lat, description) VALUES (1, 5, 51.043602, -114.065446, "Super high fashion!"));
