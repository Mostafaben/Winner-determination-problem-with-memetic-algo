import Bid from './Bid';

export default class Collection {
	public price: number = 0;
	constructor(public bids: Array<Bid> = []) {
		this.calculatePrice();
	}

	ConflictWith(bid: Bid) {
		for (let i = 0; i < this.bids.length; i++) {
			if (this.bids[i].ConflictWith(bid)) return true;
		}
		return false;
	}

	calculateFitness() {
		let sum = 0;
		this.bids.forEach((bid) => (sum += bid.price));
		return sum;
	}

	simularity(collection: Collection) {
		let simularity = 0;
		this.bids.forEach((bid1) => {
			collection.bids.forEach((bid2) => {
				simularity += bid1.mesureSimilarity(bid2);
			});
		});
		return simularity;
	}

	calculatePrice() {
		let price = 0;
		this.bids.forEach((bid) => {
			price += bid.price;
		});
		this.price = price;
	}

	bestBid() {
		return this.bids.sort((b, a) => a.price - b.price)[0];
	}

	log() {
		this.calculatePrice();
		console.log('BIDS: ');
		this.bids.forEach((bid) => {
			console.log({ items: bid.items, price: bid.price });
		});
		console.log('PRICE:', this.price);
	}
}
