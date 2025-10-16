# Institution API Endpoints

Base URL: `http://localhost:6969`

## 🏫 Institution Management API

### **Endpoints Overview**

| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | `/institutions`                | Create new institution               |
| GET    | `/institutions`                | Get all institutions with pagination |
| GET    | `/institutions/:id`            | Get specific institution             |
| PUT    | `/institutions/:id`            | Update institution                   |
| DELETE | `/institutions/:id`            | Delete institution                   |
| GET    | `/institutions/:id/statistics` | Get institution statistics           |
| GET    | `/institutions/:id/students`   | Get institution students             |
| GET    | `/institutions/:id/teachers`   | Get institution teachers             |
| GET    | `/institutions/:id/classes`    | Get institution classes              |

---

## **API Usage Examples**

### **1. Create Institution**

```bash
POST /institutions
Content-Type: application/json

{
  "name": "Green Valley High School",
  "address": "123 Eco Street, Delhi",
  "type": "SCHOOL",
  "adminId": "user_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Institution created successfully",
  "data": {
    "id": "cm1h4...",
    "name": "Green Valley High School",
    "address": "123 Eco Street, Delhi",
    "type": "SCHOOL",
    "adminId": "user_id_here",
    "admin": {
      "id": "user_id_here",
      "name": "John Admin",
      "email": "admin@greenvalley.edu"
    }
  }
}
```

### **2. Get All Institutions**

```bash
GET /institutions?page=1&limit=10&search=green&type=SCHOOL
```

**Response:**

```json
{
  "success": true,
  "message": "Institutions retrieved successfully",
  "data": {
    "institutions": [
      {
        "id": "cm1h4...",
        "name": "Green Valley High School",
        "type": "SCHOOL",
        "_count": {
          "classes": 12,
          "students": 450,
          "teachers": 25
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 45,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### **3. Get Institution Statistics**

```bash
GET /institutions/cm1h4.../statistics
```

**Response:**

```json
{
  "success": true,
  "message": "Institution statistics retrieved successfully",
  "data": {
    "overview": {
      "totalClasses": 12,
      "totalStudents": 450,
      "totalTeachers": 25,
      "totalEcoPoints": 15750
    },
    "engagement": {
      "avgEcoPointsPerStudent": 35
    },
    "topPerformers": [
      {
        "id": "student_1",
        "ecoPoints": 150,
        "level": 5,
        "user": {
          "name": "Priya Sharma",
          "avatar": "avatar_url"
        }
      }
    ]
  }
}
```

### **4. Get Institution Students**

```bash
GET /institutions/cm1h4.../students?page=1&limit=20&sortBy=ecoPoints&sortOrder=desc
```

### **5. Update Institution**

```bash
PUT /institutions/cm1h4...
Content-Type: application/json

{
  "name": "Green Valley Eco High School",
  "address": "123 Eco Street, New Delhi"
}
```

---

## **Query Parameters**

### **Get All Institutions**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in name/address
- `type` (enum): SCHOOL | COLLEGE | UNIVERSITY

### **Get Students/Teachers/Classes**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search in names/emails
- `sortBy` (string): Sort field
- `sortOrder` (string): asc | desc

---

## **Institution Types**

- `SCHOOL`: Primary/Secondary Schools
- `COLLEGE`: Colleges
- `UNIVERSITY`: Universities

---

## **Error Responses**

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Institution ID is required",
  "error": null
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Institution not found",
  "error": null
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Failed to create institution",
  "error": null
}
```

---

## **Features Implemented ✅**

- ✅ **Complete CRUD Operations**
- ✅ **Pagination Support**
- ✅ **Search & Filtering**
- ✅ **Institution Statistics**
- ✅ **Student Management**
- ✅ **Teacher Management**
- ✅ **Class Management**
- ✅ **Error Handling**
- ✅ **Input Validation**
- ✅ **TypeScript Support**

---

## **Testing the API**

You can test these endpoints using:

- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Frontend applications**

The server is running at: `http://localhost:6969` 🚀
