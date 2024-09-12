<div>
	<h1>Register</h1>
	<form action="?/register" method="POST" class="auth-form">
		<div>
			<label for=""> Email </label>
			<input type="text" name="email" />
		</div>
		<div>
			<label for=""> Password </label>
			<input type="password" name="password" />
		</div>
		<div>
			<button class="btn btn-primary">Register</button>
		</div>
	</form>
</div>

<style>
	form {
		display: grid;
		gap: 1rem;
	}
</style>
