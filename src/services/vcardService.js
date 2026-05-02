const sanitizeFileName = (value) =>
  String(value || 'contact')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'contact';

const escapeVCardValue = (value) =>
  String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

const formatDisplayName = (value) => {
  const normalized = String(value || '')
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ');

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const buildVCard = ({ name, phone, email, company }) => {
  const displayName = formatDisplayName(name);
  const fileName = `${sanitizeFileName(name)}.vcf`;

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(displayName)}`,
    `N:${escapeVCardValue(displayName)};;;;`,
    `ORG:${escapeVCardValue(company)}`,
    `TEL;TYPE=CELL:${escapeVCardValue(phone)}`,
    `EMAIL:${escapeVCardValue(email)}`,
    'END:VCARD',
  ].join('\r\n');

  return {
    fileName,
    vcard,
  };
};

module.exports = {
  buildVCard,
};