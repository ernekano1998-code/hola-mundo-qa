# Tarea S4 — Análisis de selectores de mi test

**Test analizado**: `tests/tarea-s3.spec.ts` + `tests/hola-mundo-qa.spec.ts`
**Sitios**: `playground.calidadsinhumo.com/login` + `saucedemo.com`
**Fecha**: 2026-06-03
**Alumno**: Ernesto Cano

---

## 📊 RESUMEN EJECUTIVO

Analicé 8 selectores de mis dos tests (4 del playground + 4 de SauceDemo). Encontré que **solo 3 selectores tienen estabilidad media-alta** (IDs en SauceDemo), mientras que **5 selectores tienen baja estabilidad** (atributos de tipo genérico y clases genéricas). La mejora más importante: **todos los elementos del playground deberían usar `data-testid`** para máxima estabilidad.

---

## 📋 TABLA DE ANÁLISIS DE SELECTORES

| # | Selector usado | Tipo | Estabilidad (1 a 5) | Por qué le doy esa nota | Propuesta más estable (si actual < 4) |
|---|---|---|---|---|---|
| 1 | `input[type="email"]` | atributo | 3 | Atributo HTML semántico (`type`), pero podría haber múltiples inputs de tipo email en la página si crece. Funciona porque es el único email input en esa página, pero frágil ante cambios. | `[data-testid="login-email"]` (estabilidad 5) - Atributo dedicado a tests |
| 2 | `input[type="password"]` | atributo | 3 | Atributo HTML semántico (`type`), mismo problema que el email: funciona ahora porque es único, pero si agregan otro campo password (ej: "confirmar password") el selector se rompe. | `[data-testid="login-password"]` (estabilidad 5) - Atributo dedicado a tests |
| 3 | `button[type="submit"]` | atributo | 3 | Atributo HTML semántico. Selector genérico que funciona porque es el único botón submit en el formulario. Si el sitio agrega otro formulario con submit, puede fallar. | `[data-testid="login-submit"]` (estabilidad 5) - Atributo dedicado a tests |
| 4 | `text=Has iniciado sesión correctamente.` | jerarquía/texto | 2 | Selector por texto visible. MUY frágil: si cambian la redacción (ej: "Inicio de sesión exitoso"), el test falla. Además, dependiente del idioma. | `[data-testid="success-message"]` (estabilidad 5) - O al menos usar `.success-message` si existe esa clase |
| 5 | `#user-name` | ID | 4 | ID semántico y estable en SauceDemo. Es robusto porque el ID es descriptivo (`user-name`, no `input-xyz123`). Le doy 4 y no 5 porque no es un `data-testid` dedicado a tests. | `[data-testid="username"]` sería ideal, pero como es un sitio demo de terceros, `#user-name` es suficiente (no aplica mejora real) |
| 6 | `#password` | ID | 4 | ID semántico y estable. Mismo caso que `#user-name`: es un ID descriptivo que no debería cambiar. SauceDemo tiene IDs estables porque es un sitio de práctica para QA. | `[data-testid="password"]` sería ideal, pero `#password` ya es bastante estable (no aplica mejora real) |
| 7 | `#login-button` | ID | 4 | ID semántico y estable. SauceDemo usa IDs consistentes en todos sus elementos. Es un buen ejemplo de sitio "QA-friendly". | `[data-testid="login-button"]` sería la perfección, pero `#login-button` ya es muy bueno (no aplica mejora real) |
| 8 | `.title` | clase | 2 | Clase genérica. Muy frágil porque `.title` puede aparecer en múltiples lugares de la aplicación (títulos de secciones, productos, etc). Funciona ahora por casualidad pero puede romperse fácilmente. | `[data-testid="products-title"]` (estabilidad 5) - O mejor aún: `h1:has-text("Products")` combina jerarquía + texto (estabilidad 3.5) |

---

## 🎯 ANÁLISIS POR SITIO

### Playground (Calidad Sin Humo)
**Selectores analizados**: 4
**Estabilidad promedio**: 2.75 / 5 ⚠️

**Diagnóstico**:
El sitio **NO usa `data-testid`** en ningún elemento, lo cual es problemático para tests automatizados. Todos los selectores dependen de atributos HTML genéricos (`type="email"`, `type="submit"`) que funcionan ahora pero son frágiles ante crecimiento del sitio.

**Recomendación**:
Si tuviera acceso al código fuente del playground, agregaría `data-testid` a todos los elementos interactivos:
- `<input type="email" data-testid="login-email">`
- `<input type="password" data-testid="login-password">`
- `<button type="submit" data-testid="login-submit">`
- Mensaje de éxito: `<div data-testid="success-message">`

---

### SauceDemo
**Selectores analizados**: 4
**Estabilidad promedio**: 3.5 / 5 ✅

**Diagnóstico**:
SauceDemo es un sitio **QA-friendly** por diseño. Usa IDs semánticos y estables (`#user-name`, `#password`, `#login-button`) que son robustos. El único selector débil es `.title` (clase genérica).

**Observación importante**:
SauceDemo demuestra que **IDs bien pensados** (descriptivos, no dinámicos) son casi tan buenos como `data-testid`. Es un ejemplo de cómo debería ser un sitio pensado para QA Automation.

---

## 📖 LO QUE APRENDÍ

### 1. El Ranking de Estabilidad (de más estable a más frágil)

| Puesto | Tipo de Selector | Ejemplo | Estabilidad | Cuándo se rompe |
|--------|------------------|---------|-------------|-----------------|
| **1º** 🥇 | `data-testid` | `[data-testid="login-email"]` | 5/5 | Solo si el dev lo cambia intencionalmente (casi nunca) |
| **2º** 🥈 | ID semántico | `#user-name`, `#login-button` | 4/5 | Si hay refactor del HTML o cambio de naming convention |
| **3º** 🥉 | Atributos semánticos | `[type="email"]`, `[name="username"]` | 3/5 | Si agregan más elementos del mismo tipo o cambian atributos |
| **4º** | Clase específica + atributo | `.login-form input[name="email"]` | 2.5/5 | Si cambian clases CSS en un rediseño |
| **5º** 💥 | Jerarquía / Texto / Clase genérica | `.title`, `text=...`, `nth-child(2)` | 1-2/5 | Muy frágil: cualquier cambio de estructura, texto o diseño |

### 2. La Frase Clave de S3

> **"Si entiendes el HTML, eliges el selector. Si no, la IA elige por ti."**

Antes de esta tarea, yo le pedía a la IA que generara selectores y los usaba sin pensar. Ahora entiendo que:
- La IA **propone** selectores basándose en lo que ve en el HTML
- **YO debo validar** si ese selector es estable o frágil
- **YO decido** cuál usar basándome en el ranking de estabilidad

La IA es mi **copilot**, no mi autopilot. El cerebro QA soy yo.

### 3. Diferencia entre "Funciona Ahora" vs "Funciona Siempre"

**ANTES (pensamiento QA manual)**:
- "Este test pasa en verde → el selector está bien ✅"

**AHORA (pensamiento QA Automation)**:
- "Este test pasa en verde → pero ¿por cuánto tiempo?"
- "¿Qué tan probable es que este selector se rompa si el dev hace cambios?"
- "¿Es este el selector MÁS estable disponible en el HTML?"

**Ejemplo real de mi código**:
```typescript
// LO QUE TENGO (funciona ahora):
await page.fill('input[type="email"]', 'ana.garcia@ejemplo.com');

// LO QUE DEBERÍA TENER (funciona siempre):
await page.fill('[data-testid="login-email"]', 'ana.garcia@ejemplo.com');
```

Ambos funcionan HOY. Pero si mañana agregan un campo "email de recuperación", el primero se rompe. El segundo no.

### 4. El Rol de DevTools (F12)

Aprendí que **antes de escribir un selector**, debo:
1. Abrir DevTools (F12)
2. Inspeccionar el elemento (clic derecho → Inspeccionar)
3. Mirar QUÉ ATRIBUTOS tiene disponibles
4. Elegir el más estable según el ranking
5. **Solo entonces** escribir el código Playwright

**Antes**: escribía código a ciegas confiando en la IA
**Ahora**: inspecciono el HTML primero, luego valido lo que la IA propone

---

## ❓ MI PREGUNTA PARA S4

**Selector #4 del playground** (`text=Has iniciado sesión correctamente.`):

En la tabla propuse usar `[data-testid="success-message"]`, pero ese atributo **NO existe en el HTML real** del playground (lo verifiqué inspeccionando).

**Mi duda**: ¿Cómo debería agarrar ese mensaje de éxito si:
- No tiene `data-testid`
- No tiene ID
- No tiene clase específica
- Solo tiene el texto visible

**Opciones que se me ocurren**:
1. Usar `text=Has iniciado sesión correctamente.` (lo que tengo ahora, pero frágil)
2. Combinar jerarquía + texto: `div > p:has-text("iniciado sesión")` (¿es más estable?)
3. Pedirle al instructor que agregue `data-testid` al elemento (pero es un sitio de terceros)

**¿Cuál es el approach correcto cuando un elemento NO tiene atributos buenos?**

---

## 🔄 PRÓXIMOS PASOS (Post-S4)

Después de S4, planeo **reescribir mis tests** con selectores más robustos:

### Test del Playground (`tarea-s3.spec.ts`)
```typescript
// ACTUAL (estabilidad 2.75/5):
await page.fill('input[type="email"]', 'ana.garcia@ejemplo.com');
await page.fill('input[type="password"]', 'Segura2026!');
await page.click('button[type="submit"]');
await expect(page.locator('text=Has iniciado sesión correctamente.')).toBeVisible();

// PROPUESTO (estabilidad 4.5/5):
// Opción A: Si agregan data-testid
await page.fill('[data-testid="login-email"]', 'ana.garcia@ejemplo.com');
await page.fill('[data-testid="login-password"]', 'Segura2026!');
await page.click('[data-testid="login-submit"]');
await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

// Opción B: Mejores selectores disponibles ahora
await page.fill('form input[type="email"]', 'ana.garcia@ejemplo.com');  // Más específico
await page.fill('form input[type="password"]', 'Segura2026!');  // Más específico
await page.click('form button[type="submit"]');  // Más específico
await expect(page.getByText(/iniciado sesión correctamente/i)).toBeVisible();  // Regex case-insensitive
```

### Test de SauceDemo (`hola-mundo-qa.spec.ts`)
```typescript
// ACTUAL (estabilidad 3.5/5):
await page.fill('#user-name', 'standard_user');
await page.fill('#password', 'secret_sauce');
await page.click('#login-button');
await expect(page.locator('.title')).toHaveText('Products');

// PROPUESTO (estabilidad 4.25/5):
await page.fill('#user-name', 'standard_user');  // Ya está bien ✅
await page.fill('#password', 'secret_sauce');    // Ya está bien ✅
await page.click('#login-button');               // Ya está bien ✅
// MEJORAR SOLO EL ÚLTIMO:
await expect(page.locator('[data-test="title"]')).toHaveText('Products');  // Si existe data-test
// O combinar con selector más específico:
await expect(page.locator('.header_secondary_container .title')).toHaveText('Products');
```

---

## 📚 RECURSOS QUE CONSULTÉ

1. **Anexo C-S3** - Prompt-template para extraer selectores del HTML
2. **Presentación S3** - Ranking de estabilidad y conceptos de DOM
3. **DevTools del navegador** - Inspeccioné ambos sitios para validar atributos disponibles
4. **Documentación de Playwright** - Para entender diferencias entre `locator()`, `getByText()`, etc.

---

## 🎯 CONCLUSIÓN

**Antes de S3**: Yo generaba tests con IA y confiaba en que los selectores funcionaran.

**Después de S3**: Entiendo que un selector que "funciona ahora" no necesariamente "funcionará siempre". Mi trabajo como QA Automation es **elegir el selector más estable disponible**, no solo el primero que funciona.

**El skill que me llevo**: Inspeccionar HTML → Identificar atributos → Clasificar por estabilidad → Elegir el mejor → Validar lo que la IA propone.

**Meta para S4**: Aprender a usar **CSS avanzado** (pseudoclases, combinadores) para casos donde no hay `data-testid` ni IDs estables.

---

**Archivo completado el 3 de junio de 2026**
**Tiempo invertido en análisis**: ~45 minutos
**Selectores clasificados**: 8 (mínimo 5 cumplido ✅)
**Preguntas para S4**: 1 (selector de texto sin atributos buenos)

---

🔥 **Ernesto el duro** - Curso TesteandoYa 2026
