import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; //fileupload
import helmet from "helmet"; //request security
import morgan from "morgan"; //login
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
// app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// //File Save Local Storage
// const storage = multer.diskStorage({
//     destination:function(req, file, cb) {
//         cb(null, "public/assets")
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({storage})

//Routes
app.post("/auth/register", register);
app.post('/posts/create', verifyToken, createPost)

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//MongoDB Setup
const PORT = process.env.PORT || 6006;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running at ${PORT}`);
    });

    //Add sample datas
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((err) => console.log(err));
