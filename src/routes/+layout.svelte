<script>
	import '../app.css'
  	import { fly } from "svelte/transition";
</script>

<div transition:fly={{ y: 20, duration: 200, opacity: 0 }}>
  <slot />
</div>