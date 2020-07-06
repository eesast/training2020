const express = require("express");
const app = express();

// middleware
app.use(async (req, res, next) => {
	let x = Date.now();
	await next();
	console.log(req.url, "-->", res.statusCode, Date.now() - x, "ms");
});

// "router" in some way
app.get("/", async (req, res, next) => {
	console.log("Hello,world!");
	res.status(200).send("Hello World!");
});

app.listen(3000, () => {
	console.log("Example app listening on port 3000!");
});
