import React from 'react';
import { motion } from 'framer-motion';
import { PassageGallery } from './PassageGallery';

export default function InstagramStories() {
  const jogjaSlides = [
    {
      id: 1,
      src: '/assets/images/jogja_merapi.jpg',
      alt: 'Gunung Merapi - Poros Kosmis Utara',
      title: 'Gunung Merapi',
      category: 'Poros Kosmis Utara'
    },
    {
      id: 2,
      src: '/assets/images/jogja_keraton.jpg',
      alt: 'Keraton Ngayogyakarta - Warisan UNESCO',
      title: 'Keraton Ngayogyakarta',
      category: 'Warisan UNESCO'
    },
    {
      id: 3,
      src: '/assets/images/jogja_tamansari.jpg',
      alt: 'Istana Air Tamansari - Cagar Budaya',
      title: 'Istana Air Tamansari',
      category: 'Cagar Budaya'
    },
    {
      id: 4,
      src: '/assets/images/jogja_prambanan.jpg',
      alt: 'Candi Prambanan - Mahakarya Abad ke-9',
      title: 'Candi Prambanan',
      category: 'Mahakarya Abad ke-9'
    },
    {
      id: 5,
      src: '/assets/images/jogja_ratuboko.jpg',
      alt: 'Senja Ratu Boko - Arkeologi Mataram',
      title: 'Senja Ratu Boko',
      category: 'Arkeologi Mataram'
    },
    {
      id: 6,
      src: '/assets/images/jogja_kotagede.jpg',
      alt: 'Warisan Kotagede - Ibu Kota Mataram',
      title: 'Warisan Kotagede',
      category: 'Ibu Kota Mataram'
    },
    {
      id: 7,
      src: '/assets/images/jogja_batik.jpg',
      alt: 'Kampung Batik Giriloyo - Sentra Batik Tulis',
      title: 'Kampung Batik Giriloyo',
      category: 'Sentra Batik Tulis'
    },
    {
      id: 8,
      src: '/assets/images/jogja_malioboro.jpg',
      alt: 'Malam Malioboro - Denyut Kota',
      title: 'Malam Malioboro',
      category: 'Denyut Kota'
    },
    {
      id: 9,
      src: '/assets/images/jogja_gudeg.jpg',
      alt: 'Gudeg Kering Wijilan - Kuliner Legendaris',
      title: 'Gudeg Kering Wijilan',
      category: 'Kuliner Legendaris'
    },
    {
      id: 10,
      src: '/assets/images/jogja_kasongan.jpg',
      alt: 'Gerabah Kasongan - Kriya Tanah Liat',
      title: 'Gerabah Kasongan',
      category: 'Kriya Tanah Liat'
    },
    {
      id: 11,
      src: '/assets/images/jogja_parangtritis.jpg',
      alt: 'Pantai Parangtritis - Poros Segara Kidul',
      title: 'Pantai Parangtritis',
      category: 'Poros Segara Kidul'
    },
    {
      id: 12,
      src: '/assets/images/jogja_tugu.jpg',
      alt: 'Tugu Pal Putih - Sumbu Filosofis',
      title: 'Tugu Pal Putih',
      category: 'Sumbu Filosofis'
    }
  ];

  return (
    <section
      id="stories-section"
      className="w-full relative bg-[#FAF6EE] text-[#1A1A1A] pt-20 sm:pt-28 pb-16 overflow-hidden border-none"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-4xl mx-auto px-6 mb-2 sm:mb-3 relative z-20 pointer-events-none">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2b1e16] leading-tight tracking-tight mb-3">
          Potret Keindahan Budaya, Alam &<br className="hidden sm:block" /> Kuliner Asli Yogyakarta
        </h2>

        <p className="text-xs sm:text-sm text-[#6e5849] font-sans max-w-xl mx-auto">
          Jelajahi keagungan visual candi, keraton, kriya batik, dan alam Jogja dalam galeri 3D interaktif berbasis WebGL.
        </p>
      </div>

      {/* 3D WEBGL CURVED RING GALLERY - SINGLE ROW PORTRAIT LIKE GAMBAR 2 */}
      <div className="w-full h-[62vh] min-h-[460px] max-h-[660px] relative z-10 bg-[#faf6ee] -mt-3 sm:-mt-6">
        <PassageGallery
          slides={jogjaSlides}
          layout="ring"
          scrollLength={4}
          imageSize={0.54}
          spacing={0.05}
          scatter={0}
          radius={0.025}
          cardAspect={0.68}
          rows={1}
          background="#faf6ee"
          fog={0.42}
          reflection={0.16}
          vignette={0.02}
          grain={0.005}
          motion={0}
          smoothing={0.6}
          tilt={0.35}
          intro={true}
        />
      </div>

      {/* SUBTEXT BELOW 3D GALLERY */}
      <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-[#7d6756] font-sans relative z-20">
        Tandai{' '}
        <span className="text-[#8b4f1e] font-semibold">@hamemayu.official</span>{' '}
        agar foto dokumentasi budaya Anda berkesempatan dikurasi.
      </div>
    </section>
  );
}
