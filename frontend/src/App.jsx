import { useEffect, useState } from "react";

function App() {
  //Esta es la Lista de clientes, esta se carga desde el backend al iniciar la aplicación y cada vez que se crea o borra un cliente 
  // o se actualiza la lista volvemos a cargar para mostrar los cambios
  const [clientes, setClientes] = useState([]);

  //Esto es para los Clientes que esten seleccionados (para ver sus facturas)
  const [clienteSel, setClienteSel] = useState(null);

  // Estas son las Facturas del cliente que esta seleccionado
  const [facturas, setFacturas] = useState([]);

  // El Total facturado por el cliente que esta seleccionado
  const [total, setTotal] = useState(0);

  // El Total que esta mostrado al pasarle el raton por encima del cliente
  const [hoverTotal, setHoverTotal] = useState(null);

  // Estos son Los Campos del formulario para crear un nuevo cliente
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  // Cargar todos los clientes desde el backend
  const cargarClientes = () => {
    fetch("http://127.0.0.1:8000/clientes")
      .then(res => res.json())
      .then(data => setClientes(data));
  };

  // Cargar clientes al iniciar la aplicación
  useEffect(() => {
    cargarClientes();
  }, []);

  // Seleccionar un cliente y cargar sus facturas + total
  const seleccionar = (cliente) => {
    setClienteSel(cliente);

    // Cargar facturas del cliente
    fetch(`http://127.0.0.1:8000/clientes/${cliente._id}/facturas`)
      .then(res => res.json())
      .then(data => setFacturas(data));

    // Cargar total del cliente
    fetch(`http://127.0.0.1:8000/clientes/${cliente._id}/total`)
      .then(res => res.json())
      .then(data => setTotal(data.total));
  };

  // Crear un nuevo cliente enviando ID, nombre y email
  const crearCliente = () => {
    fetch("http://127.0.0.1:8000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANTE: enviamos _id para que Mongo NO genere ObjectId
      body: JSON.stringify({ _id: id, nombre, email })
    })
      .then(() => {
        // Limpiar formulario
        setId("");
        setNombre("");
        setEmail("");
        // Recargar lista
        cargarClientes();
      });
  };

  // Borrar un cliente por su ID
  const borrarCliente = (id) => {
    fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "DELETE"
    }).then(() => {
      // Actualizar lista y limpiar selección
      cargarClientes();
      setClienteSel(null);
      setFacturas([]);
      setTotal(0);
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mini ERP</h1>

      {/* FORMULARIO PARA CREAR CLIENTE */}
      <h2>Insertar Cliente</h2>

      {/* Campo ID manual */}
      <input
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      {/* Campo nombre */}
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Campo email */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Botón crear */}
      <button onClick={crearCliente}>Crear</button>

      {/* LISTA DE CLIENTES */}
      <h2>Clientes</h2>

      {clientes.map(c => (
        <div
          key={c._id}
          // Seleccionar cliente al hacer clic
          onClick={() => seleccionar(c)}
          // Mostrar total al pasar el ratón
          onMouseEnter={() => {
            fetch(`http://127.0.0.1:8000/clientes/${c._id}/total`)
              .then(res => res.json())
              .then(data => setHoverTotal(data.total));
          }}
          onMouseLeave={() => setHoverTotal(null)}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          {/* Mostrar ID, nombre y email */}
          ID: {c._id} — {c.nombre} — {c.email}

          {/* Total mostrado al pasar el ratón */}
          {hoverTotal !== null && (
            <span style={{ marginLeft: "10px", color: "green" }}>
              Total: {hoverTotal}€
            </span>
          )}

          {/* Botón eliminar cliente */}
          <button
            style={{ marginLeft: "10px" }}
            onClick={(e) => {
              e.stopPropagation(); // Evita seleccionar el cliente al borrar
              borrarCliente(c._id);
            }}
          >
            Eliminar
          </button>
        </div>
      ))}

      {/* FACTURAS DEL CLIENTE SELECCIONADO */}
      {clienteSel && (
        <>
          <h2>Facturas de {clienteSel.nombre}</h2>

          {facturas.map(f => (
            <div key={f._id}>
              <strong>ID:</strong> {f._id} —
              <strong>Concepto:</strong> {f.concepto} —
              <strong>Importe:</strong> {f.importe}€
            </div>
          ))}

          {/* Total del cliente */}
          <h3>Total: {total}€</h3>
        </>
      )}
    </div>
  );
}

export default App;