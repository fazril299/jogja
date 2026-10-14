/**
 * Jogja Cultural Sanctuary - Modul Keamanan Sensor GPS & Anti-Spoofing Guard
 * Melindungi verifikasi kunjungan budaya & klaim badge dari bypass, fake GPS, dan manipulasi data.
 */

// Batas Geografis Ketat Provinsi D.I. Yogyakarta
export const JOGJA_GEO_BOUNDS = {
  minLat: -8.25,
  maxLat: -7.50,
  minLng: 110.00,
  maxLng: 110.86
};

// Radius toleransi kehadiran di lokasi cagar budaya (dalam meter)
export const MAX_CHECKIN_RADIUS_METERS = 1500; // 1.5 KM dari titik episentrum cagar budaya

// Secret salt untuk integritas signature checksum di client-side
const INTEGRITY_SALT = 'JOGJAKRAMA_MATARAM_SACRED_2026';

/**
 * Menghitung jarak geodetik Haversine nyata antara dua titik koordinat (dalam meter)
 */
export function getHaversineDistance(coordA, coordB) {
  if (!coordA || !coordB) return null;
  const R = 6371000; // meter
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(coordB.lat - coordA.lat);
  const dLng = toRad(coordB.lng - coordA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coordA.lat)) *
      Math.cos(toRad(coordB.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Simple Hash Function (Murmur-like 32-bit mix) untuk menghasilkan Cryptographic-style Checksum Signature
 */
export function generateIntegritySignature(placeId, userId, lat, lng, timestamp) {
  const payload = `${placeId}|${userId || 'guest'}|${Number(lat).toFixed(4)}|${Number(lng).toFixed(4)}|${timestamp}|${INTEGRITY_SALT}`;
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  return `JK-${(hash1 >>> 0).toString(16)}-${(hash2 >>> 0).toString(16)}`;
}

/**
 * Memvalidasi apakah signature bukti kunjungan sah atau hasil modifikasi localStorage manual
 */
export function verifyIntegritySignature(record, userId) {
  if (!record || !record.proofSignature) return false;
  const expected = generateIntegritySignature(
    record.placeId,
    userId,
    record.lat,
    record.lng,
    record.verifiedAt
  );
  return record.proofSignature === expected;
}

/**
 * Validasi Komprehensif Sensor GPS Nyata (Anti-Spoofing & Anti-Bypass Guard)
 * Menguji 5 Lapisan Keamanan:
 * 1. Geofence Lock D.I. Yogyakarta
 * 2. Sensor Hardware Accuracy Sanity Check
 * 3. Proximity / Radius Check ke Lokasi Destinasi
 * 4. Velocity Sanity Check (Anti-Teleportasi antar check-in)
 * 5. Mock Location Flag Inspection
 */
export function validateGpsSecurity({
  userCoords,
  targetCoords,
  placeName,
  lastCheckInRecord,
  customMaxRadius
}) {
  if (!userCoords || typeof userCoords.lat !== 'number' || typeof userCoords.lng !== 'number') {
    return {
      isValid: false,
      code: 'GPS_NOT_AVAILABLE',
      message: 'Sensor GPS perangkat tidak terdeteksi atau izin lokasi belum diberikan.'
    };
  }

  const { lat, lng, accuracy, timestamp, isMocked, isSimulated } = userCoords;

  const isLocalDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  // 1. Deteksi Flag Mock Location (Kecuali Mode Uji Coba Pengembang / Localhost)
  if (!isLocalDev && !isSimulated && (isMocked === true || userCoords.mocked === true)) {
    return {
      isValid: false,
      code: 'MOCK_DETECTED',
      message: 'Sistem mendeteksi penggunaan aplikasi Lokasi Palsu (Mock GPS / Fake Location). Matikan opsi pengembang untuk melanjutkan verifikasi.'
    };
  }

  // 2. Geofence Check: Wajib berada di batas geografis resmi D.I. Yogyakarta (Kecuali Localhost / Simulasi)
  const insideJogja =
    lat >= JOGJA_GEO_BOUNDS.minLat &&
    lat <= JOGJA_GEO_BOUNDS.maxLat &&
    lng >= JOGJA_GEO_BOUNDS.minLng &&
    lng <= JOGJA_GEO_BOUNDS.maxLng;

  if (!insideJogja && !isSimulated && !isLocalDev) {
    return {
      isValid: false,
      code: 'OUTSIDE_JOGJA_GEOFENCE',
      message: `Koordinat Anda (${lat.toFixed(4)}, ${lng.toFixed(4)}) berada di luar wilayah Daerah Istimewa Yogyakarta.`
    };
  }

  // 3. Sensor Accuracy Sanity Check
  if (accuracy !== undefined && accuracy !== null) {
    if (accuracy <= 0) {
      return {
        isValid: false,
        code: 'ANOMALOUS_ACCURACY',
        message: 'Akurasi sensor GPS tidak wajar (0 meter). Terindikasi injeksi data koordinat tiruan.'
      };
    }
    if (accuracy > 300) {
      return {
        isValid: false,
        code: 'LOW_ACCURACY',
        message: `Akurasi sensor GPS Anda terlalu rendah (±${Math.round(accuracy)} meter). Tunggu beberapa detik di tempat terbuka agar GPS mengunci posisi dengan tepat.`
      };
    }
  }

  // 4. Anti-Teleportation / Velocity Check
  if (lastCheckInRecord && lastCheckInRecord.lat && lastCheckInRecord.lng && lastCheckInRecord.verifiedAt) {
    const prevTime = new Date(lastCheckInRecord.verifiedAt).getTime();
    const nowTime = timestamp ? new Date(timestamp).getTime() : Date.now();
    const timeDeltaSeconds = Math.max(1, (nowTime - prevTime) / 1000);
    const distanceMeters = getHaversineDistance(
      { lat: lastCheckInRecord.lat, lng: lastCheckInRecord.lng },
      { lat, lng }
    );

    if (distanceMeters !== null && distanceMeters > 300) {
      const speedKmH = (distanceMeters / 1000) / (timeDeltaSeconds / 3600);
      if (speedKmH > 140) {
        return {
          isValid: false,
          code: 'VELOCITY_ANOMALY',
          message: `Terdeteksi anomali perpindahan lokasi (${Math.round(distanceMeters)}m dalam ${Math.round(timeDeltaSeconds)} detik, kecepatan ${Math.round(speedKmH)} km/jam). Sistem mendeteksi potensi spoofing teleportasi lokasi.`
        };
      }
    }
  }

  // 5. Radius Proximity Check ke Lokasi Destinasi (Sesuai Tingkat Kesulitan)
  if (targetCoords) {
    const maxRadius = customMaxRadius || MAX_CHECKIN_RADIUS_METERS;
    const distanceToTarget = getHaversineDistance({ lat, lng }, targetCoords);
    if (distanceToTarget === null) {
      return {
        isValid: false,
        code: 'TARGET_COORDS_MISSING',
        message: 'Data koordinat destinasi tidak valid.'
      };
    }

    if (distanceToTarget > maxRadius && !isSimulated && !isLocalDev) {
      const distKm = (distanceToTarget / 1000).toFixed(1);
      const radiusLabel = maxRadius >= 1000 ? `${(maxRadius / 1000).toFixed(1)} KM` : `${maxRadius} m`;
      return {
        isValid: false,
        code: 'DISTANCE_TOO_FAR',
        distanceMeters: distanceToTarget,
        maxRadiusAllowed: maxRadius,
        message: `Posisi Anda masih berjarak ${distKm} km dari ${placeName || 'lokasi destinasi'}. Silakan dekati area cagar budaya (radius toleransi maksimal ${radiusLabel}) untuk membuka badge ini secara sah.`
      };
    }

    return {
      isValid: true,
      distanceMeters: distanceToTarget,
      accuracy: accuracy || 15,
      message: `Verifikasi GPS Sukses! Anda terdeteksi berada di lokasi (${distanceToTarget} m dari episentrum ${placeName}).`
    };
  }

  return {
    isValid: true,
    accuracy: accuracy || 15,
    message: 'Verifikasi koordinat GPS D.I. Yogyakarta valid.'
  };
}
