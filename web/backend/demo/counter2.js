const a = 10;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const count = async limit => {
	for (let i = 1; i <= limit; i++) {
		console.log(i);
		await sleep(1000);
	}
};
count(a);