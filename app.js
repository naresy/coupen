const express = require("express");
const WebRoutes = require("./routes/web_routes");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use("/", WebRoutes.router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
