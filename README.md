
# 📒 Note Taking App – Backend

Backend API for the Note Taking Application built using:

* **Node.js**
* **Express.js**
* **Prisma ORM**
* **Zod (Validation)**
* **MySQL / PostgreSQL (via Prisma)**

---

## 🚀 Features

* ✅ Create Note
* ✅ Get All Notes
* ✅ Update Note
* ✅ Delete Note
* ✅ Zod Validation
* ✅ Proper Error Handling
* ✅ RESTful API Structure

---

## 📂 Project Structure

```
backend/
│
├── controllers/
│   └── noteController.js
│
├── routes/
│   └── noteRoutes.js
│
├── prisma/
│   └── schema.prisma
│
├── prismaClient.js
├── index.js
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your_database_connection_string"
PORT=5000
```

---

## 🗄 Prisma Setup

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migration

```bash
npx prisma migrate dev --name init
```

---

## ▶️ Run the Server

```bash
npm run dev
```

OR

```bash
node index.js
```

Server runs at:

```
http://localhost:5000
```

---

## 📌 API Endpoints

### 🔹 Create Note

**POST** `/create-note`

```json
{
  "title": "Sample Note",
  "content": "This is a test note"
}
```

Response:

```
201 Created
```

---

### 🔹 Get All Notes

**GET** `/get-notes`

Response:

```json
[
  {
    "id": 1,
    "title": "Sample",
    "content": "Content",
    "createdAt": "2026-02-19T10:00:00.000Z"
  }
]
```

---

### 🔹 Update Note

**PUT** `/update-note/:id`

```json
{
  "title": "Updated Title",
  "content": "Updated Content"
}
```

---

### 🔹 Delete Note

**DELETE** `/delete-note/:id`

Response:

```json
{
  "message": "Note deleted successfully"
}
```

---

## 🛡 Validation

Validation is handled using **Zod**.

Example:

```js
const noteSchema = z.object({
  title: z.string({ required_error: "Title is required" })
           .min(1, "Title is required"),
  content: z.string({ required_error: "Content is required" })
           .min(1, "Content is required"),
});
```

Invalid requests return:

```json
{
  "errors": [
    {
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

Status Code:

```
400 Bad Request
```

---

## ❌ Error Handling

* `400` → Validation errors
* `404` → Note not found
* `500` → Server error

---

## 🧠 Future Improvements

* 🔐 Authentication (JWT)
* 👤 User-based notes
* 📄 Pagination
* 🔎 Search functionality
* 🧪 Unit testing

---

## 👩‍💻 Author

Sumit

