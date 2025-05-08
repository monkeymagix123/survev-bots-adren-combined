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

export const rrand = new Rayleigh(0.3);

export class BetaDist {
    private alpha: number;
    private beta: number;
    scale: number; // most common value -- default is 0.5

    constructor(alpha: number, beta: number, scale: number = 0.5) {
        if (alpha <= 0 || beta <= 0) {
            throw new Error("Alpha and Beta must be positive.");
        }
        this.alpha = alpha;
        this.beta = beta;
        this.scale = scale;
    }

    setScale(scale: number): void {
        this.scale = scale;
    }

    private gammaSample(shape: number): number {
        const d = shape - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);

        while (true) {
            const u = Math.random();
            const x = Math.random() * 2 - 1;
            const v = Math.pow(1 + c * x, 3);
            if (v <= 0) continue;

            const x2 = Math.random();
            if (x2 < 1 - 0.0331 * Math.pow(x, 4)) return d * v;
            if (Math.log(x2) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
        }
    }

    public sample(): number {
        const x = this.gammaSample(this.alpha);
        const y = this.gammaSample(this.beta);
        return x / (x + y) * 2 * this.scale;
    }

    public sampleMany(n: number): number[] {
        return Array.from({ length: n }, () => this.sample());
    }
}

// symmetrical currently -- 5-6 looks most like bell curve
let n = 8;

export const beta = new BetaDist(n, n, 0.3); // or 6, 6