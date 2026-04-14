## Purpose and Objective

The purpose of this project is to create a portfolio to be able to display my art, with the focus of learning how to implement a database layer : real file updates, a functional admin panel, slug-based routing, no static data or hardcoded images URLs (which is what i did for the past two hand-ins).

The portfolio is a complete CRUD application backed by a databased, where every artwork displayed on the site is stored in and retrieved from MongoDB.

The admin panel allows me to upload images right through the website, even though i seeded the DB with 29 pieces for display purposes.

I also used the project to learn testing, where i have a JEST + Supertest + mongodb-memory-server suite with 18 different tests across model and route integration tests.

In terms of Deployment, i'm using Render (free tier) with MongoDB Atlas.

## Stack

| Layer                | Technology           |
| -------------------- | -------------------- |
| Runtime              | Node.js              |
| Framework            | Express 5            |
| Database             | MongoDB via Mongoose |
| Templating           | EJS                  |
| File uploads         | Multer               |
| Form method spoofing | method-override      |
| Environment config   | dotenv               |

## How it works

_Data_ Each artwork has a title, description, medium, year, and 'imagePath'. This simple foundation allows simple future implementation of stripe or etsyAPI. Mongoose handles schema validation and timestamps automatically.

_File Uploads_ When an artwork is created or edited through the pannel, Multer will intercept the multipart form, saving the image to `/public/uploads/` (locally, on Render the filesystem is ephemeral), therfore passing the file path to the route handler -> stored in MongoDB.

_Admin Routes_ Full CRUD at '/admin': lists all artworks, create new ones, edit existing ones (showcases image preview), and delete. Using method-override for PUT and Delete methods.

## Project structure

server.js = entry point, Express config, MongoDB connection
models/artwork.js = Mongoose schema and model
routes/artworks.js = public-facing artwork routes
routes/admin.js = admin CRUD routes
views/ = EJS templates (index, gallery, artwork, 404, admin/\*)
public/uploads/ = uploaded image files (served as static assets)
seed.js = database seed script
config/upload.js = fileFilter with a 50MB limit, i know it's a lot.
