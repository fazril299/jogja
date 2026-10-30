import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  X,
  MessageSquareQuote,
  Compass,
  Info
} from 'lucide-react';
import { CULTURAL_DICTIONARY } from '../data/culturalEventsData';

export default function KamusBudayaOnline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWordId, setActiveWordId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Kata-kata populer yang sering dicari wisatawan
  const popularKeywords = [
    'Nyuwun sewu',
    'Monggo',
    'Pinten nggih?',
    'Matur nuwun sanget',
    'Ndherek langkung',
    'Pareng dipun enyang?'
  ];

  // Filter kosakata hanya jika user sudah mengetikkan pencarian
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const hasSearched = trimmedQuery.length > 0;

  const filteredWords = useMemo(() => {
    if (!hasSearched) return [];

    return CULTURAL_DICTIONARY.filter((item) => {
      const q = trimmedQuery;
      return (
        item.phrase.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        (item.exampleJawa && item.exampleJawa.toLowerCase().includes(q)) ||
        (item.exampleIndo && item.exampleIndo.toLowerCase().includes(q)) ||
        (item.context && item.context.toLowerCase().includes(q))
      );
    });
  }, [hasSearched, trimmedQuery]);

  // Kosakata aktif yang dipilih untuk ditampilkan secara mendalam
  const activeWord = useMemo(() => {
    if (filteredWords.length === 0) return null;
    const found = filteredWords.find((w) => w.id === activeWordId);
    return found || filteredWords[0];
  }, [filteredWords, activeWordId]);

  // Fungsi audio pelafalan berbasis Web Speech API
  const handlePronounce = (phrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'id-ID';
      utterance.rate = 0.82;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-[#FCFBF7] rounded-2xl sm:rounded-3xl border border-[#D9CEBA] p-3.5 sm:p-8 shadow-[0_8px_30px_rgba(45,24,12,0.06)] space-y-4 sm:space-y-6 text-[#2D180C]">
      {/* Header Kamus Online */}
      <div className="border-b border-[#D9CEBA]/60 pb-3 sm:pb-4 space-y-1 sm:space-y-1.5 text-left">
        <h3 className="font-['Outfit'] text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#2D180C] leading-tight tracking-tight m-0">
          Kamus Basa Jawa Dasar Sehari-hari
        </h3>

        <p className="text-[11px] sm:text-sm text-[#2D180C]/75 m-0 leading-relaxed font-normal max-w-3xl">
          Panduan praktis kosakata Basa Jawa dasar yang lazim digunakan oleh masyarakat Jawa sehari-hari, lengkap dengan contoh kalimat pendek dan maknanya.
        </p>
      </div>

      {/* Kotak Petunjuk Khusus Kosakata Dasar Sehari-hari */}
      <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5EFEB] border border-[#D9CEBA] border-l-4 border-l-[#8C532B] text-xs shadow-xs text-left">
        <Info size={16} className="text-[#8C532B] shrink-0 mt-0.5" />
        <div className="space-y-0.5 sm:space-y-1">
          <strong className="text-[#2D180C] block font-extrabold text-[11px] sm:text-xs">
            Petunjuk Penggunaan Kamus:
          </strong>
          <p className="text-[#554E46] m-0 leading-relaxed font-normal text-[10.5px] sm:text-xs">
            Kamus ini <strong>khusus memuat kosakata dasar percakapan sehari-hari orang Jawa</strong> (seperti ucapan salam, minta izin lewat, berbelanja di pasar, memesan makan di angkringan, dan bertutur sopan) untuk mempermudah komunikasi wisatawan. Kamus ini <em>tidak memuat kosakata sastra kuno atau istilah formal keraton yang rumit</em>.
          </p>
        </div>
      </div>

      {/* Search Input Bar & Rekomendasi Kata Populer */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="relative flex items-center">
          <Search
            size={16}
            className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-4 text-[#8C532B] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveWordId(null);
            }}
            placeholder="Cari kata dasar: Nyuwun sewu, Pinten nggih, Monggo, Terima kasih..."
            className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#FAF6EE] border border-[#D9CEBA] text-xs sm:text-sm text-[#2D180C] placeholder-[#8C532B]/60 focus:outline-none focus:border-[#8C532B] focus:ring-2 focus:ring-[#8C532B]/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveWordId(null);
              }}
              className="absolute right-2.5 sm:right-3.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D9CEBA]/50 hover:bg-[#D9CEBA] text-[#2D180C] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Hapus Pencarian"
            >
              <X size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>

        {/* Tombol Pencarian Cepat Populer (Scrollable Horizontal di Mobile) */}
        <div className="space-y-1 text-left">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C532B] block">Kosakata dasar populer:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10.5px] sm:text-[11px] text-[#554E46]">
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setSearchQuery(kw);
                  setActiveWordId(null);
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium whitespace-nowrap shrink-0 active:scale-95 ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#2D180C] text-[#FAF6EE] border-[#2D180C] font-bold shadow-xs'
                    : 'bg-[#FAF6EE] border-[#D9CEBA] text-[#2D180C] hover:border-[#8C532B] hover:text-black hover:font-bold'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KONDISI 1: Belum Melakukan Pencarian (Tampilan Standby Bersih) */}
      {!hasSearched && (
        <div className="p-5 sm:p-10 text-center rounded-2xl sm:rounded-3xl bg-[#FAF6EE]/80 border border-dashed border-[#D9CEBA] space-y-2 sm:space-y-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FCFBF7] border border-[#D9CEBA] text-[#8C532B] flex items-center justify-center mx-auto shadow-xs">
            <Search size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-base font-bold text-[#2D180C] font-['Outfit'] m-0">
              Cari Kosakata Dasar Basa Jawa &amp; Penggunaannya
            </h4>
            <p className="text-[10.5px] sm:text-xs text-[#554E46] max-w-md mx-auto m-0 leading-relaxed">
              Ketik kata dasar pada kolom pencarian di atas atau pilih salah satu kata populer untuk melihat arti, lafal fonetik, dan contoh kalimat penggunaannya sehari-hari.
            </p>
          </div>
        </div>
      )}

      {/* KONDISI 2: Sudah Melakukan Pencarian dan Ada Hasilnya */}
      {hasSearched && filteredWords.length > 0 && activeWord && (
        <div className="space-y-3 sm:space-y-4 pt-1 text-left">
          {/* Header Info Hasil Pencarian */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#554E46] border-b border-[#D9CEBA]/50 pb-1.5 sm:pb-2">
            <span>
              Ditemukan <strong className="text-[#2D180C]">{filteredWords.length}</strong> kosakata untuk "<strong className="text-[#2D180C]">{searchQuery}</strong>"
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveWordId(null);
              }}
              className="text-[#8C532B] hover:underline font-bold text-[10.5px] sm:text-xs cursor-pointer"
            >
              Tutup hasil
            </button>
          </div>

          {/* Jika ada beberapa hasil, tampilkan pill selector antar kata */}
          {filteredWords.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {filteredWords.map((item) => {
                const isSelected = activeWord.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveWordId(item.id)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap cursor-pointer border shrink-0 ${
                      isSelected
                        ? 'bg-[#2D180C] text-[#FAF6EE] border-[#2D180C] font-bold shadow-xs'
                        : 'bg-[#FAF6EE] text-[#554E46] border-[#D9CEBA] hover:border-[#8C532B] hover:text-black hover:font-bold'
                    }`}
                  >
                    {item.phrase}
                  </button>
                );
              })}
            </div>
          )}

          {/* Lembar Kartu Entri Kamus Lengkap dengan Penggunaannya */}
          <div className="bg-[#FAF6EE] rounded-2xl sm:rounded-3xl border border-[#D9CEBA] p-3.5 sm:p-7 space-y-3.5 sm:space-y-5 shadow-xs relative">
            {/* Header Kata, Lafal, Audio & Level */}
            <div className="border-b border-[#D9CEBA]/60 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-start justify-between gap-2.5 flex-wrap">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl sm:text-3xl font-black text-[#2D180C] m-0 font-['Outfit']">
                      {activeWord.phrase}
                    </h4>
                    {/* Tombol Audio Pelafalan */}
                    <button
                      type="button"
                      onClick={() => handlePronounce(activeWord.phrase)}
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-[#D9CEBA] transition-all cursor-pointer active:scale-95 ${
                        isSpeaking
                          ? 'bg-[#2D180C] text-[#FAF6EE] scale-105'
                          : 'bg-[#FCFBF7] text-[#2D180C] hover:bg-[#FAF6EE] hover:border-[#8C532B]'
                      }`}
                      title="Dengarkan pengucapan lafal"
                      aria-label="Dengarkan Pengucapan"
                    >
                      <Volume2 size={15} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {activeWord.lafal && (
                    <div className="text-[11px] sm:text-sm font-mono text-[#8C532B] font-semibold">
                      Lafal: {activeWord.lafal}
                    </div>
                  )}
                </div>

                {/* Badges Level & Kategori */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#2D180C] text-[#FAF6EE] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide">
                    {activeWord.level}
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#FCFBF7] border border-[#D9CEBA] text-[#554E46] text-[9px] sm:text-[10px] font-bold">
                    {activeWord.category}
                  </span>
                </div>
              </div>

              {/* Arti Kata dalam Bahasa Indonesia */}
              <div className="pt-1.5 sm:pt-2">
                <div className="text-[10px] sm:text-xs font-semibold text-[#8C532B] uppercase tracking-wider mb-0.5">
                  Arti / Makna Kata:
                </div>
                <div className="text-sm sm:text-lg font-bold text-[#2D180C]">
                  {activeWord.meaning}
                </div>
              </div>
            </div>

            {/* CONTOH KALIMAT PENDEK SEHARI-HARI (Penggunaan Kata) */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D180C]">
                <MessageSquareQuote size={14} className="text-[#8C532B]" />
                <span className="text-[11px] sm:text-xs">Contoh Kalimat Pendek Sehari-hari:</span>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FCFBF7] border border-[#D9CEBA] space-y-1.5 sm:space-y-2">
                <div className="text-xs sm:text-sm font-bold text-[#2D180C] leading-relaxed">
                  "{activeWord.exampleJawa}"
                </div>
                <div className="text-[10.5px] sm:text-xs text-[#554E46] pt-1 sm:pt-1.5 border-t border-[#D9CEBA]/50 font-normal leading-relaxed">
                  <strong className="text-[#2D180C] font-semibold">Artinya: </strong>
                  "{activeWord.exampleIndo}"
                </div>
              </div>
            </div>

            {/* Situasi & Panduan Adab Penggunaan di Jogja */}
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D180C]">
                <Compass size={14} className="text-[#8C532B]" />
                <span className="text-[11px] sm:text-xs">Situasi &amp; Adab Penggunaan di Jogja:</span>
              </div>
              <p className="text-[10.5px] sm:text-xs text-[#554E46] m-0 leading-relaxed font-normal p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F5EFEB] border border-[#D9CEBA]">
                {activeWord.context}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KONDISI 3: Sudah Melakukan Pencarian Tetapi Kosakata Tidak Ditemukan */}
      {hasSearched && filteredWords.length === 0 && (
        <div className="p-6 sm:p-8 text-center rounded-2xl bg-[#FAF6EE] border border-dashed border-[#D9CEBA] space-y-2.5 sm:space-y-3">
          <BookOpen size={24} className="sm:w-7 sm:h-7 mx-auto text-[#8C532B]/60" />
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#2D180C]">
              Kosakata "{searchQuery}" tidak ditemukan
            </h4>
            <p className="text-[10.5px] sm:text-xs text-[#554E46] max-w-sm mx-auto m-0 leading-relaxed">
              Kamus ini khusus memuat kosakata dasar percakapan sehari-hari. Coba cari kata dasar populer seperti 'Nyuwun sewu', 'Monggo', atau 'Pinten nggih?'.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveWordId(null);
            }}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#2D180C] text-[#FAF6EE] text-xs font-bold hover:bg-[#432311] transition-colors cursor-pointer active:scale-95"
          >
            Bersihkan Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
