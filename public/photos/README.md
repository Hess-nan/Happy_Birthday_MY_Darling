# Foto galeri

Simpan foto pribadi Anda di folder ini, misalnya:

```text
public/photos/foto-1.jpg
public/photos/foto-2.jpg
public/photos/foto-3.jpg
```

Kemudian buka `src/App.tsx`, cari `const PHOTOS`, dan ubah nilai `src` untuk setiap foto menjadi:

```ts
src: '/photos/foto-1.jpg'
```

Nama file harus sama persis, termasuk ekstensi `.jpg`, `.jpeg`, `.png`, atau `.webp`.
