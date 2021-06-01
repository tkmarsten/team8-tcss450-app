DELETE FROM Contacts;

INSERT INTO
    Contacts(MemberID_A, MemberID_B, Verified)
VALUES (
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test1@test.edu'),
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test2@test.edu'),
1
);

INSERT INTO
    Contacts(MemberID_A, MemberID_B, Verified)
VALUES (
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test3@test.edu'),
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test1@test.edu'),
0
);

INSERT INTO
    Contacts(MemberID_A, MemberID_B, Verified)
VALUES (
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test2@test.edu'),
(SELECT
    Members.MemberID
FROM
    Members
WHERE 
    Members.Email = 'test3@test.edu'),
1
);