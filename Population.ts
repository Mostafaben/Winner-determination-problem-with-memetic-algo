import Bid from './Bid';
import Collection from './Collection';

export default class Population {
	public readonly MAX_ITER = 200;
	public readonly WP = 0.1;
	public readonly NB_COLLECTIONS = 1000;
	public readonly MAX_BIDS = 150;
	public readonly MAX_ITEMS = 200;

	constructor(public collections: Array<Collection> = []) {
		this.fillPopulation();
	}

	generateRandomProbabilities(len: number) {
		return new Array(len)
			.fill(0)
			.map((_) => Math.random())
			.map((value, index) => {
				return {
					r: value,
					index,
				};
			})
			.sort((a, b) => b.r - a.r);
	}

	chooseBestCollection() {
		let max = 0;
		let c: Collection;
		this.collections.forEach((collection) => {
			let fit = collection.calculateFitness();
			if (max < fit) {
				max = fit;
				c = collection;
			}
		});
		return c;
	}

	simularity(c1: Collection, collections: Collection[]) {
		let simularity = 0;
		collections.forEach((collection) => {
			simularity += c1.simularity(collection);
		});
		return simularity;
	}

	selection() {
		let temp = [...this.collections];
		temp.sort((a, b) => b.calculateFitness() - a.calculateFitness());
		let bestIndivudials = temp.slice(0, temp.length / 2);
		let bestIndiversity = temp.slice(temp.length / 2, temp.length);
		bestIndiversity.sort((a, b) => {
			return (
				this.simularity(a, bestIndiversity) -
				this.simularity(b, bestIndiversity)
			);
		});
		bestIndiversity = bestIndiversity.slice(0, bestIndiversity.length / 2);
		return { bestIndivudials, bestIndiversity };
	}

	generateIndividuals(A: Collection) {
		const collection = new Collection();
		const r = this.generateRandomProbabilities(A.bids.length);
		for (let i = 0; i < A.bids.length; i++) {
			if (!collection.ConflictWith(A.bids[r[i].index]))
				collection.bids.push(A.bids[r[i].index]);
		}
		if (collection.bids.length > 0) this.collections.push(collection);
	}
	randomCollection() {
		let nbItems = Math.floor(Math.random() * this.MAX_ITEMS + 1);
		let nbBids = Math.floor(Math.random() * this.MAX_BIDS + 1);
		const collection = new Collection();
		let counter = 0;
		while (counter < nbBids) {
			const bid = new Bid([], 0);
			let len = Math.floor(Math.random() * nbItems);
			for (let i = 0; i < len; i++) {
				let item = Math.floor(Math.random() * nbItems + 1);
				if (!bid.items.includes(item)) bid.items.push(item);
			}
			bid.price = Math.random() * 100;
			if (bid.items.length > 0) collection.bids.push(bid);
			counter++;
		}
		return collection;
	}

	crossOver(BI: Collection[], BD: Collection[]) {
		const parent1 = BI[Math.floor(Math.random() * BI.length)];
		const parent2 = BD[Math.floor(Math.random() * BD.length)];
		const child = new Collection([...parent1.bids]);
		parent2.bids.forEach((bid) => {
			if (!child.ConflictWith(bid)) child.bids.push(bid);
		});
		child.calculatePrice();
		return child;
	}

	fillPopulation() {
		for (let i = 0; i < this.NB_COLLECTIONS; i++) {
			const c = this.randomCollection();
			this.generateIndividuals(c);
		}
	}

	SLS(solution: Collection) {
		for (let i = 0; i < this.MAX_ITER; i++) {
			const r = Math.random();
			let bid: Bid;
			if (r < this.WP) {
				const randomCollectionIndex = Math.floor(
					Math.random() * this.collections.length
				);
				const selectedCollection =
					this.collections[randomCollectionIndex];
				const randomBidIndex = Math.floor(
					Math.random() * selectedCollection.bids.length
				);
				bid = selectedCollection.bids[randomBidIndex];
			} else {
				bid = this.chooseBestCollection().bestBid();
			}
			const bestSolution = new Collection([bid]);
			solution.bids.forEach((_bid) => {
				if (!_bid.ConflictWith(bid)) bestSolution.bids.push(_bid);
			});
			bestSolution.calculatePrice();
			solution = bestSolution;
		}
		return solution;
	}
}
