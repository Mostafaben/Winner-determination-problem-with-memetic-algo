export default class Bid {
	constructor(public items: Array<number>, public price: number) {}

	ConflictWith(bid: Bid) {
		let conflict = false;
		this.items.forEach((i1) => {
			bid.items.forEach((i2) => {
				if (i2 == i1) {
					conflict = true;
				}
			});
		});
		return conflict;
	}

	mesureSimilarity(bid: Bid) {
		let similarity = 0;
		this.items.forEach((i1) => {
			bid.items.forEach((i2) => {
				if (i1 == i2) similarity++;
			});
		});
		return similarity;
	}
}
