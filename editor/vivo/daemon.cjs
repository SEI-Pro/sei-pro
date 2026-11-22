/**
 * Sobe o Chrome for Testing com a extensao de `dist/` e fica vivo na porta 9444.
 * Variaveis: SPRO_CFT (executavel do Chrome for Testing, obrigatoria), SPRO_PERFIL (pasta do perfil; o login do SEI
 * sobrevive entre subidas). O user-agent e de um Chrome comum: o SP treinamento responde "404 Not Found" ao do
 * "Chrome for Testing". NAO usar `uninstallExtension` com abas anexadas (derruba o Chrome): para carregar codigo novo use
 * `node vivo/preparar.cjs reinstalar` (installExtension com o mesmo id).
 * Rode em segundo plano:  SPRO_CFT=... SPRO_PERFIL=... nohup node vivo/daemon.cjs > /tmp/spro-daemon.log 2>&1 &
 */
const { puppeteer, DIST, PORTA } = require('./lib.cjs');

const CHROME = process.env.SPRO_CFT;
const PERFIL = process.env.SPRO_PERFIL;
if (!CHROME || !PERFIL) {
  console.error('Defina SPRO_CFT (executavel do Chrome for Testing) e SPRO_PERFIL (pasta do perfil).');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    pipe: true,
    enableExtensions: true,
    ignoreDefaultArgs: ['--enable-automation'],
    userDataDir: PERFIL,
    defaultViewport: null,
    args: [
      `--remote-debugging-port=${PORTA}`,
      '--window-size=1500,1000',
      '--disable-blink-features=AutomationControlled',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36',
    ],
  });
  console.log('extensao', await browser.installExtension(DIST));
  const [aba] = await browser.pages();
  await aba.goto('https://treinamento.sei.sp.gov.br/sei/', { waitUntil: 'domcontentloaded' }).catch((e) => console.log('goto', e.message));
  console.log(`DAEMON VIVO na ${PORTA}`);
  process.on('SIGTERM', async () => {
    await browser.close();
    process.exit(0);
  });
  await new Promise(() => {});
})();
