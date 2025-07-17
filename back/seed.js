
const { Client } = require('pg');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

// --- Configuración ---
const CONTENT_PATH = path.join(__dirname, '..', 'Books');

async function main() {
  console.log('🌱 Iniciando el script de carga...');
  console.log(`📂 Buscando contenido en: ${CONTENT_PATH}`);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos de Supabase.');

    console.log('🧹 Limpiando tablas antiguas...');
    await client.query(
      'TRUNCATE TABLE "book_content" RESTART IDENTITY CASCADE',
    );
    await client.query('TRUNCATE TABLE "books" RESTART IDENTITY CASCADE');
    console.log('🗑️ Tablas limpiadas.');

    const allItems = await fs.readdir(CONTENT_PATH);
    const bookFolders = [];
    for (const item of allItems) {
      const itemPath = path.join(CONTENT_PATH, item);
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory() && item !== 'public' && item !== 'styles') {
        bookFolders.push(item);
      }
    }
    console.log(`📚 Encontrados ${bookFolders.length} libros para procesar.`);

    for (const bookFolder of bookFolders) {
      const bookPath = path.join(CONTENT_PATH, bookFolder);
      console.log(`\n--- Procesando libro: ${bookFolder} ---`);

      const infoJsonPath = path.join(bookPath, 'info.json');
      const infoJsonContent = await fs.readFile(infoJsonPath, 'utf-8');
      const bookData = JSON.parse(infoJsonContent);

      const coverUrl = bookData.cover_url.substring(
        bookData.cover_url.indexOf('public/'),
      );

      // VERSIÓN FINAL Y CORRECTA: Se inserta el 'slug' y los otros 4 campos.
      const insertBookQuery = `
        INSERT INTO "books" (slug, title, description, cover_url, total_chapters)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const bookResult = await client.query(insertBookQuery, [
        bookData.slug, // Valor para $1
        bookData.title, // Valor para $2
        bookData.description, // Valor para $3
        coverUrl, // Valor para $4
        bookData.total_chapters, // Valor para $5
      ]);
      const bookId = bookResult.rows[0].id;
      console.log(`📘 Libro "${bookData.title}" insertado con ID: ${bookId}`);

      const chapterFiles = (await fs.readdir(bookPath)).filter((file) =>
        file.endsWith('.md'),
      );

      for (const chapterFile of chapterFiles) {
        const chapterPath = path.join(bookPath, chapterFile);
        const chapterContent = await fs.readFile(chapterPath, 'utf-8');

        const chapterNumber = parseInt(chapterFile.split('-')[0]);
        const chapterTitle = chapterFile
          .split('-')
          .slice(1)
          .join(' ')
          .replace('.md', '');

        const insertContentQuery = `
          INSERT INTO "book_content" (book_id, chapter_number, title, md_content)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertContentQuery, [
          bookId,
          chapterNumber,
          chapterTitle,
          chapterContent,
        ]);
        console.log(
          `   📄 Capítulo ${chapterNumber} - "${chapterTitle}" insertado.`,
        );
      }
    }

    console.log('\n✅ ¡Script de carga completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el proceso de carga:', error);
  } finally {
    await client.end();
    console.log('🔌 Desconectado de la base de datos.');
  }
}

main();
