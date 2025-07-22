import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import contactRoutes from "./routes/contact.routes.js";
import educationRoutes from "./routes/education.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// ✅ Apply middleware BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// ✅ Mount routes AFTER middleware
app.use("/", contactRoutes);
app.use("/", userRoutes);
app.use("/", educationRoutes);
app.use("/", projectRoutes);


app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: err.name + ": " + err.message });
    } else if (err) {
        res.status(400).json({ error: err.name + ": " + err.message });
        console.log(err);
    }
});

export default app;
