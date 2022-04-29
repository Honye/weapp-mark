const path = require('path');
const ci = require('miniprogram-ci');

const paths = (() => {
  const root = path.resolve(__dirname, '../');
  const privateKey = path.join(root, 'private.key');
  const pkgJson = path.join(root, 'package.json');
  const miniprogram = path.join(root, 'miniprogram/');
  const zip = path.join(root, 'dist/miniprogram.imark.zip');

  return { root, privateKey, pkgJson, miniprogram, zip };
})();

const package = require(paths.pkgJson);

const project = new ci.Project({
  appid: 'wx5363d9bd45509430',
  type: "miniProgram",
  projectPath: paths.root,
  privateKeyPath: paths.privateKey,
  ignores: ['node_modules/**/*'],
});

/**
 * @type {import('miniprogram-ci/dist/@types/types').MiniProgramCI.ICompileSettings}
 */
const settings = {
  es6: true,
  es7: true,
  minify: true,
  autoPrefixWXSS: true,
};

function packNpm () {
  return ci.packNpmManually({
    packageJsonPath: paths.pkgJson,
    miniprogramNpmDistDir: paths.miniprogram,
  });
}

function preview () {
  return ci.preview({
    project,
    setting: settings,
    desc: 'CI Preview',
    qrcodeFormat: 'terminal',
  });
}

function upload () {
  return ci.upload({
    project,
    version: package.version,
    setting: settings,
    robot: 1,
    desc: 'Uploaded via CI',
  });
}

function outputZip () {
  return ci.getCompiledResult({
    project,
    version: package.version,
    setting: settings,
    desc: 'CI compiled zip',
  }, paths.zip);
}

(async () => {
  await packNpm();
  await upload();
})();
