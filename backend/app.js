import express from 'express';
import cors from 'cors';
import multer from 'multer';
import analyzeImage from './routes/router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());

// Route to handle file upload
app.post('/process-image', upload.single('image'), analyzeImage);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
