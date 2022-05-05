<script lang="ts">
import {math} from 'mathlifier';
  import {Term, Expression, SquareRoot, Vector, xVector, uVector, uVectorExpression, Fraction} from 'mathlify-plus';

  const one = new Term(1);
  const root3 = new SquareRoot(3);
  const z = new Expression(one, new Term('i').times(root3));

  const a = new uVector('a', new Fraction(1,6));
  const OM = new uVector('a', new Fraction(1,3));
  const b = new uVector('b', new Fraction(3,10));
  const OP = new uVectorExpression(a,b);
  const area = OP.cross(OM);
  const dot = OP.dot(OM);

  const u = new Vector(2,-1,2);
  const v = new xVector('a',0,'b');
  const cross = v.cross(u).multiply(2);

</script>

{@html math(`${a}`)}
<br>
{@html math(`${area}`)}
<br>
{@html math(`${dot}`)}
<br>
{@html math(`${cross}`)}
<br>
{@html math(`${z.plus(3)}`)}
<br>
<button class="bg-gray-body" on:click={()=>{
  
}}>
  Change
</button>
