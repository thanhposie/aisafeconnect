/**
 * Model: Incident (MVC - Model Layer)
 * Xử lý toàn bộ thao tác dữ liệu liên quan đến Incidents (vi phạm)
 */

const { initDatabase, getIncidentsStore, saveIncidentsStore } = require('../db');

async function getAll() {
  await initDatabase();
  return getIncidentsStore();
}

async function resolveById(id) {
  await initDatabase();
  const incidents = await getIncidentsStore();
  const incident = incidents.find(i => i.id === id);
  if (!incident) return null;
  incident.status = 'resolved';
  await saveIncidentsStore(incidents);
  return incidents;
}

async function removeByUsername(username) {
  await initDatabase();
  const incidents = await getIncidentsStore();
  const filtered = incidents.filter(i => i.user !== username);
  await saveIncidentsStore(filtered);
  return filtered;
}

async function saveAll(incidents) {
  await initDatabase();
  return saveIncidentsStore(incidents);
}

module.exports = { getAll, resolveById, removeByUsername, saveAll };
