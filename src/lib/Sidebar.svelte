<script>
  import { Drawer } from "flowbite-svelte";
  import SidebarContent from "$lib/SidebarContent.svelte";

  let sidebar = false;
</script>

<!-- tombol hamburger mobile -->
  <div class="lg:hidden fixed top-4 left-6 z-50 px-3 py-2 bg-white rounded flex flex-row items-center text-3xl gap-4" style="font-family: 'Poppins';">
    <button
      class="cursor-pointer"
      on:click={() => (sidebar = true)}
    >
    ☰
    </button>
  </div>

<!-- sidebar mobile -->
<div class="lg:hidden">
  <Drawer bind:open={sidebar}>
    <SidebarContent />
  </Drawer>
</div>

<!-- sidebar desktop -->
<div class="hidden lg:block fixed top-0 left-0 w-64 h-screen bg-white p-4">
  <SidebarContent />
</div>

<!-- konten utama -->
<div class="lg:ml-64 p-6">
  <slot />
</div>