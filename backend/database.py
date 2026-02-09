from motor.motor_asyncio import AsyncIOMotorClient

# Esta es la Conexión al servidor MongoDB local
client = AsyncIOMotorClient("mongodb://localhost:27017")

# Esta es la Selección de la base de datos ("mini_erp")
db = client.mini_erp

# Estas son las Colecciones de MongoDB
clientes_collection = db.Clientes
facturas_collection = db.Facturas

# Esto Convierte el campo _id a string (para que FastAPI pueda devolverlo sin errores)
def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Esto Devuelve todos los clientes que esten en la colección
async def get_clientes():
    clientes = await clientes_collection.find().to_list(1000)
    return [fix_id(c) for c in clientes]

# Esto permite devolver un cliente concreto por su ID
async def get_cliente(id: str):
    cliente = await clientes_collection.find_one({"_id": id})
    return fix_id(cliente)

# Aqui podemos insertar un cliente en la base de datos (poniendo el ID manualmente)
async def create_cliente(cliente: dict):
    await clientes_collection.insert_one(cliente)
    return fix_id(cliente)

# Aqui, eliminamos un cliente por via de su ID y esto devuelve True si se elimino bien
async def delete_cliente(id: str):
    result = await clientes_collection.delete_one({"_id": id})
    return result.deleted_count > 0

# Aqui devolvemos todas las facturas que esten asociadas a un cliente
async def get_facturas_cliente(cliente_id: str):
    facturas = await facturas_collection.find({"cliente_id": cliente_id}).to_list(1000)
    return [fix_id(f) for f in facturas]

# Aqui calculamos el total que ha facturado un cliente (sumando sus facturas)
async def get_total_cliente(cliente_id: str):
    facturas = await get_facturas_cliente(cliente_id)
    return sum(f["importe"] for f in facturas)
