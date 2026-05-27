import { test, expect } from '@playwright/test';

test('login exitoso', async ({ page }) => {
  // Abrir la URL del playground
  await page.goto('https://playground.calidadsinhumo.com/login');

  // Completar el campo de email
  await page.fill('input[type="email"]', 'ana.garcia@ejemplo.com');

  // Completar el campo de contraseña
  await page.fill('input[type="password"]', 'Segura2026!');

  // Hacer clic en el botón de iniciar sesión
  await page.click('button[type="submit"]');

  // Verificar que aparece el texto "Has iniciado sesión correctamente."
  await expect(page.locator('text=Has iniciado sesión correctamente.')).toBeVisible();
});
