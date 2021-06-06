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

--Remove the user test4
DELETE FROM Members 
WHERE Email='test4@test.edu';

--Add the User test4 (password is: Testtest4!)
INSERT INTO 
    Members(FirstName, LastName, Nickname, Email, Password, Salt)
VALUES
    ('test4First', 'test4Last', 'test4', 'test4@test.edu', 'eedb7c6a84e9ab0f900d2a04681a97b129059e6b171031ce077e2cbf5febfdb8', '2603b3d7e3bf7b6c069b9e8d3bd4eee6d79a23c72f6142fd7ab54dc11a61fa88');

--Remove the user test5
DELETE FROM Members 
WHERE Email='test5@test.edu';

--Add the User test5 (password is: Testtest5!)
INSERT INTO 
    Members(FirstName, LastName, Nickname, Email, Password, Salt)
VALUES
    ('test5First', 'test5Last', 'test5', 'test5@test.edu', 'eedb7c6a84e9ab0f900d2a04681a97b129059e6b171031ce077e2cbf5febfdb8', '2603b3d7e3bf7b6c069b9e8d3bd4eee6d79a23c72f6142fd7ab54dc11a61fa88');