--Remove all members from all chats
DELETE FROM ChatMembers;

--Remove all messages from all chats
DELETE FROM Messages;

--Remove all chats
DELETE FROM Chats;

--Remove the user test1
DELETE FROM Members 
WHERE Email='test1@test.edu';

--Add the User test1  (password is: Testtest1!)
INSERT INTO 
    Members(FirstName, LastName, Nickname, Email, Password, Salt)
VALUES
    ('test1First', 'test1Last', 'test1', 'test1@test.edu', 'eedb7c6a84e9ab0f900d2a04681a97b129059e6b171031ce077e2cbf5febfdb8', '2603b3d7e3bf7b6c069b9e8d3bd4eee6d79a23c72f6142fd7ab54dc11a61fa88');

--Remove the user test2
DELETE FROM Members 
WHERE Email='test2@test.edu';

--Add the User test2  (password is: Testtest1!)
INSERT INTO 
    Members(FirstName, LastName, Nickname, Email, Password, Salt)
VALUES
    ('test2First', 'test2Last', 'test2', 'test2@test.edu', 'eedb7c6a84e9ab0f900d2a04681a97b129059e6b171031ce077e2cbf5febfdb8', '2603b3d7e3bf7b6c069b9e8d3bd4eee6d79a23c72f6142fd7ab54dc11a61fa88');

--Remove the user test3
DELETE FROM Members 
WHERE Email='test3@test.edu';

--Add the User test3 (password is: Testtest1!)
INSERT INTO 
    Members(FirstName, LastName, Nickname, Email, Password, Salt)
VALUES
    ('test3First', 'test3Last', 'test3', 'test3@test.edu', 'eedb7c6a84e9ab0f900d2a04681a97b129059e6b171031ce077e2cbf5febfdb8', '2603b3d7e3bf7b6c069b9e8d3bd4eee6d79a23c72f6142fd7ab54dc11a61fa88');

--Create Global Chat room, ChatId 1
INSERT INTO
    chats(chatid, name)
VALUES
    (1, 'test2@test.edu and test3@test.edu private chat room')
RETURNING *;


--Add the three test users to Global Chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 1, Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
    OR Members.Email='test3@test.edu'

    -- WHERE Members.Email='test1@test.edu'
    -- OR Members.Email='test2@test.edu'
    -- OR Members.Email='test3@test.edu'
RETURNING *;

-- New stuff---------------------------------------------
--Create Global Chat room, ChatId 2
INSERT INTO
    chats(chatid, name)
VALUES
    (2, 'test1@test.edu and test2@test.edu chat room')
RETURNING *;

--Add the users to chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 2, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.edu'
    OR Members.Email='test2@test.edu'
RETURNING *;

--Create Global Chat room, ChatId 3
INSERT INTO
    chats(chatid, name)
VALUES
    (3, 'test1@test.edu and test3@test.edu chat room')
RETURNING *;

--Add the users to chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 3, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.edu'
    OR Members.Email='test3@test.edu'
RETURNING *;

-- --Create Global Chat room, ChatId 4
-- INSERT INTO
--     chats(chatid, name)
-- VALUES
--     (4, 'test2@test.edu and test3@test.edu chat room')
-- RETURNING *;

-- --Add the users to chat
-- INSERT INTO 
--     ChatMembers(ChatId, MemberId)
-- SELECT 4, Members.MemberId
-- FROM Members
-- WHERE Members.Email='test2@test.edu'
--     OR Members.Email='test3@test.edu'
-- RETURNING *;

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hello!',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Howdy!',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

-- --Add Multiple messages to create a conversation
-- INSERT INTO 
--     Messages(ChatId, Message, MemberId)
-- SELECT 
--     4, 
--     'Whats up!',
--     Members.MemberId
-- FROM Members
-- WHERE Members.Email='test3@test.edu'
-- RETURNING *;
-- -------------------------------------------------------

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hello Everyone!',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'hi',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hey Test1, how is it going?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '3 2 1 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.edu'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.edu'
RETURNING *;