# Tarea S5 - Selectores Comparados con IA como Copiloto

**Alumno:** Ernesto Cano
**Fecha:** 15/06/2026
**Playground:** https://playground.calidadsinhumo.com/login

---

## Desafío 1: Link "Login" del menú de navegación

### HTML del elemento
```html
<a href="/login" class="nav-link text-gray-700 hover:text-blue-600 transition-colors">Login</a>
```

### Mi propuesta (Fase 1)
```typescript
page.getByRole('link', { name: 'Login' })
```

### Lo que propuso Claude (Fase 2)

1. **`page.getByRole('link', { name: 'Login' })`** — Selector semántico por rol ARIA y texto visible. El más estable porque usa el contrato de accesibilidad del navegador. No se rompe si cambian las clases CSS o la estructura del DOM.

2. **`page.getByText('Login', { exact: true })`** — Alternativa semántica que agarra por texto exacto. Más frágil que `getByRole` porque si hay otro elemento con "Login" (ej: un botón "Login" en el formulario), podría fallar sin el filtro adicional.

3. **`page.locator('a[href="/login"]')`** — Selector CSS por atributo href. Estable mientras la ruta no cambie, pero menos expresivo que los semánticos y vulnerable a refactorizaciones de routing.

### ¿Qué propuso Claude que NO se me había ocurrido?
El uso de `{ exact: true }` en `getByText` para evitar coincidencias parciales — importante cuando hay palabras similares como "Login" y "Logout".

### Mi elección final + por qué (Fase 3)
**`page.getByRole('link', { name: 'Login' })`** — Es el selector más robusto: usa el rol accesible del elemento y su etiqueta visible. Si mañana agregan clases Tailwind, cambian el href, o reestructuran el DOM, este selector sigue funcionando mientras el link sea accesible y diga "Login".

---

## Desafío 2: Caja de credenciales demo

### HTML del elemento
```html
<div class="border border-blue-400 bg-blue-50 p-4 rounded-lg mb-4">
  <p class="text-sm text-gray-700 mb-2 font-semibold">Credenciales de prueba:</p>
  <div class="space-y-1">
    <p class="text-sm"><strong>Email:</strong> ana.garcia@ejemplo.com</p>
    <p class="text-sm"><strong>Contraseña:</strong> Segura2026!</p>
  </div>
</div>
```

### Mi propuesta (Fase 1)
```typescript
page.locator('.border-blue-400').filter({ hasText: 'Credenciales de prueba' })
```

### Lo que propuso Claude (Fase 2)

1. **`page.getByText('Credenciales de prueba:')`** — Selector semántico directo por el texto del encabezado. El más simple y estable. Si la caja existe en la UI, este texto es único y no cambiará porque es contenido de negocio.

2. **`page.locator('div:has-text("ana.garcia@ejemplo.com")')`** — Selector por contenido interno usando `:has-text()`. Útil si el título cambia pero las credenciales no, aunque menos legible.

3. **`page.locator('.bg-blue-50.border-blue-400')`** — Selector CSS por clases de estilo. MUY FRÁGIL: si el diseñador cambia el color del borde a `border-blue-500` o el fondo a `bg-sky-50`, el test se rompe inmediatamente.

### ¿Qué propuso Claude que NO se me había ocurrido?
Usar `:has-text()` para agarrar un contenedor por su contenido interno sin depender de la estructura exacta del DOM — útil cuando el texto hijo es más estable que el texto directo del contenedor.

### Mi elección final + por qué (Fase 3)
**`page.getByText('Credenciales de prueba:')`** — Es un `<div>` sin rol semántico, así que `getByRole` no aplica. Pero `getByText` sigue siendo semántico porque busca por contenido visible. El texto "Credenciales de prueba:" es único en la página y no cambiará porque es una etiqueta de usuario. Mucho más estable que depender de clases CSS que cambiarán con cada diseño.

---

## Desafío 3: Mensaje "Has iniciado sesión correctamente."

### HTML del elemento
```html
<div role="alert" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
  <p class="font-medium">Has iniciado sesión correctamente.</p>
</div>
```

### Mi propuesta (Fase 1)
```typescript
page.getByText('Has iniciado sesión correctamente.')
```

### Lo que propuso Claude (Fase 2)

1. **`page.getByRole('alert').filter({ hasText: 'Has iniciado sesión correctamente.' })`** — Selector semántico PERFECTO para este caso. El elemento tiene `role="alert"`, que es el contrato ARIA para notificaciones. Combinar el rol con el texto hace que sea imposible de romper accidentalmente.

2. **`page.getByText('Has iniciado sesión correctamente.', { exact: true })`** — Alternativa directa por texto exacto. Funciona bien si el mensaje es único, pero sin el filtro por `role="alert"` podría agarrar el mismo texto si aparece en otro lugar (ej: en un modal de ayuda).

3. **`page.locator('.bg-green-100:has-text("Has iniciado sesión correctamente.")')`** — Selector CSS híbrido. Frágil porque depende de la clase de color verde, que podría cambiar si el diseñador decide usar `bg-emerald-100` o cambiar el sistema de diseño.

### ¿Qué propuso Claude que NO se me había ocurrido?
Usar **`getByRole('alert')`** para aprovechar el atributo `role="alert"` del HTML — no sabía que los mensajes de éxito/error suelen tener roles ARIA específicos y que Playwright puede buscarlos directamente.

### Mi elección final + por qué (Fase 3)
**`page.getByRole('alert').filter({ hasText: 'Has iniciado sesión correctamente.' })`** — Esta es la forma CORRECTA de agarrar notificaciones en Playwright. El `role="alert"` garantiza que estamos buscando un mensaje de sistema (no texto común), y el filtro por texto nos da especificidad sin depender de clases CSS. Si cambian los colores, el padding, o mueven el elemento a otro lugar del DOM, este selector sigue funcionando porque el contrato de accesibilidad no cambia.

---

## Reflexión Final

**Lo más importante que aprendí:**
Los selectores semánticos (getByRole, getByLabel, getByText) no solo son "mejores prácticas" — son **seguros contra refactorizaciones**. Un selector CSS como `.bg-blue-50` se rompe la primera vez que alguien cambia el diseño. Pero `getByRole('alert')` o `getByText('Credenciales de prueba')` sobreviven a cambios de CSS, reestructuraciones del DOM, y hasta migraciones de frameworks porque están atados al **contenido y la accesibilidad**, no a la implementación.

**Observación clave:**
Claude propuso usar `.filter({ hasText: '...' })` para combinar selectores por rol con texto específico — no sabía que Playwright permite encadenar métodos así. Esto es clave para desafíos como el Mensaje de éxito donde `getByRole('alert')` solo no alcanza (podría haber múltiples alertas), pero combinarlo con `.filter()` lo hace quirúrgicamente preciso.
