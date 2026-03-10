<script lang="ts">
  import '../../app.css';
  import Sidebar from "$lib/Sidebar.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from '$lib/baseUrl';
  import { page } from '$app/stores';

  interface LibraryResult {
    jenis_daun: string;
    nama_latin: string;
    keluarga: string;
    zat: string;
    penggunaan: string;
    pemerian: string;
    penyimpanan: string;
  }

  let jenisDaun: LibraryResult | null = null;
  $: from = $page.url.searchParams.get("from");

  async function loadJenisDaun(nama: string) {
    try {
      const res = await fetch(
        `${BASE_URL}/library/${encodeURIComponent(nama)}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();

      const item = result.result;

      if (!item) {
        console.error("Data daun tidak ditemukan");
        return;
      }

      jenisDaun = {
        jenis_daun: item.jenis_daun || "Tidak diketahui",
        nama_latin: item.nama_latin || "-",
        keluarga: item.keluarga || "-",
        zat: item.zat || "-",
        penggunaan: item.penggunaan || "-",
        pemerian: item.pemerian || "-",
        penyimpanan: item.penyimpanan || "-"
      };

    } catch (err) {
      console.error(err);
    }
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nama = urlParams.get("nama");
    console.log("nama dari url:", nama);

    if (nama) {
      console.log("nama dari url:", nama);
      loadJenisDaun(nama);
    }
  });
</script>

<div class="min-h-screen bg-gradient-soft from-green-200 to-teal-300">

  <Sidebar />

  <main class="lg:ml-64 p-6">
    <nav class="flex text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-2">
        <li>
          {#if from === "prediksi"}
          <button
            on:click={() => history.back()}
            class="no-underline hover:underline hover:text-green-700"
          >
            Prediksi
          </button>
          {:else}
            <a
              href="/perpustakaan"
              class="no-underline hover:underline hover:text-green-700"
            >
              Perpustakaan
            </a>
          {/if}
        </li>

        <li>/</li>

        <li class="text-gray-800 font-medium capitalize">
          {jenisDaun?.jenis_daun}
        </li>

      </ol>
    </nav>
    <h1 class="text-4xl mt-5 lg:mt-0 mb-4">Detail Daun</h1>

    {#if jenisDaun}
    <div class="flex flex-col md:flex-row justify-start items-stretch gap-3">

      <!-- LEFT : IMAGE -->
      <div class="aspect-square">
        <img
          src={`/images/${jenisDaun.jenis_daun}.jpg`}
          alt={jenisDaun.jenis_daun}
          class="rounded-xl shadow-lg w-full max-w-9xl h-auto object-contain"
        />
      </div>

      <!-- RIGHT : DETAIL -->
      <div class="space-y-4 bg-white/70 p-6 rounded-xl shadow">

        <div>
          <h2 class="text-3xl font-bold text-gray-800 capitalize">
            {jenisDaun.jenis_daun}
          </h2>
          <p class="italic text-gray-600">{jenisDaun.nama_latin}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700">Keluarga</h3>
          <p>{jenisDaun.keluarga}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700">Kandungan Zat</h3>
          <p>{jenisDaun.zat}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700">Penggunaan</h3>
          <p>{jenisDaun.penggunaan}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700">Pemerian</h3>
          <p>{jenisDaun.pemerian}</p>
        </div>

        <div>
          <h3 class="font-semibold text-gray-700">Penyimpanan</h3>
          <p>{jenisDaun.penyimpanan}</p>
        </div>

      </div>

    </div>

    {:else}
      <p class="text-gray-600">Memuat data daun...</p>
    {/if}

  </main>

</div>