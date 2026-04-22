import { useState } from "react";
import TablaAdmin from "./components/TablaAdmin";
import "./App.css";

function App() {

  const [tabla, setTabla] = useState("marca");

  const gruposTablas = {

  "Base": [
    "Gender",
    "Rol",
    "Status",
    "Notification_type",
    "payment_method",
    "Category",
    "Brand",
    "Size",
    "Color"
  ],

  "Usuarios": [
    "User",
    "Rol_x_User",
    "User_photo",
    "Notification"
  ],

  "Productos": [
    "Product",
    "Photos_X_product",
    "Product_x_category"
  ],

  "Ventas": [
    "orders",
    "Product_X_order"
  ],

  "Proveedores": [
    "Supplier"
  ]
};

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <h1>Panel Administrador</h1>
          
        </div>

        <div className="tabla-lista">

          {Object.entries(gruposTablas).map(([grupo, tablas]) => (

            <div key={grupo} className="grupo-tablas">

              <h3 className="grupo-titulo">{grupo}</h3>

              {tablas.map((t) => (

                <button
                  key={t}
                  className={`tabla-btn ${tabla === t ? "activa" : ""}`}
                  onClick={() => setTabla(t)}
                >
                  {t}
                </button>

              ))}

            </div>

          ))}

        </div>

      </aside>

      <main className="contenido">

        <div className="header">

          <h1>{tabla}</h1>

        </div>

        <div className="card">

          <TablaAdmin tabla={tabla} />

        </div>

      </main>

    </div>
  );
}

export default App;