import { app } from "./routes/routes.js";

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));