DELETE FROM users;
DELETE FROM maps;
DELETE FROM pins;
DELETE FROM favorites;


INSERT INTO users (username, email, password) VALUES ('landongt', 'landontipantiza@gmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('BDeWitt-Cohen', 'BDeWitt-Cohen@hotmail.com', 'password');
INSERT INTO users (username, email, password) VALUES (' cjfelice', 'cjfelice@hotmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('randomUserName1', 'randomUserName1@gmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('randomUserName2', 'randomUserName2@hotmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('randomUserName3', 'randomUserName3@gmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('randomUserName4', 'randomUserName4@hotmail.com', 'password');
INSERT INTO users (username, email, password) VALUES ('randomUserName5', 'randomUserName5@gmail.com', 'password');


INSERT INTO maps (user_id, title, description) VALUES (1, 'Best Pubs In Calgary', 'I''ve worked long and hard to find the best pubs in calgary. I can die peacefully knowing ive accomplished everything i''ve set out to do.');
INSERT INTO maps (user_id, title, description) VALUES (2, 'Best Coffee In Calgary', 'I''ve worked long and hard to find the best Coffee in calgary. I can die peacefully knowing i''ve accomplished everything ive set out to do.');
INSERT INTO maps (user_id, title, description) VALUES (3, 'Best Sandwiches In Calgary', 'I''ve worked long and hard to find the best Sandwhiches in calgary. I can die peacefully knowing i''ve accomplished everything ive set out to do.');
INSERT INTO maps (user_id, title, description) VALUES (2, 'Best Wings In Calgary',  'I''ve worked long and hard to find the best Wings in calgary. I can die peacefully knowing i''ve accomplished everything ive set out to do.');
INSERT INTO maps (user_id, title, description) VALUES (1, 'Best Malls In Calgary', 'I''ve worked long and hard to find the best Malls in calgary. I can die peacefully knowing i''ve accomplished everything ive set out to do.');
INSERT INTO maps (user_id, title, description) VALUES (2, 'Best Billiards In Calgary', 'I''ve worked long and hard to find the best pool halls in calgary. I can die peacefully knowing i''ve accomplished everything ive set out to do.');

-- Best Pubs In Calgary
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Bottlescrew Bill''s Pub', 1, 1, 51.043602, -114.065446, ' -Bottlescrew Bill''s Pub is greatttt');
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('The Ship & Anchor', 1, 1, 51.038014, -114.073747, ' -I freaken love this place you have to see it');

-- Best Coffee In Calgary
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Phil & Sebastian Coffee Roasters', 2, 2, 51.047838, -114.049879, ' -it''s a must go!!');
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('société Coffee Lounge', 2, 2, 51.043076, -114.090010, ' -You''ll be obssessed with this place!');

-- Best Sandwhiches In Calgary
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Meat And Bread', 3, 3, 51.044770, -114.065782, ' -crazy good, trust!!!');
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Keith''s Deli', 3, 3, 50.998403, -114.069985, ' -if you dont go here youre crazy');


-- Best Wings In Calgary
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Mug Shotz Sports Bar & Grill', 1, 4, 51.029328, -114.030150, '  -truly amzaing');
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('Buffalo Wild Wings',1, 4, 51.076588, -113.988063, ' -so delicous');

-- Best Malls In Calgary
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('CORE Shopping Centre', 1, 5, 51.046010, -114.069139, ' -They have the best cloths in town');
INSERT INTO pins (name, user_id, map_id, long, lat, description) VALUES ('CF Market Mall', 1, 5, 51.084566, -114.155404, ' -Super high fashion!');

-- Best Pool Halls In Calgary
INSERT INTO pins (user_id, map_id, name, long, lat, description) VALUES (2, 6, 'Chill Billiards', 50.932518, -114.067396, ' -This place is pretty chill');
INSERT INTO pins (user_id, map_id, name,  long, lat, description) VALUES (2, 6, 'Leather Pocket', 51.085722, -114.052332, ' -Got hustled here a couple times.');
INSERT INTO pins (user_id, map_id, name, long, lat, description) VALUES (2, 6, 'Mike''s Billiards', 51.082129, -114.009395, ' -Old and dingy, just the way it should be.');
INSERT INTO pins (user_id, map_id, name, long, lat, description) VALUES (2, 6, 'Chalks', 50.917964, -114.067420, ' -Food sucks but easy money to be won here!');



INSERT INTO favorites (user_id, map_id) VALUES (1, 4);
INSERT INTO favorites (user_id, map_id) VALUES (2, 1);
INSERT INTO favorites (user_id, map_id) VALUES (2, 2);
INSERT INTO favorites (user_id, map_id) VALUES (2, 6);
INSERT INTO favorites (user_id, map_id) VALUES (3, 1);
INSERT INTO favorites (user_id, map_id) VALUES (4, 1);
