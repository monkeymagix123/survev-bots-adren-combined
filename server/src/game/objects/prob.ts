class Rayleigh {
    sigma: number;

    constructor(sigma: number) {
        if (sigma <= 0) throw new Error("Sigma must be positive");
        this.sigma = sigma;
    }

    pdf(x: number): number {
        if (x < 0) return 0;
        return (x / (this.sigma ** 2)) * Math.exp((-x) ** 2 / (2 * this.sigma ** 2));
    }

    cdf(x: number): number {
        if (x < 0) return 0;
        return 1 - Math.exp((-x) ** 2 / (2 * this.sigma ** 2));
    }

    sample(): number {
        const u = Math.random();
        return this.sigma * Math.sqrt(-2 * Math.log(u));
    }
}

const r = new Rayleigh(0.2);