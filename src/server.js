import express from "express";
import multer from "multer";
import ftp from "ftp";
import path from "path";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "https://solicitarmigrate.vercel.app/",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

const upload = multer();

const ftpConfig = {
  host: "ftp.mariasmello.com.br",
  user: "implantacao@cdsimplantacao.com.br",
  password: "dificil!@#",
};

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo enviado." });
  }

  const fileName = req.file.originalname;
  const client = new ftp();

  client.on("ready", () => {
    client.put(req.file.buffer, `/migrate/${fileName}`, (err) => {
      client.end();
      if (err) {
        return res.status(500).json({ message: "Erro ao enviar o arquivo." });
      }
      res.json({ fileUrl: `https://cdsimplantacao.com.br/migrate/${fileName}` });
    });
  });

  client.connect(ftpConfig);
});

export default app;
