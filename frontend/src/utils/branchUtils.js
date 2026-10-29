/**
 * Türkçe ve sözel branş denetimi:
 * Türkçe, Türk Dili ve Edebiyatı, Tarih, Coğrafya, Felsefe, Din Kültürü, İnkılap Tarihi ve İngilizce gibi
 * sözel branşlara KESİNLİKLE hiçbir sayısal/geometrik şekil ve diyagram bağlanamaz/gösterilemez.
 */
export function isVerbalBranch(subject = '', topic = '') {
  const normalize = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/i̇/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u');
  };

  const s = `${normalize(subject)} ${normalize(topic)}`;
  const verbalTerms = [
    'turkce',
    'edebiyat',
    'tarih',
    'cografya',
    'felsefe',
    'din',
    'inkilap',
    'sosyal',
    'ingilizce',
    'sozel',
    'paragraf',
    'dil bilgisi',
    'metin'
  ];

  return verbalTerms.some(term => s.includes(term));
}
