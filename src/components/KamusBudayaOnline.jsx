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
    <div className="bg-[#FCFBF7] rounded-3xl border border-[#D9CEBA] p-5 sm:p-8 shadow-[0_8px_30px_rgba(45,24,12,0.06)] space-y-6 text-[#2D180C]">
      {/* Header Kamus Online - Sesuai Foto 2 */}
      <div className="border-b border-[#D9CEBA]/60 pb-4 space-y-1.5 text-left">
        <h3 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D180C] leading-tight tracking-tight m-0">
          Kamus Basa Jawa Dasar Sehari-hari
        </h3>

        <p className="text-xs sm:text-sm text-[#2D180C]/75 m-0 leading-relaxed font-normal max-w-3xl">
          Panduan praktis kosakata Basa Jawa dasar yang lazim digunakan oleh masyarakat Jawa sehari-hari, lengkap dengan contoh kalimat pendek dan maknanya.
        </p>
      </div>

      {/* Kotak Petunjuk Khusus Kosakata Dasar Sehari-hari */}
      <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F5EFEB] border border-[#D9CEBA] border-l-4 border-l-[#8C532B] text-xs shadow-xs text-left">
        <Info size={17} className="text-[#8C532B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#2D180C] block font-extrabold text-xs">
            Petunjuk Penggunaan Kamus:
          </strong>
          <p className="text-[#554E46] m-0 leading-relaxed font-normal text-[11px] sm:text-xs">
            Kamus ini <strong>khusus memuat kosakata dasar percakapan sehari-hari orang Jawa</strong> (seperti ucapan salam, minta izin lewat, berbelanja di pasar, memesan makan di angkringan, dan bertutur sopan) untuk mempermudah komunikasi wisatawan. Kamus ini <em>tidak memuat kosakata sastra kuno atau istilah formal keraton yang rumit</em>.
          </p>
        </div>
      </div>

      {/* Search Input Bar & Rekomendasi Kata Populer */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-[#8C532B] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveWordId(null);
            }}
            placeholder="Cari kata dasar sehari-hari (contoh: Nyuwun sewu, Pinten nggih, Monggo, Terima kasih)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#FAF6EE] border border-[#D9CEBA] text-xs sm:text-sm text-[#2D180C] placeholder-[#8C532B]/60 focus:outline-none focus:border-[#8C532B] focus:ring-2 focus:ring-[#8C532B]/20 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveWordId(null);
              }}
              className="absolute right-3.5 w-6 h-6 rounded-full bg-[#D9CEBA]/50 hover:bg-[#D9CEBA] text-[#2D180C] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Hapus Pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tombol Pencarian Cepat Populer */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-[#554E46] text-left">
          <span className="font-semibold text-[#8C532B]">Kosakata dasar populer:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setSearchQuery(kw);
                setActiveWordId(null);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
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

      {/* KONDISI 1: Belum Melakukan Pencarian (Tampilan Standby Bersih) */}
      {!hasSearched && (
        <div className="p-8 sm:p-10 text-center rounded-3xl bg-[#FAF6EE]/80 border border-dashed border-[#D9CEBA] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FCFBF7] border border-[#D9CEBA] text-[#8C532B] flex items-center justify-center mx-auto shadow-xs">
            <Search size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#2D180C] font-['Outfit'] m-0">
              Cari Kosakata Dasar Basa Jawa &amp; Penggunaannya
            </h4>
            <p className="text-xs text-[#554E46] max-w-md mx-auto m-0 leading-relaxed">
              Ketik kata dasar pada kolom pencarian di atas atau pilih salah satu kata populer untuk melihat arti, lafal fonetik, dan contoh kalimat penggunaannya sehari-hari.
            </p>
          </div>
        </div>
      )}

      {/* KONDISI 2: Sudah Melakukan Pencarian dan Ada Hasilnya */}
      {hasSearched && filteredWords.length > 0 && activeWord && (
        <div className="space-y-4 pt-1 text-left">
          {/* Header Info Hasil Pencarian */}
          <div className="flex items-center justify-between text-xs text-[#554E46] border-b border-[#D9CEBA]/50 pb-2">
            <span>
              Ditemukan <strong className="text-[#2D180C]">{filteredWords.length}</strong> kosakata dasar untuk kata kunci "<strong className="text-[#2D180C]">{searchQuery}</strong>"
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveWordId(null);
              }}
              className="text-[#8C532B] hover:underline font-semibold cursor-pointer"
            >
              Tutup hasil
            </button>
          </div>

          {/* Jika ada beberapa hasil, tampilkan pill selector antar kata */}
          {filteredWords.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filteredWords.map((item) => {
                const isSelected = activeWord.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveWordId(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
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
          <div className="bg-[#FAF6EE] rounded-3xl border border-[#D9CEBA] p-5 sm:p-7 space-y-5 shadow-xs relative">
            {/* Header Kata, Lafal, Audio & Level */}
            <div className="border-b border-[#D9CEBA]/60 pb-4 space-y-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-2xl sm:text-3xl font-black text-[#2D180C] m-0 font-['Outfit']">
                      {activeWord.phrase}
                    </h4>
                    {/* Tombol Audio Pelafalan */}
                    <button
                      type="button"
                      onClick={() => handlePronounce(activeWord.phrase)}
                      className={`p-2 rounded-xl border border-[#D9CEBA] transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-[#2D180C] text-[#FAF6EE] scale-105'
                          : 'bg-[#FCFBF7] text-[#2D180C] hover:bg-[#FAF6EE] hover:border-[#8C532B]'
                      }`}
                      title="Dengarkan pengucapan lafal"
                      aria-label="Dengarkan Pengucapan"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  {activeWord.lafal && (
                    <div className="text-xs sm:text-sm font-mono text-[#8C532B] font-semibold">
                      Lafal: {activeWord.lafal}
                    </div>
                  )}
                </div>

                {/* Badges Level & Kategori */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-[#2D180C] text-[#FAF6EE] text-[10px] font-extrabold uppercase tracking-wide">
                    {activeWord.level}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FCFBF7] border border-[#D9CEBA] text-[#554E46] text-[10px] font-bold">
                    {activeWord.category}
                  </span>
                </div>
              </div>

              {/* Arti Kata dalam Bahasa Indonesia */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-[#8C532B] uppercase tracking-wider mb-0.5">
                  Arti / Makna Kata:
                </div>
                <div className="text-base sm:text-lg font-bold text-[#2D180C]">
                  {activeWord.meaning}
                </div>
              </div>
            </div>

            {/* CONTOH KALIMAT PENDEK SEHARI-HARI (Penggunaan Kata) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D180C]">
                <MessageSquareQuote size={15} className="text-[#8C532B]" />
                <span>Contoh Kalimat Pendek Sehari-hari:</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FCFBF7] border border-[#D9CEBA] space-y-2">
                <div className="text-xs sm:text-sm font-bold text-[#2D180C] leading-relaxed">
                  "{activeWord.exampleJawa}"
                </div>
                <div className="text-xs text-[#554E46] pt-1.5 border-t border-[#D9CEBA]/50 font-normal leading-relaxed">
                  <strong className="text-[#2D180C] font-semibold">Artinya: </strong>
                  "{activeWord.exampleIndo}"
                </div>
              </div>
            </div>

            {/* Situasi & Panduan Adab Penggunaan di Jogja */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D180C]">
                <Compass size={15} className="text-[#8C532B]" />
                <span>Situasi &amp; Adab Penggunaan di Jogja:</span>
              </div>
              <p className="text-xs text-[#554E46] m-0 leading-relaxed font-normal p-3 rounded-2xl bg-[#F5EFEB] border border-[#D9CEBA]">
                {activeWord.context}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KONDISI 3: Sudah Melakukan Pencarian Tetapi Kosakata Tidak Ditemukan */}
      {hasSearched && filteredWords.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-[#FAF6EE] border border-dashed border-[#D9CEBA] space-y-3">
          <BookOpen size={30} className="mx-auto text-[#8C532B]/60" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#2D180C]">
              Kosakata "{searchQuery}" tidak ditemukan
            </h4>
            <p className="text-xs text-[#554E46] max-w-sm mx-auto m-0 leading-relaxed">
              Kamus ini khusus memuat kosakata dasar percakapan sehari-hari. Coba cari kata dasar populer seperti 'Nyuwun sewu', 'Monggo', atau 'Pinten nggih?'.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveWordId(null);
            }}
            className="px-4 py-2 rounded-xl bg-[#2D180C] text-[#FAF6EE] text-xs font-bold hover:bg-[#432311] transition-colors cursor-pointer"
          >
            Bersihkan Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
