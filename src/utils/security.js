import CryptoJS from 'crypto-js';

/**
 * Système de sécurité et chiffrement
 */

// Clé de chiffrement par défaut (à personnaliser)
const DEFAULT_KEY = 'MediTrack2024SecureKey';

/**
 * Chiffre une donnée avec AES
 */
export const encrypt = (data, key = DEFAULT_KEY) => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};

/**
 * Déchiffre une donnée
 */
export const decrypt = (encryptedData, key = DEFAULT_KEY) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Erreur de déchiffrement:', error);
    return null;
  }
};

/**
 * Hash un mot de passe avec SHA-256
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

/**
 * Vérifie un mot de passe
 */
export const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

/**
 * Sauvegarde des données chiffrées dans localStorage
 */
export const saveEncrypted = (key, data, encryptionKey = DEFAULT_KEY) => {
  const encrypted = encrypt(data, encryptionKey);
  localStorage.setItem(key, encrypted);
};

/**
 * Charge des données chiffrées depuis localStorage
 */
export const loadEncrypted = (key, encryptionKey = DEFAULT_KEY) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decrypt(encrypted, encryptionKey);
};

/**
 * Configure le mot de passe de l'application
 */
export const setAppPassword = (password) => {
  const hashed = hashPassword(password);
  localStorage.setItem('appPassword', hashed);
  localStorage.setItem('encryptionKey', password); // Stocké pour le chiffrement
};

/**
 * Vérifie le mot de passe de l'application
 */
export const verifyAppPassword = (password) => {
  const stored = localStorage.getItem('appPassword');
  if (!stored) return false;
  return verifyPassword(password, stored);
};

/**
 * Vérifie si un mot de passe est configuré
 */
export const hasPassword = () => {
  return localStorage.getItem('appPassword') !== null;
};

/**
 * Supprime le mot de passe de l'application
 */
export const removePassword = () => {
  localStorage.removeItem('appPassword');
  localStorage.removeItem('encryptionKey');
};

/**
 * Récupère la clé de chiffrement actuelle
 */
export const getEncryptionKey = () => {
  return localStorage.getItem('encryptionKey') || DEFAULT_KEY;
};
