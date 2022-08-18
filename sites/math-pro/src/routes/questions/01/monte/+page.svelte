<script lang="ts">
  import { getRandomVec,
    cramersFrac, getRandomPerp, getRandomFrac, Fraction, Vector, getRandomInt, Plane, Line, SquareRoot, 
    Polynomial, bisection, sample } from 'mathlify';
  import { math } from 'mathlifier';

  const n = 1;
  const vars = [];

  for (let i=0; i<n; i++){
    const [n1,n2,n3,rs,fail,count,total] = generateVars(0);
    vars.push({n1,n2,n3,rs,fail,count,total})
  }


  function generateVars(count:number): [number, number, number, number[], number, number, number] {
    let total = 0;
    let fail = 0;
    const rs: number[] = [];
    for (let n1=2; n1<7; n1++){
      for (let n2a=1; n2a<4; n2a++){
        const n2 = n1 + 2*n2a-1;
        for (let n3a=2; n3a<7; n3a++){
          const n3 = n2 + 2*n3a-1;
          for (let m1=1; m1<6; m1++){
            for (let m2a=3; m2a<8; m2a++){
              const m2 = m1 + m2a;
              for (let m3a=2; m3a<5; m3a++){
                const m3 = m2 + m3a;
                if ((m3-m1)*(n2-n1) >= (m2-m1)*(n3-n1)){
                  fail++;
                } else {
                  const poly = new Polynomial([m2-m1], {unknown: 'r', degree: n3-n1})
                    .minus(new Polynomial([m3-m1], {unknown: 'r', degree: n2-n1}))
                    .plus(m3-m2);
                  if (poly.subInNumber(0.99) >= 0){
                    count++;
                    console.log(n1,n2,n3,m1,m2,m3,count)
                  } else {
                    const r = bisection((x:number)=>poly.subInNumber(x), 0, 0.99);
                    rs.push(r);
                  }
                }
                total++;
              }
            } 
          }
        }
      }
    }
    return [1,1,1,rs,fail,count,total]
  }

</script>

<svelte:head>
  <title>Monte Carlo simulations</title>
</svelte:head>

<!-- <div>
  {Math.max(...counts)}
</div> -->

  {#each vars.slice(0) as x}
<div class="mb-8">
  {@html math(`${x.n1}, ${x.n2},${x.n2},${x.fail},${x.count}, ${x.total}`)}
  <br>{x.count/x.total}
  <br>{x.fail/x.total}
</div>
{#each x.rs as r}
  <div>
    {@html r.toPrecision(3)}
  </div>
{/each}
{/each}
