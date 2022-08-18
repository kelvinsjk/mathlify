<script lang="ts">
  import { getRandomVec, cramersFrac, getRandomPerp, getRandomFrac, Fraction, Vector, getRandomInt, Plane, Line, SquareRoot } from 'mathlify';
  import { math } from 'mathlifier';

  let n = 10000;
  let counts = [];
  let ps = [];
  let ns = [];
  let ss = [];
  let ls = [];

  for (let i=0; i<n; i++){
    const [count, p, n, s, rhs1, rhs2, l, m] = generateVars(0);
    counts.push(count);
    ps.push(p);
    ns.push(n);
    ss.push(s);
    ls.push([rhs1, rhs2, l, m]);
  }


  function generateVars(count:number): [number, Vector, Vector, Vector, Fraction, Fraction, Fraction, Fraction] {
    const p = getRandomVec();
    const n = getRandomVec({min: -2, max: 2, simplify: true});
    let d = getRandomVec({min: -6, max: 6, simplify: true, avoid: [n], avoidPerp: true});
    if (d.dot(n).isGreaterThan(0)){
      d = d.negative();
    }
    const lambda = getRandomInt(1,5);
    const mu = getRandomInt(-5,-1);
    const s = p.plus(d.multiply(lambda)).plus(n.multiply(mu));
    const rhsP = p.dot(n);
    const rhsS = s.dot(n);
    let rhs1: number;
    let rhs2: number;
    if (rhsP.isLessThan(rhsS)){
      const rhsFloor = rhsP.plus(1).num;
      const rhsCeil = rhsS.minus(1).num;
      if (rhsCeil-rhsFloor < 1){
        return generateVars(count+1);
      }
      const rhsA = getRandomInt(rhsFloor, rhsCeil);
      const rhsB = getRandomInt(rhsFloor, rhsCeil, {avoid:[rhsA]});
      rhs1 = Math.min(rhsA, rhsB);
      rhs2 = Math.max(rhsA, rhsB);
    } else {
      const rhsFloor = rhsS.plus(1).num;
      const rhsCeil = rhsP.minus(1).num;
      if (rhsCeil-rhsFloor < 1){
        return generateVars(count+1);
      }
      const rhsA = getRandomInt(rhsFloor, rhsCeil);
      const rhsB = getRandomInt(rhsFloor, rhsCeil, {avoid:[rhsA]});
      rhs2 = Math.min(rhsA, rhsB);
      rhs1 = Math.max(rhsA, rhsB);
    }
    const p1 = new Plane(n, { rhs: rhs1 });
    const p2 = new Plane(n, { rhs: rhs2 });
    const lambda1 = p1.intersectLineParam(new Line(p, d));
    const mu1 = p2.intersectLineParam(new Line(s, d));
    if (lambda1.den > 12 || mu1.den > 12){
      return generateVars(count+1);
    }
    const q = p1.intersect(new Line(p,d)) as Vector;
    const r = p2.intersect(new Line(s,d)) as Vector;
    const qr = r.minus(q);
    const angle1 = Number(d.angleTo(n, {acute : true}).replace('^\\circ', ''));
    const angle2 = Number(qr.angleTo(n, {acute : true}).replace('^\\circ', ''));
    const cosTheta = new SquareRoot(d.dot(n).square()).divide(d.magnitude()).divide(n.magnitude());
    const cosBeta = new SquareRoot(qr.dot(n).square()).divide(qr.magnitude()).divide(n.magnitude());
    const theta = Math.acos(cosTheta.valueOf());
    const beta = Math.acos(cosBeta.valueOf());
    const k = Math.sin(theta) / Math.sin(beta);
		if (qr.isParallelTo(n) || theta <= beta || k > 38.5 || k < 1.01){
			return generateVars(count+1);
		}
    return [count, p, n, s, lambda1, mu1, new Fraction(lambda), new Fraction(mu)];
  }

</script>

<svelte:head>
  <title>Monte Carlo simulations</title>
</svelte:head>

<div>
  {Math.max(...counts)}
</div>

  {#each ps.slice(0,10) as p,i}
{@const n = ns[i]}
{@const s = ss[i]}
{@const l = ls[i]}
<div>
  {@html math(`${p.toCoordinates()}`)}
  {@html math(`${s.toCoordinates()}`)}
  {@html math(`${n}`)}
  {@html math(`${l}`)}
</div>
{/each}