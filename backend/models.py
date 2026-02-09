# Este archivo define correctamente la estructura de los datos mediante Pydantic.
# Pydantic valida automáticamente esos datos que llegan a la API
# y estos convierte los modelos en diccionarios que estaran listos para MongoDB.

from pydantic import BaseModel, Field

class Cliente(BaseModel):
    # El "id" en el modelo (aunque se guarda como "_id" en MongoDB)
    id: str = Field(alias="_id")
    # El Nombre del cliente
    nombre: str
    # El Email del cliente
    email: str

    class Config:
        # Nos permite usar ya sea, tanto "id" como "_id" al convertir los datos
        populate_by_name = True

class ClienteCreate(BaseModel):
    # Este es el ID que el usuario pone manualmente (Este se guarda como "_id")
    id: str = Field(alias="_id")
    # El Nombre del cliente
    nombre: str
    # El Email del cliente
    email: str
