<script lang="ts">
  import '../app.css';
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

  onMount(() => {
    console.log("Component mounted");
    loadLibrary();
  });
</script>

<div class="min-h-screen bg-gradient-soft from-green-200 to-teal-300">
  
  <Sidebar />

  <main class="lg:ml-64 p-6 flex flex-row items-start gap-5">
    <slot />
    <div class="flex flex-col gap-5 flex-3">
      <section id="prediksi" class="bg-white/50 p-6 rounded-lg">
        <h2 class="text-darkblue text-3xl">Prediksi</h2>
        <p class="mb-3">Tunggu 3 detik untuk prediksi selanjutnya</p>
        <div class="flex flex-row gap-5">
          <div class="bg-light w-85 aspect-square rounded-lg flex justify-center items-center gap-3">
            <a href="/camera?mode=upload" aria-label="upload file" class="flex flex-col justify-center items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-20 text-secondary">
                <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
              </svg>
              <p>Upload file</p>
              <p><i>*maksimal 1 mb</i></p>
            </a>
          </div>
          <div class="bg-light w-85 aspect-square rounded-lg flex justify-center items-center gap-3">
            <a href="/camera" aria-label="ambil foto" class="flex flex-col justify-center items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-20 text-accent">
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
              </svg>
              <p>Ambil foto</p>
            </a>
          </div>
        </div>
      </section>
      <section id="capaian_pembelajaran" class="bg-white/50 p-6 rounded-lg">
        <div class="w-full max-w-3xl ">
          <h2 class="text-darkblue text-2xl">Capaian Pembelajaran</h2>
          <p>Peserta didik mampu memahami jenis-jenis tanaman obat Indonesia (simplisia), fungsi empiris, dan cara pengolahannya</p>
        </div>
      </section>
    </div>
    <div class="flex-2">
      <section id="perpustakaan" class="bg-white/50 p-5 rounded-lg">
        <div class="w-full max-w-xl p-6 bg-neutral-primary-soft rounded-base shadow-xs">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-darkblue text-3xl">Perpustakaan</h2>
                <a href="/perpustakaan" class="font-medium text-fg-brand hover:underline">Lihat semua</a>
          </div>
          <div class="flow-root">
                <ul role="list" class="divide-y divide-default">
                  {#each library   
                    .filter(item => item.jenis_daun !== "bukan daun")
                    .slice(0,6) as item (item.jenis_daun)}
                      <li class="py-4 sm:py-4">
                        <div class="flex items-center gap-2">
                          <div class="shrink-0">
                            <img class="w-8 h-8 rounded-full" src={`/images/${item.jenis_daun}.jpg`} alt={item.jenis_daun + " image"}>
                          </div>
                          <div class="flex-1 min-w-0 ms-2">
                            <p class="font-medium text-heading truncate">
                              {item.jenis_daun}
                            </p>
                            <p class="text-sm text-body truncate">
                              {item.nama_latin}
                            </p>
                          </div>
                        </div>
                      </li>
                  {/each}
                </ul>
          </div>
        </div>
      </section>
    </div>
  </main>

</div>

<!-- Konten Utama
<div class="font-display flex flex-col items-center justify-center py-10 bg-white w-full">
  <div class="bg-white/80 p-5 rounded-xl flex flex-col items-center gap-2">
    <div class="mt-10 w-20">
      <img src="/logo.png" alt="Forest Illustration" class="w-full object-cover" />
    </div>
    <h1 class="text-4xl font-bold mt-4">Daun Herbal</h1>
    <h2 class="text-4xl font-bold text-green-600">Pindai & Kenali</h2>
    <p class="text-center text-black-600 text-sm max-w-xs mt-2">
      Pindai foto untuk mengetahui jenis daun, khasiat, serta pemanfaatannya dalam kuliner
    </p> -->

    <!-- Tombol Aksi -->
    <!-- <div class="flex gap-4 mt-6 items-center justify-center">
      <a href="/materi" class="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md">
        Materi
      </a>
      <a href="/camera" class="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md">
        Mulai Memindai
      </a>
    </div>
  </div>
</div> -->