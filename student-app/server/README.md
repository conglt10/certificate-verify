### Nhớ thực hiện lệnh này mỗi khi pull code mới về

npm install

### enroll Admin

node enrollAdmin.js

### enroll a new student

node registerUser.js --userid 20156425 --name "Trinh Van Tan"

### query Student

node query.js --userid 20156425 --f QueryStudent

### query Subject

node query.js --userid 20156425 --f QuerySubject --subjectid 00

### query Score

node query.js --userid 20156425 --f QueryScore --subjectid 00

### get all scores

node query.js --userid 20156425 --f GetAllScores

### get all subjects

node query.js --userid 20156425 --f GetAllSubjects

### query Certificate

node query.js --userid 20156425 --f QueryCertificate
