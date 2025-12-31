// front/upload.js
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
// Carga las variables de entorno
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Faltan las variables de entorno SUPABASE_URL o SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function upload() {
  try {
    console.log("Leyendo archivo JSON...");
    // Asegúrate de que el nombre del archivo coincida exactamente
    const rawData = fs.readFileSync("sanzhei_data.json", "utf8");
    const jsonData = JSON.parse(rawData);

    console.log(`Se encontraron ${jsonData.length} sanzheis.`);

    // Preparamos los datos
    const records = jsonData.map((item) => ({
      content: item.text,  // El texto del consejo
      author: "YHWH",      // O "ZANSHEI 1" según prefieras
      // IMPORTANTE: NO enviamos el 'id' (números romanos) 
      // para que Supabase genere 1, 2, 3 automáticamente y no de error de tipo.
    }));

    // Insertar en lotes de 100
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      
      // Asegúrate de que la tabla en Supabase se llame 'sanzhens' (o cámbialo aquí si le pusiste otro nombre)
      const { error } = await supabase.from("sanzhens").insert(chunk);

      if (error) {
        console.error(`Error en el lote ${i}:`, error.message);
      } else {
        console.log(`Insertados ${i + chunk.length} de ${records.length}`);
      }
    }

    console.log("¡Carga completa!");
    
  } catch (err) {
    console.error("Error general:", err.message);
  }
}

upload();