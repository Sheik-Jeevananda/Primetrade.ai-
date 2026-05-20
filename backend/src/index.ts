import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerPath = path.resolve(__dirname, 'docs/swagger.yaml');
const swaggerFallbackPath = path.resolve(__dirname, '../src/docs/swagger.yaml');
const swaggerDocument = YAML.load(fs.existsSync(swaggerPath) ? swaggerPath : swaggerFallbackPath);

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routing..
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Swagger Docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    // Errors
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("TypeScript Backend Running");
});

app.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});
