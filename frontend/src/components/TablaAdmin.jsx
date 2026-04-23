import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";

function TablaAdmin({ tabla }) {

  const [datos, setDatos] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [formData, setFormData] = useState({});
  const [modoEditar, setModoEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const columnas = datos.length > 0 ? Object.keys(datos[0]) : Object.keys(formData);
  const [relaciones, setRelaciones] = useState({});

  console.log("URL FINAL:", `https://tienda-ropa-ia-production.up.railway.app/${tabla}`);

  const cargarDatos = async () => {
    const res = await api.get(`/api/${tabla}`);
    console.log("Tabla actual:", tabla);
    setDatos(res.data);
  };

  const cargarRelaciones = async (datosTabla) => {

    if (!datosTabla[0]) return;

    const columnas = Object.keys(datosTabla[0]);

    const fks = columnas.filter(c => c.startsWith("id_") && c !== columnas[0]);

    const nuevasRelaciones = {};

    for (const fk of fks) {

        const tablaRelacionada = fk.replace("id_", "");

        try {

        const res = await api.get(`/${tablaRelacionada}`);

        const mapa = {};

        res.data.forEach(r => {

            const id = r[Object.keys(r)[0]];
            const nombre = r.nombre || r.descripcion || id;

            mapa[id] = nombre;

        });

        nuevasRelaciones[fk] = mapa;

        } catch (err) {

        console.log("No se pudo cargar FK:", fk);

        }

    }

    setRelaciones(nuevasRelaciones);

    };

  const eliminar = async (id) => {
  await api.delete(`/${tabla}/${id}`);
  cargarDatos();
  };

  const crear = async () => {
  await api.post(`/${tabla}`, formData);

  setModoCrear(false);
  setFormData({});

  cargarDatos();
};
  const actualizar = async () => {

  const pk = Object.keys(formData)[0];

  const datosActualizar = { ...formData };

  delete datosActualizar[pk];

  console.log("ID:", idEditar);
  console.log("Datos enviados:", datosActualizar);

  await api.put(`/${tabla}/${idEditar}`, datosActualizar);

  setModoEditar(false);
  setFormData({});
  setIdEditar(null);

  cargarDatos();
};

  

  useEffect(() => {

  const cargar = async () => {

    const res = await api.get(`/api/${tabla}`);

    setDatos(res.data);

    cargarRelaciones(res.data);

  };

  cargar();

}, [tabla]);

  return (
    <div>
      <h2>{tabla}</h2>
      <button className="btn-crear" onClick={() => setModoCrear(true)}>
            Crear
      </button>
      {modoCrear && (
        <div>

          <h3>Crear registro</h3>

          {columnas.map((col) => {

            if (col === Object.keys(datos[0])[0]) return null;

            return (
              <div key={col}>

                <label>{col}</label>

                <input
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [col]: e.target.value
                    })
                  }
                />

              </div>
            );
          })}

          <button onClick={crear}>Guardar</button>

        </div>
      )}

      {modoEditar && Object.keys(formData).length > 0 && (
        <div>

          <h3>Editar registro</h3>

          {Object.keys(formData).map((col) => {

            if (col === Object.keys(formData)[0]) return null;

            return (
              <div key={col}>

                <label>{col}</label>

                <input
                  value={formData[col] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [col]: e.target.value
                    })
                  }
                />

              </div>
            );
          })}

          <button onClick={actualizar}>Actualizar</button>

        </div>
      )}
        <div className="tabla-container">
            <table className="tabla">
                <thead>
                <tr>
                    {datos[0] &&
                    Object.keys(datos[0]).map((col) => (
                        <th key={col}>{col}</th>
                    ))
                    }
                    <th>Acciones</th>
                </tr>
                </thead>

                <tbody>
                {datos.map((fila, i) => (
                    <tr key={fila[Object.keys(fila)[0]]}>
                    {Object.entries(fila).map(([col, valor], j) => (

                        <td key={j}>

                            {relaciones[col] ? relaciones[col][valor] || valor : valor}

                        </td>

                        ))}
                    
                    <td>
                        <button className="btn-editar"
                        onClick={() => {
                            setModoEditar(true);
                            setFormData({...fila});
                            setIdEditar(fila[Object.keys(fila)[0]]);
                        }}
                        >
                        editar
                        </button>

                        <button className="btn-eliminar" 
                        onClick={() => eliminar(fila[Object.keys(fila)[0]])}>
                        eliminar
                        </button>

                    </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        
    </div>
  );
}

export default TablaAdmin;