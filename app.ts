/// <reference path="global.d.ts" />

import express from "express"
import { createClient } from "redis"
const app = express()
const client = createClient({
  url: process.env.REDIS_URL
})
await client.connect()
app.set("views", "views")
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.post("/new", async (req, res) => {
  const { long, short } = req.body as links
  const success = !await client.exists(short)
  res.render("new", { ...req.body, success })
  if (!success) return
  client.set(short, long)
})
app.get("/:short", async (req, res) => {
  const link = await client.get(req.params.short)
  if (!link) return
  res.redirect(link.toString())
})
app.listen(3000, () => {
  console.log("http://localhost:3000")
})