import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { PassageGallery } from './PassageGallery';

export default function InstagramStories() {
  const galleryRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  const handlePrev = () => {
    if (galleryRef.current) {
      galleryRef.current.prev();
      setCurrentSlideIndex((prev) => (prev - 1 + jogjaSlides.length) % jogjaSlides.length);
    }
  };

  const handleNext = () => {
    if (galleryRef.current) {
      galleryRef.current.next();
      setCurrentSlideIndex((prev) => (prev + 1) % jogjaSlides.length);
    }
  };

  // Keyboard navigation support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSlide = jogjaSlides[currentSlideIndex] || jogjaSlides[0];

  return (
    <section
      id="stories-section"
      className="w-full relative bg-[#FAF6EE] text-[#1A1A1A] pt-20 sm:pt-28 pb-16 overflow-hidden border-none"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-4xl mx-auto px-6 mb-2 sm:mb-3 relative z-20 pointer-events-none">
        <h2 className="font-['Outfit'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2b1e16] leading-tight tracking-tight mb-3">
          Potret Keindahan Budaya, Alam &<br className="hidden sm:block" /> Kuliner Asli Yogyakarta
        </h2>
      </div>

      {/* 3D WEBGL CURVED RING GALLERY WITH SCROLL & DRAG NAVIGATION */}
      <div className="w-full h-[62vh] min-h-[460px] max-h-[660px] relative z-10 bg-[#faf6ee] -mt-3 sm:-mt-6 group/gallery">
        <PassageGallery
          ref={galleryRef}
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

        {/* FLOATING LEFT SCROLL BUTTON */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/90 hover:bg-white text-[#2C221E] shadow-[0_8px_30px_rgba(44,34,30,0.18)] border border-[#EAE3D6] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Geser ke kiri / foto sebelumnya"
          title="Geser Kiri (Sebelumnya)"
        >
          <ChevronLeft size={24} className="text-[#2C221E]" />
        </button>

        {/* FLOATING RIGHT SCROLL BUTTON */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/90 hover:bg-white text-[#2C221E] shadow-[0_8px_30px_rgba(44,34,30,0.18)] border border-[#EAE3D6] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Geser ke kanan / foto selanjutnya"
          title="Geser Kanan (Selanjutnya)"
        >
          <ChevronRight size={24} className="text-[#2C221E]" />
        </button>

        {/* INTERACTIVE CONTROLS & ACTIVE SLIDE PILL */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#EAE3D6] shadow-[0_6px_20px_rgba(44,34,30,0.12)] max-w-[92vw]">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-[#FAF6EE] hover:bg-[#EAE3D6] text-[#2C221E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 px-1 min-w-0">
            <Compass size={13} className="text-[#C99B52] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-[#2C221E] truncate max-w-[150px] sm:max-w-[220px]">
              {activeSlide.title}
            </span>
            <span className="text-[10px] text-[#8A5D26] font-semibold bg-[#FAF4E8] px-1.5 py-0.5 rounded-full border border-[#EFE0C7] shrink-0">
              {currentSlideIndex + 1}/{jogjaSlides.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-[#FAF6EE] hover:bg-[#EAE3D6] text-[#2C221E] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Selanjutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* SUBTEXT & GESTURE HINT BELOW 3D GALLERY */}
      <div className="text-center mt-4 sm:mt-5 px-4 text-xs sm:text-sm text-[#7d6756] font-sans relative z-20 space-y-1">
        <p className="m-0 font-medium">
          Tandai{' '}
          <span className="text-[#8b4f1e] font-semibold">@hamemayu.official</span>{' '}
          agar foto dokumentasi budaya Anda berkesempatan dikurasi.
        </p>
        <p className="m-0 text-[11px] text-[#A39281]">
          💡 Tips: Geser mouse/jari ke kanan-kiri, scroll roda mouse, atau tekan panah keyboard (← / →) untuk memutar galeri 360°.
        </p>
      </div>
    </section>
  );
}
