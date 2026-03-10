<script lang="ts">
  type Result = {
    label: string;
    confidence: number;
  };

  type Detail = {
    jenis_daun: string;
    nama_latin: string;
    keluarga: string;
    zat: string;
    penggunaan: string;
    pemerian: string;
    penyimpanan: string;
  };

  export let results: Result[] = [];
  export let detail: Detail[] = [];
  export let size: "small" | "large" = "small";

  // gabungkan result + detail berdasarkan label/jenis_daun
  $: merged = results.map((r) => {
    const d = detail.find(
      (x) => x.jenis_daun.toLowerCase() === r.label.toLowerCase()
    );

    return {
      label: r.label,
      confidence: r.confidence,
      jenis_daun: d?.jenis_daun ?? r.label,
      nama_latin: d?.nama_latin ?? "",
      keluarga: d?.keluarga ?? "",
      zat: d?.zat ?? "",
      penggunaan: d?.penggunaan ?? "",
      pemerian: d?.pemerian ?? "",
      penyimpanan: d?.penyimpanan ?? ""
    };
  });
</script>

<div class="w-full p-6 bg-neutral-primary-soft rounded-base shadow-xs mb-4 block">
  <div class="flow-root">
    <ul role="list" class="divide-y divide-default">
      {#each merged as item (item.label)}
        <li class="py-4 sm:py-4">
          <a
            href={`/detail?nama=${encodeURIComponent(item.jenis_daun)}&from=prediksi`}
            class="flex items-center gap-2"
          >
            <div class="shrink-0">
              <img
                class="w-8 h-8 rounded-full"
                  src={item.label === "bukan daun"
                    ? "/images/default-img.jpg"
                    : `/images/${item.label}.jpg`}
                alt={`${item.jenis_daun} image`}
                  on:error={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = "/images/default-img.jpg";
                }}
              >
            </div>

            <div class="flex-1 min-w-0 ml-2 text-start">
              <p class="font-medium text-heading truncate capitalize">
                {item.jenis_daun}
              </p>
              <p class="text-sm text-body truncate">
                {item.nama_latin}
              </p>
            </div>
            <div class="inline-flex items-center font-medium text-heading">
              {(item.confidence * 100).toFixed(10)}%
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<!-- <div class="flex flex-wrap gap-4 justify-center">
  {#each merged as item (item.label)}
    <div class="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center text-center">
      
      <img
        src={`/images/${item.label}.jpg`}
        alt={item.label}
        class="rounded-lg mb-3 h-25 w-full object-cover"
        on:error={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/images/default-img.jpg";
        }}
      />

      <h2 class="font-bold text-lg mb-1">
        {item.label.toUpperCase()}
      </h2>

      <p class="text-sm mb-2">
        {(item.confidence * 100).toFixed(10)}%
      </p>

      {#if item.nama_latin}
        <p class="text-sm"><strong>Gizi:</strong> {item.nama_latin}</p>
      {/if}
    </div>
  {/each}
</div> -->