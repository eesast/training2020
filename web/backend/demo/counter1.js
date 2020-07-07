const a = 10;
const counter = (x = 1) => {
	console.log(x);
	if (x < a)
		setTimeout(() => {
			counter(x + 1);
		}, 1000);
};
counter();