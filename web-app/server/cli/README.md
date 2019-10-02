## 1. Enroll admin

- orgid {String} (default: student}

```bash
node enrollAdmin.js --orgid=[OrgName]
```

#### Example:

enrollAdmin Org student:

```bash
	node enrollAdmin.js
```

enrollAdmin Org academy:

```bash
	node enrollAdmin.js --orgid=academy
```

## 2. Register user

- orgid {String} (default: student}
- userid {String} (required)

```bash
	node registerUser.js --userid=[user-id] --orgid=[OrgName]
```

#### Example:

Register user1 in academy:

```bash
	node registerUser.js --userid=user1 --orgid=academy
```

Register user1 in student:

```bash
	node registerUser.js --userid=user1
```

## Enroll admin and register user with `intit.sh`

```bash
chmod +x ./init.sh
./init.sh
```

## Query Ledger

- orgid {String} (default: student)
- func {String} Function Name (required)
- userid {String} (required)
- args {String} argument of function (optional)

```bash
	node query.js --userid=[UserId] --orgid=[OrgName] --func=[FunctionName] --args=[Argument]
```

#### Example:

Query student id is 1 with role academy admin:

```bash
	node query.js --userid=admin --orgid=academy --func=QueryStudent --args=1
```

Query All student with role academy admin:

```bash
	node query.js --userid=admin --orgid=academy --func=GetAllStudents
```

Query Score with role admin student with studentId and subjectId

```bash
	// arguments = [StudentId, SubjectId]
	node query.js --userid=admin --orgid=student --func=QueryScore --args=10 --args=160212
```

## Invoke Ledger

- orgid {String} (default: student)
- func {String} Function Name (required)
- userid {String} (required)
- argument {String} (optional: depend of function call)

#### Example:

```bash
	node invoke.js --userid=admin --func=CreateCertificate --studentid=1
```

```bash
node invoke.js --userid=admin --orgid=student --func=CreateStudent --studentid=1 --studentname=cong
```
