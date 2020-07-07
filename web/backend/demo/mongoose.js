const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-plugin-autoinc");
mongoose.connect("mongodb://localhost:27017/test", {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});
const EliteSchema = new Schema({
	name: String,
	achievements: [{
		name: String,
		description: String
	}]
});
EliteSchema.plugin(autoIncrement.plugin, "elites");

const Elite = mongoose.model("elites", EliteSchema);
const main = async () => {
	const rls = new Elite({
		name: "rls",
		achievements: [{
				name: "WangHong",
				description: "As a WangHong in DEE, RLSTQL!"
			},
			{
				name: "LEG",
				description: "As a LEG in EESAST, RLSTQL!"
			}
		]
	});
	await rls.save();
	const result = await Elite.findOne({
		name: "rls"
	});
	console.log(result.achievements);
	await Elite.deleteOne({
		name: "rls"
	});
	return;
};

main().then(() => {
	mongoose.disconnect();
});