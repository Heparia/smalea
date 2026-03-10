<script lang="ts">
  import '../../app.css';
  import Sidebar from "$lib/Sidebar.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from '$lib/baseUrl';

  interface LibraryResult {
      jenis_daun: string;
      nama_latin: string;
      keluarga: string;
      zat: string;
      penggunaan: string;
      pemerian: string;
      penyimpanan: string;
  }
  let library: LibraryResult[] = [];

  async function loadLibrary() {
    try {
      const res = await fetch(`${BASE_URL}/library`);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();

      library = result.data.map((item: LibraryResult) => ({
        jenis_daun: item.jenis_daun || "Tidak diketahui",
        nama_latin: item.nama_latin || "-",
        keluarga: item.keluarga || "-",
        zat: item.zat || "-",
        penggunaan: item.penggunaan || "-",
        pemerian: item.pemerian || "-",
        penyimpanan: item.penyimpanan || "-"
      }));
    } catch (err) {
      console.error(err);
    }
  };

  $: filteredLibrary = library.filter(item => item.jenis_daun !== "bukan daun");

  function chunkArray(array: LibraryResult[], size: number): LibraryResult[][] {
    const result: LibraryResult[][] = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }

  $: libraryChunks = chunkArray(filteredLibrary, 5);

  $: filteredAllLibrary = library.filter(item => item.jenis_daun !== "bukan daun");


  onMount(() => {
    console.log("Component mounted");
    loadLibrary();
  });
</script>

<div class="min-h-screen bg-gradient-soft from-green-200 to-teal-300">
  
  <Sidebar />

  <main class="lg:ml-64 p-6">
    <slot />
        <h1 class="text-4xl mt-5 lg:mt-0 mb-4">Perpustakaan</h1>
        <div>
          <section id="perpustakaan" class="w-full bg-white/50 p-5 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-y-4 gap-x-4">
            {#each libraryChunks as chunk, i(i)}
              <div class="w-full p-6 bg-neutral-primary-soft rounded-base shadow-xs mb-4 md:grid hidden">
                <div class="flow-root">
                  <ul role="list" class="divide-y divide-default">

                    {#each chunk as item (item.jenis_daun)}
                      <li class="py-4 sm:py-4">
                        <a
                          href={`/detail?nama=${encodeURIComponent(item.jenis_daun)}`}
                          class="flex items-center gap-2"
                        >
                        <div class="flex items-center gap-2">
                          <div class="shrink-0">
                            <img class="w-8 h-8 rounded-full"
                                src={`/images/${item.jenis_daun}.jpg`}
                                alt={item.jenis_daun + " image"}>
                          </div>

                          <div class="flex-1 min-w-0 ms-2">
                            <p class="font-medium text-heading truncate capitalize">
                              {item.jenis_daun}
                            </p>
                            <p class="text-sm text-body truncate">
                              {item.nama_latin}
                            </p>
                          </div>
                        </div>
                        </a>
                      </li>
                    {/each}

                  </ul>
                </div>
              </div>
            {/each}

            <div class="w-full p-6 bg-neutral-primary-soft rounded-base shadow-xs mb-4 block md:hidden">
                <div class="flow-root">
                  <ul role="list" class="divide-y divide-default">
                        {#each filteredAllLibrary as item (item.jenis_daun)}
                          <li class="py-4 sm:py-4">
                            <a
                              href={`/detail?nama=${encodeURIComponent(item.jenis_daun)}`}
                              class="flex items-center gap-2"
                            >

                              <div class="shrink-0">
                                <img
                                  class="w-8 h-8 rounded-full"
                                  src={`/images/${item.jenis_daun}.jpg`}
                                  alt={item.jenis_daun + " image"}
                                >
                              </div>

                              <div class="flex-1 min-w-0 ms-2">
                                <p class="font-medium text-heading truncate capitalize">
                                  {item.jenis_daun}
                                </p>
                                <p class="text-sm text-body truncate">
                                  {item.nama_latin}
                                </p>
                              </div>

                            </a>
                          </li>
                        {/each}
                  </ul>
                </div>
              </div>
      </section>
    </div>
  </main>

</div>