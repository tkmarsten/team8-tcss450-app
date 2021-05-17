DELETE FROM Contacts;

INSERT INTO
    Contacts(MemberID_A, MemberID_B)
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
    Members.Email = 'test2@test.edu')
)