type Point = { x: number; y: number };
type Grid = number[][];  // 2D grid, 0 for free space, 1 for obstacle

class PRM {
    grid: Grid;
    width: number;
    height: number;
    sampleCount: number;
    nodes: Point[];

    constructor(grid: Grid, sampleCount: number) {
        this.grid = grid;
        this.width = grid.length;
        this.height = grid[0].length;
        this.sampleCount = sampleCount;
        this.nodes = [];
    }

    // Randomly sample points in free space
    samplePoints(): void {
        for (let i = 0; i < this.sampleCount; i++) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            if (this.grid[x][y] === 0) {  // Check if it's free space
                this.nodes.push({ x, y });
            } else {
                i--;  // Try again if the point is blocked
            }
        }
    }

    // Check if two points are directly connected (no obstacles in between)
    isValidEdge(start: Point, end: Point): boolean {
        const dx = Math.abs(start.x - end.x);
        const dy = Math.abs(start.y - end.y);
        const sx = start.x < end.x ? 1 : -1;
        const sy = start.y < end.y ? 1 : -1;
        let err = dx - dy;

        let x = start.x;
        let y = start.y;

        while (true) {
            if (x === end.x && y === end.y) break;
            if (this.grid[x][y] === 1) return false;  // Blocked cell

            const e2 = err * 2;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return true;  // Edge is valid
    }

    // Connect nearby points (nodes) if they are reachable
    buildGraph(maxDistance: number): Map<Point, Point[]> {
        let graph = new Map<Point, Point[]>();

        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            let neighbors: Point[] = [];
            for (let j = 0; j < this.nodes.length; j++) {
                if (i === j) continue;
                let neighbor = this.nodes[j];
                const dist = Math.sqrt((node.x - neighbor.x) ** 2 + (node.y - neighbor.y) ** 2);

                // Only connect nodes within maxDistance
                if (dist <= maxDistance && this.isValidEdge(node, neighbor)) {
                    neighbors.push(neighbor);
                }
            }
            graph.set(node, neighbors);
        }

        return graph;
    }

    // Run PRM and return the graph
    generateGraph(maxDistance: number): Map<Point, Point[]> {
        this.samplePoints();
        return this.buildGraph(maxDistance);
    }

    // Simple A* algorithm to find a path (using graph)
    aStar(start: Point, goal: Point, graph: Map<Point, Point[]>): Point[] {
        let openSet = new Set<Point>();
        let cameFrom = new Map<Point, Point>();
        let gScore = new Map<Point, number>();
        let fScore = new Map<Point, number>();

        // Initialize
        openSet.add(start);
        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.size > 0) {
            // Get the node with the lowest fScore
            let current = this.getLowestFScoreNode(openSet, fScore);

            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);
            for (let neighbor of graph.get(current) || []) {
                let tentativeGScore = (gScore.get(current) || 0) + 1;  // Assume uniform cost

                if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, goal));

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        return [];  // No path found
    }

    // Heuristic function (Manhattan distance)
    heuristic(a: Point, b: Point): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // Get node with the lowest fScore
    getLowestFScoreNode(openSet: Set<Point>, fScore: Map<Point, number>): Point {
        let lowestNode: Point = { x: -1, y: -1 };
        let lowestFScore = Infinity;

        for (let node of openSet) {
            let score = fScore.get(node) || Infinity;
            if (score < lowestFScore) {
                lowestFScore = score;
                lowestNode = node;
            }
        }

        return lowestNode;
    }

    // Reconstruct the path from A* search
    reconstructPath(cameFrom: Map<Point, Point>, current: Point): Point[] {
        let totalPath: Point[] = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current)!;
            totalPath.unshift(current);
        }
        return totalPath;
    }
}

// Example usage:

const grid: Grid = [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0]
];

const prm = new PRM(grid, 100);  // Create PRM with 100 random samples
const graph = prm.generateGraph(3);  // Build graph with max edge distance of 3 units

const start = { x: 0, y: 0 };
const goal = { x: 4, y: 4 };
const path = prm.aStar(start, goal, graph);

console.log("Path:", path);
