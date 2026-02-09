from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ClienteCreate
from database import (
    get_clientes, get_cliente, create_cliente,
    delete_cliente, get_facturas_cliente, get_total_cliente
)

# Creamos el FastAPI
app = FastAPI()

# Configuramos el CORS para permitir cualquier solicitud por el frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, DELETE...)
    allow_headers=["*"],  # Permite todos los encabezados
)

# Esta es la ruta que usaremos, para asi, conseguir todos los clientes
@app.get("/clientes")
async def listar_clientes():
    return await get_clientes()

# Esta es la Ruta para cuando queramos poner un nuevo cliente
@app.post("/clientes")
async def insertar_cliente(cliente: ClienteCreate):
    # Se usa by_alias=True para que "_id" sea detectado mas facilmente por MongoDB
    nuevo = await create_cliente(cliente.dict(by_alias=True))
    return nuevo

# Esta es la ruta para borrar un cliente (segun en base a su ID)
@app.delete("/clientes/{id}")
async def borrar_cliente(id: str):
    ok = await delete_cliente(id)
    if ok:
        return {"mensaje": "Cliente eliminado"}
    # Si ese no existe, se muestra un error (404)
    raise HTTPException(404, "Cliente no encontrado")

# Esta es la ruta para ver todas las facturas que sean de un cliente
@app.get("/clientes/{id}/facturas")
async def facturas_cliente(id: str):
    return await get_facturas_cliente(id)

# Esta es la ruta para obtener el total que ha facturado un cliente
@app.get("/clientes/{id}/total")
async def total_cliente(id: str):
    return {"total": await get_total_cliente(id)}
