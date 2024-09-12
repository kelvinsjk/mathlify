<div>
	<h1>Login</h1>
	<form action="?/login" method="POST" class="auth-form">
		<div>
			<label for=""> Email </label>
			<input type="text" name="email" />
		</div>
		<div>
			<label for=""> Password </label>
			<input type="password" name="password" />
		</div>
		<div>
			<button type="submit" class="btn btn-primary">Login</button>
		</div>
	</form>
</div>

<style>
	form {
		display: grid;
		gap: 1rem;
	}
</style>
