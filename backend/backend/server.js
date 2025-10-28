const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");
const helmet = require("helmet");


const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())

let db
    ; (async () => {
        db = await open({ filename: "./resume.db", driver: sqlite3.Database })
        await db.exec(`
  CREATE TABLE IF NOT EXISTS personal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    profile TEXT,
    summary TEXT,
    skill TEXT,
    image TEXT
  )
`)
        await db.exec(`CREATE TABLE IF NOT EXISTS projects(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)`)
        await db.exec(`CREATE TABLE IF NOT EXISTS education(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)`)
        await db.exec(`CREATE TABLE IF NOT EXISTS work(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT)`)
        await db.exec(`CREATE TABLE IF NOT EXISTS awards(id INTEGER PRIMARY KEY AUTOINCREMENT, award TEXT)`)
        await db.exec(`CREATE TABLE IF NOT EXISTS skills(id INTEGER PRIMARY KEY AUTOINCREMENT, skill TEXT)`)
        await db.exec(`CREATE TABLE IF NOT EXISTS summary(id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)`)
    })()

app.get("/personal", async (req, res) => {
    const data = await db.all("SELECT * FROM personal")
    res.json(data)
})
app.post("/personal", async (req, res) => {
    const { name, email, phone, address, profile, image } = req.body
    await db.run("INSERT INTO personal(name,email,phone,address,profile,image) VALUES(?,?,?,?,?,?)", [name, email, phone, address, profile, image])
    res.json({ success: true })
})

app.get("/projects", async (req, res) => {
    const data = await db.all("SELECT * FROM projects")
    res.json(data)
})
app.post("/projects", async (req, res) => {
    const { title, description } = req.body
    await db.run("INSERT INTO projects(title,description) VALUES(?,?)", [title, description])
    res.json({ success: true })
})

app.get("/education", async (req, res) => {
    const data = await db.all("SELECT * FROM education")
    res.json(data)
})
app.post("/education", async (req, res) => {
    const { title, description } = req.body
    await db.run("INSERT INTO education(title,description) VALUES(?,?)", [title, description])
    res.json({ success: true })
})

app.get("/work", async (req, res) => {
    const data = await db.all("SELECT * FROM work")
    res.json(data)
})
app.post("/work", async (req, res) => {
    const { title, description } = req.body
    await db.run("INSERT INTO work(title,description) VALUES(?,?)", [title, description])
    res.json({ success: true })
})

app.get("/awards", async (req, res) => {
    const data = await db.all("SELECT * FROM awards")
    res.json(data)
})
app.post("/awards", async (req, res) => {
    const { award } = req.body
    await db.run("INSERT INTO awards(award) VALUES(?)", [award])
    res.json({ success: true })
})

app.get("/skills", async (req, res) => {
    const data = await db.all("SELECT * FROM skills")
    res.json(data)
})
app.post("/skills", async (req, res) => {
    const { skill } = req.body
    await db.run("INSERT INTO skills(skill) VALUES(?)", [skill])
    res.json({ success: true })
})

app.get("/summary", async (req, res) => {
    const data = await db.all("SELECT * FROM summary")
    res.json(data)
})
app.post("/summary", async (req, res) => {
    const { text } = req.body
    await db.run("INSERT INTO summary(text) VALUES(?)", [text])
    res.json({ success: true })
})

app.post("/save-resume", async (req, res) => {
    const { name, email, phone, address, profile, summary, skill, image } = req.body;
    try {
        await db.run(
            `INSERT INTO personal (name, email, phone, address, profile, summary, skill, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone, address, profile, summary, skill, image]
        );
        res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving data" });
    }
});


app.use((req, res) => res.status(404).json({ error: "not_found" }))
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log("server running on " + PORT))