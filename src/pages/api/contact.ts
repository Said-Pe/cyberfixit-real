// src/pages/api/contact.ts
// API endpoint – recibe POST con los datos del formulario de contacto
// y los guarda en Neon Postgres usando postgres.js (TCP estándar)
// Funciona en local (Node.js) y en Vercel Serverless Functions.

import type { APIRoute } from 'astro';
import postgres from 'postgres';

export const prerender = false; // Necesario en modo hybrid

// ── Cliente Postgres ──────────────────────────────────────────────────────────
// En local usa .env.local, en Vercel usa las env vars inyectadas por Neon/Vercel.
// POSTGRES_URL_NON_POOLING evita conflictos con pgBouncer en funciones serverless.
const connectionString =
  import.meta.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL_NON_POOLING ??
  import.meta.env.POSTGRES_URL ??
  process.env.POSTGRES_URL ?? '';

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,          // Una sola conexión por instancia (serverless)
  idle_timeout: 20,
  connect_timeout: 10,
});

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ContactPayload {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

// ── Validación mínima del servidor ────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(
  body: unknown,
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Cuerpo de solicitud inválido.' };
  }

  const b = body as Record<string, unknown>;
  const nombre   = typeof b.nombre   === 'string' ? b.nombre.trim()   : '';
  const email    = typeof b.email    === 'string' ? b.email.trim()    : '';
  const mensaje  = typeof b.mensaje  === 'string' ? b.mensaje.trim()  : '';
  const telefono = typeof b.telefono === 'string' ? b.telefono.trim() : '';

  if (nombre.length < 2)    return { ok: false, error: 'El nombre debe tener al menos 2 caracteres.' };
  if (!isValidEmail(email)) return { ok: false, error: 'El correo electrónico no es válido.' };
  if (mensaje.length < 10)  return { ok: false, error: 'El mensaje debe tener al menos 10 caracteres.' };

  return { ok: true, data: { nombre, email, telefono, mensaje } };
}

// ── Handler POST ──────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // 1. Parsear JSON
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ error: 'El cuerpo de la solicitud no es JSON válido.' }, 400);
  }

  // 2. Validar
  const result = validate(rawBody);
  if (!result.ok) return json({ error: result.error }, 422);

  const { nombre, email, telefono, mensaje } = result.data;

  // 3. Insertar en la base de datos
  try {
    await sql`
      INSERT INTO contactos (nombre, email, telefono, mensaje)
      VALUES (${nombre}, ${email}, ${telefono || null}, ${mensaje})
    `;
  } catch (err) {
    console.error('[api/contact] Error al insertar en Postgres:', err);
    return json({ error: 'Error interno del servidor. Por favor intenta más tarde.' }, 500);
  }

  // 4. Éxito
  return json({ ok: true, message: 'Contacto guardado correctamente.' }, 200);
};

// Rechazar métodos no permitidos
export const ALL: APIRoute = ({ request }) =>
  json({ error: `Método ${request.method} no permitido.` }, 405);

// ── Helper ────────────────────────────────────────────────────────────────────

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
