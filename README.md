1. Access Token

Definición / Concepto comunitario:

- Es el token de acceso que normalmente contiene información mínima sobre el usuario.
  Ejemplo: sub, userId, roles, permisos basicos.
- Es corto en el tiempo de vida (ej: 5–15 minutos).
- Se envía en cada request al backend (ej: en el header Authorization: Bearer <token>).
- El backend lo valida (firmado con tu secret o publicKey) y si es válido, el usuario puede acceder a la ruta.

Uso típico:

- Autenticación en middlewares (authMiddleware) → verifica que el usuario esté logueado.
- Autorización básica (ej: verificar rol de admin).

👉 En tu proyecto, este token lo usarías en todas las rutas que requieran que el usuario esté autenticado.

2. Context Token (Ya no se usa, ahora se usa alguna tecnologia de cache)

- No es un estándar.
- Es un token de contexto para reducir llamadas repetitivas a la DB.
  Ejemplo: guardar en él monthlyTrackingId, ppmId, friendsId o cualquier id frecuente.

Equivalentes en la comunidad:

No existe como tal un idToken para esto. El ID Token en Firebase / OAuth significa otra cosa: es un JWT que contiene la identidad del usuario y algunos claims (ej: email verificado, nombre, etc.), pero no es para optimizar llamadas de DB.

Lo más cercano es un "caching strategy":

- Guardar en memoria (Redis, in-memory cache) datos que pedís seguido.
- O en el propio JWT agregar un payload con estos ids para evitar queries repetitivas:

{
"userId": "abc123",
"monthlyTrackingId": "mtr_987",
"ppmId": "ppm_456",
"friendsId": "fr_321",
"exp": 1735737600
}

⚠️ Cuidado:
Si pones datos en el context_token, tenés que asegurarte de que no crezcan demasiado y que no sean sensibles. Los JWT no son editables por el cliente (si firmás bien), pero aumentan de tamaño.

👉 Entonces, el context_token sería una especie de mini-cache embebido en el JWT, que ahorra lecturas de la base. Eso existe como estrategia, pero no como un estándar bajo ese nombre.

3. Refresh Token

Definición / Concepto comunitario:

- Es un token de larga duración (ej: semanas o meses) que sirve para obtener un nuevo access_token cuando éste expira.
- Nunca viaja en headers comunes, se guarda en una cookie httpOnly o storage más seguro.
- Se usa en un endpoint especial (/refresh) para emitir nuevos access_token.

Sobre el context_token:

- No es necesario tener un refresh para el context_token.
- El context_token puede expirar al mismo tiempo que el access_token (o incluso compartirse).
- Si el context_token expira, simplemente lo regenerás al volver a generar el access_token (porque en ese momento podés volver a traer los ids de la DB).

👉 Por lo tanto: solo el access_token necesita refresh con el refresh_token. El context_token no lo necesita.

📌Redis: (Investigar otra tecnologia, supuestamente Redis no es tan "codigo abierto")

- Redis = base de datos en memoria.
- Está diseñada para velocidad, no para almacenamiento permanente.
- Funciona como un diccionario gigante (clave → valor).
- Soporta estructuras de datos (strings, hashes, listas, sets, etc.).

Lo importante: Redis no reemplaza a MongoDB, sino que actúa como cache para evitar consultas repetitivas a la base principal.

🔄 Ejemplo de proceso con Redis en tu arquitectura:

Imaginemos que tu cliente (React, mobile, etc.) quiere mostrar la pantalla de progreso mensual.

🔹 Sin Redis:

1. Cliente → hace request GET /progress con access_token.
2. Servidor valida access_token.
3. Servidor va a MongoDB → busca el monthlyTrackingId.
4. Servidor va a otra colección en MongoDB → busca el progreso del mes.
5. Devuelve la respuesta.

👉 Esto está bien, pero si cientos de usuarios piden su progreso todo el tiempo, MongoDB recibe demasiadas consultas repetitivas.

🔹 Con Redis:

1. Cliente → hace request GET /progress.
2. Servidor valida access_token.
3. Servidor busca en Redis si ya tiene en cache el progreso del usuario.
4. Si está en Redis → devuelve la info directo (sin ir a Mongo).
5. Si no está en Redis → consulta a MongoDB, guarda la respuesta en Redis y luego devuelve al cliente.

👉 Redis actúa como una capa intermedia súper rápida que evita consultas repetitivas a Mongo.

TODO: NECESITO TECNOLOGIA PARA GUARADAR EN CACHE. Redis, probablemente es pago a futuro.
