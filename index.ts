import Population from './Population';
const MAX_ITER = 10;

function WDP() {
	const population = new Population();
	let counter = 0;
	let { bestIndiversity: BD, bestIndivudials: BI } = population.selection();
	while (counter < MAX_ITER) {
		const child = population.crossOver(BI, BD);
		const solution = population.SLS(child);
		if (child.price < solution.price) {
			BI.push(solution);
			BI.sort((a, b) => b.calculateFitness() - a.calculateFitness());
			BD.pop();
		} else {
			BD.push(solution);
			BD = BD.concat(BI).sort(
				(a, b) =>
					population.simularity(a, BD) - population.simularity(b, BD)
			);
			BD.shift();
		}
		counter++;
		console.log(solution);
	}
}

WDP();
