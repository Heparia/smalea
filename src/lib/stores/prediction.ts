import { writable } from "svelte/store";

export type Result = {
  label: string;
  confidence: number;
};

export type Detail = {
  jenis_daun: string;
  nama_latin: string;
  keluarga: string;
  zat: string;
  penggunaan: string;
  pemerian: string;
  penyimpanan: string;
};

export const predictionResults = writable<Result[]>([]);
export const predictionDetail = writable<Detail[]>([]);