### Nhớ thực hiện lệnh này mỗi khi pull code mới về

npm install

### enroll Admin

node enrollAdmin.js

### register a new teacher

node registerUser.js --userid GV00

### create a new subject

node invoke.js --userid admin --f CreateSubject --subjectid 00 --subjectcode IT00 --subjectname "Blockchain" --weight 3

### create a new score

node invoke.js --userid GV00 --f CreateScore --subjectid 00 --studentid 20156425 --score 10

### create a new certificate

node invoke.js --userid GV00 --f CreateCertificate --studentid 20156425

### query Student

node query.js --userid GV00 --f QueryStudent --studentid 20156425

### query Subject

node query.js --userid GV00 --f QuerySubject --subjectid 00

### query Score

node query.js --userid GV00 --f QuertScore --subjectid 00 --studentid 20156425

### query Ceritficate

node query.js --userid GV00 --f QueryCertificate --studentid 20156425

### Get all students

node query.js --userid GV00 --f GetAllStudents

### Get all subjects

node query.js --userid GV00 --f GetAllSubjects

### get all scores

node query.js --userid GV00 --f GetAllScores

### get all certificates

node query.js --userid GV00 --f GetAllCertificates
