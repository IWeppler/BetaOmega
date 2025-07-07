import { PORT } from "./config/envs";
import app from "./server";
import "reflect-metadata"
import { AppDataSource } from "./config/dataSource";

const initialize = async () => {
    console.log("Initializing server");
    await AppDataSource.initialize()
    .then(async () => {
    console.log("Base de datos conectada correctamente");

    app.listen(PORT, () => {
        console.log(`🚀 Server corriendo en puerto ${PORT}`);
      });
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

}

initialize();

