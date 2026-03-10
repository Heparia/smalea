<script lang="ts">
  import EasyCamera from '@cloudparker/easy-camera-svelte';
  import PredictionCard from '$lib/PredictionCard.svelte';
  import { onMount,tick } from 'svelte';
  import "$lib/styles/style.css";
	import { BASE_URL } from '$lib/baseUrl';
  import Sidebar from "$lib/Sidebar.svelte";

  let fileInput: HTMLInputElement;

  interface PredictionResult {
    results: {
      label: string;
      confidence: number;
    }[];
    detail: {
      jenis_daun: string;
      nama_latin: string;
      keluarga: string;
      zat: string;
      penggunaan: string;
      pemerian: string;
      penyimpanan: string;
    }[];
    inference_time_ms: number;
  }

  let width = 600;
  let camera: EasyCamera | null = null;
  let mirrorDisplay = true;
  let predictionResult: PredictionResult | null = null;
  let preview: string | null = null;

  // --- Capture image dari kamera ---
  const handleImage = async () => {
    if (!camera) return;

    try {
      // const dataUrl: string = await camera.captureImage();
      const dataUrl = await camera.captureImage() as string;

      // Convert dataURL ke Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "capture.png");

      const response = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Prediction result:", data);
      // predictionResult = JSON.stringify(data);
      
      predictionResult = data;
      sessionStorage.setItem("predictionResult", JSON.stringify(data));
    } catch (err) {
      console.error("Error capturing image or sending to backend:", err);
    }
  };

  // --- Upload image dari file input ---
  const handleUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Preview image di kamera
    const reader = new FileReader();
    reader.onload = () => {
      preview = reader.result as string;
      sessionStorage.setItem("preview", preview);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Prediction result (upload):", data);
      predictionResult = data;
      sessionStorage.setItem("predictionResult", JSON.stringify(data));
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const reset = () => {
    preview = null;
    predictionResult = null;
    sessionStorage.removeItem("preview");
    sessionStorage.removeItem("predictionResult");
  }

  // const handleUpload = async (event?: Event) => {
  //   let file: File | null = null;

  //   if (event) {
  //     const input = event.target as HTMLInputElement;
  //     if (!input.files || input.files.length === 0) return;
  //     file = input.files[0];
  //   } else if (fileInput?.files && fileInput.files.length > 0) {
  //     file = fileInput.files[0];
  //   } else {
  //     return; // cukup return saja
  //   }

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     preview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const response = await fetch(`${BASE_URL}/predict`, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   const data = await response.json();
  //   predictionResult = data;
  // };

  onMount(async () => {
    await tick();
      const savedPrediction = sessionStorage.getItem("predictionResult");
      const savedPreview = sessionStorage.getItem("preview");

      if (savedPrediction) {
        predictionResult = JSON.parse(savedPrediction) as PredictionResult;
      }

      if (savedPreview) {
        preview = savedPreview;
      }

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode == "upload") {
      fileInput.click();
    }
  });
</script>

<!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
<div class="min-h-screen bg-gradient-soft from-green-200 to-teal-300">
  
  <Sidebar />

  <main class="lg:ml-64 p-6 flex flex-row items-start gap-5">
    <slot />
    <div class="bg-gradient-soft flex flex-col md:flex-row justify-center items-start gap-5 w-full">
      <div style="flex:1" class="mb-6">
        <div class="flex justify-center">
          <div class="w-full max-w-[600px] aspect-square overflow-hidden rounded-lg bg-black">
            {#if preview}
              <!-- Preview image upload -->
              <img
                src={preview}
                alt="Preview"
                class="w-600 h-full object-cover"
              />
            {:else}
              <!-- Kamera aktif -->
              <EasyCamera
                bind:this={camera}
                bind:width
                autoOpen
                bind:mirrorDisplay
              />
            {/if}
          </div>
        </div>

        <div class="flex gap-4 mt-6 items-center justify-center">
        <div class="hover:bg-gray-900 px-4 py-2 rounded bg-gray-800 text-white rounded-lg shadow-md text-center">
        <button type="button" on:click={reset} class="cursor-pointer" aria-label="Upload image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 0 1 3.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 0 0-4.392-4.392 49.422 49.422 0 0 0-7.436 0A4.756 4.756 0 0 0 3.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 1 0 1.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 0 1 3.01-3.01c1.19-.09 2.392-.135 3.605-.135Zm-6.97 6.22a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 0 0 4.392 4.392 49.413 49.413 0 0 0 7.436 0 4.756 4.756 0 0 0 4.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 0 0-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 0 1-3.01 3.01 47.953 47.953 0 0 1-7.21 0 3.256 3.256 0 0 1-3.01-3.01 47.759 47.759 0 0 1-.1-1.759L6.97 15.53a.75.75 0 0 0 1.06-1.06l-3-3Z" clip-rule="evenodd" />
          </svg>
        </button>
        </div>
          <div class="hover:bg-gray-900 px-4 py-2 rounded bg-gray-800 text-white rounded-lg shadow-md text-center">
            <button type="button" on:click={handleImage} class="cursor-pointer" aria-label="Upload image">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
          </div>
          <div class="hover:bg-gray-900 px-4 py-2 rounded bg-gray-800 text-white rounded-lg shadow-md text-center">
            <label class="cursor-pointer">
              Upload Image
              <!-- <input type="file" accept="image/*" on:change={handleUpload} class="hidden" /> -->
              <input type="file" accept="image/*" bind:this={fileInput} on:change={handleUpload} class="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div style="flex:1; width: stretch">
        <div class="flex flex-col justify-center items-center bg-white/80 p-5 rounded-xl text-center">
          <strong class="text-3xl">Hasil Prediksi</strong><br>
          {#if predictionResult?.results && predictionResult.detail}
          <PredictionCard
            results={predictionResult.results}
            detail={predictionResult.detail}
          />
          {:else}
            <p class="text-gray-500">Prediction will appear here after capture/upload.</p>
          {/if}
        </div>

      </div>
    </div>
  </main>
</div>

<style>
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
</style>
